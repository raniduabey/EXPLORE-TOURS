import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  Award,
  Users,
  Compass,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description:
    "Learn about Ceylon Explore Tours, our local certified guides, sustainable tourism principles, and our passion for showing travellers authentic Sri Lanka.",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: `About Us | ${siteConfig.name}`,
    description:
      "Learn about Ceylon Explore Tours, our local certified guides, and our passion for showing travellers authentic Sri Lanka.",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Local Expertise",
      desc: "Our itineraries and day trips are guided exclusively by certified, native Sri Lankan guides who grew up in the regions they showcase.",
    },
    {
      icon: ShieldCheck,
      title: "Fair & Transparent",
      desc: "Upfront pricing with zero hidden fees. We believe in direct partnerships that empower local drivers, trackers, and rural hosts.",
    },
    {
      icon: Compass,
      title: "Responsible Tourism",
      desc: "We prioritize ecological stewardship, ethical wildlife observation distances in national parks, and supporting village communities.",
    },
    {
      icon: Award,
      title: "Safety & Reliability",
      desc: "Modern air-conditioned vehicles, fully insured transport, 24/7 on-trip helpline, and seamless instant booking confirmation vouchers.",
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-luxury-forest text-luxury-ivory p-8 sm:p-14 lg:p-18 shadow-2xl border border-luxury-gold/30">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-luxury-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-luxury-emerald/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-luxury-gold/30 text-[10px] font-mono uppercase tracking-[0.25em] text-luxury-gold">
            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Curators of Ceylon Journeys</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-luxury-ivory leading-tight">
            Discover Sri Lanka With Those Who Know Its Soul
          </h1>
          <p className="text-sm sm:text-base text-luxury-sand/85 max-w-2xl font-light leading-relaxed">
            Welcome to {siteConfig.name}. We craft bespoke private journeys across Sri Lanka—from ancient royal rock citadels to misty highland tea bungalows and untamed leopard sanctuaries.
          </p>
          {siteConfig.sltda.isVerified && siteConfig.sltda.registrationNumber && (
            <div className="pt-2 text-xs font-mono uppercase tracking-wider text-luxury-gold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-luxury-gold" />
              <span>Official SLTDA Registration: {siteConfig.sltda.registrationNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Who We Are & Our Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div className="space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-luxury-gold block">
            Our Heritage & Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight leading-tight">
            Born From A Reverence For Ceylon
          </h2>
          <p className="text-sm sm:text-base text-luxury-charcoal/80 font-light leading-relaxed">
            {siteConfig.name} was established by native island travel specialists who recognized that discerning global travellers were often caught between mass-tour conglomerates offering rigid itineraries and unverified roadside transport.
          </p>
          <p className="text-sm sm:text-base text-luxury-charcoal/80 font-light leading-relaxed">
            Our mission is singular: provide bespoke, seamless private journeys led exclusively by licensed native chauffeur-guides. Whether securing reserved scenic hill country train seats, tracking leopards with experienced naturalists, or savoring clay-pot culinary traditions in rural village retreats, we ensure each journey is authentic, luxurious, and respectful of the island.
          </p>
          <div className="pt-2">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-luxury-forest hover:bg-luxury-emerald text-luxury-ivory text-xs font-serif font-semibold uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <span>Explore Curated Journeys</span>
              <ArrowRight className="w-4 h-4 text-luxury-gold" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-luxury-sand/80">
            <Image
              src="/images/destinations/nuwara-eliya.jpg"
              alt="Warm Sri Lankan Hospitality and Ceylon Highlands"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-luxury-forest text-luxury-ivory p-5 rounded-2xl shadow-2xl border border-luxury-gold/30 max-w-xs space-y-1.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-luxury-gold font-serif text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-luxury-gold" />
              <span>Licensed Native Chauffeurs</span>
            </div>
            <p className="text-[11px] text-luxury-sand/80 font-sans leading-relaxed">
              Every chauffeur and naturalist is carefully vetted for safety, language proficiency, and heritage knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us / Tourism Standards */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-luxury-gold block">
            The Pillars of Excellence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight">
            Why Journey With {siteConfig.name}
          </h2>
          <p className="text-sm sm:text-base text-luxury-charcoal/70 font-light">
            The foundational standards that guide every private itinerary, safari, and highland exploration we orchestrate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-luxury-sand/80 shadow-[0_10px_30px_rgba(16,45,36,0.06)] hover:shadow-[0_20px_40px_rgba(16,45,36,0.1)] transition-all space-y-3.5"
              >
                <div className="w-12 h-12 rounded-2xl bg-luxury-forest/5 text-luxury-gold border border-luxury-gold/25 flex items-center justify-center">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-serif font-semibold text-base text-luxury-forest">
                  {val.title}
                </h3>
                <p className="text-xs text-luxury-charcoal/70 font-light leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsible Tourism */}
      <div className="bg-luxury-forest text-luxury-ivory rounded-3xl p-8 sm:p-14 lg:p-16 shadow-2xl border border-luxury-gold/30 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-luxury-gold block">
            Stewardship & Community
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-luxury-ivory">
            Responsible Tourism That Honors Sri Lanka
          </h2>
          <p className="text-sm sm:text-base text-luxury-sand/85 font-light leading-relaxed">
            We are deeply committed to safeguarding Sri Lanka&apos;s biodiversity and living traditions. We uphold leave-no-trace wilderness principles, ethical observation distances in national parks, single-use plastic elimination, and direct economic empowerment for local village artisans and families.
          </p>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 border border-luxury-gold/30 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-luxury-gold font-serif font-semibold text-sm">
            <CheckCircle className="w-4 h-4 text-luxury-gold" />
            <span>Our Commitment</span>
          </div>
          <p className="text-luxury-sand/85 font-light leading-relaxed">
            100% of driver and guide fees go directly to our local partners. Fair wages and respectful travel practices are non-negotiable standards.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-14 text-center space-y-5 border border-luxury-sand/80 shadow-sm max-w-4xl mx-auto">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-luxury-gold block">
          Begin The Journey
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-luxury-forest">
          Ready to Craft Your Private Sri Lanka Itinerary?
        </h2>
        <p className="text-sm sm:text-base text-luxury-charcoal/70 font-light max-w-xl mx-auto leading-relaxed">
          Whether you envision a romantic coastal circuit, an intimate wildlife safari, or a comprehensive two-week grand tour, our island concierge is at your service.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-gradient-to-r from-[#DFBE82] via-[#C9A86A] to-[#A88647] hover:brightness-110 text-luxury-forest font-serif font-semibold text-xs uppercase tracking-wider rounded-full transition-all shadow-md"
          >
            Connect With Concierge
          </Link>
          <Link
            href="/tours"
            className="px-8 py-3.5 bg-white hover:bg-slate-50 text-luxury-forest border border-luxury-sand/80 hover:border-luxury-gold font-serif font-semibold text-xs uppercase tracking-wider rounded-full transition-all shadow-xs"
          >
            Explore Journeys
          </Link>
        </div>
      </div>
    </div>
  );
}
