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
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [list, setList] = React.useState<TourCardData[]>(
    propTours && propTours.length > 0 ? propTours : defaultTours
  );

  React.useEffect(() => {
    if (propTours && propTours.length > 0) {
      setList(propTours);
    }
  }, [propTours]);

  React.useEffect(() => {
    fetch(`/api/tours?_t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setList(data.slice(0, 8));
        }
      })
      .catch(() => {});
  }, []);

  const checkScroll = React.useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, list]);

  const scroll = (dir: "left" | "right") => {
    if (containerRef.current) {
      const container = containerRef.current;
      const width = container.clientWidth;
      let step = width;
      if (window.innerWidth >= 1024) {
        // Desktop: Exactly 1 card width + 24px gap
        step = (width - 48) / 3 + 24;
      } else if (window.innerWidth >= 640) {
        // Tablet: 1 card width + 20px gap
        step = (width - 20) / 2 + 20;
      } else {
        // Mobile: 1 card width + 20px gap
        step = width * 0.86 + 20;
      }

      container.scrollBy({
        left: dir === "left" ? -step : step,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="pt-12 sm:pt-16 lg:pt-18 pb-6 sm:pb-8 lg:pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15392D]/5 border border-[#C5A46B]/30 text-[#C5A46B] text-[10px] font-mono uppercase tracking-[0.25em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A46B]" />
            <span>Curated Island Journeys</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#15392D] tracking-tight">
            Exceptional Sri Lankan Experiences
          </h2>
          <p className="text-sm sm:text-base text-[#59645E] font-sans font-normal mt-2 max-w-2xl leading-relaxed">
            Thoughtfully designed itineraries led by licensed private chauffeur-guides, featuring boutique heritage stays, seamless logistics, and intimate island encounters.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full border flex items-center justify-center shadow-sm transition-all ${
                canScrollLeft
                  ? "bg-white border-[#E7E2D8] hover:border-[#C5A46B] hover:text-[#C5A46B] text-[#15392D] cursor-pointer active:scale-95"
                  : "bg-white/50 border-[#E7E2D8]/50 text-[#59645E]/30 cursor-not-allowed"
              }`}
              title="Previous Experience"
              aria-label="Previous Experience"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full border flex items-center justify-center shadow-sm transition-all ${
                canScrollRight
                  ? "bg-white border-[#E7E2D8] hover:border-[#C5A46B] hover:text-[#C5A46B] text-[#15392D] cursor-pointer active:scale-95"
                  : "bg-white/50 border-[#E7E2D8]/50 text-[#59645E]/30 cursor-not-allowed"
              }`}
              title="Next Experience"
              aria-label="Next Experience"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#15392D] hover:text-[#C5A46B] transition-colors pl-2"
          >
            <span>View All Journeys</span>
            <ArrowRight className="w-4 h-4 text-[#C5A46B]" />
          </Link>
        </div>
      </FadeIn>

      <div
        ref={containerRef}
        className="w-full max-w-full flex gap-5 sm:gap-6 overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-none scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {list.map((t) => (
          <div
            key={t.id}
            className="w-[86vw] min-w-[280px] max-w-[340px] sm:w-[calc((100%-20px)/2)] sm:min-w-[calc((100%-20px)/2)] sm:max-w-[calc((100%-20px)/2)] lg:w-[calc((100%-48px)/3)] lg:min-w-[calc((100%-48px)/3)] lg:max-w-[calc((100%-48px)/3)] snap-start flex-shrink-0 flex flex-col"
          >
            <TourCard tour={t} />
          </div>
        ))}
      </div>
    </section>
  );
};
