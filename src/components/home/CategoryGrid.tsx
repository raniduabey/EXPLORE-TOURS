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
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F7F3] border-y border-[#E7E2D8]">
      <div className="max-w-[1248px] mx-auto">
        <FadeIn className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15392D]/5 text-[#C5A46B] text-[10px] font-mono uppercase tracking-[0.25em] border border-[#C5A46B]/30 mb-3">
            <span>Specialized Travel Styles</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#15392D] tracking-tight">
            Curated By Interest
          </h2>
          <p className="text-sm sm:text-base text-[#59645E] font-sans font-normal mt-2 max-w-xl mx-auto leading-relaxed">
            Tailor your Sri Lankan itinerary around your private passions, from ancient monastic trails to wild safari expeditions.
          </p>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-6 lg:gap-y-7 justify-items-center justify-center max-w-[1248px] mx-auto">
          {categories.map((c) => {
            const Icon = c.icon;
            const imgSrc = imgErrors[c.slug] ? "/images/destinations/sigiriya.jpg" : c.image;

            return (
              <FadeInStaggerItem key={c.slug} className="w-full flex justify-center">
                <Link
                  href={`/tours?category=${c.slug}`}
                  className="group relative w-full max-w-[400px] h-[440px] sm:h-[480px] lg:h-auto lg:aspect-[4/3] lg:max-w-[400px] lg:max-h-[300px] xl:w-[400px] xl:h-[300px] rounded-2xl sm:rounded-3xl lg:rounded-[20px] overflow-hidden shadow-[0_12px_35px_rgba(21,57,45,0.06)] hover:shadow-[0_24px_55px_rgba(21,57,45,0.16)] border border-[#E7E2D8] hover:border-[#C5A46B]/60 transition-all duration-500 transform hover:-translate-y-1.5 block bg-[#0D281F] mx-auto"
                >
                  {/* Background Image with smooth hover scale */}
                  <Image
                    src={imgSrc}
                    alt={c.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    onError={() => setImgErrors((prev) => ({ ...prev, [c.slug]: true }))}
                    className={`object-cover ${c.focalPosition} group-hover:scale-105 transition-transform duration-700 ease-out`}
                  />

                  {/* Single Subtle Bottom Scrim for text legibility while keeping natural photography vibrant */}
                  <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0D281F]/90 via-[#0D281F]/40 to-transparent pointer-events-none" />

                  {/* Top Header: Category Tag & Circular Action Pill */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D281F]/70 backdrop-blur-md border border-[#C5A46B]/30 text-[#C5A46B] shadow-sm">
                      <Icon className="w-3.5 h-3.5 text-[#C5A46B] shrink-0" />
                      <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#F8F7F3]">
                        {c.tag}
                      </span>
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#0D281F]/70 backdrop-blur-md border border-[#C5A46B]/30 flex items-center justify-center text-[#C5A46B] group-hover:bg-[#C5A46B] group-hover:text-[#0D281F] transition-all duration-300 shadow-sm pointer-events-auto">
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Bottom Content: Subtitle, Title, Description, and Link Footer */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-4.5 lg:pb-3.5 text-white z-10">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A46B] block mb-1">
                      {c.subtitle}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-[24px] font-normal tracking-wide text-white group-hover:text-[#C5A46B] transition-colors leading-tight line-clamp-1">
                      {c.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-white/80 font-sans font-normal mt-1.5 line-clamp-2 leading-relaxed">
                      {c.desc}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between">
                      <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-widest text-[#C5A46B] font-medium flex items-center gap-1.5 group-hover:text-white transition-colors">
                        <span>Explore Journeys</span>
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="text-[10px] font-sans font-light text-white/70">
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
