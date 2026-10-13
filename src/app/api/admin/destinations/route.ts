import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      include: {
        _count: { select: { tours: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Fetch destinations admin error", error);
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      shortDesc,
      longDesc,
      image,
      startingPrice,
      popularAttractions,
      bestTimeToVisit,
      featured,
      status,
    } = body;

    if (!name || !image) {
      return NextResponse.json(
        { error: "Destination name and image are required" },
        { status: 400 }
      );
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newDest = await prisma.destination.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        shortDesc: shortDesc || "",
        longDesc: longDesc || shortDesc || "",
        image,
        startingPrice: Number(startingPrice) || 0,
        popularAttractions: popularAttractions || "",
        bestTimeToVisit: bestTimeToVisit || "Year-round",
        featured: Boolean(featured),
        status: status || "PUBLISHED",
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          adminEmail: auth.payload?.sub || "admin@ceylonexploretours.com",
          action: "CREATE_DESTINATION",
          entityType: "Destination",
          entityId: newDest.id,
          details: `Created destination ${newDest.name}`,
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, destination: newDest });
  } catch (error) {
    console.error("Create destination error", error);
    return NextResponse.json({ error: "Failed to create destination" }, { status: 500 });
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

    const {
      id,
      name,
      slug,
      shortDesc,
      longDesc,
      image,
      startingPrice,
      popularAttractions,
      bestTimeToVisit,
      featured,
      status,
    } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Destination ID required" }, { status: 400 });
    }

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(slug && { slug: slug.trim() }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(longDesc !== undefined && { longDesc }),
        ...(image && { image }),
        ...(startingPrice !== undefined && { startingPrice: Number(startingPrice) }),
        ...(popularAttractions !== undefined && { popularAttractions }),
        ...(bestTimeToVisit !== undefined && { bestTimeToVisit }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(status !== undefined && { status }),
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          adminEmail: auth.payload?.sub || "admin@ceylonexploretours.com",
          action: "UPDATE_DESTINATION",
          entityType: "Destination",
          entityId: id,
          details: `Updated destination ${updated.name}`,
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, destination: updated });
  } catch (error) {
    console.error("Update destination admin error", error);
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Destination ID required" }, { status: 400 });
    }

    const archived = await prisma.destination.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return NextResponse.json({ success: true, destination: archived });
  } catch (error) {
    console.error("Archive destination error", error);
    return NextResponse.json({ error: "Failed to archive destination" }, { status: 500 });
  }
}
