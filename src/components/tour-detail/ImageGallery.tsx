"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Grid3X3,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Camera,
  Layers,
} from "lucide-react";

export interface TourPhoto {
  id?: string;
  url: string;
  caption?: string | null;
  isPrimary?: boolean;
}

interface ImageGalleryProps {
  images?: TourPhoto[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images = [], title }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // Touch swipe support for mobile lightbox
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Normalize image array: deduplicate, put primary first, ensure fallback
  const validImages: TourPhoto[] = React.useMemo(() => {
    if (!images || images.length === 0) {
      return [
        {
          id: "default-hero",
          url: "/images/destinations/sigiriya.jpg",
          caption: title,
          isPrimary: true,
        },
      ];
    }

    const primary = images.find((i) => i.isPrimary);
    const nonPrimary = images.filter((i) => !i.isPrimary && (!primary || i.url !== primary.url));

    const combined = primary ? [primary, ...nonPrimary] : images;
    const seen = new Set<string>();
    const unique: TourPhoto[] = [];
    for (const item of combined) {
      if (item && item.url && !seen.has(item.url)) {
        seen.add(item.url);
        unique.push(item);
      }
    }

    return unique.length > 0
      ? unique
      : [
          {
            id: "default-hero",
            url: "/images/destinations/sigiriya.jpg",
            caption: title,
            isPrimary: true,
          },
        ];
  }, [images, title]);

  const count = validImages.length;

  const openLightbox = (index: number) => {
    setActiveIdx(index);
    setModalOpen(true);
  };

  const nextPhoto = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % count);
  }, [count]);

  const prevPhoto = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Keyboard navigation
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      } else if (e.key === "ArrowRight") {
        nextPhoto();
      } else if (e.key === "ArrowLeft") {
        prevPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [modalOpen, nextPhoto, prevPhoto]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipe = Math.abs(distance) > 50;

    if (isSwipe) {
      if (distance > 0) {
        nextPhoto(); // swiped left
      } else {
        prevPhoto(); // swiped right
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="relative select-none">
      {/* ---------------------------------------------------- */}
      {/* ADAPTIVE GALLERY GRID */}
      {/* ---------------------------------------------------- */}
      {count === 1 && (
        // 1 Image: Full cinematic single hero
        <div
          onClick={() => openLightbox(0)}
          className="relative h-[360px] sm:h-[480px] w-full rounded-3xl overflow-hidden cursor-pointer group shadow-card border border-luxury-sand/60 bg-[#FAF8F5]"
        >
          <Image
            src={validImages[0].url}
            alt={validImages[0].caption || title}
            fill
            priority
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-sans font-medium text-luxury-forest shadow flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Enlarge Photo</span>
          </div>
        </div>
      )}

      {count === 2 && (
        // 2 Images: Split dual view
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[360px] sm:h-[460px] rounded-3xl overflow-hidden shadow-card border border-luxury-sand/60 bg-[#FAF8F5]">
          {validImages.slice(0, 2).map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => openLightbox(idx)}
              className="relative h-full cursor-pointer overflow-hidden group bg-slate-100"
            >
              <Image
                src={img.url}
                alt={img.caption || title}
                fill
                priority={idx === 0}
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {count === 3 && (
        // 3 Images: 1 large left (2/3 width) + 2 stacked right (1/3 width)
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-card border border-luxury-sand/60 bg-[#FAF8F5]">
          <div
            onClick={() => openLightbox(0)}
            className="md:col-span-2 relative h-full cursor-pointer overflow-hidden group bg-slate-100"
          >
            <Image
              src={validImages[0].url}
              alt={validImages[0].caption || title}
              fill
              priority
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>
          <div className="hidden md:flex flex-col gap-3 h-full">
            {validImages.slice(1, 3).map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => openLightbox(idx + 1)}
                className="relative flex-1 cursor-pointer overflow-hidden group bg-slate-100"
              >
                <Image
                  src={img.url}
                  alt={img.caption || title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}

      {count === 4 && (
        // 4 Images: 1 large left (1/2 width) + 3 vertical stacked right (1/2 width)
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-card border border-luxury-sand/60 bg-[#FAF8F5]">
          <div
            onClick={() => openLightbox(0)}
            className="relative h-full cursor-pointer overflow-hidden group bg-slate-100"
          >
            <Image
              src={validImages[0].url}
              alt={validImages[0].caption || title}
              fill
              priority
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>
          <div className="hidden md:grid grid-rows-3 gap-3 h-full">
            {validImages.slice(1, 4).map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => openLightbox(idx + 1)}
                className="relative h-full cursor-pointer overflow-hidden group bg-slate-100"
              >
                <Image
                  src={img.url}
                  alt={img.caption || title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}

      {count >= 5 && (
        // 5+ Images: Luxury editorial 5-tile grid with overlay on last tile
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 sm:gap-3 h-[380px] sm:h-[460px] rounded-3xl overflow-hidden shadow-card border border-luxury-sand/60 bg-[#FAF8F5]">
          {/* Main Primary Hero Tile (Spans 2 cols) */}
          <div
            onClick={() => openLightbox(0)}
            className="md:col-span-2 relative h-full cursor-pointer overflow-hidden group bg-slate-100"
          >
            <Image
              src={validImages[0].url}
              alt={validImages[0].caption || title}
              fill
              priority
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>

          {/* Column 2: 2 Stacked Images */}
          <div className="hidden md:flex flex-col gap-2.5 sm:gap-3 h-full">
            {validImages.slice(1, 3).map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => openLightbox(idx + 1)}
                className="relative flex-1 cursor-pointer overflow-hidden group bg-slate-100"
              >
                <Image
                  src={img.url}
                  alt={img.caption || title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
            ))}
          </div>

          {/* Column 3: 2 Stacked Images (With +X More overlay on 5th tile) */}
          <div className="hidden md:flex flex-col gap-2.5 sm:gap-3 h-full">
            {/* Tile 4 */}
            <div
              onClick={() => openLightbox(3)}
              className="relative flex-1 cursor-pointer overflow-hidden group bg-slate-100"
            >
              <Image
                src={validImages[3].url}
                alt={validImages[3].caption || title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* Tile 5 (with overlay if count > 5) */}
            <div
              onClick={() => openLightbox(4)}
              className="relative flex-1 cursor-pointer overflow-hidden group bg-slate-100"
            >
              <Image
                src={validImages[4].url}
                alt={validImages[4].caption || title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {count > 5 ? (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-2 text-center group-hover:bg-black/70 transition-colors">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-luxury-gold">
                    +{count - 5}
                  </span>
                  <span className="font-sans text-[11px] uppercase tracking-wider text-white/90 font-medium">
                    More Photos
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button: "View All Photos (N)" */}
      <button
        type="button"
        onClick={() => openLightbox(0)}
        className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md hover:bg-white text-luxury-forest font-sans font-semibold text-xs px-4 py-2.5 rounded-2xl shadow-luxury border border-luxury-sand/80 flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95"
      >
        <Grid3X3 className="w-4 h-4 text-luxury-gold" />
        <span>View All Photographs ({count})</span>
      </button>

      {/* ---------------------------------------------------- */}
      {/* LUXURY INTERACTIVE FULL-SCREEN LIGHTBOX */}
      {/* ---------------------------------------------------- */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar: Title, Counter & Close */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-luxury-gold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base text-white/95 font-medium truncate max-w-xs sm:max-w-md">
                  {title}
                </h3>
                <span className="text-[11px] font-mono text-luxury-gold tracking-widest uppercase block">
                  Ceylon Explore Exclusive Photography
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <span className="text-luxury-gold font-bold">
                  {String(activeIdx + 1).padStart(2, "0")}
                </span>{" "}
                / {String(count).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15"
                title="Close gallery (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Stage: High-Res Photo & Controls */}
          <div className="relative flex-1 flex items-center justify-center my-3 sm:my-4">
            {/* Prev Button */}
            {count > 1 && (
              <button
                type="button"
                onClick={prevPhoto}
                className="absolute left-2 sm:left-4 z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/80 text-white hover:text-luxury-gold flex items-center justify-center backdrop-blur-md border border-white/15 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                title="Previous photo (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}

            {/* Active Image */}
            <div className="relative max-w-5xl w-full h-full max-h-[70vh] flex items-center justify-center">
              <Image
                src={validImages[activeIdx].url}
                alt={validImages[activeIdx].caption || `${title} photo ${activeIdx + 1}`}
                fill
                priority
                unoptimized
                className="object-contain drop-shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Next Button */}
            {count > 1 && (
              <button
                type="button"
                onClick={nextPhoto}
                className="absolute right-2 sm:right-4 z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/80 text-white hover:text-luxury-gold flex items-center justify-center backdrop-blur-md border border-white/15 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                title="Next photo (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Caption & Thumbnail Strip */}
          <div className="border-t border-white/10 pt-3 shrink-0 space-y-3">
            {/* Caption text */}
            {validImages[activeIdx].caption ? (
              <p className="text-center font-serif text-xs sm:text-sm text-white/90 italic">
                "{validImages[activeIdx].caption}"
              </p>
            ) : (
              <p className="text-center font-serif text-xs text-white/50 italic">
                {title} — Sri Lanka
              </p>
            )}

            {/* Thumbnail filmstrip */}
            {count > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 px-4 max-w-4xl mx-auto scrollbar-none">
                {validImages.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeIdx === idx
                        ? "border-luxury-gold scale-105 shadow-lg shadow-luxury-gold/30"
                        : "border-transparent opacity-40 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
