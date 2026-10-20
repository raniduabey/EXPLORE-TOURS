"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, Users, ChevronDown, Zap, ShieldCheck, X } from "lucide-react";
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
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  // Dynamic default date: tomorrow
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const minDateStr = getTomorrowStr();
  const paramDate = searchParams?.get("date");
  const paramAdults = searchParams?.get("adults");
  const paramChildren = searchParams?.get("children");

  const initialDate = paramDate && paramDate >= minDateStr ? paramDate : minDateStr;
  const initialAdults = paramAdults ? Math.max(1, Number(paramAdults)) : 2;
  const initialChildren = paramChildren ? Math.max(0, Number(paramChildren)) : 0;

  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState("07:00 AM");
  const [adults, setAdults] = useState(initialAdults);
  const [childrenCount, setChildrenCount] = useState(initialChildren);
  const [pickup, setPickup] = useState("");
  const [openTravellerModal, setOpenTravellerModal] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Calculate cancellation deadline
  let cancelDeadlineText = "24 hours prior to departure";
  try {
    const cd = new Date(date);
    if (!isNaN(cd.getTime())) {
      cd.setDate(cd.getDate() - 1);
      cancelDeadlineText = `${cd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at ${time}`;
    }
  } catch (e) {}

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
      <div className="hidden lg:block bg-white rounded-3xl p-6 border border-[#E7E2D8] shadow-sm sticky top-28 space-y-6">
        <div className="pb-4 border-b border-[#E7E2D8] flex items-end justify-between">
          <div>
            {previousPrice && (
              <span className="text-xs text-slate-400 line-through block">
                {formatPrice(previousPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-sans font-semibold text-2xl sm:text-[28px] tabular-nums text-[#15392D]">
                {formatPrice(price)}
              </span>
              <span className="text-xs text-[#59645E]">/ person</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            Best Price Guaranteed
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#15392D] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C5A46B]" />
              Select Date
            </label>
            <input
              type="date"
              value={date}
              min={minDateStr}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#15392D] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A46B]" />
              Starting Time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D]"
            >
              <option value="06:30 AM">06:30 AM (Recommended for Sunrise)</option>
              <option value="07:00 AM">07:00 AM</option>
              <option value="08:30 AM">08:30 AM</option>
              <option value="01:30 PM">01:30 PM (Afternoon)</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-[11px] font-semibold text-[#15392D] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#C5A46B]" />
              Travellers
            </label>
            <div
              onClick={() => setOpenTravellerModal(!openTravellerModal)}
              className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] cursor-pointer flex items-center justify-between hover:border-[#15392D]"
            >
              <span>
                {adults} Adults{childrenCount > 0 ? `, ${childrenCount} Kids` : ""}
              </span>
              <ChevronDown className="w-4 h-4 text-[#59645E]/60" />
            </div>

            {openTravellerModal && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#E7E2D8] p-4 z-50 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#15392D]">Adults (12+ yrs)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-lg bg-[#F8F7F3] border border-[#E7E2D8] font-bold text-[#15392D] hover:bg-[#F0ECE4]"
                    >
                      -
                    </button>
                    <span className="text-[#15392D] font-bold">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-lg bg-[#F8F7F3] border border-[#E7E2D8] font-bold text-[#15392D] hover:bg-[#F0ECE4]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#15392D]">Children (2-11 yrs)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      className="w-7 h-7 rounded-lg bg-[#F8F7F3] border border-[#E7E2D8] font-bold text-[#15392D] hover:bg-[#F0ECE4]"
                    >
                      -
                    </button>
                    <span className="text-[#15392D] font-bold">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount(childrenCount + 1)}
                      className="w-7 h-7 rounded-lg bg-[#F8F7F3] border border-[#E7E2D8] font-bold text-[#15392D] hover:bg-[#F0ECE4]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#15392D] uppercase tracking-wider mb-1.5">
              Hotel / Pickup Location
            </label>
            <input
              type="text"
              placeholder="e.g. Cinnamon Grand Colombo or Kandy Hotel"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D]"
            />
          </div>
        </div>

        {/* Cancellation deadline banner */}
        <div className="text-[11px] text-emerald-800 bg-emerald-50/90 border border-emerald-200/70 rounded-xl p-2.5 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Free Cancellation</span>
            <span className="text-slate-600">Full refund if cancelled before <strong>{cancelDeadlineText}</strong></span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E7E2D8] flex items-center justify-between text-sm font-semibold text-[#15392D]">
          <span>Total Calculation:</span>
          <span className="font-sans font-semibold text-xl sm:text-2xl tabular-nums text-[#15392D]">{formatPrice(total)}</span>
        </div>

        <button
          onClick={handleBooking}
          className="w-full py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase text-white bg-[#15392D] hover:bg-[#1E4D3D] shadow transition-all transform hover:-translate-y-0.5"
        >
          Book Now
        </button>

        <div className="pt-2 space-y-2 text-[11px] text-[#59645E] text-center">
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Confirmation • Secure Checkout</span>
          </div>
          <p className="text-[10px] text-[#59645E]/60">
            Accepted: PayHere, Stripe, PayPal, Visa, Mastercard
          </p>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E2D8] px-4 pt-3 pb-[calc(0.85rem+env(safe-area-inset-bottom,0px))] shadow-2xl flex items-center justify-between touch-manipulation">
        <div>
          <span className="text-[10px] text-[#59645E]/70 block font-medium">Starting From</span>
          <div className="flex items-baseline gap-1">
            <span className="font-sans font-semibold text-lg sm:text-xl tabular-nums text-[#15392D]">
              {formatPrice(price)}
            </span>
            <span className="text-[10px] text-[#59645E]">/ person</span>
          </div>
        </div>
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase text-white bg-[#15392D] hover:bg-[#1E4D3D] shadow active:scale-95 transition-all"
        >
          Check Availability & Book
        </button>
      </div>

      {/* Mobile Booking Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl border-t border-[#E7E2D8] z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D8]">
              <div className="pr-2">
                <span className="text-[10px] font-semibold text-[#C5A46B] uppercase tracking-wider block">
                  Reserve Journey
                </span>
                <h3 className="font-serif font-semibold text-base text-[#15392D] line-clamp-1">
                  {tourTitle}
                </h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-full text-[#59645E]/60 hover:text-[#15392D] hover:bg-[#F8F7F3] transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#15392D] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A46B]" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={date}
                  min={minDateStr}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] focus:outline-none focus:border-[#15392D]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#15392D] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C5A46B]" />
                  Departure Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] focus:outline-none focus:border-[#15392D]"
                >
                  <option value="06:30 AM">06:30 AM (Sunrise departure)</option>
                  <option value="07:00 AM">07:00 AM</option>
                  <option value="08:30 AM">08:30 AM</option>
                  <option value="01:30 PM">01:30 PM (Afternoon)</option>
                </select>
              </div>
            </div>

            {/* Travellers */}
            <div className="bg-[#F8F7F3] rounded-2xl p-3.5 border border-[#E7E2D8] space-y-3">
              <label className="block text-[11px] font-semibold text-[#15392D] uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#C5A46B]" />
                Select Travellers
              </label>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-[#15392D] font-semibold block">Adults (12+ yrs)</span>
                  <span className="text-[11px] text-[#59645E]/70 font-normal">{formatPrice(price)} / person</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E7E2D8] font-bold flex items-center justify-center text-[#15392D] active:bg-[#F0ECE4]"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-[#15392D]">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E7E2D8] font-bold flex items-center justify-center text-[#15392D] active:bg-[#F0ECE4]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-[#E7E2D8]">
                <div>
                  <span className="text-[#15392D] font-semibold block">Children (2-11 yrs)</span>
                  <span className="text-[11px] text-[#59645E]/70 font-normal">{formatPrice(price * 0.7)} (30% off)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E7E2D8] font-bold flex items-center justify-center text-[#15392D] active:bg-[#F0ECE4]"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-[#15392D]">{childrenCount}</span>
                  <button
                    type="button"
                    onClick={() => setChildrenCount(childrenCount + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E7E2D8] font-bold flex items-center justify-center text-[#15392D] active:bg-[#F0ECE4]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Hotel Pickup */}
            <div>
              <label className="block text-[11px] font-semibold text-[#15392D] uppercase tracking-wider mb-1">
                Hotel / Pickup Location
              </label>
              <input
                type="text"
                placeholder="e.g. Cinnamon Grand Colombo or Kandy Hotel"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:border-[#15392D]"
              />
            </div>

            {/* Free Cancellation Notice */}
            <div className="text-[11px] text-emerald-800 bg-emerald-50/90 border border-emerald-200/70 rounded-xl p-2.5 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Free Cancellation Guarantee</span>
                <span className="text-slate-600">Full refund if cancelled before <strong>{cancelDeadlineText}</strong></span>
              </div>
            </div>

            {/* Total and CTA */}
            <div className="pt-2 border-t border-[#E7E2D8] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#59645E]/70 font-medium block">Total Calculated</span>
                <span className="font-sans font-semibold text-2xl tabular-nums text-[#15392D]">{formatPrice(total)}</span>
              </div>
              <button
                onClick={handleBooking}
                className="px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#15392D] hover:bg-[#1E4D3D] shadow"
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
