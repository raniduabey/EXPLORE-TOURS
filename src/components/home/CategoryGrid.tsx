"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Landmark, Compass, Mountain, Waves, Utensils, TrainTrack, CalendarRange } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";

export const CategoryGrid: React.FC = () => {
  const categories = [
    {
      title: "Multi-Day Tour Packages",
      desc: "Comprehensive 6 to 21-day private island circuits with certified chauffeur guides.",
      slug: "multiday",
      icon: CalendarRange,
      image: "/images/categories/multiday.jpg"
    },
    {
      title: "Cultural Heritage",
      desc: "Ancient citadels, sacred Buddhist shrines, and UNESCO World Heritage ruins.",
      slug: "cultural",
      icon: Landmark,
      image: "/images/categories/cultural.jpg"
    },
    {
      title: "Wildlife & Safari Expeditions",
      desc: "Yala leopard safaris, wild elephant gatherings, and pristine bird sanctuaries.",
      slug: "wildlife",
      icon: Compass,
      image: "/images/categories/wildlife.jpg"
    },
    {
      title: "Scenic Rail & Highlands",
      desc: "Historic mountain blue trains, colonial viaducts, and emerald tea estates.",
      slug: "scenic",
      icon: TrainTrack,
      image: "/images/categories/scenic.jpg"
    },
    {
      title: "Adventure & Hiking",
      desc: "Highland peak climbing, Little Adam's Peak trails, and nature expeditions.",
      slug: "adventure",
      icon: Mountain,
      image: "/images/categories/adventure.jpg"
    },
    {
      title: "Beach & Coastal Escapes",
      desc: "Mirissa blue whale watching, coastal catamaran cruises, and palm-fringed sands.",
      slug: "beaches",
      icon: Waves,
      image: "/images/categories/beaches.jpg"
    }
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

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <FadeInStaggerItem key={c.slug}>
                <Link
                  href={`/tours?category=${c.slug}`}
                  className="group relative h-72 rounded-3xl overflow-hidden shadow-[0_12px_30px_rgba(16,45,36,0.06)] hover:shadow-[0_20px_45px_rgba(16,45,36,0.12)] border border-luxury-sand/60 transition-all duration-500 transform hover:-translate-y-1.5 block"
                >
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-forest/95 via-luxury-forest/40 to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-luxury-forest/80 backdrop-blur-md border border-luxury-gold/30 flex items-center justify-center text-luxury-gold shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-luxury-ivory">
                    <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-luxury-ivory group-hover:text-luxury-gold transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-luxury-sand/90 font-sans font-normal mt-1.5 line-clamp-2 leading-relaxed">
                      {c.desc}
                    </p>
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
