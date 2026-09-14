import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const viewport: Viewport = {
  themeColor: "#0D2C54",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ceylonexploreguide.com"),
  title: {
    default: "Ceylon Explore Guide | Premium Sri Lanka Tours & Activities",
    template: "%s | Ceylon Explore Guide",
  },
  description: "Explore Sri Lanka with local certified guides. Book day trips, wildlife safaris, cultural journeys, and scenic train tours with instant confirmation.",
  keywords: [
    "Sri Lanka tours",
    "Sigiriya tour",
    "Ella train journey",
    "Yala safari",
    "Whale watching Mirissa",
    "Ceylon Explore Guide",
    "Sri Lanka travel guide",
    "Sri Lanka tour packages",
    "Colombo day tours"
  ],
  authors: [{ name: "Ceylon Explore Guide" }],
  creator: "Ceylon Explore Guide",
  publisher: "Ceylon Explore Guide",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ceylonexploreguide.com",
    siteName: "Ceylon Explore Guide",
    title: "Ceylon Explore Guide | Premium Sri Lanka Tours & Activities",
    description: "Explore Sri Lanka with local certified guides. Discover handpicked day trips, safaris, cultural journeys, and scenic trains.",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "Ceylon Explore Guide Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ceylon Explore Guide | Premium Sri Lanka Tours & Activities",
    description: "Explore Sri Lanka with local certified guides. Discover handpicked day trips, safaris, and authentic island experiences.",
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
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col justify-between">
        <CurrencyProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow pt-20">{children}</main>
              <Footer />
              <WhatsAppButton />
            </CartProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
