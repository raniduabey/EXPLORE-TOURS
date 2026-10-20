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
  Calendar,
  Users,
  Sparkles,
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
  { label: "Multi-Day Tour Packages", value: "multiday" },
  { label: "Cultural Heritage", value: "cultural" },
  { label: "Wildlife & Safari", value: "wildlife" },
  { label: "Scenic Rail & Highlands", value: "scenic" },
  { label: "Adventure & Hiking", value: "adventure" },
  { label: "Beach & Coastal Escapes", value: "beaches" },
];

function ToursPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlDest = searchParams.get("destination") || "";
  const urlCat = searchParams.get("category") || "";
  const urlRating = searchParams.get("minRating") || "0";
  const urlMaxPrice = searchParams.get("maxPrice") || "3500";
  const urlDate = searchParams.get("date") || "";
  const urlAdults = searchParams.get("adults") || "";
  const urlChildren = searchParams.get("children") || "";

  const formattedSearchDate = useMemo(() => {
    if (!urlDate) return "";
    const [y, m, d] = urlDate.split("-").map(Number);
    if (!y || !m || !d) return urlDate;
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [urlDate]);

  const [tours, setTours] = useState<any[]>(TOURS_CATALOG);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    destination: urlDest,
    category: urlCat,
    maxPrice: Number(urlMaxPrice) || 3500,
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
      maxPrice: 3500,
      minRating: 0,
      tourType: "",
      freeCancellation: false,
      instantBook: false,
    });
    router.replace("/tours", { scroll: false });
  };

  const hasAnyRatings = useMemo(
    () => tours.some((t) => (t.rating || 0) > 0),
    [tours]
  );

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
          const matchContent =
            (t.title + " " + t.location + " " + (t.highlights || []).join(" ") + " " + (t.shortDescription || ""))
              .toLowerCase()
              .includes(catLower === "scenic" ? "train" : catLower === "beaches" ? "whale" : catLower);
          if (!matchCatSlug && !matchCatName && !matchType && !matchContent) return false;
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
    (filters.maxPrice < 3500 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.freeCancellation ? 1 : 0) +
    (filters.instantBook ? 1 : 0);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-luxury-forest rounded-3xl p-8 sm:p-12 text-luxury-ivory relative overflow-hidden shadow-2xl border border-luxury-gold/30">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-luxury-gold/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-luxury-gold block">
            Curated Island Portfolios
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-luxury-ivory">
            Sri Lankan Journeys & Expeditions
          </h1>
          <p className="text-sm sm:text-base text-luxury-sand/85 font-light leading-relaxed">
            Private chauffeur circuits, wildlife safaris, scenic colonial rail journeys, and immersive heritage explorations crafted with Sri Lanka&apos;s foremost guides.
          </p>
        </div>
      </div>

      {/* Active Search Summary Banner */}
      {(urlDate || urlAdults || filters.destination || filters.category) && (
        <div className="bg-luxury-gold/10 border border-luxury-gold/30 rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-luxury-forest/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
              Active Search:
            </span>
            {filters.destination && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-luxury-forest border border-luxury-sand text-xs font-medium shadow-xs">
                <MapPin className="w-3 h-3 text-luxury-gold" />
                {DESTINATION_OPTIONS.find((d) => d.value === filters.destination)?.label || filters.destination}
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-luxury-forest border border-luxury-sand text-xs font-medium shadow-xs">
                <Compass className="w-3 h-3 text-luxury-gold" />
                {CATEGORIES.find((c) => c.value === filters.category)?.label || filters.category}
              </span>
            )}
            {formattedSearchDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-luxury-forest border border-luxury-sand text-xs font-medium shadow-xs">
                <Calendar className="w-3 h-3 text-luxury-gold" />
                {formattedSearchDate}
              </span>
            )}
            {urlAdults && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-luxury-forest border border-luxury-sand text-xs font-medium shadow-xs">
                <Users className="w-3 h-3 text-luxury-gold" />
                {urlAdults} {Number(urlAdults) === 1 ? "Adult" : "Adults"}
                {urlChildren && Number(urlChildren) > 0 ? `, ${urlChildren} Child${Number(urlChildren) > 1 ? "ren" : ""}` : ""}
              </span>
            )}
          </div>
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-luxury-forest/80 hover:text-luxury-forest underline underline-offset-2 ml-auto"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Filter and Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-luxury-sand/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-serif text-sm font-semibold text-luxury-forest">
            {filtered.length} {filtered.length === 1 ? "Curated Journey" : "Curated Journeys"} Available
          </span>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-xs font-sans font-medium text-luxury-forest border border-luxury-sand"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Refine ({activeFilterCount})</span>
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs font-sans font-medium text-rose-700 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Sorting */}
          <div className="flex items-center gap-2 text-xs text-luxury-charcoal/70">
            <ArrowUpDown className="w-3.5 h-3.5 text-luxury-gold" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-luxury-sand/80 rounded-xl px-3 py-1.5 text-xs font-sans text-luxury-forest focus:outline-none focus:border-luxury-gold"
            >
              <option value="recommended">Curator&apos;s Recommendation</option>
              <option value="top-rated">Highest Guest Rating</option>
              <option value="popular">Most Traveled</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center border border-luxury-sand/80 rounded-xl p-0.5 bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-luxury-gold/20 text-luxury-forest" : "text-luxury-charcoal/40"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-luxury-gold/20 text-luxury-forest" : "text-luxury-charcoal/40"
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
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-luxury-sand/80 shadow-[0_10px_30px_rgba(16,45,36,0.06)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-luxury-sand/70">
              <span className="font-sans font-semibold text-xs uppercase tracking-widest text-luxury-forest flex items-center gap-2">
                <Filter className="w-4 h-4 text-luxury-gold" />
                Refine Itineraries
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-sans font-medium text-rose-700 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-luxury-forest block">
                Destination
              </label>
              <select
                value={filters.destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-luxury-sand/80 rounded-xl px-3 py-2 text-xs font-medium text-luxury-forest focus:outline-none focus:border-luxury-gold"
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
              <label className="text-xs font-semibold text-luxury-forest block">
                Experience Category
              </label>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.value}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      filters.category === cat.value
                        ? "bg-luxury-gold/15 text-luxury-forest font-semibold"
                        : "hover:bg-[#FAF8F5] text-luxury-charcoal/80"
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
                      <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-luxury-forest">
                <span>Max Price</span>
                <span className="text-luxury-gold font-serif font-bold">${filters.maxPrice} USD</span>
              </div>
              <input
                type="range"
                min="40"
                max="3500"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-luxury-forest cursor-pointer"
              />
            </div>

            {/* Min Rating - only displayed when genuine approved ratings exist */}
            {hasAnyRatings ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-luxury-forest block">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[0, 4.0, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFilters({ ...filters, minRating: r })}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        filters.minRating === r
                          ? "bg-luxury-forest text-luxury-ivory"
                          : "bg-[#FAF8F5] text-luxury-charcoal/70 hover:bg-luxury-sand/50"
                      }`}
                    >
                      {r === 0 ? "All" : `${r}★+`}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-luxury-sand/70 text-[11px] text-luxury-charcoal/70">
                <span className="font-semibold text-luxury-forest block mb-0.5">Verified Reviews</span>
                Reviews are collected and verified directly from completed guest bookings.
              </div>
            )}

            {/* Toggle Flags */}
            <div className="space-y-2 pt-2 border-t border-luxury-sand/70">
              <label className="flex items-center gap-2 text-xs font-medium text-luxury-charcoal/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.freeCancellation}
                  onChange={(e) =>
                    setFilters({ ...filters, freeCancellation: e.target.checked })
                  }
                  className="rounded text-luxury-forest focus:ring-0 accent-luxury-forest"
                />
                <span>Free Cancellation Available</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-luxury-charcoal/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.instantBook}
                  onChange={(e) =>
                    setFilters({ ...filters, instantBook: e.target.checked })
                  }
                  className="rounded text-luxury-forest focus:ring-0 accent-luxury-forest"
                />
                <span>Instant Confirmation</span>
              </label>
            </div>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-luxury-sand/70">
                <span className="font-sans font-semibold text-xs uppercase tracking-widest text-luxury-forest flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-luxury-gold" />
                  Filter Tours
                </span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-luxury-charcoal/50 hover:text-luxury-forest hover:bg-luxury-sand/30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-luxury-forest block">
                  Destination
                </label>
                <select
                  value={filters.destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-luxury-sand/80 rounded-xl px-3 py-2 text-xs font-medium text-luxury-forest focus:outline-none focus:border-luxury-gold"
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
                <label className="text-xs font-semibold text-luxury-forest block">
                  Experience Category
                </label>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat.value}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                        filters.category === cat.value
                          ? "bg-luxury-gold/15 text-luxury-forest font-semibold"
                          : "hover:bg-[#FAF8F5] text-luxury-charcoal/80"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <input
                        type="radio"
                        name="category-mobile"
                        checked={filters.category === cat.value}
                        onChange={() => handleCategoryChange(cat.value)}
                        className="hidden"
                      />
                      {filters.category === cat.value && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Price Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-luxury-forest">
                  <span>Max Price</span>
                  <span className="text-luxury-gold font-serif font-bold">${filters.maxPrice} USD</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="3500"
                  step="50"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  className="w-full accent-luxury-forest cursor-pointer"
                />
              </div>

              {/* Apply & Reset Buttons */}
              <div className="pt-4 border-t border-luxury-sand/70 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 rounded-xl border border-luxury-sand/80 text-xs font-medium text-luxury-charcoal/70 hover:bg-[#FAF8F5]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-luxury-forest hover:bg-luxury-emerald text-luxury-ivory text-xs font-medium transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tour Listing Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-luxury-sand/60"
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
                <TourCard
                  key={tour.id}
                  tour={tour}
                  searchParamsString={searchParams.toString()}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-luxury-sand/80 space-y-4">
              <Compass className="w-12 h-12 text-luxury-gold/50 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-xl font-serif font-normal text-luxury-forest">
                  No Experiences Found
                </h3>
                <p className="text-xs text-luxury-charcoal/70 max-w-sm mx-auto font-light">
                  No tours matched your selected filter criteria. Try adjusting the destination, category, or budget slider.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-luxury-forest hover:bg-luxury-emerald text-luxury-ivory text-xs font-medium rounded-xl transition-colors shadow"
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
