"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Sun, CloudRain, Waves, Sparkles, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

interface MonthData {
  month: string;
  seasonType: "Peak Golden Season" | "East Coast Summer" | "Islandwide Shoulder Season";
  badgeColor: string;
  sunnyRegions: string[];
  seaCondition: string;
  wildlifeHighlight: string;
  averageTemp: string;
  recommendation: string;
  recommendedTourSlug: string;
  recommendedTourName: string;
}

const MONTHS: MonthData[] = [
  {
    month: "January",
    seasonType: "Peak Golden Season",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    sunnyRegions: ["South & West Coast (Galle, Mirissa, Bentota)", "Hill Country (Ella, Kandy)", "Cultural Triangle (Sigiriya)"],
    seaCondition: "Calm, crystal clear waters ideal for swimming & whale watching",
    wildlifeHighlight: "Peak blue whale sightings off Mirissa + excellent Yala leopard tracking",
    averageTemp: "28°C – 31°C coastal / 18°C highlands",
    recommendation: "Perfect time for classical island circuits combining ancient citadels, scenic mountain trains, and beach relaxation.",
    recommendedTourSlug: "/tours/8-day-splendour-of-sri-lanka-classical-circuit",
    recommendedTourName: "8-Day Splendour of Sri Lanka Circuit",
  },
  {
    month: "February",
    seasonType: "Peak Golden Season",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    sunnyRegions: ["South & West Coast", "Central Tea Highlands", "Cultural Triangle", "Yala Wilderness"],
    seaCondition: "Glass-calm seas across the southern Indian Ocean",
    wildlifeHighlight: "Prime dry season for Yala waterhole safaris & dolphin mega-pods",
    averageTemp: "29°C – 32°C coastal / 19°C highlands",
    recommendation: "One of the driest months across the entire island. Highest demand for chauffeur guides and reserved train tickets.",
    recommendedTourSlug: "/tours/6-day-sri-lanka-highlights-golden-triangle-tour",
    recommendedTourName: "6-Day Sri Lanka Highlights & Golden Triangle",
  },
  {
    month: "March",
    seasonType: "Peak Golden Season",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    sunnyRegions: ["Entire Southern Coast", "Cultural Triangle", "Adam's Peak & Ella", "Yala & Wilpattu"],
    seaCondition: "Superb visibility for snorkeling, scuba diving & ocean cruises",
    wildlifeHighlight: "Migratory blue whales & sperm whales feeding near the continental shelf",
    averageTemp: "30°C – 33°C",
    recommendation: "Sensational weather for trekking Little Adam's Peak and climbing Sigiriya Rock in the early morning breeze.",
    recommendedTourSlug: "/tours/sigiriya-rock-fortress-dambulla-day-tour",
    recommendedTourName: "Sigiriya Rock Citadel & Dambulla Cave Temple",
  },
  {
    month: "April",
    seasonType: "Islandwide Shoulder Season",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    sunnyRegions: ["Entire Island (Sinhala & Tamil New Year festive season)"],
    seaCondition: "Warm, calm waters transitioning between seasons",
    wildlifeHighlight: "Active elephant herds in Udawalawe and leopard cubs in Yala",
    averageTemp: "31°C – 33°C (Warmest month)",
    recommendation: "Experience festive Sri Lankan traditional hospitality, harvesting rituals, and sunny skies across both coasts.",
    recommendedTourSlug: "/tours/14-day-sri-lanka-all-in-one-classic-grand-tour",
    recommendedTourName: "14-Day Sri Lanka All-in-One Classic Grand Tour",
  },
  {
    month: "May",
    seasonType: "East Coast Summer",
    badgeColor: "bg-sky-100 text-sky-900 border-sky-200",
    sunnyRegions: ["East Coast (Trincomalee, Pasikudah)", "Cultural Triangle", "North (Jaffna)"],
    seaCondition: "East coast seas become like glass; ideal for Pigeon Island coral reef snorkeling",
    wildlifeHighlight: "Whale watching moves to Trincomalee on the East coast",
    averageTemp: "30°C – 32°C",
    recommendation: "Southwest sees brief tropical monsoon showers; focus tours on the Cultural Triangle and tranquil East coast.",
    recommendedTourSlug: "/tours/sigiriya-rock-fortress-dambulla-day-tour",
    recommendedTourName: "Sigiriya Rock & Cultural Triangle Explorer",
  },
  {
    month: "June",
    seasonType: "East Coast Summer",
    badgeColor: "bg-sky-100 text-sky-900 border-sky-200",
    sunnyRegions: ["Trincomalee & Nilaveli", "Cultural Triangle", "Wilpattu & Minneriya"],
    seaCondition: "East coast waters are mirror-still; south coast offers thrilling surf",
    wildlifeHighlight: "Early gatherings of wild elephants around Minneriya reservoir",
    averageTemp: "29°C – 32°C",
    recommendation: "Fewer crowds at UNESCO sites. Great savings and serene boutique villa stays with private chauffeur transport.",
    recommendedTourSlug: "/tours/8-day-splendour-of-sri-lanka-classical-circuit",
    recommendedTourName: "8-Day Splendour of Sri Lanka Classical Circuit",
  },
  {
    month: "July",
    seasonType: "East Coast Summer",
    badgeColor: "bg-sky-100 text-sky-900 border-sky-200",
    sunnyRegions: ["Cultural Triangle", "Central Highlands (Ella & Kandy)", "East Coast Beaches"],
    seaCondition: "East Coast prime beach season with 29°C turquoise ocean",
    wildlifeHighlight: "The 'Elephant Gathering' at Minneriya — up to 300 wild elephants convene daily",
    averageTemp: "29°C – 31°C",
    recommendation: "World-famous Esala Perahera festival in Kandy. Book custom itineraries early for private viewing seats.",
    recommendedTourSlug: "/tours/kandy-to-ella-scenic-train-journey",
    recommendedTourName: "Kandy to Ella Scenic Train & Highland Route",
  },
  {
    month: "August",
    seasonType: "East Coast Summer",
    badgeColor: "bg-sky-100 text-sky-900 border-sky-200",
    sunnyRegions: ["Cultural Triangle", "Kandy & Hill Country", "East Coast (Pasikudah, Arugam Bay)"],
    seaCondition: "Arugam Bay becomes the global hub for world championship surfing",
    wildlifeHighlight: "Peak month of the Minneriya Elephant Gathering, one of the greatest wildlife spectacles on Earth",
    averageTemp: "29°C – 31°C",
    recommendation: "European summer holidays peak. Exceptional time for wildlife and heritage lovers.",
    recommendedTourSlug: "/tours/21-day-natures-secret-sri-lanka-ultimate-odyssey",
    recommendedTourName: "21-Day Nature's Secret Sri Lanka Ultimate Odyssey",
  },
  {
    month: "September",
    seasonType: "Islandwide Shoulder Season",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    sunnyRegions: ["Cultural Triangle", "Ella Highlands", "Wilpattu National Park"],
    seaCondition: "Transitioning back towards the southern coast calm season",
    wildlifeHighlight: "Elephant Gathering continues; superb leopard sightings in Wilpattu",
    averageTemp: "28°C – 31°C",
    recommendation: "Pleasant temperatures, clear skies in the central plains, and peaceful uncrowded sightseeing at Sigiriya.",
    recommendedTourSlug: "/tours/sigiriya-rock-fortress-dambulla-day-tour",
    recommendedTourName: "Sigiriya Rock & Dambulla Heritage Day Tour",
  },
  {
    month: "October",
    seasonType: "Islandwide Shoulder Season",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    sunnyRegions: ["Hill Country valleys", "Cultural Triangle", "South Coast beaches start clearing"],
    seaCondition: "Occasional brief late-afternoon monsoon showers keep nature lush & vibrant",
    wildlifeHighlight: "Bird migration begins with hundreds of species arriving from Siberia and the Arctic",
    averageTemp: "28°C – 30°C",
    recommendation: "Lush emerald scenery, roaring waterfalls in Nuwara Eliya and Ella, and low-season boutique hotel privileges.",
    recommendedTourSlug: "/tours/6-day-sri-lanka-highlights-golden-triangle-tour",
    recommendedTourName: "6-Day Sri Lanka Highlights & Golden Triangle",
  },
  {
    month: "November",
    seasonType: "Peak Golden Season",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    sunnyRegions: ["South & West Coast (Galle, Mirissa)", "Hill Country", "Cultural Triangle"],
    seaCondition: "Southern sea settles into postcard calm; whale watching season officially kicks off",
    wildlifeHighlight: "First blue whale sightings off Mirissa coastline and resident Yala leopards",
    averageTemp: "28°C – 31°C",
    recommendation: "Start of Sri Lanka's high travel season. Ideal time to beat the Christmas rush with pleasant sunny weather.",
    recommendedTourSlug: "/tours/8-day-splendour-of-sri-lanka-classical-circuit",
    recommendedTourName: "8-Day Splendour of Sri Lanka Circuit",
  },
  {
    month: "December",
    seasonType: "Peak Golden Season",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    sunnyRegions: ["South Coast (Galle, Mirissa, Bentota)", "Ella & Nuwara Eliya", "Sigiriya & Kandy"],
    seaCondition: "Warm, calm turquoise waters perfect for ocean swimming and sunset cruises",
    wildlifeHighlight: "Active whale watching, Yala leopard safaris, and nesting sea turtles",
    averageTemp: "28°C – 31°C",
    recommendation: "Ultimate holiday season in the tropics. Escape winter and celebrate Christmas or New Year under coconut palms.",
    recommendedTourSlug: "/tours/14-day-sri-lanka-all-in-one-classic-grand-tour",
    recommendedTourName: "14-Day Sri Lanka All-in-One Classic Grand Tour",
  },
];

export const SeasonMatrix: React.FC = () => {
  const currentMonthIdx = new Date().getMonth(); // 0-11
  const [selectedIdx, setSelectedIdx] = useState(currentMonthIdx);
  const data = MONTHS[selectedIdx] || MONTHS[0];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeIn className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold uppercase tracking-widest border border-amber-100 mb-3">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Island Climate Guide</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ceylon-navy tracking-tight">
          When to Visit Sri Lanka
        </h2>
        <p className="text-sm sm:text-base text-ceylon-muted mt-3 leading-relaxed">
          Because of Sri Lanka's dual monsoon pattern, there is <strong className="text-ceylon-navy">always glorious sunshine and calm seas somewhere on the island</strong> at any time of year. Select a month to see where to go!
        </p>
      </FadeIn>

      {/* Month Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none justify-start md:justify-center">
        {MONTHS.map((m, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <button
              key={m.month}
              onClick={() => setSelectedIdx(idx)}
              className={`relative px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                isSelected
                  ? "text-white shadow-md shadow-ceylon-blue/20"
                  : "text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeMonth"
                  className="absolute inset-0 bg-ceylon-blue rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span>{m.month.slice(0, 3)}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Month Interactive Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={data.month}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-ceylon-navy">
                    {data.month} in Sri Lanka
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide border ${data.badgeColor}`}
                  >
                    {data.seasonType}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  {data.recommendation}
                </p>
              </div>

              <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 shrink-0 flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Temperature</span>
                  <span className="text-xs font-bold text-ceylon-navy">{data.averageTemp}</span>
                </div>
              </div>
            </div>

            {/* 3 Detail columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ceylon-navy">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Best Regions for Sun
                </div>
                <div className="space-y-2">
                  {data.sunnyRegions.map((region, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{region}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ceylon-navy">
                  <Waves className="w-4 h-4 text-ceylon-blue" />
                  Ocean & Sea State
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {data.seaCondition}
                </p>
              </div>

              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ceylon-navy">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Top Wildlife Highlight
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {data.wildlifeHighlight}
                </p>
              </div>
            </div>

            {/* Recommended itinerary for month */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-ceylon-softblue/50 p-4 sm:p-5 rounded-2xl">
              <div>
                <span className="text-[11px] font-bold text-ceylon-blue uppercase tracking-wider block">
                  Top Recommended Package for {data.month}
                </span>
                <span className="text-sm font-extrabold text-ceylon-navy">
                  {data.recommendedTourName}
                </span>
              </div>
              <Link
                href={data.recommendedTourSlug}
                className="w-full sm:w-auto px-5 py-2.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 shadow-md group"
              >
                <span>View Recommended Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
