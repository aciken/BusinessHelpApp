import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#111827",
        "warm-gray": "#FAFAF8",
        "warm-gray-dark": "#F8F8F6",
        accent: {
          DEFAULT: "#22C55E",
          light: "#DCFCE7",
          dark: "#166534",
          muted: "#F0FDF4",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
        },
        border: {
          DEFAULT: "#E5E7EB",
          light: "#F3F4F6",
        },
      },
      fontFamily: {
        heading: [
          "Cabinet Grotesk",
          "Instrument Sans",
          "General Sans",
          "sans-serif",
        ],
        body: ["Inter", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
