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
      <footer className="bg-[#102D24] text-white pt-16 sm:pt-20 pb-12 border-t border-[#C9A86A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 sm:pb-16 border-b border-white/10">
            {/* Column 1: Brand & Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <Link href="/" className="inline-flex items-center gap-3.5 group">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/logo.png"
                    alt={`${settings.companyName || siteConfig.name} Logo`}
                    fill
                    sizes="(max-width: 640px) 56px, 64px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-2xl text-white font-normal tracking-wide block">
                    {settings.companyName || siteConfig.name}
                  </span>
                  <span className="text-[11px] font-sans font-semibold text-[#C9A86A] uppercase tracking-[0.2em] block mt-1">
                    Curated Sri Lanka Journeys
                  </span>
                </div>
              </Link>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-sm font-sans font-normal">
                {siteConfig.description}
              </p>

              <div className="pt-2 space-y-3 text-xs sm:text-[13px] text-slate-200">
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
              <h4 className="font-serif text-sm uppercase tracking-[0.16em] text-[#C9A86A] font-semibold">
                Curated Journeys
              </h4>
              <ul className="space-y-3 text-xs sm:text-[13px] text-slate-200/90 font-sans">
                <li>
                  <Link href="/tours" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    All Tours & Experiences
                  </Link>
                </li>
                <li>
                  <Link href="/destinations" className="hover:text-[#C9A86A] transition-colors font-medium text-white block py-0.5">
                    All Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/sigiriya" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Sigiriya Rock Citadel
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/ella" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Ella Mountain Highlands
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/yala" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Yala Wildlife Safari
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/galle" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Galle Dutch Fort
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Sri Lanka Travel Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Guest Concierge */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm uppercase tracking-[0.16em] text-[#C9A86A] font-semibold">
                Guest Concierge
              </h4>
              <ul className="space-y-3 text-xs sm:text-[13px] text-slate-200/90 font-sans">
                <li>
                  <Link href="/contact" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Contact Specialists
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/cancellation-policy" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Flexible Cancellation
                  </Link>
                </li>
                <li>
                  <Link href="/plan-my-trip" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Bespoke Trip Planner
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    My Booking Voucher
                  </Link>
                </li>
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#C9A86A] hover:text-[#102D24] text-[#C9A86A] text-xs font-sans font-semibold transition-all border border-[#C9A86A]/30"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>Write a Guest Review</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Brand & Currency */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm uppercase tracking-[0.16em] text-[#C9A86A] font-semibold">
                Company & Policies
              </h4>
              <ul className="space-y-3 text-xs sm:text-[13px] text-slate-200/90 font-sans">
                <li>
                  <Link href="/about" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Our Heritage & Philosophy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#C9A86A] transition-colors block py-0.5">
                    Privacy & Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-[#C9A86A] transition-colors text-slate-300 block py-0.5">
                    Admin Portal
                  </Link>
                </li>
              </ul>

              <div className="pt-3">
                <span className="text-[11px] text-slate-300 block mb-2 font-sans font-semibold uppercase tracking-wider">
                  Preferred Currency:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currencyOptions.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all border ${
                        currency === c
                          ? "bg-[#C9A86A] text-[#102D24] border-[#C9A86A] shadow-md font-semibold"
                          : "bg-white/5 hover:bg-white/10 text-white/90 border-white/15"
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
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 font-sans">
            <p className="font-normal">
              © {new Date().getFullYear()} {settings.companyName || siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs">
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
