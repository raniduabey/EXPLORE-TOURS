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
  ArrowRight,
  Sparkles,
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
      <footer className="bg-[#102D24] text-white pt-20 pb-12 border-t border-[#C9A86A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
            {/* Column 1: Brand & Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <Link href="/" className="inline-flex items-center gap-3.5 group">
                <div className="bg-white/95 rounded-2xl p-2 inline-flex items-center shadow-lg border border-[#C9A86A]/40 group-hover:scale-105 transition-transform duration-300">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                    <Image
                      src="/images/logo.png"
                      alt={`${settings.companyName || siteConfig.name} Logo`}
                      fill
                      className="object-contain p-0.5"
                      priority
                    />
                  </div>
                </div>
                <div>
                  <span className="font-editorial text-xl sm:text-2xl text-white font-bold tracking-wide block">
                    {settings.companyName || siteConfig.name}
                  </span>
                  <span className="text-[10px] font-semibold text-[#C9A86A] uppercase tracking-[0.2em] block mt-1">
                    Curated Sri Lanka Journeys
                  </span>
                </div>
              </Link>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm font-light">
                {siteConfig.description}
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C9A86A] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C9A86A] shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-[#C9A86A] transition-colors font-medium">
                    {phone} (24/7 Concierge Hotline)
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C9A86A] shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-[#C9A86A] transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Curated Journeys */}
            <div className="space-y-4">
              <h4 className="font-editorial text-sm uppercase tracking-[0.18em] text-[#C9A86A] font-bold">
                Curated Journeys
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <Link href="/tours" className="hover:text-[#C9A86A] transition-colors block">
                    All Tours & Experiences
                  </Link>
                </li>
                <li>
                  <Link href="/destinations" className="hover:text-[#C9A86A] transition-colors font-medium text-white block">
                    All Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/sigiriya" className="hover:text-[#C9A86A] transition-colors block">
                    Sigiriya Rock Citadel
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/ella" className="hover:text-[#C9A86A] transition-colors block">
                    Ella Mountain Highlands
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/yala" className="hover:text-[#C9A86A] transition-colors block">
                    Yala Wildlife Safari
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/galle" className="hover:text-[#C9A86A] transition-colors block">
                    Galle Dutch Fort
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-[#C9A86A] transition-colors block">
                    Sri Lanka Travel Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Guest Concierge */}
            <div className="space-y-4">
              <h4 className="font-editorial text-sm uppercase tracking-[0.18em] text-[#C9A86A] font-bold">
                Guest Concierge
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <Link href="/contact" className="hover:text-[#C9A86A] transition-colors block">
                    Contact Specialists
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#C9A86A] transition-colors block">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/cancellation-policy" className="hover:text-[#C9A86A] transition-colors block">
                    Flexible Cancellation
                  </Link>
                </li>
                <li>
                  <Link href="/plan-my-trip" className="hover:text-[#C9A86A] transition-colors block">
                    Bespoke Trip Planner
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-[#C9A86A] transition-colors block">
                    My Booking Voucher
                  </Link>
                </li>
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#C9A86A] text-xs font-semibold transition-colors border border-[#C9A86A]/30"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>Write a Guest Review</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Brand & Currency */}
            <div className="space-y-4">
              <h4 className="font-editorial text-sm uppercase tracking-[0.18em] text-[#C9A86A] font-bold">
                Company & Policies
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <Link href="/about" className="hover:text-[#C9A86A] transition-colors block">
                    Our Heritage & Philosophy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#C9A86A] transition-colors block">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#C9A86A] transition-colors block">
                    Privacy & Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-[#C9A86A] transition-colors text-slate-400 block">
                    Admin Portal
                  </Link>
                </li>
              </ul>

              <div className="pt-3">
                <span className="text-[11px] text-slate-400 block mb-2 font-medium uppercase tracking-wider">
                  Preferred Currency:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currencyOptions.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        currency === c
                          ? "bg-[#C9A86A] text-[#102D24] border-[#C9A86A] shadow-sm font-bold"
                          : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Verified SLTDA statement */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p className="font-light">
              © {new Date().getFullYear()} {settings.companyName || siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>Official Registered Chauffeur Guides & Luxury Fleet</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Write a Review Modal */}
      <WriteReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </>
  );
};
