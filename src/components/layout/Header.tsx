"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, ShoppingBag, User, X, Menu, ShieldCheck } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { currencies } from "@/lib/currency";
import { siteConfig } from "@/config/site";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-2.5 border-b border-slate-100"
          : "bg-white/95 backdrop-blur-sm py-3 border-b border-slate-100/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Name — Compact, Elegant & Refined */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group shrink-0"
            title={siteConfig.name}
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-sm border border-slate-200/90 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Image
                src="/images/logo.png"
                alt={`${siteConfig.name} Logo`}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-black text-sm sm:text-[15px] text-ceylon-navy tracking-tight leading-none whitespace-nowrap block">
                {siteConfig.name}
              </span>
              <span className="text-[9px] font-bold text-ceylon-green tracking-wider uppercase block mt-1 whitespace-nowrap opacity-90">
                Authentic Sri Lanka Tours
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Centered, Single-Line, No Wrapping */}
          <nav className="hidden xl:flex items-center space-x-6 shrink-0">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[13px] font-semibold tracking-normal whitespace-nowrap transition-colors relative py-1.5 ${
                    active
                      ? "text-ceylon-blue font-bold"
                      : "text-slate-600 hover:text-ceylon-blue"
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-ceylon-blue rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons & Icons */}
          <div className="hidden lg:flex items-center space-x-2.5 shrink-0">
            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-ceylon-navy hover:bg-slate-100 transition-colors border border-slate-200/80 whitespace-nowrap"
                aria-label="Select Currency"
              >
                <Globe className="w-4 h-4 text-ceylon-blue shrink-0" />
                <span>
                  {currency} ({currencies[currency]?.symbol || "$"})
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-dropdown border border-slate-100 py-1.5 z-50">
                  {currencyOptions.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between ${
                        currency === c
                          ? "text-ceylon-blue font-bold bg-ceylon-softblue/60"
                          : "text-slate-700"
                      }`}
                    >
                      <span>{c}</span>
                      <span className="text-slate-400">{currencies[c]?.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart / Booking Inquiries */}
            <Link
              href="/checkout"
              className="relative p-2 rounded-xl text-slate-700 hover:text-ceylon-blue hover:bg-slate-100 transition-colors"
              title="Booking Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ceylon-green text-white text-[10px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* My Booking Button */}
            <Link
              href="/account"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Booking</span>
            </Link>

            {/* Admin Portal Button */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-ceylon-navy rounded-xl text-xs font-bold transition-all border border-slate-200/80 shadow-sm whitespace-nowrap"
              title="Admin Control Panel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-ceylon-blue" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <Link
              href="/checkout"
              className="relative p-2 text-ceylon-navy"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-ceylon-green text-white text-[10px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ceylon-navy hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="xl:hidden mt-3 pt-3 pb-5 border-t border-slate-100 space-y-3 overflow-hidden"
            >
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const active =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
                        active
                          ? "bg-ceylon-softblue text-ceylon-blue font-extrabold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 px-1">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-ceylon-navy text-white hover:bg-ceylon-blue flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>My Booking / Vouchers</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 flex items-center justify-center gap-2 border border-slate-200 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-ceylon-blue" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-3">
                <span className="text-xs font-bold text-slate-500">Currency:</span>
                <div className="flex flex-wrap gap-1">
                  {currencyOptions.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        currency === c
                          ? "bg-ceylon-blue text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
