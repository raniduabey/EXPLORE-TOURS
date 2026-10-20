import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { DESTINATIONS_CATALOG } from "@/data/destinationsData";
import { MapPin, ArrowRight, Calendar, Compass, ShieldCheck } from "lucide-react";

import { syncDestinationsWithDb, getAllStoredDestinations } from "@/lib/destinationsStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: `Destinations in Sri Lanka | ${siteConfig.name}`,
  description:
    "Explore iconic Sri Lanka destinations: Sigiriya Rock, Ella Mountain Highlands, Yala Leopard Safaris, Galle Dutch Fort, Mirissa, and Kandy.",
  alternates: {
    canonical: `${siteConfig.url}/destinations`,
  },
};

export default async function DestinationsPage() {
  try {
    await syncDestinationsWithDb(prisma);
  } catch (syncErr) {
    console.warn("syncDestinationsWithDb warning in /destinations:", syncErr);
  }

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
    const storedDests = await getAllStoredDestinations().catch(() => []);
    if (storedDests && storedDests.length > 0) {
      destinations = storedDests.filter((d) => d.status === "PUBLISHED");
    }
  }

  if (destinations.length === 0) {
    destinations = DESTINATIONS_CATALOG;
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-[1248px] mx-auto space-y-12">
      {/* Hero Header */}
      <div className="bg-[#F0ECE4]/60 text-[#15392D] rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-sm border border-[#E7E2D8] space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15392D]/5 border border-[#C5A46B]/30 text-[#C5A46B] text-[10px] font-mono uppercase tracking-[0.25em]">
          <Compass className="w-3.5 h-3.5 text-[#C5A46B]" />
          <span>Island Territories</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#15392D]">
          Sri Lanka by Region
        </h1>
        <p className="text-sm sm:text-base text-[#59645E] max-w-2xl font-light leading-relaxed">
          From ancient 5th-century rock citadels and emerald mountain tea estates to coastal leopard sanctuaries and historic colonial ramparts, discover Sri Lanka&apos;s most alluring destinations.
        </p>
      </div>

      {/* Destinations Grid: Centered 3 Columns of 400x300px 4:3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-6 lg:gap-y-7 justify-items-center justify-center max-w-[1248px] mx-auto">
        {destinations.map((dest) => (
          <Link
            key={dest.id}
            href={`/destinations/${dest.slug}`}
            className="group relative w-full max-w-[400px] h-[440px] sm:h-[480px] lg:h-auto lg:aspect-[4/3] lg:max-w-[400px] lg:max-h-[300px] xl:w-[400px] xl:h-[300px] rounded-2xl sm:rounded-3xl lg:rounded-[20px] overflow-hidden shadow-[0_12px_35px_rgba(21,57,45,0.06)] hover:shadow-[0_24px_55px_rgba(21,57,45,0.16)] border border-[#E7E2D8] hover:border-[#C5A46B]/60 transition-all duration-500 transform hover:-translate-y-1.5 block bg-[#0D281F] mx-auto"
          >
            {/* Background Image with smooth hover scale */}
            <Image
              src={dest.image}
              alt={`${dest.name} authentic photography`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Single Subtle Bottom Scrim for text legibility while keeping natural photography vibrant */}
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0D281F]/90 via-[#0D281F]/40 to-transparent pointer-events-none" />

            {/* Top Header: Sri Lanka MapPin Badge & Circular Arrow Button */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D281F]/70 backdrop-blur-md border border-[#C5A46B]/30 text-[#C5A46B] shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[#C5A46B] shrink-0" />
                <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#F8F7F3]">
                  Sri Lanka
                </span>
              </span>
              <div className="w-8 h-8 rounded-full bg-[#0D281F]/70 backdrop-blur-md border border-[#C5A46B]/30 flex items-center justify-center text-[#C5A46B] group-hover:bg-[#C5A46B] group-hover:text-[#0D281F] transition-all duration-300 shadow-sm pointer-events-auto">
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-4.5 lg:pb-3.5 text-white z-10">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A46B] block mb-1">
                {dest.bestTimeToVisit ? `Best: ${dest.bestTimeToVisit}` : "Iconic Enclave"}
              </span>
              <h3 className="font-serif text-lg sm:text-xl lg:text-xl font-normal tracking-wide text-white group-hover:text-[#C5A46B] transition-colors leading-tight line-clamp-1">
                {dest.name}
              </h3>
              <p className="text-xs text-white/80 font-sans font-light mt-1.5 line-clamp-2 leading-relaxed">
                {dest.shortDesc}
              </p>
              <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-white/70 font-medium">
                    From
                  </span>
                  <span className="font-serif text-sm sm:text-base font-semibold text-[#C5A46B]">
                    ${dest.startingPrice}
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
        ))}
      </div>
    </div>
  );
}
