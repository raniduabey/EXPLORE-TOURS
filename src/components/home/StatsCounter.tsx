"use client";
import React from "react";
import { Users, ShieldCheck, MapPin, Headset, CheckCircle2 } from "lucide-react";
import { AnimatedCounter, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";

export const StatsCounter: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      target: 100,
      suffix: "%",
      label: "Private AC Vehicles",
      desc: "Dedicated chauffeur transport throughout your journey",
    },
    {
      icon: MapPin,
      target: 8,
      suffix: "",
      label: "UNESCO World Heritage Sites",
      desc: "Curated cultural triangle and rainforest circuits",
    },
    {
      icon: Users,
      target: 100,
      suffix: "%",
      label: "Custom Tailored Itineraries",
      desc: "Flexible departure times and customized pace",
    },
    {
      icon: Headset,
      target: 24,
      suffix: "/7",
      label: "Dedicated Support Helpline",
      desc: "Direct Sri Lankan ground support for guests",
    },
  ];

  return (
    <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 lg:p-10 backdrop-blur-xl">
        <FadeInStagger className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
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
                    Core Promise
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ceylon-navy tracking-tight flex items-baseline">
                    <AnimatedCounter
                      target={pillar.target}
                      suffix={pillar.suffix}
                      decimals={0}
                    />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-ceylon-navy mt-1">
                    {pillar.label}
                  </h4>
                  <p className="text-[11px] text-ceylon-muted mt-0.5">
                    {pillar.desc}
                  </p>
                </div>
              </FadeInStaggerItem>
            );
          })}
        </FadeInStagger>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Official Sri Lanka Registered Tour Operator Standards</span>
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
