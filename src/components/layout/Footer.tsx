"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ShieldCheck, Instagram, Facebook, Youtube } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { siteConfig } from "@/config/site";

export const Footer: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const currencyOptions = ["USD", "LKR", "EUR", "GBP", "AUD", "CAD"];

  return (
    <footer className="bg-ceylon-navy text-white pt-16 pb-12 border-t border-ceylon-navy/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="bg-white rounded-2xl p-2.5 inline-flex items-center shadow-lg border border-white/30 group-hover:scale-105 transition-transform duration-300">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                  <Image
                    src="/images/logo.png"
                    alt={`${siteConfig.name} Official Logo`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </Link>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm pt-1">
              {siteConfig.description}
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ceylon-blue shrink-0" />
                <span>
                  {siteConfig.contact.address.street}, {siteConfig.contact.address.city}, {siteConfig.contact.address.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ceylon-green shrink-0" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-emerald-300 transition-colors">
                  {siteConfig.contact.phoneDisplay} (24/7 Hotline)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ceylon-blue shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-ceylon-blue transition-colors">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">
              Explore Tours
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/tours" className="hover:text-ceylon-green transition-colors">
                  All Tours & Experiences
                </Link>
              </li>
              <li>
                <Link href="/destinations/sigiriya" className="hover:text-ceylon-green transition-colors">
                  Sigiriya & Cultural Triangle
                </Link>
              </li>
              <li>
                <Link href="/destinations/ella" className="hover:text-ceylon-green transition-colors">
                  Ella & Mountain Highlands
                </Link>
              </li>
              <li>
                <Link href="/destinations/yala" className="hover:text-ceylon-green transition-colors">
                  Yala Wildlife Safaris
                </Link>
              </li>
              <li>
                <Link href="/destinations/galle" className="hover:text-ceylon-green transition-colors">
                  Galle Dutch Fort
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-ceylon-green transition-colors">
                  Sri Lanka Travel Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">
              Help & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/contact" className="hover:text-ceylon-green transition-colors">
                  Contact Us / Inquiries
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-ceylon-green transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-ceylon-green transition-colors">
                  Free Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/plan-my-trip" className="hover:text-ceylon-green transition-colors">
                  Custom Trip Planner
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-ceylon-green transition-colors">
                  Find My Booking Voucher
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/about" className="hover:text-ceylon-green transition-colors">
                  About Our Team
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-ceylon-green transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-ceylon-green transition-colors">
                  Privacy & Cookie Policy
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">Display Currency:</span>
              <div className="flex flex-wrap gap-1">
                {currencyOptions.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                      currency === c
                        ? "bg-ceylon-green text-white"
                        : "bg-white/10 text-slate-300 hover:bg-white/20"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div>
            <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
            {siteConfig.sltda.isVerified && siteConfig.sltda.registrationNumber ? (
              <p className="mt-1 text-[11px] text-emerald-400">
                Official Registered Tourism Operator — SLTDA Reg #{siteConfig.sltda.registrationNumber}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                Independent Verified Sri Lankan Tourism Marketplace
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-ceylon-green" />
            <span className="font-semibold text-slate-300">Secure Online Booking</span>
          </div>

          <div className="flex items-center space-x-3">
            {siteConfig.socials.instagram && (
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ceylon-green transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {siteConfig.socials.facebook && (
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ceylon-green transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {siteConfig.socials.youtube && (
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ceylon-green transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
