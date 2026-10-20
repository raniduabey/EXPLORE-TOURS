import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Clock, ArrowRight } from "lucide-react";
import { syncBlogWithDb, getAllStoredBlogPosts } from "@/lib/blogStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    image: "/images/destinations/sigiriya.jpg"
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
    image: "/images/destinations/ella.jpg"
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
    image: "/images/destinations/yala.jpg"
  }
];

export default async function BlogPage() {
  try {
    await syncBlogWithDb(prisma);
  } catch (syncErr) {
    console.warn("syncBlogWithDb warning in /blog:", syncErr);
  }

  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
  } catch (e) {
    console.error("Prisma error fetching blog posts:", e);
  }

  if (!posts || posts.length === 0) {
    const stored = await getAllStoredBlogPosts().catch(() => []);
    if (stored && stored.length > 0) {
      posts = stored.filter((p) => p.status === "PUBLISHED");
    }
  }

  if (!posts || posts.length === 0) {
    posts = FALLBACK_POSTS;
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F0ECE4]/60 text-[#15392D] p-6 sm:p-12 shadow-sm border border-[#E7E2D8] space-y-3">
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A46B] block">
            Editorial Travel Hub
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#15392D] break-words">
            Sri Lanka Travel Guide & Inspiration
          </h1>
          <p className="text-sm sm:text-base text-[#59645E] max-w-xl font-light leading-relaxed">
            Discover insider tips, destination highlights, local food guides, and travel itineraries written by local Sri Lankan travel experts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(21,57,45,0.05)] hover:shadow-[0_20px_40px_rgba(21,57,45,0.1)] border border-[#E7E2D8] hover:border-[#C5A46B]/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-52 w-full overflow-hidden bg-[#F0ECE4]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#15392D] text-[#C5A46B] text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-[#C5A46B]/30">
                  {post.category}
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#59645E]">
                  <Clock className="w-3.5 h-3.5 text-[#C5A46B]" />
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h3 className="font-serif font-medium text-lg text-[#15392D] group-hover:text-[#C5A46B] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-[#59645E] line-clamp-3 leading-relaxed font-light">
                  {post.excerpt}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 text-xs font-sans font-medium text-[#15392D] group-hover:text-[#C5A46B] flex items-center gap-1.5 uppercase tracking-wider transition-colors">
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4 text-[#C5A46B] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
