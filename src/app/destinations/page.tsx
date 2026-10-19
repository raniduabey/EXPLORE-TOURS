import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { DESTINATIONS_CATALOG } from "@/data/destinationsData";
import { MapPin, ArrowRight, Calendar, Compass, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Destinations in Sri Lanka | ${siteConfig.name}`,
  description:
    "Explore iconic Sri Lanka destinations: Sigiriya Rock, Ella Mountain Highlands, Yala Leopard Safaris, Galle Dutch Fort, Mirissa, and Kandy.",
  alternates: {
    canonical: `${siteConfig.url}/destinations`,
  },
};

export default async function DestinationsPage() {
  let destinations: any[] = [];
  try {
    const dbDests = await prisma.destination.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { name: "asc" },
    });
    if (dbDests.length > 0) {
      destinations = dbDests;
    }
  } catch (e) {
    console.error("Failed to load destinations from database", e);
  }

  if (destinations.length === 0) {
    destinations = DESTINATIONS_CATALOG;
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-[1248px] mx-auto space-y-12">
      {/* Hero Header */}
      <div className="bg-luxury-forest text-luxury-ivory rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-luxury-gold/30 space-y-4">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-luxury-gold/10 blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-luxury-gold/30 text-luxury-gold text-[10px] font-mono uppercase tracking-[0.25em]">
          <Compass className="w-3.5 h-3.5 text-luxury-gold" />
          <span>Island Territories</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-luxury-ivory">
          Sri Lanka by Region
        </h1>
        <p className="text-sm sm:text-base text-luxury-sand/85 max-w-2xl font-light leading-relaxed">
          From ancient 5th-century rock citadels and emerald mountain tea estates to coastal leopard sanctuaries and historic colonial ramparts, discover Sri Lanka&apos;s most alluring destinations.
        </p>
      </div>

      {/* Destinations Grid: Centered 3 Columns of 400x300px 4:3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-6 lg:gap-y-7 justify-items-center justify-center max-w-[1248px] mx-auto">
        {destinations.map((dest) => (
          <Link
            key={dest.id}
            href={`/destinations/${dest.slug}`}
            className="group relative w-full max-w-[400px] h-[440px] sm:h-[480px] lg:h-auto lg:aspect-[4/3] lg:max-w-[400px] lg:max-h-[300px] xl:w-[400px] xl:h-[300px] rounded-2xl sm:rounded-3xl lg:rounded-[20px] overflow-hidden shadow-[0_12px_35px_rgba(16,45,36,0.08)] hover:shadow-[0_24px_55px_rgba(16,45,36,0.18)] border border-luxury-sand/70 hover:border-luxury-gold/60 transition-all duration-500 transform hover:-translate-y-1.5 block bg-luxury-forest mx-auto"
          >
            {/* Background Image with smooth hover scale */}
            <Image
              src={dest.image}
              alt={`${dest.name} authentic photography`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Dual Subtle Vignette & Gradient Overlays for High Legibility */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-luxury-forest/80 via-luxury-forest/25 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-forest/95 via-luxury-forest/55 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-luxury-forest/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />

            {/* Top Header: Sri Lanka MapPin Badge & Circular Arrow Button */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-forest/85 backdrop-blur-md border border-luxury-gold/30 text-luxury-gold shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-luxury-sand">
                  Sri Lanka
                </span>
              </span>
              <div className="w-8 h-8 rounded-full bg-luxury-forest/80 backdrop-blur-md border border-luxury-gold/30 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-luxury-forest transition-all duration-300 shadow-sm pointer-events-auto">
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-4.5 lg:pb-3.5 text-luxury-ivory z-10">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-luxury-gold block mb-1">
                {dest.bestTimeToVisit ? `Best: ${dest.bestTimeToVisit}` : "Iconic Enclave"}
              </span>
              <h3 className="font-serif text-lg sm:text-xl lg:text-xl font-normal tracking-wide text-luxury-ivory group-hover:text-luxury-gold transition-colors leading-tight line-clamp-1">
                {dest.name}
              </h3>
              <p className="text-xs text-luxury-sand/90 font-sans font-light mt-1.5 line-clamp-2 leading-relaxed">
                {dest.shortDesc}
              </p>
              <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-luxury-sand/70 font-medium">
                    From
                  </span>
                  <span className="font-serif text-sm sm:text-base font-semibold text-luxury-gold">
                    ${dest.startingPrice}
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
        ))}
      </div>
    </div>
  );
}
