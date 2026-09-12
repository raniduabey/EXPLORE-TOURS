"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { currencies, formatPrice as helperFormatPrice } from "@/lib/currency";

interface CurrencyContextType {
  currency: string;
  setCurrency: (c: string) => void;
  formatPrice: (amount: number) => string;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  formatPrice: (e) => `$${e}`,
  currencySymbol: "$",
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("ceylon_currency");
    if (saved && currencies[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem("ceylon_currency", c);
  };

  const symbol = currencies[currency]?.symbol || "$";
  const formatPrice = (amount: number) => helperFormatPrice(amount, currency);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencySymbol: symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
