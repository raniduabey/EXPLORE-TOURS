import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { DESTINATIONS_CATALOG } from "@/data/destinationsData";
import { MapPin, ArrowRight, Calendar, Compass, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: `Destinations in Sri Lanka | ${siteConfig.name}`,
  description:
    "Explore iconic Sri Lanka destinations: Sigiriya Rock, Ella Mountain Highlands, Yala Leopard Safaris, Galle Dutch Fort, Mirissa, and Kandy.",
  alternates: {
    canonical: `${siteConfig.url}/destinations`,
  },
};

export default function DestinationsPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="bg-ceylon-navy text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5" />
          <span>Island Destinations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Explore Sri Lanka by Region
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          From ancient 5th-century rock citadels and emerald mountain tea estates to coastal leopard sanctuaries and historic colonial forts, explore authentic Sri Lanka destinations.
        </p>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DESTINATIONS_CATALOG.map((dest) => (
          <Link
            key={dest.id}
            href={`/destinations/${dest.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <Image
                  src={dest.image}
                  alt={`${dest.name} authentic photography`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold mb-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>Sri Lanka</span>
                  </span>
                  <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight">
                    {dest.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {dest.shortDesc}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-ceylon-blue shrink-0" />
                    <span className="line-clamp-1">Best time: {dest.bestTimeToVisit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-ceylon-green shrink-0" />
                    <span className="line-clamp-1">{dest.popularAttractions}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-50 flex items-center justify-between mt-auto">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Starting from</span>
                <span className="text-base font-extrabold text-ceylon-navy">
                  ${dest.startingPrice}{" "}
                  <span className="text-xs font-normal text-slate-400">/ person</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-ceylon-blue group-hover:translate-x-1 transition-transform">
                <span>View Tours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
