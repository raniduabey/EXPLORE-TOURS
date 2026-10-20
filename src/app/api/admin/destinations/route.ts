import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";
import { parseSafeNum } from "@/lib/utils";
import { syncDestinationsWithDb, saveDestinationToStore, getAllStoredDestinations } from "@/lib/destinationsStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Synchronize across serverless containers and persistent store
    await syncDestinationsWithDb(prisma);

    let destinations = await prisma.destination.findMany({
      include: {
        _count: { select: { tours: true } },
      },
      orderBy: { name: "asc" },
    });

    if (!destinations || destinations.length === 0) {
      const stored = await getAllStoredDestinations().catch(() => []);
      if (stored && stored.length > 0) {
        destinations = stored as any;
      }
    }

    return NextResponse.json(destinations, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    });
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
      thumbnail,
      gallery,
      startingPrice,
      popularAttractions,
      bestTimeToVisit,
      featured,
      status,
      seoTitle,
      seoDescription,
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
        thumbnail: thumbnail || null,
        gallery: typeof gallery === "object" ? JSON.stringify(gallery) : gallery || null,
        startingPrice: parseSafeNum(startingPrice, 0) ?? 0,
        popularAttractions: typeof popularAttractions === "object" ? JSON.stringify(popularAttractions) : popularAttractions || "",
        bestTimeToVisit: bestTimeToVisit || "Year-round",
        featured: Boolean(featured),
        status: status || "PUBLISHED",
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
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

    // Persist to cross-lambda store
    try {
      await saveDestinationToStore(newDest);
    } catch (sErr) {}

    try {
      revalidatePath("/destinations", "page");
      revalidatePath("/", "page");
      revalidatePath("/admin", "page");
      if (newDest.slug) revalidatePath(`/destinations/${newDest.slug}`, "page");
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

    // Synchronize across serverless containers and persistent store
    await syncDestinationsWithDb(prisma);

    const {
      id,
      name,
      slug,
      shortDesc,
      longDesc,
      image,
      thumbnail,
      gallery,
      startingPrice,
      popularAttractions,
      bestTimeToVisit,
      featured,
      status,
      seoTitle,
      seoDescription,
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
        ...(thumbnail !== undefined && { thumbnail: thumbnail || null }),
        ...(gallery !== undefined && { gallery: typeof gallery === "object" ? JSON.stringify(gallery) : gallery || null }),
        ...(startingPrice !== undefined && { startingPrice: parseSafeNum(startingPrice, 0) ?? 0 }),
        ...(popularAttractions !== undefined && { popularAttractions: typeof popularAttractions === "object" ? JSON.stringify(popularAttractions) : popularAttractions }),
        ...(bestTimeToVisit !== undefined && { bestTimeToVisit }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(status !== undefined && { status }),
        ...(seoTitle !== undefined && { seoTitle: seoTitle || null }),
        ...(seoDescription !== undefined && { seoDescription: seoDescription || null }),
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

    // Persist to cross-lambda store
    try {
      await saveDestinationToStore(updated);
    } catch (sErr) {}

    try {
      revalidatePath("/destinations", "page");
      revalidatePath("/", "page");
      revalidatePath("/admin", "page");
      if (updated.slug) revalidatePath(`/destinations/${updated.slug}`, "page");
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

    // Persist to cross-lambda store
    try {
      await saveDestinationToStore(archived);
    } catch (sErr) {}

    try {
      revalidatePath("/destinations", "page");
      revalidatePath("/", "page");
      revalidatePath("/admin", "page");
      if (archived.slug) revalidatePath(`/destinations/${archived.slug}`, "page");
    } catch (e) {}

    return NextResponse.json({ success: true, destination: archived });
  } catch (error) {
    console.error("Archive destination error", error);
    return NextResponse.json({ error: "Failed to archive destination" }, { status: 500 });
  }
}
