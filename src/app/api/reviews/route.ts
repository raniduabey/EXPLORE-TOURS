import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { saveReviewToStore, syncReviewsWithDb } from "@/lib/reviewsStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/reviews - Return approved reviews for public display
export async function GET(req: Request) {
  try {
    // Synchronize across serverless environments & ensure verified reviews exist
    await syncReviewsWithDb(prisma);

    const { searchParams } = new URL(req.url);
    const tourId = searchParams.get("tourId");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    // Support both uppercase and lowercase approved status conventions
    const whereClause: any = {
      status: {
        in: ["APPROVED", "approved", "Approved", "PUBLISHED", "published"],
      },
    };

    if (tourId && tourId !== "all") {
      whereClause.tourId = tourId;
    }

    // Select ONLY safe public fields — NEVER expose customer email addresses
    const reviews = await prisma.review.findMany({
      where: whereClause,
      select: {
        id: true,
        userName: true,
        userCountry: true,
        userAvatar: true,
        photoUrl: true,
        rating: true,
        guideRating: true,
        transportRating: true,
        valueRating: true,
        comment: true,
        travelDate: true,
        verified: true,
        createdAt: true,
        tourId: true,
        tour: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(reviews, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
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
      // Path C: Direct website review submission from visitors / past travellers
      if (!userName || userName.trim().length < 2) {
        return NextResponse.json(
          { error: "Please enter your name." },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailToValidate = (guestEmail || body.email || "").trim();
      if (!emailToValidate || !emailRegex.test(emailToValidate)) {
        return NextResponse.json(
          { error: "Please provide a valid email address." },
          { status: 400 }
        );
      }

      // Check if tourId was passed
      let selectedTourId: string | null = null;
      if (body.tourId && body.tourId !== "general") {
        const foundTour = await prisma.tour.findUnique({
          where: { id: body.tourId },
        });
        if (foundTour) {
          selectedTourId = foundTour.id;
        }
      }

      const newDirectReview = await prisma.review.create({
        data: {
          tourId: selectedTourId,
          userName: userName.trim(),
          userEmail: emailToValidate.toLowerCase(),
          userCountry: (userCountry || body.country || "International").trim(),
          rating: Number(rating),
          guideRating: Number(guideRating) || Number(rating),
          transportRating: Number(transportRating) || Number(rating),
          valueRating: Number(valueRating) || Number(rating),
          comment: comment.trim(),
          photoUrl: photoUrl || null,
          travelDate: body.travelDate || new Date().toISOString().split("T")[0],
          verified: false,
          status: "PENDING",
        },
      });

      // Persist to cross-lambda store
      await saveReviewToStore({
        id: newDirectReview.id,
        tourId: newDirectReview.tourId,
        userName: newDirectReview.userName,
        userEmail: newDirectReview.userEmail,
        userCountry: newDirectReview.userCountry,
        rating: newDirectReview.rating,
        guideRating: newDirectReview.guideRating,
        transportRating: newDirectReview.transportRating,
        valueRating: newDirectReview.valueRating,
        comment: newDirectReview.comment,
        photoUrl: newDirectReview.photoUrl,
        travelDate: newDirectReview.travelDate,
        verified: false,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message:
          "Thank you! Your review has been submitted successfully and is pending administrative moderation before publication.",
        reviewId: newDirectReview.id,
      });
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

    // Persist to cross-lambda store
    await saveReviewToStore({
      id: newReview.id,
      tourId: newReview.tourId,
      bookingId: newReview.bookingId,
      userName: newReview.userName,
      userEmail: newReview.userEmail,
      userCountry: newReview.userCountry,
      rating: newReview.rating,
      guideRating: newReview.guideRating,
      transportRating: newReview.transportRating,
      valueRating: newReview.valueRating,
      comment: newReview.comment,
      photoUrl: newReview.photoUrl,
      travelDate: newReview.travelDate,
      verified: true,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
