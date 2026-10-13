import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/reviews - Return approved reviews for public display
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tourId = searchParams.get("tourId");
    const limit = Number(searchParams.get("limit")) || 50;

    const whereClause: any = {
      status: "APPROVED",
    };

    if (tourId) {
      whereClause.tourId = tourId;
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        tour: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET /api/reviews error", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/reviews - Submit review with verification (sets status = PENDING)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      token,
      bookingRef,
      guestEmail,
      userName,
      userCountry,
      rating,
      guideRating,
      transportRating,
      valueRating,
      comment,
      photoUrl,
    } = body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return NextResponse.json(
        { error: "A rating between 1 and 5 stars is required." },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a written review of at least 10 characters." },
        { status: 400 }
      );
    }

    let verifiedBooking: any = null;
    let invitationRecord: any = null;

    // Path A: Verification via single-use invitation token
    if (token) {
      invitationRecord = await prisma.reviewInvitation.findUnique({
        where: { token },
        include: { booking: { include: { tour: true } } },
      });

      if (!invitationRecord) {
        return NextResponse.json(
          { error: "Invalid review invitation token." },
          { status: 400 }
        );
      }

      if (invitationRecord.usedAt) {
        return NextResponse.json(
          { error: "This review invitation has already been used." },
          { status: 400 }
        );
      }

      if (new Date(invitationRecord.expiresAt) < new Date()) {
        return NextResponse.json(
          { error: "This review invitation token has expired." },
          { status: 400 }
        );
      }

      verifiedBooking = invitationRecord.booking;
    } else if (bookingRef && guestEmail) {
      // Path B: Verification via completed booking lookup
      verifiedBooking = await prisma.booking.findFirst({
        where: {
          bookingRef: bookingRef.trim(),
          guestEmail: guestEmail.trim().toLowerCase(),
        },
        include: { tour: true },
      });

      if (!verifiedBooking) {
        return NextResponse.json(
          { error: "No booking found matching the provided reference and email." },
          { status: 404 }
        );
      }

      if (verifiedBooking.bookingStatus !== "COMPLETED") {
        return NextResponse.json(
          {
            error:
              "Reviews can only be submitted after your tour has been marked Completed by our team.",
          },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json(
        {
          error:
            "Please provide a valid review invitation token or your completed booking reference and email.",
        },
        { status: 400 }
      );
    }

    // Limit to 1 active submission per booking
    const existingReview = await prisma.review.findFirst({
      where: {
        bookingId: verifiedBooking.id,
        status: { in: ["PENDING", "APPROVED"] },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          error:
            "A review for this booking has already been submitted and is currently active.",
        },
        { status: 400 }
      );
    }

    // Create review with PENDING status
    const newReview = await prisma.review.create({
      data: {
        tourId: verifiedBooking.tourId,
        bookingId: verifiedBooking.id,
        userName: userName?.trim() || verifiedBooking.guestName,
        userEmail: guestEmail?.trim() || verifiedBooking.guestEmail,
        userCountry: userCountry?.trim() || verifiedBooking.guestCountry || "International",
        rating: Number(rating),
        guideRating: Number(guideRating) || 5.0,
        transportRating: Number(transportRating) || 5.0,
        valueRating: Number(valueRating) || 5.0,
        comment: comment.trim(),
        photoUrl: photoUrl || null,
        travelDate: verifiedBooking.tourDate,
        verified: true,
        status: "PENDING",
      },
    });

    // Mark invitation token as used if applicable
    if (invitationRecord) {
      await prisma.reviewInvitation.update({
        where: { id: invitationRecord.id },
        data: { usedAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you! Your review has been submitted successfully and is pending administrative moderation before publication.",
      reviewId: newReview.id,
    });
  } catch (error) {
    console.error("POST /api/reviews error", error);
    return NextResponse.json(
      { error: "Failed to submit review. Please try again." },
      { status: 500 }
    );
  }
}
