"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Filter,
  RotateCcw,
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  X,
  MapPin,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { TourCard } from "@/components/tours/TourCard";
import { TOURS_CATALOG } from "@/data/toursData";

const DESTINATION_OPTIONS = [
  { label: "All Destinations", value: "" },
  { label: "Sigiriya & Cultural Triangle", value: "sigiriya" },
  { label: "Ella & Highlands", value: "ella" },
  { label: "Yala Wildlife", value: "yala" },
  { label: "Galle Dutch Fort", value: "galle" },
  { label: "Mirissa Coast", value: "mirissa" },
  { label: "Nuwara Eliya", value: "nuwara-eliya" },
];

const CATEGORIES = [
  { label: "All Categories", value: "" },
  { label: "Cultural Heritage", value: "cultural" },
  { label: "Wildlife & Safari", value: "wildlife" },
  { label: "Adventure & Hiking", value: "adventure" },
];

function ToursPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlDest = searchParams.get("destination") || "";
  const urlCat = searchParams.get("category") || "";
  const urlRating = searchParams.get("minRating") || "0";
  const urlMaxPrice = searchParams.get("maxPrice") || "200";

  const [tours, setTours] = useState<any[]>(TOURS_CATALOG);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    destination: urlDest,
    category: urlCat,
    maxPrice: Number(urlMaxPrice) || 200,
    minRating: Number(urlRating) || 0,
    tourType: "",
    freeCancellation: false,
    instantBook: false,
  });

  // Sync state when URL search params change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      destination: searchParams.get("destination") || "",
      category: searchParams.get("category") || "",
    }));
  }, [searchParams]);

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
      } finally {
        setLoading(false);
      }
    }
    loadTours();
  }, []);

  // Update URL query parameters on filter changes
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`/tours?${params.toString()}`, { scroll: false });
  };

  const handleDestinationChange = (dest: string) => {
    setFilters((prev) => ({ ...prev, destination: dest }));
    updateQueryParam("destination", dest);
  };

  const handleCategoryChange = (cat: string) => {
    setFilters((prev) => ({ ...prev, category: cat }));
    updateQueryParam("category", cat);
  };

  const resetFilters = () => {
    setFilters({
      destination: "",
      category: "",
      maxPrice: 200,
      minRating: 0,
      tourType: "",
      freeCancellation: false,
      instantBook: false,
    });
    router.replace("/tours", { scroll: false });
  };

  const filtered = useMemo(() => {
    return tours
      .filter((t) => {
        // Destination check
        if (filters.destination) {
          const destLower = filters.destination.toLowerCase();
          const matchSlug = t.destinationSlug?.toLowerCase() === destLower;
          const matchLoc = t.location?.toLowerCase().includes(destLower);
          const matchTitle = t.title?.toLowerCase().includes(destLower);
          if (!matchSlug && !matchLoc && !matchTitle) return false;
        }

        // Category check
        if (filters.category) {
          const catLower = filters.category.toLowerCase();
          const matchCatSlug = t.categorySlug?.toLowerCase() === catLower;
          const matchCatName = t.categoryName?.toLowerCase().includes(catLower);
          const matchType = t.tourType?.toLowerCase().includes(catLower);
          if (!matchCatSlug && !matchCatName && !matchType) return false;
        }

        // Price check
        if (filters.maxPrice && t.price > filters.maxPrice) return false;

        // Rating check
        if (filters.minRating && t.rating < filters.minRating) return false;

        // Tour type check
        if (filters.tourType && t.tourType !== filters.tourType) return false;

        // Flags
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
  }, [tours, filters, sort]);

  const activeFilterCount =
    (filters.destination ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.maxPrice < 200 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.freeCancellation ? 1 : 0) +
    (filters.instantBook ? 1 : 0);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-ceylon-navy rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Tour Discovery Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Sri Lanka Tours & Activities
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Book top-rated day trips, wildlife safaris, scenic mountain trains, and authentic cultural journeys led by licensed native guides.
          </p>
        </div>
      </div>

      {/* Filter and Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-ceylon-navy">
            {filtered.length} {filtered.length === 1 ? "Experience" : "Experiences"} Found
          </span>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-ceylon-navy"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({activeFilterCount})</span>
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Sorting */}
          <div className="flex items-center gap-1.5 text-xs text-ceylon-muted">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-ceylon-navy focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="top-rated">Highest Rated</option>
              <option value="popular">Most Booked</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg ${
                viewMode === "grid" ? "bg-white shadow text-ceylon-blue" : "text-slate-400"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg ${
                viewMode === "list" ? "bg-white shadow text-ceylon-blue" : "text-slate-400"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-extrabold text-xs uppercase tracking-wider text-ceylon-navy flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-ceylon-blue" />
                Filter Tours
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-bold text-rose-600 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-ceylon-navy block">
                Destination
              </label>
              <select
                value={filters.destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-ceylon-text focus:outline-none"
              >
                {DESTINATION_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-ceylon-navy block">
                Experience Category
              </label>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.value}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      filters.category === cat.value
                        ? "bg-ceylon-softblue text-ceylon-blue font-bold"
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === cat.value}
                      onChange={() => handleCategoryChange(cat.value)}
                      className="hidden"
                    />
                    {filters.category === cat.value && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-ceylon-blue" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-ceylon-navy">
                <span>Max Price</span>
                <span className="text-ceylon-blue">${filters.maxPrice} USD</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                step="5"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-ceylon-blue cursor-pointer"
              />
            </div>

            {/* Min Rating */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-ceylon-navy block">
                Minimum Rating
              </label>
              <div className="flex gap-2">
                {[0, 4.8, 4.9].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFilters({ ...filters, minRating: r })}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      filters.minRating === r
                        ? "bg-ceylon-navy text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {r === 0 ? "All" : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Flags */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.freeCancellation}
                  onChange={(e) =>
                    setFilters({ ...filters, freeCancellation: e.target.checked })
                  }
                  className="rounded text-ceylon-blue focus:ring-0"
                />
                <span>Free Cancellation Available</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.instantBook}
                  onChange={(e) =>
                    setFilters({ ...filters, instantBook: e.target.checked })
                  }
                  className="rounded text-ceylon-blue focus:ring-0"
                />
                <span>Instant Confirmation</span>
              </label>
            </div>
          </div>
        </div>

        {/* Tour Listing Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200/80"
                />
              ))}
            </div>
          ) : filtered.length > 0 ? (
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
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
              <Compass className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-ceylon-navy">
                  No Experiences Found
                </h3>
                <p className="text-xs text-ceylon-muted max-w-sm mx-auto">
                  No tours matched your selected filter criteria. Try adjusting the destination, category, or budget slider.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-bold rounded-xl transition-colors shadow"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-16 text-center text-xs text-slate-400">
          Loading tours catalogue...
        </div>
      }
    >
      <ToursPageContent />
    </Suspense>
  );
}
