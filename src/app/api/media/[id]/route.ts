import { NextResponse } from "next/server";
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

    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      return new Response("Media asset not found", { status: 404 });
    }

    // If stored as base64 data in database
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

    // If external URL or static path
    if (asset.url && (asset.url.startsWith("http://") || asset.url.startsWith("https://"))) {
      return NextResponse.redirect(asset.url, 307);
    }

    if (asset.url && asset.url.startsWith("/")) {
      const redirectUrl = new URL(asset.url, req.url);
      return NextResponse.redirect(redirectUrl, 307);
    }

    return new Response("No image content available", { status: 404 });
  } catch (error) {
    console.error("GET /api/media/[id] error", error);
    return new Response("Failed to serve media", { status: 500 });
  }
}
