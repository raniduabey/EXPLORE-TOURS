"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown, Heart, ShoppingBag, User, Compass, X, Menu } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { currencies } from "@/lib/currency";

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
    { name: "Tours", href: "/tours" },
    { name: "Experiences", href: "/tours?category=cultural" },
    { name: "Destinations", href: "/destinations/sigiriya" },
    { name: "Things to Do", href: "/tours?category=adventure" },
    { name: "Travel Guide", href: "/blog" },
    { name: "About Us", href: "/about" },
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
          <Link href="/" className="inline-flex items-center group shrink-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white p-1 shadow-sm border border-slate-200/70 group-hover:shadow group-hover:scale-105 transition-all duration-300">
              <Image
                src="/images/logo.png"
                alt="Ceylon Explore Guide Official Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
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

          <div className="hidden lg:flex items-center space-x-3.5">
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
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-ceylon-softblue transition-colors ${
                        currency === c
                          ? "text-ceylon-blue font-extrabold bg-ceylon-softblue"
                          : "text-ceylon-text"
                      }`}
                    >
                      <span>{c}</span>
                      <span className="text-slate-400 font-mono">
                        {currencies[c]?.symbol || "$"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/account"
              className="relative p-2 text-ceylon-navy hover:text-ceylon-blue hover:bg-ceylon-softblue rounded-full transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/checkout"
              className="relative p-2 text-ceylon-navy hover:text-ceylon-blue hover:bg-ceylon-softblue rounded-full transition-colors"
              title="Cart / Checkout"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ceylon-green text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-ceylon-navy hover:text-ceylon-blue rounded-xl border border-slate-200/80 hover:border-ceylon-blue/40 transition-colors"
            >
              <User className="w-4 h-4 text-ceylon-blue" />
              <span>Account</span>
            </Link>

            <Link
              href="/plan-my-trip"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-ceylon-green hover:bg-ceylon-darkgreen shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Plan My Trip</span>
            </Link>
          </div>

          <div className="flex lg:hidden items-center space-x-2">
            <Link href="/checkout" className="relative p-2 text-ceylon-navy">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-ceylon-green text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ceylon-navy focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-2xl">
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-ceylon-text hover:bg-ceylon-softblue hover:text-ceylon-blue"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-ceylon-muted">Currency:</span>
              <div className="flex gap-1 overflow-x-auto">
                {currencyOptions.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2 py-1 text-xs font-bold rounded-lg ${
                      currency === c
                        ? "bg-ceylon-navy text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-ceylon-navy bg-slate-100"
            >
              <User className="w-4 h-4" />
              <span>My Account</span>
            </Link>
            <Link
              href="/plan-my-trip"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-ceylon-green"
            >
              <Compass className="w-4 h-4" />
              <span>Plan My Trip</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
