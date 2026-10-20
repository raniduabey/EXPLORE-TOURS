"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, ArrowRight, ArrowLeft, Send, MessageCircle, Calendar, Users, MapPin, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { siteConfig } from "@/config/site";

interface TailorMadeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TailorMadeModal: React.FC<TailorMadeModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState("8-10 Days");
  const [travelMonth, setTravelMonth] = useState("Next 3 Months");
  const [travelers, setTravelers] = useState("2 Adults");
  const [style, setStyle] = useState<string[]>(["Culture & Heritage", "Scenic Train & Tea", "Wildlife Safari"]);
  const [destinations, setDestinations] = useState<string[]>(["Sigiriya", "Ella", "Yala", "Galle"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isOpen) {
      // reset state on close after animation
      const timer = setTimeout(() => {
        setStep(1);
        setSubmitted(false);
        setErrorMsg("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleStyle = (s: string) => {
    setStyle((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleDest = (d: string) => {
    setDestinations((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          travelDates: travelMonth,
          duration,
          travelers,
          destinations: JSON.stringify(destinations),
          interests: JSON.stringify(style),
          specialNotes: notes.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Unable to save itinerary request. Please check your entries and try again.");
      }
    } catch (err) {
      console.error("Trip submission error:", err);
      setErrorMsg("A network error occurred. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const waText = encodeURIComponent(
    `Hello ${siteConfig.name}! I'd like to plan a custom Sri Lanka trip:\n` +
      `• Name: ${name || "Traveler"}\n` +
      `• Duration: ${duration}\n` +
      `• When: ${travelMonth}\n` +
      `• Travelers: ${travelers}\n` +
      `• Must-Visit: ${destinations.join(", ")}\n` +
      `• Interests: ${style.join(", ")}`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="bg-[#15392D] text-white p-6 sm:p-8 relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A46B]/20 text-[#C5A46B] text-[11px] font-bold uppercase tracking-wider mb-2 border border-[#C5A46B]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A46B]" />
                <span>Bespoke Island Itinerary Service</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight">
                Design Your Dream Sri Lanka Vacation
              </h3>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-lg font-sans">
                Crafted by licensed local travel planners within 24 hours. 100% free, personalized & no obligation.
              </p>

              {/* Step indicator */}
              {!submitted && (
                <div className="flex items-center gap-2 mt-4">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s === step
                          ? "w-8 bg-[#C5A46B]"
                          : s < step
                          ? "w-4 bg-white/60"
                          : "w-4 bg-white/20"
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-white/80 ml-2 font-medium">
                    Step {step} of 3
                  </span>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#C5A46B]/15 text-[#15392D] flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-[#C5A46B]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-serif font-normal text-[#15392D]">
                      Itinerary Request Received!
                    </h4>
                    <p className="text-xs sm:text-sm text-[#59645E] max-w-md mx-auto font-sans">
                      Thank you! Our Senior Tour Specialist is already reviewing your preferences and will email your personalized proposal within 24 hours.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Chat Immediately on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-6 py-3 bg-[#F8F7F3] hover:bg-[#F0ECE4] text-[#15392D] border border-[#E7E2D8] rounded-xl text-xs font-bold transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Duration & Dates */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-xs font-bold text-[#15392D] uppercase tracking-wider mb-2">
                          1. How long would you like to explore Sri Lanka?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {["5-7 Days", "8-10 Days", "11-14 Days", "15-21 Days"].map((dur) => (
                            <button
                              key={dur}
                              type="button"
                              onClick={() => setDuration(dur)}
                              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                                duration === dur
                                  ? "border-[#15392D] bg-[#F8F7F3] text-[#15392D] ring-2 ring-[#15392D]/20"
                                  : "border-[#E7E2D8] text-[#59645E] hover:border-[#15392D]/40"
                              }`}
                            >
                              {dur}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#15392D] uppercase tracking-wider mb-2">
                          2. When do you plan to arrive?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {["Within 1 Month", "In 2-3 Months", "In 4-6 Months", "Next Season (Winter)", "Next Year", "Undecided"].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setTravelMonth(m)}
                              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                travelMonth === m
                                  ? "border-[#15392D] bg-[#F8F7F3] text-[#15392D] ring-2 ring-[#15392D]/20"
                                  : "border-[#E7E2D8] text-[#59645E] hover:border-[#15392D]/40"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#15392D] uppercase tracking-wider mb-2">
                          3. Who is traveling?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {["Solo Traveler", "Couple / 2 Adults", "Family with Kids", "Small Group (4+)"].map((tr) => (
                            <button
                              key={tr}
                              type="button"
                              onClick={() => setTravelers(tr)}
                              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                travelers === tr
                                  ? "border-[#15392D] bg-[#F8F7F3] text-[#15392D] ring-2 ring-[#15392D]/20"
                                  : "border-[#E7E2D8] text-[#59645E] hover:border-[#15392D]/40"
                              }`}
                            >
                              {tr}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-3">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-6 py-3 bg-[#15392D] hover:bg-[#1E4D3D] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md"
                        >
                          <span>Next: Interests & Places</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Interests & Must-See Places */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-xs font-bold text-[#15392D] uppercase tracking-wider mb-2">
                          4. What experiences interest you most? (Select multiple)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            "Culture & Heritage",
                            "Scenic Train & Tea",
                            "Wildlife Safari",
                            "Beaches & Surfing",
                            "Blue Whale Watching",
                            "Adventure & Trekking",
                            "Local Village Life",
                            "Ayurveda & Spa",
                            "Colonial Forts",
                          ].map((item) => {
                            const active = style.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleStyle(item)}
                                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                                  active
                                    ? "border-[#15392D] bg-[#F8F7F3] text-[#15392D] font-bold"
                                    : "border-[#E7E2D8] text-[#59645E] hover:border-[#15392D]/40"
                                }`}
                              >
                                <span>{item}</span>
                                {active && <Check className="w-3.5 h-3.5 text-[#15392D]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#15392D] uppercase tracking-wider mb-2">
                          5. Which key destinations would you love to include?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            "Sigiriya",
                            "Kandy",
                            "Ella",
                            "Yala",
                            "Galle Fort",
                            "Mirissa",
                            "Nuwara Eliya",
                            "Trincomalee",
                          ].map((dest) => {
                            const active = destinations.includes(dest);
                            return (
                              <button
                                key={dest}
                                type="button"
                                onClick={() => toggleDest(dest)}
                                className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                                  active
                                    ? "border-[#15392D] bg-[#F8F7F3] text-[#15392D] font-bold"
                                    : "border-[#E7E2D8] text-[#59645E] hover:border-[#15392D]/40"
                                }`}
                              >
                                <span>{dest}</span>
                                {active && <Check className="w-3.5 h-3.5 text-[#15392D]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-5 py-2.5 bg-[#F8F7F3] hover:bg-[#F0ECE4] text-[#15392D] border border-[#E7E2D8] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="px-6 py-3 bg-[#15392D] hover:bg-[#1E4D3D] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md"
                        >
                          <span>Next: Contact Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Contact & Submit */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      {errorMsg && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-2">
                          <span>{errorMsg}</span>
                          <button
                            type="button"
                            onClick={() => setErrorMsg("")}
                            className="text-rose-600 hover:text-rose-900 font-bold underline text-[11px] shrink-0"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#15392D] mb-1">
                            Your Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E7E2D8] text-xs font-medium focus:ring-2 focus:ring-[#15392D] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#15392D] mb-1">
                            Email Address (for proposal PDF) *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sarah@example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E7E2D8] text-xs font-medium focus:ring-2 focus:ring-[#15392D] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#15392D] mb-1">
                            WhatsApp / Phone Number
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+44 7123 456789"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E7E2D8] text-xs font-medium focus:ring-2 focus:ring-[#15392D] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#15392D] mb-1">
                            Any Special Wishes or Requirements?
                          </label>
                          <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. Vegetarian food, luxury villas, 1st class train"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E7E2D8] text-xs font-medium focus:ring-2 focus:ring-[#15392D] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="bg-[#F8F7F3] p-4 rounded-2xl border border-[#E7E2D8] flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#C5A46B] shrink-0 mt-0.5" />
                        <div className="text-[11px] text-[#59645E] leading-relaxed font-sans">
                          <strong className="text-[#15392D]">No Booking Fees or Commitments:</strong> Our native Sri Lankan guides will review your dates, craft the ideal route, calculate direct transparent rates, and send a complete daily plan to your email & WhatsApp.
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-5 py-2.5 bg-[#F8F7F3] hover:bg-[#F0ECE4] text-[#15392D] border border-[#E7E2D8] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back</span>
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-8 py-3 bg-[#15392D] hover:bg-[#1E4D3D] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                          <span>{submitting ? "Sending Request..." : "Submit Custom Itinerary Request"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
