"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Quote, Star, CheckCircle2 } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";

interface ApprovedReview {
  id: string;
  userName: string;
  userCountry?: string;
  rating: number;
  comment: string;
  travelDate: string;
  photoUrl?: string | null;
  tour?: { title: string; slug: string };
  verified?: boolean;
}

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ApprovedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApprovedReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setReviews(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch verified reviews", err);
      } finally {
        setLoading(false);
      }
    }
    loadApprovedReviews();
  }, []);

  // Strict compliance: Do not display reviews section until authentic approved reviews exist
  if (loading || reviews.length === 0) {
    return null;
  }

  const averageRating = (
    reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length
  ).toFixed(1);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ceylon-softblue/40 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-ceylon-green text-xs font-extrabold uppercase tracking-widest border border-emerald-100 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ceylon-navy tracking-tight">
            Traveller Experiences
          </h2>
          <p className="text-sm text-ceylon-muted mt-2">
            Read verified feedback from genuine guests who completed Ceylon Explore Tours journeys.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs font-bold text-slate-700">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(averageRating))
                      ? "fill-current text-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="font-extrabold text-ceylon-navy text-sm ml-1">
              {averageRating} / 5.0
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-medium">
              Based on {reviews.length} verified {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <FadeInStaggerItem key={r.id}>
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-card-hover border border-slate-100 flex flex-col justify-between relative h-full transition-shadow duration-300">
                <Quote className="w-8 h-8 text-ceylon-softblue fill-current absolute top-6 right-6" />
                <div className="space-y-3 relative z-10">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(r.rating)
                            ? "fill-current text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed pt-1">
                    &ldquo;{r.comment}&rdquo;
                  </p>

                  {r.photoUrl && (
                    <div className="relative h-36 w-full rounded-2xl overflow-hidden mt-3 border border-slate-100">
                      <Image
                        src={r.photoUrl}
                        alt={`Photo shared by ${r.userName}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-ceylon-navy flex items-center gap-1">
                      <span>{r.userName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-ceylon-green" />
                    </h4>
                    <span className="text-[11px] text-ceylon-muted block">
                      {r.userCountry || "International Traveller"} • {r.travelDate}
                    </span>
                    {r.tour?.title && (
                      <span className="text-[10px] text-ceylon-blue font-semibold block line-clamp-1 mt-0.5">
                        {r.tour.title}
                      </span>
                    )}
                  </div>
                  {r.verified !== false && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full shrink-0">
                      Verified Booking
                    </span>
                  )}
                </div>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
};
