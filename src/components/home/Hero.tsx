"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Star, MapPin, Users, Camera, Compass, Sparkles, ChevronDown, Check, Calendar, Search } from "lucide-react";

const defaultSlides = [
  {
    id: 1,
    tagline: "Explore. Connect. Remember.",
    headlineLine1: "Your Journey,",
    headlineHighlight: "Expertly Guided.",
    subtitle: "Discover ancient palaces, local village stories, and unforgettable island experiences with a Sri Lankan guide who cares.",
    image: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop",
    destination: "Mirissa Ocean Bay",
    ctaText: "Ocean Cruises",
    ctaLink: "/tours?category=beaches"
  }
];

import { DESTINATIONS_CATALOG } from "@/data/destinationsData";

const categories = [
  { label: "All Activities", value: "" },
  { label: "Cultural Heritage", value: "cultural" },
  { label: "Wildlife Safaris", value: "wildlife" },
  { label: "Adventure & Hiking", value: "adventure" },
];

const SearchWidget: React.FC = () => {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [destOpen, setDestOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [travOpen, setTravOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    if (category) params.append("category", category);
    if (date) params.append("date", date);
    if (adults > 0) params.append("adults", adults.toString());
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-slate-100">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="relative">
          <label className="block text-[11px] font-bold text-ceylon-navy uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-ceylon-blue" />
            Destination
          </label>
          <div
            onClick={() => setDestOpen(!destOpen)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text cursor-pointer flex items-center justify-between hover:border-ceylon-blue transition-colors"
          >
            <span className={destination ? "text-ceylon-text" : "text-slate-400"}>
              {DESTINATIONS_CATALOG.find((d) => d.slug === destination)?.name || "Where do you want to go?"}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          {destOpen && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-dropdown border border-slate-100 py-2 z-50 max-h-56 overflow-y-auto">
              <div
                onClick={() => {
                  setDestination("");
                  setDestOpen(false);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:bg-ceylon-softblue cursor-pointer"
              >
                All Sri Lanka Destinations
              </div>
              {DESTINATIONS_CATALOG.map((d) => (
                <div
                  key={d.slug}
                  onClick={() => {
                    setDestination(d.slug);
                    setDestOpen(false);
                  }}
                  className={`px-4 py-2 text-xs font-semibold hover:bg-ceylon-softblue cursor-pointer flex items-center justify-between ${
                    destination === d.slug ? "text-ceylon-blue bg-ceylon-softblue" : "text-ceylon-text"
                  }`}
                >
                  <span>{d.name}</span>
                  {destination === d.slug && <Check className="w-3.5 h-3.5 text-ceylon-blue" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-[11px] font-bold text-ceylon-navy uppercase tracking-wider mb-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-ceylon-blue" />
            Activity Type
          </label>
          <div
            onClick={() => setCatOpen(!catOpen)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text cursor-pointer flex items-center justify-between hover:border-ceylon-blue transition-colors"
          >
            <span className={category ? "text-ceylon-text" : "text-slate-400"}>
              {categories.find((c) => c.value === category)?.label || "What would you like to do?"}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          {catOpen && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-dropdown border border-slate-100 py-2 z-50 max-h-56 overflow-y-auto">
              {categories.map((c) => (
                <div
                  key={c.label}
                  onClick={() => { setCategory(c.value); setCatOpen(false); }}
                  className={`px-4 py-2 text-xs font-semibold hover:bg-ceylon-softblue cursor-pointer flex items-center justify-between ${
                    category === c.value ? "text-ceylon-blue bg-ceylon-softblue" : "text-ceylon-text"
                  }`}
                >
                  <span>{c.label}</span>
                  {category === c.value && <Check className="w-3.5 h-3.5 text-ceylon-blue" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ceylon-navy uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-ceylon-blue" />
            Travel Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-ceylon-text focus:outline-none focus:border-ceylon-blue transition-colors"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <label className="block text-[11px] font-bold text-ceylon-navy uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-ceylon-blue" />
              Travellers
            </label>
            <div
              onClick={() => setTravOpen(!travOpen)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text cursor-pointer flex items-center justify-between hover:border-ceylon-blue transition-colors"
            >
              <span>{adults} Adults{children > 0 ? `, ${children} Kids` : ""}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            {travOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-dropdown border border-slate-100 p-4 z-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ceylon-text">Adults (12+ yrs)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ceylon-text">Children (2-11 yrs)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTravOpen(false)}
                  className="w-full mt-2 py-1.5 bg-ceylon-blue text-white rounded-lg text-xs font-bold"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-ceylon-green hover:bg-ceylon-darkgreen text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 h-[42px]"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const Hero: React.FC = () => {
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
    }, 5000);
    return () => clearInterval(interval);
  }, [paused, slides.length]);

  const slide = slides[current] || defaultSlides[0];

  return (
    <section
      className="relative min-h-[680px] lg:min-h-[740px] flex flex-col justify-between pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-ceylon-navy"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, idx) => (
        <div
          key={s.id || idx}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          <Image
            src={s.image}
            alt={s.destination || "Sri Lanka"}
            fill
            sizes="100vw"
            priority={idx === 0}
            quality={85}
            className="object-cover object-center transition-transform duration-[6000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ceylon-navy/95 via-ceylon-navy/70 to-ceylon-navy/40" />
        </div>
      ))}

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

      <div className="relative z-10 max-w-5xl mx-auto w-full pt-8 sm:pt-12 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-emerald-400/30">
            {slide.tagline}
          </span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span>4.9/5 Rated (12,000+ Travellers)</span>
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
            <Link
              href="/plan-my-trip"
              className="px-6 py-3.5 rounded-xl font-extrabold text-sm text-ceylon-navy bg-white hover:bg-slate-50 shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-ceylon-blue" />
              <span>Plan My Trip</span>
            </Link>
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

      <div className="relative z-20 mt-10">
        <SearchWidget />
      </div>
    </section>
  );
};
