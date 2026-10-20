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
    <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#0D281F] rounded-2xl sm:rounded-3xl p-6 sm:p-14 lg:p-16 text-white relative overflow-hidden shadow-xl border border-[#C5A46B]/30">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#C5A46B]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-[#15392D]/40 blur-3xl pointer-events-none" />
        <FadeIn className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="space-y-3.5">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#C5A46B] block">
              Private Dispatches
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white break-words">
              Island Chronicles, Delivered.
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-md font-sans font-normal leading-relaxed">
              Curated private travel dispatches, seasonal wildlife calendars, and exclusive new journey itineraries from {siteConfig.name}.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-[#C5A46B]/40 flex items-center gap-3 text-[#C5A46B]">
                <CheckCircle2 className="w-6 h-6 text-[#C5A46B] shrink-0" />
                <div>
                  <h4 className="font-serif font-semibold text-sm text-white tracking-wide">Welcome to Ceylon Explore</h4>
                  <p className="text-xs text-white/80 mt-0.5 font-sans font-normal">Your private island compendium has been dispatched to your inbox.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-[#C5A46B] absolute left-4 top-4" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white text-[#15392D] pl-12 pr-4 py-3.5 rounded-full text-xs font-sans placeholder:text-[#59645E]/60 focus:outline-none focus:ring-2 focus:ring-[#C5A46B] border border-[#E7E2D8]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-[#F8F7F3] text-[#15392D] font-sans font-semibold text-xs uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <span>{loading ? "Subscribing..." : "Subscribe"}</span>
                    <Send className="w-3.5 h-3.5 text-[#15392D]" />
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
