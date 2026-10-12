import React from "react";
import { HomeClientWrapper } from "@/components/home/HomeClientWrapper";
import { StatsCounter } from "@/components/home/StatsCounter";
import { RegionExplorer } from "@/components/home/RegionExplorer";
import { TopExperiences } from "@/components/home/TopExperiences";
import { SeasonMatrix } from "@/components/home/SeasonMatrix";
import { DestinationGrid } from "@/components/home/DestinationGrid";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { WhyUs } from "@/components/home/WhyUs";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { BlogSection } from "@/components/home/BlogSection";
import { Newsletter } from "@/components/home/Newsletter";
import prisma from "@/lib/prisma";
import { TOURS_CATALOG } from "@/data/toursData";

export const revalidate = 60;

export default async function HomePage() {
  let destinations: any[] = [];
  let tours: any[] = [];
  let blogPosts: any[] = [];

  try {
    destinations = await prisma.destination.findMany({
      where: { featured: true },
      take: 8,
    });
  } catch (e) {
    // fallback gracefully
  }

  try {
    const rawTours = await prisma.tour.findMany({
      where: { featured: true },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 8,
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
      primaryImage:
        t.images[0]?.url ||
        "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=800&auto=format&fit=crop",
    }));
  } catch (e) {
    // fallback gracefully
  }

  if (tours.length === 0) {
    tours = TOURS_CATALOG.slice(0, 8).map((t) => ({
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
      primaryImage:
        t.images[0]?.url ||
        "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=800&auto=format&fit=crop",
    }));
  }

  try {
    blogPosts = await prisma.blogPost.findMany({
      where: { featured: true },
      take: 3,
    });
  } catch (e) {
    // fallback gracefully
  }

  return (
    <div className="space-y-6">
      <HomeClientWrapper />
      <StatsCounter />
      <RegionExplorer />
      <TopExperiences tours={tours} />
      <SeasonMatrix />
      <DestinationGrid destinations={destinations} />
      <CategoryGrid />
      <EditorialBanner />
      <WhyUs />
      <ReviewsSection />
      <HomeFaqSection />
      <BlogSection posts={blogPosts} />
      <Newsletter />
    </div>
  );
}
