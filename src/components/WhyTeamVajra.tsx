"use client";

import React from "react";
import { ShieldCheck, Activity, Award, Users2, ArrowUpRight } from "lucide-react";

export default function WhyTeamVajra() {
  const pillars = [
    {
      icon: Activity,
      title: "Biomechanical Precision",
      description: "Every movement pattern, lift, and combat stance is structured on anatomical mechanics to build maximum athletic output while eliminating chronic injury risks."
    },
    {
      icon: ShieldCheck,
      title: "Uncompromising Heritage",
      description: "Our Silambam and traditional martial arts instruction is preserved through direct master lineages, teaching complete 18 Kaaladi patterns and tournament Katas."
    },
    {
      icon: Award,
      title: "Recognized Certifications",
      description: "Students undergo structured periodic evaluations accredited by state and national martial arts boards with pathways to competitive sports quota achievements."
    },
    {
      icon: Users2,
      title: "Age-Stratified Batches",
      description: "Dedicated separate training schedules for Junior Warriors (5–14 yrs), teens, women’s self-defense, and high-intensity adult athletic conditioning."
    }
  ];

  return (
    <section id="methodology" className="py-24 relative border-t border-white/[0.06] bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="eyebrow text-blue-400 block mb-3">
            The Vajra Methodology
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Built on science. <br />
            <span className="text-slate-400 font-normal">Rooted in warrior tradition.</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            We reject gimmick workouts and ungrounded martial demonstrations. Our academy develops real physical capability through systematic periodization and individual coach attention.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-display text-base font-bold text-white mb-2">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Standard 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Editorial Statement */}
        <div className="mt-14 p-8 sm:p-10 rounded-2xl bg-[#0C101D] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h4 className="font-display text-lg sm:text-xl font-bold text-white mb-2">
              Ready to assess your athletic baseline?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Attend a comprehensive 60-minute movement screening and free trial class in the course of your choice with our master instructors.
            </p>
          </div>
          <a
            href="#calculator"
            className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 text-xs font-semibold shrink-0 transition flex items-center gap-2"
          >
            <span>Launch Biometric Assessment</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
