"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sun, Clock, Compass, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

interface RegionData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  bestMonths: string;
  climate: string;
  driveFromAirport: string;
  image: string;
  tourSlug: string;
  tourName: string;
  price: string;
}

const regions: RegionData[] = [
  {
    id: "cultural",
    name: "Cultural Triangle",
    tagline: "Ancient Citadels & Royal Shrines",
    description:
      "The spiritual cradle of Sri Lanka, home to 5 UNESCO World Heritage sites including the 5th-century Sigiriya Lion Rock, the golden caves of Dambulla, and ancient reservoir civilizations.",
    highlights: ["Sigiriya Lion Rock Citadel", "Dambulla Royal Cave Temples", "Polonnaruwa Ancient City", "Pidurangala Sunrise Viewpoint"],
    bestMonths: "December – September (Optimal dry season)",
    climate: "28°C – 32°C (Warm & dry plains)",
    driveFromAirport: "3.5 Hours via Central Expressway",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop",
    tourSlug: "/tours/sigiriya-rock-fortress-dambulla-day-tour",
    tourName: "Sigiriya Rock & Dambulla Cave Temple Tour",
    price: "From $85",
  },
  {
    id: "highlands",
    name: "Hill Country & Tea Highlands",
    tagline: "Scenic Railways, Mist & Waterfalls",
    description:
      "Cool emerald valleys blanketed in world-renowned Ceylon tea estates, plunging waterfalls, and the legendary Kandy to Ella blue mountain train ride crossing the Nine Arch Viaduct.",
    highlights: ["Scenic Kandy to Ella Blue Train", "Nine Arch Viaduct Bridge", "Little Adam's Peak & Ella Rock", "Colonial Ceylon Tea Estates"],
    bestMonths: "January – April & July – September",
    climate: "16°C – 23°C (Crisp mountain air)",
    driveFromAirport: "3 to 4.5 Hours through scenic passes",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
    tourSlug: "/tours/kandy-to-ella-scenic-train-journey",
    tourName: "Scenic Ella Blue Train & Highland Trek",
    price: "From $65",
  },
  {
    id: "south-coast",
    name: "Southern Coast & Galle Fort",
    tagline: "Colonial Ramparts & Golden Shores",
    description:
      "A tropical stretch of palm-fringed sands, world-famous blue whale expeditions in Mirissa, iconic stilt fishermen, and the 17th-century cobblestone alleys of Galle Dutch Fort.",
    highlights: ["Galle Dutch Fort UNESCO Bastion", "Mirissa Blue Whale Cruise", "Coconut Tree Hill & Secret Beach", "Madu River Mangrove Boat Safari"],
    bestMonths: "November – April (Calm turquoise seas)",
    climate: "27°C – 31°C (Tropical beach sunshine)",
    driveFromAirport: "2 Hours via Southern Expressway",
    image: "https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?q=80&w=1200&auto=format&fit=crop",
    tourSlug: "/tours/galle-fort-madu-river-boat-safari",
    tourName: "Galle Fort Heritage & Coastal Safari",
    price: "From $70",
  },
  {
    id: "wildlife",
    name: "Wildlife & Safari Sanctuaries",
    tagline: "Leopards, Elephants & Untamed Nature",
    description:
      "Sri Lanka boasts the world's highest density of leopards in Yala National Park, alongside massive elephant gatherings in Udawalawe and Minneriya, and rich bird sanctuaries.",
    highlights: ["Yala Leopard & Sloth Bear Tracking", "Udawalawe Elephant Sanctuary", "Minneriya Wild Elephant Gathering", "Custom 4x4 Safari Jeeps"],
    bestMonths: "February – October (Waterhole dry season)",
    climate: "29°C – 34°C (Coastal scrubland savanna)",
    driveFromAirport: "4 Hours via Southern Highway",
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop",
    tourSlug: "/tours/yala-national-park-private-safari",
    tourName: "Yala National Park 4x4 Leopard Safari",
    price: "From $95",
  },
  {
    id: "multiday-circuits",
    name: "Islandwide Multi-Day Circuits",
    tagline: "Comprehensive 6 to 21-Day Itineraries",
    description:
      "Seamless all-in-one private journeys combining all top regions with dedicated private chauffeur guides, boutique hotels, rail tickets, and exclusive local experiences.",
    highlights: ["Complete Island UNESCO Circuit", "Handpicked Boutique Hotels", "Dedicated Private AC Vehicle & Driver", "100% Flexible & Customizable"],
    bestMonths: "Year-Round (Routings adapted to seasons)",
    climate: "Covers all diverse island microclimates",
    driveFromAirport: "Seamless VIP Airport Pickup & Drop",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1200&auto=format&fit=crop",
    tourSlug: "/tours/8-day-splendour-of-sri-lanka-classical-circuit",
    tourName: "8-Day Splendour of Sri Lanka Circuit",
    price: "From $430",
  },
];

export const RegionExplorer: React.FC = () => {
  const [activeId, setActiveId] = useState(regions[0].id);
  const activeRegion = regions.find((r) => r.id === activeId) || regions[0];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeIn className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-ceylon-green text-xs font-extrabold uppercase tracking-widest border border-emerald-100 mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Sri Lanka Guide</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ceylon-navy tracking-tight">
          Explore Sri Lanka By Region
        </h2>
        <p className="text-sm sm:text-base text-ceylon-muted mt-3 leading-relaxed">
          Sri Lanka packs eight UNESCO World Heritage sites, tea-clad cloud forests, and wild leopard reserves into a compact island. Select a region below to reveal insider secrets.
        </p>
      </FadeIn>

      {/* Region Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {regions.map((region) => {
          const isActive = region.id === activeId;
          return (
            <button
              key={region.id}
              onClick={() => setActiveId(region.id)}
              className={`relative px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "text-white shadow-md shadow-ceylon-navy/20"
                  : "text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeRegion"
                  className="absolute inset-0 bg-ceylon-navy rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span>{region.name}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Region Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRegion.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            {/* Image Showcase */}
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[520px] overflow-hidden group">
              <Image
                src={activeRegion.image}
                alt={activeRegion.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy/80 via-transparent to-black/20" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                  {activeRegion.tagline}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeRegion.name}
                </h3>
              </div>
            </div>

            {/* Region Details & Highlights */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ceylon-blue mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Region Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeRegion.description}
                  </p>
                </div>

                {/* Key Insights Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase mb-1">
                      <Sun className="w-3 h-3 text-amber-500" />
                      Best Months
                    </div>
                    <p className="text-xs font-bold text-ceylon-navy">
                      {activeRegion.bestMonths}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase mb-1">
                      <Clock className="w-3 h-3 text-ceylon-blue" />
                      Airport Transit
                    </div>
                    <p className="text-xs font-bold text-ceylon-navy">
                      {activeRegion.driveFromAirport}
                    </p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ceylon-navy">
                    Must-See Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeRegion.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Recommended Experience</span>
                  <span className="text-xs font-bold text-ceylon-navy line-clamp-1">{activeRegion.tourName}</span>
                </div>
                <Link
                  href={activeRegion.tourSlug}
                  className="w-full sm:w-auto px-5 py-2.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 shadow-md group"
                >
                  <span>Explore Experience</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
