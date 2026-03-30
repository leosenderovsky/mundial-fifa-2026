/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        fifa: { blue: "#0033A0", red: "#EB0000", gold: "#F5A800" },
        surface: { canvas: "var(--canvas)", card: "var(--card)" },
      },
      fontFamily: {
        headline: ["Epilogue", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      boxShadow: {
        stadium: "0 24px 48px rgba(0, 33, 160, 0.08)",
        "stadium-dark": "0 24px 48px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};