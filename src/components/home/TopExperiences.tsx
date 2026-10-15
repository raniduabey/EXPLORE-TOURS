"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { TourCard, TourCardData } from "@/components/tours/TourCard";
import { FadeIn } from "@/components/ui/motion";

const defaultTours: TourCardData[] = [
  {
    id: "tour-8day-splendour",
    title: "8-Day Splendour of Sri Lanka Classical Circuit",
    slug: "8-day-splendour-of-sri-lanka-classical-circuit",
    location: "Sigiriya, Kandy, Ella, Yala & Mirissa",
    duration: "8 Days / 7 Nights",
    rating: 0,
    reviewCount: 0,
    price: 430,
    tourType: "Private Tour Package",
    badge: "Bestseller Circuit",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "/images/destinations/ella.jpg"
  },
  {
    id: "tour-sigiriya",
    title: "Sigiriya Rock Fortress & Dambulla Cave Temple Day Tour",
    slug: "sigiriya-rock-fortress-dambulla-day-tour",
    location: "Sigiriya & Dambulla",
    duration: "10 Hours",
    rating: 0,
    reviewCount: 0,
    price: 85,
    tourType: "Private Tour",
    badge: "Bestseller",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "/images/destinations/sigiriya.jpg"
  },
  {
    id: "tour-14day-grand",
    title: "14-Day Sri Lanka All-in-One Classic Grand Tour",
    slug: "14-day-sri-lanka-all-in-one-classic-grand-tour",
    location: "Complete Islandwide Circuit",
    duration: "14 Days / 13 Nights",
    rating: 0,
    reviewCount: 0,
    price: 1050,
    tourType: "Grand Private Tour",
    badge: "Most Comprehensive",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "/images/destinations/anuradhapura.jpg"
  },
  {
    id: "tour-ella",
    title: "Scenic Ella Blue Train, Little Adam's Peak & Nine Arch Bridge",
    slug: "kandy-to-ella-scenic-train-journey",
    location: "Ella Highlands",
    duration: "8 Hours",
    rating: 0,
    reviewCount: 0,
    price: 65,
    tourType: "Small Group / Private",
    badge: "Popular Experience",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "/images/destinations/ella.jpg"
  },
  {
    id: "tour-yala",
    title: "Yala National Park Leopard Safari in Private 4x4 Jeep",
    slug: "yala-national-park-safari",
    location: "Yala National Park",
    duration: "6 Hours",
    rating: 0,
    reviewCount: 0,
    price: 95,
    tourType: "Private 4x4",
    badge: "Top Wildlife",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "/images/destinations/yala.jpg"
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
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Featured Experiences Slideshow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ceylon-navy tracking-tight">
            Top Experiences in Sri Lanka
          </h2>
          <p className="text-sm text-ceylon-muted mt-2 max-w-xl">
            Handpicked Sri Lankan journeys with certified local guides, private vehicles, and instant booking confirmation.
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
            <span>View All Experiences</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeIn>

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
