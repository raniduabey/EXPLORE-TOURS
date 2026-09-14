/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Download,
  Printer,
  Compass,
  Calendar,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Phone,
  Mail
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { siteConfig } from "@/config/site";
import confetti from "canvas-confetti";
import jsPDF from "jspdf";

export default function BookingConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const { formatPrice } = useCurrency();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}
        } else {
          setErrorMsg("Booking not found or expired. Please check your reference code or contact support.");
        }
      } catch (err) {
        console.error("Booking retrieval error", err);
        setErrorMsg("Failed to retrieve booking details. Please try again or contact support.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [params.id]);

  const handleDownloadPDF = () => {
    if (!booking) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(7, 81, 125);
    doc.text(siteConfig.name.toUpperCase(), 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(37, 132, 55);
    doc.text("OFFICIAL TOUR CONFIRMATION VOUCHER", 20, 32);
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 38, 190, 38);
    doc.setFontSize(12);
    doc.setTextColor(23, 34, 43);
    doc.text(`Booking Reference: ${booking.bookingRef}`, 20, 50);
    doc.text(`Guest Name: ${booking.guestName}`, 20, 60);
    doc.text(`Tour: ${booking.tour?.title || "Sri Lanka Tour"}`, 20, 70);
    doc.text(`Date & Time: ${booking.tourDate} at ${booking.tourTime}`, 20, 80);
    doc.text(`Location: ${booking.tour?.location || "Sri Lanka"}`, 20, 90);
    doc.text(`Pickup Point: ${booking.pickupLocation}`, 20, 100);
    doc.text(`Guests: ${booking.adults} Adults, ${booking.children} Children`, 20, 110);
    doc.text(
      `Total Amount: $${(booking.totalAmount || 0).toFixed(2)} (${booking.paymentMethod})`,
      20,
      120
    );
    doc.setFontSize(10);
    doc.setTextColor(100, 114, 125);
    doc.text("Important Instructions & Policies:", 20, 140);
    doc.text("• Please present this digital voucher or QR code to your driver/guide upon pickup.", 20, 148);
    doc.text(`• 24/7 Customer Support Hotline: ${siteConfig.contact.phone}`, 20, 154);
    doc.text("• Cancellation Policy: 100% refund up to 24 hours prior to departure.", 20, 160);
    doc.save(`Voucher-${booking.bookingRef}.pdf`);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    booking?.bookingRef || params.id
  )}`;

  // Calculate cancellation deadline (24 hours prior)
  let cancelDeadlineText = "24 hours prior to tour departure";
  if (booking?.tourDate) {
    try {
      const tourD = new Date(booking.tourDate);
      if (!isNaN(tourD.getTime())) {
        tourD.setDate(tourD.getDate() - 1);
        cancelDeadlineText = `${tourD.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at ${booking.tourTime || "07:00 AM"}`;
      }
    } catch (e) {}
  }

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center">
        <div className="w-12 h-12 border-4 border-ceylon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-ceylon-navy">
          Retrieving Tour Confirmation Voucher...
        </p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen py-24 px-4 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-ceylon-navy">Booking Reference Not Found</h2>
        <p className="text-sm text-slate-600">
          We couldn&apos;t find an active reservation for reference code <code className="bg-slate-100 px-2 py-1 rounded font-mono font-bold text-ceylon-navy">{params.id}</code>.
        </p>
        <p className="text-xs text-slate-500">
          If you just placed a booking, please allow a few moments or verify your confirmation email. For immediate assistance, contact our 24/7 hotline at <strong className="text-ceylon-navy">{siteConfig.contact.phone}</strong>.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Link
            href="/account"
            className="px-5 py-2.5 bg-ceylon-navy text-white rounded-xl text-xs font-bold hover:bg-ceylon-blue transition-colors"
          >
            Find My Booking
          </Link>
          <Link
            href="/tours"
            className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            Browse Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-ceylon-green flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10 stroke-[2.5]" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-ceylon-green block">
          Booking Confirmed!
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ceylon-navy tracking-tight">
          Your Sri Lanka Adventure is Booked!
        </h1>
        <p className="text-xs text-ceylon-muted max-w-md mx-auto">
          We\'ve sent your official booking confirmation and voucher to{" "}
          <strong className="text-ceylon-navy">{booking.guestEmail}</strong>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2.5 bg-ceylon-green hover:bg-ceylon-darkgreen text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Voucher PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-ceylon-navy rounded-xl font-bold text-xs transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Voucher</span>
          </button>
          <Link
            href="/tours"
            className="px-5 py-2.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore More Experiences</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-ceylon-blue/20 shadow-xl overflow-hidden print:border-none print:shadow-none">
        <div className="bg-ceylon-navy text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-1">
              <Image
                src="/images/logo.png"
                alt={siteConfig.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight uppercase">{siteConfig.name}</h3>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Official Tour Voucher
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-300 uppercase block font-semibold">
              Booking ID
            </span>
            <span className="text-lg font-mono font-extrabold text-emerald-400">
              {booking.bookingRef}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Experience Title
              </span>
              <h2 className="text-xl font-extrabold text-ceylon-navy">
                {booking.tour?.title}
              </h2>
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-ceylon-muted block">Date & Time</span>
                  <span className="font-bold text-ceylon-navy flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-ceylon-blue" />
                    {booking.tourDate} at {booking.tourTime}
                  </span>
                </div>
                <div>
                  <span className="text-ceylon-muted block">Destination</span>
                  <span className="font-bold text-ceylon-navy flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-ceylon-green" />
                    {booking.tour?.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              {/* External QR Image from public QR generator */}
              <img
                src={qrUrl}
                alt="Voucher QR Code"
                width={110}
                height={110}
                className="rounded"
              />
              <span className="text-[10px] font-mono text-slate-400 mt-2">
                Scan at Pickup
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-ceylon-muted block">Guest Name</span>
              <span className="font-bold text-ceylon-navy">{booking.guestName}</span>
            </div>
            <div>
              <span className="text-ceylon-muted block">Contact Phone</span>
              <span className="font-bold text-ceylon-navy">{booking.guestPhone}</span>
            </div>
            <div>
              <span className="text-ceylon-muted block">Travellers Count</span>
              <span className="font-bold text-ceylon-navy">
                {booking.adults} Adults, {booking.children} Kids
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-ceylon-softblue/60 border border-ceylon-blue/20 text-xs space-y-1">
            <span className="font-bold text-ceylon-navy block">Pickup / Departure Instructions:</span>
            <p className="text-slate-700">{booking.pickupLocation}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-ceylon-green flex-shrink-0" />
            <span className="text-emerald-950 font-medium">
              <strong>Free Cancellation Deadline:</strong> 100% full refund if cancelled before <strong>{cancelDeadlineText}</strong>.
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 px-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-ceylon-muted gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-ceylon-green" />
            <span>Paid via {booking.paymentMethod} • Status: <strong className="text-ceylon-green uppercase">{booking.status || "CONFIRMED"}</strong></span>
          </div>
          <span>Support Hotline: <strong>{siteConfig.contact.phone}</strong></span>
        </div>
      </div>
    </div>
  );
}
