"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/ui/motion";

export const EditorialBanner: React.FC = () => {
  return (
    <section className="relative my-10 sm:my-14 lg:my-18 mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto rounded-3xl overflow-hidden shadow-2xl border border-luxury-gold/30">
      <div className="relative min-h-[440px] sm:min-h-[480px] flex items-center justify-center p-8 sm:p-14 lg:p-20 text-center">
        <Image
          src="/images/destinations/ella.jpg"
          alt="Nine Arch Bridge Ella Sri Lanka"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-forest/95 via-luxury-forest/80 to-luxury-forest/95" />
        <FadeIn className="relative z-10 max-w-2xl mx-auto space-y-6 text-luxury-ivory">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-luxury-gold block">
            The Island of Serendipity
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-luxury-ivory leading-tight">
            Your Island Story, <br />
            <span className="italic text-luxury-gold">Beautifully Told.</span>
          </h2>
          <p className="text-sm sm:text-base text-luxury-sand/90 leading-relaxed font-sans font-normal max-w-xl mx-auto">
            From misty cloud forests and ancient royal rock citadels to private naturalist safaris and secluded ocean sanctuaries. Handcrafted journeys that linger in memory forever.
          </p>
          <div className="pt-2">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-sans font-semibold text-xs uppercase tracking-[0.2em] text-luxury-forest bg-gradient-to-r from-[#DFBE82] via-[#C9A86A] to-[#A88647] hover:brightness-110 transition-all transform hover:-translate-y-0.5 shadow-xl group"
            >
              <span>Explore All Curated Journeys</span>
              <ArrowRight className="w-4 h-4 text-luxury-forest group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
