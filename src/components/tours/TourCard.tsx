"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, CheckCircle } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export interface TourCardData {
  id: string;
  title: string;
  slug: string;
  location: string;
  duration: string;
  rating?: number;
  reviewCount?: number;
  price: number;
  previousPrice?: number | null;
  tourType: string;
  badge?: string | null;
  freeCancellation?: boolean;
  instantBook?: boolean;
  primaryImage?: string;
}

const fallbackImages: Record<string, string> = {
  galle: "/images/destinations/galle.jpg",
  colombo: "/images/destinations/colombo.jpg",
  sigiriya: "/images/destinations/sigiriya.jpg",
  ella: "/images/destinations/ella.jpg",
  mirissa: "/images/destinations/mirissa.jpg",
  yala: "/images/destinations/yala.jpg",
};

export function getBadgeLabel(badge: any, fallback?: string): string | null {
  if (!badge) return fallback || null;
  if (typeof badge === "string") {
    const trimmed = badge.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const item = parsed.find((b: any) => b?.enabled !== false && (b?.label || b?.value || b?.text));
          return item ? (item.value || item.label || item.text) : (fallback || null);
        }
        if (typeof parsed === "object" && parsed !== null) {
          return parsed.value || parsed.label || parsed.text || fallback || null;
        }
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  }
  if (Array.isArray(badge)) {
    const item = badge.find((b: any) => b?.enabled !== false && (b?.label || b?.value || b?.text));
    return item ? (item.value || item.label || item.text) : (fallback || null);
  }
  if (typeof badge === "object" && badge !== null) {
    return badge.value || badge.label || badge.text || fallback || null;
  }
  return String(badge);
}

export const TourCard: React.FC<{ tour: TourCardData; searchParamsString?: string }> = ({
  tour,
  searchParamsString,
}) => {
  const { formatPrice } = useCurrency();
  const [imgError, setImgError] = useState(false);

  const locLower = tour.location ? tour.location.toLowerCase() : "";
  const imageUrl = imgError
    ? fallbackImages[locLower] || "/images/destinations/sigiriya.jpg"
    : tour.primaryImage || "/images/destinations/sigiriya.jpg";

  const hasGenuineReviews = (tour.reviewCount ?? 0) > 0 && (tour.rating ?? 0) > 0;
  const badgeText = getBadgeLabel(tour.badge);
  const tourHref = searchParamsString
    ? `/tours/${tour.slug}?${searchParamsString}`
    : `/tours/${tour.slug}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group bg-white rounded-2xl overflow-hidden border border-luxury-sand/80 hover:border-luxury-gold/50 shadow-[0_10px_30px_rgba(16,45,36,0.06)] hover:shadow-[0_20px_40px_rgba(16,45,36,0.12)] transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-luxury-sand/20">
        <Image
          src={imageUrl}
          alt={tour.title || "Tour package"}
          fill
          unoptimized={imageUrl.startsWith("/api/media/") || imageUrl.startsWith("data:")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgError(true)}
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {badgeText && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-[0.16em] bg-luxury-forest/90 text-luxury-gold border border-luxury-gold/30 backdrop-blur-md shadow-sm">
              {badgeText}
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-forest/80 backdrop-blur-md text-luxury-ivory text-[11px] font-sans font-medium">
          <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
          <span>{tour.location || "Sri Lanka"}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs">
            {hasGenuineReviews && (
              <>
                <div className="flex items-center text-luxury-gold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-sans font-semibold text-luxury-forest ml-1">
                    {(tour.rating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-luxury-charcoal/60 text-[11px] font-sans">
                  ({tour.reviewCount} {tour.reviewCount === 1 ? "review" : "reviews"})
                </span>
                <span className="text-luxury-sand">•</span>
              </>
            )}
            <span className="text-luxury-forest/80 font-sans text-xs font-semibold uppercase tracking-wider">
              {tour.tourType || "Private Tour"}
            </span>
          </div>

          <div className="min-h-[2.75rem] sm:min-h-[3.25rem] flex items-start">
            <Link href={tourHref} className="block">
              <h3 className="font-serif font-medium text-base sm:text-lg text-luxury-forest group-hover:text-luxury-gold transition-colors line-clamp-2 leading-snug">
                {tour.title}
              </h3>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-luxury-charcoal/70 pt-1">
            <div className="flex items-center gap-1.5 font-sans">
              <Clock className="w-3.5 h-3.5 text-luxury-gold" />
              <span>{tour.duration}</span>
            </div>
            {tour.freeCancellation !== false && (
              <div className="flex items-center gap-1.5 text-luxury-emerald font-sans">
                <CheckCircle className="w-3.5 h-3.5 text-luxury-gold" />
                <span>Bespoke cancellation</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-3.5 border-t border-luxury-sand/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-widest text-luxury-charcoal/50 block font-medium">From</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl sm:text-2xl font-normal text-luxury-forest">
                {formatPrice(tour.price)}
              </span>
              {tour.previousPrice && tour.previousPrice > tour.price && (
                <span className="text-xs text-luxury-charcoal/40 line-through">
                  {formatPrice(tour.previousPrice)}
                </span>
              )}
            </div>
          </div>
          <Link
            href={tourHref}
            className="px-4 py-2 rounded-full bg-luxury-forest/5 hover:bg-luxury-forest text-luxury-forest hover:text-luxury-ivory border border-luxury-forest/20 hover:border-luxury-forest font-sans font-semibold text-xs uppercase tracking-wider transition-all duration-200"
          >
            View Journey
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
