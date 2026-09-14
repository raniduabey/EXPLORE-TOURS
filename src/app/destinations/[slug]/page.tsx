import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { TourCard } from "@/components/tours/TourCard";
import {
  DESTINATIONS_CATALOG,
  getDestinationBySlug,
} from "@/data/destinationsData";
import { getToursByDestination } from "@/data/toursData";
import { siteConfig } from "@/config/site";
import { MapPin, Calendar, Compass } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const dest = getDestinationBySlug(params.slug);
  const title = dest ? `${dest.name} Tours & Travel Guide | ${siteConfig.name}` : `Destination | ${siteConfig.name}`;
  const description = dest?.shortDesc || siteConfig.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/destinations/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/destinations/${params.slug}`,
      images: dest?.image ? [{ url: dest.image, alt: dest.name }] : undefined,
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: { slug: string };
}) {
  let dest: any = null;

  try {
    dest = await prisma.destination.findUnique({
      where: { slug: params.slug },
      include: {
        tours: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
    });
  } catch (e) {
    console.error("Prisma destination lookup error", e);
  }

  if (!dest) {
    const catalogDest = getDestinationBySlug(params.slug);
    if (!catalogDest) {
      notFound();
    }
    dest = { ...catalogDest, tours: [] };
  }

  // Load tours for this destination
  let tours = (dest.tours || []).map((t: any) => ({
    id: t.id,
    title: t.title,
    slug: t.slug,
    location: t.location,
    duration: t.duration,
    rating: t.rating,
    reviewCount: t.reviewCount,
    price: t.price,
    previousPrice: t.previousPrice,
    tourType: t.tourType,
    badge: t.badge,
    freeCancellation: t.freeCancellation,
    instantBook: t.instantBook,
    primaryImage: t.images?.[0]?.url || dest.image,
  }));

  // If no DB tours attached, pull matching tours from TOURS_CATALOG
  if (tours.length === 0) {
    const catalogTours = getToursByDestination(params.slug);
    tours = catalogTours.map((t) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      location: t.location,
      duration: t.duration,
      rating: t.rating,
      reviewCount: t.reviewCount,
      price: t.price,
      previousPrice: t.previousPrice,
      tourType: t.tourType,
      badge: t.badge,
      freeCancellation: t.freeCancellation,
      instantBook: t.instantBook,
      primaryImage: t.images?.[0]?.url || dest.image,
    }));
  }

  const attractions = (dest.popularAttractions || "")
    .split(",")
    .map((a: string) => a.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl flex items-end p-8 sm:p-12">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy/95 via-ceylon-navy/60 to-transparent" />
        <div className="relative z-10 max-w-3xl space-y-3 text-white">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Sri Lanka Destination Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {dest.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {dest.shortDesc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-ceylon-navy tracking-tight">
              About {dest.name}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
              {dest.longDesc}
            </p>
          </div>

          {attractions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-ceylon-navy tracking-tight">
                Top Highlights & Attractions
              </h3>
              <div className="flex flex-wrap gap-2">
                {attractions.map((attr: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-ceylon-softblue text-ceylon-navy border border-ceylon-blue/20"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
            <h3 className="text-sm font-extrabold text-ceylon-navy uppercase tracking-wider">
              Travel Overview
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-ceylon-blue shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ceylon-navy block">Best Time to Visit:</span>
                  <span>{dest.bestTimeToVisit || "Year-round destination"}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-ceylon-green shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ceylon-navy block">Curated Experiences:</span>
                  <span>{tours.length} Verified Day Tours & Activities</span>
                </div>
              </div>
            </div>
            <Link
              href={`/plan-my-trip?destination=${dest.slug}`}
              className="w-full inline-flex items-center justify-center py-3 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-bold rounded-xl transition-colors shadow"
            >
              Plan Custom Itinerary for {dest.name}
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-extrabold text-ceylon-navy tracking-tight">
              Tours & Experiences in {dest.name}
            </h3>
            <p className="text-xs text-ceylon-muted mt-1">
              Handpicked authentic activities led by licensed local guides.
            </p>
          </div>
          <span className="text-xs font-bold text-ceylon-blue">
            {tours.length} available
          </span>
        </div>

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t: any) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-lg font-bold text-ceylon-navy">
              Custom Experiences Coming Soon
            </h4>
            <p className="text-xs text-ceylon-muted max-w-sm mx-auto">
              Our team is currently curating new bespoke tours for this destination. Contact our local trip specialists to organize a private guide.
            </p>
            <Link
              href="/plan-my-trip"
              className="inline-block px-5 py-2.5 bg-ceylon-green text-white text-xs font-bold rounded-xl"
            >
              Request Custom Tour
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
