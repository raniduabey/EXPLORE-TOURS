import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      tourId,
      tourDate,
      tourTime,
      adults,
      children = 0,
      guestName,
      guestEmail,
      guestPhone,
      guestCountry,
      pickupLocation,
      specialRequests,
      totalAmount,
      currency = "USD",
      paymentMethod = "PayHere",
    } = await req.json();

    const ref = `CEG-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingRef: ref,
        tourId,
        tourDate,
        tourTime,
        adults: Number(adults),
        children: Number(children),
        guestName,
        guestEmail,
        guestPhone,
        guestCountry: guestCountry || "United States",
        pickupLocation: pickupLocation || "Hotel Lobby",
        specialRequests,
        totalAmount: Number(totalAmount),
        currency,
        paymentMethod,
        paymentStatus: "CONFIRMED",
        bookingStatus: "CONFIRMED",
      },
    });

    return NextResponse.json({ success: true, bookingRef: newBooking.bookingRef });
  } catch (error) {
    console.error("Booking API error", error);
    return NextResponse.json({ error: "Booking creation failed" }, { status: 500 });
  }
}
