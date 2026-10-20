import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Sparkles,
  Train,
  CheckCircle2,
  Compass,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const revalidate = 60;

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: Date;
  image: string;
  contentHtml?: string;
}

const FALLBACK_POSTS: Record<string, BlogPostData> = {
  "kandy-to-ella-train-guide": {
    id: "post-2",
    title: "Everything You Need to Know About the Kandy to Ella Scenic Train",
    slug: "kandy-to-ella-train-guide",
    excerpt:
      "A comprehensive master guide to Sri Lanka's world-famous blue train: 30-day ticket booking rules, 1st vs 2nd class reserved seats, scenic photography vantage points, and essential chauffeur luggage logistics for 2026.",
    category: "Travel Guides",
    author: "Duminda Silva",
    readTime: "8 Min Read",
    publishedAt: new Date("2026-08-20"),
    image: "/images/destinations/ella.jpg",
  },
  "ultimate-10-day-sri-lanka-itinerary": {
    id: "post-1",
    title: "The Ultimate 10-Day Sri Lanka Itinerary for First-Time Visitors",
    slug: "ultimate-10-day-sri-lanka-itinerary",
    excerpt:
      "From the ancient UNESCO citadel of Sigiriya and scenic tea country trains to Yala leopard safaris and southern coast beaches, discover the perfect balanced route.",
    category: "Itineraries",
    author: "Nalaka Perera",
    readTime: "7 Min Read",
    publishedAt: new Date("2026-08-15"),
    image: "/images/destinations/sigiriya.jpg",
  },
  "yala-safari-leopard-guide": {
    id: "post-3",
    title: "Yala Safari Guide: Best Months for Leopard Sightings & Jeep Etiquette",
    slug: "yala-safari-leopard-guide",
    excerpt:
      "Maximize your chances of spotting the elusive Panthera pardus kotiya with insider guidance from SLTDA certified naturalists, optimal block zones, and dawn tracking advice.",
    category: "Wildlife",
    author: "Pradeep Jayasuriya",
    readTime: "6 Min Read",
    publishedAt: new Date("2026-08-24"),
    image: "/images/destinations/yala.jpg",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = FALLBACK_POSTS[params.slug];
  if (!post) {
    return {
      title: `Travel Guide | ${siteConfig.name}`,
    };
  }
  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | ${siteConfig.name}`,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  let post: any = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });
  } catch (e) {
    console.error("Error finding post in Prisma", e);
  }

  if (!post) {
    post = FALLBACK_POSTS[params.slug];
    if (!post) {
      notFound();
    }
  }

  const isKandyElla = params.slug === "kandy-to-ella-train-guide";
  const isYala = params.slug === "yala-safari-leopard-guide";
  const is10Day = params.slug === "ultimate-10-day-sri-lanka-itinerary";

  return (
    <article className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-sans font-medium uppercase tracking-wider text-luxury-forest hover:text-luxury-gold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-luxury-gold" />
        <span>Return to Island Travel Guides</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-luxury-gold/15 text-luxury-forest border border-luxury-gold/30">
            {post.category}
          </span>
          <span className="text-xs text-luxury-sand">•</span>
          <div className="flex items-center gap-1 text-xs text-luxury-charcoal/70">
            <Clock className="w-3.5 h-3.5 text-luxury-gold" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between border-y border-luxury-sand/80 py-3 text-xs text-luxury-charcoal/70 font-sans">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-luxury-gold" />
            <span>
              By <strong className="text-luxury-forest font-medium">{post.author}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
            <span>
              Published {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[320px] sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-luxury-sand/80">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Lead Excerpt */}
      <div className="bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-luxury-sand/80 shadow-xs">
        <p className="font-serif text-lg sm:text-xl text-luxury-forest font-normal leading-relaxed italic">
          &ldquo;{post.excerpt}&rdquo;
        </p>
      </div>

      {/* Structured In-Depth Content */}
      {isKandyElla ? (
        <div className="prose prose-slate max-w-none text-luxury-charcoal/85 leading-relaxed text-sm sm:text-base space-y-8 font-light">
          {/* Section 1: Introduction */}
          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-forest tracking-tight">
              An Iconic Journey Through the Clouds
            </h2>
            <p>
              Originally constructed by the British colonial government in the 1860s to transport aromatic Ceylon tea from remote mountain plantations down to the port of Colombo, the railway line winding from <strong>Kandy to Ella</strong> is internationally celebrated as one of the most sublime and dramatic train journeys on Earth.
            </p>
            <p>
              Over the course of the voyage, the vintage blue locomotive ascends from the tropical heat of Kandy (500 meters above sea level) into the mist-shrouded, emerald-green peaks of the Central Highlands, topping out near 1,897 meters at Pattipola before gently descending into the idyllic mountain village of Ella.
            </p>
          </div>

          {/* Section 2: Ticket Booking & 30-Day Window */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-luxury-sand/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-luxury-forest">
              <Train className="w-5 h-5 text-luxury-gold shrink-0" />
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-luxury-forest">
                1. Ticket Booking: The Critical 30-Day Rule
              </h3>
            </div>
            <p className="text-sm">
              Securing reserved seats on the Kandy to Ella train is notoriously competitive. Sri Lanka Railways opens seat reservations strictly <strong>30 days in advance at 10:00 AM Sri Lanka Time (GMT+5:30)</strong>. During high season (December to April and July to August), ticket allocations often sell out in minutes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-luxury-sand/70 space-y-1.5">
                <span className="font-semibold text-luxury-forest block">Advance Reserved Tickets</span>
                <p className="text-luxury-charcoal/70">
                  Guarantees your assigned seat number and coach. Essential for couples, families, and luxury travellers seeking a seamless, relaxed experience.
                </p>
              </div>
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-luxury-sand/70 space-y-1.5">
                <span className="font-semibold text-rose-800 block">Unreserved Day Tickets</span>
                <p className="text-luxury-charcoal/70">
                  Sold on the day of departure with unlimited capacity. Frequently results in 6 hours of standing shoulder-to-shoulder in overcrowded aisles without views.
                </p>
              </div>
            </div>
            <div className="p-3.5 bg-luxury-gold/10 rounded-xl border border-luxury-gold/30 text-xs text-luxury-forest flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
              <span>
                <strong>Ceylon Explore Tours Advantage:</strong> Our private chauffeur circuit itineraries include advance concierge seat booking handled directly by our licensed ticketing staff 30 days prior to your travel date.
              </span>
            </div>
          </div>

          {/* Section 3: Seat Classes Compared */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-forest tracking-tight">
              2. Seat Classes: Which is Best for Photography?
            </h2>
            <p>
              The train offers three distinct travel classes. Choosing the right class depends on whether you prioritize air-conditioned silence or unobstructed open-window photography:
            </p>
            <div className="space-y-3 pt-1">
              <div className="p-5 rounded-2xl bg-white border border-luxury-sand/80 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-semibold text-luxury-forest">
                    Second Class Reserved (The Curator&apos;s Recommendation)
                  </h4>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Optimal Choice
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-luxury-charcoal/80">
                  Features comfortable individual cushioned seats with overhead luggage racks and ceiling fans. Crucially, the <strong>windows and carriage doors open freely</strong>, allowing you to lean gently toward the crisp mountain breeze and photograph the train curving through tea plantations without glass glare.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-luxury-sand/80 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-semibold text-luxury-forest">
                    First Class Air-Conditioned (Observation / Standard Car)
                  </h4>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-luxury-gold/15 text-luxury-forest border border-luxury-gold/30">
                    Enclosed Comfort
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-luxury-charcoal/80">
                  Offers modern, fully air-conditioned interiors with reclining plush seats and audio announcements. However, all large double-paned observation windows are sealed shut, which creates reflections and limits panoramic photography.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-luxury-sand/80 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-semibold text-luxury-forest">
                    Third Class Reserved
                  </h4>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Budget Option
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-luxury-charcoal/80">
                  Has identical open windows to Second Class, but seats are arranged in a firmer 3x2 configuration with narrower aisle space. A reliable backup if Second Class is booked out.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Route Options & Duration */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-forest tracking-tight">
              3. Route Planning: Full Route vs. Scenic Highlight Segment
            </h2>
            <p>
              You do not necessarily have to spend 7 continuous hours on the train to enjoy the best scenery. Depending on your holiday tempo, consider these two proven alternatives:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-luxury-sand/80 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-luxury-gold font-semibold block">
                  Option A • The Full Classic
                </span>
                <h4 className="font-serif text-lg font-normal text-luxury-forest">
                  Kandy to Ella (6.5 to 7 Hours)
                </h4>
                <p className="text-xs text-luxury-charcoal/75 leading-relaxed">
                  Departs Kandy or Peradeniya in the morning. Best for travelers who want the complete trans-highland rail immersion and don&apos;t mind a full day on the tracks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-luxury-sand/80 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-luxury-gold font-semibold block">
                  Option B • The Curator&apos;s Favourite
                </span>
                <h4 className="font-serif text-lg font-normal text-luxury-forest">
                  Nanu Oya (Nuwara Eliya) to Ella (3.5 to 4 Hours)
                </h4>
                <p className="text-xs text-luxury-charcoal/75 leading-relaxed">
                  Your chauffeur drives you from Kandy through Ramboda Falls to Nuwara Eliya for morning tea, then drops you at Nanu Oya station. You board the train for the absolute highest, most jaw-dropping section through tunnels, tea valleys, and across the Nine Arch Bridge into Ella.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Which Side to Sit On */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-forest tracking-tight">
              4. Which Side of the Train Offers the Best Views?
            </h2>
            <p>
              Because the railway twists along ridgelines, the optimum side of the carriage shifts mid-route:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <span>
                  <strong>From Kandy to Nanu Oya (Nuwara Eliya):</strong> Sit on the <strong>RIGHT side</strong> of the train to gaze into plunging river gorges, tumbling mountain cataracts, and the distant Seven Virgin peaks.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <span>
                  <strong>From Nanu Oya to Ella:</strong> Sit on the <strong>LEFT side</strong> of the train as it curves around the southern slopes of the mountain shelf, framing boundless emerald tea carpet valleys and the deep Ella Gap canyon.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 6: Practical Advice & Luggage Logistics */}
          <div className="bg-luxury-forest text-luxury-ivory p-6 sm:p-8 rounded-3xl border border-luxury-gold/30 space-y-4">
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-luxury-ivory">
              5. Practical Advice & Luggage Logistics
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-luxury-sand/85 font-light leading-relaxed">
              <p>
                <strong>Luggage Management:</strong> Train carriages have limited storage overhead, and maneuvering heavy 25kg suitcases through narrow gangways can be stressful. On our private Ceylon journeys, <strong>your private chauffeur carries all your heavy luggage in the air-conditioned vehicle directly to your Ella boutique hotel</strong>, leaving you to board the train unencumbered with just a daypack and camera.
              </p>
              <p>
                <strong>Elevation Temperature Drop:</strong> While Kandy is warm and tropical, the train climbs above 1,800m near Nuwara Eliya where temperatures can dip to 14°C (57°F). Always keep a light sweater or pashmina in your daypack.
              </p>
              <p>
                <strong>Local Snacks & Chai:</strong> At intermediate stops, local vendors board selling freshly fried dhal wade, spicy peanuts wrapped in newspaper cones, and hot spiced Ceylon milk tea. They are delightfully authentic and inexpensive (bring small Sri Lankan Rupee cash notes).
              </p>
            </div>
          </div>
        </div>
      ) : isYala ? (
        <div className="prose prose-slate max-w-none text-luxury-charcoal/85 leading-relaxed text-sm sm:text-base space-y-6 font-light">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-forest tracking-tight">
            Tracking the Ceylon Leopard in Yala National Park
          </h2>
          <p>
            Spanning over 978 square kilometers of thorn scrub forest, brackish lagoons, and coastal dunes on Sri Lanka&apos;s southeast fringe, <strong>Yala National Park</strong> boasts the highest known concentration of leopards (<em>Panthera pardus kotiya</em>) on planet Earth.
          </p>
          <p>
            To maximize your encounter, always opt for early morning (06:00 AM) or late afternoon (03:00 PM) private 4x4 safaris when apex predators descend from sun-baked granite boulders to drink at jungle waterholes.
          </p>
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-luxury-sand/80 space-y-3 text-xs sm:text-sm">
            <span className="font-semibold text-luxury-forest block uppercase tracking-wider text-[11px]">
              Key Safari Tips for Discerning Travellers:
            </span>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                <span>Book Block 1 for primary leopard densities; explore Block 5 for serene elephant herds and minimal jeep congestion.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                <span>Travel during the dry season between February and July when water levels recede, forcing wildlife to visible waterholes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                <span>Ensure your safari is conducted in a private modified Toyota Hilux with an SLTDA-certified wildlife driver who prioritizes animal welfare over aggressive chases.</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="prose prose-slate max-w-none text-luxury-charcoal/85 leading-relaxed text-sm sm:text-base space-y-6 font-light">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-forest tracking-tight">
            The Definitive 10-Day Route: Culture, Tea & Wildlife
          </h2>
          <p>
            For first-time visitors seeking an immaculate blend of UNESCO cultural monuments, cool mountain panoramas, private wildlife safaris, and tranquil golden beaches, this classic 10-day circuit represents the gold standard of Sri Lankan discovery:
          </p>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-white border border-luxury-sand/80">
              <strong className="text-luxury-forest block mb-1">Days 1–3: The Cultural Triangle & Sigiriya</strong>
              <span>Climb the 5th-century Sigiriya Rock Fortress at dawn, explore the gilded cave frescoes of Dambulla, and embark on a private jeep safari through Minneriya National Park to observe hundreds of wild elephants.</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-luxury-sand/80">
              <strong className="text-luxury-forest block mb-1">Days 4–5: Kandy & The Sacred Tooth Relic</strong>
              <span>Visit the Temple of the Sacred Tooth Relic, stroll the Royal Botanical Gardens of Peradeniya, and enjoy an evening cultural performance before resting in boutique hillside villas.</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-luxury-sand/80">
              <strong className="text-luxury-forest block mb-1">Days 6–7: Highland Tea Estates & Scenic Train to Ella</strong>
              <span>Board the legendary scenic train from Kandy into the misty tea country of Ella. Hike Little Adam&apos;s Peak and stand atop the Nine Arch Viaduct as the blue engine passes below.</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-luxury-sand/80">
              <strong className="text-luxury-forest block mb-1">Days 8–10: Yala Leopard Safaris & Galle Fort Coastline</strong>
              <span>Venture through Yala in open-top 4x4s in search of leopards and sloth bears, followed by relaxation along the southern beaches of Mirissa and a walking tour of the 17th-century Galle Dutch Fort.</span>
            </div>
          </div>
        </div>
      )}

      {/* Related Tour CTA Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-luxury-forest text-luxury-ivory border border-luxury-gold/30 text-center space-y-4 shadow-xl">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-luxury-gold block">
          Curated Ceylon Journeys
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-luxury-ivory max-w-xl mx-auto">
          Ready to Experience This Journey in Private Comfort?
        </h3>
        <p className="text-xs sm:text-sm text-luxury-sand/85 max-w-lg mx-auto font-light leading-relaxed">
          Explore our certified private chauffeur itineraries or collaborate directly with our travel designers for a bespoke tailored vacation.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/tours"
            className="px-7 py-3 bg-gradient-to-r from-[#DFBE82] via-[#C9A86A] to-[#A88647] hover:brightness-110 text-luxury-forest text-xs font-sans font-medium uppercase tracking-wider rounded-full shadow-lg transition-all"
          >
            Browse Itineraries
          </Link>
          <Link
            href="/plan-my-trip"
            className="px-7 py-3 bg-white/10 hover:bg-white/15 text-luxury-ivory border border-luxury-gold/40 text-xs font-sans font-medium uppercase tracking-wider rounded-full transition-all"
          >
            Design Custom Itinerary
          </Link>
        </div>
      </div>
    </article>
  );
}
