"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Grid3X3, X } from "lucide-react";

interface TourImage {
  id?: string;
  url: string;
  caption?: string | null;
}

interface ImageGalleryProps {
  images: TourImage[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const imgs =
    images.length > 0
      ? images
      : [
          {
            id: "1",
            url: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1200&auto=format&fit=crop",
            caption: title,
          },
        ];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3 h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-card">
        <div
          onClick={() => {
            setActiveIdx(0);
            setModalOpen(true);
          }}
          className="md:col-span-2 relative h-full cursor-pointer overflow-hidden group bg-slate-100"
        >
          <Image
            src={imgs[0].url}
            alt={title}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="hidden md:flex flex-col gap-2 sm:gap-3 h-full">
          {imgs.slice(1, 3).map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => {
                setActiveIdx(idx + 1);
                setModalOpen(true);
              }}
              className="relative flex-1 cursor-pointer overflow-hidden group bg-slate-100"
            >
              <Image
                src={img.url}
                alt={img.caption || title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
          {imgs.length < 3 && (
            <div className="relative flex-1 bg-slate-100 flex items-center justify-center text-slate-300 text-xs font-bold">
              Ceylon Explore
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-col gap-2 sm:gap-3 h-full">
          {imgs.slice(3, 5).map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => {
                setActiveIdx(idx + 3);
                setModalOpen(true);
              }}
              className="relative flex-1 cursor-pointer overflow-hidden group bg-slate-100"
            >
              <Image
                src={img.url}
                alt={img.caption || title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
          {imgs.length < 5 && (
            <div className="relative flex-1 bg-slate-100 flex items-center justify-center text-slate-300 text-xs font-bold">
              Ceylon Explore
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white text-ceylon-navy font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg border border-slate-200/80 flex items-center gap-2 transition-transform active:scale-95"
      >
        <Grid3X3 className="w-4 h-4 text-ceylon-blue" />
        <span>View All Photos ({imgs.length})</span>
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl w-full h-[80vh] relative">
            <Image
              src={imgs[activeIdx].url}
              alt={imgs[activeIdx].caption || title}
              fill
              className="object-contain"
            />
            {imgs[activeIdx].caption && (
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm font-semibold bg-black/50 py-2">
                {imgs[activeIdx].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
