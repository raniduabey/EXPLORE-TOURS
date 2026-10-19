"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Users, Compass, Sparkles } from "lucide-react";
import { SearchWidget } from "./SearchWidget";

interface HeroSlide {
  id: number | string;
  tagline: string;
  headlineLine1: string;
  headlineHighlight: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  destination: string;
  ctaText: string;
  ctaLink: string;
}

const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    tagline: "Bespoke Island Journeys",
    headlineLine1: "Discover Sri Lanka,",
    headlineHighlight: "Your Way.",
    subtitle: "Immerse in ancient royal citadels, mist-veiled highland tea estates, and wild safari sanctuaries with Sri Lanka's finest licensed private chauffeur-guides.",
    image: "/images/destinations/sigiriya.jpg",
    destination: "Sigiriya Rock Citadel",
    ctaText: "Explore Our Journeys",
    ctaLink: "/tours"
  },
  {
    id: 2,
    tagline: "Highland Romance & Heritage Rail",
    headlineLine1: "Traverse Emerald Valleys &",
    headlineHighlight: "Cloud Forests.",
    subtitle: "Wake up to misty hill country horizons, cross iconic colonial viaducts, and unwind in restored heritage tea bungalows.",
    image: "/images/destinations/ella.jpg",
    destination: "Ella Nine Arch Bridge",
    ctaText: "Highland Journeys",
    ctaLink: "/tours/8-day-splendour-of-sri-lanka-classical-circuit"
  },
  {
    id: 3,
    tagline: "Untamed Nature & Wilderness",
    headlineLine1: "Private Leopard Safaris in",
    headlineHighlight: "Wild Yala.",
    subtitle: "Exclusive open-top 4x4 safaris with seasoned naturalists through remote coastal ecosystems teeming with leopards, elephants, and avian life.",
    image: "/images/destinations/yala.jpg",
    destination: "Yala National Park",
    ctaText: "Wildlife Expeditions",
    ctaLink: "/tours?category=wildlife"
  },
  {
    id: 4,
    tagline: "Azure Southern Coastline",
    headlineLine1: "Sail with Ocean Giants",
    headlineHighlight: "off Mirissa.",
    subtitle: "Charter private ocean catamarans to witness majestic blue whales and playful spinner dolphins along Sri Lanka's southern sanctuary waters.",
    image: "/images/destinations/mirissa.jpg",
    destination: "Mirissa Ocean Bay",
    ctaText: "Coastal Escapes",
    ctaLink: "/tours?category=beaches"
  }
];

export const Hero: React.FC<{ onOpenCustomPlanner?: () => void }> = ({ onOpenCustomPlanner }) => {
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch("/api/hero-slides");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setSlides(data);
        }
      } catch (e) {
        // fallback to luxury default slides
      }
    }
    fetchSlides();
  }, []);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [paused, slides.length]);

  const slide = slides[current] || defaultSlides[0];

  return (
    <section
      className="relative z-30 min-h-[720px] lg:min-h-[820px] flex flex-col justify-between pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-luxury-forest overflow-visible"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Slider Container */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((s, idx) => (
          <div
            key={s.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Desktop Image */}
            <Image
              src={s.image}
              alt={s.destination || "Ceylon Explore Tours"}
              fill
              sizes="100vw"
              priority={idx === 0}
              quality={90}
              className={`object-cover object-center transition-transform duration-[8000ms] ease-out ${
                s.mobileImage ? "hidden sm:block" : ""
              } ${idx === current ? "scale-105" : "scale-100"}`}
            />
            {/* Mobile Image */}
            {s.mobileImage && (
              <Image
                src={s.mobileImage}
                alt={s.destination || "Ceylon Explore Tours"}
                fill
                sizes="100vw"
                priority={idx === 0}
                quality={90}
                className={`sm:hidden object-cover object-center transition-transform duration-[8000ms] ease-out ${
                  idx === current ? "scale-105" : "scale-100"
                }`}
              />
            )}
            {/* Controlled Luxury Forest-Green Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-forest/95 via-luxury-forest/75 to-luxury-forest/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-forest via-transparent to-black/25" />
          </div>
        ))}
      </div>

      {/* Slide Progress Timer Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 h-[2px] bg-white/10">
        <motion.div
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: paused ? "0%" : "100%" }}
          transition={{ duration: 7, ease: "linear" }}
          className="h-full bg-gradient-to-r from-luxury-gold to-luxury-sand"
        />
      </div>

      {/* Navigation Arrows (Hidden on mobile to preserve readable viewport) */}
      <button
        type="button"
        onClick={() => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1))}
        className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-luxury-forest/70 hover:bg-luxury-forest border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold shadow-2xl items-center justify-center transition-all active:scale-95 group focus:outline-none backdrop-blur-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        type="button"
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="hidden sm:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-luxury-forest/70 hover:bg-luxury-forest border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold shadow-2xl items-center justify-center transition-all active:scale-95 group focus:outline-none backdrop-blur-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Content with AnimatePresence */}
      <div className="relative z-10 max-w-5xl mx-auto w-full pt-10 sm:pt-14 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id || current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Tagline Pill */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-luxury-gold bg-luxury-forest/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-luxury-gold/30">
                {slide.tagline}
              </span>
            </div>

            {/* Editorial Serif Heading */}
            <div className="space-y-3 max-w-3xl">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-luxury-ivory tracking-tight leading-[1.08] drop-shadow-md">
                {slide.headlineLine1 || "Discover Sri Lanka,"} <br />
                <span className="italic text-luxury-gold font-serif">{slide.headlineHighlight || "Your Way."}</span>
              </h1>
              <p className="text-base sm:text-lg text-luxury-sand/90 font-sans font-normal max-w-2xl leading-relaxed pt-1">
                {slide.subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-6">
          <div className="flex flex-col min-[420px]:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Link
              href={slide.ctaLink || "/tours"}
              className="px-6 sm:px-8 py-3.5 rounded-full font-sans font-semibold text-xs uppercase tracking-[0.18em] text-luxury-forest bg-gradient-to-r from-[#DFBE82] via-[#C9A86A] to-[#A88647] hover:brightness-110 shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-center"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>{slide.ctaText || "Explore Our Journeys"}</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </Link>
            {onOpenCustomPlanner ? (
              <button
                type="button"
                onClick={onOpenCustomPlanner}
                className="px-6 sm:px-7 py-3.5 rounded-full font-sans font-medium text-xs uppercase tracking-[0.18em] text-luxury-ivory bg-white/5 hover:bg-white/10 border border-luxury-gold/40 hover:border-luxury-gold backdrop-blur-md shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-center"
              >
                <Sparkles className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>Tailor My Journey</span>
              </button>
            ) : (
              <Link
                href="/contact"
                className="px-6 sm:px-7 py-3.5 rounded-full font-sans font-medium text-xs uppercase tracking-[0.18em] text-luxury-ivory bg-white/5 hover:bg-white/10 border border-luxury-gold/40 hover:border-luxury-gold backdrop-blur-md shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-center"
              >
                <Sparkles className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>Tailor My Journey</span>
              </Link>
            )}
          </div>

          {/* Slide Pagination Dots */}
          <div className="flex items-center gap-2 bg-luxury-forest/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-luxury-gold/25">
            {slides.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "w-8 h-2 bg-gradient-to-r from-luxury-gold to-luxury-sand shadow"
                    : "w-2 h-2 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Search Widget & 3 Value Pillars */}
      <div className="relative z-40 mt-10 lg:mt-14 max-w-5xl mx-auto w-full">
        <SearchWidget />

        {/* Dedicated 3 Feature Cards Section below Search Interface */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5 pt-8 pb-2">
          <div className="flex items-center gap-3.5 bg-luxury-forest/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-lg hover:border-luxury-gold/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-luxury-gold/15 text-luxury-gold flex items-center justify-center shrink-0 border border-luxury-gold/25 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-semibold text-luxury-ivory tracking-wide">Native Island Experts</h4>
              <p className="text-[11px] font-sans font-normal text-luxury-sand/80">Private SLTDA chauffeur-guides</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-luxury-forest/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-lg hover:border-luxury-gold/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-luxury-gold/15 text-luxury-gold flex items-center justify-center shrink-0 border border-luxury-gold/25 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-semibold text-luxury-ivory tracking-wide">100% Tailor-Made</h4>
              <p className="text-[11px] font-sans font-normal text-luxury-sand/80">Curated to your travel rhythm</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-luxury-forest/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-lg hover:border-luxury-gold/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-luxury-gold/15 text-luxury-gold flex items-center justify-center shrink-0 border border-luxury-gold/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-semibold text-luxury-ivory tracking-wide">24/7 Island Concierge</h4>
              <p className="text-[11px] font-sans font-normal text-luxury-sand/80">Dedicated personal assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
