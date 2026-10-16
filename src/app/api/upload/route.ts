import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

// POST /api/upload - Public customer review photo upload
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Photo must be smaller than 8 MB." }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (file.type && !allowed.includes(file.type.toLowerCase())) {
      return NextResponse.json({ error: "Only JPEG, PNG, or WebP images are permitted." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verify basic image header
    const isJpeg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8;
    const isPng = buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50;
    const isWebp = buffer.length > 12 && buffer.toString("ascii", 0, 4) === "RIFF";

    if (!isJpeg && !isPng && !isWebp) {
      return NextResponse.json({ error: "Invalid image format." }, { status: 400 });
    }

    const mime = isJpeg ? "image/jpeg" : isPng ? "image/png" : "image/webp";
    const base64Data = `data:${mime};base64,${buffer.toString("base64")}`;
    const uniqueId = `review-photo-${Date.now()}`;

    // Store in media asset table
    const asset = await prisma.mediaAsset.create({
      data: {
        url: `/api/media/${uniqueId}`,
        filename: file.name || "customer-review.jpg",
        title: "Customer Review Photo",
        altText: "Ceylon Explore Tours Guest Experience Photograph",
        fileSize: file.size,
        mimeType: mime,
        data: base64Data,
      },
    });

    const publishedUrl = `/api/media/${asset.id}`;
    await prisma.mediaAsset.update({
      where: { id: asset.id },
      data: { url: publishedUrl },
    });

    return NextResponse.json({
      success: true,
      url: publishedUrl,
      id: asset.id,
    });
  } catch (err: any) {
    console.error("Public upload error:", err);
    return NextResponse.json({ error: "Failed to upload photo." }, { status: 500 });
  }
}
