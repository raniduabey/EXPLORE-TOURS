import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slugArray = params.slug || [];
    const filename = slugArray[slugArray.length - 1];

    if (!filename) {
      return new Response("Filename required", { status: 400 });
    }

    // 1. If file exists on local filesystem (local development or persistent volume)
    const localPath = path.join(process.cwd(), "public", "uploads", ...slugArray);
    if (existsSync(localPath)) {
      try {
        const fileBuffer = await readFile(localPath);
        const ext = path.extname(filename).toLowerCase();
        const mimeMap: Record<string, string> = {
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".webp": "image/webp",
          ".avif": "image/avif",
        };
        const mime = mimeMap[ext] || "image/jpeg";
        return new Response(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": mime,
            "Content-Length": String(fileBuffer.length),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch (readErr) {
        // Fall back to database lookup below
      }
    }

    // 2. Query MediaAsset in database for persistent base64 data (Vercel Serverless)
    const asset = await prisma.mediaAsset.findFirst({
      where: {
        OR: [
          { url: { contains: filename } },
          { filename: filename },
          { url: `/uploads/${filename}` },
        ],
      },
    });

    if (asset && asset.data) {
      let base64Data = asset.data;
      if (base64Data.includes(";base64,")) {
        base64Data = base64Data.split(";base64,")[1];
      }
      const buffer = Buffer.from(base64Data, "base64");
      const mime = asset.mimeType || "image/jpeg";

      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": mime,
          "Content-Length": String(buffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new Response("Image not found", { status: 404 });
  } catch (error) {
    console.error("Error serving uploaded image:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
