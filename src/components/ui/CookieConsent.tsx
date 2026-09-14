"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cet_cookie_consent");
    if (!saved) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cet_cookie_consent", "accepted");
    window.dispatchEvent(new CustomEvent("cet-consent-update", { detail: "accepted" }));
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cet_cookie_consent", "declined");
    window.dispatchEvent(new CustomEvent("cet-consent-update", { detail: "declined" }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-2xl p-5 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-ceylon-softblue text-ceylon-blue flex items-center justify-center flex-shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1.5">
          <h3 className="text-xs font-extrabold text-ceylon-navy tracking-tight flex items-center gap-1.5">
            Privacy & Cookie Preferences
          </h3>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            We use essential cookies for reservations and optional analytics to enhance your Sri Lanka travel planning. Read our{" "}
            <Link href="/faq" className="text-ceylon-blue hover:underline font-semibold">
              FAQ
            </Link>{" "}
            for details.
          </p>
        </div>
        <button
          onClick={handleDecline}
          aria-label="Close cookie banner"
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
        <button
          onClick={handleDecline}
          className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Essential Only
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-lg bg-ceylon-green hover:bg-ceylon-darkgreen text-white text-[11px] font-bold shadow-sm transition-all flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Accept All</span>
        </button>
      </div>
    </aside>
  );
}
