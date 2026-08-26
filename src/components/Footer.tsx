"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Phone, MapPin, MessageSquare, ArrowUp, Instagram, ShieldCheck
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05070E] border-t border-slate-800 text-slate-400 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Subtle Top Ambient Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-blue-600/[0.04] blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
        
        {/* Centered Brand Core */}
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Logo & Academy Name */}
          <Link href="/" className="flex flex-col items-center gap-3 group">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-700/80 bg-black/80 p-1 shadow-xl group-hover:border-blue-500 transition duration-300">
              <Image 
                src="/vajra-logo.jpg" 
                alt="Team Vajra Emblem" 
                fill 
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <span className="font-bold text-xl sm:text-2xl text-white tracking-wider block group-hover:text-blue-400 transition">
                TEAM VAJRA
              </span>
              <span className="text-[11px] text-slate-400 tracking-[0.25em] uppercase font-semibold block mt-0.5">
                Fitness & Martial Arts Academy
              </span>
            </div>
          </Link>

          {/* Address with Icon */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D1220] border border-slate-800 text-xs text-slate-300 max-w-md shadow-sm">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">Main Ring Road, Tamil Nadu, India</span>
          </div>

          {/* Direct 3 Social & Contact Icon Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full max-w-md">
            
            {/* 1. Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex-1 min-w-[120px] min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0D1220] hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-pink-900/40 border border-slate-800 hover:border-pink-500/40 text-slate-200 hover:text-white transition flex items-center justify-center gap-2 text-xs font-semibold shadow-sm active:scale-95"
            >
              <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
              <span>Instagram</span>
            </a>

            {/* 2. WhatsApp */}
            <a
              href="https://wa.me/918668102797?text=Hello%20Team%20Vajra,%20I%20would%20like%20to%20inquire%20about%20your%20training%20courses."
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex-1 min-w-[120px] min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0D1220] hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-white transition flex items-center justify-center gap-2 text-xs font-semibold shadow-sm active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* 3. Phone Call */}
            <a
              href="tel:+918668102797"
              aria-label="Call"
              className="flex-1 min-w-[120px] min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0D1220] hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/40 text-slate-200 hover:text-white transition flex items-center justify-center gap-2 text-xs font-semibold shadow-sm active:scale-95"
            >
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span>+91 86681 02797</span>
            </a>

          </div>

        </div>

        {/* Bottom Minimal Copyright & Back To Top */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          
          <p className="text-slate-400">
            © {currentYear} Team Vajra Fitness Arts. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="min-h-[38px] inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#0D1220] hover:bg-[#151D33] border border-slate-800 text-slate-300 hover:text-white transition text-xs active:scale-95"
            aria-label="Scroll to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </footer>
  );
}
