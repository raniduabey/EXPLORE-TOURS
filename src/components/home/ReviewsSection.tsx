"use client";
import React from "react";
import { Quote, Star, CheckCircle } from "lucide-react";

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: "Emma Watson",
      country: "United Kingdom",
      rating: 5,
      tour: "Sigiriya Rock & Dambulla Private Tour",
      comment: "An unforgettable way to experience Sri Lanka. Everything from our initial online booking to our private driver Chaminda was completely seamless!",
      date: "August 2026"
    },
    {
      name: "Markus Weber",
      country: "Germany",
      rating: 5,
      tour: "Kandy to Ella Scenic Train Ride",
      comment: "Getting reserved seats on the scenic mountain train was impossible everywhere else, but Ceylon Explore Guide secured them effortlessly. 10/10 service!",
      date: "July 2026"
    },
    {
      name: "Sophie Taylor",
      country: "Canada",
      rating: 5,
      tour: "Yala National Park Afternoon Safari",
      comment: "We saw two leopards and wild elephant herds! The tracker was exceptionally knowledgeable and respectful of the wildlife.",
      date: "July 2026"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ceylon-softblue/40 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-ceylon-green uppercase tracking-wider block mb-1">
            Global Social Proof
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ceylon-navy tracking-tight">
            Loved by Travellers From Around the World
          </h2>
          <p className="text-sm text-ceylon-muted mt-2">
            Read real feedback from verified international guests who explored Sri Lanka with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 flex flex-col justify-between relative">
              <Quote className="w-8 h-8 text-ceylon-softblue fill-current absolute top-4 right-4" />
              <div className="space-y-3 relative z-10">
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  “{r.comment}”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-ceylon-navy flex items-center gap-1">
                    <span>{r.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-ceylon-green fill-current" />
                  </h4>
                  <span className="text-[11px] text-ceylon-muted">{r.country} • {r.date}</span>
                </div>
                <span className="text-[10px] font-semibold text-ceylon-blue bg-ceylon-softblue px-2 py-1 rounded">
                  Verified Booking
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
