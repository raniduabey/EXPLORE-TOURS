"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (tourId: string) => void;
  isInWishlist: (tourId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("ceylon_wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  const toggleWishlist = (tourId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(tourId) ? prev.filter((id) => id !== tourId) : [...prev, tourId];
      localStorage.setItem("ceylon_wishlist", JSON.stringify(next));
      return next;
    });
  };

  const isInWishlist = (tourId: string) => wishlist.includes(tourId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
