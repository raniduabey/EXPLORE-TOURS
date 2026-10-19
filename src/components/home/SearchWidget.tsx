"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Compass,
  Calendar as CalendarIcon,
  Users,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  X,
  Landmark,
  Mountain,
  Waves,
  Plus,
  Minus,
} from "lucide-react";
import { DESTINATIONS_CATALOG } from "@/data/destinationsData";

type ActiveDropdown = "destination" | "activity" | "date" | "travellers" | null;

interface CategoryOption {
  value: string;
  label: string;
  desc: string;
  icon: React.ElementType;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    value: "",
    label: "All Activities",
    desc: "Browse all authentic Sri Lanka journeys",
    icon: Sparkles,
  },
  {
    value: "multiday",
    label: "Multi-Day Tour Packages",
    desc: "Complete 5–14 day private island circuits",
    icon: CalendarIcon,
  },
  {
    value: "cultural",
    label: "Cultural Heritage",
    desc: "Sigiriya rock citadel & ancient temples",
    icon: Landmark,
  },
  {
    value: "wildlife",
    label: "Wildlife Safaris",
    desc: "Yala leopards, wild elephants & safaris",
    icon: Compass,
  },
  {
    value: "adventure",
    label: "Adventure & Hiking",
    desc: "Ella mountain peaks, Nine Arch & tea trails",
    icon: Mountain,
  },
  {
    value: "beaches",
    label: "Beach & Coastal Experiences",
    desc: "Mirissa whale watching & sunny south coast",
    icon: Waves,
  },
];

export const SearchWidget: React.FC = () => {
  const router = useRouter();
  const widgetRef = useRef<HTMLDivElement>(null);

  // Centralized dropdown state: strictly only ONE dropdown open at a time
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);

  // Committed search values
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(""); // format: YYYY-MM-DD
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Filter input state inside destination dropdown
  const [destinationSearch, setDestinationSearch] = useState("");

  // Calendar navigation state (month/year)
  const today = new Date();
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // Toggle dropdown with mutual exclusion
  const toggleDropdown = (name: "destination" | "activity" | "date" | "travellers") => {
    setActiveDropdown((current) => (current === name ? null : name));
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  // Click outside and Escape key listeners
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Filter destinations based on search query
  const filteredDestinations = DESTINATIONS_CATALOG.filter((d) => {
    if (!destinationSearch.trim()) return true;
    const q = destinationSearch.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.slug.toLowerCase().includes(q) ||
      d.popularAttractions.toLowerCase().includes(q) ||
      d.shortDesc.toLowerCase().includes(q)
    );
  });

  // Calendar navigation helpers
  const handlePrevMonth = () => {
    setCalendarViewDate(
      new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCalendarViewDate(
      new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1)
    );
  };

  const isCurrentMonth =
    calendarViewDate.getFullYear() === today.getFullYear() &&
    calendarViewDate.getMonth() === today.getMonth();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const viewYear = calendarViewDate.getFullYear();
  const viewMonth = calendarViewDate.getMonth();
  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const monthName = calendarViewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Formatted date string for input display
  const formattedDisplayDate = React.useMemo(() => {
    if (!date) return "";
    const [y, m, d] = date.split("-").map(Number);
    if (!y || !m || !d) return date;
    const dObj = new Date(y, m - 1, d);
    return dObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [date]);

  // Formatted travellers string
  const formattedTravellers = React.useMemo(() => {
    const parts: string[] = [];
    parts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
    if (children > 0) {
      parts.push(`${children} Child${children > 1 ? "ren" : ""}`);
    }
    if (infants > 0) {
      parts.push(`${infants} Infant${infants > 1 ? "s" : ""}`);
    }
    return parts.join(", ");
  }, [adults, children, infants]);

  // Handle Search Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeDropdown();

    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    if (category) params.append("category", category);
    if (date) params.append("date", date);
    if (adults > 0) params.append("adults", adults.toString());
    if (children > 0) params.append("children", children.toString());

    router.push(`/tours?${params.toString()}`);
  };

  const selectedDestinationObj = DESTINATIONS_CATALOG.find((d) => d.slug === destination);
  const selectedCategoryObj = CATEGORY_OPTIONS.find((c) => c.value === category);

  return (
    <div
      ref={widgetRef}
      className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-2.5 sm:p-4 shadow-[0_20px_50px_rgba(16,45,36,0.12)] border border-luxury-sand/80 relative z-40 transition-shadow duration-300"
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-end">
        {/* ============================================================ */}
        {/* 1. DESTINATION SELECTOR */}
        {/* ============================================================ */}
        <div className="relative col-span-12 md:col-span-6 lg:col-span-3">
          <label className="block text-[10px] font-sans font-semibold text-luxury-charcoal/60 uppercase tracking-[0.14em] mb-1 sm:mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <span>Destination</span>
          </label>
          <button
            type="button"
            onClick={() => toggleDropdown("destination")}
            className={`w-full h-11 sm:h-12 bg-[#FAF8F5] hover:bg-[#F5F2EB] border rounded-xl px-3 sm:px-3.5 text-left text-xs font-sans cursor-pointer flex items-center justify-between transition-all ${
              activeDropdown === "destination"
                ? "border-luxury-gold ring-2 ring-luxury-gold/20 bg-white"
                : "border-luxury-sand/80 hover:border-luxury-gold/50"
            }`}
            aria-haspopup="listbox"
            aria-expanded={activeDropdown === "destination"}
          >
            <span className={`truncate mr-2 ${destination ? "text-luxury-forest font-semibold" : "text-luxury-charcoal/50"}`}>
              {selectedDestinationObj ? selectedDestinationObj.name : "Where would you like to go?"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-luxury-gold shrink-0 transition-transform duration-200 ${
                activeDropdown === "destination" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Destination Dropdown Popover */}
          <AnimatePresence>
            {activeDropdown === "destination" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute left-0 top-full mt-2 w-full sm:w-88 md:w-96 bg-white rounded-2xl shadow-2xl border border-luxury-sand/80 p-3 z-50 space-y-2"
                style={{ maxHeight: "360px" }}
              >
                {/* Search Destination Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-luxury-charcoal/40 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search destination, e.g. Sigiriya, Ella..."
                    value={destinationSearch}
                    onChange={(e) => setDestinationSearch(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-luxury-sand/80 rounded-xl pl-8 pr-8 py-2 text-xs font-medium text-luxury-forest placeholder:text-luxury-charcoal/40 focus:outline-none focus:border-luxury-gold focus:bg-white"
                    autoFocus
                  />
                  {destinationSearch && (
                    <button
                      type="button"
                      onClick={() => setDestinationSearch("")}
                      className="absolute right-2.5 top-2.5 p-0.5 text-luxury-charcoal/40 hover:text-luxury-forest rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Destinations List with Thumbnails & Smooth Scrolling */}
                <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {/* All Destinations Option */}
                  <div
                    onClick={() => {
                      setDestination("");
                      closeDropdown();
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer flex items-center justify-between transition-colors ${
                      destination === ""
                        ? "bg-luxury-gold/15 text-luxury-forest font-semibold border border-luxury-gold/30"
                        : "text-luxury-charcoal/80 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-luxury-forest/5 text-luxury-gold flex items-center justify-center shrink-0 font-bold border border-luxury-gold/25">
                        🇱🇰
                      </div>
                      <div>
                        <span className="font-semibold text-xs block text-luxury-forest">
                          All Sri Lanka Destinations
                        </span>
                        <span className="text-[10px] text-luxury-charcoal/50 block">
                          Explore island-wide private tours
                        </span>
                      </div>
                    </div>
                    {destination === "" && (
                      <span className="w-5 h-5 rounded-full bg-luxury-forest text-luxury-gold flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    )}
                  </div>

                  {filteredDestinations.length === 0 ? (
                    <div className="py-6 text-center text-xs text-luxury-charcoal/50 space-y-1">
                      <p>No destinations found matching &ldquo;{destinationSearch}&rdquo;</p>
                      <button
                        type="button"
                        onClick={() => setDestinationSearch("")}
                        className="text-xs font-semibold text-luxury-forest hover:text-luxury-gold underline"
                      >
                        Reset search
                      </button>
                    </div>
                  ) : (
                    filteredDestinations.map((d) => {
                      const isSelected = destination === d.slug;
                      return (
                        <div
                          key={d.slug}
                          onClick={() => {
                            setDestination(d.slug);
                            closeDropdown();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected
                              ? "bg-luxury-gold/15 text-luxury-forest font-semibold border border-luxury-gold/30"
                              : "text-luxury-charcoal/80 hover:bg-[#FAF8F5]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-luxury-sand/60 bg-slate-100">
                              <Image
                                src={d.image}
                                alt={d.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-xs block text-luxury-forest truncate">
                                {d.name}
                              </span>
                              <span className="text-[10px] text-luxury-charcoal/50 block truncate">
                                {d.popularAttractions.split(",").slice(0, 2).join(", ")}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-luxury-forest text-luxury-gold flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* 2. ACTIVITY TYPE SELECTOR */}
        {/* ============================================================ */}
        <div className="relative col-span-12 md:col-span-6 lg:col-span-3">
          <label className="block text-[10px] font-sans font-semibold text-luxury-charcoal/60 uppercase tracking-[0.14em] mb-1 sm:mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <span>Activity Type</span>
          </label>
          <button
            type="button"
            onClick={() => toggleDropdown("activity")}
            className={`w-full h-11 sm:h-12 bg-[#FAF8F5] hover:bg-[#F5F2EB] border rounded-xl px-3 sm:px-3.5 text-left text-xs font-sans cursor-pointer flex items-center justify-between transition-all ${
              activeDropdown === "activity"
                ? "border-luxury-gold ring-2 ring-luxury-gold/20 bg-white"
                : "border-luxury-sand/80 hover:border-luxury-gold/50"
            }`}
            aria-haspopup="listbox"
            aria-expanded={activeDropdown === "activity"}
          >
            <span className={`truncate mr-2 ${category ? "text-luxury-forest font-semibold" : "text-luxury-charcoal/50"}`}>
              {selectedCategoryObj ? selectedCategoryObj.label : "All Activities"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-luxury-gold shrink-0 transition-transform duration-200 ${
                activeDropdown === "activity" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Activity Dropdown Popover */}
          <AnimatePresence>
            {activeDropdown === "activity" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute left-0 top-full mt-2 w-full sm:w-80 md:w-88 bg-white rounded-2xl shadow-2xl border border-luxury-sand/80 p-2.5 z-50 space-y-1"
                style={{ maxHeight: "360px" }}
              >
                <div className="max-h-72 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {CATEGORY_OPTIONS.map((c) => {
                    const Icon = c.icon;
                    const isSelected = category === c.value;
                    return (
                      <div
                        key={c.value}
                        onClick={() => {
                          setCategory(c.value);
                          closeDropdown();
                        }}
                        className={`px-3 py-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-luxury-gold/15 text-luxury-forest font-semibold border border-luxury-gold/30"
                            : "text-luxury-charcoal/80 hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-luxury-forest text-luxury-gold"
                                : "bg-[#FAF8F5] text-luxury-forest"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-xs block text-luxury-forest truncate">
                              {c.label}
                            </span>
                            <span className="text-[10px] text-luxury-charcoal/50 block truncate">
                              {c.desc}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-luxury-forest text-luxury-gold flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* 3. TRAVEL DATE SELECTOR (PREMIUM DATE PICKER) */}
        {/* ============================================================ */}
        <div className="relative col-span-12 md:col-span-4 lg:col-span-2">
          <label className="block text-[10px] font-sans font-semibold text-luxury-charcoal/60 uppercase tracking-[0.14em] mb-1 sm:mb-1.5 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <span>Travel Date</span>
          </label>
          <button
            type="button"
            onClick={() => toggleDropdown("date")}
            className={`w-full h-11 sm:h-12 bg-[#FAF8F5] hover:bg-[#F5F2EB] border rounded-xl px-3 text-left text-xs font-sans cursor-pointer flex items-center justify-between transition-all ${
              activeDropdown === "date"
                ? "border-luxury-gold ring-2 ring-luxury-gold/20 bg-white"
                : "border-luxury-sand/80 hover:border-luxury-gold/50"
            }`}
            aria-haspopup="dialog"
            aria-expanded={activeDropdown === "date"}
          >
            <span className={`truncate mr-1.5 ${date ? "text-luxury-forest font-semibold" : "text-luxury-charcoal/50"}`}>
              {formattedDisplayDate || "Select date"}
            </span>
            <CalendarIcon
              className={`w-4 h-4 text-luxury-gold shrink-0 ${
                activeDropdown === "date" ? "text-luxury-forest" : ""
              }`}
            />
          </button>

          {/* Premium Date Picker Popover */}
          <AnimatePresence>
            {activeDropdown === "date" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute left-0 sm:left-auto sm:right-0 md:left-0 top-full mt-2 w-[calc(100vw-3rem)] max-w-[340px] bg-white rounded-3xl shadow-2xl border border-luxury-sand/80 p-4 sm:p-5 z-50 space-y-4"
              >
                {/* Header: Month & Year with Navigation Arrows */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={isCurrentMonth}
                    className="p-1.5 rounded-xl hover:bg-[#FAF8F5] text-luxury-forest disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous Month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <h4 className="text-xs sm:text-sm font-serif font-medium text-luxury-forest tracking-wide">
                    {monthName}
                  </h4>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-xl hover:bg-[#FAF8F5] text-luxury-forest transition-colors"
                    aria-label="Next Month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Weekday Row */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((dayName) => (
                    <span
                      key={dayName}
                      className="text-[10px] font-sans font-semibold text-luxury-charcoal/40 tracking-wider py-1"
                    >
                      {dayName}
                    </span>
                  ))}
                </div>

                {/* Calendar Days 7-Col Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Empty cells before 1st day of month */}
                  {Array.from({ length: firstDay }).map((_, idx) => (
                    <div key={`blank-${idx}`} className="h-9 w-full" />
                  ))}

                  {/* Day numbers */}
                  {Array.from({ length: totalDays }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const cellDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                    const isPast = cellDateStr < todayStr;
                    const isToday = cellDateStr === todayStr;
                    const isSelected = cellDateStr === date;

                    return (
                      <button
                        type="button"
                        key={dayNum}
                        disabled={isPast}
                        onClick={() => {
                          setDate(cellDateStr);
                          closeDropdown();
                        }}
                        className={`h-9 w-full rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-luxury-forest text-luxury-ivory font-bold shadow-sm scale-105"
                            : isPast
                            ? "text-luxury-charcoal/25 cursor-not-allowed pointer-events-none"
                            : isToday
                            ? "ring-1.5 ring-luxury-gold text-luxury-forest font-semibold hover:bg-luxury-gold/15"
                            : "text-luxury-charcoal hover:bg-luxury-gold/15 hover:text-luxury-forest cursor-pointer"
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Shortcuts & Clear Action */}
                <div className="pt-3 border-t border-luxury-sand/60 flex items-center justify-between text-xs">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const tStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
                        setDate(tStr);
                        closeDropdown();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-luxury-gold/15 text-luxury-forest text-[11px] font-sans font-medium transition-colors border border-luxury-sand/60"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const inAWeek = new Date();
                        inAWeek.setDate(inAWeek.getDate() + 7);
                        const wStr = `${inAWeek.getFullYear()}-${String(inAWeek.getMonth() + 1).padStart(2, "0")}-${String(inAWeek.getDate()).padStart(2, "0")}`;
                        setDate(wStr);
                        closeDropdown();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-luxury-gold/15 text-luxury-forest text-[11px] font-sans font-medium transition-colors border border-luxury-sand/60"
                    >
                      In 7 Days
                    </button>
                  </div>

                  {date && (
                    <button
                      type="button"
                      onClick={() => {
                        setDate("");
                        closeDropdown();
                      }}
                      className="text-[11px] font-sans font-medium text-rose-600 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* 4. TRAVELLERS SELECTOR */}
        {/* ============================================================ */}
        <div className="relative col-span-12 md:col-span-4 lg:col-span-2">
          <label className="block text-[10px] font-sans font-semibold text-luxury-charcoal/60 uppercase tracking-[0.14em] mb-1 sm:mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <span>Travellers</span>
          </label>
          <button
            type="button"
            onClick={() => toggleDropdown("travellers")}
            className={`w-full h-11 sm:h-12 bg-[#FAF8F5] hover:bg-[#F5F2EB] border rounded-xl px-3 text-left text-xs font-sans cursor-pointer flex items-center justify-between transition-all ${
              activeDropdown === "travellers"
                ? "border-luxury-gold ring-2 ring-luxury-gold/20 bg-white"
                : "border-luxury-sand/80 hover:border-luxury-gold/50"
            }`}
            aria-haspopup="dialog"
            aria-expanded={activeDropdown === "travellers"}
          >
            <span className="truncate mr-1 text-luxury-forest font-semibold">
              {formattedTravellers}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-luxury-gold shrink-0 transition-transform duration-200 ${
                activeDropdown === "travellers" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Travellers Counter Popover */}
          <AnimatePresence>
            {activeDropdown === "travellers" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-[calc(100vw-3rem)] max-w-xs sm:w-80 bg-white rounded-3xl shadow-2xl border border-luxury-sand/80 p-5 z-50 space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Adults row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-luxury-forest block">
                        Adults
                      </span>
                      <span className="text-[10px] text-luxury-charcoal/50 block">
                        Age 12+ years
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        disabled={adults <= 1}
                        className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-luxury-sand/50 border border-luxury-sand/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-luxury-forest transition-colors"
                        aria-label="Decrease Adults"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-semibold text-luxury-forest w-5 text-center">
                        {adults}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(15, adults + 1))}
                        disabled={adults >= 15}
                        className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-luxury-sand/50 border border-luxury-sand/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-luxury-forest transition-colors"
                        aria-label="Increase Adults"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Children row */}
                  <div className="flex items-center justify-between pt-2 border-t border-luxury-sand/60">
                    <div>
                      <span className="text-xs font-semibold text-luxury-forest block">
                        Children
                      </span>
                      <span className="text-[10px] text-luxury-charcoal/50 block">
                        Age 2–11 years
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        disabled={children <= 0}
                        className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-luxury-sand/50 border border-luxury-sand/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-luxury-forest transition-colors"
                        aria-label="Decrease Children"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-semibold text-luxury-forest w-5 text-center">
                        {children}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildren(Math.min(10, children + 1))}
                        disabled={children >= 10}
                        className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-luxury-sand/50 border border-luxury-sand/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-luxury-forest transition-colors"
                        aria-label="Increase Children"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Infants row */}
                  <div className="flex items-center justify-between pt-2 border-t border-luxury-sand/60">
                    <div>
                      <span className="text-xs font-semibold text-luxury-forest block">
                        Infants
                      </span>
                      <span className="text-[10px] text-luxury-charcoal/50 block">
                        Under 2 years (Complimentary)
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setInfants(Math.max(0, infants - 1))}
                        disabled={infants <= 0}
                        className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-luxury-sand/50 border border-luxury-sand/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-luxury-forest transition-colors"
                        aria-label="Decrease Infants"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-semibold text-luxury-forest w-5 text-center">
                        {infants}
                      </span>
                      <button
                        type="button"
                        onClick={() => setInfants(Math.min(5, infants + 1))}
                        disabled={infants >= 5}
                        className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-luxury-sand/50 border border-luxury-sand/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-luxury-forest transition-colors"
                        aria-label="Increase Infants"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={closeDropdown}
                    className="w-full py-2.5 bg-luxury-forest hover:bg-luxury-emerald text-luxury-ivory rounded-xl text-xs font-sans uppercase tracking-wider font-semibold transition-colors shadow-sm"
                  >
                    Apply Travellers
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* 5. SEARCH TOURS BUTTON */}
        {/* ============================================================ */}
        <div className="col-span-12 md:col-span-4 lg:col-span-2">
          <button
            type="submit"
            className="h-11 sm:h-12 w-full bg-gradient-to-r from-[#DFBE82] via-[#C9A86A] to-[#A88647] hover:brightness-105 text-luxury-forest font-sans font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            aria-label="Search tours"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Search Tours</span>
          </button>
        </div>
      </form>

      {/* Popular Curated Search Shortcuts */}
      <div className="mt-2.5 sm:mt-3.5 pt-2.5 sm:pt-3 border-t border-luxury-sand/60 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span className="text-[10px] sm:text-[11px] font-sans font-medium text-luxury-charcoal/60 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
          Popular Curations:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href="/tours/8-day-splendour-of-sri-lanka-classical-circuit"
            className="px-3 py-1 rounded-full bg-[#FAF8F5] hover:bg-luxury-gold/15 text-luxury-forest font-sans text-[11px] transition-colors border border-luxury-sand/80"
          >
            ✦ 8-Day Classical Circuit
          </Link>
          <Link
            href="/tours/sigiriya-rock-fortress-dambulla-day-tour"
            className="px-3 py-1 rounded-full bg-[#FAF8F5] hover:bg-luxury-gold/15 text-luxury-forest font-sans text-[11px] transition-colors border border-luxury-sand/80"
          >
            ✦ Sigiriya Citadel
          </Link>
          <Link
            href="/tours/kandy-to-ella-scenic-train-journey"
            className="px-3 py-1 rounded-full bg-[#FAF8F5] hover:bg-luxury-gold/15 text-luxury-forest font-sans text-[11px] transition-colors border border-luxury-sand/80"
          >
            ✦ Ella Scenic Rail
          </Link>
          <Link
            href="/tours/yala-national-park-private-safari"
            className="px-3 py-1 rounded-full bg-[#FAF8F5] hover:bg-luxury-gold/15 text-luxury-forest font-sans text-[11px] transition-colors border border-luxury-sand/80"
          >
            ✦ Yala Private Safari
          </Link>
          <Link
            href="/tours?category=multiday"
            className="px-3 py-1 rounded-full bg-luxury-gold/20 hover:bg-luxury-gold/30 text-luxury-forest font-sans font-medium text-[11px] transition-colors border border-luxury-gold/40"
          >
            ✨ Multi-Day Journeys
          </Link>
        </div>
      </div>
    </div>
  );
};
