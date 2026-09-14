"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Heart,
  User,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import { siteConfig } from "@/config/site";

export default function AccountPage() {
  const { wishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [tab, setTab] = useState<"lookup" | "wishlist">("lookup");

  // Booking Lookup State
  const [searchRef, setSearchRef] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupError, setLookupError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    setLookupResult(null);

    if (!searchRef && !searchEmail) {
      setLookupError("Please enter your Booking Reference or Email address.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchRef) params.set("ref", searchRef.trim());
      if (searchEmail) params.set("email", searchEmail.trim().toLowerCase());

      const res = await fetch(`/api/user/bookings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLookupResult(data);
        } else {
          setLookupError(
            "No reservation found matching the provided reference and email. Please verify your details."
          );
        }
      } else {
        setLookupError("Failed to lookup booking. Please try again or message our support.");
      }
    } catch (err) {
      setLookupError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-ceylon-navy rounded-3xl p-6 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Traveller Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Manage Your Booking & Vouchers
          </h1>
          <p className="text-xs text-slate-300 max-w-md">
            Instantly view digital confirmation vouchers, check pickup times, and download trip itineraries.
          </p>
        </div>
        <Link
          href="/tours"
          className="px-5 py-2.5 bg-ceylon-green hover:bg-ceylon-darkgreen text-white text-xs font-bold rounded-xl shadow transition-colors shrink-0"
        >
          Explore New Tours
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setTab("lookup")}
          className={`pb-3 text-xs font-extrabold flex items-center gap-2 transition-colors relative ${
            tab === "lookup"
              ? "text-ceylon-blue border-b-2 border-ceylon-blue"
              : "text-ceylon-muted"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Find My Booking</span>
        </button>

        <button
          onClick={() => setTab("wishlist")}
          className={`pb-3 text-xs font-extrabold flex items-center gap-2 transition-colors relative ${
            tab === "wishlist"
              ? "text-ceylon-blue border-b-2 border-ceylon-blue"
              : "text-ceylon-muted"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Experiences ({wishlist.length})</span>
        </button>
      </div>

      {/* Booking Lookup Section */}
      {tab === "lookup" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-5">
            <div>
              <h2 className="text-lg font-extrabold text-ceylon-navy">
                Search Reservation
              </h2>
              <p className="text-xs text-ceylon-muted mt-0.5">
                Enter the Booking Reference from your confirmation screen (e.g. CET-2026-XXXXX) and the email used during checkout.
              </p>
            </div>

            {lookupError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{lookupError}</span>
              </div>
            )}

            <form onSubmit={handleLookup} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Booking Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. CET-2026-92812"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs uppercase font-mono text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Guest Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. yourname@example.com"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-extrabold rounded-xl transition-colors shadow flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{loading ? "Searching..." : "Retrieve Voucher"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Lookup Results */}
          {lookupResult && lookupResult.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-ceylon-navy">
                Matching Bookings Found ({lookupResult.length})
              </h3>
              <div className="space-y-4">
                {lookupResult.map((b: any) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-ceylon-blue bg-ceylon-softblue px-2.5 py-1 rounded border border-ceylon-blue/20">
                          {b.bookingRef}
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
                          {b.bookingStatus || "CONFIRMED"}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-ceylon-navy">
                        {b.tour?.title || "Sri Lanka Tour Experience"}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-ceylon-blue" />
                          <span>{b.tourDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-ceylon-blue" />
                          <span>{b.tourTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-ceylon-blue" />
                          <span>{b.pickupLocation}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Guest: {b.guestName} • Travellers: {b.adults} Adults{b.children ? `, ${b.children} Children` : ""}
                      </p>
                    </div>

                    <div className="text-right sm:border-l sm:pl-6 border-slate-100 space-y-2 w-full sm:w-auto">
                      <div>
                        <span className="text-lg font-extrabold text-ceylon-navy block">
                          ${b.totalAmount} {b.currency || "USD"}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold block">
                          Payment: {b.paymentStatus || "CONFIRMED"}
                        </span>
                      </div>
                      <Link
                        href={`/booking/confirmation/${b.bookingRef}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-bold rounded-xl shadow transition-colors w-full"
                      >
                        <span>View Digital Voucher</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Wishlist Section */}
      {tab === "wishlist" && (
        <div className="space-y-4">
          {wishlist.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-ceylon-navy">
                No Saved Experiences
              </h3>
              <p className="text-xs text-ceylon-muted">
                Tap the heart icon on any tour to save it for quick review later.
              </p>
              <Link
                href="/tours"
                className="inline-block px-5 py-2.5 bg-ceylon-navy text-white text-xs font-bold rounded-xl shadow"
              >
                Browse Experiences
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-3">
              <p className="text-xs text-slate-600">
                You have {wishlist.length} saved experiences in your browser session.
              </p>
              <Link
                href="/tours"
                className="inline-block px-4 py-2 bg-ceylon-blue text-white text-xs font-bold rounded-xl"
              >
                View in Tours Listing
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
