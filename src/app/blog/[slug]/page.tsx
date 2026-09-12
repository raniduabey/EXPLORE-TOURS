import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ArrowLeft, Clock, User } from "lucide-react";

export const revalidate = 60;

const FALLBACK_POSTS: Record<string, any> = {
  "ultimate-10-day-sri-lanka-itinerary": {
    id: "post-1",
    title: "The Ultimate 10-Day Sri Lanka Itinerary for First-Time Visitors",
    slug: "ultimate-10-day-sri-lanka-itinerary",
    excerpt: "From the ancient citadel of Sigiriya and scenic tea country trains to Yala leopard safaris and southern coast beaches, discover the perfect balanced route.",
    category: "Itineraries",
    author: "Nalaka Perera",
    readTime: "7 Min Read",
    publishedAt: new Date("2026-08-15"),
    image: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1200&auto=format&fit=crop"
  },
  "kandy-to-ella-train-guide": {
    id: "post-2",
    title: "Everything You Need to Know About the Kandy to Ella Scenic Train",
    slug: "kandy-to-ella-train-guide",
    excerpt: "Booking first class vs second class reserved seats, optimal sides of the train for photography, and essential timetable guidance for 2026.",
    category: "Travel Guides",
    author: "Duminda Silva",
    readTime: "5 Min Read",
    publishedAt: new Date("2026-08-20"),
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop"
  },
  "yala-safari-leopard-guide": {
    id: "post-3",
    title: "Yala Safari Guide: Best Months for Leopard Sightings & Jeep Etiquette",
    slug: "yala-safari-leopard-guide",
    excerpt: "Maximize your chances of spotting the elusive Panthera pardus kotiya with insider guidance from SLTDA certified naturalists.",
    category: "Wildlife",
    author: "Pradeep Jayasuriya",
    readTime: "6 Min Read",
    publishedAt: new Date("2026-08-24"),
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop"
  }
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post: any = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });
  } catch (e) {
    console.error("Error finding post", e);
  }

  if (!post) {
    post = FALLBACK_POSTS[params.slug];
    if (!post) {
      post = FALLBACK_POSTS["ultimate-10-day-sri-lanka-itinerary"];
    }
  }

  return (
    <article className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-xs font-bold text-ceylon-blue hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Travel Guides</span>
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-ceylon-softblue text-ceylon-blue font-extrabold text-[10px] uppercase rounded-md">
            {post.category}
          </span>
          <span className="text-xs text-ceylon-muted">•</span>
          <div className="flex items-center gap-1 text-xs text-ceylon-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ceylon-navy tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between border-y border-slate-200 py-3 text-xs text-ceylon-muted">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-ceylon-blue" />
            <span>
              By <strong className="text-ceylon-navy">{post.author}</strong>
            </span>
          </div>
          <span>
            Published {new Date(post.publishedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
        <p className="font-semibold text-ceylon-navy text-lg">{post.excerpt}</p>
        <p>
          Sri Lanka is an extraordinary tropical paradise offering an unmatched blend of rich Buddhist heritage, lush tea mountain scenery, wild safari parks, and world-class surfing beaches.
        </p>
        <p>
          Whether you choose to climb the ancient 5th-century Sigiriya Rock Fortress at sunrise, take the legendary blue train from Kandy to Ella through tea plantations, or track leopards in Yala, early planning ensures guaranteed tickets and private AC vehicle comfort.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-ceylon-softblue/80 border border-ceylon-blue/20 text-center space-y-3">
        <h3 className="font-extrabold text-base text-ceylon-navy">
          Ready to Experience This in Person?
        </h3>
        <p className="text-xs text-ceylon-muted">
          Book verified tours with instant vouchers or customize your island itinerary.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/tours"
            className="px-5 py-2.5 bg-ceylon-navy text-white text-xs font-bold rounded-xl"
          >
            Browse Experiences
          </Link>
          <Link
            href="/plan-my-trip"
            className="px-5 py-2.5 bg-ceylon-green text-white text-xs font-bold rounded-xl"
          >
            Plan My Trip
          </Link>
        </div>
      </div>
    </article>
  );
}
