export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
  format: (e: number) => string;
}

export const currencies: Record<string, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", rate: 1, format: (e) => `$${e.toFixed(0)}` },
  LKR: { code: "LKR", symbol: "Rs.", rate: 305, format: (e) => `LKR ${Math.round(e).toLocaleString()}` },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, format: (e) => `€${e.toFixed(0)}` },
  GBP: { code: "GBP", symbol: "£", rate: 0.78, format: (e) => `£${e.toFixed(0)}` },
  AUD: { code: "AUD", symbol: "A$", rate: 1.5, format: (e) => `A$${e.toFixed(0)}` },
  CAD: { code: "CAD", symbol: "C$", rate: 1.36, format: (e) => `C$${e.toFixed(0)}` },
};

export function formatPrice(amount: number, currency: string = "USD"): string {
  const c = currencies[currency] || currencies.USD;
  return c.format(amount * c.rate);
}

export const formatCurrency = formatPrice;
