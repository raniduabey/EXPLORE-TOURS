"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Star, ShieldCheck, MessageSquare, PenLine } from "lucide-react";
import { WriteReviewModal } from "@/components/reviews/WriteReviewModal";

interface Review {
  id: string;
  userName: string;
  userCountry?: string;
  travelDate: string;
  rating: number;
  comment: string;
  photoUrl?: string | null;
  guideRating?: number;
  transportRating?: number;
  valueRating?: number;
}

interface ReviewsBreakdownProps {
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  tourId?: string;
  tourTitle?: string;
}

export const ReviewsBreakdown: React.FC<ReviewsBreakdownProps> = ({
  reviews = [],
  tourId,
  tourTitle,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!reviews || reviews.length === 0) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-ceylon-navy tracking-tight">
              Verified Traveller Reviews
            </h3>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-ceylon-navy text-xs font-bold border border-slate-200/90 shadow-sm transition-all"
            >
              <PenLine className="w-3.5 h-3.5 text-ceylon-blue" />
              <span>Write a Review</span>
            </button>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-ceylon-navy">
              No Published Reviews Yet
            </h4>
            <p className="text-xs text-ceylon-muted max-w-md mx-auto">
              Reviews on Ceylon Explore Tours are collected exclusively from guests who completed this tour. Authentic traveller feedback will appear here once approved by our moderation team.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="px-5 py-2 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Be First to Review This Experience</span>
              </button>
            </div>
          </div>
        </div>

        <WriteReviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultTourId={tourId}
          defaultTourTitle={tourTitle}
        />
      </>
    );
  }

  const computedRating = (
    reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length
  ).toFixed(1);

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-ceylon-navy tracking-tight">
            Verified Traveller Reviews
          </h3>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-ceylon-navy text-xs font-bold border border-slate-200/90 shadow-sm transition-all"
          >
            <PenLine className="w-3.5 h-3.5 text-ceylon-blue" />
            <span>Write a Review</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="text-center md:border-r md:border-slate-100 pr-4">
            <div className="text-4xl font-extrabold text-ceylon-navy">
              {computedRating}
            </div>
            <div className="flex justify-center text-amber-400 my-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(computedRating))
                      ? "fill-current text-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-ceylon-muted">
              Based on {reviews.length} verified {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>

          <div className="md:col-span-3 text-xs text-slate-500 leading-relaxed">
            <p className="font-semibold text-ceylon-navy">
              100% Genuine Guest Feedback Policy
            </p>
            <p className="text-ceylon-muted mt-1">
              Every review shown is verified against authentic completed reservations. Ceylon Explore Tours never fabricates or buys reviews.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-ceylon-softblue flex items-center justify-center text-ceylon-navy font-bold text-xs">
                    {rev.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ceylon-navy flex items-center gap-1">
                      <span>{rev.userName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-ceylon-green fill-current" />
                    </h4>
                    <span className="text-[11px] text-ceylon-muted">
                      {rev.userCountry || "International Guest"} • Traveled {rev.travelDate}
                    </span>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(rev.rating)
                          ? "fill-current text-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
              {rev.photoUrl && (
                <div className="relative h-44 w-full sm:w-64 rounded-xl overflow-hidden mt-2 border border-slate-100">
                  <Image
                    src={rev.photoUrl}
                    alt={`Photo from ${rev.userName}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <WriteReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTourId={tourId}
        defaultTourTitle={tourTitle}
      />
    </>
  );
};
