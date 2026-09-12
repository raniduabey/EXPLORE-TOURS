"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Lock, Trash2, ShieldCheck, Ticket } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const [pickupLocation, setPickupLocation] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PayHere");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const item = cart[0];
  const subtotal = item ? item.totalPrice : 0;
  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyPromo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === "EXPLORE15") {
      setDiscount(subtotal * 0.15);
      setDiscountApplied(true);
      setPromoMessage("15% EXPLORE15 discount applied!");
    } else if (promoCode.toUpperCase() === "CEYLON20") {
      setDiscount(20);
      setDiscountApplied(true);
      setPromoMessage("$20 CEYLON20 discount applied!");
    } else {
      setPromoMessage("Invalid promo code");
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: item.tourId,
          tourDate: item.tourDate,
          tourTime: item.tourTime,
          adults: item.adults,
          children: item.childrenCount,
          guestName: `${firstName} ${lastName}`,
          guestEmail: email,
          guestPhone: phone,
          guestCountry: country,
          pickupLocation: pickupLocation || item.pickupLocation,
          specialRequests,
          totalAmount: finalTotal,
          currency,
          paymentMethod,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        router.push(`/booking/confirmation/${data.bookingRef}`);
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking submission error", err);
      alert("Error submitting booking.");
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen py-20 px-4 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
          <Ticket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-ceylon-navy">
          Your Booking Cart is Empty
        </h2>
        <p className="text-xs text-ceylon-muted">
          Select an experience to proceed with instant checkout.
        </p>
        <button
          onClick={() => router.push("/tours")}
          className="px-6 py-2.5 bg-ceylon-green text-white font-bold text-xs rounded-xl"
        >
          Explore Tours
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-ceylon-green uppercase tracking-wider block">
            Frictionless Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ceylon-navy">
            Secure Tour Reservation
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-bit SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <div
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${
                step === 1
                  ? "text-ceylon-blue border-b-2 border-ceylon-blue pb-1"
                  : "text-slate-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-ceylon-softblue flex items-center justify-center text-[10px]">
                1
              </span>
              <span>1. Traveller Details</span>
            </div>
            <span className="text-slate-300">•</span>
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                step === 2
                  ? "text-ceylon-blue border-b-2 border-ceylon-blue pb-1"
                  : "text-slate-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-ceylon-softblue flex items-center justify-center text-[10px]">
                2
              </span>
              <span>2. Payment & Confirmation</span>
            </div>
          </div>

          {step === 1 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6"
            >
              <h3 className="font-extrabold text-base text-ceylon-navy">
                Contact & Guest Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Email Address (For Voucher) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Hotel / Pickup Address
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Cinnamon Grand Colombo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Dietary requirements, child seats, language preference..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-ceylon-text focus:outline-none focus:border-ceylon-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-ceylon-green hover:bg-ceylon-darkgreen text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
              >
                Continue to Payment
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleFinalSubmit}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-ceylon-navy">
                  Select Payment Gateway
                </h3>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-ceylon-blue hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Guest Details</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "PayHere", title: "PayHere (Sri Lanka Gateway)", desc: "Supports LKR/USD Card Payments", badge: "Recommended" },
                  { id: "Stripe", title: "Stripe Secure Card", desc: "Visa, Mastercard, Amex, Apple Pay", badge: "" },
                  { id: "PayPal", title: "PayPal Instant Express", desc: "Pay securely with your PayPal account", badge: "" },
                  { id: "Card", title: "Credit / Debit Card", desc: "Instant tokenized payment processing", badge: "" }
                ].map((gateway) => (
                  <div
                    key={gateway.id}
                    onClick={() => setPaymentMethod(gateway.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === gateway.id
                        ? "border-ceylon-blue bg-ceylon-softblue/60"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-ceylon-navy">{gateway.title}</span>
                      {gateway.badge && (
                        <span className="text-[10px] font-bold bg-ceylon-blue text-white px-2 py-0.5 rounded">
                          {gateway.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-ceylon-muted">{gateway.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-ceylon-navy mb-1.5">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try EXPLORE15 or CEYLON20"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-ceylon-navy text-white text-xs font-bold rounded-xl"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-xs mt-1.5 font-bold ${discountApplied ? "text-ceylon-green" : "text-rose-500"}`}>
                    {promoMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-ceylon-green hover:bg-ceylon-darkgreen text-white font-extrabold text-sm rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {loading ? "Processing Reservation..." : `Pay ${formatPrice(finalTotal)} & Confirm`}
                </span>
              </button>

              <div className="text-[11px] text-ceylon-muted text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-ceylon-green" />
                <span>Instant Confirmation & Instant PDF Voucher Generation</span>
              </div>
            </form>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card sticky top-28 space-y-5">
            <h3 className="font-extrabold text-base text-ceylon-navy pb-3 border-b border-slate-100">
              Booking Summary
            </h3>
            <div className="flex gap-3">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <Image
                  src={item.tourImage}
                  alt={item.tourTitle}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-extrabold text-xs text-ceylon-navy line-clamp-2">
                  {item.tourTitle}
                </h4>
                <p className="text-[11px] text-ceylon-muted">{item.location}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-ceylon-muted">Date:</span>
                <span className="font-bold">{item.tourDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ceylon-muted">Time:</span>
                <span className="font-bold">{item.tourTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ceylon-muted">Guests:</span>
                <span className="font-bold">
                  {item.adults} Adults{item.childrenCount > 0 ? `, ${item.childrenCount} Kids` : ""}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-ceylon-muted">
                <span>Subtotal:</span>
                <span className="font-bold text-ceylon-navy">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-ceylon-green font-bold">
                  <span>Discount:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-ceylon-navy pt-2 border-t border-slate-100">
                <span>Total Amount:</span>
                <span className="text-lg text-ceylon-blue">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => removeFromCart(item.tourId)}
              className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1 pt-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Tour</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
