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
  "nuwara-eliya": "/images/destinations/nuwara-eliya.jpg",
  colombo: "/images/destinations/colombo.jpg",
};

// Strict ordering specified for balanced 2-row x 3-column layout
const REGION_ORDER = [
  "galle",
  "yala",
  "ella",
  "mirissa",
  "nuwara-eliya",
  "sigiriya",
];

const defaultDestinations: DestinationItem[] = [
  {
    id: "dest-galle",
    name: "Galle Dutch Fort",
    slug: "galle",
    shortDesc: "17th-century oceanfront ramparts, cobblestone alleys, Dutch colonial architecture, and maritime charm.",
    image: fallbackImages.galle,
    experienceCount: 1,
    startingPrice: 45,
  },
  {
    id: "dest-yala",
    name: "Yala Wildlife Safaris",
    slug: "yala",
    shortDesc: "World's highest density of leopards, wild elephants, and open-top 4x4 safaris across coastal wilderness.",
    image: fallbackImages.yala,
    experienceCount: 1,
    startingPrice: 95,
  },
  {
    id: "dest-ella",
    name: "Ella & Mountain Highlands",
    slug: "ella",
    shortDesc: "Misty mountain peaks, emerald tea estates, Nine Arches Bridge, and the scenic highland blue train.",
    image: fallbackImages.ella,
    experienceCount: 1,
    startingPrice: 65,
  },
  {
    id: "dest-mirissa",
    name: "Mirissa & Southern Coast",
    slug: "mirissa",
    shortDesc: "Golden crescent beaches, blue whale expeditions in the Indian Ocean, coconut hills, and coastal surfing.",
    image: fallbackImages.mirissa,
    experienceCount: 1,
    startingPrice: 75,
  },
  {
    id: "dest-nuwara-eliya",
    name: "Nuwara Eliya Highlands",
    slug: "nuwara-eliya",
    shortDesc: "Misty colonial hill station known as 'Little England', enveloped by verdant Ceylon tea gardens and waterfalls.",
    image: fallbackImages["nuwara-eliya"],
    experienceCount: 1,
    startingPrice: 70,
  },
  {
    id: "dest-sigiriya",
    name: "Sigiriya & Cultural Triangle",
    slug: "sigiriya",
    shortDesc: "Ancient 5th-century palace fortress citadel, gilded cave temples, and royal water gardens.",
    image: fallbackImages.sigiriya,
    experienceCount: 5,
    startingPrice: 85,
  },
];

export const DestinationGrid: React.FC<{ destinations?: DestinationItem[] }> = ({
  destinations: propDestinations,
}) => {
  const { formatPrice } = useCurrency();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const rawList =
    propDestinations && propDestinations.length > 0
      ? propDestinations
      : defaultDestinations;

  // Reorder strictly by the requested 2-row layout:
  // Row 1: Galle, Yala, Ella
  // Row 2: Mirissa, Nuwara Eliya, Sigiriya
  const list = [...rawList].sort((a, b) => {
    const idxA = REGION_ORDER.indexOf(a.slug);
    const idxB = REGION_ORDER.indexOf(b.slug);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1248px] mx-auto">
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-forest/5 border border-luxury-gold/30 text-luxury-gold text-[10px] font-mono uppercase tracking-[0.25em] mb-3">
            <span>Iconic Enclaves</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight">
            Sri Lanka&apos;s Most Alluring Regions
          </h2>
          <p className="text-sm sm:text-base text-luxury-charcoal/80 font-sans font-normal mt-2 max-w-2xl leading-relaxed">
            From misty highlands and ancient UNESCO heritage citadels to untamed savannahs and palm-fringed coastlines.
          </p>
        </div>
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-luxury-forest hover:text-luxury-gold transition-colors self-start md:self-auto"
        >
          <span>View All Destinations</span>
          <ArrowRight className="w-4 h-4 text-luxury-gold" />
        </Link>
      </FadeIn>

      <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-6 lg:gap-y-7 justify-items-center justify-center max-w-[1248px] mx-auto">
        {list.map((d) => {
          const img = imgErrors[d.id] ? fallbackImages[d.slug] || d.image : d.image;
          return (
            <FadeInStaggerItem key={d.id} className="w-full flex justify-center">
              <Link
                href={`/destinations/${d.slug}`}
                className="group relative w-full max-w-[400px] h-[440px] sm:h-[480px] lg:h-auto lg:aspect-[4/3] lg:max-w-[400px] lg:max-h-[300px] xl:w-[400px] xl:h-[300px] rounded-2xl sm:rounded-3xl lg:rounded-[20px] overflow-hidden shadow-[0_12px_35px_rgba(16,45,36,0.08)] hover:shadow-[0_24px_55px_rgba(16,45,36,0.18)] border border-luxury-sand/70 hover:border-luxury-gold/60 transition-all duration-500 transform hover:-translate-y-1.5 block bg-luxury-forest mx-auto"
              >
                {/* Background Image with smooth hover scale */}
                <Image
                  src={img}
                  alt={d.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  onError={() => setImgErrors((prev) => ({ ...prev, [d.id]: true }))}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Dual Subtle Vignette & Gradient Overlays for High Legibility */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-luxury-forest/80 via-luxury-forest/25 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-forest/95 via-luxury-forest/55 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-luxury-forest/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />

                {/* Top Header: Journey Count Badge & Circular Arrow Button */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-forest/85 backdrop-blur-md border border-luxury-gold/30 text-luxury-gold shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                    <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-luxury-sand">
                      {d.experienceCount} {d.experienceCount === 1 ? "Journey" : "Journeys"}
                    </span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-luxury-forest/80 backdrop-blur-md border border-luxury-gold/30 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-luxury-forest transition-all duration-300 shadow-sm pointer-events-auto">
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-4.5 lg:pb-3.5 text-luxury-ivory z-10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-luxury-gold block mb-1">
                    Sri Lanka Iconic Enclave
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl lg:text-xl font-normal tracking-wide text-luxury-ivory group-hover:text-luxury-gold transition-colors leading-tight line-clamp-1">
                    {d.name}
                  </h3>
                  <p className="text-xs text-luxury-sand/90 font-sans font-light mt-1.5 line-clamp-2 leading-relaxed">
                    {d.shortDesc}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-sans uppercase tracking-widest text-luxury-sand/70 font-medium">
                        From
                      </span>
                      <span className="font-serif text-sm sm:text-base font-semibold text-luxury-gold">
                        {formatPrice(d.startingPrice)}
                      </span>
                      <span className="text-[10px] font-sans font-normal text-luxury-sand/60">
                        / person
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans uppercase tracking-widest text-luxury-gold font-medium group-hover:text-luxury-ivory transition-colors">
                      <span>View Journeys</span>
                      <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                    </div>
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
