"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown, Heart, ShoppingBag, User, X, Menu, Phone } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { currencies } from "@/lib/currency";
import { siteConfig } from "@/config/site";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { wishlist } = useWishlist();
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
    { name: "Destinations", href: "/destinations/sigiriya" },
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
          ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-100"
          : "bg-white/90 backdrop-blur-sm py-3 border-b border-slate-100/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group shrink-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-white p-1 shadow-sm border border-slate-200/70 group-hover:scale-105 transition-all duration-300">
              <Image
                src="/images/logo.png"
                alt={`${siteConfig.name} Official Logo`}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-sm sm:text-base text-ceylon-navy tracking-tight block">
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-bold text-ceylon-green tracking-wider uppercase block">
                Sri Lanka Local Tours
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs xl:text-sm font-bold transition-colors hover:text-ceylon-blue relative py-1 ${
                    active ? "text-ceylon-blue" : "text-ceylon-text"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ceylon-blue rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-3.5">
            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-ceylon-navy hover:bg-ceylon-softblue transition-colors border border-slate-200/80"
              >
                <Globe className="w-3.5 h-3.5 text-ceylon-blue" />
                <span>
                  {currency} ({currencies[currency]?.symbol || "$"})
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
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
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-ceylon-softblue transition-colors flex items-center justify-between ${
                        currency === c ? "text-ceylon-blue font-bold bg-ceylon-softblue/60" : "text-ceylon-text"
                      }`}
                    >
                      <span>{c}</span>
                      <span className="text-slate-400">{currencies[c]?.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/account"
              className="relative p-2 rounded-xl text-ceylon-text hover:text-ceylon-blue hover:bg-ceylon-softblue transition-colors"
              title="Saved Experiences"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Booking Cart / Voucher */}
            <Link
              href="/checkout"
              className="relative p-2 rounded-xl text-ceylon-text hover:text-ceylon-blue hover:bg-ceylon-softblue transition-colors"
              title="Booking Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ceylon-green text-white text-[10px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / My Vouchers */}
            <Link
              href="/account"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Booking</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/checkout"
              className="relative p-2 text-ceylon-navy"
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
              className="p-2 text-ceylon-navy"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-5 border-t border-slate-100 space-y-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
                    pathname === link.href
                      ? "bg-ceylon-softblue text-ceylon-blue font-extrabold"
                      : "text-ceylon-text hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold px-3 py-2 rounded-xl text-ceylon-navy hover:bg-slate-50 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-ceylon-blue" />
                <span>My Booking Voucher / Account</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-3">
              <span className="text-xs font-bold text-slate-500">Currency:</span>
              <div className="flex gap-1">
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
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
