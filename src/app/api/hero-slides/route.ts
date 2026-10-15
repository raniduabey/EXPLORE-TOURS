import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";

    const where = showAll ? {} : { active: true };
    const slides = await prisma.heroSlide.findMany({
      where,
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json(slides, {
      headers: {
        "Cache-Control": showAll ? "no-store" : "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Hero slides API error", error);
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tagline,
      headlineLine1,
      headlineHighlight,
      subtitle,
      image,
      mobileImage,
      destination,
      ctaText,
      ctaLink,
      orderIndex,
      active,
    } = body;

    if (!image) {
      return NextResponse.json({ error: "Image URL is required for hero slide." }, { status: 400 });
    }

    // Determine default orderIndex
    let nextOrder = Number(orderIndex);
    if (isNaN(nextOrder)) {
      const count = await prisma.heroSlide.count();
      nextOrder = count;
    }

    const slide = await prisma.heroSlide.create({
      data: {
        tagline: tagline || "Discover Sri Lanka",
        headlineLine1: headlineLine1 || "Discover Sri Lanka",
        headlineHighlight: headlineHighlight || "Your Way",
        subtitle: subtitle || "Unforgettable journeys and authentic island experiences.",
        image,
        mobileImage: mobileImage || null,
        destination: destination || "Sri Lanka",
        ctaText: ctaText || "Explore Tours",
        ctaLink: ctaLink || "/tours",
        active: active !== undefined ? Boolean(active) : true,
        orderIndex: nextOrder,
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Hero slide create error", error);
    return NextResponse.json({ error: "Failed to create hero slide" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Check if bulk reorder array
    if (Array.isArray(body)) {
      for (let i = 0; i < body.length; i++) {
        const item = body[i];
        if (item.id) {
          await prisma.heroSlide.update({
            where: { id: item.id },
            data: { orderIndex: i },
          });
        }
      }
      const updatedList = await prisma.heroSlide.findMany({
        orderBy: { orderIndex: "asc" },
      });
      return NextResponse.json(updatedList);
    }

    const {
      id,
      tagline,
      headlineLine1,
      headlineHighlight,
      subtitle,
      image,
      mobileImage,
      destination,
      ctaText,
      ctaLink,
      active,
      orderIndex,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Slide ID is required" }, { status: 400 });
    }

    const updated = await prisma.heroSlide.update({
      where: { id },
      data: {
        ...(tagline !== undefined && { tagline }),
        ...(headlineLine1 !== undefined && { headlineLine1 }),
        ...(headlineHighlight !== undefined && { headlineHighlight }),
        ...(subtitle !== undefined && { subtitle }),
        ...(image !== undefined && { image }),
        ...(mobileImage !== undefined && { mobileImage: mobileImage || null }),
        ...(destination !== undefined && { destination }),
        ...(ctaText !== undefined && { ctaText }),
        ...(ctaLink !== undefined && { ctaLink }),
        ...(active !== undefined && { active: Boolean(active) }),
        ...(orderIndex !== undefined && { orderIndex: Number(orderIndex) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Hero slide update error", error);
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }
    await prisma.heroSlide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero slide delete error", error);
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
