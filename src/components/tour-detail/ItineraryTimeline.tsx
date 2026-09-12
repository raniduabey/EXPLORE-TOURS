"use client";
import React, { useState } from "react";
import { Clock, MapPin, ChevronUp, ChevronDown } from "lucide-react";

interface ItineraryItem {
  id: string;
  stepNumber: number;
  title: string;
  duration?: string | null;
  location?: string | null;
  description: string;
}

interface ItineraryTimelineProps {
  items: ItineraryItem[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ items }) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const toggle = (step: number) => {
    setExpanded((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-extrabold text-ceylon-navy tracking-tight">
        Detailed Tour Itinerary
      </h3>
      <div className="relative border-l-2 border-ceylon-blue/20 ml-4 space-y-6">
        {items.map((item) => {
          const isExp = expanded[item.stepNumber];
          return (
            <div key={item.id} className="relative pl-6">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-ceylon-blue border-2 border-white ring-2 ring-ceylon-blue/20 flex items-center justify-center text-white text-[9px] font-bold">
                {item.stepNumber}
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm space-y-2">
                <div
                  onClick={() => toggle(item.stepNumber)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-ceylon-navy hover:text-ceylon-blue transition-colors">
                      {item.stepNumber}. {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-ceylon-muted mt-0.5">
                      {item.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-ceylon-blue" />
                          <span>{item.duration}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-ceylon-green" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="p-1 rounded-full text-slate-400 hover:text-ceylon-navy">
                    {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
                {isExp && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
