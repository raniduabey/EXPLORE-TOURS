"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Instagram,
  Facebook,
  Youtube,
  PenLine,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useBusinessSettings } from "@/context/BusinessContext";
import { siteConfig } from "@/config/site";
import { WriteReviewModal } from "@/components/reviews/WriteReviewModal";

export const Footer: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const { settings } = useBusinessSettings();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const currencyOptions = ["USD", "LKR", "EUR", "GBP", "AUD", "CAD"];

  const address = settings.address || `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.country}`;
  const phone = settings.primaryPhone || siteConfig.contact.phone;
  const email = settings.email || siteConfig.contact.email;

  return (
    <>
      <footer className="bg-ceylon-navy text-white pt-16 pb-12 border-t border-ceylon-navy/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-flex items-center gap-3.5 group">
                <div className="bg-white rounded-2xl p-2 inline-flex items-center shadow-lg border border-white/30 group-hover:scale-105 transition-transform duration-300">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                    <Image
                      src="/images/logo.png"
                      alt={`${settings.companyName || siteConfig.name} Logo`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                <div>
                  <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight block">
                    {settings.companyName || siteConfig.name}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mt-0.5">
                    Authentic Sri Lanka Tours
                  </span>
                </div>
              </Link>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm pt-1">
                {siteConfig.description}
              </p>
              <div className="pt-2 space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-ceylon-blue shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-ceylon-green shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-emerald-300 transition-colors font-medium">
                    {phone} (24/7 Hotline)
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-ceylon-blue shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-ceylon-blue transition-colors">
                    {email}
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
                  <Link href="/destinations" className="hover:text-ceylon-green transition-colors font-semibold text-emerald-400">
                    All Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/sigiriya" className="hover:text-ceylon-green transition-colors">
                    Sigiriya Cultural Triangle
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
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors border border-emerald-500/30"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>Write a Review</span>
                  </button>
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
                    About Ceylon Explore Tours
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
                <li>
                  <Link href="/admin" className="hover:text-ceylon-green transition-colors text-slate-400">
                    Admin Portal
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
              <p>© {new Date().getFullYear()} {settings.companyName || siteConfig.name}. All rights reserved.</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Independent Verified Sri Lankan Tourism Marketplace
              </p>
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

      <WriteReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />
    </>
  );
};
