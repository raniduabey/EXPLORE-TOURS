import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return new Response("Media ID required", { status: 400 });
    }

    // Try finding by ID first, then by URL match
    let asset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      asset = await prisma.mediaAsset.findFirst({
        where: {
          OR: [
            { url: `/api/media/${id}` },
            { url: { endsWith: id } },
          ],
        },
      });
    }

    if (!asset) {
      return new Response("Media asset not found", { status: 404 });
    }

    // 1. If stored as base64 data in database, return binary buffer immediately
    if (asset.data) {
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

    // 2. If stored in local file system, attempt to stream file directly
    if (asset.url && asset.url.startsWith("/uploads/")) {
      const candidates = [
        path.join(process.cwd(), "public", asset.url),
        path.join("/tmp", asset.url),
      ];
      for (const filepath of candidates) {
        if (existsSync(filepath)) {
          try {
            const buffer = await readFile(filepath);
            const mime = asset.mimeType || "image/jpeg";
            return new Response(buffer, {
              status: 200,
              headers: {
                "Content-Type": mime,
                "Content-Length": String(buffer.length),
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          } catch (e) {
            // continue fallback
          }
        }
      }
    }

    // 3. If external URL (e.g. Vercel Blob or Unsplash), redirect safely
    if (asset.url && (asset.url.startsWith("http://") || asset.url.startsWith("https://"))) {
      return NextResponse.redirect(asset.url, 307);
    }

    // 4. If internal path (and not self-referential)
    if (asset.url && asset.url.startsWith("/") && asset.url !== `/api/media/${id}`) {
      const redirectUrl = new URL(asset.url, req.url);
      return NextResponse.redirect(redirectUrl, 307);
    }

    return new Response("No image content available", { status: 404 });
  } catch (error) {
    console.error("GET /api/media/[id] error", error);
    return new Response("Failed to serve media", { status: 500 });
  }
}
