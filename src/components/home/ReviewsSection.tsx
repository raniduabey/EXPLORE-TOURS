"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Quote, Star, CheckCircle2, MessageSquarePlus, PenLine, RefreshCw, AlertCircle } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";
import { WriteReviewModal } from "@/components/reviews/WriteReviewModal";
import { getCountryName, getCountryFlag } from "@/data/countriesData";

export interface ApprovedReview {
  id: string;
  userName: string;
  userCountry?: string;
  rating: number;
  comment: string;
  travelDate?: string | null;
  photoUrl?: string | null;
  tour?: { title: string; slug: string } | null;
  verified?: boolean;
  createdAt?: string;
}

interface ReviewsSectionProps {
  initialReviews?: ApprovedReview[];
}

function formatVisitDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
      if (y && m && d) {
        return `${d} ${months[m - 1]} ${y}`;
      }
      if (y && m) {
        return `${months[m - 1]} ${y}`;
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ initialReviews = [] }) => {
  const [reviews, setReviews] = useState<ApprovedReview[]>(initialReviews);
  const [loading, setLoading] = useState<boolean>(initialReviews.length === 0);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadApprovedReviews = useCallback(async () => {
    try {
      setFetchError(false);
      const res = await fetch(`/api/reviews?_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      } else {
        if (reviews.length === 0) {
          setFetchError(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch verified reviews", err);
      if (reviews.length === 0) {
        setFetchError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [reviews.length]);

  useEffect(() => {
    loadApprovedReviews();
  }, [loadApprovedReviews]);

  // Sync if initialReviews changes from parent
  useEffect(() => {
    if (initialReviews && initialReviews.length > 0) {
      setReviews(initialReviews);
      setLoading(false);
    }
  }, [initialReviews]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F7F3] border-y border-[#E7E2D8]">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15392D]/5 text-[#C5A46B] text-[10px] font-mono uppercase tracking-[0.25em] border border-[#C5A46B]/30 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A46B]" />
              <span>Verified Guest Reflections</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#15392D] tracking-tight">
              Traveller Perspectives
            </h2>
            <p className="text-sm sm:text-base text-[#59645E] font-sans font-normal mt-2 max-w-xl mx-auto leading-relaxed">
              Authentic stories and feedback from travellers who have journeyed across Sri Lanka with Ceylon Explore Tours.
            </p>

            {reviews.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs font-serif text-[#15392D]">
                <div className="flex text-[#C5A46B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(Number(averageRating))
                          ? "fill-current text-[#C5A46B]"
                          : "text-[#E7E2D8]"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-serif font-bold text-[#15392D] text-base ml-1">
                  {averageRating} / 5.0
                </span>
                <span className="text-[#E7E2D8]">•</span>
                <span className="text-[#59645E] font-sans text-xs">
                  Based on {reviews.length} verified {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}

            {/* Write a Review Button in Header */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-[#15392D] hover:text-white text-[#15392D] text-xs font-sans font-medium uppercase tracking-wider border border-[#E7E2D8] hover:border-[#15392D] shadow-sm transition-all"
              >
                <PenLine className="w-3.5 h-3.5 text-[#C5A46B]" />
                <span>Write a Reflection</span>
              </button>
            </div>
          </FadeIn>

          {/* Loading Skeleton */}
          {loading && reviews.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl p-7 border border-[#E7E2D8] shadow-[0_10px_30px_rgba(21,57,45,0.04)] animate-pulse flex flex-col justify-between h-64"
                >
                  <div className="space-y-4">
                    <div className="flex gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-[#E7E2D8]/60 rounded" />
                      ))}
                    </div>
                    <div className="h-4 bg-[#E7E2D8]/60 rounded w-full" />
                    <div className="h-4 bg-[#E7E2D8]/40 rounded w-5/6" />
                    <div className="h-4 bg-[#E7E2D8]/30 rounded w-2/3" />
                  </div>
                  <div className="pt-4 border-t border-[#E7E2D8] flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-[#E7E2D8]/60 rounded w-28" />
                      <div className="h-3 bg-[#E7E2D8]/40 rounded w-36" />
                    </div>
                    <div className="h-6 bg-[#E7E2D8]/40 rounded-full w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State with Retry */}
          {!loading && fetchError && reviews.length === 0 && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E7E2D8] shadow-[0_10px_30px_rgba(21,57,45,0.06)] text-center max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#15392D]">
                Unable to Load Reviews
              </h3>
              <p className="text-xs sm:text-sm text-[#59645E] font-light leading-relaxed">
                We encountered a temporary connection issue while retrieving our latest guest reflections.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    loadApprovedReviews();
                  }}
                  className="px-6 py-2.5 bg-[#15392D] hover:bg-[#1E4D3D] text-white rounded-full text-xs font-sans font-medium uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C5A46B]" />
                  <span>Retry Loading</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !fetchError && reviews.length === 0 && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E7E2D8] shadow-[0_10px_30px_rgba(21,57,45,0.06)] text-center max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#15392D]/5 text-[#C5A46B] border border-[#C5A46B]/25 flex items-center justify-center mx-auto shadow-sm">
                <MessageSquarePlus className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#15392D]">
                Share Your Island Journey
              </h3>
              <p className="text-xs sm:text-sm text-[#59645E] font-light leading-relaxed">
                Have you explored Sri Lanka with Ceylon Explore Tours? We welcome genuine reflections from our guests to guide future travellers.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-7 py-3 bg-[#15392D] hover:bg-[#1E4D3D] text-white rounded-full text-xs font-sans font-medium uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
                >
                  <PenLine className="w-3.5 h-3.5 text-[#C5A46B]" />
                  <span>Share Your Experience</span>
                </button>
              </div>
            </div>
          )}

          {/* Populated Reviews Grid */}
          {reviews.length > 0 && (
            <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <FadeInStaggerItem key={r.id}>
                  <div className="bg-white rounded-3xl p-7 shadow-[0_10px_30px_rgba(21,57,45,0.05)] hover:shadow-[0_20px_40px_rgba(21,57,45,0.1)] border border-[#E7E2D8] flex flex-col justify-between relative h-full transition-all duration-300">
                    <Quote className="w-8 h-8 text-[#E7E2D8]/70 fill-current absolute top-6 right-6" />
                    <div className="space-y-3 relative z-10">
                      <div className="flex text-[#C5A46B]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(r.rating)
                                ? "fill-current text-[#C5A46B]"
                                : "text-[#E7E2D8]"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-[#24362F] font-sans italic leading-relaxed pt-1">
                        &ldquo;{r.comment}&rdquo;
                      </p>

                      {r.photoUrl && (
                        <div className="relative h-36 w-full rounded-2xl overflow-hidden mt-3 border border-[#E7E2D8]">
                          <Image
                            src={r.photoUrl}
                            alt={`Photo shared by ${r.userName}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center justify-between">
                      <div className="pr-2">
                        <h4 className="font-serif text-sm font-semibold text-[#15392D] flex items-center gap-1.5">
                          <span>{r.userName}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A46B]" />
                        </h4>
                        <span className="text-[11px] text-[#59645E] font-sans block mt-0.5">
                          {getCountryFlag(r.userCountry)} {getCountryName(r.userCountry, "International Traveller")}
                          {r.travelDate ? ` • ${formatVisitDate(r.travelDate)}` : ""}
                        </span>
                        <span className="text-[10px] text-[#15392D] font-serif italic block line-clamp-1 mt-0.5">
                          {r.tour?.title || "General Sri Lanka Journey"}
                        </span>
                      </div>
                      {r.verified !== false && (
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#15392D] bg-[#F0ECE4] border border-[#E7E2D8] px-2.5 py-1 rounded-full shrink-0">
                          Verified Guest
                        </span>
                      )}
                    </div>
                  </div>
                </FadeInStaggerItem>
              ))}
            </FadeInStagger>
          )}
        </div>
      </section>

      <WriteReviewModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          loadApprovedReviews();
        }}
      />
    </>
  );
};
