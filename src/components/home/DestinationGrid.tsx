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
    <section className="pt-8 sm:pt-12 lg:pt-14 pb-14 sm:pb-18 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-[1248px] mx-auto">
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15392D]/5 border border-[#C5A46B]/30 text-[#C5A46B] text-[10px] font-mono uppercase tracking-[0.25em] mb-3">
            <span>Iconic Enclaves</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#15392D] tracking-tight">
            Sri Lanka&apos;s Most Alluring Regions
          </h2>
          <p className="text-sm sm:text-base text-[#59645E] font-sans font-normal mt-2 max-w-2xl leading-relaxed">
            From misty highlands and ancient UNESCO heritage citadels to untamed savannahs and palm-fringed coastlines.
          </p>
        </div>
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#15392D] hover:text-[#C5A46B] transition-colors self-start md:self-auto"
        >
          <span>View All Destinations</span>
          <ArrowRight className="w-4 h-4 text-[#C5A46B]" />
        </Link>
      </FadeIn>

      <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-6 lg:gap-y-7 justify-items-center justify-center max-w-[1248px] mx-auto">
        {list.map((d) => {
          const img = imgErrors[d.id] ? fallbackImages[d.slug] || d.image : d.image;
          return (
            <FadeInStaggerItem key={d.id} className="w-full flex justify-center">
              <Link
                href={`/destinations/${d.slug}`}
                className="group relative w-full max-w-[400px] h-[440px] sm:h-[480px] lg:h-auto lg:aspect-[4/3] lg:max-w-[400px] lg:max-h-[300px] xl:w-[400px] xl:h-[300px] rounded-2xl sm:rounded-3xl lg:rounded-[20px] overflow-hidden shadow-[0_12px_35px_rgba(21,57,45,0.06)] hover:shadow-[0_24px_55px_rgba(21,57,45,0.16)] border border-[#E7E2D8] hover:border-[#C5A46B]/60 transition-all duration-500 transform hover:-translate-y-1.5 block bg-[#0D281F] mx-auto"
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

                {/* Single Subtle Bottom Scrim for text legibility while keeping natural photography vibrant */}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0D281F]/90 via-[#0D281F]/40 to-transparent pointer-events-none" />

                {/* Top Header: Journey Count Badge & Circular Arrow Button */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D281F]/70 backdrop-blur-md border border-[#C5A46B]/30 text-[#C5A46B] shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A46B] shrink-0" />
                    <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#F8F7F3]">
                      {d.experienceCount} {d.experienceCount === 1 ? "Journey" : "Journeys"}
                    </span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#0D281F]/70 backdrop-blur-md border border-[#C5A46B]/30 flex items-center justify-center text-[#C5A46B] group-hover:bg-[#C5A46B] group-hover:text-[#0D281F] transition-all duration-300 shadow-sm pointer-events-auto">
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-4.5 lg:pb-3.5 text-white z-10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A46B] block mb-1">
                    Sri Lanka Iconic Enclave
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-[24px] font-normal tracking-wide text-white group-hover:text-[#C5A46B] transition-colors leading-tight line-clamp-1">
                    {d.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-white/80 font-sans font-normal mt-1.5 line-clamp-2 leading-relaxed">
                    {d.shortDesc}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-sans uppercase tracking-widest text-white/70 font-medium">
                        From
                      </span>
                      <span className="font-sans font-semibold text-base sm:text-lg tabular-nums text-[#C5A46B]">
                        {formatPrice(d.startingPrice)}
                      </span>
                      <span className="text-[10px] font-sans font-normal text-white/60">
                        / person
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans uppercase tracking-widest text-[#C5A46B] font-medium group-hover:text-white transition-colors">
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
