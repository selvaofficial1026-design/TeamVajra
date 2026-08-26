"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Sparkles, Flame, Shield, Dumbbell, Cpu, Lock } from "lucide-react";

interface StudentVerificationSplashProps {
  studentName: string;
  studentCode: string;
  course?: string;
  onComplete: () => void;
}

export default function StudentVerificationSplash({
  studentName,
  studentCode,
  course = "Martial Arts",
  onComplete,
}: StudentVerificationSplashProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStepIndex(1), 700);
    const t2 = setTimeout(() => setStepIndex(2), 1400);
    const t3 = setTimeout(() => {
      setStepIndex(3);
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const getCourseIcon = (courseName: string) => {
    switch (courseName) {
      case "SILAMBAM": return Flame;
      case "MARTIAL ARTS": return Shield;
      case "FITNESS": return Dumbbell;
      case "YOGA": return Sparkles;
      default: return Shield;
    }
  };

  const CourseIcon = getCourseIcon(course);

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-3.5 sm:p-6 text-center select-none animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Student Identity Verification"
    >
      {/* Background Ambient Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Obsidian Executive Verification Card Container */}
      <div className="relative max-w-sm sm:max-w-md w-full rounded-3xl bg-gradient-to-b from-[#11172A] via-[#0A0E1A] to-[#04060C] border border-blue-500/30 p-5 sm:p-8 shadow-2xl shadow-blue-950/80 space-y-4 sm:space-y-6 flex flex-col items-center ring-1 ring-white/15 overflow-hidden animate-scale-up">
        
        {/* Top Luxury Gold & Sky-Blue Foil Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-sky-400 to-blue-600" />

        {/* Martial Arts Academy Emblem with Animated Gold Rim Halo */}
        <div className="relative mt-1">
          <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-amber-500 via-sky-400 to-blue-600 opacity-60 blur-sm animate-pulse" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-[#060810] p-1.5 shadow-2xl flex items-center justify-center">
            <Image
              src="/vajra-logo.jpg"
              alt="Team Vajra Emblem"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-950 border border-emerald-500 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </div>
        </div>

        {/* Status Header */}
        <div className="space-y-1.5 w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>IDENTITY VERIFIED • ACCESS GRANTED</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight pt-0.5">
            Welcome to Team Vajra
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Establishing encrypted session for athlete portal...
          </p>
        </div>

        {/* Athlete Digital Pass Credential Preview */}
        <div className="w-full p-4 rounded-2xl bg-[#070B16]/90 border border-blue-500/25 text-xs space-y-2.5 text-slate-300 text-left shadow-inner relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />

          {/* Student Access Code */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3 text-sky-400" />
              <span>Student ID</span>
            </span>
            <strong className="text-sky-400 font-mono font-extrabold text-xs sm:text-sm tracking-wider bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-500/30">
              {studentCode}
            </strong>
          </div>
          
          {/* Member Full Name */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Member Name</span>
            <strong className="text-white font-bold truncate max-w-[190px] text-xs sm:text-sm text-right">
              {studentName}
            </strong>
          </div>

          {/* Course Track */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Course Track</span>
            <span className="inline-flex items-center gap-1.5 text-slate-200 font-semibold px-2 py-0.5 rounded bg-[#131A2F] border border-slate-700 text-[11px]">
              <CourseIcon className="w-3 h-3 text-blue-400" />
              <span>{course}</span>
            </span>
          </div>
        </div>

        {/* Multi-Stage Verification Telemetry Checklist */}
        <div className="w-full space-y-2 text-left text-xs">
          <div className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
            stepIndex >= 0 ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200" : "bg-[#090D18] border-slate-800 text-slate-500"
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${stepIndex >= 0 ? "text-emerald-400" : "text-slate-600"}`} />
              <span className={`text-xs truncate ${stepIndex >= 0 ? "font-semibold text-slate-200" : "text-slate-500"}`}>
                Access Code & Registry Handshake
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">PASS</span>
          </div>

          <div className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
            stepIndex >= 1 ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200" : "bg-[#090D18] border-slate-800 text-slate-500"
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${stepIndex >= 1 ? "text-emerald-400" : "text-slate-600"}`} />
              <span className={`text-xs truncate ${stepIndex >= 1 ? "font-semibold text-slate-200" : "text-slate-500"}`}>
                Biometric ID & Batch Matrix Decrypted
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold shrink-0 ${stepIndex >= 1 ? "text-emerald-400" : "text-slate-600"}`}>
              {stepIndex >= 1 ? "READY" : "SYNC"}
            </span>
          </div>

          <div className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
            stepIndex >= 2 ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200" : "bg-[#090D18] border-slate-800 text-slate-500"
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${stepIndex >= 2 ? "text-emerald-400" : "text-slate-600"}`} />
              <span className={`text-xs truncate ${stepIndex >= 2 ? "font-semibold text-slate-200" : "text-slate-500"}`}>
                Athlete Workspace Encrypted & Launching
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold shrink-0 ${stepIndex >= 2 ? "text-emerald-400" : "text-slate-600"}`}>
              {stepIndex >= 2 ? "ONLINE" : "INIT"}
            </span>
          </div>
        </div>

        {/* Dual Luxury Shimmer Progress Bar */}
        <div className="w-full space-y-1">
          <div className="w-full bg-[#080B14] rounded-full h-1.5 overflow-hidden border border-slate-800 p-0.5">
            <div className="bg-gradient-to-r from-amber-500 via-sky-400 to-blue-500 h-full rounded-full animate-progress-3s shadow-sm" />
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-widest px-0.5">
            <span>VAJRA AUTH GATE</span>
            <span className="text-amber-400">REDIRECTING IN 3s</span>
          </div>
        </div>

      </div>

    </div>
  );
}
