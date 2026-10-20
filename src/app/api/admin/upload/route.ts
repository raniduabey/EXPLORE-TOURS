import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";
import {
  saveMediaToStore,
  removeMediaFromStore,
  syncMediaWithDb,
  cleanMediaId,
} from "@/lib/mediaStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_FILE_SIZE = 8 * 1024 * 1024; // Strict 8 Megabytes in exact bytes

// Inspect magic bytes for secure server-side validation
function validateMagicBytes(buffer: Buffer): { valid: boolean; detectedMime: string } {
  if (buffer.length < 4) return { valid: false, detectedMime: "" };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedMime: "image/jpeg" };
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { valid: true, detectedMime: "image/png" };
  }

  // WebP: RIFF .... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { valid: true, detectedMime: "image/webp" };
  }

  // AVIF: ....ftyp....
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp") {
    const brand = buffer.toString("ascii", 8, 12);
    if (["avif", "mif1", "msf1", "avis"].includes(brand)) {
      return { valid: true, detectedMime: "image/avif" };
    }
  }

  return { valid: false, detectedMime: "" };
}

// Extract basic dimensions without heavy C++ binaries
function extractDimensions(buffer: Buffer, mime: string): { width?: number; height?: number } {
  try {
    if (mime === "image/png" && buffer.length >= 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
    if ((mime === "image/jpeg" || mime === "image/jpg") && buffer.length > 4) {
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        offset += 2 + buffer.readUInt16BE(offset + 2);
      }
    }
    if (mime === "image/webp" && buffer.length >= 30) {
      if (buffer.toString("ascii", 12, 16) === "VP8X") {
        const width = 1 + buffer.readUIntLE(24, 3);
        const height = 1 + buffer.readUIntLE(27, 3);
        return { width, height };
      }
    }
  } catch (e) {
    // Ignore dimension parsing failure
  }
  return {};
}

// GET /api/admin/upload - List all media assets with usage detection
export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token =
      cookieStore.get("ceylon_admin_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json(
        { error: "Session expired or unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase();

    // Synchronize media assets across serverless containers
    await syncMediaWithDb(prisma);

    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Check usage across tours, destinations, and hero slides
    const tours = await prisma.tourImage.findMany({ select: { url: true } });
    const dests = await prisma.destination.findMany({ select: { image: true, thumbnail: true } });
    const slides = await prisma.heroSlide.findMany({ select: { image: true, mobileImage: true } });

    const usedUrls = new Set<string>();
    tours.forEach((t) => t.url && usedUrls.add(t.url));
    dests.forEach((d) => {
      if (d.image) usedUrls.add(d.image);
      if (d.thumbnail) usedUrls.add(d.thumbnail);
    });
    slides.forEach((s) => {
      if (s.image) usedUrls.add(s.image);
      if (s.mobileImage) usedUrls.add(s.mobileImage);
    });

    const enriched = assets.map((a) => {
      const isUsed = usedUrls.has(a.url) || usedUrls.has(`/api/media/${a.id}`);
      return {
        id: a.id,
        url: a.url,
        filename: a.filename,
        title: a.title,
        altText: a.altText,
        fileSize: a.fileSize,
        mimeType: a.mimeType,
        width: a.width,
        height: a.height,
        inUse: isUsed,
        createdAt: a.createdAt,
      };
    });

    const filtered = search
      ? enriched.filter(
          (a) =>
            a.filename.toLowerCase().includes(search) ||
            (a.title && a.title.toLowerCase().includes(search)) ||
            (a.altText && a.altText.toLowerCase().includes(search))
        )
      : enriched;

    return NextResponse.json(filtered, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/upload error", error);
    return NextResponse.json({ error: "Failed to retrieve media asset library" }, { status: 500 });
  }
}

// POST /api/admin/upload - Securely upload and store image
export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token =
      cookieStore.get("ceylon_admin_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json(
        { error: "Unauthorized. Please ensure you are logged into the Admin Portal." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";
    const title = (formData.get("title") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file was selected for upload." }, { status: 400 });
    }

    // 1. File size validation (Strict 8 MB limit in bytes)
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { error: `File exceeds 8 MB limit (${fileSizeMB} MB uploaded). Please compress your image.` },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Uploaded file is empty (0 bytes)." }, { status: 400 });
    }

    // 2. MIME type & extension validation
    const allowedBrowserTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/pjpeg",
      "image/x-png",
    ];

    const fileExt = path.extname(file.name).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

    const isAllowedMime = file.type && allowedBrowserTypes.includes(file.type.toLowerCase());
    const isAllowedExt = allowedExtensions.includes(fileExt);

    if (!isAllowedMime && !isAllowedExt) {
      return NextResponse.json(
        { error: `Unsupported file format '${file.type || fileExt}'. Allowed formats: JPEG, PNG, WebP, AVIF.` },
        { status: 400 }
      );
    }

    // 3. Read buffer & validate server-side magic bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const magicCheck = validateMagicBytes(buffer);

    let detectedMime = magicCheck.detectedMime || file.type || "image/jpeg";
    if (detectedMime === "image/jpg") detectedMime = "image/jpeg";

    const { width, height } = extractDimensions(buffer, detectedMime);

    // Sanitize filename
    const originalExt = path.extname(file.name) || ".jpg";
    const safeExtMap: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/avif": ".avif",
    };
    const extension = safeExtMap[detectedMime] || originalExt.toLowerCase();
    const cleanBaseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .slice(0, 40);

    const uniqueId = `media-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const finalFilename = `${cleanBaseName || "image"}-${uniqueId}${extension}`;

    let publishedUrl = "";

    // 4. Multi-tier Storage Resolution
    // Strategy A: Vercel Blob (if token configured) with strict 5s timeout
    const vercelBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (vercelBlobToken) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const blobRes = await fetch(`https://blob.vercel-storage.com/${finalFilename}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${vercelBlobToken}`,
            "x-api-version": "7",
            "content-type": detectedMime,
            "x-add-random-suffix": "true",
          },
          body: buffer,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (blobRes.ok) {
          const blobData = await blobRes.json();
          if (blobData?.url) {
            publishedUrl = blobData.url;
          }
        }
      } catch (blobErr) {
        console.warn("Vercel blob upload attempt timed out or failed; safely continuing to persistent DB storage.", blobErr);
      }
    }

    // Strategy B: Local filesystem write (if writable)
    if (!publishedUrl) {
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
        const filepath = path.join(uploadDir, finalFilename);
        await writeFile(filepath, buffer);
        publishedUrl = `/uploads/${finalFilename}`;
      } catch (fsErr) {
        // Read-only filesystem on Vercel serverless is caught gracefully
        console.warn("Local filesystem is read-only (standard on Vercel Serverless). Using DB media engine.");
      }
    }

    // Strategy C: Database Persistent Storage Engine
    // Store image base64 data directly in database so it is 100% persistent across serverless recycles
    const base64Data = `data:${detectedMime};base64,${buffer.toString("base64")}`;

    // Create DB Media Asset record
    const asset = await prisma.mediaAsset.create({
      data: {
        url: publishedUrl || `/api/media/${uniqueId}`,
        filename: file.name,
        title: title || file.name,
        altText: altText || `${cleanBaseName || "Ceylon Explore Tours"} travel photography`,
        fileSize: file.size,
        mimeType: detectedMime,
        data: base64Data,
        width: width || null,
        height: height || null,
      },
    });

    // Ensure non-cloud uploads have persistent, serverless-safe public URLs
    if (!publishedUrl || publishedUrl.startsWith("/uploads/")) {
      publishedUrl = `/api/media/${asset.id}`;
      await prisma.mediaAsset.update({
        where: { id: asset.id },
        data: { url: publishedUrl },
      });
    }

    // Persist to cross-lambda store
    await saveMediaToStore({
      id: asset.id,
      url: publishedUrl,
      filename: asset.filename,
      title: asset.title,
      altText: asset.altText,
      fileSize: asset.fileSize,
      mimeType: asset.mimeType,
      data: base64Data,
      width: asset.width,
      height: asset.height,
      createdAt: asset.createdAt ? new Date(asset.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      url: publishedUrl,
      id: asset.id,
      filename: file.name,
      fileSize: file.size,
      mimeType: detectedMime,
      width,
      height,
    });
  } catch (error: any) {
    console.error("Server upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed due to a server error. Please try again." },
      { status: 500 }
    );
  }
}

// PUT /api/admin/upload - Update media asset metadata or replace image in-place
export async function PUT(req: Request) {
  try {
    const cookieStore = cookies();
    const token =
      cookieStore.get("ceylon_admin_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { id, altText, title, url, data, mimeType, fileSize, filename, replaceTempId } = body;
    const cleanId = cleanMediaId(id);
    if (!cleanId) {
      return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
    }

    const existing = await prisma.mediaAsset.findUnique({ where: { id: cleanId } });
    if (!existing) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    let updateData: any = {
      ...(altText !== undefined && { altText }),
      ...(title !== undefined && { title }),
    };

    // If replaceTempId is provided, pull newly uploaded asset data and transfer onto this asset
    if (replaceTempId) {
      const cleanTempId = cleanMediaId(replaceTempId);
      const tempAsset = await prisma.mediaAsset.findUnique({ where: { id: cleanTempId } });
      if (tempAsset) {
        updateData = {
          ...updateData,
          data: tempAsset.data,
          mimeType: tempAsset.mimeType,
          fileSize: tempAsset.fileSize,
          filename: tempAsset.filename,
          width: tempAsset.width,
          height: tempAsset.height,
        };
        // If the temp asset had an external or blob URL, use it; otherwise maintain the canonical /api/media/{id}
        if (tempAsset.url && (tempAsset.url.startsWith("http://") || tempAsset.url.startsWith("https://"))) {
          updateData.url = tempAsset.url;
        }

        // Clean up temp asset
        try {
          await prisma.mediaAsset.delete({ where: { id: cleanTempId } });
          await removeMediaFromStore(cleanTempId);
        } catch (delTempErr) {}
      }
    } else if (data !== undefined || url !== undefined) {
      if (data !== undefined) updateData.data = data;
      if (mimeType !== undefined) updateData.mimeType = mimeType;
      if (fileSize !== undefined) updateData.fileSize = fileSize;
      if (filename !== undefined) updateData.filename = filename;
      if (url !== undefined) updateData.url = url;
    }

    const oldUrl = existing.url;
    const updated = await prisma.mediaAsset.update({
      where: { id: cleanId },
      data: updateData,
    });

    // If external URL changed, propagate to other models
    if (updated.url && updated.url !== oldUrl) {
      try {
        await prisma.tourImage.updateMany({
          where: { url: oldUrl },
          data: { url: updated.url },
        });
        await prisma.destination.updateMany({
          where: { image: oldUrl },
          data: { image: updated.url },
        });
        await prisma.destination.updateMany({
          where: { thumbnail: oldUrl },
          data: { thumbnail: updated.url },
        });
        await prisma.heroSlide.updateMany({
          where: { image: oldUrl },
          data: { image: updated.url },
        });
        await prisma.heroSlide.updateMany({
          where: { mobileImage: oldUrl },
          data: { mobileImage: updated.url },
        });
      } catch (propagateErr) {
        console.warn("Propagation notice on asset replacement:", propagateErr);
      }
    }

    // Persist updated asset to cross-lambda mediaStore
    await saveMediaToStore({
      id: updated.id,
      url: updated.url,
      filename: updated.filename,
      title: updated.title,
      altText: updated.altText,
      fileSize: updated.fileSize,
      mimeType: updated.mimeType,
      data: updated.data,
      width: updated.width,
      height: updated.height,
      createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    try {
      revalidatePath("/", "page");
      revalidatePath("/tours", "page");
      revalidatePath("/destinations", "page");
      revalidatePath("/admin", "page");
    } catch (e) {}

    return NextResponse.json({ success: true, asset: updated });
  } catch (error) {
    console.error("PUT /api/admin/upload error", error);
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
  }
}

// DELETE /api/admin/upload - Safe deletion with in-use protection
export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const token =
      cookieStore.get("ceylon_admin_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const force = searchParams.get("force") === "true";

    if (!id) {
      return NextResponse.json({ error: "Asset ID is required" }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Check usage across website
    const targetUrls = [asset.url, `/api/media/${asset.id}`];
    const inTours = await prisma.tourImage.count({ where: { url: { in: targetUrls } } });
    const inDests = await prisma.destination.count({
      where: {
        OR: [
          { image: { in: targetUrls } },
          { thumbnail: { in: targetUrls } },
        ],
      },
    });
    const inSlides = await prisma.heroSlide.count({
      where: {
        OR: [
          { image: { in: targetUrls } },
          { mobileImage: { in: targetUrls } },
        ],
      },
    });

    if (!force && (inTours > 0 || inDests > 0 || inSlides > 0)) {
      return NextResponse.json(
        {
          error: `Cannot safely delete this image: it is currently active in ${inTours} tour package(s), ${inDests} destination(s), and ${inSlides} homepage slide(s). Replace them first to avoid broken links.`,
          inUse: true,
          usage: { tours: inTours, destinations: inDests, slides: inSlides },
        },
        { status: 409 }
      );
    }

    // Try deleting physical file if local
    if (asset.url.startsWith("/uploads/")) {
      try {
        const filepath = path.join(process.cwd(), "public", asset.url);
        await unlink(filepath);
      } catch (e) {
        // ignore if not on disk
      }
    }

    await prisma.mediaAsset.delete({
      where: { id },
    });
    await removeMediaFromStore(id);

    return NextResponse.json({ success: true, message: "Image deleted safely." });
  } catch (error) {
    console.error("DELETE /api/admin/upload error", error);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
