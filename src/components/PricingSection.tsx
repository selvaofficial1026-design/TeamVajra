"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { MEMBERSHIP_TIERS } from "@/data/artsData";

interface PricingSectionProps {
  onOpenBooking: (planName: string) => void;
}

export default function PricingSection({ onOpenBooking }: PricingSectionProps) {
  return (
    <section id="membership" className="py-24 relative border-t border-white/[0.06] bg-[#070A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="eyebrow text-blue-400 block mb-3">
            Membership Architecture
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Transparent pricing. <br />
            <span className="text-slate-400 font-normal">Zero hidden admission fees.</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Select a specialized focus in one art or unlock multi-course warrior access. Flexible month-to-month and annual terms available.
          </p>
        </div>

        {/* 3 Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {MEMBERSHIP_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                tier.recommended
                  ? "bg-[#0E1528] border-2 border-blue-500 shadow-2xl shadow-blue-950/60 lg:-translate-y-2"
                  : "bg-[#0B0F1A] border border-white/[0.08]"
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                  Recommended Track
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-white">
                    {tier.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">
                  {tier.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-slate-400">₹</span>
                  <span className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/{tier.period}</span>
                </div>

                <p className="text-xs text-slate-400 mt-4 leading-relaxed border-b border-white/[0.06] pb-5">
                  {tier.description}
                </p>

                <div className="mt-6 space-y-3">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                    Program Inclusions
                  </span>
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => onOpenBooking(tier.name)}
                  className={`w-full py-3.5 rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
                    tier.recommended
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25"
                      : "bg-[#141B30] hover:bg-[#1A233D] text-slate-200 border border-white/[0.08]"
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center text-xs text-slate-500">
          * Corporate group plans & family packages available with subsidized rates. Contact master helpline for details.
        </div>

      </div>
    </section>
  );
}
