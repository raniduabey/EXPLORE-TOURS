import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Hero slides API error", error);
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      tagline,
      headlineLine1,
      headlineHighlight,
      subtitle,
      image,
      destination,
      ctaText,
      ctaLink,
    } = await req.json();

    const slide = await prisma.heroSlide.create({
      data: {
        tagline: tagline || "Explore. Connect. Remember.",
        headlineLine1: headlineLine1 || "Discover Sri Lanka",
        headlineHighlight: headlineHighlight || "Your Way",
        subtitle: subtitle || "Unforgettable tours and authentic island experiences.",
        image:
          image ||
          "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1600&auto=format&fit=crop",
        destination: destination || "Sri Lanka",
        ctaText: ctaText || "Explore Tours",
        ctaLink: ctaLink || "/tours",
        active: true,
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
    const {
      id,
      tagline,
      headlineLine1,
      headlineHighlight,
      subtitle,
      image,
      destination,
      ctaText,
      ctaLink,
      active,
    } = await req.json();

    const updated = await prisma.heroSlide.update({
      where: { id },
      data: {
        tagline,
        headlineLine1,
        headlineHighlight,
        subtitle,
        image,
        destination,
        ctaText,
        ctaLink,
        active,
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
