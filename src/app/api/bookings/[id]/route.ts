import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ bookingRef: params.id }, { id: params.id }],
      },
      include: { tour: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Fetch booking error", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}
