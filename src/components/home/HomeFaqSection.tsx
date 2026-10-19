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
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <FadeIn className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-forest/5 text-luxury-gold text-[10px] font-mono uppercase tracking-[0.25em] border border-luxury-gold/30 mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-luxury-gold" />
          <span>Curated Travel Insights</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-forest tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-sm sm:text-base text-luxury-charcoal/80 font-sans font-normal mt-2 max-w-xl mx-auto leading-relaxed">
          Comprehensive guidance on private chauffeur journeys, reserved train seats, visas, and island etiquette.
        </p>
      </FadeIn>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <motion.div
              key={idx}
              initial={false}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-white border-luxury-gold/60 shadow-[0_10px_30px_rgba(16,45,36,0.06)] ring-1 ring-luxury-gold/20"
                  : "bg-[#FAF8F5] border-luxury-sand/80 hover:border-luxury-gold/40"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 focus:outline-none"
              >
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-luxury-gold block">
                    {faq.tag}
                  </span>
                  <span className="font-serif text-base sm:text-lg font-medium text-luxury-forest break-words block">
                    {faq.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-luxury-sand/80 flex items-center justify-center text-luxury-forest shrink-0 shadow-xs"
                >
                  <ChevronDown className="w-4 h-4 text-luxury-gold" />
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
                    <div className="px-4 pb-5 pt-1 sm:px-6 sm:pb-6 text-xs sm:text-sm text-luxury-charcoal/80 leading-relaxed border-t border-luxury-sand/60 break-words">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-luxury-forest text-luxury-ivory border border-luxury-gold/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h4 className="font-serif text-base sm:text-lg font-medium text-luxury-ivory break-words">
            Seeking a bespoke route or have a special request?
          </h4>
          <p className="text-xs text-luxury-sand/80 mt-1 font-light leading-relaxed">
            Our private island travel concierge is available 24/7 on WhatsApp to craft your itinerary.
          </p>
        </div>
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hi%20${encodeURIComponent(siteConfig.name)},%20I%20have%20a%20question%20about%20traveling%20in%20Sri%20Lanka.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-[#DFBE82] via-[#C9A86A] to-[#A88647] hover:brightness-110 text-luxury-forest rounded-full text-xs font-sans font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg text-center"
        >
          <MessageCircle className="w-4 h-4 fill-current shrink-0" />
          <span>Connect With Concierge</span>
        </a>
      </div>
    </section>
  );
};
