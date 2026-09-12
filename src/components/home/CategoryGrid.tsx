"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Landmark, Compass, Mountain, Waves, Utensils, TrainTrack } from "lucide-react";

export const CategoryGrid: React.FC = () => {
  const categories = [
    {
      title: "Cultural Experiences",
      desc: "Temples, ancient kingdoms and UNESCO heritage.",
      slug: "cultural",
      icon: Landmark,
      image: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Wildlife & Safari",
      desc: "Yala leopards, wild elephant herds and bird sanctuaries.",
      slug: "wildlife",
      icon: Compass,
      image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Adventure & Hiking",
      desc: "Highland peak climbing, white water rafting and exploration.",
      slug: "adventure",
      icon: Mountain,
      image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Beaches & Ocean",
      desc: "Surfing, diving, snorkeling and blue whale cruises.",
      slug: "beaches",
      icon: Waves,
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Food & Local Life",
      desc: "Authentic curry cooking classes, markets and village life.",
      slug: "food",
      icon: Utensils,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Scenic Train Journeys",
      desc: "Mountain blue trains, tea estates and valley bridges.",
      slug: "scenic",
      icon: TrainTrack,
      image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-ceylon-softblue/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-ceylon-green uppercase tracking-wider block mb-1">
            Find What You Love
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ceylon-navy tracking-tight">
            Browse by Experience Category
          </h2>
          <p className="text-sm text-ceylon-muted mt-2">
            Tailor your Sri Lankan vacation around your unique passions and travel style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                href={`/tours?category=${c.slug}`}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 block"
              >
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy/95 via-ceylon-navy/40 to-transparent" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 line-clamp-2">{c.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
