import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ceylon: {
          navy: "#07517D",
          blue: "#0877A5",
          green: "#258437",
          darkgreen: "#12602C",
          softblue: "#EFF8FC",
          bg: "#F7FAF9",
          text: "#17222B",
          muted: "#64727D",
          border: "#E2E8F0",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        heading: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(7, 81, 125, 0.08)",
        "card-hover": "0 12px 30px -4px rgba(7, 81, 125, 0.16)",
        dropdown: "0 10px 40px -5px rgba(7, 81, 125, 0.12)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(180deg, rgba(7, 81, 125, 0.4) 0%, rgba(7, 81, 125, 0.85) 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(7, 81, 125, 0.9) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
