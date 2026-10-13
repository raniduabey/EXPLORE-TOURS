import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");

    const where: any = {};
    if (status && status !== "ALL") {
      where.bookingStatus = status;
    }
    if (paymentStatus && paymentStatus !== "ALL") {
      where.paymentStatus = paymentStatus;
    }
    if (search) {
      where.OR = [
        { bookingRef: { contains: search } },
        { guestName: { contains: search } },
        { guestEmail: { contains: search } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        tour: {
          select: {
            id: true,
            title: true,
            location: true,
            slug: true,
          },
        },
        invitations: {
          select: {
            id: true,
            token: true,
            expiresAt: true,
            usedAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            status: true,
            comment: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Admin bookings error", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, bookingStatus, paymentStatus, adminNotes } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
    }

    const currentBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!currentBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        ...(bookingStatus && { bookingStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });

    let reviewInviteUrl: string | null = null;

    // Automated Review Invitation Generation when marked as COMPLETED
    if (bookingStatus === "COMPLETED") {
      let existingInvite = await prisma.reviewInvitation.findFirst({
        where: { bookingId: id },
      });

      if (!existingInvite) {
        const inviteToken = crypto.randomBytes(24).toString("hex");
        existingInvite = await prisma.reviewInvitation.create({
          data: {
            token: inviteToken,
            bookingId: id,
            tourId: updated.tourId,
            guestEmail: updated.guestEmail,
            guestName: updated.guestName,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });
      }

      reviewInviteUrl = `/review?token=${existingInvite.token}`;
    }

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          adminEmail: auth.payload?.sub || "admin@ceylonexploretours.com",
          action: "UPDATE_BOOKING",
          entityType: "Booking",
          entityId: id,
          details: `Updated booking ${currentBooking.bookingRef} - Status: ${
            bookingStatus || currentBooking.bookingStatus
          }, Payment: ${paymentStatus || currentBooking.paymentStatus}`,
        },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      booking: updated,
      reviewInviteUrl,
    });
  } catch (error) {
    console.error("Update booking status error", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
