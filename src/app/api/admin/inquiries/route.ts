import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";
import {
  syncInquiriesWithDb,
  saveInquiryToStore,
  cleanInquiryId,
  getInquiryFromStore,
  getAllStoredInquiries,
} from "@/lib/inquiriesStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const token =
      cookieStore.get("ceylon_admin_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Synchronize across serverless containers and persistent store
    await syncInquiriesWithDb(prisma);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status.toUpperCase();
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { destinations: { contains: search } },
        { specialNotes: { contains: search } },
      ];
    }

    let inquiries: any[] = [];
    try {
      inquiries = await prisma.customTripRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } catch (dbFindErr) {
      console.warn("Prisma findMany inquiries warning:", dbFindErr);
    }

    // Resilience fallback: If SQLite returned empty (e.g. cold serverless instance), pull directly from store
    if (!inquiries || inquiries.length === 0) {
      const stored = await getAllStoredInquiries();
      if (stored && stored.length > 0) {
        let filtered = stored;
        if (status && status !== "ALL") {
          const upperStatus = status.toUpperCase();
          filtered = filtered.filter(i => (i.status || "NEW").toUpperCase() === upperStatus);
        }
        if (search) {
          const lowerSearch = search.toLowerCase();
          filtered = filtered.filter(i =>
            (i.name && i.name.toLowerCase().includes(lowerSearch)) ||
            (i.email && i.email.toLowerCase().includes(lowerSearch)) ||
            (i.destinations && i.destinations.toLowerCase().includes(lowerSearch)) ||
            (i.specialNotes && i.specialNotes.toLowerCase().includes(lowerSearch))
          );
        }
        inquiries = filtered.map(s => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
        }));
      }
    }

    return NextResponse.json(inquiries, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/inquiries error", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = cookies();
    const token =
      cookieStore.get("ceylon_admin_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await syncInquiriesWithDb(prisma);

    const body = await req.json().catch(() => ({}));
    const { id, status, adminNotes } = body;

    const cleanId = cleanInquiryId(id);
    if (!cleanId) {
      return NextResponse.json({ error: "Inquiry ID required" }, { status: 400 });
    }

    let inquiry = await prisma.customTripRequest.findUnique({
      where: { id: cleanId },
    });

    if (!inquiry) {
      const stored = await getInquiryFromStore(cleanId);
      if (stored) {
        inquiry = await prisma.customTripRequest.upsert({
          where: { id: stored.id },
          create: {
            id: stored.id,
            name: stored.name,
            email: stored.email,
            phone: stored.phone || "Not specified",
            country: stored.country || "International",
            travelDates: stored.travelDates || "Flexible",
            duration: stored.duration || "Custom",
            budget: stored.budget || "Comfort",
            travelers: stored.travelers || "2 Adults",
            accommodation: stored.accommodation || "Boutique",
            transportation: stored.transportation || "Private AC Vehicle",
            destinations: stored.destinations || "[]",
            interests: stored.interests || "[]",
            specialNotes: stored.specialNotes || null,
            status: (status || stored.status || "NEW").toUpperCase(),
            adminNotes: adminNotes !== undefined ? adminNotes : stored.adminNotes || null,
          },
          update: {
            status: (status || stored.status || "NEW").toUpperCase(),
            adminNotes: adminNotes !== undefined ? adminNotes : stored.adminNotes || null,
          },
        });
      }
    }

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found in database." }, { status: 404 });
    }

    const updated = await prisma.customTripRequest.update({
      where: { id: inquiry.id },
      data: {
        ...(status && { status: status.toUpperCase() }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });

    await saveInquiryToStore({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      country: updated.country,
      travelDates: updated.travelDates,
      duration: updated.duration,
      budget: updated.budget,
      travelers: updated.travelers,
      accommodation: updated.accommodation,
      transportation: updated.transportation,
      destinations: updated.destinations,
      interests: updated.interests,
      specialNotes: updated.specialNotes,
      status: updated.status,
      adminNotes: updated.adminNotes,
      createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error("PUT /api/admin/inquiries error", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const token =
      cookieStore.get("ceylon_admin_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cleanId = cleanInquiryId(searchParams.get("id"));

    if (!cleanId) {
      return NextResponse.json({ error: "Inquiry ID required" }, { status: 400 });
    }

    await prisma.customTripRequest.deleteMany({
      where: { id: cleanId },
    });

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully." });
  } catch (error) {
    console.error("DELETE /api/admin/inquiries error", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
