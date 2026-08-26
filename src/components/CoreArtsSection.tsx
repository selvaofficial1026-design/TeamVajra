"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Users, Flame, Dumbbell, Sparkles, Shield, ChevronRight } from "lucide-react";
import { ARTS_DATA, ArtProgram } from "@/data/artsData";

interface CoreArtsSectionProps {
  onOpenBooking: (artName: string) => void;
}

export default function CoreArtsSection({ onOpenBooking }: CoreArtsSectionProps) {
  const [activeId, setActiveId] = useState<string>("fitness");

  const activeArt = ARTS_DATA.find((a) => a.id === activeId) || ARTS_DATA[0];

  const getArtIcon = (id: string) => {
    switch (id) {
      case "fitness":
        return Dumbbell;
      case "yoga":
        return Sparkles;
      case "martial-arts":
        return Shield;
      case "silambam":
        return Flame;
      default:
        return Dumbbell;
    }
  };

  const Icon = getArtIcon(activeArt.id);

  return (
    <section id="courses" className="py-24 relative border-t border-white/[0.06] bg-[#070A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="eyebrow text-blue-400 block mb-3">
            Core Courses
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Four specialized pathways. <br />
            <span className="text-slate-400 font-normal">One unified standard of excellence.</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Every program at Team Vajra is backed by systematic curriculum architecture, measurable progressive phases, and certified master supervision.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-10">
          {ARTS_DATA.map((art) => {
            const isSelected = activeId === art.id;
            return (
              <button
                key={art.id}
                id={`course-${art.id}`}
                onClick={() => setActiveId(art.id)}
                className={`p-4 sm:p-5 rounded-xl text-left transition-all relative border flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#0F162A] border-blue-500/60 shadow-lg shadow-blue-950/40"
                    : "bg-[#0B0F1A] border-white/[0.06] hover:border-white/15 hover:bg-[#0E1322]"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className={isSelected ? "text-blue-400 font-semibold" : "text-slate-500"}>
                    {art.num}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </div>

                <div>
                  <h3 className={`font-display text-base sm:text-lg font-bold tracking-tight ${
                    isSelected ? "text-white" : "text-slate-300"
                  }`}>
                    {art.name}
                  </h3>
                  <span className="text-xs text-slate-400 block mt-0.5 truncate">
                    {art.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Course Display Card */}
        <div className="rounded-2xl bg-[#0B0F1A] border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Overview, Pillars & Tangible Outcomes */}
            <div className="lg:col-span-7 space-y-8">
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                      Course {activeArt.num}
                    </span>
                    {activeArt.tamilTitle && (
                      <span className="text-xs text-amber-400/90 ml-3 font-medium">
                        {activeArt.tamilTitle}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {activeArt.name}
                </h3>
                <p className="text-slate-300 font-medium text-sm sm:text-base mt-1">
                  {activeArt.tagline}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed mt-4">
                  {activeArt.description}
                </p>
              </div>

              {/* Core Pillars */}
              <div className="space-y-3">
                <h4 className="eyebrow text-slate-400">
                  Methodology & Focus Pillars
                </h4>
                <div className="space-y-3">
                  {activeArt.pillars.map((pillar, pIdx) => (
                    <div key={pIdx} className="p-3.5 rounded-xl bg-[#0F1424] border border-white/[0.05]">
                      <h5 className="text-xs sm:text-sm font-semibold text-white">
                        {pillar.title}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Outcomes */}
              <div>
                <h4 className="eyebrow text-slate-400 mb-3">
                  Target Outcomes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeArt.outcomes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Progressive Phases & Enrollment Details */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Metric Breakdown Pill Box */}
              <div className="p-4 rounded-xl bg-[#0F1424] border border-white/[0.06] grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 font-mono block uppercase">Intensity</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{activeArt.metrics.intensity}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-mono block uppercase">Recovery</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{activeArt.metrics.recoveryDemand}</span>
                </div>
              </div>

              {/* Progressive Phases */}
              <div className="p-5 rounded-xl bg-[#0F1424] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Progression Roadmap</h4>
                  <span className="text-[11px] text-blue-400 font-mono">3 Stages</span>
                </div>

                <div className="space-y-3">
                  {activeArt.progression.map((stage, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{stage.stage}</span>
                        <span className="text-slate-500 font-mono text-[11px]">{stage.duration}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {stage.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule & Candidate Profile */}
              <div className="p-4 rounded-xl bg-[#0F1424] border border-white/[0.06] space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-300 block">Weekly Batches:</span>
                    <span className="text-slate-400">{activeArt.schedulePreview}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pt-2 border-t border-white/[0.06]">
                  <Users className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-300 block">Target Audience:</span>
                    <span className="text-slate-400">{activeArt.whoIsThisFor}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => onOpenBooking(activeArt.name)}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Book Assessment for {activeArt.name}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
