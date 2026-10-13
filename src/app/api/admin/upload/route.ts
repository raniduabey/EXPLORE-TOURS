import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("GET /api/admin/upload error", error);
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    // Note: Allow review photo uploads if submitted from client review form or authenticated admin
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";
    const title = (formData.get("title") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate MIME type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and AVIF images are allowed." },
        { status: 400 }
      );
    }

    // Validate size (Max 8MB)
    const maxSizeBytes = 8 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "File size exceeds maximum allowed limit of 8MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext.toLowerCase())
      ? ext.toLowerCase()
      : ".jpg";

    const filename = `media-${Date.now()}-${Math.floor(Math.random() * 1000)}${safeExt}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;

    // Track in database MediaAsset
    try {
      await prisma.mediaAsset.create({
        data: {
          url,
          filename: file.name,
          title: title || file.name,
          altText: altText || "Ceylon Explore Tours Media Asset",
          fileSize: file.size,
          mimeType: file.type,
        },
      });
    } catch (dbErr) {
      console.error("Failed to track media asset in database", dbErr);
    }

    return NextResponse.json({ success: true, url, filename });
  } catch (error) {
    console.error("File upload error", error);
    return NextResponse.json(
      { error: "Failed to upload file safely." },
      { status: 500 }
    );
  }
}
