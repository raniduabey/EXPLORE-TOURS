"use client";
import React, { useState } from "react";
import { CheckCircle2, Mail, Send, AlertCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

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
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-ceylon-navy rounded-3xl p-8 sm:p-12 lg:p-14 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-ceylon-blue/20 blur-3xl" />
        <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-ceylon-green/20 blur-3xl" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              Stay Inspired
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Sri Lanka Inspiration, Delivered.
            </h2>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Get secret travel guides, hidden destination updates, and hand-picked special promotions from {siteConfig.name} delivered straight to your inbox.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-emerald-400/40 flex items-center gap-3 text-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">Thank You for Subscribing!</h4>
                  <p className="text-xs text-slate-200 mt-0.5">We&apos;ve sent your welcome guide to your inbox.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white text-ceylon-text pl-11 pr-4 py-3 rounded-xl text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ceylon-green"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-ceylon-green hover:bg-ceylon-darkgreen text-white font-extrabold text-xs rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Subscribing..." : "Inspire Me"}</span>
                    <Send className="w-4 h-4" />
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
        </div>
      </div>
    </section>
  );
};
