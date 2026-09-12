"use client";
import React from "react";
import { ShieldCheck, Award, Users, Headset } from "lucide-react";

export const TrustBar: React.FC = () => {
  const items = [
    { icon: ShieldCheck, title: "Secure Payments", desc: "Protected online booking" },
    { icon: Award, title: "Verified Experiences", desc: "Carefully selected tours" },
    { icon: Users, title: "Local Experts", desc: "Knowledgeable Sri Lankan guides" },
    { icon: Headset, title: "24/7 Support", desc: "Assistance when travellers need it" }
  ];

  return (
    <section className="bg-white border-b border-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3.5 p-2">
              <div className="w-10 h-10 rounded-xl bg-ceylon-softblue flex items-center justify-center text-ceylon-blue shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-ceylon-navy tracking-tight">{item.title}</h4>
                <p className="text-[11px] text-ceylon-muted mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
