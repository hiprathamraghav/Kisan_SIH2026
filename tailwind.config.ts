import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#1A3C23",
        leaf: "#407238",
        lime: "#D2E2B8",
        mist: "#F7FAF2",
        ink: "#1F2937",
      },
      borderRadius: { "4xl": "2rem" },
      boxShadow: { soft: "0 18px 55px rgba(20, 54, 27, .14)" },
      fontFamily: { sans: ["var(--font-sans)", "Arial", "sans-serif"], cursive: ["var(--font-hand)", "cursive"] },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: { "accordion-down": "accordion-down .2s ease-out", "accordion-up": "accordion-up .2s ease-out" },
    },
  },
  plugins: [],
};

export default config;
