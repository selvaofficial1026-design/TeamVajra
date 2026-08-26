"use client";

import React, { useState } from "react";
import { Clock, Calendar, ChevronRight, UserCheck } from "lucide-react";
import { SCHEDULE_DAYS } from "@/data/artsData";

interface TimetableSectionProps {
  onOpenBooking: () => void;
}

export default function TimetableSection({ onOpenBooking }: TimetableSectionProps) {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  const currentDay = SCHEDULE_DAYS[selectedDayIdx] || SCHEDULE_DAYS[0];

  const getCourseBadge = (art: string) => {
    switch (art) {
      case "FITNESS":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "YOGA":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
      case "MARTIAL ARTS":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "SILAMBAM":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-800 text-slate-300 border-white/10";
    }
  };

  return (
    <section id="schedule" className="py-24 relative border-t border-white/[0.06] bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="eyebrow text-blue-400 block mb-3">
              Weekly Training Matrix
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Structured schedules <br />
              <span className="text-slate-400 font-normal">for consistent progression.</span>
            </h2>
          </div>

          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition self-start md:self-auto shadow-sm"
          >
            Reserve Trial Slot
          </button>
        </div>

        {/* Day Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {SCHEDULE_DAYS.map((d, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <button
                key={d.day}
                onClick={() => setSelectedDayIdx(idx)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30"
                    : "bg-[#0B0F1A] border-white/[0.06] text-slate-400 hover:text-white hover:bg-[#0F1424]"
                }`}
              >
                {d.day}
              </button>
            );
          })}
        </div>

        {/* Day Slots List */}
        <div className="rounded-2xl bg-[#0B0F1A] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden shadow-xl">
          {currentDay.slots.map((slot, sIdx) => (
            <div
              key={sIdx}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 min-w-[170px]">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{slot.time}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getCourseBadge(slot.art)}`}>
                      {slot.art}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {slot.level}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-white">
                    {slot.title}
                  </h4>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="self-start sm:self-auto px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] text-xs font-medium transition"
              >
                Book This Slot
              </button>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 px-2">
          <span>* Sunday sessions are reserved for specialized weaponry workshops & master belt gradings.</span>
          <span className="hidden sm:inline">1-on-1 private coaching available upon request.</span>
        </div>

      </div>
    </section>
  );
}
