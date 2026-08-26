"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Phone, MapPin, Clock, MessageSquare, ArrowUp, ChevronRight
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#05070D] border-t border-slate-800 text-slate-400 text-xs relative overflow-hidden">
      
      {/* Subtle Ambient Background Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[250px] bg-blue-600/[0.04] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-12 relative">
        
        {/* Main 4-Column Professional Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Academy Statement (4 Cols) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-700/80 bg-black/60 shrink-0 group-hover:border-blue-500/60 transition">
                <Image 
                  src="/vajra-logo.jpg" 
                  alt="Team Vajra Official Logo" 
                  fill 
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="font-display font-bold text-base text-white tracking-wide block leading-none group-hover:text-blue-400 transition">
                  TEAM VAJRA
                </span>
                <span className="text-[10px] text-slate-400 tracking-[0.2em] uppercase font-semibold mt-0.5 block">
                  Fitness Arts Academy
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Certified training in Functional Strength, Traditional Yoga, Combat Martial Arts, and Ancient Tamil Silambam for kids, adults, and athletes.
            </p>

            {/* Live Enrollment Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium min-h-[36px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admissions & Batches Open</span>
            </div>
          </div>

          {/* Col 2: The 4 Core Arts (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Courses
            </h4>
            <ul className="space-y-1">
              {[
                { name: "Functional Fitness", href: "/course" },
                { name: "Classical Yoga", href: "/course" },
                { name: "Combat Martial Arts", href: "/course" },
                { name: "Traditional Silambam (சிலம்பம்)", href: "/course" },
                { name: "Biometric Assessment", href: "/#assessment" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group min-h-[38px] py-1"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation & Portal (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-1">
              {[
                { name: "Home", href: "/" },
                { name: "About Academy", href: "/about" },
                { name: "All Courses", href: "/course" },
                { name: "Photo Gallery", href: "/gallery" },
                { name: "Student Portal", href: "/portal" },
                { name: "Admin Portal", href: "/admin" },
                { name: "Contact Desk", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group min-h-[38px] py-1"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Academy Schedule (3 Cols) */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Academy Desk
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              
              <a 
                href="https://wa.me/918668102797" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0D1220] border border-slate-800 hover:border-slate-700 active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate font-medium">WhatsApp: +91 86681 02797</span>
              </a>

              <a 
                href="tel:+918668102797" 
                className="flex items-center gap-2.5 text-slate-300 hover:text-white transition min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0D1220] border border-slate-800 hover:border-slate-700 active:scale-[0.99]"
              >
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate font-medium">Call: +91 86681 02797</span>
              </a>

              <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#0D1220] border border-slate-800 text-slate-400">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-medium">Mon – Sat</span>
                  <span className="text-[11px]">05:30 AM – 08:30 PM</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#0D1220] border border-slate-800 text-slate-400">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Tamil Nadu, India</span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Team Vajra Fitness Arts. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <p className="text-slate-400">Course • Form • Lineage</p>
          </div>

          <button
            onClick={scrollToTop}
            className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F1424] hover:bg-[#161F36] active:bg-[#1D2845] border border-slate-700/60 text-slate-300 hover:text-white transition text-xs active:scale-95"
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
