import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Tour package metrics
    const totalTours = await prisma.tour.count();
    const publishedTours = await prisma.tour.count({ where: { status: "PUBLISHED" } });
    const draftTours = await prisma.tour.count({ where: { status: "DRAFT" } });
    const archivedTours = await prisma.tour.count({ where: { status: "ARCHIVED" } });

    // 2. Booking metrics
    const allBookings = await prisma.booking.findMany({
      select: {
        id: true,
        totalAmount: true,
        bookingStatus: true,
        paymentStatus: true,
        createdAt: true,
      },
    });

    const totalBookings = allBookings.length;
    const pendingBookings = allBookings.filter((b) => b.bookingStatus === "PENDING").length;
    const confirmedBookings = allBookings.filter((b) => b.bookingStatus === "CONFIRMED").length;
    const completedBookings = allBookings.filter((b) => b.bookingStatus === "COMPLETED").length;
    const cancelledBookings = allBookings.filter((b) => b.bookingStatus === "CANCELLED").length;

    // Actual revenue from confirmed paid bookings
    const confirmedPaid = allBookings.filter(
      (b) =>
        (b.bookingStatus === "CONFIRMED" || b.bookingStatus === "COMPLETED") &&
        (b.paymentStatus === "PAID" || b.paymentStatus === "CONFIRMED")
    );
    const totalRevenue = confirmedPaid.reduce((acc, b) => acc + (Number(b.totalAmount) || 0), 0);

    // 3. Inquiries
    const totalInquiries = await prisma.customTripRequest.count();
    const newInquiries = await prisma.customTripRequest.count({ where: { status: "NEW" } });

    // 4. Reviews
    const pendingReviews = await prisma.review.count({
      where: { status: { in: ["PENDING", "pending", "Pending"] } },
    });
    const approvedReviews = await prisma.review.count({
      where: {
        status: { in: ["APPROVED", "approved", "Approved", "PUBLISHED", "published"] },
      },
    });

    // 5. Monthly booking breakdown (from actual database records)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const monthlyData: Record<string, { month: string; bookings: number; revenue: number }> = {};

    months.forEach((m) => {
      monthlyData[m] = { month: m, bookings: 0, revenue: 0 };
    });

    allBookings.forEach((b) => {
      const d = new Date(b.createdAt);
      if (d.getFullYear() === currentYear) {
        const mName = months[d.getMonth()];
        if (monthlyData[mName]) {
          monthlyData[mName].bookings += 1;
          if (b.paymentStatus === "PAID" || b.paymentStatus === "CONFIRMED") {
            monthlyData[mName].revenue += Number(b.totalAmount) || 0;
          }
        }
      }
    });

    // 6. Recent audit logs
    const recentAudit = await prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      tours: {
        total: totalTours,
        published: publishedTours,
        draft: draftTours,
        archived: archivedTours,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        totalRevenue,
      },
      inquiries: {
        total: totalInquiries,
        new: newInquiries,
      },
      reviews: {
        pending: pendingReviews,
        approved: approvedReviews,
      },
      monthlyVolume: Object.values(monthlyData),
      recentAudit,
      envVarNames: Object.keys(process.env).sort(),
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
