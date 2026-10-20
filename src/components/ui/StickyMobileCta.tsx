"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, Compass } from "lucide-react";
import { siteConfig } from "@/config/site";

export const StickyMobileCta: React.FC<{ onOpenCustomPlanner?: () => void }> = ({
  onOpenCustomPlanner,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=Hi%20${encodeURIComponent(
    siteConfig.name
  )},%20I'm%20exploring%20Sri%20Lanka%20tours%20and%20would%20like%20to%20plan%20a%20trip!`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#E7E2D8] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_25px_rgba(21,57,45,0.08)] flex items-center gap-3 touch-manipulation"
        >
          {/* WhatsApp Direct */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 bg-[#25D366] active:bg-[#20ba5a] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Plan My Trip / Inquire */}
          {onOpenCustomPlanner ? (
            <button
              type="button"
              onClick={onOpenCustomPlanner}
              className="flex-1 py-2.5 px-3 bg-[#15392D] active:bg-[#1E4D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46B]" />
              <span>Tailor My Trip</span>
            </button>
          ) : (
            <Link
              href="/plan-my-trip"
              className="flex-1 py-2.5 px-3 bg-[#15392D] active:bg-[#1E4D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46B]" />
              <span>Tailor My Trip</span>
            </Link>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
