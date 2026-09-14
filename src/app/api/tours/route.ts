import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TOURS_CATALOG } from "@/data/toursData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let formatted: any[] = [];

    try {
      const tours = await prisma.tour.findMany({
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          destination: true,
          category: true,
        },
        orderBy: { bookedCount: "desc" },
      });

      if (tours && tours.length > 0) {
        formatted = tours.map((e: any) => ({
          id: e.id,
          title: e.title,
          slug: e.slug,
          location: e.location,
          destinationSlug: e.destination?.slug || "",
          categorySlug: e.category?.slug || "",
          duration: e.duration,
          rating: e.rating,
          reviewCount: e.reviewCount,
          price: e.price,
          previousPrice: e.previousPrice,
          tourType: e.tourType,
          badge: e.badge,
          freeCancellation: e.freeCancellation,
          instantBook: e.instantBook,
          primaryImage:
            e.images[0]?.url ||
            "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=800&auto=format&fit=crop",
        }));
      }
    } catch (dbErr) {
      console.error("Prisma tours query failed, using catalog fallback", dbErr);
    }

    // If DB returned fewer than catalog or empty, use catalog
    if (formatted.length === 0) {
      formatted = TOURS_CATALOG.map((t) => ({
        id: t.id,
        title: t.title,
        slug: t.slug,
        location: t.location,
        destinationSlug: t.destinationSlug,
        categorySlug: t.categorySlug,
        duration: t.duration,
        rating: t.rating,
        reviewCount: t.reviewCount,
        price: t.price,
        previousPrice: t.previousPrice,
        tourType: t.tourType,
        badge: t.badge,
        freeCancellation: t.freeCancellation,
        instantBook: t.instantBook,
        primaryImage: t.images[0]?.url,
      }));
    }

    return NextResponse.json(formatted, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("API error fetching tours", error);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}
