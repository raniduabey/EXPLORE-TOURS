import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/reviews
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tourId = searchParams.get("tourId");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (tourId) {
      where.tourId = tourId;
    }
    if (search) {
      where.OR = [
        { userName: { contains: search } },
        { comment: { contains: search } },
        { userEmail: { contains: search } },
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        tour: { select: { id: true, title: true, slug: true } },
        booking: {
          select: {
            id: true,
            bookingRef: true,
            guestName: true,
            guestEmail: true,
            bookingStatus: true,
            tourDate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET /api/admin/reviews error", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// PUT /api/admin/reviews - Moderate review (APPROVE, REJECT, HIDE)
export async function PUT(req: Request) {
  try {
    const { id, status, rejectionReason } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Review ID and status are required" }, { status: 400 });
    }

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason || "Policy violation" : null,
      },
    });

    // Automatically recalculate the associated tour's average rating and review count from approved reviews only!
    if (review.tourId) {
      const approvedReviews = await prisma.review.findMany({
        where: { tourId: review.tourId, status: "APPROVED" },
      });

      const totalApproved = approvedReviews.length;
      const avgRating =
        totalApproved > 0
          ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalApproved
          : 0;

      await prisma.tour.update({
        where: { id: review.tourId },
        data: {
          rating: Number(avgRating.toFixed(2)),
          reviewCount: totalApproved,
        },
      });
    }

    // Create Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          adminEmail: "admin@ceylonexploretours.com",
          action: `REVIEW_${status}`,
          entityType: "Review",
          entityId: id,
          details: `Updated review status to ${status}${
            rejectionReason ? `: ${rejectionReason}` : ""
          }`,
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error("PUT /api/admin/reviews error", error);
    return NextResponse.json({ error: "Failed to update review status" }, { status: 500 });
  }
}

// DELETE /api/admin/reviews - Permanently delete a review
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });

    // Recalculate tour rating if applicable
    if (review.tourId) {
      const approvedReviews = await prisma.review.findMany({
        where: { tourId: review.tourId, status: "APPROVED" },
      });
      const totalApproved = approvedReviews.length;
      const avgRating =
        totalApproved > 0
          ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalApproved
          : 0;

      await prisma.tour.update({
        where: { id: review.tourId },
        data: {
          rating: Number(avgRating.toFixed(2)),
          reviewCount: totalApproved,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/reviews error", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

