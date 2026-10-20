"use client";
import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { useBusinessSettings } from "@/context/BusinessContext";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { CountrySelect } from "@/components/ui/CountrySelect";

export default function ContactPage() {
  const { settings } = useBusinessSettings();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "United States",
    travelDate: "",
    travellers: "2",
    message: "",
    honeypot: "", // hidden anti-spam field
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          country: "United States",
          travelDate: "",
          travellers: "2",
          message: "",
          honeypot: "",
        });
      } else {
        setErrorMsg(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error occurred. Please contact us via WhatsApp or email directly.");
    } finally {
      setLoading(false);
    }
  };

  const address = settings.address || `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.country}`;
  const primaryPhone = settings.primaryPhone || siteConfig.contact.phone;
  const secondaryPhone = settings.secondaryPhone;
  const whatsappNumber = settings.whatsapp || siteConfig.contact.whatsapp;
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");
  const email = settings.email || siteConfig.contact.email;
  const operatingHours = settings.operatingHours || siteConfig.contact.operatingHours;
  const mapsUrl = settings.mapsUrl || "https://maps.google.com/?q=Colombo+Sri+Lanka";
  const companyName = settings.companyName || siteConfig.name;

  const whatsappHref = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hi ${companyName}, I would like to inquire about planning a trip to Sri Lanka!`
  )}`;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="bg-[#F0ECE4]/60 text-[#15392D] rounded-2xl sm:rounded-3xl p-6 sm:p-14 relative overflow-hidden border border-[#E7E2D8] shadow-sm space-y-3">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#C5A46B]/10 blur-3xl pointer-events-none" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A46B] block font-semibold">
          Private Concierge & Reservations
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#15392D] break-words">
          Begin Your Sri Lanka Journey
        </h1>
        <p className="text-sm sm:text-base text-[#59645E] max-w-2xl font-light leading-relaxed">
          Whether you desire a tailored private itinerary, reserved hill country train seats, luxury chauffeur transit, or safari guidance, our dedicated island concierge is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info & Channels */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-sm space-y-7">
            <div className="pb-2 border-b border-[#E7E2D8]">
              <h3 className="font-serif text-base font-semibold text-[#15392D] tracking-wide">
                Direct Concierge Lines
              </h3>
            </div>

            <div className="space-y-6 sm:space-y-7 text-xs text-[#59645E]">
              {/* Registered Office */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#15392D]/5 text-[#C5A46B] border border-[#C5A46B]/25 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="font-sans font-semibold text-[#15392D] block">Registered Office:</span>
                  <span className="block leading-relaxed">{address}</span>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-[#C5A46B] hover:underline pt-1"
                    >
                      <span>Locate on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Direct Hotline */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#15392D]/5 text-[#C5A46B] border border-[#C5A46B]/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="font-sans font-semibold text-[#15392D] block">Direct Hotline:</span>
                  <div className="space-y-1">
                    <a
                      href={`tel:${primaryPhone}`}
                      className="hover:text-[#C5A46B] transition-colors font-sans block leading-relaxed"
                    >
                      {primaryPhone} <span className="text-[#59645E]/70 text-[11px] font-sans">(24/7 Concierge)</span>
                    </a>
                    {secondaryPhone && (
                      <a
                        href={`tel:${secondaryPhone}`}
                        className="text-[#59645E]/80 hover:text-[#C5A46B] transition-colors font-sans block leading-relaxed"
                      >
                        {secondaryPhone} <span className="text-[#59645E]/60 text-[11px] font-sans">(Secondary line)</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* WhatsApp Instant Support */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="font-sans font-semibold text-[#15392D] block">WhatsApp Instant Support:</span>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-800 font-sans font-medium hover:underline block leading-relaxed"
                  >
                    {whatsappNumber} <span className="text-emerald-600/80 text-[11px] font-sans">(Chat Directly)</span>
                  </a>
                </div>
              </div>

              {/* Email Dispatch */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#15392D]/5 text-[#C5A46B] border border-[#C5A46B]/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="font-sans font-semibold text-[#15392D] block">Email Dispatch:</span>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-[#C5A46B] transition-colors font-sans block leading-relaxed"
                  >
                    {email}
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#15392D]/5 text-[#C5A46B] border border-[#C5A46B]/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="font-sans font-semibold text-[#15392D] block">Operating Hours:</span>
                  <span className="font-sans block leading-relaxed">{operatingHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E7E2D8]">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#15392D] hover:bg-[#1E4D3D] text-white text-xs font-sans font-medium uppercase tracking-wider rounded-xl shadow transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Instant WhatsApp Inquiry</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-7 sm:p-11 border border-[#E7E2D8] shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A46B] block mb-1 font-semibold">
                Bespoke Inquiries
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#15392D] tracking-tight">
                Send Us Your Travel Vision
              </h2>
              <p className="text-xs sm:text-sm text-[#59645E] font-light mt-1">
                Share your dates, interests, and party size. Our island specialists will draft a personalized proposal within 24 hours.
              </p>
            </div>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-3 text-emerald-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-sm text-emerald-950">
                    Message Received Successfully!
                  </h4>
                  <p className="leading-relaxed">
                    Thank you for contacting {companyName}. One of our local Sri Lanka travel specialists will review your inquiry and email you within a few hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="pt-2 text-xs font-bold text-emerald-700 hover:underline block"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot anti-spam field (hidden from real users) */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 555 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                    />
                  </div>

                  <div>
                    <CountrySelect
                      label="Country of Residence"
                      value={formData.country}
                      onChange={(val) => setFormData({ ...formData, country: val })}
                      placeholder="Select country of residence..."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                      Estimated Travel Date
                    </label>
                    <input
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                      Number of Travellers
                    </label>
                    <select
                      value={formData.travellers}
                      onChange={(e) => setFormData({ ...formData, travellers: e.target.value })}
                      className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl px-3.5 py-2.5 text-xs text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                    >
                      <option value="1">Solo Traveller (1)</option>
                      <option value="2">Couple / Pair (2)</option>
                      <option value="3-4">Small Family / Group (3-4)</option>
                      <option value="5+">Large Group (5+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#15392D] mb-1.5">
                    Your Message / Tour Inquiries *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us which experiences you are interested in (e.g. Sigiriya Day Tour, Ella Train tickets, Yala Safari, or special vehicle requirements)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F8F7F3] border border-[#E7E2D8] rounded-xl p-3.5 text-xs text-[#24362F] placeholder-[#59645E]/60 focus:outline-none focus:ring-1 focus:ring-[#15392D] focus:border-[#15392D] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#15392D] hover:bg-[#1E4D3D] text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-colors shadow flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Sending Inquiry...</span>
                  ) : (
                    <>
                      <span>Send Travel Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
