"use client";

import React, { useState } from "react";
import { Dumbbell, Sparkles, Shield, Flame, CheckCircle2, Clock, Users, ArrowRight, ChevronRight, Zap } from "lucide-react";
import { ARTS_DATA, ArtProgram } from "@/data/artsData";

interface CourseSectionProps {
  onOpenBooking: (courseName: string) => void;
}

export default function CourseSection({ onOpenBooking }: CourseSectionProps) {
  const [activeCourseId, setActiveCourseId] = useState<string>("fitness");

  const activeCourse = ARTS_DATA.find((a) => a.id === activeCourseId) || ARTS_DATA[0];

  const getCourseIcon = (id: string) => {
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

  const Icon = getCourseIcon(activeCourse.id);

  return (
    <section id="course" className="py-24 relative border-t border-white/[0.06] bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="eyebrow text-blue-400 block mb-3">
            Academic Programs & Courses
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            The Four Core Courses. <br />
            <span className="text-slate-400 font-normal">Choose your course or combine them.</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Each course at Team Vajra features progressive graded stages, personalized coach feedback, and flexible morning/evening batch slots.
          </p>
        </div>

        {/* 4 Courses Switcher Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {ARTS_DATA.map((course) => {
            const isSelected = activeCourseId === course.id;
            const CourseIcon = getCourseIcon(course.id);
            return (
              <button
                key={course.id}
                id={`course-${course.id}`}
                onClick={() => setActiveCourseId(course.id)}
                className={`p-5 rounded-2xl text-left transition-all relative border flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#0F162A] border-blue-500 shadow-xl shadow-blue-950/50 scale-[1.02]"
                    : "bg-[#0B0F1A] border-white/[0.06] hover:border-white/15 hover:bg-[#0E1322]"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-4">
                  <span className={isSelected ? "text-blue-400 font-bold" : "text-slate-500"}>
                    {course.num}
                  </span>
                  <CourseIcon className={`w-4 h-4 ${isSelected ? "text-blue-400" : "text-slate-500"}`} />
                </div>

                <div>
                  <h3 className={`font-display text-base sm:text-lg font-bold tracking-tight ${
                    isSelected ? "text-white" : "text-slate-300"
                  }`}>
                    {course.name}
                  </h3>
                  <span className="text-xs text-slate-400 block mt-0.5 truncate">
                    {course.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Course Blueprint Card */}
        <div className="rounded-2xl bg-[#0B0F1A] border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Course Overview, Pillars & Target Outcomes */}
            <div className="lg:col-span-7 space-y-8">
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                      Course {activeCourse.num}
                    </span>
                    {activeCourse.tamilTitle && (
                      <span className="text-xs text-amber-400/90 ml-3 font-medium">
                        {activeCourse.tamilTitle}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display text-3xl font-bold text-white tracking-tight">
                  {activeCourse.name} Course
                </h3>
                <p className="text-slate-300 font-medium text-sm sm:text-base mt-1">
                  {activeCourse.tagline}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed mt-4">
                  {activeCourse.description}
                </p>
              </div>

              {/* Core Pillars */}
              <div className="space-y-3">
                <h4 className="eyebrow text-slate-400">
                  Course Modules & Core Syllabus
                </h4>
                <div className="space-y-3">
                  {activeCourse.pillars.map((pillar, pIdx) => (
                    <div key={pIdx} className="p-4 rounded-xl bg-[#0F1424] border border-white/[0.05]">
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

              {/* Course Outcomes */}
              <div>
                <h4 className="eyebrow text-slate-400 mb-3">
                  Key Learning Outcomes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeCourse.outcomes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Progressive Phases, Batch Timing & Enrollment */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Metric Breakdown */}
              <div className="p-4 rounded-xl bg-[#0F1424] border border-white/[0.06] grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 font-mono block uppercase">Intensity</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{activeCourse.metrics.intensity}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-mono block uppercase">Recovery</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{activeCourse.metrics.recoveryDemand}</span>
                </div>
              </div>

              {/* Progressive 3-Stage Curriculum */}
              <div className="p-5 rounded-xl bg-[#0F1424] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Graded Progression</h4>
                  <span className="text-[11px] text-blue-400 font-mono">3 Stages</span>
                </div>

                <div className="space-y-3">
                  {activeCourse.progression.map((stage, sIdx) => (
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
                    <span className="font-semibold text-slate-300 block">Class Batches:</span>
                    <span className="text-slate-400">{activeCourse.schedulePreview}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pt-2 border-t border-white/[0.06]">
                  <Users className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-300 block">Eligible Age Group:</span>
                    <span className="text-slate-400">{activeCourse.whoIsThisFor}</span>
                  </div>
                </div>
              </div>

              {/* Enrollment CTA */}
              <button
                onClick={() => onOpenBooking(activeCourse.name)}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Enroll in {activeCourse.name} / Book Free Trial</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
