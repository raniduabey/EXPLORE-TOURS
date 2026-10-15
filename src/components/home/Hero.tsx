"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, MapPin, Users, Camera, Compass, Sparkles, ChevronDown, Check, Calendar, Search, ShieldCheck } from "lucide-react";
import { Float } from "@/components/ui/motion";

const defaultSlides = [
  {
    id: 1,
    tagline: "Explore. Connect. Remember.",
    headlineLine1: "Your Journey,",
    headlineHighlight: "Expertly Guided.",
    subtitle: "Discover ancient palaces, local village stories, and unforgettable island experiences with a Sri Lankan guide who cares.",
    image: "/images/destinations/sigiriya.jpg",
    destination: "Sigiriya Rock Citadel",
    ctaText: "Explore Tours",
    ctaLink: "/tours?category=cultural"
  },
  {
    id: 2,
    tagline: "Highland Mist & Scenic Railways",
    headlineLine1: "Ride the World’s Most",
    headlineHighlight: "Scenic Train.",
    subtitle: "Chug through emerald tea estates, mist-covered valleys, and iconic stone arch bridges deep in the Ella mountains.",
    image: "/images/destinations/ella.jpg",
    destination: "Ella Nine Arch Bridge",
    ctaText: "Book Train Experience",
    ctaLink: "/tours"
  },
  {
    id: 3,
    tagline: "Wild Encounters & Safari Trails",
    headlineLine1: "Track Leopards in",
    headlineHighlight: "Wild Yala.",
    subtitle: "Venture on customized open-top 4x4 safaris across coastal scrublands home to wild elephants, bears, and leopards.",
    image: "/images/destinations/yala.jpg",
    destination: "Yala National Park",
    ctaText: "Explore Safaris",
    ctaLink: "/tours?category=wildlife"
  },
  {
    id: 4,
    tagline: "Tropical Ocean & Coastal Wonders",
    headlineLine1: "Sail with Blue Whales",
    headlineHighlight: "in Mirissa.",
    subtitle: "Witness the majestic giants of the ocean off southern palm-lined beaches with eco-certified marine guides.",
    image: "/images/destinations/mirissa.jpg",
    destination: "Mirissa Ocean Bay",
    ctaText: "Ocean Cruises",
    ctaLink: "/tours?category=beaches"
  }
];

import { SearchWidget } from "./SearchWidget";

export const Hero: React.FC<{ onOpenCustomPlanner?: () => void }> = ({ onOpenCustomPlanner }) => {
  const [slides, setSlides] = useState(defaultSlides);
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
        // use default slides
      }
    }
    fetchSlides();
  }, []);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [paused, slides.length]);

  const slide = slides[current] || defaultSlides[0];

  return (
    <section
      className="relative z-30 min-h-[680px] lg:min-h-[760px] flex flex-col justify-between pt-8 pb-16 px-4 sm:px-6 lg:px-8 bg-ceylon-navy overflow-visible"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Slider Container — Confines scaled images while allowing dropdown popovers to overflow freely */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((s, idx) => (
          <div
            key={s.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Desktop / Default Image */}
            <Image
              src={s.image}
              alt={s.destination || "Sri Lanka"}
              fill
              sizes="100vw"
              priority={idx === 0}
              quality={85}
              className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                s.mobileImage ? "hidden sm:block" : ""
              } ${idx === current ? "scale-105" : "scale-100"}`}
            />
            {/* Optional Mobile-Specific Banner Image */}
            {s.mobileImage && (
              <Image
                src={s.mobileImage}
                alt={s.destination || "Sri Lanka"}
                fill
                sizes="100vw"
                priority={idx === 0}
                quality={85}
                className={`sm:hidden object-cover object-center transition-transform duration-[7000ms] ease-out ${
                  idx === current ? "scale-105" : "scale-100"
                }`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-ceylon-navy/95 via-ceylon-navy/75 to-ceylon-navy/40" />
          </div>
        ))}
      </div>

      {/* Slide Progress Timer Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/10">
        <motion.div
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: paused ? "0%" : "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-emerald-400"
        />
      </div>

      {/* Floating Trust Badges */}
      <div className="hidden lg:block absolute right-12 top-24 z-20 pointer-events-none">
        <Float duration={5} yOffset={10}>
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg">
              🇱🇰
            </div>
            <div>
              <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SLTDA Certified</span>
              </div>
              <p className="text-xs font-bold text-white">Official Chauffeur Guides</p>
            </div>
          </div>
        </Float>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={() => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1))}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-ceylon-navy shadow-xl flex items-center justify-center transition-transform active:scale-95 group focus:outline-none"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform text-ceylon-blue" />
      </button>
      <button
        type="button"
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-ceylon-navy shadow-xl flex items-center justify-center transition-transform active:scale-95 group focus:outline-none"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform text-ceylon-blue" />
      </button>

      {/* Slide Content with AnimatePresence */}
      <div className="relative z-10 max-w-5xl mx-auto w-full pt-8 sm:pt-12 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id || current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-emerald-400/30">
                {slide.tagline}
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certified Native Guides & Private Vehicles</span>
              </div>
            </div>

            <div className="space-y-2 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none drop-shadow-lg">
                {slide.headlineLine1} <br />
                <span className="text-emerald-400 font-serif italic">{slide.headlineHighlight}</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-200 font-normal max-w-xl leading-relaxed pt-2">
                {slide.subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl pt-2">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <div className="w-9 h-9 rounded-xl bg-ceylon-blue/40 text-emerald-300 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Local Expertise</h4>
              <p className="text-[10px] text-slate-300">Insider knowledge of Sri Lanka</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <div className="w-9 h-9 rounded-xl bg-ceylon-blue/40 text-emerald-300 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Personalized Tours</h4>
              <p className="text-[10px] text-slate-300">Tailored experiences just for you</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
            <div className="w-9 h-9 rounded-xl bg-ceylon-blue/40 text-emerald-300 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Memorable Moments</h4>
              <p className="text-[10px] text-slate-300">Capture island memories for life</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <Link
              href={slide.ctaLink || "/tours"}
              className="px-7 py-3.5 rounded-xl font-extrabold text-sm text-white bg-ceylon-green hover:bg-ceylon-darkgreen shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>{slide.ctaText || "Explore Tours"}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            {onOpenCustomPlanner ? (
              <button
                type="button"
                onClick={onOpenCustomPlanner}
                className="px-6 py-3.5 rounded-xl font-extrabold text-sm text-ceylon-navy bg-white hover:bg-slate-50 shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-ceylon-blue" />
                <span>Plan My Trip</span>
              </button>
            ) : (
              <Link
                href="/plan-my-trip"
                className="px-6 py-3.5 rounded-xl font-extrabold text-sm text-ceylon-navy bg-white hover:bg-slate-50 shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-ceylon-blue" />
                <span>Plan My Trip</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            {slides.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? "w-7 h-2.5 bg-ceylon-green shadow" : "w-2.5 h-2.5 bg-white/40 hover:bg-white"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-40 mt-10">
        <SearchWidget />
      </div>
    </section>
  );
};
