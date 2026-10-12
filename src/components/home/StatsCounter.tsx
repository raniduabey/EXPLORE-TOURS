"use client";
import React from "react";
import { Award, Users, Star, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { AnimatedCounter, FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";

export const StatsCounter: React.FC = () => {
  const stats = [
    {
      icon: Clock,
      target: 12,
      suffix: "+",
      label: "Years of Island Craft",
      desc: "Authentic journeys since 2014",
    },
    {
      icon: Users,
      target: 15000,
      suffix: "+",
      label: "Happy Global Travellers",
      desc: "From UK, Europe, USA & Australia",
    },
    {
      icon: Star,
      target: 99.8,
      decimals: 1,
      suffix: "%",
      label: "Five-Star Satisfaction",
      desc: "Verified reviews on TripAdvisor & Google",
    },
    {
      icon: ShieldCheck,
      target: 100,
      suffix: "%",
      label: "SLTDA Certified Guides",
      desc: "Licensed English & multilingual chauffeurs",
    },
  ];

  return (
    <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 lg:p-10 backdrop-blur-xl">
        <FadeInStagger className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <FadeInStaggerItem
                key={idx}
                className={`${idx > 0 ? "pt-6 lg:pt-0 lg:pl-8" : ""} flex flex-col justify-between`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-ceylon-softblue text-ceylon-blue flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ceylon-green">
                    Verified Metric
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ceylon-navy tracking-tight flex items-baseline">
                    <AnimatedCounter
                      target={stat.target}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                    />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-ceylon-navy mt-1">
                    {stat.label}
                  </h4>
                  <p className="text-[11px] text-ceylon-muted mt-0.5">
                    {stat.desc}
                  </p>
                </div>
              </FadeInStaggerItem>
            );
          })}
        </FadeInStagger>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Official Sri Lanka Tourism Development Authority (SLTDA) Partner</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Private AC Vehicles Guaranteed
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% Tailored Itineraries
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
