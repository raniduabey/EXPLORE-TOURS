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

  const getItemClasses = (idx: number) => {
    const isLeftColSm = idx % 2 === 0;
    const isBottomRowSm = idx >= 2;
    const isLastLg = idx === 3;

    return [
      "flex flex-col group",
      // Mobile stacked dividers (< 640px)
      idx > 0 ? "pt-6 border-t border-[#E7E2D8]" : "pt-0",
      // Tablet 2-column borders & spacing (640px - 1023px)
      isLeftColSm
        ? "sm:pr-6 sm:border-r sm:border-[#E7E2D8]"
        : "sm:pl-6 sm:border-r-0",
      isBottomRowSm
        ? "sm:pt-8 sm:border-t sm:border-[#E7E2D8]"
        : "sm:border-t-0 sm:pt-0",
      // Desktop 4-column borders & spacing (>= 1024px)
      "lg:border-t-0 lg:pt-0",
      isLastLg ? "lg:border-r-0" : "lg:border-r lg:border-[#E7E2D8]",
      idx === 0
        ? "lg:pl-0 lg:pr-6 xl:pr-8"
        : idx === 3
        ? "lg:pl-6 xl:pl-8 lg:pr-0"
        : "lg:px-6 xl:px-8",
    ].join(" ");
  };

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 mb-8 sm:mb-12">
      <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgba(21,57,45,0.05)] border border-[#E7E2D8] p-6 sm:p-8 lg:p-10">
        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <FadeInStaggerItem key={idx} className={getItemClasses(idx)}>
                {/* Icon Container with exactly 24px vertical separation to statistic */}
                <div className="w-11 h-11 rounded-2xl bg-[#15392D]/5 text-[#C5A46B] border border-[#C5A46B]/30 flex items-center justify-center shrink-0 mb-6 transition-transform duration-300 group-hover:scale-105">
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>

                {/* Statistic Number (Poppins Semibold, Forest Green, exactly 12px vertical separation to heading) */}
                <div className="font-sans font-semibold text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] tabular-nums text-[#15392D] tracking-tight leading-none mb-3 flex items-baseline">
                  <AnimatedCounter
                    target={pillar.target}
                    suffix={pillar.suffix}
                    decimals={0}
                  />
                </div>

                {/* Heading (Cormorant Garamond, 1.35 line height, min-height to ensure uniform vertical alignment) */}
                <h3 className="font-serif text-lg sm:text-[19px] lg:text-[20px] font-semibold text-[#15392D] tracking-tight leading-[1.35] min-h-[2.8rem] sm:min-h-[3.2rem] lg:min-h-[3.4rem] flex items-start">
                  {pillar.label}
                </h3>

                {/* Description (Poppins, 12px vertical separation from heading) */}
                <p className="text-xs sm:text-[13px] text-[#59645E] leading-relaxed font-sans font-normal mt-3">
                  {pillar.desc}
                </p>
              </FadeInStaggerItem>
            );
          })}
        </FadeInStagger>

        {/* Official Certifications & Guarantee Footer Bar */}
        <div className="mt-8 pt-6 border-t border-[#E7E2D8] flex flex-wrap items-center justify-between gap-4 text-xs text-[#59645E]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C5A46B] shrink-0" />
            <span className="font-sans font-medium text-[#15392D]">Official Sri Lanka Tourism Standards · SLTDA Registered Chauffeurs</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5 font-sans text-xs">
              <span className="w-2 h-2 rounded-full bg-[#C5A46B] animate-pulse shrink-0" />
              Private AC Vehicles Guaranteed
            </span>
            <span className="flex items-center gap-1.5 font-sans text-xs">
              <span className="w-2 h-2 rounded-full bg-[#C5A46B] animate-pulse shrink-0" />
              100% Bespoke Private Journeys
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
