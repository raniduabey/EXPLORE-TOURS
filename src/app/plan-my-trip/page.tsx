"use client";
import React, { useState } from "react";
import { Sparkles, CheckCircle, Phone, Users, Calendar, MapPin, Check, Send } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function PlanMyTripPage() {
  const [submitted, setSubmitted] = useState(false);
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
    try {
      await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          country,
          travelDates,
          duration,
          budget,
          travelers,
          accommodation,
          transportation,
          destinations: JSON.stringify(destinations),
          interests: JSON.stringify(interests),
          specialNotes,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    }
  };

  const waText = encodeURIComponent(
    `Hi ${siteConfig.name}, I submitted a custom trip request!\nName: ${name}\nDuration: ${duration}\nDestinations: ${destinations.join(
      ", "
    )}\nInterests: ${interests.join(", ")}`
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-ceylon-navy rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-400 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Tailor-Made Island Itineraries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Plan Your Custom Sri Lanka Trip
        </h1>
        <p className="text-sm text-slate-200 max-w-xl mx-auto">
          Tell us your ideal travel dates, interests, and budget. Our local Sri Lankan travel specialists will build your personalized trip in 24 hours.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-ceylon-green flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-ceylon-navy">
            Trip Proposal Request Received!
          </h2>
          <p className="text-xs text-ceylon-muted max-w-md mx-auto">
            Our Senior Sri Lanka Travel Specialist will curate your custom itinerary and email your PDF proposal within 24 hours.
          </p>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Connect Immediately on WhatsApp</span>
          </a>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-card space-y-8"
        >
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-ceylon-navy pb-2 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-ceylon-blue" />
              1. Your Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 987 6543"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Country of Origin
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-ceylon-navy pb-2 border-b border-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-ceylon-blue" />
              2. Dates, Duration & Budget
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Estimated Travel Date
                </label>
                <input
                  type="date"
                  value={travelDates}
                  onChange={(e) => setTravelDates(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Trip Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                >
                  <option value="5-7 Days">5-7 Days (Essential Highlights)</option>
                  <option value="8-10 Days">8-10 Days (Popular Grand Tour)</option>
                  <option value="11-14 Days">11-14 Days (Complete Island Discovery)</option>
                  <option value="15+ Days">15+ Days (Slow Travel & Beaches)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Budget Level
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                >
                  <option value="Comfort ($100-$200/day)">Comfort ($100-$200/day)</option>
                  <option value="Luxury ($250-$400/day)">Luxury ($250-$400/day)</option>
                  <option value="Ultra Luxury ($500+/day)">Ultra Luxury ($500+/day)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-ceylon-navy pb-2 border-b border-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-ceylon-blue" />
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      selected
                        ? "bg-ceylon-navy text-white border-ceylon-navy"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{dest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-ceylon-navy pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ceylon-green" />
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      selected
                        ? "bg-ceylon-green text-white border-ceylon-green"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-ceylon-green hover:bg-ceylon-darkgreen text-white font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Build My Sri Lanka Trip</span>
          </button>
        </form>
      )}
    </div>
  );
}
