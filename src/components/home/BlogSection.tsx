"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

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
    slug: "essential-tips-climbing-sigiriya-rock",
    excerpt: "Everything about ticket prices, morning sunrise climbs, stairs, hornets, and camera gear advice.",
    image: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=800&auto=format&fit=crop",
    category: "Travel Guide",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "How to Secure Scenic Train Tickets from Kandy to Ella",
    slug: "kandy-to-ella-train-ticket-guide",
    excerpt: "The ultimate guide to first, second, and third-class reserved seats on the iconic blue hill country railway.",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop",
    category: "Train Guide",
    readTime: "6 min read"
  },
  {
    id: "3",
    title: "The Best Time of Year for Wildlife Safaris in Yala & Udawalawe",
    slug: "best-time-wildlife-safari-yala",
    excerpt: "Seasonal wildlife migration, leopard sighting spots, waterhole activity, and choosing open-top 4x4 safaris.",
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=800&auto=format&fit=crop",
    category: "Wildlife",
    readTime: "4 min read"
  }
];

export const BlogSection: React.FC<{ posts?: BlogPostItem[] }> = ({ posts: propPosts }) => {
  const list = propPosts && propPosts.length > 0 ? propPosts : defaultPosts;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold text-ceylon-green uppercase tracking-wider block mb-1">
            Sri Lanka Travel Guide
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ceylon-navy tracking-tight">
            Sri Lanka Travel Inspiration
          </h2>
          <p className="text-sm text-ceylon-muted mt-2 max-w-xl">
            Expert itineraries, local insider tips, and destination guides to help you plan the trip of a lifetime.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ceylon-blue hover:text-ceylon-navy transition-colors self-start md:self-auto"
        >
          <span>Read All Travel Guides</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {list.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-slate-100 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-ceylon-navy text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {post.category}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-1 text-[11px] text-ceylon-muted">
                  <Clock className="w-3.5 h-3.5 text-ceylon-blue" />
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-extrabold text-base text-ceylon-navy group-hover:text-ceylon-blue transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-ceylon-muted line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-2 text-xs font-bold text-ceylon-blue flex items-center gap-1">
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
