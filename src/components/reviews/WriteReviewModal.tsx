"use client";
import React, { useState, useEffect } from "react";
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
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Country of Origin
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. United Kingdom"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-ceylon-navy focus:outline-none focus:border-ceylon-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Month / Date Visited
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-ceylon-navy focus:outline-none focus:border-ceylon-blue"
                    />
                  </div>
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
