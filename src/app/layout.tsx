import type { Metadata, Viewport } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { StickyMobileCta } from "@/components/ui/StickyMobileCta";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { BusinessProvider } from "@/context/BusinessContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#102D24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Premium Sri Lanka Tours & Authentic Experiences`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Sri Lanka tours",
    "Ceylon Explore Tours",
    "Sigiriya day tour",
    "Ella scenic train tickets",
    "Yala safari private jeep",
    "Mirissa whale watching tour",
    "Galle Fort heritage walk",
    "Nuwara Eliya tea tour",
    "Sri Lanka tour packages 2026",
    "Private driver Sri Lanka"
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Premium Sri Lanka Tours & Authentic Experiences`,
    description: siteConfig.description,
    images: [
      {
        url: "/images/logo.png",
        width: 376,
        height: 376,
        alt: `${siteConfig.name} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Premium Sri Lanka Tours & Authentic Experiences`,
    description: siteConfig.description,
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    legalName: siteConfig.companyName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: siteConfig.contact.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "06:00",
        closes: "22:00",
      },
    ],
    sameAs: [
      siteConfig.socials?.facebook || siteConfig.social?.facebook,
      siteConfig.socials?.instagram || siteConfig.social?.instagram,
      siteConfig.socials?.youtube || siteConfig.social?.youtube,
      siteConfig.socials?.tripadvisor || siteConfig.social?.tripadvisor,
    ].filter(Boolean),
  };

  return (
    <html lang="en" className={`scroll-smooth ${poppins.variable} ${cormorant.variable}`}>
      <body className={`antialiased min-h-screen flex flex-col justify-between font-sans ${poppins.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CurrencyProvider>
          <CartProvider>
            <BusinessProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <WhatsAppButton />
              <StickyMobileCta />
              <CookieConsent />
            </BusinessProvider>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
