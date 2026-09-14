import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const ref = searchParams.get("ref");

    // Require either a booking reference + email, or verified customer email
    if (!email && !ref) {
      return NextResponse.json([]);
    }

    const whereClause: any = {};
    if (email) {
      whereClause.guestEmail = email.trim().toLowerCase();
    }
    if (ref) {
      whereClause.bookingRef = ref.trim().toUpperCase();
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        tour: {
          select: {
            title: true,
            location: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("User bookings error", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
