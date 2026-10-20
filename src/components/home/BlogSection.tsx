"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
}

const defaultPosts: BlogPostItem[] = [
  {
    id: "1",
    title: "10 Essential Things to Know Before Climbing Sigiriya Lion Rock",
    slug: "ultimate-10-day-sri-lanka-itinerary",
    excerpt: "Everything about ticket prices, morning sunrise climbs, stairs, hornets, and camera gear advice.",
    image: "/images/destinations/sigiriya.jpg",
    category: "Travel Guide",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "How to Secure Scenic Train Tickets from Kandy to Ella",
    slug: "kandy-to-ella-train-guide",
    excerpt: "The ultimate guide to first, second, and third-class reserved seats on the iconic blue hill country railway.",
    image: "/images/destinations/ella.jpg",
    category: "Train Guide",
    readTime: "6 min read"
  },
  {
    id: "3",
    title: "The Best Time of Year for Wildlife Safaris in Yala & Udawalawe",
    slug: "yala-safari-leopard-guide",
    excerpt: "Seasonal wildlife migration, leopard sighting spots, waterhole activity, and choosing open-top 4x4 safaris.",
    image: "/images/destinations/yala.jpg",
    category: "Wildlife",
    readTime: "4 min read"
  }
];

export const BlogSection: React.FC<{ posts?: BlogPostItem[] }> = ({ posts: propPosts }) => {
  const list = propPosts && propPosts.length > 0 ? propPosts : defaultPosts;

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-[1248px] mx-auto">
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15392D]/5 text-[#C5A46B] text-[10px] font-mono uppercase tracking-[0.25em] border border-[#C5A46B]/30 mb-3">
            <span>The Ceylon Journal</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#15392D] tracking-tight">
            Stories & Island Insights
          </h2>
          <p className="text-sm sm:text-base text-[#59645E] font-sans font-normal mt-2 max-w-xl leading-relaxed">
            Curated field notes, rail guides, and heritage narratives written by our local curators.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#15392D] hover:text-[#C5A46B] transition-colors self-start md:self-auto"
        >
          <span>Read All Field Notes</span>
          <ArrowRight className="w-4 h-4 text-[#C5A46B]" />
        </Link>
      </FadeIn>

      <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-6 lg:gap-y-7 justify-items-center justify-center max-w-[1248px] mx-auto">
        {list.map((post) => (
          <FadeInStaggerItem key={post.id} className="w-full flex justify-center">
            <Link
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl sm:rounded-3xl lg:rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(21,57,45,0.05)] hover:shadow-[0_20px_40px_rgba(21,57,45,0.12)] border border-[#E7E2D8] hover:border-[#C5A46B]/50 transition-all duration-300 flex flex-col justify-between h-full w-full max-w-[400px] mx-auto"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-[#F0ECE4]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-[#15392D]/90 text-[#C5A46B] border border-[#C5A46B]/30 backdrop-blur-md text-[10px] font-sans font-medium uppercase tracking-[0.16em] px-3 py-1 rounded-full shadow-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#59645E] font-sans">
                    <Clock className="w-3.5 h-3.5 text-[#C5A46B]" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-serif font-medium text-lg text-[#15392D] group-hover:text-[#C5A46B] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#59645E] font-sans font-normal line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 text-xs font-sans font-semibold text-[#15392D] group-hover:text-[#C5A46B] flex items-center gap-1.5 uppercase tracking-wider transition-colors">
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A46B] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>
    </section>
  );
};
