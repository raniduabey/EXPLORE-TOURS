"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowRight, ShieldCheck, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { siteConfig } from "@/config/site";

interface FAQItem {
  question: string;
  answer: string;
  tag: string;
}

const FAQS: FAQItem[] = [
  {
    tag: "Chauffeur & Transport",
    question: "What is included with our private chauffeur guide and vehicle?",
    answer:
      "All our private tours include a dedicated, licensed English-speaking chauffeur guide, an air-conditioned modern vehicle (sedan, SUV, or luxury passenger van according to group size), all fuel, highway expressway tolls, parking fees, and driver meals/accommodation during multi-day tours. There are zero hidden transport costs.",
  },
  {
    tag: "Train Tickets",
    question: "How do you guarantee reserved seats on the Kandy to Ella scenic train?",
    answer:
      "Sri Lanka Railways opens ticket reservations strictly 30 days in advance, and seats sell out within minutes. Our ground logistics team in Colombo and Kandy secures your physical reserved 1st or 2nd-class scenic carriage seats directly at the station counter on opening day, handing them to your chauffeur guide before departure.",
  },
  {
    tag: "Visa & Entry",
    question: "Do I need an ETA / Visa before arriving in Sri Lanka?",
    answer:
      "Yes, most foreign passport holders (UK, EU, USA, Canada, Australia) require an Electronic Travel Authorization (ETA) prior to arrival. It is easily obtained online through the official Sri Lanka immigration portal (eta.gov.lk) and takes 24–48 hours to be approved.",
  },
  {
    tag: "Booking & Flexibility",
    question: "What is your cancellation and deposit policy?",
    answer:
      "We offer flexible traveler terms: 100% full refund on day excursions up to 24 hours before pickup. For multi-day packages, only a nominal deposit is required to lock in boutique hotels and private vehicles, with free adjustments if flight schedules change.",
  },
  {
    tag: "Culture & Etiquette",
    question: "What is the dress code for sacred Buddhist and Hindu temples?",
    answer:
      "When visiting sacred shrines (such as the Temple of the Sacred Tooth in Kandy or Dambulla Caves), both men and women should wear modest clothing that covers shoulders and knees. Shoes and hats must be removed before entering holy precincts (clean footwear racks are provided).",
  },
  {
    tag: "Payments & Currency",
    question: "What currency should I bring, and are credit cards accepted?",
    answer:
      "Sri Lankan Rupees (LKR) are used for day-to-day purchases, street markets, and tips. Major hotels, restaurants, and supermarkets accept Visa and Mastercard. Your chauffeur will gladly stop at reliable bank ATMs or authorized money exchanges with fair interbank rates.",
  },
];

export const HomeFaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <FadeIn className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ceylon-softblue text-ceylon-blue text-xs font-extrabold uppercase tracking-widest border border-ceylon-blue/20 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-ceylon-navy tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-sm text-ceylon-muted mt-2">
          Clear answers to common questions about travelling Sri Lanka with private guides, booking train seats, and flexible cancellation.
        </p>
      </FadeIn>

      <div className="space-y-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <motion.div
              key={idx}
              initial={false}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-white border-ceylon-blue/40 shadow-md ring-1 ring-ceylon-blue/20"
                  : "bg-white/80 border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ceylon-blue block">
                    {faq.tag}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-ceylon-navy">
                    {faq.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-ceylon-navy">
            Have a custom travel question or specific itinerary request?
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Our local travel team is available 24/7 on WhatsApp for free advice.
          </p>
        </div>
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hi%20${encodeURIComponent(siteConfig.name)},%20I%20have%20a%20question%20about%20traveling%20in%20Sri%20Lanka.`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-md"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Ask on WhatsApp</span>
        </a>
      </div>
    </section>
  );
};
