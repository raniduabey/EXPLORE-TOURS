"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  tourId: string;
  tourTitle: string;
  tourSlug: string;
  tourImage?: string;
  location?: string;
  tourDate: string;
  tourTime: string;
  adults: number;
  childrenCount: number;
  infants?: number;
  pickupLocation: string;
  pricePerAdult: number;
  pricePerChild: number;
  totalPrice: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (tourId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartCount: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("ceylon_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const next = [...prev.filter((t) => t.tourId !== item.tourId), item];
      localStorage.setItem("ceylon_cart", JSON.stringify(next));
      return next;
    });
  };

  const removeFromCart = (tourId: string) => {
    setCart((prev) => {
      const next = prev.filter((t) => t.tourId !== tourId);
      localStorage.setItem("ceylon_cart", JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("ceylon_cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount: cart.length }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
