import { Suspense } from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { TOURS_CATALOG } from "@/data/toursData";
import { siteConfig } from "@/config/site";
import { ToursCatalogueClient } from "@/components/tours/ToursCatalogueClient";

import { syncToursWithDb, getAllStoredTours } from "@/lib/toursStore";

export const metadata: Metadata = {
  title: "Curated Sri Lanka Tour Packages & Private Chauffeur Circuits | Ceylon Explore Tours",
  description:
    "Explore luxury private chauffeur circuits, wildlife safaris, scenic colonial rail journeys, and UNESCO cultural triangle explorations crafted with Ceylon's foremost guides.",
  alternates: {
    canonical: `${siteConfig.url}/tours`,
  },
  openGraph: {
    title: "Curated Sri Lanka Tour Packages & Itineraries | Ceylon Explore Tours",
    description:
      "Private chauffeur circuits, wildlife safaris, and colonial rail journeys across Sri Lanka with certified native guides.",
    url: `${siteConfig.url}/tours`,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getInitialTours() {
  try {
    await syncToursWithDb(prisma);
  } catch (syncErr) {
    console.warn("syncToursWithDb warning in /tours:", syncErr);
  }

  let formatted: any[] = [];

  try {
    const dbTours = await prisma.tour.findMany({
      where: {
        status: {
          not: "ARCHIVED",
        },
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        destination: true,
        category: true,
      },
      orderBy: { bookedCount: "desc" },
    });

    if (dbTours && dbTours.length > 0) {
      formatted = dbTours.map((e: any) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        location: e.location,
        destinationSlug: e.destination?.slug || "",
        categorySlug: e.category?.slug || "",
        duration: e.duration,
        rating: e.rating,
        reviewCount: e.reviewCount,
        price: e.price,
        previousPrice: e.previousPrice,
        tourType: e.tourType,
        badge: e.badge,
        freeCancellation: e.freeCancellation,
        instantBook: e.instantBook,
        primaryImage: e.images[0]?.url || "/images/destinations/sigiriya.jpg",
      }));
    }
  } catch (e) {
    console.error("Prisma lookup in /tours server component failed:", e);
  }

  if (formatted.length === 0) {
    const stored = await getAllStoredTours().catch(() => []);
    if (stored && stored.length > 0) {
      formatted = stored
        .filter((t) => t.status !== "ARCHIVED")
        .map((t) => ({
          id: t.id,
          title: t.title,
          slug: t.slug,
          location: t.location,
          destinationSlug: t.destination?.slug || "",
          categorySlug: t.category?.slug || "",
          duration: t.duration,
          rating: t.rating || 5,
          reviewCount: t.reviewCount || 0,
          price: t.price,
          previousPrice: t.previousPrice,
          tourType: t.tourType,
          badge: t.badge,
          freeCancellation: t.freeCancellation,
          instantBook: t.instantBook,
          primaryImage: t.images?.[0]?.url || "/images/destinations/sigiriya.jpg",
        }));
    }
  }

  if (formatted.length > 0) {
    // Merge any catalog tours not yet in the DB results (ensuring multi-day packages appear)
    const existingSlugs = new Set(formatted.map((t: any) => t.slug));
    for (const t of TOURS_CATALOG) {
      if (!existingSlugs.has(t.slug)) {
        formatted.push({
          id: t.id,
          title: t.title,
          slug: t.slug,
          location: t.location,
          destinationSlug: t.destinationSlug,
          categorySlug: t.categorySlug,
          duration: t.duration,
          rating: t.rating,
          reviewCount: t.reviewCount,
          price: t.price,
          previousPrice: t.previousPrice,
          tourType: t.tourType,
          badge: t.badge,
          freeCancellation: t.freeCancellation,
          instantBook: t.instantBook,
          primaryImage: t.images[0]?.url || "/images/destinations/sigiriya.jpg",
        });
      }
    }
    return formatted;
  }

  // Fallback to static catalog if DB is unreachable
  return TOURS_CATALOG.map((t) => ({
    id: t.id,
    title: t.title,
    slug: t.slug,
    location: t.location,
    destinationSlug: t.destinationSlug,
    categorySlug: t.categorySlug,
    duration: t.duration,
    rating: t.rating,
    reviewCount: t.reviewCount,
    price: t.price,
    previousPrice: t.previousPrice,
    tourType: t.tourType,
    badge: t.badge,
    freeCancellation: t.freeCancellation,
    instantBook: t.instantBook,
    primaryImage: t.images[0]?.url || "/images/destinations/sigiriya.jpg",
  }));
}

function ToursCatalogueSkeleton() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="bg-luxury-forest rounded-3xl p-8 sm:p-12 text-luxury-ivory relative overflow-hidden shadow-2xl border border-luxury-gold/30">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-luxury-gold block">
            Curated Island Portfolios
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-luxury-ivory">
            Sri Lankan Journeys & Expeditions
          </h1>
          <p className="text-sm sm:text-base text-luxury-sand/85 font-light leading-relaxed">
            Private chauffeur circuits, wildlife safaris, scenic colonial rail journeys, and immersive heritage explorations crafted with Sri Lanka&apos;s foremost guides.
          </p>
        </div>
      </div>

      {/* Filter and Controls Header Placeholder */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-luxury-sand/80 shadow-sm">
        <div className="h-5 w-48 bg-luxury-sand/40 rounded-md" />
        <div className="h-8 w-36 bg-luxury-sand/40 rounded-xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-3xl p-6 h-96 border border-luxury-sand/80" />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl h-80 border border-luxury-sand/60"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ToursPage() {
  const initialTours = await getInitialTours();

  return (
    <Suspense fallback={<ToursCatalogueSkeleton />}>
      <ToursCatalogueClient initialTours={initialTours} />
    </Suspense>
  );
}
