"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  image: string;
  experienceCount: number;
  startingPrice: number;
}

const fallbackImages: Record<string, string> = {
  sigiriya: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1000&auto=format&fit=crop",
  ella: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop",
  kandy: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1000&auto=format&fit=crop",
  galle: "https://images.unsplash.com/photo-1566296566002-390b1062b186?q=80&w=1000&auto=format&fit=crop",
  mirissa: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop",
  yala: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1000&auto=format&fit=crop",
  colombo: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1000&auto=format&fit=crop",
};

const defaultDestinations: DestinationItem[] = [
  { id: "1", name: "Sigiriya", slug: "sigiriya", shortDesc: "Ancient 5th-century palace fortress and UNESCO World Heritage site.", image: fallbackImages.sigiriya, experienceCount: 14, startingPrice: 45 },
  { id: "2", name: "Ella", slug: "ella", shortDesc: "Highland mountain peaks, Nine Arch Bridge, and tea plantations.", image: fallbackImages.ella, experienceCount: 12, startingPrice: 35 },
  { id: "3", name: "Yala", slug: "yala", shortDesc: "Wild leopards, Asian elephants, and open-top 4x4 safaris.", image: fallbackImages.yala, experienceCount: 8, startingPrice: 65 },
  { id: "4", name: "Galle", slug: "galle", shortDesc: "Dutch colonial cobblestone streets, lighthouses, and ramparts.", image: fallbackImages.galle, experienceCount: 10, startingPrice: 30 },
];

export const DestinationGrid: React.FC<{ destinations?: DestinationItem[] }> = ({ destinations: propDestinations }) => {
  const { formatPrice } = useCurrency();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const list = propDestinations && propDestinations.length > 0 ? propDestinations : defaultDestinations;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold text-ceylon-green uppercase tracking-wider block mb-1">
            Top Sri Lankan Destinations
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ceylon-navy tracking-tight">
            Explore Sri Lanka
          </h2>
          <p className="text-sm text-ceylon-muted mt-2 max-w-xl">
            From ancient rock fortresses to misty tea valleys and golden tropical beaches, discover the places travellers love most.
          </p>
        </div>
        <Link
          href="/destinations/sigiriya"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ceylon-blue hover:text-ceylon-navy transition-colors self-start md:self-auto"
        >
          <span>View All Destinations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {list.map((d) => {
          const img = imgErrors[d.id] ? fallbackImages[d.slug] || d.image : d.image;
          return (
            <Link
              key={d.id}
              href={`/destinations/${d.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 block bg-slate-100"
            >
              <Image
                src={img}
                alt={d.name}
                fill
                onError={() => setImgErrors((prev) => ({ ...prev, [d.id]: true }))}
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy/90 via-ceylon-navy/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 text-ceylon-navy backdrop-blur-md shadow-sm">
                  {d.experienceCount} Experiences
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Sri Lanka</span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  {d.name}
                </h3>
                <p className="text-xs text-slate-200 mt-1 line-clamp-2 font-normal">{d.shortDesc}</p>
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">From</span>
                  <span className="text-sm font-extrabold text-white">{formatPrice(d.startingPrice)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
