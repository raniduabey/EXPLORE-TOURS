"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, ShoppingBag, X, Menu, ShieldCheck, Sparkles } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { currencies } from "@/lib/currency";
import { siteConfig } from "@/config/site";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCurrencyOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Tours", href: "/tours" },
    { name: "Destinations", href: "/destinations" },
    { name: "Travel Guide", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const currencyOptions = ["USD", "LKR", "EUR", "GBP", "AUD", "CAD"];

  // Determine navbar styling based on page and scroll position
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? "bg-gradient-to-b from-black/60 via-black/25 to-transparent text-white py-4 border-b border-transparent"
            : "bg-[#102D24]/95 backdrop-blur-md text-white py-3 border-b border-[#C9A86A]/20 shadow-xl"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 xl:grid-cols-[auto_1fr_auto] 2xl:grid-cols-[1fr_auto_1fr] items-center gap-4 w-full">
            {/* 1. Left: Logo & Brand Name */}
            <div className="flex items-center justify-start shrink-0">
              <Link
                href="/"
                className="inline-flex items-center gap-3 sm:gap-3.5 group shrink-0"
                title={siteConfig.name}
              >
                <div className="relative w-12 h-12 sm:w-[50px] sm:h-[50px] md:w-16 md:h-16 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/logo.png"
                    alt={`${siteConfig.name} Logo`}
                    fill
                    sizes="(max-width: 640px) 48px, (max-width: 768px) 50px, 64px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="font-editorial text-sm sm:text-lg md:text-xl text-white font-bold tracking-wide leading-tight truncate block group-hover:text-luxury-sand transition-colors">
                    Ceylon Explore Tours
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-medium tracking-[0.16em] sm:tracking-[0.22em] uppercase block mt-0.5 truncate text-[#C9A86A]">
                    Curated Sri Lanka Journeys
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Centre: Main Navigation Links */}
            <div className="hidden xl:flex items-center justify-center min-w-0">
              <nav className="flex items-center space-x-6 2xl:space-x-7 shrink-0">
                {navLinks.map((link) => {
                  const active =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-[12px] uppercase tracking-[0.14em] font-medium whitespace-nowrap transition-all duration-200 relative py-1.5 ${
                        active
                          ? "text-[#C9A86A] font-semibold"
                          : "text-white/85 hover:text-[#C9A86A]"
                      }`}
                    >
                      {link.name}
                      {active && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* 3. Right: Header Action Buttons & Icons (Desktop) */}
            <div className="hidden xl:flex items-center justify-end space-x-3 shrink-0 justify-self-end">
              {/* Currency Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all border whitespace-nowrap ${
                    isTransparent
                      ? "bg-black/20 hover:bg-black/35 text-white/90 border-white/20 backdrop-blur-sm"
                      : "bg-white/10 hover:bg-white/15 text-white border-white/15"
                  }`}
                  aria-label="Select Currency"
                >
                  <Globe className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                  <span className="tracking-wide">
                    {currency} ({currencies[currency]?.symbol || "$"})
                  </span>
                  <ChevronDown className="w-3 h-3 text-white/60 shrink-0" />
                </button>
                {currencyOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-[#102D24] rounded-xl shadow-2xl border border-[#C9A86A]/30 py-1.5 z-50 backdrop-blur-lg">
                    {currencyOptions.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setCurrencyOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors flex items-center justify-between ${
                          currency === c
                            ? "text-[#C9A86A] font-bold bg-[#1E4D3D]/60"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{c}</span>
                        <span className="text-[#C9A86A]/70">{currencies[c]?.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Shopping Cart Icon & Badge */}
              <Link
                href="/checkout"
                className={`relative p-2 rounded-xl transition-all border ${
                  isTransparent
                    ? "bg-black/20 hover:bg-black/35 text-white/90 border-white/20"
                    : "bg-white/10 hover:bg-white/15 text-white border-white/15"
                }`}
                title="View Bookings Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#C9A86A]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C9A86A] text-[#102D24] text-[9px] font-black flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* My Booking Button */}
              <Link
                href="/account"
                className="px-3.5 py-1.5 bg-[#1E4D3D] hover:bg-[#102D24] text-white border border-[#C9A86A]/40 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow whitespace-nowrap"
              >
                My Booking
              </Link>

              {/* Admin Button */}
              <Link
                href="/admin"
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 rounded-xl text-xs font-medium transition-colors whitespace-nowrap"
                title="Admin Dashboard Portal"
              >
                Admin
              </Link>
            </div>

            {/* Mobile Menu Toggle Button (< xl) */}
            <div className="flex items-center justify-end gap-2 xl:hidden justify-self-end">
              <Link
                href="/checkout"
                className="relative p-2 rounded-xl bg-white/10 text-white border border-white/15"
              >
                <ShoppingBag className="w-4 h-4 text-[#C9A86A]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C9A86A] text-[#102D24] text-[9px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-[#102D24] border-t border-[#C9A86A]/20 px-4 pt-4 pb-6 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const active =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-between ${
                        active
                          ? "bg-[#1E4D3D] text-[#C9A86A] border border-[#C9A86A]/30"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{link.name}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />}
                    </Link>
                  );
                })}
              </div>

              {/* Currency Selector & Quick Links inside Mobile Menu */}
              <div className="pt-3.5 border-t border-white/10 space-y-3.5">
                {/* Currency Selector Grid (All 6 Currencies) */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A86A] block">
                    Display Currency:
                  </span>
                  <div className="grid grid-cols-6 gap-1 w-full">
                    {["USD", "EUR", "GBP", "AUD", "CAD", "LKR"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCurrency(c)}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all ${
                          currency === c
                            ? "bg-[#C9A86A] text-[#102D24] shadow-sm font-black"
                            : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Action Links: View Cart, My Booking, Admin */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <Link
                    href="/checkout"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-2 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 text-center transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C9A86A] shrink-0" />
                    <span>Cart ({cartCount})</span>
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-2 bg-[#1E4D3D] hover:bg-[#153a2d] text-white border border-[#C9A86A]/40 rounded-xl text-xs font-semibold uppercase tracking-wider text-center transition-colors flex items-center justify-center"
                  >
                    My Booking
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-2 bg-white/10 hover:bg-white/15 text-white/90 border border-white/20 rounded-xl text-xs font-medium text-center transition-colors flex items-center justify-center"
                  >
                    Admin
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap Outside Backdrop to Dismiss Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-[65px] bg-black/60 backdrop-blur-sm z-[-1] xl:hidden"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </header>

      {/* Spacer for non-homepage views so content is never obscured */}
      {!isHome && <div className="h-20" />}
    </>
  );
};
