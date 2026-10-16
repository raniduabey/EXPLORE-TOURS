import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getTourBySlug, TOURS_CATALOG } from "@/data/toursData";
import { ImageGallery } from "@/components/tour-detail/ImageGallery";
import { BookingWidget } from "@/components/tour-detail/BookingWidget";
import { ItineraryTimeline } from "@/components/tour-detail/ItineraryTimeline";
import { ReviewsBreakdown } from "@/components/tour-detail/ReviewsBreakdown";
import { TourCard } from "@/components/tours/TourCard";
import { siteConfig } from "@/config/site";
import {
  Star,
  ShieldCheck,
  Clock,
  Users,
  Languages,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const catalogTour = getTourBySlug(params.slug);
  let title = catalogTour?.title;
  let description = catalogTour?.shortDescription;
  let image = catalogTour?.images[0]?.url;

  if (!title) {
    try {
      const dbTour = await prisma.tour.findUnique({
        where: { slug: params.slug },
        include: { images: { where: { isPrimary: true }, take: 1 } },
      });
      if (dbTour) {
        title = dbTour.title;
        description = dbTour.description.substring(0, 160);
        image = dbTour.images[0]?.url;
      }
    } catch (e) {}
  }

  if (!title) {
    return {
      title: `Tour Not Found | ${siteConfig.name}`,
    };
  }

  const pageUrl = `${siteConfig.url}/tours/${params.slug}`;

  return {
    title: `${title} | ${siteConfig.name}`,
    description: description || siteConfig.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      url: pageUrl,
      type: "website",
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let tour: any = null;

  try {
    tour = await prisma.tour.findUnique({
      where: { slug: params.slug },
      include: {
        images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] },
        itinerary: { orderBy: { stepNumber: "asc" } },
        reviews: { orderBy: { createdAt: "desc" } },
        destination: true,
        category: true,
      },
    });
  } catch (e) {
    console.error("Prisma lookup error in tour detail:", e);
  }

  // If not found in DB, pull the exact tour from the verified TOURS_CATALOG
  if (!tour) {
    const catalogTour = getTourBySlug(params.slug);
    if (!catalogTour) {
      notFound();
    }
    tour = {
      id: catalogTour.id,
      title: catalogTour.title,
      slug: catalogTour.slug,
      location: catalogTour.location,
      duration: catalogTour.duration,
      durationHours: catalogTour.durationHours,
      rating: catalogTour.rating,
      reviewCount: catalogTour.reviewCount,
      bookedCount: catalogTour.bookedCount,
      tourType: catalogTour.tourType,
      liveGuide: catalogTour.liveGuide,
      price: catalogTour.price,
      previousPrice: catalogTour.previousPrice,
      freeCancellation: catalogTour.freeCancellation,
      instantBook: catalogTour.instantBook,
      description: catalogTour.description,
      importantInfo: catalogTour.importantInfo,
      whatToBring: catalogTour.whatToBring,
      highlights: catalogTour.highlights,
      includes: catalogTour.includes,
      excludes: catalogTour.excludes,
      images: catalogTour.images,
      itinerary: catalogTour.itinerary,
      reviews: catalogTour.reviews,
      destination: { name: catalogTour.destinationName },
      category: { name: catalogTour.categoryName },
    };
  }

  // Fetch genuine other tours
  let otherTours: any[] = [];
  try {
    const rawOthers = await prisma.tour.findMany({
      where: { slug: { not: params.slug } },
      take: 3,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
    });
    if (rawOthers && rawOthers.length > 0) {
      otherTours = rawOthers.map((t: any) => ({
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
        primaryImage:
          t.images[0]?.url ||
          "/images/destinations/sigiriya.jpg",
      }));
    }
  } catch (e) {}

  if (otherTours.length === 0) {
    otherTours = TOURS_CATALOG.filter((t) => t.slug !== params.slug)
      .slice(0, 3)
      .map((t) => ({
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
        primaryImage: t.images[0]?.url,
      }));
  }

  const safeParseArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const res = JSON.parse(val);
        if (Array.isArray(res)) return res;
      } catch (e) {
        return [val];
      }
    }
    return [];
  };

  const highlights: string[] = safeParseArray(tour.highlights);
  const includes: string[] = safeParseArray(tour.includes);
  const excludes: string[] = safeParseArray(tour.excludes);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.description,
    touristType: tour.tourType,
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/tours/${tour.slug}`,
    },
    ...(tour.reviewCount > 0 && tour.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tour.rating,
            reviewCount: tour.reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    provider: {
      "@type": "TravelAgency",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  const hasReviews = (tour.reviewCount || 0) > 0 && (tour.rating || 0) > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-serif text-luxury-charcoal/60">
            <span className="font-semibold text-luxury-forest">
              {tour.destination?.name || tour.location}
            </span>
            <span>/</span>
            <span>{tour.category?.name || "Journeys"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight leading-[1.1]">
            {tour.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {hasReviews && (
              <>
                <div className="flex items-center text-luxury-gold">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-serif font-bold text-luxury-forest ml-1">
                    {tour.rating.toFixed(1)}
                  </span>
                  <span className="text-luxury-charcoal/60 font-sans ml-1 text-[11px]">
                    ({tour.reviewCount} verified {tour.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
                <span className="text-luxury-sand">•</span>
              </>
            )}
            <div className="flex items-center gap-1 text-luxury-forest font-mono text-[10px] uppercase tracking-wider bg-luxury-sand/40 border border-luxury-sand px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" />
              <span>SLTDA Certified Chauffeur Tour</span>
            </div>
            <span className="text-luxury-sand">•</span>
            <span className="text-luxury-charcoal/70 font-sans text-xs">
              100% Bespoke Private Journey
            </span>
          </div>
        </div>

        <ImageGallery images={tour.images || []} title={tour.title} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-[#FAF8F5] border border-luxury-sand/80 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-luxury-sand flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-luxury-charcoal/50 uppercase tracking-wider block">Duration</span>
              <span className="text-xs font-serif font-semibold text-luxury-forest">{tour.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-luxury-sand flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-luxury-charcoal/50 uppercase tracking-wider block">Journey Type</span>
              <span className="text-xs font-serif font-semibold text-luxury-forest">{tour.tourType}</span>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-luxury-sand flex items-center justify-center shrink-0">
              <Languages className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-luxury-charcoal/50 uppercase tracking-wider block">Chauffeur Guide</span>
              <span className="text-xs font-serif font-semibold text-luxury-forest">{tour.liveGuide || "English (Native)"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-luxury-sand flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-luxury-charcoal/50 uppercase tracking-wider block">Cancellation</span>
              <span className="text-xs font-serif font-semibold text-luxury-forest">Free up to 24h</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal text-luxury-forest tracking-tight">Overview</h3>
              <p className="text-sm sm:text-base text-luxury-charcoal/80 font-light leading-relaxed whitespace-pre-line">
                {tour.description}
              </p>
            </div>

            {highlights.length > 0 && (
              <div className="space-y-4 bg-luxury-forest text-luxury-ivory p-7 sm:p-8 rounded-3xl border border-luxury-gold/30 shadow-xl">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-luxury-gold block">
                  Curator&apos;s Highlights
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-luxury-ivory">
                  Signature Experiences Included
                </h3>
                <ul className="space-y-3 pt-1">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-light text-luxury-sand/90">
                      <CheckCircle className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ItineraryTimeline items={tour.itinerary || []} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-luxury-sand/80 shadow-sm space-y-3">
                <h4 className="font-serif text-base font-semibold text-luxury-forest flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-luxury-gold" />
                  What&apos;s Included
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {includes.map((inc, i) => (
                    <li key={i}>• {inc}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <h4 className="font-extrabold text-sm text-ceylon-navy flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  What&apos;s Excluded
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {excludes.map((exc, i) => (
                    <li key={i}>• {exc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {tour.importantInfo && (
              <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/60 space-y-2 text-xs text-amber-900">
                <h4 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-950">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  Important Information & What to Bring
                </h4>
                <p className="leading-relaxed">{tour.importantInfo}</p>
                {tour.whatToBring && (
                  <p className="font-semibold pt-1">What to bring: {tour.whatToBring}</p>
                )}
              </div>
            )}

            <ReviewsBreakdown
              rating={tour.rating}
              reviewCount={tour.reviewCount}
              reviews={tour.reviews || []}
              tourId={tour.id}
              tourTitle={tour.title}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingWidget
              tourId={tour.id}
              tourTitle={tour.title}
              tourSlug={tour.slug}
              tourImage={
                tour.images?.[0]?.url ||
                "/images/destinations/sigiriya.jpg"
              }
              location={tour.location}
              price={tour.price}
              previousPrice={tour.previousPrice}
            />
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h3 className="text-2xl font-extrabold text-ceylon-navy tracking-tight">
            You May Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
