import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { syncToursWithDb, getAllStoredTours } from "@/lib/toursStore";
import { TOURS_CATALOG } from "@/data/toursData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Synchronize across serverless environments before serving live content
    await syncToursWithDb(prisma);

    let formatted: any[] = [];

    try {
      const tours = await prisma.tour.findMany({
        where: {
          status: {
            not: "ARCHIVED",
          },
        },
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
            "/images/destinations/sigiriya.jpg",
        }));
      }
    } catch (dbErr) {
      console.error("Prisma tours query failed, using store fallback", dbErr);
    }

    // Fallback to stored tours if SQLite returned empty
    if (formatted.length === 0) {
      const stored = await getAllStoredTours();
      if (stored && stored.length > 0) {
        formatted = stored
          .filter((t) => t.status !== "ARCHIVED")
          .map((t) => ({
            id: t.id,
            title: t.title,
            slug: t.slug,
            location: t.location,
            destinationSlug: t.destination?.slug || "",
            categorySlug: t.category?.slug || "",
            duration: t.duration,
            rating: t.rating || 5,
            reviewCount: t.reviewCount || 0,
            price: t.price,
            previousPrice: t.previousPrice,
            tourType: t.tourType,
            badge: t.badge,
            freeCancellation: t.freeCancellation,
            instantBook: t.instantBook,
            primaryImage:
              t.images?.[0]?.url ||
              "/images/destinations/sigiriya.jpg",
          }));
      }
    }

    // Merge any catalog tours not yet in the results
    const existingSlugs = new Set(formatted.map((t: any) => t.slug));
    for (const t of TOURS_CATALOG) {
      if (!existingSlugs.has(t.slug)) {
        formatted.push({
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
        });
      }
    }

    return NextResponse.json(formatted, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("API error fetching tours", error);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}
