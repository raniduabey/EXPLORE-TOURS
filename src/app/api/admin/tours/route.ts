import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/tours - List tours with search, status & destination filter
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
    const destinationId = searchParams.get("destinationId");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (destinationId) {
      where.destinationId = destinationId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    const tours = await prisma.tour.findMany({
      where,
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] },
        itinerary: { orderBy: { stepNumber: "asc" } },
        _count: { select: { bookings: true, reviews: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error("GET /api/admin/tours error", error);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}

// POST /api/admin/tours - Create a new tour package
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
      title,
      slug,
      location,
      destinationId,
      categoryId,
      duration,
      durationHours,
      price,
      previousPrice,
      adultPrice,
      childPrice,
      tourType,
      badge,
      freeCancellation,
      instantBook,
      pickupAvailable,
      guideIncluded,
      liveGuide,
      languages,
      minTravellers,
      maxTravellers,
      description,
      highlights,
      includes,
      excludes,
      importantInfo,
      whatToBring,
      cancellationPolicy,
      featured,
      status,
      seoTitle,
      seoDescription,
      primaryImage,
      galleryImages, // Array of strings or { url, caption }
      itinerary, // Array of { stepNumber, title, description, location, duration }
    } = body;

    if (!title || !price) {
      return NextResponse.json(
        { error: "Title and price are required." },
        { status: 400 }
      );
    }

    // Auto-generate clean slug if not given
    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check slug collision
    const existing = await prisma.tour.findUnique({
      where: { slug: cleanSlug },
    });

    const finalSlug = existing ? `${cleanSlug}-${Date.now().toString().slice(-4)}` : cleanSlug;

    const highlightsStr = Array.isArray(highlights) ? JSON.stringify(highlights) : String(highlights || "[]");
    const includesStr = Array.isArray(includes) ? JSON.stringify(includes) : String(includes || "[]");
    const excludesStr = Array.isArray(excludes) ? JSON.stringify(excludes) : String(excludes || "[]");

    const newTour = await prisma.tour.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        location: location || "Sri Lanka",
        destinationId: destinationId || null,
        categoryId: categoryId || null,
        duration: duration || "Full Day",
        durationHours: Number(durationHours) || 8,
        price: Number(price),
        previousPrice: previousPrice ? Number(previousPrice) : null,
        adultPrice: adultPrice ? Number(adultPrice) : Number(price),
        childPrice: childPrice ? Number(childPrice) : null,
        tourType: tourType || "Private Tour",
        badge: badge || null,
        freeCancellation: freeCancellation !== false,
        instantBook: instantBook !== false,
        pickupAvailable: pickupAvailable !== false,
        guideIncluded: guideIncluded !== false,
        liveGuide: liveGuide || "English",
        languages: languages || "English",
        minTravellers: Number(minTravellers) || 1,
        maxTravellers: Number(maxTravellers) || 15,
        description: description || "",
        highlights: highlightsStr,
        includes: includesStr,
        excludes: excludesStr,
        importantInfo: importantInfo || null,
        whatToBring: whatToBring || null,
        cancellationPolicy: cancellationPolicy || null,
        featured: Boolean(featured),
        status: status || "PUBLISHED",
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        rating: 0,
        reviewCount: 0,
        bookedCount: 0,
      },
    });

    // Handle primary image
    if (primaryImage) {
      await prisma.tourImage.create({
        data: {
          tourId: newTour.id,
          url: primaryImage,
          caption: "Primary Tour Image",
          isPrimary: true,
          order: 0,
        },
      });
    }

    // Handle gallery images
    if (Array.isArray(galleryImages) && galleryImages.length > 0) {
      for (let i = 0; i < galleryImages.length; i++) {
        const item = galleryImages[i];
        const imgUrl = typeof item === "string" ? item : item.url;
        const caption = typeof item === "object" ? item.caption : null;
        if (imgUrl && imgUrl !== primaryImage) {
          await prisma.tourImage.create({
            data: {
              tourId: newTour.id,
              url: imgUrl,
              caption: caption || null,
              isPrimary: false,
              order: i + 1,
            },
          });
        }
      }
    }

    // Handle itinerary items
    if (Array.isArray(itinerary) && itinerary.length > 0) {
      for (let i = 0; i < itinerary.length; i++) {
        const item = itinerary[i];
        await prisma.itineraryItem.create({
          data: {
            tourId: newTour.id,
            stepNumber: Number(item.stepNumber) || i + 1,
            title: item.title || `Day ${i + 1}`,
            description: item.description || "",
            location: item.location || null,
            duration: item.duration || null,
          },
        });
      }
    }

    // Audit log
    try {
      await prisma.auditLog.create({
        data: {
          adminEmail: auth.payload?.sub || "admin@ceylonexploretours.com",
          action: "CREATE_TOUR",
          entityType: "Tour",
          entityId: newTour.id,
          details: `Created new tour: ${newTour.title}`,
        },
      });
    } catch (e) {}

    try {
      revalidatePath("/tours");
      revalidatePath("/");
      if (newTour.slug) {
        revalidatePath(`/tours/${newTour.slug}`);
      }
    } catch (e) {}

    return NextResponse.json({ success: true, tour: newTour });
  } catch (error) {
    console.error("POST /api/admin/tours error", error);
    return NextResponse.json({ error: "Failed to create tour package" }, { status: 500 });
  }
}

// PUT /api/admin/tours - Update tour package completely
export async function PUT(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      title,
      slug,
      location,
      destinationId,
      categoryId,
      duration,
      durationHours,
      price,
      previousPrice,
      adultPrice,
      childPrice,
      tourType,
      badge,
      freeCancellation,
      instantBook,
      pickupAvailable,
      guideIncluded,
      liveGuide,
      languages,
      minTravellers,
      maxTravellers,
      description,
      highlights,
      includes,
      excludes,
      importantInfo,
      whatToBring,
      cancellationPolicy,
      featured,
      status,
      seoTitle,
      seoDescription,
      primaryImage,
      galleryImages,
      itinerary,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Tour ID is required" }, { status: 400 });
    }

    const existingTour = await prisma.tour.findUnique({
      where: { id },
    });

    if (!existingTour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    const highlightsStr = Array.isArray(highlights)
      ? JSON.stringify(highlights)
      : highlights !== undefined
      ? String(highlights)
      : existingTour.highlights;

    const includesStr = Array.isArray(includes)
      ? JSON.stringify(includes)
      : includes !== undefined
      ? String(includes)
      : existingTour.includes;

    const excludesStr = Array.isArray(excludes)
      ? JSON.stringify(excludes)
      : excludes !== undefined
      ? String(excludes)
      : existingTour.excludes;

    const updated = await prisma.tour.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(slug !== undefined && { slug: slug.trim() }),
        ...(location !== undefined && { location: location.trim() }),
        ...(destinationId !== undefined && { destinationId: destinationId || null }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(duration !== undefined && { duration }),
        ...(durationHours !== undefined && { durationHours: Number(durationHours) }),
        ...(price !== undefined && { price: Number(price) }),
        ...(previousPrice !== undefined && { previousPrice: previousPrice ? Number(previousPrice) : null }),
        ...(adultPrice !== undefined && { adultPrice: adultPrice ? Number(adultPrice) : null }),
        ...(childPrice !== undefined && { childPrice: childPrice ? Number(childPrice) : null }),
        ...(tourType !== undefined && { tourType }),
        ...(badge !== undefined && { badge: badge || null }),
        ...(freeCancellation !== undefined && { freeCancellation: Boolean(freeCancellation) }),
        ...(instantBook !== undefined && { instantBook: Boolean(instantBook) }),
        ...(pickupAvailable !== undefined && { pickupAvailable: Boolean(pickupAvailable) }),
        ...(guideIncluded !== undefined && { guideIncluded: Boolean(guideIncluded) }),
        ...(liveGuide !== undefined && { liveGuide }),
        ...(languages !== undefined && { languages }),
        ...(minTravellers !== undefined && { minTravellers: Number(minTravellers) }),
        ...(maxTravellers !== undefined && { maxTravellers: Number(maxTravellers) }),
        ...(description !== undefined && { description }),
        highlights: highlightsStr,
        includes: includesStr,
        excludes: excludesStr,
        ...(importantInfo !== undefined && { importantInfo: importantInfo || null }),
        ...(whatToBring !== undefined && { whatToBring: whatToBring || null }),
        ...(cancellationPolicy !== undefined && { cancellationPolicy: cancellationPolicy || null }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(status !== undefined && { status }),
        ...(seoTitle !== undefined && { seoTitle: seoTitle || null }),
        ...(seoDescription !== undefined && { seoDescription: seoDescription || null }),
      },
    });

    // Synchronize primary & gallery images cleanly
    if (primaryImage !== undefined || Array.isArray(galleryImages)) {
      const targetPrimary = primaryImage || (Array.isArray(galleryImages) ? (typeof galleryImages[0] === "string" ? galleryImages[0] : galleryImages[0]?.url) : null);

      if (targetPrimary) {
        // Demote previous primary flags
        await prisma.tourImage.updateMany({
          where: { tourId: id },
          data: { isPrimary: false },
        });

        const existingPrimaryRecord = await prisma.tourImage.findFirst({
          where: { tourId: id, url: targetPrimary },
        });

        if (existingPrimaryRecord) {
          await prisma.tourImage.update({
            where: { id: existingPrimaryRecord.id },
            data: { isPrimary: true, order: 0 },
          });
        } else {
          await prisma.tourImage.create({
            data: {
              tourId: id,
              url: targetPrimary,
              caption: "Primary Featured Photo",
              isPrimary: true,
              order: 0,
            },
          });
        }
      }

      if (Array.isArray(galleryImages)) {
        // Remove non-primary photos and recreate with exact new sequence
        await prisma.tourImage.deleteMany({
          where: { tourId: id, isPrimary: false },
        });

        const seenUrls = new Set<string>();
        if (targetPrimary) seenUrls.add(targetPrimary);

        let orderIdx = 1;
        for (const item of galleryImages) {
          const imgUrl = typeof item === "string" ? item : item?.url;
          const caption = typeof item === "object" ? item?.caption : null;
          if (imgUrl && !seenUrls.has(imgUrl)) {
            seenUrls.add(imgUrl);
            await prisma.tourImage.create({
              data: {
                tourId: id,
                url: imgUrl,
                caption: caption || null,
                isPrimary: false,
                order: orderIdx++,
              },
            });
          }
        }
      }
    }

    // Update itinerary if array passed
    if (Array.isArray(itinerary)) {
      await prisma.itineraryItem.deleteMany({
        where: { tourId: id },
      });
      for (let i = 0; i < itinerary.length; i++) {
        const item = itinerary[i];
        await prisma.itineraryItem.create({
          data: {
            tourId: id,
            stepNumber: Number(item.stepNumber) || i + 1,
            title: item.title || `Day ${i + 1}`,
            description: item.description || "",
            location: item.location || null,
            duration: item.duration || null,
          },
        });
      }
    }

    // Audit log
    try {
      await prisma.auditLog.create({
        data: {
          adminEmail: auth.payload?.sub || "admin@ceylonexploretours.com",
          action: "UPDATE_TOUR",
          entityType: "Tour",
          entityId: id,
          details: `Updated tour: ${updated.title}`,
        },
      });
    } catch (e) {}

    try {
      revalidatePath("/tours");
      revalidatePath("/");
      if (updated.slug) {
        revalidatePath(`/tours/${updated.slug}`);
      }
    } catch (e) {}

    return NextResponse.json({ success: true, tour: updated });
  } catch (error) {
    console.error("PUT /api/admin/tours error", error);
    return NextResponse.json({ error: "Failed to update tour package" }, { status: 500 });
  }
}

// DELETE /api/admin/tours - Soft delete (archive)
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
      return NextResponse.json({ error: "Tour ID is required" }, { status: 400 });
    }

    // Soft delete by marking ARCHIVED (retains all historical bookings)
    const archived = await prisma.tour.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    // Audit log
    try {
      await prisma.auditLog.create({
        data: {
          adminEmail: auth.payload?.sub || "admin@ceylonexploretours.com",
          action: "ARCHIVE_TOUR",
          entityType: "Tour",
          entityId: id,
          details: `Archived tour: ${archived.title}`,
        },
      });
    } catch (e) {}

    try {
      revalidatePath("/tours");
      revalidatePath("/");
      if (archived.slug) {
        revalidatePath(`/tours/${archived.slug}`);
      }
    } catch (e) {}

    return NextResponse.json({ success: true, tour: archived });
  } catch (error) {
    console.error("DELETE /api/admin/tours error", error);
    return NextResponse.json({ error: "Failed to archive tour package" }, { status: 500 });
  }
}
