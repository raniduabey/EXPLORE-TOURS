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
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { RichTextRenderer } from "@/components/common/RichTextRenderer";
import {
  Star,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  XCircle,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let title: string | undefined;
  let description: string | undefined;
  let image: string | undefined;

  try {
    const dbTour = await prisma.tour.findUnique({
      where: { slug: params.slug },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    });
    if (dbTour) {
      title = dbTour.seoTitle || dbTour.title;
      description = dbTour.seoDescription || dbTour.description.substring(0, 160);
      image = dbTour.images[0]?.url;
    }
  } catch (e) {}

  if (!title) {
    const catalogTour = getTourBySlug(params.slug);
    title = catalogTour?.title;
    description = catalogTour?.shortDescription;
    image = catalogTour?.images[0]?.url;
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
        reviews: {
          where: {
            status: {
              in: ["APPROVED", "approved", "Approved", "PUBLISHED", "published"],
            },
          },
          orderBy: { createdAt: "desc" },
        },
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
    if (Array.isArray(val)) {
      return val.map((v) => typeof v === "object" ? (v.text || v.name || JSON.stringify(v)) : String(v));
    }
    if (typeof val === "string") {
      try {
        const res = JSON.parse(val);
        if (Array.isArray(res)) {
          return res.map((v) => typeof v === "object" ? (v.text || v.name || JSON.stringify(v)) : String(v));
        }
      } catch (e) {
        return [val];
      }
    }
    return [];
  };

  const includes: string[] = safeParseArray(tour.includes);
  const excludes: string[] = safeParseArray(tour.excludes);

  // Dynamic Tour Information Bar Icons
  interface InfoItem {
    id: string;
    label: string;
    value: string;
    icon: string;
    enabled?: boolean;
  }

  let infoItems: InfoItem[] = [];
  try {
    if (tour.badge && typeof tour.badge === "string" && tour.badge.trim().startsWith("[")) {
      const parsed = JSON.parse(tour.badge);
      if (Array.isArray(parsed)) {
        infoItems = parsed.filter((item: any) => item && item.enabled !== false && item.label && item.value);
      }
    }
  } catch (e) {}

  if (infoItems.length === 0) {
    infoItems = [
      { id: "duration", label: "Duration", value: tour.duration || "Full Day", icon: "Clock", enabled: true },
      { id: "journeyType", label: "Journey Type", value: tour.tourType || "Private Tour", icon: "Compass", enabled: true },
      { id: "chauffeurGuide", label: "Chauffeur Guide", value: tour.liveGuide || (tour.languages ? `English & ${tour.languages}` : "English (Native)"), icon: "Languages", enabled: true },
      { id: "cancellation", label: "Cancellation", value: tour.freeCancellation ? "Free up to 24h" : "Non-refundable", icon: "CheckCircle", enabled: true },
    ];
  }

  // Curator's Highlights
  let curatorHighlights: {
    title: string;
    subtitle?: string;
    enabled?: boolean;
    items: Array<{ id: string; text: string; icon?: string }>;
  } = {
    title: "Curator's Highlights",
    subtitle: "Signature moments hand-selected by our private Ceylon travel curators",
    enabled: true,
    items: [],
  };

  try {
    if (tour.highlights) {
      if (typeof tour.highlights === "string" && tour.highlights.trim().startsWith("{")) {
        const obj = JSON.parse(tour.highlights);
        curatorHighlights = {
          title: obj.title || "Curator's Highlights",
          subtitle: obj.subtitle || "",
          enabled: obj.enabled !== false,
          items: Array.isArray(obj.items)
            ? obj.items.map((it: any, idx: number) => typeof it === "string" ? { id: String(idx), text: it, icon: "Sparkles" } : { id: it.id || String(idx), text: it.text || "", icon: it.icon || "Sparkles" })
            : [],
        };
      } else {
        const arr = safeParseArray(tour.highlights);
        curatorHighlights.items = arr.map((text, idx) => ({ id: String(idx), text, icon: "Sparkles" }));
      }
    }
  } catch (e) {}

  // Signature Experiences Included
  let signatureExperiences: {
    heading: string;
    subtitle?: string;
    enabled?: boolean;
    experiences: Array<{ id: string; title: string; description: string; icon?: string; tag?: string }>;
  } = {
    heading: "Signature Experiences Included",
    subtitle: "Exclusive moments reserved for private Ceylon journeys",
    enabled: true,
    experiences: [],
  };

  try {
    if (tour.whatToBring && typeof tour.whatToBring === "string" && tour.whatToBring.trim().startsWith("{")) {
      const obj = JSON.parse(tour.whatToBring);
      signatureExperiences = {
        heading: obj.heading || "Signature Experiences Included",
        subtitle: obj.subtitle || "",
        enabled: obj.enabled !== false,
        experiences: Array.isArray(obj.experiences) ? obj.experiences : [],
      };
    }
  } catch (e) {}

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
          <div className="flex items-center gap-2 text-xs font-sans text-luxury-charcoal/60">
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
                  <span className="font-sans font-semibold text-luxury-forest ml-1">
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

        {/* Dynamic Tour Information Icons Bar */}
        {infoItems.length > 0 && (
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-luxury-sand/80 shadow-sm">
            {infoItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white border border-luxury-sand flex items-center justify-center shrink-0">
                  <DynamicIcon icon={item.icon} className="w-5 h-5 text-luxury-gold" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-luxury-charcoal/50 uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <span className="text-xs font-sans font-semibold text-luxury-forest">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Overview with RichTextRenderer */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal text-luxury-forest tracking-tight">Overview</h3>
              <div className="text-sm sm:text-base text-luxury-charcoal/80 font-light leading-relaxed">
                <RichTextRenderer content={tour.description} />
              </div>
            </div>

            {/* Curator's Highlights Card */}
            {curatorHighlights.enabled !== false && curatorHighlights.items.length > 0 && (
              <div className="space-y-4 bg-luxury-forest text-luxury-ivory p-7 sm:p-8 rounded-3xl border border-luxury-gold/30 shadow-xl">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-luxury-gold tracking-wide">
                    {curatorHighlights.title}
                  </h3>
                  {curatorHighlights.subtitle && (
                    <p className="text-xs font-light text-luxury-sand/80 mt-1">
                      {curatorHighlights.subtitle}
                    </p>
                  )}
                </div>
                <ul className="space-y-3 pt-2">
                  {curatorHighlights.items.map((h, i) => (
                    <li key={h.id || i} className="flex items-start gap-3 text-xs sm:text-sm font-light text-luxury-sand/95">
                      <DynamicIcon icon={h.icon || "Sparkles"} className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                      <span>{h.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Signature Experiences Included */}
            {signatureExperiences.enabled !== false && signatureExperiences.experiences.length > 0 && (
              <div className="space-y-5 p-7 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-luxury-sand/80 shadow-sm">
                <div>
                  <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-[0.25em] block">
                    Bespoke Curations
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-luxury-forest tracking-wide">
                    {signatureExperiences.heading}
                  </h3>
                  {signatureExperiences.subtitle && (
                    <p className="text-xs text-luxury-charcoal/70 font-light mt-1">
                      {signatureExperiences.subtitle}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {signatureExperiences.experiences.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-5 rounded-2xl bg-white border border-luxury-sand/80 space-y-2 hover:border-luxury-gold/50 transition-all shadow-[0_2px_10px_rgba(16,45,36,0.02)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <DynamicIcon icon={exp.icon || "Sparkles"} className="w-4 h-4 text-luxury-gold shrink-0" />
                          <h4 className="font-serif text-sm font-semibold text-luxury-forest">
                            {exp.title}
                          </h4>
                        </div>
                        {exp.tag && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-luxury-forest text-luxury-gold">
                            {exp.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-luxury-charcoal/75 font-light leading-relaxed pl-6">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ItineraryTimeline items={tour.itinerary || []} tourType={tour.tourType} />

            {/* What's Included & What's Excluded */}
            {(includes.length > 0 || excludes.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {includes.length > 0 && (
                  <div className="bg-white p-6 sm:p-7 rounded-3xl border border-luxury-sand/80 shadow-sm space-y-4">
                    <h4 className="font-serif text-base font-semibold text-luxury-forest flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-luxury-gold" />
                      <span>What&apos;s Included</span>
                    </h4>
                    <ul className="space-y-2.5 text-xs text-luxury-charcoal/80">
                      {includes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {excludes.length > 0 && (
                  <div className="bg-white p-6 sm:p-7 rounded-3xl border border-luxury-sand/80 shadow-sm space-y-4">
                    <h4 className="font-serif text-base font-semibold text-luxury-forest flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>What&apos;s Excluded</span>
                    </h4>
                    <ul className="space-y-2.5 text-xs text-luxury-charcoal/80">
                      {excludes.map((exc, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

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
