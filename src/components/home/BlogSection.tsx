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
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-forest/5 text-luxury-gold text-[10px] font-mono uppercase tracking-[0.25em] border border-luxury-gold/30 mb-3">
            <span>The Ceylon Journal</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight">
            Stories & Island Insights
          </h2>
          <p className="text-sm sm:text-base text-luxury-charcoal/70 font-light mt-2 max-w-xl leading-relaxed">
            Curated field notes, rail guides, and heritage narratives written by our local curators.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-medium uppercase tracking-wider text-luxury-forest hover:text-luxury-gold transition-colors self-start md:self-auto"
        >
          <span>Read All Field Notes</span>
          <ArrowRight className="w-4 h-4 text-luxury-gold" />
        </Link>
      </FadeIn>

      <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
        {list.map((post) => (
          <FadeInStaggerItem key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(16,45,36,0.06)] hover:shadow-[0_20px_40px_rgba(16,45,36,0.12)] border border-luxury-sand/80 hover:border-luxury-gold/50 transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-luxury-forest/90 text-luxury-gold border border-luxury-gold/30 backdrop-blur-md text-[9px] font-mono uppercase tracking-[0.18em] px-3 py-1 rounded-full shadow-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-luxury-charcoal/60 font-sans">
                    <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-serif font-medium text-lg text-luxury-forest group-hover:text-luxury-gold transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-luxury-charcoal/70 font-light line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 text-xs font-sans font-medium text-luxury-forest group-hover:text-luxury-gold flex items-center gap-1.5 uppercase tracking-wider transition-colors">
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5 text-luxury-gold group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>
    </section>
  );
};
