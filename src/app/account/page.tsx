"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Ticket, Heart, User, Calendar, MapPin, Download } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";

export default function AccountPage() {
  const { wishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetch("/api/user/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadBookings();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      <div className="bg-ceylon-navy rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-emerald-400 font-extrabold text-2xl">
            JW
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">John Watson</h1>
            <p className="text-xs text-slate-300">john.watson@example.com • Explorer Member</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/tours"
            className="px-4 py-2 bg-ceylon-green hover:bg-ceylon-darkgreen text-white text-xs font-bold rounded-xl shadow transition-colors"
          >
            Explore New Tours
          </Link>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 text-xs font-extrabold flex items-center gap-2 transition-colors relative ${
            activeTab === "bookings"
              ? "text-ceylon-blue border-b-2 border-ceylon-blue"
              : "text-ceylon-muted"
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>My Bookings ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`pb-3 text-xs font-extrabold flex items-center gap-2 transition-colors relative ${
            activeTab === "wishlist"
              ? "text-ceylon-blue border-b-2 border-ceylon-blue"
              : "text-ceylon-muted"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlist.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 text-xs font-extrabold flex items-center gap-2 transition-colors relative ${
            activeTab === "profile"
              ? "text-ceylon-blue border-b-2 border-ceylon-blue"
              : "text-ceylon-muted"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Details</span>
        </button>
      </div>

      {activeTab === "bookings" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-ceylon-navy">No Upcoming Bookings Found</h3>
              <p className="text-xs text-ceylon-muted">Your reserved Sri Lankan experiences will appear here.</p>
              <Link
                href="/tours"
                className="inline-block px-5 py-2.5 bg-ceylon-navy text-white text-xs font-bold rounded-xl"
              >
                Browse Experiences
              </Link>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-ceylon-softblue text-ceylon-blue px-2 py-0.5 rounded">
                      {b.bookingRef}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {b.bookingStatus}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-ceylon-navy">{b.tour?.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-ceylon-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-ceylon-blue" />
                      {b.tourDate} at {b.tourTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-ceylon-green" />
                      {b.tour?.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-ceylon-navy">
                    {formatPrice(b.totalAmount)}
                  </span>
                  <Link
                    href={`/booking/confirmation/${b.bookingRef}`}
                    className="px-4 py-2 bg-ceylon-softblue text-ceylon-blue font-bold text-xs rounded-xl hover:bg-ceylon-blue hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View Voucher</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "wishlist" && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-4">
          <Heart className="w-10 h-10 text-rose-500 mx-auto fill-current" />
          <h3 className="text-lg font-bold text-ceylon-navy">
            {wishlist.length} Experiences Saved in Wishlist
          </h3>
          <p className="text-xs text-ceylon-muted">Click any saved tour to view availability and book.</p>
          <Link
            href="/tours"
            className="inline-block px-5 py-2.5 bg-ceylon-green text-white text-xs font-bold rounded-xl"
          >
            Explore All Tours
          </Link>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-4 max-w-xl">
          <h3 className="font-extrabold text-base text-ceylon-navy">Account Details</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="John Watson"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-ceylon-navy"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                defaultValue="john.watson@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-ceylon-navy"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                defaultValue="+1 555 234 5678"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-ceylon-navy"
              />
            </div>
          </div>
          <button className="px-5 py-2.5 bg-ceylon-navy text-white text-xs font-bold rounded-xl">
            Save Profile Changes
          </button>
        </div>
      )}
    </div>
  );
}
