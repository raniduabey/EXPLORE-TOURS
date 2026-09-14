"use client";
import React from "react";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const WhatsAppButton: React.FC<{ tourTitle?: string }> = ({ tourTitle }) => {
  const text = encodeURIComponent(
    tourTitle
      ? `Hi ${siteConfig.name}, I'm interested in booking the "${tourTitle}". Could you provide more details and availability?`
      : `Hi ${siteConfig.name}, I'm interested in planning a Sri Lanka tour experience!`
  );
  const link = `https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center group"
      title={`Plan Your Sri Lanka Trip on WhatsApp with ${siteConfig.name}`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
        Chat on WhatsApp
      </span>
    </a>
  );
};
