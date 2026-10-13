import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const ref = searchParams.get("ref");
    const email = searchParams.get("email");

    if (token) {
      const invite = await prisma.reviewInvitation.findUnique({
        where: { token },
        include: { booking: { include: { tour: true } } },
      });

      if (!invite) {
        return NextResponse.json({ valid: false, error: "Invitation not found." }, { status: 404 });
      }

      if (invite.usedAt) {
        return NextResponse.json(
          { valid: false, error: "This review invitation link has already been used." },
          { status: 400 }
        );
      }

      if (new Date(invite.expiresAt) < new Date()) {
        return NextResponse.json(
          { valid: false, error: "This review invitation link has expired." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        valid: true,
        bookingRef: invite.booking.bookingRef,
        guestName: invite.guestName,
        guestEmail: invite.guestEmail,
        tourTitle: invite.booking.tour.title,
        tourDate: invite.booking.tourDate,
        tourId: invite.tourId,
      });
    }

    if (ref && email) {
      const booking = await prisma.booking.findFirst({
        where: {
          bookingRef: ref.trim(),
          guestEmail: email.trim().toLowerCase(),
        },
        include: { tour: true },
      });

      if (!booking) {
        return NextResponse.json({ valid: false, error: "Booking not found." }, { status: 404 });
      }

      if (booking.bookingStatus !== "COMPLETED") {
        return NextResponse.json(
          {
            valid: false,
            error: "Reviews can only be submitted once your tour has been marked Completed.",
          },
          { status: 403 }
        );
      }

      return NextResponse.json({
        valid: true,
        bookingRef: booking.bookingRef,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        tourTitle: booking.tour.title,
        tourDate: booking.tourDate,
        tourId: booking.tourId,
      });
    }

    return NextResponse.json({ valid: false, error: "Missing token or booking credentials." }, { status: 400 });
  } catch (error) {
    console.error("GET /api/reviews/verify error", error);
    return NextResponse.json({ valid: false, error: "Verification failed." }, { status: 500 });
  }
}
