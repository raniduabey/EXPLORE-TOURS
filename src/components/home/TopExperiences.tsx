"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { TourCard, TourCardData } from "@/components/tours/TourCard";

const defaultTours: TourCardData[] = [
  {
    id: "1",
    title: "Sigiriya Rock Fortress & Dambulla Cave Temple Day Tour",
    slug: "sigiriya-rock-dambulla-cave-temple-day-tour",
    location: "Sigiriya",
    duration: "Full Day",
    rating: 4.9,
    reviewCount: 240,
    price: 65,
    previousPrice: 85,
    tourType: "Private Tour",
    badge: "Bestseller",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Ella Scenic Blue Train & Nine Arch Bridge Experience",
    slug: "ella-scenic-train-nine-arch-bridge",
    location: "Ella",
    duration: "6 hours",
    rating: 4.9,
    reviewCount: 310,
    price: 45,
    previousPrice: 60,
    tourType: "Small Group",
    badge: "Likely to Sell Out",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Yala National Park Afternoon 4x4 Leopard Safari",
    slug: "yala-national-park-afternoon-safari",
    location: "Yala",
    duration: "5 hours",
    rating: 4.8,
    reviewCount: 180,
    price: 75,
    previousPrice: 95,
    tourType: "Private 4x4",
    badge: "Top Rated",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=800&auto=format&fit=crop"
  }
];

export const TopExperiences: React.FC<{ tours?: TourCardData[] }> = ({ tours: propTours }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: dir === "left" ? -380 : 380,
        behavior: "smooth"
      });
    }
  };

  const list = propTours && propTours.length > 0 ? propTours : defaultTours;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Featured Experiences Slideshow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ceylon-navy tracking-tight">
            Top Experiences in Sri Lanka
          </h2>
          <p className="text-sm text-ceylon-muted mt-2 max-w-xl">
            Handpicked bestsellers rated 4.8+ by international travelers with verified guides and instant booking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-ceylon-blue hover:bg-ceylon-softblue text-ceylon-navy flex items-center justify-center shadow-sm transition-colors"
              title="Slide Left"
            >
              <ChevronLeft className="w-5 h-5 text-ceylon-blue" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-ceylon-blue hover:bg-ceylon-softblue text-ceylon-navy flex items-center justify-center shadow-sm transition-colors"
              title="Slide Right"
            >
              <ChevronRight className="w-5 h-5 text-ceylon-blue" />
            </button>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ceylon-blue hover:text-ceylon-navy transition-colors pl-2"
          >
            <span>All 100+ Tours</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {list.map((t) => (
          <div key={t.id} className="min-w-[300px] sm:min-w-[360px] max-w-[360px] snap-start flex-shrink-0">
            <TourCard tour={t} />
          </div>
        ))}
      </div>
    </section>
  );
};
