import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
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
    return NextResponse.json({ error: "Failed to fetch user bookings" }, { status: 500 });
  }
}
