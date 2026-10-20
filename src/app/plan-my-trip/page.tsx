"use client";
import React, { useState } from "react";
import { Sparkles, CheckCircle, Phone, Users, Calendar, MapPin, Check, Send } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CountrySelect } from "@/components/ui/CountrySelect";

export default function PlanMyTripPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const [travelDates, setTravelDates] = useState(getTomorrowStr());
  const [duration, setDuration] = useState("7 Days");
  const [budget, setBudget] = useState("Comfort ($100-$200/day)");
  const [travelers, setTravelers] = useState("2 Adults");
  const [accommodation, setAccommodation] = useState("4-Star Boutique Hotels");
  const [transportation, setTransportation] = useState("Private Chauffeur AC Car");
  const [specialNotes, setSpecialNotes] = useState("");
  const [destinations, setDestinations] = useState<string[]>(["Sigiriya", "Ella", "Yala"]);
  const [interests, setInterests] = useState<string[]>(["Culture", "Wildlife", "Scenic Trains"]);

  const toggleDest = (d: string) => {
    destinations.includes(d)
      ? setDestinations(destinations.filter((x) => x !== d))
      : setDestinations([...destinations, d]);
  };

  const toggleInterest = (int: string) => {
    interests.includes(int)
      ? setInterests(interests.filter((x) => x !== int))
      : setInterests([...interests, int]);
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
          country: country.trim(),
          travelDates,
          duration,
          budget,
          travelers,
          accommodation,
          transportation,
          destinations: JSON.stringify(destinations),
          interests: JSON.stringify(interests),
          specialNotes: specialNotes.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Failed to save your itinerary request. Please check your entries and try again.");
      }
    } catch (err) {
      console.error("Trip submission network error:", err);
      setErrorMsg("A network error occurred. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const waText = encodeURIComponent(
    `Hi ${siteConfig.name}, I submitted a custom trip request!\nName: ${name}\nDuration: ${duration}\nDestinations: ${destinations.join(
      ", "
    )}\nInterests: ${interests.join(", ")}`
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-[#F0ECE4]/60 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-[#E7E2D8] shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#E7E2D8] text-[#15392D] text-xs font-semibold shadow-xs">
          <Sparkles className="w-4 h-4 text-[#C5A46B]" />
          <span>Tailor-Made Island Itineraries</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#15392D] tracking-tight">
          Plan Your Custom Sri Lanka Trip
        </h1>
        <p className="text-sm text-[#59645E] max-w-xl mx-auto font-light leading-relaxed">
          Tell us your ideal travel dates, interests, and budget. Our local Sri Lankan travel specialists will build your personalized trip in 24 hours.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-10 border border-[#E7E2D8] text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#15392D]/10 text-[#15392D] flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-[#C5A46B]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#15392D]">
            Trip Proposal Request Received!
          </h2>
          <p className="text-xs text-[#59645E] max-w-md mx-auto font-light leading-relaxed">
            Our Senior Sri Lanka Travel Specialist will curate your custom itinerary and email your PDF proposal within 24 hours.
          </p>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#15392D] hover:bg-[#1E4D3D] text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow transition-transform active:scale-95"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Connect Immediately on WhatsApp</span>
          </a>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-sm space-y-8"
        >
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-3">
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={() => setErrorMsg("")}
                className="text-rose-600 hover:text-rose-900 font-bold underline text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg text-[#15392D] pb-2 border-b border-[#E7E2D8] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C5A46B]" />
              1. Your Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 987 6543"
                  className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                />
              </div>
              <div>
                <CountrySelect
                  label="Country of Origin"
                  value={country}
                  onChange={(val) => setCountry(val)}
                  placeholder="Select country of origin..."
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg text-[#15392D] pb-2 border-b border-[#E7E2D8] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C5A46B]" />
              2. Dates, Duration & Budget
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                  Estimated Travel Date
                </label>
                <input
                  type="date"
                  value={travelDates}
                  onChange={(e) => setTravelDates(e.target.value)}
                  className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                  Trip Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                >
                  <option value="5-7 Days">5-7 Days (Essential Highlights)</option>
                  <option value="8-10 Days">8-10 Days (Popular Grand Tour)</option>
                  <option value="11-14 Days">11-14 Days (Complete Island Discovery)</option>
                  <option value="15+ Days">15+ Days (Slow Travel & Beaches)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                  Budget Level
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                >
                  <option value="Comfort ($100-$200/day)">Comfort ($100-$200/day)</option>
                  <option value="Luxury ($250-$400/day)">Luxury ($250-$400/day)</option>
                  <option value="Ultra Luxury ($500+/day)">Ultra Luxury ($500+/day)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-semibold text-lg text-[#15392D] pb-2 border-b border-[#E7E2D8] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C5A46B]" />
              3. Which Destinations Interest You Most?
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Sigiriya",
                "Ella",
                "Kandy",
                "Galle",
                "Mirissa",
                "Yala",
                "Nuwara Eliya",
                "Colombo",
                "Arugam Bay"
              ].map((dest) => {
                const selected = destinations.includes(dest);
                return (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => toggleDest(dest)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      selected
                        ? "bg-[#15392D] text-white border-[#15392D]"
                        : "bg-[#F8F7F3] text-[#59645E] border-[#E7E2D8] hover:border-[#C5A46B]"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-[#C5A46B]" />}
                    <span>{dest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-semibold text-lg text-[#15392D] pb-2 border-b border-[#E7E2D8] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A46B]" />
              4. Travel Passions & Special Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Wildlife",
                "Culture",
                "Adventure",
                "Beaches",
                "Honeymoon",
                "Family",
                "Food",
                "Wellness",
                "Photography",
                "Surfing",
                "Hiking"
              ].map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      selected
                        ? "bg-[#15392D] text-white border-[#15392D]"
                        : "bg-[#F8F7F3] text-[#59645E] border-[#E7E2D8] hover:border-[#C5A46B]"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-[#C5A46B]" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#15392D] hover:bg-[#1E4D3D] disabled:opacity-60 text-white font-semibold uppercase tracking-wider text-xs rounded-xl shadow transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? "Confirming & Securing Request..." : "Build My Sri Lanka Trip"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
