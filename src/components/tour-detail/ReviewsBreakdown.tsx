"use client";
import React from "react";
import { Star, ShieldCheck } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  userCountry: string;
  travelDate: string;
  rating: number;
  comment: string;
}

interface ReviewsBreakdownProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export const ReviewsBreakdown: React.FC<ReviewsBreakdownProps> = ({
  rating,
  reviewCount,
  reviews,
}) => {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-extrabold text-ceylon-navy tracking-tight">
        Verified Traveller Reviews
      </h3>
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="text-center md:border-r md:border-slate-100 pr-4">
          <div className="text-4xl font-extrabold text-ceylon-navy">
            {rating.toFixed(1)}
          </div>
          <div className="flex justify-center text-amber-400 my-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-xs text-ceylon-muted">
            Based on {reviewCount} reviews
          </span>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-ceylon-navy">
              <span>Local Guide</span>
              <span className="text-ceylon-blue">4.9 / 5</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-ceylon-blue w-[98%]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-ceylon-navy">
              <span>Transportation</span>
              <span className="text-ceylon-blue">4.9 / 5</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-ceylon-blue w-[98%]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-ceylon-navy">
              <span>Value for Money</span>
              <span className="text-ceylon-blue">4.8 / 5</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-ceylon-blue w-[96%]" />
            </div>
          </div>
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
                    {rev.userCountry} • Traveled {rev.travelDate}
                  </span>
                </div>
              </div>
              <div className="flex text-amber-400">
                {[...Array(Math.floor(rev.rating))].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              “{rev.comment}”
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
