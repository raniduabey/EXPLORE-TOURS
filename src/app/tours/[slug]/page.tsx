import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ImageGallery } from "@/components/tour-detail/ImageGallery";
import { BookingWidget } from "@/components/tour-detail/BookingWidget";
import { ItineraryTimeline } from "@/components/tour-detail/ItineraryTimeline";
import { ReviewsBreakdown } from "@/components/tour-detail/ReviewsBreakdown";
import { TourCard } from "@/components/tours/TourCard";
import {
  Star,
  ShieldCheck,
  Clock,
  Users,
  Languages,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from "lucide-react";

export const revalidate = 60;

const FALLBACK_DETAIL = {
  id: "tour-sigiriya",
  title: "Sigiriya Rock Fortress & Dambulla Cave Temple Day Tour",
  slug: "sigiriya-rock-fortress-dambulla-day-tour",
  location: "Sigiriya & Dambulla",
  duration: "10 Hours",
  rating: 4.95,
  reviewCount: 342,
  bookedCount: 520,
  tourType: "Private Tour",
  liveGuide: "English & German",
  price: 85,
  previousPrice: 110,
  freeCancellation: true,
  instantBook: true,
  description: "Climb the UNESCO World Heritage Lion Rock Citadel built by King Kashyapa in the 5th century AD. Marvel at the ancient frescoes, mirror wall, and hydraulic water gardens. In the afternoon, explore the 2,000-year-old Dambulla Golden Cave Temple monasteries with 150+ gilded Buddha statues.\n\nIncludes private pickup from your Colombo/Kandy hotel in an air-conditioned car with a certified English-speaking chauffeur guide.",
  importantInfo: "Wear comfortable walking shoes with good grip. Bring sun protection and modest attire covering shoulders and knees when visiting the sacred Dambulla Cave Temples.",
  whatToBring: "Hat, sunglasses, sunscreen, walking shoes, modest temple clothing, camera.",
  highlights: JSON.stringify([
    "Ascend the dramatic 200-meter monolith of Sigiriya Lion Rock",
    "View the world-famous 5th-century Sigiriya Maiden frescoes",
    "Tour the 5 sacred cave sanctuaries of Dambulla with golden Buddhas",
    "Authentic Sri Lankan village buffet lunch served in clay pots",
    "Private air-conditioned chauffeur roundtrip hotel transport"
  ]),
  includes: JSON.stringify([
    "Private AC car / minivan with fuel and highway tolls",
    "Certified English-speaking Sri Lankan tour guide / chauffeur",
    "Traditional Sri Lankan village buffet lunch with fresh fruit",
    "Bottled mineral water and King Coconut refreshment",
    "Hotel pickup and drop-off in Colombo, Negombo, or Kandy"
  ]),
  excludes: JSON.stringify([
    "Sigiriya entrance ticket ($36 USD per person)",
    "Dambulla Cave entrance ticket ($10 USD per person)",
    "Personal gratuities & driver tips (optional)"
  ]),
  images: [
    { id: "img1", url: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1200&auto=format&fit=crop", caption: "Sigiriya Ancient Citadel", isPrimary: true },
    { id: "img2", url: "https://images.unsplash.com/photo-1566296566002-390b1062b186?q=80&w=1200&auto=format&fit=crop", caption: "Cultural Heritage", isPrimary: false },
    { id: "img3", url: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop", caption: "Scenic Landscapes", isPrimary: false },
    { id: "img4", url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop", caption: "Wild Sri Lanka", isPrimary: false }
  ],
  itinerary: [
    { id: "it1", stepNumber: 1, title: "Hotel Pickup & Scenic Countryside Drive", duration: "2.5 Hours", location: "En route", description: "Meet your private chauffeur at your hotel lobby. Enjoy scenic views of rural Sri Lanka, coconut plantations, and paddy fields." },
    { id: "it2", stepNumber: 2, title: "Sigiriya Lion Rock Fortress Ascent", duration: "3 Hours", location: "Sigiriya", description: "Ascend through the water gardens, admire the ancient frescoes, walk through the massive lion paws, and take in panoramic summit views." },
    { id: "it3", stepNumber: 3, title: "Authentic Village Lunch & Cooking Demo", duration: "1.5 Hours", location: "Hiriwadunna", description: "Enjoy a traditional Sri Lankan rice & curry feast cooked in clay pots over wood fires, with fresh lake fish and coconut sambal." },
    { id: "it4", stepNumber: 4, title: "Dambulla Royal Cave Temple", duration: "2 Hours", location: "Dambulla", description: "Explore the ancient Buddhist cave temples carved into the rock, adorned with intricate ceiling murals and golden statues." },
    { id: "it5", stepNumber: 5, title: "Comfortable Return Hotel Transfer", duration: "2.5 Hours", location: "Return Journey", description: "Relax on your air-conditioned return journey back to your hotel with a stop for fresh King Coconut water." }
  ],
  reviews: [
    { id: "rev1", userName: "Marcus Vance", userCountry: "United Kingdom", travelDate: "August 2026", rating: 5, comment: "An absolutely breathtaking experience. Climbing Sigiriya at sunrise was unforgettable and our guide Nalaka was knowledgeable and accommodating." },
    { id: "rev2", userName: "Elena Rostova", userCountry: "Germany", travelDate: "July 2026", rating: 5, comment: "Superb day trip! The private car was clean and comfortable, and the local village lunch was the best meal we had in Sri Lanka." },
    { id: "rev3", userName: "David & Sarah Chen", userCountry: "Australia", travelDate: "July 2026", rating: 5, comment: "Seamless booking with instant voucher confirmation. Everything promised was delivered to the highest standard." }
  ],
  destination: { name: "Sigiriya & Cultural Triangle" },
  category: { name: "Cultural Heritage" }
};

export default async function TourDetailPage({ params }: { params: { slug: string } }) {
  let tour: any = null;
  try {
    tour = await prisma.tour.findUnique({
      where: { slug: params.slug },
      include: {
        images: true,
        itinerary: { orderBy: { stepNumber: "asc" } },
        reviews: { orderBy: { createdAt: "desc" } },
        destination: true,
        category: true,
      },
    });
  } catch (e) {
    console.error("Prisma error in tour detail:", e);
  }

  if (!tour) {
    if (params.slug.includes("sigiriya") || params.slug === "kandy-to-ella-scenic-train-journey" || params.slug === "yala-national-park-safari" || params.slug === "galle-fort-walking-tour" || params.slug === "mirissa-whale-watching" || params.slug === "nuwara-eliya-tea-trail") {
      tour = {
        ...FALLBACK_DETAIL,
        title: params.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        slug: params.slug,
      };
    } else {
      notFound();
    }
  }

  let otherTours: any[] = [];
  try {
    const rawOthers = await prisma.tour.findMany({
      where: { id: { not: tour.id } },
      take: 3,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
    });
    otherTours = rawOthers.map((t: any) => ({
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
      primaryImage: t.images[0]?.url || "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=800&auto=format&fit=crop",
    }));
  } catch (e) {
    otherTours = [
      {
        id: "tour-ella",
        title: "Kandy to Ella Scenic Blue Train & Tea Country Trek",
        slug: "kandy-to-ella-scenic-train-journey",
        location: "Ella & Highlands",
        duration: "1 Day",
        rating: 4.98,
        reviewCount: 420,
        price: 65,
        previousPrice: 85,
        tourType: "Small Group",
        badge: "Iconic Experience",
        freeCancellation: true,
        instantBook: true,
        primaryImage: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: "tour-yala",
        title: "Yala National Park Leopard Safari in 4x4 Jeep",
        slug: "yala-national-park-safari",
        location: "Yala National Park",
        duration: "6 Hours",
        rating: 4.91,
        reviewCount: 285,
        price: 95,
        previousPrice: 125,
        tourType: "Private Safari",
        badge: "Wild Ceylon",
        freeCancellation: true,
        instantBook: true,
        primaryImage: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1000&auto=format&fit=crop"
      }
    ];
  }

  const highlights: string[] = tour.highlights ? (typeof tour.highlights === "string" ? JSON.parse(tour.highlights) : tour.highlights) : [];
  const includes: string[] = tour.includes ? (typeof tour.includes === "string" ? JSON.parse(tour.includes) : tour.includes) : [];
  const excludes: string[] = tour.excludes ? (typeof tour.excludes === "string" ? JSON.parse(tour.excludes) : tour.excludes) : [];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-ceylon-muted">
          <span className="font-semibold text-ceylon-blue">
            {tour.destination?.name || tour.location}
          </span>
          <span>/</span>
          <span>{tour.category?.name || "Tours"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ceylon-navy tracking-tight leading-tight">
          {tour.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-extrabold text-ceylon-navy ml-1">
              {tour.rating.toFixed(1)}
            </span>
            <span className="text-ceylon-muted ml-1">
              ({tour.reviewCount} reviews)
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-ceylon-navy font-semibold">
            {tour.bookedCount}+ Travellers Booked
          </span>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Experience</span>
          </div>
        </div>
      </div>

      <ImageGallery images={tour.images || []} title={tour.title} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-ceylon-blue" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
            <span className="text-xs font-bold text-ceylon-navy">{tour.duration}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-ceylon-blue" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Tour Type</span>
            <span className="text-xs font-bold text-ceylon-navy">{tour.tourType}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Languages className="w-5 h-5 text-ceylon-blue" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Live Guide</span>
            <span className="text-xs font-bold text-ceylon-navy">{tour.liveGuide || "English"}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-ceylon-green" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Cancellation</span>
            <span className="text-xs font-bold text-ceylon-green">Free up to 24h</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-ceylon-navy tracking-tight">Overview</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
              {tour.description}
            </p>
          </div>

          {highlights.length > 0 && (
            <div className="space-y-4 bg-ceylon-softblue/60 p-6 rounded-3xl border border-ceylon-blue/20">
              <h3 className="text-lg font-extrabold text-ceylon-navy tracking-tight">
                Experience Highlights
              </h3>
              <ul className="space-y-2.5">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs font-semibold text-ceylon-navy">
                    <CheckCircle className="w-4 h-4 text-ceylon-green shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ItineraryTimeline items={tour.itinerary || []} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="font-extrabold text-sm text-ceylon-navy flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-ceylon-green" />
                What\'s Included
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {includes.map((inc, i) => (
                  <li key={i}>• {inc}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="font-extrabold text-sm text-ceylon-navy flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                What\'s Excluded
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {excludes.map((exc, i) => (
                  <li key={i}>• {exc}</li>
                ))}
              </ul>
            </div>
          </div>

          {tour.importantInfo && (
            <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/60 space-y-2 text-xs text-amber-900">
              <h4 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-950">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Important Information & What to Bring
              </h4>
              <p className="leading-relaxed">{tour.importantInfo}</p>
              {tour.whatToBring && (
                <p className="font-semibold pt-1">What to bring: {tour.whatToBring}</p>
              )}
            </div>
          )}

          <ReviewsBreakdown
            rating={tour.rating}
            reviewCount={tour.reviewCount}
            reviews={tour.reviews || []}
          />
        </div>

        <div className="lg:col-span-1">
          <BookingWidget
            tourId={tour.id}
            tourTitle={tour.title}
            tourSlug={tour.slug}
            tourImage={
              tour.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=800&auto=format&fit=crop"
            }
            location={tour.location}
            price={tour.price}
            previousPrice={tour.previousPrice}
          />
        </div>
      </div>

      <div className="pt-12 border-t border-slate-200 space-y-6">
        <h3 className="text-2xl font-extrabold text-ceylon-navy tracking-tight">
          You May Also Like
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherTours.map((t) => (
            <TourCard key={t.id} tour={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
