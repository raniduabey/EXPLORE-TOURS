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
    image: "/images/destinations/sigiriya.jpg",
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
    image: "/images/destinations/ella.jpg",
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
    image: "/images/destinations/galle.jpg",
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
    image: "/images/destinations/yala.jpg",
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
    image: "/images/destinations/anuradhapura.jpg",
    tourSlug: "/tours/8-day-splendour-of-sri-lanka-classical-circuit",
    tourName: "8-Day Splendour of Sri Lanka Circuit",
    price: "From $430",
  },
];

export const RegionExplorer: React.FC = () => {
  const [activeId, setActiveId] = useState(regions[0].id);
  const activeRegion = regions.find((r) => r.id === activeId) || regions[0];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeIn className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-forest/5 text-luxury-gold text-[10px] font-mono uppercase tracking-[0.25em] border border-luxury-gold/30 mb-3">
          <Compass className="w-3.5 h-3.5 text-luxury-gold" />
          <span>Island Territory Guide</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight">
          Explore Sri Lanka By Region
        </h2>
        <p className="text-sm sm:text-base text-luxury-charcoal/70 font-light mt-3 leading-relaxed">
          From the ancient Buddhist citadels of the dry plains to the mist-covered tea plateaus and wild leopard savannas. Select an enclave below to uncover its distinct character.
        </p>
      </FadeIn>

      {/* Region Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-12">
        {regions.map((region) => {
          const isActive = region.id === activeId;
          return (
            <button
              key={region.id}
              onClick={() => setActiveId(region.id)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-serif tracking-wider uppercase transition-all ${
                isActive
                  ? "text-luxury-ivory font-semibold shadow-md shadow-luxury-forest/20"
                  : "text-luxury-charcoal/70 bg-white hover:bg-slate-50 border border-luxury-sand/80"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeRegion"
                  className="absolute inset-0 bg-luxury-forest rounded-full -z-10 border border-luxury-gold/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span>{region.name}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Region Showcase Card */}
      <div className="bg-white rounded-3xl border border-luxury-sand/80 shadow-[0_20px_50px_rgba(16,45,36,0.08)] overflow-hidden">
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
            <div className="lg:col-span-7 relative min-h-[400px] lg:min-h-[540px] overflow-hidden group">
              <Image
                src={activeRegion.image}
                alt={activeRegion.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-forest/90 via-luxury-forest/30 to-black/20" />

              <div className="absolute bottom-8 left-8 right-8 text-luxury-ivory space-y-1.5">
                <span className="text-[10px] font-mono font-medium text-luxury-gold uppercase tracking-[0.2em] block">
                  {activeRegion.tagline}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-luxury-ivory">
                  {activeRegion.name}
                </h3>
              </div>
            </div>

            {/* Region Details & Highlights */}
            <div className="lg:col-span-5 p-7 sm:p-9 lg:p-11 flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-luxury-gold mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                    Region Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-luxury-charcoal/80 font-light leading-relaxed">
                    {activeRegion.description}
                  </p>
                </div>

                {/* Key Insights Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-luxury-sand/70">
                  <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-luxury-sand/80">
                    <div className="flex items-center gap-1.5 text-luxury-charcoal/50 text-[10px] font-mono uppercase tracking-wider mb-1">
                      <Sun className="w-3.5 h-3.5 text-luxury-gold" />
                      Best Season
                    </div>
                    <p className="text-xs font-serif font-medium text-luxury-forest">
                      {activeRegion.bestMonths}
                    </p>
                  </div>
                  <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-luxury-sand/80">
                    <div className="flex items-center gap-1.5 text-luxury-charcoal/50 text-[10px] font-mono uppercase tracking-wider mb-1">
                      <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                      Airport Transit
                    </div>
                    <p className="text-xs font-serif font-medium text-luxury-forest">
                      {activeRegion.driveFromAirport}
                    </p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-luxury-forest">
                    Iconic Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeRegion.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-luxury-charcoal/80 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                        <span className="font-normal">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="pt-5 border-t border-luxury-sand/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-luxury-charcoal/50 block">Curated Experience</span>
                  <span className="font-serif text-sm font-medium text-luxury-forest line-clamp-1">{activeRegion.tourName}</span>
                </div>
                <Link
                  href={activeRegion.tourSlug}
                  className="w-full sm:w-auto px-6 py-3 bg-luxury-forest hover:bg-luxury-emerald text-luxury-ivory rounded-full text-xs font-serif font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-md group"
                >
                  <span>Discover</span>
                  <ArrowRight className="w-3.5 h-3.5 text-luxury-gold group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
