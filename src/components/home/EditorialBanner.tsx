"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const EditorialBanner: React.FC = () => {
  return (
    <section className="relative my-16 mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto rounded-3xl overflow-hidden shadow-2xl">
      <div className="relative min-h-[460px] flex items-center justify-center p-8 sm:p-12 lg:p-16 text-center">
        <Image
          src="https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=2000&auto=format&fit=crop"
          alt="Nine Arch Bridge Ella Train"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ceylon-navy/90 via-ceylon-navy/70 to-ceylon-navy/90" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6 text-white">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 block">
            Featured Island Editorial
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The Island Is Waiting.
          </h2>
          <p className="text-sm sm:base text-slate-200 leading-relaxed font-normal">
            Ancient kingdoms. Wild elephants. Scenic train rides. Golden beaches. Discover hand-crafted experiences that turn a Sri Lankan holiday into a story worth remembering.
          </p>
          <div className="pt-2">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-extrabold text-sm text-ceylon-navy bg-white hover:bg-emerald-400 transition-all transform hover:-translate-y-0.5 shadow-lg"
            >
              <span>Explore Sri Lanka</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
