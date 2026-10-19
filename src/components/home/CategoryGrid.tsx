"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Landmark,
  Compass,
  Mountain,
  Waves,
  TrainTrack,
  CalendarRange,
  ArrowRight,
} from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";
import {
  HOMEPAGE_CARD_GRID,
  HOMEPAGE_CARD_CONTAINER,
  HOMEPAGE_CARD_OVERLAY,
  HOMEPAGE_CARD_VIGNETTE,
  HOMEPAGE_CARD_PADDING,
} from "./cardTokens";

export const CategoryGrid: React.FC = () => {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const categories = [
    {
      title: "Multi-Day Tour Packages",
      desc: "Comprehensive 6 to 21-day private island circuits with certified chauffeur guides.",
      slug: "multiday",
      icon: CalendarRange,
      image: "/images/categories/multiday.jpg",
      tag: "Island Circuits",
      subtitle: "6 – 21 Days Private",
      focalPosition: "object-center",
    },
    {
      title: "Cultural Heritage",
      desc: "Ancient citadels, sacred Buddhist shrines, and UNESCO World Heritage ruins.",
      slug: "cultural",
      icon: Landmark,
      image: "/images/categories/cultural.jpg",
      tag: "UNESCO Heritage",
      subtitle: "Ancient Citadels",
      focalPosition: "object-[center_30%]",
    },
    {
      title: "Wildlife & Safari Expeditions",
      desc: "Yala leopard safaris, wild elephant gatherings, and pristine bird sanctuaries.",
      slug: "wildlife",
      icon: Compass,
      image: "/images/categories/wildlife.jpg",
      tag: "Wild Wilderness",
      subtitle: "Big Game Safaris",
      focalPosition: "object-center",
    },
    {
      title: "Scenic Rail & Highlands",
      desc: "Historic mountain blue trains, colonial viaducts, and emerald tea estates.",
      slug: "scenic",
      icon: TrainTrack,
      image: "/images/categories/scenic.jpg",
      tag: "Highland Railways",
      subtitle: "Tea Country Trails",
      focalPosition: "object-[center_25%]",
    },
    {
      title: "Adventure & Hiking",
      desc: "Highland peak climbing, Little Adam's Peak trails, and nature expeditions.",
      slug: "adventure",
      icon: Mountain,
      image: "/images/categories/adventure.jpg",
      tag: "Active Expeditions",
      subtitle: "Peaks & Escarpments",
      focalPosition: "object-[center_20%]",
    },
    {
      title: "Beach & Coastal Escapes",
      desc: "Mirissa blue whale watching, coastal catamaran cruises, and palm-fringed sands.",
      slug: "beaches",
      icon: Waves,
      image: "/images/categories/beaches.jpg",
      tag: "Tropical Shores",
      subtitle: "Indian Ocean Coast",
      focalPosition: "object-center",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-y border-luxury-sand/80">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-forest/5 text-luxury-gold text-[10px] font-mono uppercase tracking-[0.25em] border border-luxury-gold/30 mb-3">
            <span>Specialized Travel Styles</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight">
            Curated By Interest
          </h2>
          <p className="text-sm sm:text-base text-luxury-charcoal/80 font-sans font-normal mt-2 max-w-xl mx-auto leading-relaxed">
            Tailor your Sri Lankan itinerary around your private passions, from ancient monastic trails to wild safari expeditions.
          </p>
        </FadeIn>

        <FadeInStagger className={HOMEPAGE_CARD_GRID}>
          {categories.map((c) => {
            const Icon = c.icon;
            const imgSrc = imgErrors[c.slug] ? "/images/destinations/sigiriya.jpg" : c.image;

            return (
              <FadeInStaggerItem key={c.slug}>
                <Link href={`/tours?category=${c.slug}`} className={HOMEPAGE_CARD_CONTAINER}>
                  {/* Background Image with smooth hover scale */}
                  <Image
                    src={imgSrc}
                    alt={c.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={() => setImgErrors((prev) => ({ ...prev, [c.slug]: true }))}
                    className={`object-cover ${c.focalPosition} group-hover:scale-105 transition-transform duration-700 ease-out`}
                  />

                  {/* Overlays matching DestinationGrid */}
                  <div className={HOMEPAGE_CARD_OVERLAY} />
                  <div className={HOMEPAGE_CARD_VIGNETTE} />

                  {/* Top Bar: Category Tag Pill & Circular Arrow Button */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luxury-forest/85 backdrop-blur-md border border-luxury-gold/30 text-luxury-gold shadow-sm">
                      <Icon className="w-3.5 h-3.5 text-luxury-gold" />
                      <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-luxury-sand">
                        {c.tag}
                      </span>
                    </span>
                    <div className="w-8 h-8 rounded-full bg-luxury-forest/80 backdrop-blur-md border border-luxury-gold/30 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-luxury-forest transition-all duration-300 shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className={`absolute bottom-0 left-0 right-0 ${HOMEPAGE_CARD_PADDING} text-luxury-ivory z-10`}>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-luxury-gold block mb-1">
                      {c.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl font-normal tracking-wide text-luxury-ivory group-hover:text-luxury-gold transition-colors leading-tight">
                      {c.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-luxury-sand/90 font-sans font-normal mt-1.5 line-clamp-2 leading-relaxed">
                      {c.desc}
                    </p>
                    <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider text-luxury-gold group-hover:text-luxury-ivory transition-colors">
                        <span>Explore Journeys</span>
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                      <span className="text-[10px] font-sans font-light text-luxury-sand/70">
                        Curated Experiences
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeInStaggerItem>
            );
          })}
        </FadeInStagger>
      </div>
    </section>
  );
};
