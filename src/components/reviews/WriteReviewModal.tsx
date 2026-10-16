"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Send,
  MessageSquare,
  ShieldCheck,
  Calendar,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CountrySelect } from "@/components/ui/CountrySelect";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTourId?: string;
  defaultTourTitle?: string;
}

interface TourOption {
  id: string;
  title: string;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  defaultTourId,
  defaultTourTitle,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("United States");
  const [travelDate, setTravelDate] = useState("");
  const [tourId, setTourId] = useState(defaultTourId || "");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [tourOptions, setTourOptions] = useState<TourOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Premium Calendar Popover state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(() => new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Sync calendar view month with selected date if changed
  useEffect(() => {
    if (travelDate) {
      const [y, m, d] = travelDate.split("-").map(Number);
      if (y && m) {
        setCalendarViewDate(new Date(y, m - 1, 1));
      }
    }
  }, [travelDate]);

  // Close calendar if modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsCalendarOpen(false);
    }
  }, [isOpen]);

  // Close calendar on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isCalendarOpen]);

  const today = useMemo(() => new Date(), []);
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayStr = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }, []);

  const viewYear = calendarViewDate.getFullYear();
  const viewMonth = calendarViewDate.getMonth();

  // Disable future month navigation
  const isCurrentMonthAndYear =
    viewYear > todayYear || (viewYear === todayYear && viewMonth >= todayMonth);

  const handlePrevMonth = () => {
    setCalendarViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    if (isCurrentMonthAndYear) return;
    setCalendarViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const monthName = calendarViewDate.toLocaleDateString("en-US", {
    month: "long",
  });

  // Formatted date string for the input display: e.g. "15 October 2026"
  const formattedDisplayDate = useMemo(() => {
    if (!travelDate) return "";
    const [y, m, d] = travelDate.split("-").map(Number);
    if (!y || !m || !d) return travelDate;
    const dObj = new Date(y, m - 1, d);
    return dObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [travelDate]);

  // Year options for fast past-year navigation (current year down to 7 years past)
  const yearOptions = useMemo(() => {
    const currentYr = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => currentYr - i);
  }, []);

  // Load tour packages for the dropdown
  useEffect(() => {
    async function loadTours() {
      try {
        const res = await fetch("/api/tours");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setTourOptions(
              data.map((t: any) => ({
                id: t.id,
                title: t.title,
              }))
            );
          }
        }
      } catch (e) {
        console.warn("Could not load tours for review modal", e);
      }
    }
    if (isOpen) {
      loadTours();
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultTourId) {
      setTourId(defaultTourId);
    }
  }, [defaultTourId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please provide your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid email address for verification.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setErrorMsg("Please select a rating between 1 and 5 stars.");
      return;
    }

    if (comment.trim().length < 10) {
      setErrorMsg("Please write at least 10 characters describing your experience.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: name.trim(),
          email: email.trim(),
          country: country.trim(),
          travelDate: travelDate || new Date().toISOString().split("T")[0],
          tourId: tourId || null,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return "5 Stars — Exceptional Experience";
      case 4:
        return "4 Stars — Very Good";
      case 3:
        return "3 Stars — Satisfactory";
      case 2:
        return "2 Stars — Mediocre";
      case 1:
        return "1 Star — Needs Improvement";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-ceylon-navy">
                Thank You for Your Review!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                Your feedback has been received and sent to our team for moderation. To ensure authentic travel transparency, reviews appear publicly upon administrative approval.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authentic Traveller Feedback</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-ceylon-navy tracking-tight">
                Write a Review
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Share your journey experience in Sri Lanka. Your honest feedback helps future travellers plan their journeys.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Interactive Selector */}
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1.5">
                  Your Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active =
                        (hoverRating !== null ? hoverRating : rating) >= star;
                      return (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 text-slate-200 hover:scale-110 transition-transform"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-7 h-7 ${
                              active
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200 fill-slate-100"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {getRatingLabel(hoverRating || rating)}
                  </span>
                </div>
              </div>

              {/* Tour Package Selection Dropdown */}
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Tour Package (Optional)
                </label>
                <select
                  value={tourId}
                  onChange={(e) => setTourId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-ceylon-navy focus:outline-none focus:border-ceylon-blue"
                >
                  <option value="">General Sri Lanka Tour Experience</option>
                  {defaultTourTitle && !tourOptions.find((t) => t.id === defaultTourId) && (
                    <option value={defaultTourId}>{defaultTourTitle}</option>
                  )}
                  {tourOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Miller"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-ceylon-navy focus:outline-none focus:border-ceylon-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. david@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-ceylon-navy focus:outline-none focus:border-ceylon-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Country & Travel Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <CountrySelect
                    label="Country of Origin"
                    value={country}
                    onChange={(val) => setCountry(val)}
                    placeholder="Select country of origin..."
                    required
                  />
                </div>

                <div className="relative" ref={calendarRef}>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Month / Date Visited
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen((prev) => !prev)}
                    className={`w-full bg-slate-50 border rounded-xl pl-3.5 pr-3 py-2 text-xs text-left cursor-pointer flex items-center justify-between transition-all ${
                      isCalendarOpen
                        ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-white shadow-xs"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    aria-haspopup="dialog"
                    aria-expanded={isCalendarOpen}
                  >
                    <div className="flex items-center gap-2 truncate mr-1">
                      <Calendar
                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                          isCalendarOpen || travelDate
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      />
                      <span
                        className={`truncate ${
                          travelDate
                            ? "text-ceylon-navy font-semibold"
                            : "text-slate-400"
                        }`}
                      >
                        {formattedDisplayDate || "Select month / date visited"}
                      </span>
                    </div>
                  </button>

                  {/* Premium Date Picker Popover */}
                  <AnimatePresence>
                    {isCalendarOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-[295px] sm:w-[320px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 sm:p-5 z-50 space-y-4"
                      >
                        {/* Header: Month & Year with Navigation Arrows & Fast Year Selector */}
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                            aria-label="Previous Month"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-extrabold text-ceylon-navy tracking-tight">
                              {monthName}
                            </span>
                            <select
                              value={viewYear}
                              onChange={(e) => {
                                const newYear = Number(e.target.value);
                                setCalendarViewDate(new Date(newYear, viewMonth, 1));
                              }}
                              className="text-xs sm:text-sm font-extrabold text-ceylon-navy bg-slate-100 hover:bg-slate-200/80 rounded-lg px-2 py-0.5 border border-slate-200/60 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                              aria-label="Select Year"
                            >
                              {yearOptions.map((yr) => (
                                <option key={yr} value={yr}>
                                  {yr}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={handleNextMonth}
                            disabled={isCurrentMonthAndYear}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                              className="text-[10px] font-bold text-slate-400 tracking-wider py-1"
                            >
                              {dayName}
                            </span>
                          ))}
                        </div>

                        {/* Calendar Days 7-Col Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {/* Empty cells before 1st day of month */}
                          {Array.from({ length: firstDay }).map((_, idx) => (
                            <div key={`blank-${idx}`} className="h-8 sm:h-9 w-full" />
                          ))}

                          {/* Day numbers */}
                          {Array.from({ length: totalDays }).map((_, idx) => {
                            const dayNum = idx + 1;
                            const cellDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                            const isFuture = cellDateStr > todayStr;
                            const isToday = cellDateStr === todayStr;
                            const isSelected = cellDateStr === travelDate;

                            return (
                              <button
                                type="button"
                                key={dayNum}
                                disabled={isFuture}
                                onClick={() => {
                                  setTravelDate(cellDateStr);
                                  setIsCalendarOpen(false);
                                }}
                                className={`h-8 sm:h-9 w-full rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                                  isSelected
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-sm scale-105"
                                    : isFuture
                                    ? "text-slate-300 cursor-not-allowed pointer-events-none"
                                    : isToday
                                    ? "ring-1.5 ring-emerald-500 text-emerald-800 font-bold hover:bg-emerald-50"
                                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer"
                                }`}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>

                        {/* Quick Shortcuts & Clear Action */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const now = new Date();
                                const tStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
                                setTravelDate(tStr);
                                setIsCalendarOpen(false);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] font-bold transition-colors"
                            >
                              Today
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const lastMonth = new Date();
                                lastMonth.setMonth(lastMonth.getMonth() - 1);
                                const lmStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}-${String(lastMonth.getDate()).padStart(2, "0")}`;
                                setTravelDate(lmStr);
                                setIsCalendarOpen(false);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] font-bold transition-colors"
                            >
                              Last Month
                            </button>
                          </div>

                          {travelDate && (
                            <button
                              type="button"
                              onClick={() => {
                                setTravelDate("");
                                setIsCalendarOpen(false);
                              }}
                              className="text-[11px] font-bold text-rose-600 hover:underline"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Your Review / Experience Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about your tour guide, itinerary, transportation, hospitality, and highlights in Sri Lanka..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-ceylon-navy focus:outline-none focus:border-ceylon-blue"
                />
              </div>

              {/* Submission Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 leading-tight">
                  Moderated before publication. Zero spam guarantee.
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Review</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
