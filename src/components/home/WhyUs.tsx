"use client";
import React from "react";
import Image from "next/image";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export const WhyUs: React.FC = () => {
  const points = [
    { title: "Authentic Sri Lankan Experiences", desc: "Curated directly with certified local operators and village hosts." },
    { title: "Professional Local Guides", desc: "Licensed English & multi-lingual guides passionate about Sri Lankan history." },
    { title: "Transparent Pricing", desc: "No hidden booking charges or unexpected fees at checkout." },
    { title: "Flexible Cancellation", desc: "100% money-back guarantee on eligible bookings up to 24h prior." },
    { title: "Instant Booking & Digital Vouchers", desc: "Get immediate confirmation vouchers sent straight to your phone & email." },
    { title: "Personalized Island Itineraries", desc: "Custom-tailored trips designed around your exact budget and travel pace." },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=800&auto=format&fit=crop"
                alt="Sri Lanka Local Hospitality"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-card mt-8">
              <Image
                src="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=800&auto=format&fit=crop"
                alt="Ceylon Tea Plantation Guide"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-4 left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 max-w-xs">
            <div className="w-10 h-10 rounded-full bg-ceylon-green/10 text-ceylon-green flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ceylon-navy">100% Verified Local Guides</h4>
              <p className="text-[10px] text-ceylon-muted">SLTDA Authorized Tourism Brand</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-ceylon-green uppercase tracking-wider block mb-1">
              Why Ceylon Explore Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ceylon-navy tracking-tight leading-tight">
              Travel Deeper. <br />
              <span className="text-ceylon-blue">Experience Sri Lanka Locally.</span>
            </h2>
          </div>
          <p className="text-sm text-ceylon-muted leading-relaxed">
            We bridge the gap between global travellers seeking seamless, reliable online bookings and Sri Lanka’s most authentic, passionate local guides and tour providers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {points.map((p, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-ceylon-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-ceylon-navy">{p.title}</h4>
                  <p className="text-[11px] text-ceylon-muted mt-0.5 leading-snug">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
