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
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <FadeIn direction="right" className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-card group">
              <Image
                src="/images/destinations/elephant.jpg"
                alt="Sri Lanka Wildlife and Elephant Safari"
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-card mt-8 group">
              <Image
                src="/images/destinations/nuwara-eliya.jpg"
                alt="Ceylon Tea Plantation Guide"
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
          <div className="absolute -bottom-4 left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 max-w-xs">
            <div className="w-10 h-10 rounded-full bg-ceylon-green/10 text-ceylon-green flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ceylon-navy">Verified Local Guides</h4>
              <p className="text-[10px] text-ceylon-muted">SLTDA registered chauffeur guides</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="left" className="space-y-6">
          <div>
            <span className="text-xs font-bold text-ceylon-green uppercase tracking-wider block mb-1">
              Why {siteConfig.name}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ceylon-navy tracking-tight leading-tight">
              Travel Deeper. <br />
              <span className="text-ceylon-blue">Experience Sri Lanka Locally.</span>
            </h2>
          </div>
          <p className="text-sm text-ceylon-muted leading-relaxed">
            We bridge the gap between global travellers seeking seamless, reliable online bookings and Sri Lanka&apos;s most authentic, passionate local guides and tour providers.
          </p>
          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {points.map((p, idx) => (
              <FadeInStaggerItem
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-white hover:shadow-sm transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-ceylon-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-ceylon-navy">{p.title}</h4>
                  <p className="text-[11px] text-ceylon-muted mt-0.5 leading-snug">
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
