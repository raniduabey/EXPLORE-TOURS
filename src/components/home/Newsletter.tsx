"use client";
import React, { useState } from "react";
import { CheckCircle2, Mail, Send, AlertCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { FadeIn } from "@/components/ui/motion";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      } else {
        const data = await res.json();
        setError(data.error || "Subscription failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-luxury-forest rounded-3xl p-8 sm:p-14 lg:p-16 text-luxury-ivory relative overflow-hidden shadow-2xl border border-luxury-gold/30">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-luxury-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-luxury-emerald/30 blur-3xl pointer-events-none" />
        <FadeIn className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-3.5">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-luxury-gold block">
              Private Dispatches
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-luxury-ivory">
              Island Chronicles, Delivered.
            </h2>
            <p className="text-sm sm:text-base text-luxury-sand/90 max-w-md font-sans font-normal leading-relaxed">
              Curated private travel dispatches, seasonal wildlife calendars, and exclusive new journey itineraries from {siteConfig.name}.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-luxury-gold/40 flex items-center gap-3 text-luxury-gold">
                <CheckCircle2 className="w-6 h-6 text-luxury-gold shrink-0" />
                <div>
                  <h4 className="font-serif font-semibold text-sm text-luxury-ivory tracking-wide">Welcome to Ceylon Explore</h4>
                  <p className="text-xs text-luxury-sand/80 mt-0.5 font-sans font-normal">Your private island compendium has been dispatched to your inbox.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-luxury-gold absolute left-4 top-4" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/95 text-luxury-forest pl-12 pr-4 py-3.5 rounded-full text-xs font-sans placeholder:text-luxury-charcoal/50 focus:outline-none focus:ring-2 focus:ring-luxury-gold border border-luxury-sand"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#DFBE82] via-[#C9A86A] to-[#A88647] hover:brightness-110 text-luxury-forest font-sans font-semibold text-xs uppercase tracking-wider rounded-full transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <span>{loading ? "Subscribing..." : "Subscribe"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {error && (
                  <div className="text-xs text-rose-300 flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{error}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
