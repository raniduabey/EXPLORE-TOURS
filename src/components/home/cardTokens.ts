/**
 * Shared Card Sizing & Layout Tokens across Ceylon Explore Tours Homepage
 * Standardizes dimensions, aspect ratio, border-radius, and grid gaps across:
 * 1. Sri Lanka's Most Alluring Regions (DestinationGrid)
 * 2. Curated By Interest (CategoryGrid)
 */

export const HOMEPAGE_CARD_GRID =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7";

export const HOMEPAGE_LANDSCAPE_CARD_HEIGHT =
  "h-80 sm:h-[340px]";

export const HOMEPAGE_CARD_CONTAINER =
  `group relative ${HOMEPAGE_LANDSCAPE_CARD_HEIGHT} w-full rounded-3xl overflow-hidden shadow-[0_12px_30px_rgba(16,45,36,0.08)] hover:shadow-[0_20px_45px_rgba(16,45,36,0.15)] border border-luxury-sand/70 hover:border-luxury-gold/50 transition-all duration-500 transform hover:-translate-y-1.5 block bg-luxury-forest`;

export const HOMEPAGE_CARD_OVERLAY =
  "absolute inset-0 bg-gradient-to-t from-luxury-forest/95 via-luxury-forest/40 to-transparent pointer-events-none";

export const HOMEPAGE_CARD_VIGNETTE =
  "absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-luxury-forest/70 via-luxury-forest/20 to-transparent pointer-events-none";

export const HOMEPAGE_CARD_PADDING =
  "p-5 sm:p-6";
