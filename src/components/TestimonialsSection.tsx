"use client";

import React from "react";
import { TESTIMONIALS } from "@/data/artsData";

export default function TestimonialsSection() {
  return (
    <section className="py-24 relative border-t border-white/[0.06] bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="eyebrow text-blue-400 block mb-3">
            Practitioner Case Studies
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Proven outcomes. <br />
            <span className="text-slate-400 font-normal">Real physical transformation.</span>
          </h2>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl glass-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-blue-400 font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    {item.course}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.metric}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.06]">
                <h4 className="font-display font-bold text-sm text-white">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
