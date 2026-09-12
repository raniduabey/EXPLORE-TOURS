import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { bookedCount: "desc" },
    });

    const formatted = tours.map((e: any) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      location: e.location,
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

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("API error fetching tours", error);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}
