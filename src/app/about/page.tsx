import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  Award,
  Users,
  HeartHandshake,
  Compass,
  CheckCircle,
  ArrowRight,
  MapPin,
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
      icon: HeartHandshake,
      title: "Responsible Tourism",
      desc: "We prioritize ecological stewardship, ethical wildlife observation distances in national parks, and supporting village communities.",
    },
    {
      icon: Award,
      title: "Safety & Reliability",
      desc: "Modern air-conditioned vehicles, fully insured transport, 24/7 on-trip helpline, and seamless instant booking confirmation vouchers.",
    },
  ];

  const team = [
    {
      name: "Nalaka Perera",
      role: "Lead Naturalist & Cultural Historian",
      location: "Sigiriya & Cultural Triangle",
      bio: "14+ years sharing ancient fortress architecture and Buddhist temple heritage with international travellers.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Chaminda Jayawardena",
      role: "Highland & Wildlife Expedition Specialist",
      location: "Ella & Yala",
      bio: "Expert 4x4 safari tracker passionate about Sri Lankan leopard conservation and mountain railway history.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Dinithi Silva",
      role: "Guest Experience & Custom Trip Planner",
      location: "Colombo Headquarters",
      bio: "Dedicated to designing personalized island itineraries that balance must-see landmarks with hidden gems.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-ceylon-navy text-white p-8 sm:p-14 lg:p-16 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-ceylon-blue/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-ceylon-green/20 blur-3xl" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Passionate Sri Lankan Tour Curators</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Explore Sri Lanka With People Who Know It Best
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            Welcome to {siteConfig.name}. We connect adventurous global travellers with authentic, verified Sri Lankan experiences—from the heights of Sigiriya to deep wildlife safaris in Yala and misty mountain train rides in Ella.
          </p>
          {siteConfig.sltda.isVerified && siteConfig.sltda.registrationNumber && (
            <div className="pt-2 text-xs text-emerald-300 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Official SLTDA Registration: {siteConfig.sltda.registrationNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Who We Are & Our Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-ceylon-green uppercase tracking-widest block">
            Who We Are
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ceylon-navy tracking-tight leading-snug">
            Born From A Love For The Wonder of Ceylon
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {siteConfig.name} was established by passionate local travel professionals who recognized that international travellers were often caught between mass-tour conglomerates offering rigid itineraries and unverified roadside operators.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our mission is simple: provide a reliable, instant digital marketplace for premium Sri Lankan experiences led by licensed native guides. Whether it is securing difficult mountain train tickets, tracking leopards with ethical wildlife rangers, or savoring clay pot village feasts, we ensure every moment is memorable, safe, and respectful of our island home.
          </p>
          <div className="pt-2">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-bold rounded-xl transition-all shadow hover:shadow-lg"
            >
              <span>Browse Curated Experiences</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative h-96 sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200&auto=format&fit=crop"
              alt="Warm Sri Lankan Hospitality"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs space-y-1">
            <div className="flex items-center gap-2 text-ceylon-green font-bold text-xs">
              <CheckCircle className="w-4 h-4" />
              <span>Certified Local Guides</span>
            </div>
            <p className="text-[11px] text-ceylon-muted">
              Every chauffeur and naturalist is carefully vetted for safety, language proficiency, and knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us / Tourism Standards */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-ceylon-green uppercase tracking-widest block">
            Our Tourism Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ceylon-navy tracking-tight">
            Why Travel With {siteConfig.name}
          </h2>
          <p className="text-xs sm:text-sm text-ceylon-muted">
            The values that guide every private tour, safari, and highland excursion we operate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-ceylon-softblue text-ceylon-blue flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-sm text-ceylon-navy">
                  {val.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsible Tourism */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Sustainability & Communities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Responsible Tourism That Preserves Sri Lanka
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            We are deeply committed to protecting Sri Lanka&apos;s extraordinary biodiversity and cultural treasures. We strictly practice leave-no-trace wilderness ethics, maintain safe wildlife viewing distances in national parks, support single-use plastic reduction, and channel tourism benefits directly to local village families.
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>Our Pledge</span>
          </div>
          <p className="text-slate-200 leading-relaxed">
            100% of driver and guide fees go directly to our local partners. Fair wages and respectful travel practices are non-negotiable.
          </p>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-ceylon-green uppercase tracking-widest block">
            Local Specialists
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ceylon-navy tracking-tight">
            Meet Our Travel Team
          </h2>
          <p className="text-xs sm:text-sm text-ceylon-muted">
            The passionate explorers behind your Sri Lankan memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 w-full bg-slate-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-ceylon-navy">
                    {member.name}
                  </h3>
                  <span className="text-xs font-bold text-ceylon-blue block">
                    {member.role}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-ceylon-muted mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{member.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-ceylon-softblue rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-ceylon-blue/20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ceylon-navy">
          Ready to Plan Your Sri Lanka Journey?
        </h2>
        <p className="text-xs sm:text-sm text-ceylon-muted max-w-xl mx-auto">
          Whether you want a day tour to Sigiriya, a reserved seat on the Ella blue train, or a customized two-week island tour, our team is here 24/7.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/contact"
            className="px-6 py-3 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-bold rounded-xl transition-colors shadow"
          >
            Contact Our Specialists
          </Link>
          <Link
            href="/plan-my-trip"
            className="px-6 py-3 bg-ceylon-green hover:bg-ceylon-darkgreen text-white text-xs font-bold rounded-xl transition-colors shadow"
          >
            Custom Trip Planner
          </Link>
        </div>
      </div>
    </div>
  );
}
