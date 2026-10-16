import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { TourCard } from "@/components/tours/TourCard";
import { RichTextRenderer } from "@/components/common/RichTextRenderer";
import {
  DESTINATIONS_CATALOG,
  getDestinationBySlug,
} from "@/data/destinationsData";
import { getToursByDestination } from "@/data/toursData";
import { siteConfig } from "@/config/site";
import { MapPin, Calendar, Compass, Sun, Sparkles, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let dbDest: any = null;
  try {
    dbDest = await prisma.destination.findUnique({
      where: { slug: params.slug },
    });
  } catch (e) {}

  const dest = dbDest || getDestinationBySlug(params.slug);
  const title = dest?.seoTitle || (dest ? `${dest.name} Tours & Travel Guide | ${siteConfig.name}` : `Destination | ${siteConfig.name}`);
  const description = dest?.seoDescription || dest?.shortDesc || siteConfig.description;

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
      images: (dest?.thumbnail || dest?.image) ? [{ url: dest?.thumbnail || dest?.image, alt: dest?.name }] : undefined,
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

  // Parse Travel Overview & Extra Content from gallery JSON
  let galleryData: any = {};
  try {
    if (dest.gallery) {
      galleryData = typeof dest.gallery === "string" ? JSON.parse(dest.gallery) : dest.gallery;
    }
  } catch (e) {}

  // Parse Popular Attractions (handles both JSON array of objects/strings and comma-separated string)
  let attractionsList: Array<{ name: string; description?: string; tourSlug?: string }> = [];
  if (dest.popularAttractions) {
    try {
      const parsed = typeof dest.popularAttractions === "string" && dest.popularAttractions.startsWith("[")
        ? JSON.parse(dest.popularAttractions)
        : null;

      if (Array.isArray(parsed)) {
        attractionsList = parsed
          .filter((item: any) => item && (item.active !== false))
          .map((item: any) => {
            if (typeof item === "string") return { name: item };
            return {
              name: item.name || item.title || "",
              description: item.description || "",
              tourSlug: item.tourSlug || "",
            };
          })
          .filter((a) => a.name.trim().length > 0);
      } else {
        attractionsList = String(dest.popularAttractions)
          .split(",")
          .map((a: string) => ({ name: a.trim() }))
          .filter((a) => a.name.length > 0);
      }
    } catch (e) {
      attractionsList = String(dest.popularAttractions)
        .split(",")
        .map((a: string) => ({ name: a.trim() }))
        .filter((a) => a.name.length > 0);
    }
  }

  const heroBannerImage = dest.thumbnail || dest.image;
  const aboutHeading = galleryData?.aboutHeading || `About ${dest.name}`;
  const curatedExperiencesText = galleryData?.curatedExperiencesText || `${tours.length} Curated Tours & Bespoke Activities`;
  const travelTips = galleryData?.travelTips || "";
  const customButtonText = galleryData?.customButtonText || `Plan Custom Itinerary for ${dest.name}`;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Destination Hero Banner */}
      <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl flex items-end p-8 sm:p-12 border border-luxury-sand/80">
        <Image
          src={heroBannerImage}
          alt={dest.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-forest via-luxury-forest/50 to-transparent" />
        <div className="relative z-10 max-w-3xl space-y-3 text-white">
          <div className="flex items-center gap-2 text-xs text-luxury-gold font-mono uppercase tracking-[0.2em]">
            <MapPin className="w-4 h-4 text-luxury-gold" />
            <span>Sri Lanka Destination Guide</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-luxury-ivory tracking-tight leading-tight">
            {dest.name}
          </h1>
          <p className="text-xs sm:text-sm text-luxury-sand/90 leading-relaxed font-light max-w-2xl">
            {dest.shortDesc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* About Destination Section with Rich Text Renderer */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-forest tracking-tight">
              {aboutHeading}
            </h2>
            <div className="pt-1">
              <RichTextRenderer content={dest.longDesc || dest.shortDesc} />
            </div>
          </div>

          {/* Top Highlights & Attractions */}
          {attractionsList.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-luxury-sand/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-luxury-forest tracking-tight">
                  Top Highlights & Attractions
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {attractionsList.map((attr, idx) => {
                  const content = (
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-luxury-sand/80 hover:border-luxury-gold/50 transition-all space-y-1 h-full">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-semibold text-sm text-luxury-forest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                          <span>{attr.name}</span>
                        </span>
                        {attr.tourSlug && (
                          <ArrowRight className="w-3.5 h-3.5 text-luxury-gold" />
                        )}
                      </div>
                      {attr.description && (
                        <p className="text-xs text-luxury-charcoal/70 font-light leading-relaxed pl-3.5">
                          {attr.description}
                        </p>
                      )}
                    </div>
                  );

                  return attr.tourSlug ? (
                    <Link key={idx} href={`/tours/${attr.tourSlug}`}>
                      {content}
                    </Link>
                  ) : (
                    <div key={idx}>{content}</div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Travel Overview Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-luxury-sand/80 shadow-[0_10px_30px_rgba(16,45,36,0.05)] space-y-5">
            <div className="border-b border-luxury-sand/70 pb-3">
              <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-[0.2em] block">
                Travel Guide
              </span>
              <h3 className="font-serif text-lg font-semibold text-luxury-forest">
                Destination Overview
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-luxury-sand flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-luxury-gold" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-luxury-charcoal/50 block">Best Time to Visit</span>
                  <span className="font-serif text-xs font-semibold text-luxury-forest">{dest.bestTimeToVisit || "Year-round destination"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-luxury-sand flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 text-luxury-gold" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-luxury-charcoal/50 block">Curated Experiences</span>
                  <span className="font-serif text-xs font-semibold text-luxury-forest">{curatedExperiencesText}</span>
                </div>
              </div>

              {travelTips && (
                <div className="flex items-start gap-3 pt-2 border-t border-luxury-sand/50">
                  <div className="w-8 h-8 rounded-xl bg-white border border-luxury-sand flex items-center justify-center shrink-0">
                    <Sun className="w-4 h-4 text-luxury-gold" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-luxury-charcoal/50 block">Curator Tips & Climate</span>
                    <span className="text-xs text-luxury-charcoal/80 font-light leading-relaxed block">{travelTips}</span>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/plan-my-trip?destination=${dest.slug}`}
              className="w-full inline-flex items-center justify-center py-3.5 px-4 bg-luxury-forest hover:bg-luxury-gold text-luxury-ivory text-xs font-serif font-semibold uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-md group"
            >
              <span>{customButtonText}</span>
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
