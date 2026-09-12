import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { TourCard } from "@/components/tours/TourCard";
import { MapPin, Calendar } from "lucide-react";

export const revalidate = 60;

const FALLBACK_DESTINATIONS: Record<string, any> = {
  sigiriya: {
    id: "dest-sigiriya",
    name: "Sigiriya & Cultural Triangle",
    slug: "sigiriya",
    shortDesc: "Ancient 5th-century rock citadels, gilded cave temples, and royal water gardens rising dramatically from Sri Lanka's emerald central plains.",
    longDesc: "The Cultural Triangle forms the cradle of ancient Sri Lankan civilization. Anchored by the UNESCO World Heritage Lion Rock Citadel of Sigiriya and the subterranean Buddhist shrines of Dambulla, this region invites travelers into an awe-inspiring world of 2,500-year-old hydraulic engineering, vibrant frescoes, and spiritual serenity.",
    image: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1200&auto=format&fit=crop",
    popularAttractions: "Sigiriya Lion Rock, Dambulla Cave Temple, Pidurangala Rock, Polonnaruwa Ruins, Minneriya Elephant Gathering",
    bestTimeToVisit: "January to September (Dry weather, clear skies for morning fortress climb)",
  },
  ella: {
    id: "dest-ella",
    name: "Ella & Mountain Highlands",
    slug: "ella",
    shortDesc: "Misty mountain peaks, emerald tea estates, Nine Arches Bridge, and the world's most famous scenic blue train journey.",
    longDesc: "Perched high in Sri Lanka's central highlands, Ella is a tranquil mountain haven surrounded by cascading waterfalls, tea gardens, and dramatic hill passes. Famed for Little Adam's Peak, Ella Rock, and the architectural masterpiece of the colonial Nine Arches Viaduct.",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
    popularAttractions: "Nine Arches Bridge, Little Adam's Peak, Ella Rock, Ravana Falls, Halpewatte Tea Factory",
    bestTimeToVisit: "January to April & June to August",
  },
  yala: {
    id: "dest-yala",
    name: "Yala Wildlife Safaris",
    slug: "yala",
    shortDesc: "Home to the world's highest density of leopards, wild elephants, sloth bears, and crocodiles across dramatic coastal dry zone wilderness.",
    longDesc: "Yala National Park is Sri Lanka's premier wildlife sanctuary, bordering the Indian Ocean in the southeast. Experienced local safari trackers navigate rugged scrubland and freshwater lagoons in 4x4 open-top jeeps in search of the elusive Ceylon leopard.",
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop",
    popularAttractions: "Block 1 Leopard Safari, Elephant Herd Waterholes, Sloth Bear Tracking, Kumana Bird Sanctuary",
    bestTimeToVisit: "February to June (Dry season provides optimal waterhole game viewing)",
  },
  galle: {
    id: "dest-galle",
    name: "Galle Dutch Fort",
    slug: "galle",
    shortDesc: "17th-century oceanfront ramparts, cobblestone alleys, Dutch colonial architecture, boutique villas, and tropical coastal charm.",
    longDesc: "Built by Portuguese and Dutch colonizers between the 16th and 17th centuries, Galle Fort is Asia's best-preserved fortified sea bastion. Stroll past whitewashed ramparts, colonial clock towers, spice merchants, and charming seaside gelato parlors.",
    image: "https://images.unsplash.com/photo-1566296566002-390b1062b186?q=80&w=1200&auto=format&fit=crop",
    popularAttractions: "Galle Lighthouse, Dutch Reformed Church, Sea Wall Ramparts, Maritime Museum, Unawatuna Beach",
    bestTimeToVisit: "November to April (Calm seas and warm golden sunshine)",
  }
};

export default async function DestinationPage({ params }: { params: { slug: string } }) {
  let dest: any = null;
  try {
    dest = await prisma.destination.findUnique({
      where: { slug: params.slug },
      include: {
        tours: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
    });
  } catch (e) {
    console.error("Prisma destination lookup error", e);
  }

  if (!dest) {
    dest = FALLBACK_DESTINATIONS[params.slug] || FALLBACK_DESTINATIONS["sigiriya"];
    if (!dest && !FALLBACK_DESTINATIONS[params.slug]) {
      notFound();
    }
  }

  const tours = (dest.tours || []).map((t: any) => ({
    id: t.id,
    title: t.title,
    slug: t.slug,
    location: t.location,
    duration: t.duration,
    rating: t.rating,
    reviewCount: t.reviewCount,
    price: t.price,
    previousPrice: t.previousPrice,
    tourType: t.tourType,
    badge: t.badge,
    freeCancellation: t.freeCancellation,
    instantBook: t.instantBook,
    primaryImage: t.images?.[0]?.url || dest.image,
  }));

  const attractions = (dest.popularAttractions || "").split(",");

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl flex items-end p-8 sm:p-12">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy via-ceylon-navy/40 to-transparent" />
        <div className="relative z-10 space-y-3 max-w-2xl text-white">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <MapPin className="w-4 h-4" />
            <span>Sri Lanka Destination Guide</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {dest.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {dest.shortDesc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-extrabold text-ceylon-navy tracking-tight">
            About {dest.name}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {dest.longDesc}
          </p>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-ceylon-navy">
              Must-Visit Attractions in {dest.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {attractions.map((att: string, i: number) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 bg-ceylon-softblue text-ceylon-navy font-bold text-xs rounded-xl border border-ceylon-blue/20"
                >
                  {att.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
            <h3 className="font-extrabold text-base text-ceylon-navy">Traveler Tips</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-ceylon-navy font-bold">
                <Calendar className="w-4 h-4 text-ceylon-blue" />
                <span>Best Time to Visit:</span>
              </div>
              <p className="text-slate-600 pl-6">{dest.bestTimeToVisit}</p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/plan-my-trip"
                className="w-full py-3 bg-ceylon-green hover:bg-ceylon-darkgreen text-white font-extrabold text-xs rounded-xl transition-colors block text-center"
              >
                Include {dest.name} in Custom Itinerary
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-200">
        <h2 className="text-2xl font-extrabold text-ceylon-navy tracking-tight">
          Top Experiences in {dest.name} ({tours.length})
        </h2>
        {tours.length === 0 ? (
          <p className="text-xs text-ceylon-muted">
            No specific tours listed right now. Custom private transport available via Trip Planner.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t: any) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
