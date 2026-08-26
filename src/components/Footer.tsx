"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Phone, MapPin, MessageSquare, ArrowUp, Instagram
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05070E] border-t border-slate-800 text-slate-400 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Top Subtle Ambient Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-blue-600/[0.04] blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
        
        {/* Centered Brand & Icons */}
        <div className="flex flex-col items-center text-center space-y-5">
          
          {/* Logo & Academy Name */}
          <Link href="/" className="flex flex-col items-center gap-2.5 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-700/80 bg-black/80 p-1 shadow-xl group-hover:border-blue-500 transition duration-300">
              <Image 
                src="/vajra-logo.jpg" 
                alt="Team Vajra Emblem" 
                fill 
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <span className="font-bold text-lg sm:text-xl text-white tracking-wider block group-hover:text-blue-400 transition">
                TEAM VAJRA
              </span>
              <span className="text-[10px] text-slate-400 tracking-[0.2em] uppercase font-semibold block mt-0.5">
                Fitness & Martial Arts Academy
              </span>
            </div>
          </Link>

          {/* Address with Icon */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1220] border border-slate-800 text-xs text-slate-300 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Main Ring Road, Tamil Nadu, India</span>
          </div>

          {/* Pure Icon-Only Social & Contact Buttons */}
          <div className="flex items-center justify-center gap-3 pt-1">
            
            {/* 1. Instagram Icon */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="w-11 h-11 rounded-2xl bg-[#0D1220] hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-600 hover:to-amber-500 border border-slate-800 hover:border-pink-500 text-slate-300 hover:text-white transition-all duration-300 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 group"
            >
              <Instagram className="w-5 h-5 group-hover:text-white text-pink-400 transition" />
            </a>

            {/* 2. WhatsApp Icon */}
            <a
              href="https://wa.me/918668102797?text=Hello%20Team%20Vajra,%20I%20would%20like%20to%20inquire%20about%20your%20training%20courses."
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
              className="w-11 h-11 rounded-2xl bg-[#0D1220] hover:bg-emerald-600 border border-slate-800 hover:border-emerald-400 text-slate-300 hover:text-white transition-all duration-300 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 group"
            >
              <MessageSquare className="w-5 h-5 group-hover:text-white text-emerald-400 transition" />
            </a>

            {/* 3. Phone Call Icon */}
            <a
              href="tel:+918668102797"
              aria-label="Call"
              title="Call: +91 86681 02797"
              className="w-11 h-11 rounded-2xl bg-[#0D1220] hover:bg-blue-600 border border-slate-800 hover:border-blue-400 text-slate-300 hover:text-white transition-all duration-300 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 group"
            >
              <Phone className="w-5 h-5 group-hover:text-white text-blue-400 transition" />
            </a>

          </div>

        </div>

        {/* Bottom Minimal Copyright & Back To Top */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          
          <p className="text-slate-400">
            © {currentYear} Team Vajra Fitness Arts. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="min-h-[36px] inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-xl bg-[#0D1220] hover:bg-[#151D33] border border-slate-800 text-slate-300 hover:text-white transition text-xs active:scale-95"
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
