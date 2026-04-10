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
      },
      fontFamily: {
        playfair: ["var(--font-playfair)"],
        dmsans: ["var(--font-dmsans)"],
      },
    },
  },
  plugins: [],
};
export default config;
