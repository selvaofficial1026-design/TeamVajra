"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight, Dumbbell, Sparkles, Shield, Flame } from "lucide-react";

interface HeroProps {
  onOpenBooking: (course?: string) => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const courses = [
    { num: "01", name: "FITNESS", sub: "Functional & Strength", icon: Dumbbell, href: "#course-fitness" },
    { num: "02", name: "YOGA", sub: "Restorative Alignment", icon: Sparkles, href: "#course-yoga" },
    { num: "03", name: "MARTIAL ARTS", sub: "Combat Self-Defense", icon: Shield, href: "#course-martial-arts" },
    { num: "04", name: "SILAMBAM", sub: "Ancient Tamil Weaponry", icon: Flame, href: "#course-silambam" },
  ];

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-radial-hero">
      
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-subtle-grid pointer-events-none [mask-image:radial-gradient(ellipse_70%_50%_at_50%_30%,#000_60%,transparent_100%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F1424] border border-white/[0.08] shadow-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="eyebrow text-slate-300">
              Tamil Nadu’s Premier Combat & Movement Academy
            </span>
          </div>

          {/* Logo Floating (No Box Frame, Larger & Prominent) */}
          <div className="relative mb-6 flex justify-center">
            <div className="relative w-64 sm:w-80 md:w-96 h-36 sm:h-48 md:h-56 transition-transform duration-300 hover:scale-105">
              <Image
                src="/vajra-logo.jpg"
                alt="Team Vajra Fitness Arts Official Emblem"
                fill
                className="object-contain drop-shadow-[0_12px_40px_rgba(37,99,235,0.25)] rounded-2xl"
                priority
              />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-white leading-[1.08]">
            Master The Four Pillars of <br className="hidden sm:inline" />
            <span className="text-gradient-blue">Human Performance.</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            Team Vajra provides specialized mastery across <strong className="text-white font-semibold">Functional Fitness</strong>, <strong className="text-white font-semibold">Classical Yoga</strong>, <strong className="text-white font-semibold">Combat Martial Arts</strong>, and authentic <strong className="text-white font-semibold">Tamil Silambam</strong> under certified master instructors.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Book Complimentary Trial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <a
              href="#course"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F1424] hover:bg-[#141B30] text-slate-200 border border-white/[0.08] hover:border-white/20 font-semibold text-sm transition-all"
            >
              Explore 4 Courses
            </a>
          </div>

          {/* 4 Pillars Nav Strip */}
          <div className="mt-16 w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {courses.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="p-4 rounded-xl glass-card glass-card-hover text-left flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
                    <span>{item.num}</span>
                    <Icon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display tracking-tight group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Key Metrics */}
          <div className="mt-14 w-full pt-8 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <span className="block font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                4 Courses
              </span>
              <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                Structured Graded Tracks
              </span>
            </div>

            <div>
              <span className="block font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                500+
              </span>
              <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                Warriors & Students Trained
              </span>
            </div>

            <div>
              <span className="block font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Ages 5–65
              </span>
              <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                Junior & Adult Batches
              </span>
            </div>

            <div>
              <span className="block font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                100%
              </span>
              <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                Authentic Master Lineage
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
