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
        images: true,
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
          "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=800&auto=format&fit=crop",
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

  const highlights: string[] = tour.highlights
    ? typeof tour.highlights === "string"
      ? JSON.parse(tour.highlights)
      : tour.highlights
    : [];
  const includes: string[] = tour.includes
    ? typeof tour.includes === "string"
      ? JSON.parse(tour.includes)
      : tour.includes
    : [];
  const excludes: string[] = tour.excludes
    ? typeof tour.excludes === "string"
      ? JSON.parse(tour.excludes)
      : tour.excludes
    : [];

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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.rating,
      reviewCount: tour.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    provider: {
      "@type": "TravelAgency",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-ceylon-muted">
            <span className="font-semibold text-ceylon-blue">
              {tour.destination?.name || tour.location}
            </span>
            <span>/</span>
            <span>{tour.category?.name || "Tours"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ceylon-navy tracking-tight leading-tight">
            {tour.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-extrabold text-ceylon-navy ml-1">
                {tour.rating.toFixed(1)}
              </span>
              <span className="text-ceylon-muted ml-1">
                ({tour.reviewCount} verified reviews)
              </span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-ceylon-navy font-semibold">
              {tour.bookedCount}+ Travellers Booked
            </span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Local Experience</span>
            </div>
          </div>
        </div>

        <ImageGallery images={tour.images || []} title={tour.title} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-ceylon-blue" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
              <span className="text-xs font-bold text-ceylon-navy">{tour.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-ceylon-blue" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Tour Type</span>
              <span className="text-xs font-bold text-ceylon-navy">{tour.tourType}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-ceylon-blue" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Live Guide</span>
              <span className="text-xs font-bold text-ceylon-navy">{tour.liveGuide || "English"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-ceylon-green" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Cancellation</span>
              <span className="text-xs font-bold text-ceylon-green">Free up to 24h</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-ceylon-navy tracking-tight">Overview</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {tour.description}
              </p>
            </div>

            {highlights.length > 0 && (
              <div className="space-y-4 bg-ceylon-softblue/60 p-6 rounded-3xl border border-ceylon-blue/20">
                <h3 className="text-lg font-extrabold text-ceylon-navy tracking-tight">
                  Experience Highlights
                </h3>
                <ul className="space-y-2.5">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs font-semibold text-ceylon-navy">
                      <CheckCircle className="w-4 h-4 text-ceylon-green shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ItineraryTimeline items={tour.itinerary || []} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <h4 className="font-extrabold text-sm text-ceylon-navy flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-ceylon-green" />
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
            />
          </div>

          <div className="lg:col-span-1">
            <BookingWidget
              tourId={tour.id}
              tourTitle={tour.title}
              tourSlug={tour.slug}
              tourImage={
                tour.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=800&auto=format&fit=crop"
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
