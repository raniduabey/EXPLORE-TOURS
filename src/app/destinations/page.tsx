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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
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

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((dest) => (
          <Link
            key={dest.id}
            href={`/destinations/${dest.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-luxury-sand/80 hover:border-luxury-gold/50 shadow-[0_12px_30px_rgba(16,45,36,0.06)] hover:shadow-[0_20px_45px_rgba(16,45,36,0.14)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <Image
                  src={dest.image}
                  alt={`${dest.name} authentic photography`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-forest/90 via-luxury-forest/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-forest/80 backdrop-blur-md text-luxury-gold border border-luxury-gold/30 text-[10px] font-mono uppercase tracking-wider mb-2">
                    <MapPin className="w-3 h-3 text-luxury-gold" />
                    <span>Sri Lanka</span>
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-luxury-ivory tracking-wide leading-tight group-hover:text-luxury-gold transition-colors">
                    {dest.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <p className="text-xs sm:text-sm text-luxury-charcoal/75 leading-relaxed font-light line-clamp-3">
                  {dest.shortDesc}
                </p>

                <div className="space-y-2.5 pt-3 border-t border-luxury-sand/70 text-xs text-luxury-charcoal/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                    <span className="line-clamp-1 font-serif">Best season: {dest.bestTimeToVisit}</span>
                  </div>
                  {dest.popularAttractions && (
                    <div className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                      <span className="line-clamp-1 font-sans text-xs">
                        {(() => {
                          const raw = dest.popularAttractions;
                          if (typeof raw === "string" && raw.trim().startsWith("[")) {
                            try {
                              const arr = JSON.parse(raw);
                              if (Array.isArray(arr)) {
                                return arr.map((a: any) => typeof a === "string" ? a : a.name).filter(Boolean).join(", ");
                              }
                            } catch (e) {}
                          }
                          return String(raw);
                        })()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7 pt-0 border-t border-luxury-sand/50 flex items-center justify-between mt-auto">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-luxury-charcoal/50 block">From</span>
                <span className="font-serif text-lg font-semibold text-luxury-forest">
                  ${dest.startingPrice}{" "}
                  <span className="text-xs font-sans font-light text-luxury-charcoal/50">/ person</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-serif text-xs font-semibold uppercase tracking-wider text-luxury-forest group-hover:text-luxury-gold group-hover:translate-x-1 transition-all">
                <span>View Journeys</span>
                <ArrowRight className="w-3.5 h-3.5 text-luxury-gold" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
