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
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const monthButtonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const isInitialMount = React.useRef(true);

  // Keep the selected month visible in the horizontal scroll container WITHOUT scrolling the window
  React.useEffect(() => {
    const activeBtn = monthButtonRefs.current[selectedIdx];
    const container = scrollContainerRef.current;
    if (!activeBtn || !container) return;

    const targetScrollLeft =
      activeBtn.offsetLeft - container.clientWidth / 2 + activeBtn.clientWidth / 2;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      // On initial page mount, set horizontal scroll position silently without animation or page shift
      container.scrollLeft = Math.max(0, targetScrollLeft);
      return;
    }

    // On user interaction (clicking a month), smoothly scroll ONLY the horizontal month container
    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth",
    });
  }, [selectedIdx]);

  return (
    <section className="pt-6 sm:pt-8 lg:pt-10 pb-14 sm:pb-18 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      <FadeIn className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15392D]/5 text-[#C5A46B] text-[10px] font-mono uppercase tracking-[0.25em] border border-[#C5A46B]/30 mb-3">
          <Sun className="w-3.5 h-3.5 text-[#C5A46B] shrink-0" />
          <span>Microclimate Almanac</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-[#15392D] tracking-tight break-words leading-tight sm:leading-snug">
          When to Journey Through Sri Lanka
        </h2>
        <p className="text-xs sm:text-base text-[#59645E] font-sans font-normal mt-3 leading-relaxed max-w-2xl mx-auto break-words">
          Thanks to the island&apos;s dual monsoon microclimates, there is <strong className="text-[#15392D] font-serif">always pristine sunshine, calm waters, and sublime weather</strong> in Sri Lanka year-round. Select any month to view optimum regions.
        </p>
      </FadeIn>

      {/* Month Bar: Clearly Horizontally Scrollable on Mobile, Centered on Desktop */}
      <div className="relative w-full mb-6 sm:mb-8">
        {/* Subtle Edge Scroll Cues for Mobile */}
        <div className="absolute left-0 top-0 bottom-3 w-5 bg-gradient-to-r from-[#F8F7F3] to-transparent pointer-events-none md:hidden z-10" />
        <div className="absolute right-0 top-0 bottom-3 w-5 bg-gradient-to-l from-[#F8F7F3] to-transparent pointer-events-none md:hidden z-10" />

        <div
          ref={scrollContainerRef}
          className="w-full max-w-full overflow-x-auto overscroll-x-contain touch-pan-x pb-3 pt-1 flex items-center gap-1.5 sm:gap-2 justify-start md:justify-center scrollbar-none scroll-smooth px-2 sm:px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {MONTHS.map((m, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={m.month}
                ref={(el) => {
                  monthButtonRefs.current[idx] = el;
                }}
                onClick={() => setSelectedIdx(idx)}
                type="button"
                className={`relative px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans uppercase tracking-wider shrink-0 transition-all min-h-[44px] min-w-[54px] flex items-center justify-center select-none active:scale-95 ${
                  isSelected
                    ? "text-[#15392D] font-semibold shadow-sm"
                    : "text-[#59645E] bg-white hover:bg-[#F8F7F3] border border-[#E7E2D8] font-medium"
                }`}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeMonth"
                    className="absolute inset-0 bg-[#C5A46B]/20 border border-[#C5A46B] rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span>{m.month.slice(0, 3)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Month Interactive Details: Responsive Full-Width Climate Information Cards */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-9 lg:p-11 border border-[#E7E2D8] shadow-[0_12px_40px_rgba(21,57,45,0.05)] w-full max-w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={data.month}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 sm:space-y-7 w-full max-w-full"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-[#E7E2D8] w-full">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-[#15392D] break-words">
                    {data.month} in Sri Lanka
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#C5A46B]/15 text-[#15392D] border border-[#C5A46B]/30 shrink-0"
                  >
                    {data.seasonType}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#59645E] font-light leading-relaxed break-words">
                  {data.recommendation}
                </p>
              </div>

              <div className="bg-[#F8F7F3] px-4 py-2.5 rounded-2xl border border-[#E7E2D8] shrink-0 flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-[#C5A46B] shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-[#59645E]/70 uppercase tracking-wider block">Average Climate</span>
                    <span className="text-xs font-serif font-medium text-[#15392D]">{data.averageTemp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Detail columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
              <div className="bg-[#F8F7F3] p-4 sm:p-6 rounded-2xl border border-[#E7E2D8] space-y-3 min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#15392D]">
                  <Sun className="w-4 h-4 text-[#C5A46B] shrink-0" />
                  <span>Sunniest Regions</span>
                </div>
                <div className="space-y-2">
                  {data.sunnyRegions.map((region, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#59645E] font-sans leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A46B] mt-0.5 shrink-0" />
                      <span className="break-words">{region}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#F8F7F3] p-4 sm:p-6 rounded-2xl border border-[#E7E2D8] space-y-3 min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#15392D]">
                  <Waves className="w-4 h-4 text-[#C5A46B] shrink-0" />
                  <span>Coastal Waters</span>
                </div>
                <p className="text-xs text-[#59645E] font-sans leading-relaxed break-words">
                  {data.seaCondition}
                </p>
              </div>

              <div className="bg-[#F8F7F3] p-4 sm:p-6 rounded-2xl border border-[#E7E2D8] space-y-3 min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#15392D]">
                  <Sparkles className="w-4 h-4 text-[#C5A46B] shrink-0" />
                  <span>Wildlife Spectacle</span>
                </div>
                <p className="text-xs text-[#59645E] font-sans leading-relaxed break-words">
                  {data.wildlifeHighlight}
                </p>
              </div>
            </div>

            {/* Recommended itinerary for month */}
            <div className="pt-4 border-t border-[#E7E2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 bg-[#15392D] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#C5A46B]/30 w-full">
              <div className="min-w-0 w-full sm:w-auto">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A46B] block">
                  Recommended Circuit for {data.month}
                </span>
                <span className="font-serif text-base sm:text-lg font-medium text-white mt-0.5 block break-words">
                  {data.recommendedTourName}
                </span>
              </div>
              <Link
                href={data.recommendedTourSlug}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-white hover:bg-[#F8F7F3] text-[#15392D] rounded-full text-xs font-sans font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm group text-center"
              >
                <span>Discover Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#15392D] group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
