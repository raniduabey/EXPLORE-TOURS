import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";
import {
  cleanReviewId,
  getReviewFromStore,
  saveReviewToStore,
  removeReviewFromStore,
  syncReviewsWithDb,
  recalculateTourStats,
  revalidateReviewPaths,
} from "@/lib/reviewsStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper to verify admin credentials from cookie or header
function checkAdminAuth(req: Request) {
  try {
    const cookieStore = cookies();
    const token =
      cookieStore.get("ceylon_admin_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return { valid: false };
    return verifyAdminToken(token);
  } catch (e) {
    return { valid: false };
  }
}

// GET /api/admin/reviews - List all reviews with moderation filters
export async function GET(req: Request) {
  try {
    const auth = checkAdminAuth(req);
    if (!auth.valid) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator session required." },
        { status: 401 }
      );
    }

    // Synchronize across serverless environments
    await syncReviewsWithDb(prisma);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tourId = searchParams.get("tourId");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      const upperStatus = status.toUpperCase();
      if (upperStatus === "APPROVED") {
        where.status = {
          in: ["APPROVED", "approved", "Approved", "PUBLISHED", "published"],
        };
      } else if (upperStatus === "PENDING") {
        where.status = { in: ["PENDING", "pending", "Pending"] };
      } else if (upperStatus === "REJECTED") {
        where.status = { in: ["REJECTED", "rejected", "Rejected"] };
      } else if (upperStatus === "HIDDEN") {
        where.status = { in: ["HIDDEN", "hidden", "Hidden"] };
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
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/reviews error", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/reviews - Moderate review (APPROVE, REJECT, HIDDEN, PENDING)
export async function PUT(req: Request) {
  try {
    const auth = checkAdminAuth(req);
    if (!auth.valid) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator session required." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { id, status, rejectionReason } = body;

    const cleanId = cleanReviewId(id);
    if (!cleanId) {
      return NextResponse.json(
        { error: "A valid review ID is required." },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Review moderation status is required." },
        { status: 400 }
      );
    }

    const normalizedStatus = String(status).toUpperCase();
    const validStatuses = ["APPROVED", "REJECTED", "HIDDEN", "PENDING"];
    if (!validStatuses.includes(normalizedStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status "${status}". Allowed values: ${validStatuses.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // 1. Resilient Lookup: Exact match first, then case-insensitive / trimmed
    let review = await prisma.review.findUnique({
      where: { id: cleanId },
      include: { tour: { select: { id: true, title: true, slug: true } } },
    });

    if (!review) {
      review = await prisma.review.findFirst({
        where: {
          OR: [
            { id: cleanId },
            { id: cleanId.toLowerCase() },
            { id: cleanId.toUpperCase() },
          ],
        },
        include: { tour: { select: { id: true, title: true, slug: true } } },
      });
    }

    // 2. Check synchronized reviews store if not found in this container's SQLite
    if (!review) {
      const stored = await getReviewFromStore(cleanId);
      if (stored) {
        try {
          review = await prisma.review.upsert({
            where: { id: stored.id },
            create: {
              id: stored.id,
              tourId: stored.tourId || null,
              bookingId: stored.bookingId || null,
              userName: stored.userName,
              userEmail: stored.userEmail || null,
              userCountry: stored.userCountry || "International",
              userAvatar: stored.userAvatar || null,
              photoUrl: stored.photoUrl || null,
              rating: Number(stored.rating) || 5.0,
              guideRating: Number(stored.guideRating) || 5.0,
              transportRating: Number(stored.transportRating) || 5.0,
              valueRating: Number(stored.valueRating) || 5.0,
              comment: stored.comment,
              travelDate:
                stored.travelDate || new Date().toISOString().split("T")[0],
              verified: Boolean(stored.verified),
              status: stored.status || "PENDING",
              rejectionReason: stored.rejectionReason || null,
            },
            update: {
              status: stored.status || "PENDING",
            },
            include: {
              tour: { select: { id: true, title: true, slug: true } },
            },
          });
        } catch (upsertErr) {
          console.warn("Prisma restore failed during moderation:", upsertErr);
        }
      }
    }

    // 3. Return informative 404 if genuinely not found
    if (!review) {
      return NextResponse.json(
        {
          error: `Review with identifier "${cleanId}" was not found in the database. Please refresh your moderation dashboard.`,
        },
        { status: 404 }
      );
    }

    // 4. Handle idempotent requests (already in desired status)
    if (
      review.status.toUpperCase() === normalizedStatus &&
      review.rejectionReason === (rejectionReason || null)
    ) {
      return NextResponse.json({
        success: true,
        review,
        message: `Review is already ${normalizedStatus}.`,
      });
    }

    // 5. Update in database
    const updated = await prisma.review.update({
      where: { id: review.id },
      data: {
        status: normalizedStatus,
        rejectionReason:
          normalizedStatus === "REJECTED"
            ? rejectionReason || "Policy violation"
            : null,
      },
      include: { tour: { select: { id: true, title: true, slug: true } } },
    });

    // 6. Update in synchronized store
    await saveReviewToStore({
      id: updated.id,
      tourId: updated.tourId,
      bookingId: updated.bookingId,
      userName: updated.userName,
      userEmail: updated.userEmail,
      userCountry: updated.userCountry,
      userAvatar: updated.userAvatar,
      photoUrl: updated.photoUrl,
      rating: updated.rating,
      guideRating: updated.guideRating,
      transportRating: updated.transportRating,
      valueRating: updated.valueRating,
      comment: updated.comment,
      travelDate: updated.travelDate,
      verified: updated.verified,
      status: normalizedStatus,
      rejectionReason: updated.rejectionReason,
      createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tour: updated.tour,
    });

    // 7. Automatically recalculate tour's average rating and reviewCount
    if (review.tourId) {
      await recalculateTourStats(review.tourId, prisma);
    }

    // 8. Revalidate static/ISR page paths so changes reflect instantly
    revalidateReviewPaths(review.tour?.slug);

    // 9. Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          adminEmail:
            (auth.payload as any)?.sub || "admin@ceylonexploretours.com",
          action: `REVIEW_${normalizedStatus}`,
          entityType: "Review",
          entityId: review.id,
          details: `Updated review by "${review.userName}" to ${normalizedStatus}${
            rejectionReason ? `: ${rejectionReason}` : ""
          }`,
        },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      review: updated,
      message:
        normalizedStatus === "APPROVED"
          ? "Review approved & published successfully! Public pages revalidated."
          : `Review status updated to ${normalizedStatus}.`,
    });
  } catch (error) {
    console.error("PUT /api/admin/reviews error", error);
    return NextResponse.json(
      { error: "Failed to update review status. Database error occurred." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/reviews - Permanently delete a review
export async function DELETE(req: Request) {
  try {
    const auth = checkAdminAuth(req);
    if (!auth.valid) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const cleanId = cleanReviewId(searchParams.get("id"));

    if (!cleanId) {
      return NextResponse.json(
        { error: "A valid review ID is required." },
        { status: 400 }
      );
    }

    let review = await prisma.review.findUnique({
      where: { id: cleanId },
      include: { tour: { select: { id: true, slug: true } } },
    });

    if (!review) {
      review = await prisma.review.findFirst({
        where: {
          OR: [
            { id: cleanId },
            { id: cleanId.toLowerCase() },
            { id: cleanId.toUpperCase() },
          ],
        },
        include: { tour: { select: { id: true, slug: true } } },
      });
    }

    if (!review) {
      // Also check store
      const stored = await getReviewFromStore(cleanId);
      if (stored) {
        await removeReviewFromStore(cleanId);
        return NextResponse.json({
          success: true,
          message: "Review removed from persistent store.",
        });
      }
      return NextResponse.json(
        { error: `Review with identifier "${cleanId}" was not found.` },
        { status: 404 }
      );
    }

    const tourId = review.tourId;
    const tourSlug = review.tour?.slug;

    await prisma.review.delete({ where: { id: review.id } });
    await removeReviewFromStore(review.id);

    // Recalculate tour rating if applicable
    if (tourId) {
      await recalculateTourStats(tourId, prisma);
    }

    // Invalidate caches
    revalidateReviewPaths(tourSlug);

    // Audit log
    try {
      await prisma.auditLog.create({
        data: {
          adminEmail:
            (auth.payload as any)?.sub || "admin@ceylonexploretours.com",
          action: "REVIEW_DELETED",
          entityType: "Review",
          entityId: review.id,
          details: `Deleted review by "${review.userName}".`,
        },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/reviews error", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
