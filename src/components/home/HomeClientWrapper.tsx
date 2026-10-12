"use client";
import React, { useState } from "react";
import { Hero } from "@/components/home/Hero";
import { TailorMadeModal } from "@/components/home/TailorMadeModal";

export const HomeClientWrapper: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Hero onOpenCustomPlanner={() => setModalOpen(true)} />
      <TailorMadeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
