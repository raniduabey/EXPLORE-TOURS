import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { TOURS_CATALOG } from "@/data/toursData";
import { DESTINATIONS_CATALOG } from "@/data/destinationsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
  ];

  // Dynamic Tour Routes from verified catalog
  const tourRoutes: MetadataRoute.Sitemap = TOURS_CATALOG.map((t) => ({
    url: `${baseUrl}/tours/${t.slug}`,
    lastModified: new Date(),
  }));

  // Dynamic Destination Routes from verified catalog
  const destinationRoutes: MetadataRoute.Sitemap = DESTINATIONS_CATALOG.map((d) => ({
    url: `${baseUrl}/destinations/${d.slug}`,
    lastModified: new Date(),
  }));

  // Blog Routes
  const blogSlugs = [
    "ultimate-10-day-sri-lanka-itinerary",
    "kandy-to-ella-train-guide",
    "yala-safari-leopard-guide",
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...tourRoutes, ...destinationRoutes, ...blogRoutes];
}
