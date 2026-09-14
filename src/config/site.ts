export interface SiteConfig {
  name: string;
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

export const siteConfig: SiteConfig = {
  name: "Ceylon Explore Tours",
  legalName: "Ceylon Explore Tours (Pvt) Ltd",
  tagline: "Explore Sri Lanka With People Who Know It Best",
  description:
    "Authentic Sri Lankan tours, wildlife safaris, scenic mountain train journeys, and bespoke travel experiences curated by certified local guides.",
  domain: "ceylonexploretours.com",
  url: "https://www.ceylonexploretours.com",
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
      country: "Sri Lanka",
      postalCode: "00300",
    },
    operatingHours: "Monday - Sunday: 24/7 Traveller Support Hotline",
  },
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
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
