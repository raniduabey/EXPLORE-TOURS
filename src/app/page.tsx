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
        "/images/destinations/sigiriya.jpg",
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
        "/images/destinations/sigiriya.jpg",
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

  let approvedReviews: any[] = [];
  try {
    const rawReviews = await prisma.review.findMany({
      where: {
        status: { in: ["APPROVED", "approved", "Approved", "PUBLISHED", "published"] },
      },
      select: {
        id: true,
        userName: true,
        userCountry: true,
        rating: true,
        comment: true,
        travelDate: true,
        photoUrl: true,
        verified: true,
        createdAt: true,
        tour: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });
    approvedReviews = rawReviews.map((r) => ({
      id: r.id,
      userName: r.userName,
      userCountry: r.userCountry || "International Traveller",
      rating: Number(r.rating) || 5,
      comment: r.comment,
      travelDate: r.travelDate,
      photoUrl: r.photoUrl,
      verified: r.verified !== false,
      tour: r.tour ? { title: r.tour.title, slug: r.tour.slug } : null,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (e) {
    // fallback gracefully
  }

  return (
    <div className="flex flex-col">
      <HomeClientWrapper />
      <StatsCounter />
      <RegionExplorer />
      <TopExperiences tours={tours} />
      <SeasonMatrix />
      <DestinationGrid destinations={destinations} />
      <CategoryGrid />
      <EditorialBanner />
      <WhyUs />
      <ReviewsSection initialReviews={approvedReviews} />
      <HomeFaqSection />
      <BlogSection posts={blogPosts} />
      <Newsletter />
    </div>
  );
}
