import React from "react";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { DestinationGrid } from "@/components/home/DestinationGrid";
import { TopExperiences } from "@/components/home/TopExperiences";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { WhyUs } from "@/components/home/WhyUs";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { Newsletter } from "@/components/home/Newsletter";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export default async function HomePage() {
  let destinations: any[] = [];
  let tours: any[] = [];
  let blogPosts: any[] = [];

  try {
    destinations = await prisma.destination.findMany({
      where: { featured: true },
      take: 8
    });
  } catch (e) {
    // fallback gracefully
  }

  try {
    const rawTours = await prisma.tour.findMany({
      where: { featured: true },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 6
    });
    tours = rawTours.map((t) => ({
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
      primaryImage: t.images[0]?.url || "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=800&auto=format&fit=crop"
    }));
  } catch (e) {
    // fallback gracefully
  }

  try {
    blogPosts = await prisma.blogPost.findMany({
      where: { featured: true },
      take: 3
    });
  } catch (e) {
    // fallback gracefully
  }

  return (
    <div className="space-y-6">
      <Hero />
      <TrustBar />
      <DestinationGrid destinations={destinations} />
      <TopExperiences tours={tours} />
      <CategoryGrid />
      <EditorialBanner />
      <WhyUs />
      <ReviewsSection />
      <BlogSection posts={blogPosts} />
      <Newsletter />
    </div>
  );
}
