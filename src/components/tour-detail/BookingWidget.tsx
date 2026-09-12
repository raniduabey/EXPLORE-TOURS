"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Users, ChevronDown, Zap } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";

interface BookingWidgetProps {
  tourId: string;
  tourTitle: string;
  tourSlug: string;
  tourImage: string;
  location: string;
  price: number;
  previousPrice?: number | null;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  tourId,
  tourTitle,
  tourSlug,
  tourImage,
  location,
  price,
  previousPrice,
}) => {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const [date, setDate] = useState("2026-09-15");
  const [time, setTime] = useState("07:00 AM");
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [pickup, setPickup] = useState("");
  const [openTravellerModal, setOpenTravellerModal] = useState(false);

  const total = adults * price + price * 0.7 * childrenCount;

  const handleBooking = () => {
    addToCart({
      tourId,
      tourTitle,
      tourSlug,
      tourImage,
      location,
      tourDate: date,
      tourTime: time,
      adults,
      childrenCount,
      infants: 0,
      pickupLocation: pickup || "Hotel Lobby / City Center",
      pricePerAdult: price,
      pricePerChild: price * 0.7,
      totalPrice: total,
    });
    router.push("/checkout");
  };

  return (
    <>
      <div className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card sticky top-28 space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-end justify-between">
          <div>
            {previousPrice && (
              <span className="text-xs text-slate-400 line-through block">
                {formatPrice(previousPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-ceylon-navy">
                {formatPrice(price)}
              </span>
              <span className="text-xs text-ceylon-muted">/ person</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            Best Price Guaranteed
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-ceylon-navy uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-ceylon-blue" />
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text focus:outline-none focus:border-ceylon-blue"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ceylon-navy uppercase tracking-wider mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-ceylon-blue" />
              Starting Time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text focus:outline-none focus:border-ceylon-blue"
            >
              <option value="06:30 AM">06:30 AM (Recommended for Sunrise)</option>
              <option value="07:00 AM">07:00 AM</option>
              <option value="08:30 AM">08:30 AM</option>
              <option value="01:30 PM">01:30 PM (Afternoon)</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-[11px] font-bold text-ceylon-navy uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-ceylon-blue" />
              Travellers
            </label>
            <div
              onClick={() => setOpenTravellerModal(!openTravellerModal)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ceylon-text cursor-pointer flex items-center justify-between hover:border-ceylon-blue"
            >
              <span>
                {adults} Adults{childrenCount > 0 ? `, ${childrenCount} Kids` : ""}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {openTravellerModal && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-dropdown border border-slate-100 p-4 z-50 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Adults (12+ yrs)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-6 h-6 rounded bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <span>{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-6 h-6 rounded bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Children (2-11 yrs)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      className="w-6 h-6 rounded bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <span>{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount(childrenCount + 1)}
                      className="w-6 h-6 rounded bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ceylon-navy uppercase tracking-wider mb-1">
              Hotel / Pickup Location
            </label>
            <input
              type="text"
              placeholder="e.g. Cinnamon Grand Colombo or Kandy Hotel"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-ceylon-text focus:outline-none focus:border-ceylon-blue"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-ceylon-navy">
          <span>Total Calculation:</span>
          <span className="text-xl text-ceylon-blue">{formatPrice(total)}</span>
        </div>

        <button
          onClick={handleBooking}
          className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white bg-ceylon-green hover:bg-ceylon-darkgreen shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          Book Now
        </button>

        <div className="pt-2 space-y-2 text-[11px] text-ceylon-muted text-center">
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Confirmation • Secure Checkout</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Accepted: PayHere, Stripe, PayPal, Visa, Mastercard
          </p>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Starting From</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-ceylon-navy">
              {formatPrice(price)}
            </span>
            <span className="text-[10px] text-ceylon-muted">/ person</span>
          </div>
        </div>
        <button
          onClick={handleBooking}
          className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-white bg-ceylon-green shadow-md"
        >
          Check Availability & Book
        </button>
      </div>
    </>
  );
};
