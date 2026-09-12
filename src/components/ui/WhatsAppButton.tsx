"use client";
import React from "react";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton: React.FC<{ tourTitle?: string }> = ({ tourTitle }) => {
  const text = encodeURIComponent(
    tourTitle
      ? `Hi Ceylon Explore Guide, I'm interested in the ${tourTitle}. Could you send me more information?`
      : "Hi Ceylon Explore Guide, I would like to inquire about booking a tour in Sri Lanka!"
  );
  const link = `https://wa.me/94771234567?text=${text}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center group"
      title="Chat with Ceylon Tour Specialist on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
        Chat on WhatsApp
      </span>
    </a>
  );
};
