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
        // Official Brand Color Tokens
        "warm-cream": "#F8F7F3",
        "forest-green": "#15392D",
        "deep-forest": "#0D281F",
        "champagne-gold": "#C5A46B",
        "soft-border": "#E7E2D8",
        "subtle-beige": "#F0ECE4",
        "primary-text": "#24362F",
        "secondary-text": "#59645E",

        cream: {
          DEFAULT: "#F8F7F3",
          warm: "#F8F7F3",
          subtle: "#F0ECE4",
          light: "#FAF9F5",
        },
        forest: {
          DEFAULT: "#15392D",
          deep: "#0D281F",
          emerald: "#1E4D3D",
        },
        gold: {
          DEFAULT: "#C5A46B",
          champagne: "#C5A46B",
        },

        ceylon: {
          navy: "#15392D",
          blue: "#15392D",
          green: "#15392D",
          darkgreen: "#0D281F",
          softblue: "#F0ECE4",
          bg: "#F8F7F3",
          text: "#24362F",
          muted: "#59645E",
          border: "#E7E2D8",
          card: "#FFFFFF",
        },
        luxury: {
          forest: "#15392D",
          "forest-deep": "#0D281F",
          emerald: "#1E4D3D",
          ivory: "#F8F7F3",
          cream: "#F8F7F3",
          gold: "#C5A46B",
          sand: "#E7E2D8",
          beige: "#F0ECE4",
          charcoal: "#24362F",
          muted: "#59645E",
          border: "#E7E2D8",
          accent: "#C5A46B",
          dark: "#0D281F",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        heading: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        editorial: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        numeric: ["var(--font-numeric)", "var(--font-poppins)", "Poppins", "sans-serif"],
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
