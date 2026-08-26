"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Phone, MapPin, Clock, MessageSquare, ArrowUp, ChevronRight,
  ShieldCheck, CheckCircle2, Lock, Instagram
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#04060C] border-t border-slate-800/90 text-slate-400 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Top Subtle Corporate Line Accent */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />

      {/* =========================================================================
          1. TOP MNC CORPORATE ADMISSION & CALL-OUT BAR
         ========================================================================= */}
      <div className="border-b border-slate-800/80 bg-[#070A14]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Premier Martial Arts & Fitness Institution</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Train Under Certified Masters at Team Vajra
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Structured physical conditioning, combat defense, and traditional Tamil weaponry for all age cohorts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href="https://wa.me/918668102797?text=Hello%20Team%20Vajra,%20I%20would%20like%20to%20inquire%20about%20your%20training%20courses%20and%20admissions."
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 min-h-[44px] flex-1 sm:flex-initial"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg min-h-[44px] flex-1 sm:flex-initial"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>

              <Link
                href="/contact"
                className="px-5 py-3 rounded-xl bg-[#121829] hover:bg-[#1A233B] text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold text-xs transition text-center min-h-[44px] flex-1 sm:flex-initial"
              >
                Contact Admissions
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          2. MAIN 5-COLUMN MNC ENTERPRISE SITEMAP GRID
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Organization Identity & Certifications (4 Cols on Desktop) */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3 group inline-block">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-black/60 shrink-0 group-hover:border-blue-500 transition">
                <Image 
                  src="/vajra-logo.jpg" 
                  alt="Team Vajra Emblem" 
                  fill 
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div>
                <span className="font-bold text-base text-white tracking-wider block leading-none group-hover:text-blue-400 transition">
                  TEAM VAJRA
                </span>
                <span className="text-[10px] text-slate-400 tracking-[0.18em] uppercase font-semibold mt-0.5 block">
                  Fitness & Martial Arts
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Team Vajra Fitness Arts Academy is dedicated to athletic conditioning, practical combat striking, restorative yoga, and preserving authentic Tamil Silambam lineage under verified masters.
            </p>

            {/* Corporate Trust Badges */}
            <div className="space-y-2 pt-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Certified Master Instructor Lineage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>High-Density Safety Tatami Floor Arena</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Structured State & National Certification</span>
              </div>
            </div>
          </div>

          {/* Column 2: Training Courses (2.5 Cols on Desktop) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Training Courses
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/course" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Silambam (சிலம்பம்)</span>
                </Link>
              </li>
              <li>
                <Link href="/course" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Combat Martial Arts</span>
                </Link>
              </li>
              <li>
                <Link href="/course" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Functional Fitness</span>
                </Link>
              </li>
              <li>
                <Link href="/course" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Classical Yoga</span>
                </Link>
              </li>
              <li>
                <Link href="/#assessment" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Course Finder</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academy & Portals (2 Cols on Desktop) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Home Page</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>About Academy</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Student Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Admin Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Contact Desk</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Floor Schedule & Batches (2 Cols on Desktop) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Training Batches
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div>
                <span className="text-slate-300 font-semibold block">Morning Session</span>
                <span className="text-[11px] text-slate-400">05:30 AM – 07:30 AM</span>
              </div>
              <div>
                <span className="text-slate-300 font-semibold block">Evening Session</span>
                <span className="text-[11px] text-slate-400">05:00 PM – 07:00 PM</span>
              </div>
              <div>
                <span className="text-slate-300 font-semibold block">Night Batch</span>
                <span className="text-[11px] text-slate-400">07:00 PM – 08:30 PM</span>
              </div>
              <div className="pt-1 text-[11px] text-emerald-400">
                <span>Monday to Saturday</span>
              </div>
            </div>
          </div>

          {/* Column 5: Direct Social Links & Address (2 Cols on Desktop) */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Connect & Location
            </h4>
            
            {/* Fixed Address */}
            <div className="space-y-1 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block font-medium">Team Vajra Arena</strong>
                  <span className="text-slate-400 block text-[11px]">Main Ring Road, Tamil Nadu, India</span>
                </div>
              </div>
            </div>

            {/* Only Instagram, WhatsApp, and Phone */}
            <div className="space-y-2 pt-1 text-xs">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-pink-400 transition py-1"
              >
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Instagram</span>
              </a>

              <a
                href="https://wa.me/918668102797"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition py-1"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:+918668102797"
                className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition py-1"
              >
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 86681 02797</span>
              </a>
            </div>

          </div>

        </div>

        {/* =========================================================================
            3. BOTTOM MNC CORPORATE LEGAL & COPYRIGHT BAR
           ========================================================================= */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          {/* Left: Copyright and Organization Name */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p className="text-slate-400">
              © {currentYear} Team Vajra Fitness Arts Academy. All rights reserved.
            </p>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="text-slate-400">Structured Martial Arts & Strength Lineage</span>
          </div>

          {/* Right: Security & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>SSL 256-bit Encrypted</span>
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1424] hover:bg-[#161F36] border border-slate-700/80 text-slate-300 hover:text-white transition text-xs active:scale-95"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
