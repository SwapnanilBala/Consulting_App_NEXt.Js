import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: "#FDF6F4",
          100: "#FFF0ED",
          200: "#FBEAF0",
          400: "#E8A4B8",
          600: "#D4537E",
          800: "#993556",
          900: "#4B1528",
        },
        cream: {
          50: "#FDFAF7",
          100: "#F7F0E8",
          200: "#EDE4D8",
          400: "#C8BAA8",
          700: "#7A6A58",
        },
        dark: {
          50: "#1a0a11",
          100: "#231019",
          200: "#2d1522",
          300: "#3d1e30",
          400: "#5a2d48",
          500: "#7a3d62",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)"],
        dmsans: ["var(--font-dmsans)"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
