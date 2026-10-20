"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ArrowRight, ShieldCheck, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { siteConfig } from "@/config/site";

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  tag?: string;
  category?: string;
}

const DEFAULT_FAQS: FAQItem[] = [
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

export const HomeFaqSection: React.FC<{ faqs?: FAQItem[] }> = ({ faqs: initialFaqs }) => {
  const [faqList, setFaqList] = useState<FAQItem[]>(
    initialFaqs && initialFaqs.length > 0 ? initialFaqs : DEFAULT_FAQS
  );
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    async function loadFreshFaqs() {
      try {
        const res = await fetch(`/api/faqs?_t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFaqList(data);
          }
        }
      } catch (e) {
        // keep current
      }
    }
    loadFreshFaqs();
  }, []);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <FadeIn className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15392D]/5 text-[#C5A46B] text-[10px] font-mono uppercase tracking-[0.25em] border border-[#C5A46B]/30 mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-[#C5A46B]" />
          <span>Curated Travel Insights</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#15392D] tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-sm sm:text-base text-[#59645E] font-sans font-normal mt-2 max-w-xl mx-auto leading-relaxed">
          Comprehensive guidance on private chauffeur journeys, reserved train seats, visas, and island etiquette.
        </p>
      </FadeIn>

      <div className="space-y-4">
        {faqList.map((faq, idx) => {
          const isOpen = openIdx === idx;
          const categoryTag = faq.tag || faq.category || "General";
          return (
            <motion.div
              key={faq.id || idx}
              initial={false}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-white border-[#C5A46B]/60 shadow-[0_10px_30px_rgba(21,57,45,0.06)] ring-1 ring-[#C5A46B]/20"
                  : "bg-white border-[#E7E2D8] hover:border-[#C5A46B]/40"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex-1 pr-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#C5A46B] mb-1 font-medium">
                    {categoryTag}
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-normal text-[#15392D] leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? "bg-[#15392D] text-[#C5A46B] rotate-180"
                      : "bg-[#F0ECE4]/80 text-[#59645E]"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-sm sm:text-[15px] text-[#59645E] font-light leading-relaxed border-t border-[#E7E2D8]/60 mt-1">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 sm:mt-12 text-center pt-6 border-t border-[#E7E2D8]">
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-[#59645E]">
          <span className="font-light">Still have questions regarding your Sri Lanka travel circuit?</span>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 font-medium text-[#15392D] hover:text-[#C5A46B] transition-colors group"
          >
            <span>Ask our concierge team directly</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#C5A46B]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
