export interface SiteConfig {
  name: string;
  companyName: string;
  legalName: string;
  tagline: string;
  description: string;
  domain: string;
  url: string;
  contact: {
    email: string;
    supportEmail: string;
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    whatsappDisplay: string;
    address: {
      street: string;
      city: string;
      province: string;
      state: string;
      country: string;
      postalCode: string;
    };
    operatingHours: string;
  };
  socials: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tripadvisor?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tripadvisor?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    metaPixelId?: string;
  };
  sltda: {
    registrationNumber: string | null;
    isVerified: boolean;
  };
  businessRegistration: string | null;
  cancellationPolicy: {
    defaultHoursPrior: number;
    description: string;
  };
}

const socialLinks = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/ceylonexploretours",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/ceylonexploretours",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/@ceylonexploretours",
  tripadvisor: process.env.NEXT_PUBLIC_TRIPADVISOR_URL || "https://tripadvisor.com",
};

export const siteConfig: SiteConfig = {
  name: "Ceylon Explore Tours",
  companyName: "Ceylon Explore Tours (Pvt) Ltd",
  legalName: "Ceylon Explore Tours (Pvt) Ltd",
  tagline: "Explore Sri Lanka With People Who Know It Best",
  description:
    "Authentic Sri Lankan tours, wildlife safaris, scenic mountain train journeys, and bespoke travel experiences curated by certified local guides.",
  domain: "ceylonexploretours.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.ceylonexploretours.com",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@ceylonexploretours.com",
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@ceylonexploretours.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+94771234567",
    phoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || "+94 77 123 4567",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94771234567",
    whatsappDisplay: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+94 77 123 4567",
    address: {
      street: "45 Galle Road",
      city: "Colombo 03",
      province: "Western Province",
      state: "Western Province",
      country: "Sri Lanka",
      postalCode: "00300",
    },
    operatingHours: "Monday - Sunday: 24/7 Traveller Support Hotline",
  },
  socials: socialLinks,
  social: socialLinks,
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "",
  },
  sltda: {
    registrationNumber: process.env.NEXT_PUBLIC_SLTDA_REGISTRATION || null,
    isVerified: Boolean(process.env.NEXT_PUBLIC_SLTDA_REGISTRATION),
  },
  businessRegistration: process.env.NEXT_PUBLIC_BUSINESS_REGISTRATION || null,
  cancellationPolicy: {
    defaultHoursPrior: 24,
    description: "Free cancellation up to 24 hours before the experience start time (local Sri Lanka time).",
  },
};
