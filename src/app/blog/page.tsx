import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Clock, ArrowRight } from "lucide-react";

export const revalidate = 60;

const FALLBACK_POSTS = [
  {
    id: "post-1",
    title: "The Ultimate 10-Day Sri Lanka Itinerary for First-Time Visitors",
    slug: "ultimate-10-day-sri-lanka-itinerary",
    excerpt: "From the ancient citadel of Sigiriya and scenic tea country trains to Yala leopard safaris and southern coast beaches, discover the perfect balanced route.",
    category: "Itineraries",
    author: "Nalaka Perera",
    readTime: "7 Min Read",
    publishedAt: new Date("2026-08-15"),
    image: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "post-2",
    title: "Everything You Need to Know About the Kandy to Ella Scenic Train",
    slug: "kandy-to-ella-train-guide",
    excerpt: "Booking first class vs second class reserved seats, optimal sides of the train for photography, and essential timetable guidance for 2026.",
    category: "Travel Guides",
    author: "Duminda Silva",
    readTime: "5 Min Read",
    publishedAt: new Date("2026-08-20"),
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "post-3",
    title: "Yala Safari Guide: Best Months for Leopard Sightings & Jeep Etiquette",
    slug: "yala-safari-leopard-guide",
    excerpt: "Maximize your chances of spotting the elusive Panthera pardus kotiya with insider guidance from SLTDA certified naturalists.",
    category: "Wildlife",
    author: "Pradeep Jayasuriya",
    readTime: "6 Min Read",
    publishedAt: new Date("2026-08-24"),
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1000&auto=format&fit=crop"
  }
];

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });
  } catch (e) {
    console.error("Prisma error fetching blog posts:", e);
  }

  if (!posts || posts.length === 0) {
    posts = FALLBACK_POSTS;
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="bg-ceylon-navy rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl space-y-3">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
          Editorial Travel Hub
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Sri Lanka Travel Guide & Inspiration
        </h1>
        <p className="text-sm text-slate-300 max-w-xl">
          Discover insider tips, destination highlights, local food guides, and travel itineraries written by local Sri Lankan travel experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-slate-200/80 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-ceylon-navy text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-md">
                  {post.category}
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-ceylon-muted">
                  <Clock className="w-3.5 h-3.5 text-ceylon-blue" />
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h3 className="font-extrabold text-lg text-ceylon-navy group-hover:text-ceylon-blue transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-ceylon-muted line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 text-xs font-bold text-ceylon-blue flex items-center gap-1.5">
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
