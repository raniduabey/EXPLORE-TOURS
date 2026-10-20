import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  syncContentWithDb,
  saveSlideToStore,
  deleteSlideFromStore,
  getAllStoredSlides,
} from "@/lib/contentStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";

    await syncContentWithDb(prisma);

    const where = showAll ? {} : { active: true };
    let slides = await prisma.heroSlide.findMany({
      where,
      orderBy: { orderIndex: "asc" },
    });

    if (!slides || slides.length === 0) {
      const stored = await getAllStoredSlides();
      slides = showAll ? stored : stored.filter((s) => s.active !== false);
    }

    return NextResponse.json(slides, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
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

    let nextOrder = Number(orderIndex);
    if (isNaN(nextOrder)) {
      const count = await prisma.heroSlide.count();
      nextOrder = count;
    }

    const slide = await prisma.heroSlide.create({
      data: {
        tagline: tagline || "Discover Sri Lanka",
        headlineLine1: headlineLine1 || "Discover Sri Lanka,",
        headlineHighlight: headlineHighlight || "Your Way.",
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

    try {
      await saveSlideToStore(slide);
      revalidatePath("/", "page");
    } catch (e) {}

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Hero slide create error", error);
    return NextResponse.json({ error: "Failed to create hero slide" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      for (let i = 0; i < body.length; i++) {
        const item = body[i];
        if (item.id) {
          const upd = await prisma.heroSlide.update({
            where: { id: item.id },
            data: { orderIndex: i },
          });
          await saveSlideToStore(upd);
        }
      }
      const updatedList = await prisma.heroSlide.findMany({
        orderBy: { orderIndex: "asc" },
      });
      try {
        revalidatePath("/", "page");
      } catch (e) {}
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

    try {
      await saveSlideToStore(updated);
      revalidatePath("/", "page");
    } catch (e) {}

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
    await deleteSlideFromStore(id);
    try {
      revalidatePath("/", "page");
    } catch (e) {}
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero slide delete error", error);
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
