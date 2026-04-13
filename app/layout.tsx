import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura — Wellness Consulting",
  description: "Premium wellness consulting platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body
        className="font-dmsans antialiased transition-colors duration-300 bg-gradient-to-br from-rose-50 via-[#FFF0ED] to-rose-50 dark:from-dark-50 dark:via-dark-100 dark:to-dark-50"
        style={{ minHeight: "100vh" }}
      >
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
