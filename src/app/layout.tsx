import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: "Ceylon Explore Guide | Premium Sri Lanka Tours & Activities",
  description: "Explore Sri Lanka. Book with confidence. Experience it locally. Authentic tours, wildlife safaris, and island experiences.",
  keywords: [
    "Sri Lanka tours",
    "Sigiriya tour",
    "Ella train journey",
    "Yala safari",
    "Whale watching Mirissa",
    "Ceylon Explore Guide"
  ],
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
