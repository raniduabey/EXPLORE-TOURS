"use client";
import React from "react";
import { Quote, Star, CheckCircle, Award } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: "Emma & David Watson",
      flag: "🇬🇧",
      country: "London, United Kingdom",
      rating: 5,
      tour: "8-Day Splendour of Sri Lanka Classical Circuit",
      comment:
        "The best holiday of our lives! From greeting us with cold towels at Colombo airport to securing 1st-class scenic train seats and tracking a leopard in Yala, our private chauffeur Chaminda was exceptional.",
      date: "September 2026",
    },
    {
      name: "Markus Weber",
      flag: "🇩🇪",
      country: "Munich, Germany",
      rating: 5,
      tour: "Kandy to Ella Scenic Train Ride",
      comment:
        "Getting reserved seats on the iconic blue mountain train seemed impossible online, but Ceylon Explore Tours secured them seamlessly. Flawless vehicle, punctual driver, and honest local advice.",
      date: "August 2026",
    },
    {
      name: "Sophie & Liam Taylor",
      flag: "🇦🇺",
      country: "Sydney, Australia",
      rating: 5,
      tour: "14-Day Sri Lanka All-in-One Grand Tour",
      comment:
        "We traveled with our two teenagers and every single day was magical. The balance of ancient culture, hiking Little Adam's Peak, and relaxing on southern beaches was curated to perfection.",
      date: "July 2026",
    },
    {
      name: "Dr. James Richardson",
      flag: "🇺🇸",
      country: "California, USA",
      rating: 5,
      tour: "Sigiriya Rock & Dambulla Private Tour",
      comment:
        "Our guide arrived early in a pristine hybrid SUV. He guided us through Sigiriya avoiding the midday heat, shared incredible historical knowledge, and took us to a traditional village lunch.",
      date: "July 2026",
    },
    {
      name: "Camille Dupont",
      flag: "🇫🇷",
      country: "Paris, France",
      rating: 5,
      tour: "Mirissa Blue Whale Cruise & Galle Fort",
      comment:
        "Seeing a mother blue whale and her calf in Mirissa was breathtaking. Ceylon Explore Tours only uses eco-certified boats with marine biologists. Highly recommended for ethical travel!",
      date: "June 2026",
    },
    {
      name: "Olivia Tremblay",
      flag: "🇨🇦",
      country: "Montreal, Canada",
      rating: 5,
      tour: "Yala National Park Afternoon Safari",
      comment:
        "Two leopards, wild elephant families, and hornbills! The private 4x4 open-top jeep was thrilling, and our tracker had razor-sharp eyes. Worth every penny.",
      date: "June 2026",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ceylon-softblue/40 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-ceylon-green text-xs font-extrabold uppercase tracking-widest border border-emerald-100 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Global Traveler Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ceylon-navy tracking-tight">
            Loved by Travellers Around the World
          </h2>
          <p className="text-sm text-ceylon-muted mt-2">
            Read verified feedback from global guests who experienced Sri Lanka with our native chauffeur guides.
          </p>

          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-extrabold">TripAdvisor</span>
              <div className="flex text-emerald-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-0.5" />
                ))}
              </div>
              <span className="text-slate-500 font-medium">5.0 (650+ Reviews)</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 font-extrabold">Google</span>
              <span className="text-slate-700">4.9 / 5.0 Rating</span>
            </div>
          </div>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <FadeInStaggerItem key={idx}>
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-card-hover border border-slate-100 flex flex-col justify-between relative h-full transition-shadow duration-300">
                <Quote className="w-8 h-8 text-ceylon-softblue fill-current absolute top-6 right-6" />
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-lg" title={r.country}>{r.flag}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed pt-1">
                    "{r.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-ceylon-navy flex items-center gap-1">
                      <span>{r.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-ceylon-green fill-current" />
                    </h4>
                    <span className="text-[11px] text-ceylon-muted block">{r.country}</span>
                    <span className="text-[10px] text-ceylon-blue font-semibold block line-clamp-1 mt-0.5">{r.tour}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full shrink-0">
                    Verified
                  </span>
                </div>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
};
