"use client";
import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ShieldCheck, Instagram, Facebook, Youtube } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export const Footer: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const currencyOptions = ["USD", "LKR", "EUR", "GBP", "AUD", "CAD"];

  return (
    <footer className="bg-ceylon-navy text-white pt-16 pb-12 border-t border-ceylon-navy/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="bg-white rounded-2xl p-2.5 inline-flex items-center shadow-lg border border-white/30 group-hover:scale-105 transition-transform duration-300 font-extrabold text-ceylon-navy text-sm">
                CEYLON EXPLORE GUIDE
              </div>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm pt-1">
              Explore Sri Lanka. Book with confidence. Experience it locally. Your trusted marketplace for authentic Sri Lankan tours, wildlife safaris, and island journeys.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ceylon-blue" />
                <span>45 Galle Road, Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ceylon-green" />
                <span>+94 77 123 4567 / 24/7 Hotline</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ceylon-blue" />
                <span>support@ceylonexploreguide.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link href="/tours" className="hover:text-ceylon-green transition-colors">All Tours & Activities</Link></li>
              <li><Link href="/destinations/sigiriya" className="hover:text-ceylon-green transition-colors">Sigiriya & Cultural Triangle</Link></li>
              <li><Link href="/destinations/ella" className="hover:text-ceylon-green transition-colors">Ella & Mountain Highlands</Link></li>
              <li><Link href="/destinations/yala" className="hover:text-ceylon-green transition-colors">Yala Wildlife Safaris</Link></li>
              <li><Link href="/destinations/galle" className="hover:text-ceylon-green transition-colors">Galle Dutch Fort</Link></li>
              <li><Link href="/blog" className="hover:text-ceylon-green transition-colors">Sri Lanka Travel Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link href="/contact" className="hover:text-ceylon-green transition-colors">Help Center / Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-ceylon-green transition-colors">FAQs & Booking Info</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-ceylon-green transition-colors">Free Cancellation Policy</Link></li>
              <li><Link href="/plan-my-trip" className="hover:text-ceylon-green transition-colors">Custom Trip Planner</Link></li>
              <li><Link href="/account" className="hover:text-ceylon-green transition-colors">My Booking Voucher</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link href="/about" className="hover:text-ceylon-green transition-colors">About Us</Link></li>
              <li><Link href="/admin" className="hover:text-ceylon-green transition-colors">Admin Portal</Link></li>
              <li><Link href="/terms" className="hover:text-ceylon-green transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-ceylon-green transition-colors">Privacy Policy</Link></li>
            </ul>
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-xs text-slate-400 block mb-2 font-medium">Currency:</span>
              <div className="flex flex-wrap gap-1">
                {currencyOptions.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
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
            <p>© {new Date().getFullYear()} Ceylon Explore Guide. All rights reserved.</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Registered Tourism Operator — Sri Lanka Tourism Development Authority (SLTDA)
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-ceylon-green" />
            <span className="font-semibold text-slate-300">Secure Payments:</span>
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px] text-white">PayHere</span>
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px] text-white">Stripe</span>
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px] text-white">PayPal</span>
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px] text-white">Visa / MC</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ceylon-green transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ceylon-green transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ceylon-green transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
