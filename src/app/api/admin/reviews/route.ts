import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/admin/reviews
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tourId = searchParams.get("tourId");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      const upperStatus = status.toUpperCase();
      if (upperStatus === "APPROVED") {
        where.status = { in: ["APPROVED", "approved", "Approved", "PUBLISHED", "published"] };
      } else if (upperStatus === "PENDING") {
        where.status = { in: ["PENDING", "pending", "Pending"] };
      } else if (upperStatus === "REJECTED") {
        where.status = { in: ["REJECTED", "rejected", "Rejected"] };
      } else {
        where.status = status;
      }
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

    return NextResponse.json(reviews, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/reviews error", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// PUT /api/admin/reviews - Moderate review (APPROVE, REJECT, HIDE, PENDING)
export async function PUT(req: Request) {
  try {
    const { id, status, rejectionReason } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Review ID and status are required" }, { status: 400 });
    }

    const review = await prisma.review.findUnique({
      where: { id },
      include: { tour: { select: { id: true, slug: true } } },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Always persist standard uppercase status for consistency
    const normalizedStatus = String(status).toUpperCase();

    const updated = await prisma.review.update({
      where: { id },
      data: {
        status: normalizedStatus,
        rejectionReason: normalizedStatus === "REJECTED" ? rejectionReason || "Policy violation" : null,
      },
    });

    // Automatically recalculate the associated tour's average rating and review count from approved reviews only!
    if (review.tourId) {
      const approvedReviews = await prisma.review.findMany({
        where: {
          tourId: review.tourId,
          status: { in: ["APPROVED", "approved", "Approved", "PUBLISHED", "published"] },
        },
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

    // Invalidate Next.js static / ISR caches so the homepage and tours show approved reviews immediately!
    try {
      revalidatePath("/");
      revalidatePath("/tours");
      revalidatePath("/review");
      if (review.tour?.slug) {
        revalidatePath(`/tours/${review.tour.slug}`);
      }
    } catch (revalErr) {
      console.warn("revalidatePath error in PUT /api/admin/reviews:", revalErr);
    }

    // Create Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          adminEmail: "admin@ceylonexploretours.com",
          action: `REVIEW_${normalizedStatus}`,
          entityType: "Review",
          entityId: id,
          details: `Updated review status to ${normalizedStatus}${
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

    const review = await prisma.review.findUnique({
      where: { id },
      include: { tour: { select: { id: true, slug: true } } },
    });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });

    // Recalculate tour rating if applicable
    if (review.tourId) {
      const approvedReviews = await prisma.review.findMany({
        where: {
          tourId: review.tourId,
          status: { in: ["APPROVED", "approved", "Approved", "PUBLISHED", "published"] },
        },
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

    // Invalidate caches
    try {
      revalidatePath("/");
      revalidatePath("/tours");
      revalidatePath("/review");
      if (review.tour?.slug) {
        revalidatePath(`/tours/${review.tour.slug}`);
      }
    } catch (revalErr) {
      console.warn("revalidatePath error in DELETE /api/admin/reviews:", revalErr);
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/reviews error", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

