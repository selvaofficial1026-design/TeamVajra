"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Activity, Award, Users2, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export default function AboutSection({ onOpenBooking }: AboutSectionProps) {
  const values = [
    {
      icon: Activity,
      title: "Biomechanical Science",
      desc: "Every lift, strike, and posture is grounded in human anatomy to maximize functional strength while preventing joint strain."
    },
    {
      icon: ShieldCheck,
      title: "Authentic Heritage",
      desc: "Direct lineage instruction in ancient Tamil Silambam, teaching complete 18 Kaaladi footwork patterns, Por Silambam, and tournament Katas."
    },
    {
      icon: Award,
      title: "Recognized Certifications",
      desc: "Formal belt testing and stage certifications accredited by recognized state and national martial arts boards."
    },
    {
      icon: Users2,
      title: "Age-Stratified Safety",
      desc: "Dedicated separate batches for Junior Warriors (Ages 5–14), teenagers, women’s self-defense, and high-intensity adult conditioning."
    }
  ];

  return (
    <section id="about" className="py-24 relative border-t border-white/[0.06] bg-[#070A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="eyebrow text-blue-400 block mb-3">
            About Team Vajra
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Ancient warrior course. <br />
            <span className="text-slate-400 font-normal">Modern physical science.</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Team Vajra Fitness Arts was established with a singular vision: to empower practitioners with unbreakable physical strength, razor-sharp reflexes, internal composure, and deep pride in authentic martial heritage.
          </p>
        </div>

        {/* Story & Philosophy Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          <div className="lg:col-span-7 rounded-2xl bg-[#0B0F1A] border border-white/[0.08] p-8 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
                Our Academy Philosophy
              </span>
              <h3 className="font-display text-2xl font-bold text-white">
                "Vajra represents the thunderbolt — unbreakable, powerful, and swift."
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Rather than treating fitness, yoga, combat arts, and traditional weaponry as isolated hobbies, Team Vajra synthesizes all four courses into a complete, balanced system of human development.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Whether you are a 5-year-old child learning focus and self-course through Silambam, a working executive regaining spinal health through Yoga, or an athlete building explosive stamina through Functional Fitness, our certified masters coach with individualized attention.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>State & National Champions</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Certified Yoga Masters</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Black Belt Combat Coaches</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Clean, Sanitized Facility</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#0B0F1A] border border-white/[0.08] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
                Facility & Infrastructure
              </span>
              <h3 className="font-display text-2xl font-bold text-white">
                State-of-the-Art Dojo
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Equipped with high-density tatami impact mats, precision striking bags, sanitized yoga props, competition-grade bamboo Silambam staffs, and Olympic functional conditioning equipment.
              </p>
              <div className="p-4 rounded-xl bg-[#0F1424] border border-white/[0.06] text-xs text-slate-300 space-y-1.5">
                <div>📍 <strong>Location:</strong> Main Ring Road, Tamil Nadu</div>
                <div>⏰ <strong>Batches:</strong> 05:30 AM – 08:30 PM (Mon–Sat)</div>
                <div>🥋 <strong>Safety:</strong> First-Aid Certified Masters on Floor</div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={onOpenBooking}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Visit Dojo & Book Free Trial</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* 4 Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl glass-card flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-display text-base font-bold text-white mb-2">
                    {v.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-slate-500 uppercase">
                  Pillar 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
