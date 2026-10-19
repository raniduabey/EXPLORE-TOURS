"use client";
import React from "react";
import Image from "next/image";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";

export const WhyUs: React.FC = () => {
  const points = [
    {
      title: "Authentic Sri Lankan Experiences",
      desc: "Curated directly with certified native guides, village hosts, and wildlife trackers.",
    },
    {
      title: "Professional Licensed Guides",
      desc: "Licensed English & multilingual chauffeur guides passionate about Sri Lanka's heritage.",
    },
    {
      title: "Transparent Upfront Pricing",
      desc: "No hidden booking charges or unexpected fees at checkout.",
    },
    {
      title: "Flexible Free Cancellation",
      desc: `100% money-back guarantee on eligible bookings up to ${siteConfig.cancellationPolicy.defaultHoursPrior}h prior.`,
    },
    {
      title: "Instant Digital Vouchers",
      desc: "Get immediate QR-coded confirmation vouchers sent straight to your phone & email.",
    },
    {
      title: "Personalized Island Itineraries",
      desc: "Custom-tailored trips designed around your exact budget and travel pace.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <FadeIn direction="right" className="relative">
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div className="relative h-80 sm:h-88 rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(16,45,36,0.1)] border border-luxury-sand/60 group">
              <Image
                src="/images/destinations/elephant.jpg"
                alt="Sri Lanka Wildlife and Elephant Safari"
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="relative h-80 sm:h-88 rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(16,45,36,0.1)] border border-luxury-sand/60 mt-8 sm:mt-10 group">
              <Image
                src="/images/destinations/nuwara-eliya.jpg"
                alt="Ceylon Tea Plantation Guide"
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
          <div className="absolute -bottom-5 left-4 sm:left-6 bg-luxury-forest text-luxury-ivory p-4 rounded-2xl shadow-2xl border border-luxury-gold/30 flex items-center gap-3.5 max-w-xs backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-luxury-gold/20 text-luxury-gold flex items-center justify-center shrink-0 border border-luxury-gold/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-semibold text-luxury-ivory tracking-wide">Verified Native Guides</h4>
              <p className="text-[11px] text-luxury-sand/80 font-sans">SLTDA registered chauffeur-guides</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="left" className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-forest/5 border border-luxury-gold/30 text-luxury-gold text-[10px] font-mono uppercase tracking-[0.25em] mb-3">
              <span>The Ceylon Explore Standard</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight leading-tight">
              Extraordinary Journeys. <br />
              <span className="italic text-luxury-gold">Authentically Ceylon.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-luxury-charcoal/80 font-sans font-normal leading-relaxed">
            We curate intimate island journeys with Sri Lanka&apos;s most accomplished native chauffeur-guides, combining seamless private logistics with privileged access to the island&apos;s cultural and natural heritage.
          </p>
          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {points.map((p, idx) => (
              <FadeInStaggerItem
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAF8F5] border border-luxury-sand/80 hover:bg-white hover:border-luxury-gold/40 hover:shadow-[0_10px_25px_rgba(16,45,36,0.06)] transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-luxury-forest tracking-wide">{p.title}</h4>
                  <p className="text-xs text-luxury-charcoal/80 mt-1 leading-relaxed font-sans font-normal">
                    {p.desc}
                  </p>
                </div>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </FadeIn>
      </div>
    </section>
  );
};
