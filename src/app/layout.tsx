import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Team Vajra | Elite Fitness, Yoga, Martial Arts & Silambam Academy",
  description: "Premier training facility in Tamil Nadu specializing in functional fitness, restorative yoga, combat martial arts, and authentic Silambam. Train under certified masters.",
  icons: {
    icon: "/vajra-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <body className="bg-[#080B11] text-slate-200 antialiased font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}