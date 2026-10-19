"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, ChevronUp, ChevronDown, Hotel, Utensils, Sparkles } from "lucide-react";
import { RichTextRenderer } from "@/components/common/RichTextRenderer";

export interface ItineraryItem {
  id?: string;
  stepNumber: number;
  title: string;
  duration?: string | null;
  location?: string | null;
  description: string;
  accommodation?: string | null;
  meals?: string | null;
}

interface ItineraryTimelineProps {
  items: ItineraryItem[];
  tourType?: string;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ items, tourType }) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 1: true, 2: true });

  if (!items || items.length === 0) {
    return null;
  }

  const toggle = (step: number) => {
    setExpanded((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  const isDayTour = tourType?.toLowerCase().includes("day") && !tourType?.toLowerCase().includes("multi");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-[0.25em] block">
            {isDayTour ? "Daily Schedule" : "Journey Roadmap"}
          </span>
          <h3 className="font-serif text-2xl font-normal text-luxury-forest tracking-tight">
            Detailed Tour Itinerary
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            const allExpanded = items.every((item) => expanded[item.stepNumber]);
            const next: Record<number, boolean> = {};
            items.forEach((item) => {
              next[item.stepNumber] = !allExpanded;
            });
            setExpanded(next);
          }}
          className="text-xs font-sans font-medium text-luxury-gold hover:text-luxury-forest transition-colors"
        >
          {items.every((item) => expanded[item.stepNumber]) ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="relative border-l-2 border-luxury-gold/30 ml-4 space-y-6">
        {items.map((item) => {
          const isExp = expanded[item.stepNumber];
          const isTimeSlot = item.title && /^\d{1,2}:\d{2}/.test(item.title.trim());

          return (
            <div key={item.id || item.stepNumber} className="relative pl-7">
              {/* Luxury Step Badge */}
              <div className="absolute -left-[13px] top-2 w-6 h-6 rounded-full bg-luxury-forest border-2 border-[#FAF8F5] ring-2 ring-luxury-gold/40 flex items-center justify-center text-luxury-gold text-[10px] font-sans font-semibold shadow-md">
                {item.stepNumber}
              </div>

              <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-luxury-sand/80 shadow-[0_4px_20px_rgba(16,45,36,0.03)] hover:border-luxury-gold/40 transition-all space-y-3">
                <div
                  onClick={() => toggle(item.stepNumber)}
                  className="flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-luxury-gold bg-luxury-forest px-2.5 py-0.5 rounded-full">
                        {isTimeSlot ? "Time Slot" : `Day ${item.stepNumber}`}
                      </span>
                      <h4 className="font-serif text-base sm:text-lg font-medium text-luxury-forest">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-luxury-charcoal/70 pt-1">
                      {item.duration && (
                        <div className="flex items-center gap-1 font-sans text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                          <span>{item.duration}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-1 font-sans text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle step details"
                    className="p-1.5 rounded-full text-luxury-charcoal/50 hover:text-luxury-forest bg-white border border-luxury-sand/60 transition-colors shrink-0 mt-0.5"
                  >
                    {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isExp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden space-y-3"
                    >
                      <div className="pt-3 border-t border-luxury-sand/60">
                        <RichTextRenderer content={item.description} className="text-luxury-charcoal/85" />
                      </div>

                      {/* Accommodation & Meals Badges if provided */}
                      {(item.accommodation || item.meals) && (
                        <div className="flex flex-wrap gap-3 pt-2 text-xs border-t border-luxury-sand/40">
                          {item.accommodation && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-luxury-sand text-luxury-forest font-sans text-[11px]">
                              <Hotel className="w-3.5 h-3.5 text-luxury-gold" />
                              <span>Stay: {item.accommodation}</span>
                            </div>
                          )}
                          {item.meals && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-luxury-sand text-luxury-forest font-sans text-[11px]">
                              <Utensils className="w-3.5 h-3.5 text-luxury-gold" />
                              <span>Meals: {item.meals}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
