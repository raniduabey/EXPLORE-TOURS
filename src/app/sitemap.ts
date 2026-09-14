import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { TOURS_CATALOG } from "@/data/toursData";
import { DESTINATIONS_CATALOG } from "@/data/destinationsData";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic Tour Routes
  let tourSlugs = TOURS_CATALOG.map((t) => t.slug);
  try {
    const dbTours = await prisma.tour.findMany({ select: { slug: true } });
    if (dbTours && dbTours.length > 0) {
      tourSlugs = Array.from(new Set([...tourSlugs, ...dbTours.map((t) => t.slug)]));
    }
  } catch (e) {
    // Fallback to catalog
  }

  const tourRoutes: MetadataRoute.Sitemap = tourSlugs.map((slug) => ({
    url: `${baseUrl}/tours/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Dynamic Destination Routes
  let destSlugs = DESTINATIONS_CATALOG.map((d) => d.slug);
  try {
    const dbDest = await prisma.destination.findMany({ select: { slug: true } });
    if (dbDest && dbDest.length > 0) {
      destSlugs = Array.from(new Set([...destSlugs, ...dbDest.map((d) => d.slug)]));
    }
  } catch (e) {
    // Fallback to catalog
  }

  const destinationRoutes: MetadataRoute.Sitemap = destSlugs.map((slug) => ({
    url: `${baseUrl}/destinations/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Blog Routes
  let blogSlugs = [
    "ultimate-10-day-sri-lanka-itinerary",
    "kandy-to-ella-train-guide",
    "yala-safari-leopard-guide",
  ];
  try {
    const dbPosts = await prisma.blogPost.findMany({ select: { slug: true } });
    if (dbPosts && dbPosts.length > 0) {
      blogSlugs = Array.from(new Set([...blogSlugs, ...dbPosts.map((p) => p.slug)]));
    }
  } catch (e) {
    // Fallback to static
  }

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...tourRoutes, ...destinationRoutes, ...blogRoutes];
}
