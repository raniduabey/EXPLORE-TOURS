"use client";
import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  ChevronDown,
  HelpCircle,
  Search,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Users,
  Train,
  CloudSun,
} from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Booking & Confirmation",
    q: "How do I book a tour on Ceylon Explore Tours?",
    a: "Select your desired tour experience, choose your preferred travel date, starting time, and number of travellers on the tour page, then click 'Book Now'. Review your booking details, enter your guest contact info, and complete checkout. You will immediately receive a digital confirmation voucher with a unique booking reference and QR code.",
  },
  {
    category: "Booking & Confirmation",
    q: "Will I receive an immediate booking confirmation voucher?",
    a: "Yes! As soon as your reservation is submitted, an instant digital booking confirmation voucher is generated. You can view, download, or print this voucher anytime from our website using your unique booking reference.",
  },
  {
    category: "Booking & Confirmation",
    q: "How far in advance should I book my experiences?",
    a: "We recommend booking popular experiences—especially the Kandy to Ella Scenic Train (where reserved seats are strictly limited by Sri Lanka Railways) and high-season Yala Safaris—at least 2 to 4 weeks in advance. For standard day tours, 48 hours prior notice is usually sufficient.",
  },
  {
    category: "Payments & Currency",
    q: "What payment methods are supported?",
    a: "We accept Visa, Mastercard, and authorized online gateway transactions, as well as Direct Reservation / Pay Upon Pickup where applicable. All card transactions use encrypted 256-bit SSL tokenization.",
  },
  {
    category: "Payments & Currency",
    q: "Can I view prices in my local currency (USD, EUR, GBP, AUD, LKR)?",
    a: "Yes. Use the currency switcher in the website header or footer to view estimated converted pricing in USD, LKR, EUR, GBP, AUD, or CAD. Canonical billing rates are clearly displayed at checkout.",
  },
  {
    category: "Cancellations & Refunds",
    q: "What is your cancellation policy?",
    a: `Eligible tours offer free cancellation up to ${siteConfig.cancellationPolicy.defaultHoursPrior} hours before the scheduled local start time. If your plans change, simply notify our support team or cancel via your booking reference for a full 100% refund.`,
  },
  {
    category: "Cancellations & Refunds",
    q: "How long do refunds take to process?",
    a: "Approved refunds are processed back to your original payment method within 3 to 5 business days, depending on your issuing financial institution.",
  },
  {
    category: "Transfers & Logistics",
    q: "Is hotel pickup and drop-off included in my tour?",
    a: "Yes! Most of our private day tours include complimentary roundtrip hotel pickup and drop-off in an air-conditioned car or minivan. Simply provide your hotel name or address during checkout or message us via WhatsApp.",
  },
  {
    category: "Transfers & Logistics",
    q: "Can you organize Colombo Airport (CMB) arrival transfers?",
    a: "Yes. We operate private air-conditioned airport transfers from Bandaranaike International Airport (CMB) to Colombo, Negombo, Kandy, Galle, and southern coastal resorts. You can request this via our Custom Trip Planner or contact us directly.",
  },
  {
    category: "Tour Experience & Guides",
    q: "Are your tours private or shared group tours?",
    a: "The majority of our signature experiences (such as Sigiriya, Yala Safaris, and Galle Fort walks) are operated as exclusive private tours for you and your travelling party. Train journeys are hosted with dedicated assistance at platforms and in Ella.",
  },
  {
    category: "Tour Experience & Guides",
    q: "Are the tour guides licensed and English-speaking?",
    a: "Yes. All our chauffeurs, walking historians, and wildlife safari trackers are certified professionals who speak fluent English. Multi-lingual guides (German, French, Italian) can also be arranged upon advance request.",
  },
  {
    category: "Tour Experience & Guides",
    q: "Are child discounts available?",
    a: "Yes. Children aged 3 to 11 receive discounted pricing (typically 30% off adult rates), and infants under 3 travel free of charge on private vehicle tours.",
  },
  {
    category: "Tickets & Weather",
    q: "Are national park and cultural entrance tickets included?",
    a: "Transport, licensed guides, and refreshments are included. Monument entrance tickets (e.g. Sigiriya at $36 USD, Dambulla at $10 USD, Yala entrance at $32 USD) are purchased directly at official site ticketing counters. Your chauffeur will escort you directly to the counter.",
  },
  {
    category: "Tickets & Weather",
    q: "What is the best time of year to visit Sri Lanka?",
    a: "Sri Lanka is a year-round travel destination! When the southwest coast and hills experience monsoon rains (May to September), the north and east coast (Trincomalee, Pasikudah, Cultural Triangle) enjoy dry, sunny weather. From November to April, the south coast (Galle, Mirissa, Yala) and central highlands are at their most delightful.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    "All",
    "Booking & Confirmation",
    "Payments & Currency",
    "Cancellations & Refunds",
    "Transfers & Logistics",
    "Tour Experience & Guides",
    "Tickets & Weather",
  ];

  const filteredFaqs = FAQS.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        {/* Banner */}
        <div className="bg-ceylon-navy text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Help & Information Center
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Everything you need to know about booking, hotel pickups, cancellation deadlines, and travelling around Sri Lanka.
          </p>

          <div className="max-w-md mx-auto relative pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5" />
            <input
              type="text"
              placeholder="Search topics (e.g. train, refund, pickup, children)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-ceylon-text pl-10 pr-4 py-3 rounded-2xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ceylon-blue"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-ceylon-navy text-white shadow"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-extrabold text-xs sm:text-sm text-ceylon-navy hover:text-ceylon-blue transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-ceylon-blue shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-ceylon-blue" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-ceylon-navy">
                No matching answers found
              </h3>
              <p className="text-xs text-ceylon-muted">
                Try searching with different keywords or contact our 24/7 WhatsApp concierge.
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="bg-ceylon-softblue rounded-3xl p-8 sm:p-10 border border-ceylon-blue/20 text-center space-y-3">
          <h3 className="text-xl font-extrabold text-ceylon-navy">
            Still Have Questions?
          </h3>
          <p className="text-xs text-ceylon-muted max-w-md mx-auto">
            Our certified Sri Lankan travel specialists are available 24/7 on WhatsApp or email to answer specific questions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                "Hi Ceylon Explore Tours, I have a quick question about booking a tour!"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl shadow"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Ask on WhatsApp</span>
            </a>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-bold rounded-xl shadow"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
