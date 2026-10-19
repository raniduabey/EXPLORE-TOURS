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
      <div className="bg-[#FAF8F5] rounded-3xl shadow-[0_20px_50px_rgba(16,45,36,0.08)] border border-luxury-gold/30 p-6 sm:p-8 lg:p-10 backdrop-blur-xl">
        <FadeInStagger className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-luxury-sand/80">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <FadeInStaggerItem
                key={idx}
                className={`${idx > 0 ? "pt-6 lg:pt-0 lg:pl-8" : ""} flex flex-col justify-between`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-luxury-forest/5 text-luxury-gold border border-luxury-gold/25 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-luxury-gold">
                    Pillar 0{idx + 1}
                  </span>
                </div>

                <div>
                  <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight flex items-baseline">
                    <AnimatedCounter
                      target={pillar.target}
                      suffix={pillar.suffix}
                      decimals={0}
                    />
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-luxury-forest mt-1.5 tracking-wide">
                    {pillar.label}
                  </h4>
                  <p className="text-[11px] text-luxury-charcoal/70 mt-1 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </FadeInStaggerItem>
            );
          })}
        </FadeInStagger>

        <div className="mt-8 pt-6 border-t border-luxury-sand/80 flex flex-wrap items-center justify-between gap-4 text-xs text-luxury-charcoal/75">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-luxury-gold" />
            <span className="font-sans font-medium text-luxury-forest">Official Sri Lanka Tourism Standards · SLTDA Registered Chauffeurs</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-sans text-xs">
              <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
              Private AC Vehicles Guaranteed
            </span>
            <span className="flex items-center gap-1.5 font-sans text-xs">
              <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
              100% Bespoke Private Journeys
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
