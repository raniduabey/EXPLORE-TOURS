"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Star, Clock, CheckCircle, Zap } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";

export interface TourCardData {
  id: string;
  title: string;
  slug: string;
  location: string;
  duration: string;
  rating: number;
  reviewCount: number;
  price: number;
  previousPrice?: number | null;
  tourType: string;
  badge?: string | null;
  freeCancellation?: boolean;
  instantBook?: boolean;
  primaryImage?: string;
}

const fallbackImages: Record<string, string> = {
  galle: "https://images.unsplash.com/photo-1566296566002-390b1062b186?q=80&w=1000&auto=format&fit=crop",
  colombo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000&auto=format&fit=crop",
  sigiriya: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1000&auto=format&fit=crop",
  ella: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop",
  mirissa: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop",
  yala: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1000&auto=format&fit=crop",
};

export const TourCard: React.FC<{ tour: TourCardData }> = ({ tour }) => {
  const { formatPrice } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imgError, setImgError] = useState(false);

  const isSaved = isInWishlist(tour.id);
  const locLower = tour.location?.toLowerCase() || "";
  const imageUrl = imgError
    ? fallbackImages[locLower] || "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1000&auto=format&fit=crop"
    : tour.primaryImage || "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgError(true)}
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {tour.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-amber-400 text-amber-950 shadow-sm">
              {tour.badge}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(tour.id);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 ${
            isSaved ? "bg-white text-rose-500 shadow-md" : "bg-black/30 text-white hover:bg-white hover:text-rose-500"
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-medium">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{tour.location}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-extrabold text-ceylon-navy ml-1">{tour.rating?.toFixed(1) || "4.9"}</span>
            </div>
            <span className="text-ceylon-muted">({tour.reviewCount || 120} reviews)</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[11px] font-medium">{tour.tourType || "Private"}</span>
          </div>

          <Link href={`/tours/${tour.slug}`} className="block">
            <h3 className="font-bold text-sm sm:text-base text-ceylon-navy group-hover:text-ceylon-blue transition-colors line-clamp-2 leading-snug">
              {tour.title}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-ceylon-muted pt-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-ceylon-blue" />
              <span>{tour.duration}</span>
            </div>
            {tour.freeCancellation !== false && (
              <div className="flex items-center gap-1 text-emerald-700">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Free cancellation</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">From</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-ceylon-navy">
                {formatPrice(tour.price)}
              </span>
              {tour.previousPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(tour.previousPrice)}
                </span>
              )}
            </div>
          </div>
          <Link
            href={`/tours/${tour.slug}`}
            className="px-3.5 py-1.5 rounded-xl bg-ceylon-softblue text-ceylon-blue hover:bg-ceylon-blue hover:text-white font-bold text-xs transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
};
