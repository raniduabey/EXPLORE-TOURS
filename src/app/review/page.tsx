"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  Compass,
  ArrowRight,
} from "lucide-react";
import { siteConfig } from "@/config/site";

function ReviewFormContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const initialRef = searchParams.get("ref") || "";
  const initialEmail = searchParams.get("email") || "";

  const [bookingRef, setBookingRef] = useState(initialRef);
  const [guestEmail, setGuestEmail] = useState(initialEmail);
  const [guestName, setGuestName] = useState("");
  const [tourTitle, setTourTitle] = useState("");
  const [verifiedInfo, setVerifiedInfo] = useState<any>(null);

  const [rating, setRating] = useState(5);
  const [guideRating, setGuideRating] = useState(5);
  const [transportRating, setTransportRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(Boolean(token || (initialRef && initialEmail)));
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function verifyInitial() {
      if (!token && (!initialRef || !initialEmail)) return;
      setVerifying(true);
      setErrorMsg("");
      try {
        const params = new URLSearchParams();
        if (token) params.set("token", token);
        if (initialRef) params.set("ref", initialRef);
        if (initialEmail) params.set("email", initialEmail);

        const res = await fetch(`/api/reviews/verify?${params.toString()}`);
        const data = await res.json();
        if (res.ok && data.valid) {
          setVerifiedInfo(data);
          setBookingRef(data.bookingRef);
          setGuestEmail(data.guestEmail);
          setGuestName(data.guestName);
          setTourTitle(data.tourTitle);
        } else {
          setErrorMsg(data.error || "Unable to verify booking or invitation token.");
        }
      } catch (e) {
        setErrorMsg("Failed to verify review invitation.");
      } finally {
        setVerifying(false);
      }
    }
    verifyInitial();
  }, [token, initialRef, initialEmail]);

  const handleManualLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef || !guestEmail) {
      setErrorMsg("Please enter both your Booking Reference and Email.");
      return;
    }
    setVerifying(true);
    setErrorMsg("");
    try {
      const res = await fetch(
        `/api/reviews/verify?ref=${encodeURIComponent(bookingRef)}&email=${encodeURIComponent(
          guestEmail
        )}`
      );
      const data = await res.json();
      if (res.ok && data.valid) {
        setVerifiedInfo(data);
        setGuestName(data.guestName);
        setTourTitle(data.tourTitle);
      } else {
        setErrorMsg(
          data.error ||
            "No completed booking found with those credentials. Reviews are eligible only after tour completion."
        );
      }
    } catch (e) {
      setErrorMsg("Network error verifying booking.");
    } finally {
      setVerifying(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB limit
    if (file.size > MAX_FILE_SIZE) {
      alert("Image must be smaller than 8 MB.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        setPhotoUrl(data.url);
      } else {
        alert(data.error || "Photo upload failed. You may still submit your written review.");
      }
    } catch (e: any) {
      alert(`Error uploading photograph: ${e?.message || "Please check connection."}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token || undefined,
          bookingRef: verifiedInfo?.bookingRef || bookingRef,
          guestEmail: verifiedInfo?.guestEmail || guestEmail,
          userName: guestName,
          rating,
          guideRating,
          transportRating,
          comment,
          photoUrl: photoUrl || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || "Failed to submit review. Please try again.");
      }
    } catch (e) {
      setErrorMsg("Network error submitting review.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ceylon-navy">
            Thank You for Your Feedback!
          </h2>
          <p className="text-xs sm:text-sm text-ceylon-muted max-w-md mx-auto leading-relaxed">
            Your review has been securely submitted with <strong>Pending status</strong>. Our moderation team reviews all customer submissions to ensure authenticity before publication on {siteConfig.name}.
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-bold rounded-xl shadow transition-colors"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-ceylon-navy rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Customer Review Submission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Share Your Ceylon Experience
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          We value honest, unfiltered feedback. Only guests with completed bookings are eligible to review their tour.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Verification Step (if not yet verified) */}
      {!verifiedInfo && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-ceylon-navy">
            1. Verify Your Completed Reservation
          </h2>
          <p className="text-xs text-ceylon-muted">
            Enter your booking reference from your digital voucher to unlock the review submission form.
          </p>

          <form onSubmit={handleManualLookup} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-ceylon-navy mb-1">
                Booking Reference
              </label>
              <input
                type="text"
                placeholder="e.g. CET-2026-92812"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs uppercase font-mono text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ceylon-navy mb-1">
                Customer Email
              </label>
              <input
                type="email"
                placeholder="yourname@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={verifying}
                className="w-full py-2.5 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-extrabold rounded-xl shadow transition-colors"
              >
                {verifying ? "Verifying..." : "Verify Booking"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review Submission Form (Once verified) */}
      {verifiedInfo && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900">
            <div>
              <span className="font-extrabold block">{tourTitle}</span>
              <span className="text-emerald-700">
                Booking Reference: {bookingRef} • Travel Date: {verifiedInfo.tourDate}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-200 text-emerald-900 font-extrabold text-[10px] uppercase">
              Verified Eligible
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ceylon-navy mb-1">
                Your Display Name
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ceylon-navy mb-1">
                Email (Private, not published)
              </label>
              <input
                type="email"
                value={guestEmail}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Overall Rating */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-ceylon-navy">
              Overall Tour Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? "text-amber-400 fill-current" : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-extrabold text-ceylon-navy">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Sub-ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Local Chauffeur / Guide Rating
              </label>
              <select
                value={guideRating}
                onChange={(e) => setGuideRating(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-ceylon-text"
              >
                <option value="5">5 - Exceptional</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Satisfactory</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Vehicle & Comfort Rating
              </label>
              <select
                value={transportRating}
                onChange={(e) => setTransportRating(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-ceylon-text"
              >
                <option value="5">5 - Pristine & Comfortable</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Adequate</option>
                <option value="2">2 - Needs Improvement</option>
                <option value="1">1 - Disappointing</option>
              </select>
            </div>
          </div>

          {/* Written review */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-ceylon-navy">
              Written Review & Experience
            </label>
            <textarea
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell future travellers about your experience with our guides, sights visited, pace, and recommendations..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-ceylon-text focus:outline-none focus:border-ceylon-blue"
              required
            />
            <span className="text-[11px] text-slate-400">
              Minimum 10 characters required.
            </span>
          </div>

          {/* Optional Photo Upload */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-ceylon-navy">
              Add a Photograph from Your Trip (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-ceylon-navy cursor-pointer flex items-center gap-2 border border-slate-200">
                <Upload className="w-3.5 h-3.5 text-ceylon-blue" />
                <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {photoUrl && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Photo attached</span>
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-3 bg-ceylon-green hover:bg-ceylon-darkgreen text-white text-xs font-extrabold rounded-xl shadow transition-colors"
            >
              {loading ? "Submitting..." : "Submit Review for Moderation"}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Reviews are verified against completed booking records and published upon admin moderation.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs">Loading review system...</div>}>
      <ReviewFormContent />
    </Suspense>
  );
}
