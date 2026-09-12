"use client";
import React, { useState, useEffect } from "react";
import {
  Filter,
  RotateCcw,
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  Map as MapIcon,
  X,
  MapPin
} from "lucide-react";
import { TourCard } from "@/components/tours/TourCard";

const CITIES = [
  "All",
  "Colombo",
  "Negombo",
  "Kandy",
  "Sigiriya",
  "Ella",
  "Galle",
  "Mirissa",
  "Bentota",
  "Yala",
  "Nuwara Eliya",
  "Arugam Bay"
];

const CATEGORIES = [
  { label: "All Categories", value: "" },
  { label: "Cultural Heritage", value: "cultural" },
  { label: "Wildlife & Safari", value: "wildlife" },
  { label: "Adventure & Hiking", value: "adventure" },
  { label: "Beaches & Ocean", value: "beaches" },
  { label: "Food & Culinary", value: "food" },
  { label: "Scenic Journeys", value: "scenic" }
];

const FALLBACK_TOURS = [
  {
    id: "tour-sigiriya",
    title: "Sigiriya Rock Fortress & Dambulla Cave Temple Day Tour",
    slug: "sigiriya-rock-fortress-dambulla-day-tour",
    location: "Sigiriya & Dambulla",
    duration: "10 Hours",
    rating: 4.95,
    reviewCount: 342,
    price: 85,
    previousPrice: 110,
    tourType: "Private Tour",
    badge: "Bestseller",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "tour-ella",
    title: "Kandy to Ella Scenic Blue Train & Tea Country Trek",
    slug: "kandy-to-ella-scenic-train-journey",
    location: "Ella & Highlands",
    duration: "1 Day",
    rating: 4.98,
    reviewCount: 420,
    price: 65,
    previousPrice: 85,
    tourType: "Small Group",
    badge: "Iconic Experience",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "tour-yala",
    title: "Yala National Park Leopard Safari in 4x4 Jeep",
    slug: "yala-national-park-safari",
    location: "Yala National Park",
    duration: "6 Hours",
    rating: 4.91,
    reviewCount: 285,
    price: 95,
    previousPrice: 125,
    tourType: "Private Safari",
    badge: "Wild Ceylon",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "tour-galle",
    title: "Galle Dutch Fort Walking Tour & Southern Coast Highlights",
    slug: "galle-fort-walking-tour",
    location: "Galle & Coast",
    duration: "5 Hours",
    rating: 4.88,
    reviewCount: 198,
    price: 45,
    previousPrice: 60,
    tourType: "Walking Tour",
    badge: "Heritage Pick",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "https://images.unsplash.com/photo-1566296566002-390b1062b186?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "tour-mirissa",
    title: "Mirissa Whale Watching & Coral Reef Snorkeling Expedition",
    slug: "mirissa-whale-watching",
    location: "Mirissa Bay",
    duration: "4 Hours",
    rating: 4.86,
    reviewCount: 215,
    price: 75,
    previousPrice: 95,
    tourType: "Boat Cruise",
    badge: "Ocean Adventure",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "tour-nuwara-eliya",
    title: "Nuwara Eliya \"Little England\" Tea Plantation & Waterfall Trail",
    slug: "nuwara-eliya-tea-trail",
    location: "Nuwara Eliya",
    duration: "8 Hours",
    rating: 4.92,
    reviewCount: 164,
    price: 70,
    previousPrice: 90,
    tourType: "Scenic Drive",
    badge: "Highland Beauty",
    freeCancellation: true,
    instantBook: true,
    primaryImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop"
  }
];

const FilterSidebar = ({ filters, onChange, onReset }: any) => (
  <aside className="w-full bg-white rounded-2xl p-5 shadow-card border border-slate-200/80 space-y-6">
    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-ceylon-blue" />
        <h3 className="font-extrabold text-base text-ceylon-navy">Filter Experiences</h3>
      </div>
      <button
        onClick={onReset}
        className="text-xs font-semibold text-ceylon-muted hover:text-rose-500 flex items-center gap-1 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset All</span>
      </button>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-bold text-ceylon-navy uppercase tracking-wider block">
        Destination
      </label>
      <select
        value={filters.destination}
        onChange={(e) => onChange({ ...filters, destination: e.target.value })}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-ceylon-text focus:outline-none focus:border-ceylon-blue"
      >
        {CITIES.map((city) => (
          <option key={city} value={city === "All" ? "" : city}>
            {city === "All" ? "All Sri Lanka Destinations" : city}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-bold text-ceylon-navy uppercase tracking-wider block">
        Category
      </label>
      <div className="space-y-1.5">
        {CATEGORIES.map((cat) => (
          <label
            key={cat.label}
            className="flex items-center gap-2 text-xs text-ceylon-text cursor-pointer hover:text-ceylon-blue"
          >
            <input
              type="radio"
              name="category"
              checked={filters.category === cat.value}
              onChange={() => onChange({ ...filters, category: cat.value })}
              className="accent-ceylon-blue"
            />
            <span>{cat.label}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <div className="flex items-center justify-between text-xs font-bold text-ceylon-navy">
        <span>Max Price</span>
        <span className="text-ceylon-blue">${filters.maxPrice}</span>
      </div>
      <input
        type="range"
        min="20"
        max="200"
        step="5"
        value={filters.maxPrice}
        onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
        className="w-full accent-ceylon-green cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
        <span>$20</span>
        <span>$100</span>
        <span>$200+</span>
      </div>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <label className="text-xs font-bold text-ceylon-navy uppercase tracking-wider block">
        Rating
      </label>
      <div className="flex gap-2">
        {[0, 4, 4.5, 4.8].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange({ ...filters, minRating: r })}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
              filters.minRating === r
                ? "bg-ceylon-navy text-white border-ceylon-navy"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Star className="w-3 h-3 fill-current text-amber-400" />
            <span>{r === 0 ? "Any" : `${r}+`}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <label className="text-xs font-bold text-ceylon-navy uppercase tracking-wider block">
        Tour Type
      </label>
      <div className="space-y-1.5">
        {["All Types", "Private Tour", "Small Group", "Shared"].map((t) => {
          const val = t === "All Types" ? "" : t;
          return (
            <label key={t} className="flex items-center gap-2 text-xs text-ceylon-text cursor-pointer">
              <input
                type="radio"
                name="tourType"
                checked={filters.tourType === val}
                onChange={() => onChange({ ...filters, tourType: val })}
                className="accent-ceylon-blue"
              />
              <span>{t}</span>
            </label>
          );
        })}
      </div>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <label className="text-xs font-bold text-ceylon-navy uppercase tracking-wider block">
        Key Features
      </label>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs text-ceylon-text cursor-pointer">
          <input
            type="checkbox"
            checked={filters.freeCancellation}
            onChange={(e) => onChange({ ...filters, freeCancellation: e.target.checked })}
            className="accent-ceylon-green rounded"
          />
          <span>Free Cancellation</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-ceylon-text cursor-pointer">
          <input
            type="checkbox"
            checked={filters.instantBook}
            onChange={(e) => onChange({ ...filters, instantBook: e.target.checked })}
            className="accent-ceylon-green rounded"
          />
          <span>Instant Confirmation</span>
        </label>
      </div>
    </div>
  </aside>
);

const MapModal = ({ isOpen, onClose, tours }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[600px] overflow-hidden shadow-2xl flex flex-col relative">
        <div className="px-6 py-4 bg-ceylon-navy text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Sri Lanka Tour Locations Map</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 relative bg-slate-100 flex items-center justify-center">
          <iframe
            title="Sri Lanka Tour Map"
            src="https://maps.google.com/maps?q=Sri%20Lanka&t=&z=8&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-200/80 max-h-36 overflow-y-auto">
            <h4 className="text-xs font-extrabold text-ceylon-navy mb-2">
              Showing {tours.length} Experiences Across Sri Lanka:
            </h4>
            <div className="flex flex-wrap gap-2">
              {tours.map((t: any) => (
                <span
                  key={t.id}
                  className="px-3 py-1 bg-ceylon-softblue border border-ceylon-blue/20 rounded-full text-xs font-semibold text-ceylon-navy flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-ceylon-blue" />
                  {t.title} (${t.price})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>(FALLBACK_TOURS);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    destination: "",
    category: "",
    maxPrice: 200,
    duration: "",
    minRating: 0,
    tourType: "",
    freeCancellation: false,
    instantBook: false,
  });
  const [sort, setSort] = useState("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mapOpen, setMapOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadTours() {
      try {
        const res = await fetch("/api/tours");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTours(data);
          }
        }
      } catch (err) {
        console.error("Failed to load /api/tours", err);
      }
    }
    loadTours();
  }, []);

  const filtered = tours
    .filter((t) => {
      if (
        filters.destination &&
        !t.location?.toLowerCase().includes(filters.destination.toLowerCase())
      )
        return false;
      if (filters.maxPrice && t.price > filters.maxPrice) return false;
      if (filters.minRating && t.rating < filters.minRating) return false;
      if (filters.tourType && t.tourType !== filters.tourType) return false;
      if (filters.freeCancellation && !t.freeCancellation) return false;
      if (filters.instantBook && !t.instantBook) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "top-rated") return b.rating - a.rating;
      if (sort === "popular") return b.reviewCount - a.reviewCount;
      return 0;
    });

  const resetFilters = () => {
    setFilters({
      destination: "",
      category: "",
      maxPrice: 200,
      duration: "",
      minRating: 0,
      tourType: "",
      freeCancellation: false,
      instantBook: false,
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="bg-ceylon-navy rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Tour Discovery Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Sri Lanka Tours & Activities
          </h1>
          <p className="text-sm text-slate-300">
            Book top-rated day trips, wildlife safaris, highland train rides, and cultural experiences across the island.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-ceylon-navy">
            {filtered.length} Experiences Found
          </span>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden px-3 py-1.5 rounded-lg bg-ceylon-softblue text-ceylon-blue font-bold text-xs flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-ceylon-navy focus:outline-none focus:border-ceylon-blue"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="popular">Most Popular</option>
              <option value="top-rated">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white text-ceylon-navy shadow-sm" : "text-slate-400"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-white text-ceylon-navy shadow-sm" : "text-slate-400"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setMapOpen(true)}
            className="px-4 py-1.5 rounded-xl font-bold text-xs bg-ceylon-green text-white hover:bg-ceylon-darkgreen transition-colors flex items-center gap-1.5"
          >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
          />
        </div>

        {mobileFiltersOpen && (
          <div className="lg:hidden col-span-1">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </div>
        )}

        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-ceylon-navy">
                Nothing matched your search
              </h3>
              <p className="text-xs text-ceylon-muted max-w-sm mx-auto">
                Try clearing your filters or choosing another destination, activity, or price threshold.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-ceylon-navy text-white rounded-xl text-xs font-bold hover:bg-ceylon-blue transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filtered.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </div>

      <MapModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        tours={filtered.map((t) => ({
          id: t.id,
          title: t.title,
          location: t.location,
          price: t.price,
        }))}
      />
    </div>
  );
}
