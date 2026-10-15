"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";

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
  sigiriya: "/images/destinations/sigiriya.jpg",
  ella: "/images/destinations/ella.jpg",
  kandy: "/images/destinations/kandy.jpg",
  galle: "/images/destinations/galle.jpg",
  mirissa: "/images/destinations/mirissa.jpg",
  yala: "/images/destinations/yala.jpg",
  colombo: "/images/destinations/colombo.jpg",
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-forest/5 border border-luxury-gold/30 text-luxury-gold text-[10px] font-mono uppercase tracking-[0.25em] mb-3">
            <span>Iconic Enclaves</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight">
            Sri Lanka's Most Alluring Regions
          </h2>
          <p className="text-sm sm:text-base text-luxury-charcoal/70 font-light mt-2 max-w-2xl leading-relaxed">
            From misty highlands and ancient UNESCO heritage citadels to untamed savannahs and palm-fringed coastlines.
          </p>
        </div>
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 font-serif text-xs font-semibold uppercase tracking-wider text-luxury-forest hover:text-luxury-gold transition-colors self-start md:self-auto"
        >
          <span>View All Destinations</span>
          <ArrowRight className="w-4 h-4 text-luxury-gold" />
        </Link>
      </FadeIn>

      <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {list.map((d) => {
          const img = imgErrors[d.id] ? fallbackImages[d.slug] || d.image : d.image;
          return (
            <FadeInStaggerItem key={d.id}>
              <Link
                href={`/destinations/${d.slug}`}
                className="group relative h-96 rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(16,45,36,0.1)] hover:shadow-[0_25px_50px_rgba(16,45,36,0.18)] border border-luxury-sand/50 transition-all duration-500 transform hover:-translate-y-1.5 block bg-luxury-forest"
              >
                <Image
                  src={img}
                  alt={d.name}
                  fill
                  onError={() => setImgErrors((prev) => ({ ...prev, [d.id]: true }))}
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-forest/95 via-luxury-forest/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-luxury-forest/80 text-luxury-gold border border-luxury-gold/30 backdrop-blur-md shadow-sm">
                    {d.experienceCount} Journeys
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-luxury-ivory">
                  <div className="flex items-center gap-1.5 text-luxury-gold text-xs font-serif mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Sri Lanka</span>
                  </div>
                  <h3 className="font-serif text-2xl font-normal tracking-wide text-luxury-ivory group-hover:text-luxury-gold transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs text-luxury-sand/85 mt-1.5 line-clamp-2 font-light leading-relaxed">
                    {d.shortDesc}
                  </p>
                  <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-luxury-sand/70">From</span>
                    <span className="font-serif text-sm font-semibold text-luxury-gold">
                      {formatPrice(d.startingPrice)}
                    </span>
                  </div>
                </div>
              </Link>
            </FadeInStaggerItem>
          );
        })}
      </FadeInStagger>
    </section>
  );
};
