"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck } from "lucide-react";

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
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center select-none animate-fade-in">
      
      {/* Verification Card */}
      <div className="max-w-sm w-full bg-[#0D1220] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 flex flex-col items-center">
        
        {/* Academy Emblem */}
        <div className="relative w-16 h-14 rounded-xl overflow-hidden border border-slate-700 bg-black/60 p-0.5">
          <Image
            src="/vajra-logo.jpg"
            alt="Team Vajra Emblem"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Status Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Login Verified</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight pt-1">
            Welcome to Team Vajra
          </h3>
        </div>

        {/* Student Profile Box */}
        <div className="w-full p-4 rounded-xl bg-[#141A2E] border border-slate-800 text-xs space-y-2 text-slate-300 text-left">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <span className="text-slate-400">Student Code</span>
            <strong className="text-blue-400 font-mono font-bold">{studentCode}</strong>
          </div>
          
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <span className="text-slate-400">Member Name</span>
            <strong className="text-white truncate max-w-[170px]">{studentName}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Training Course</span>
            <span className="text-slate-200 font-medium">{course}</span>
          </div>
        </div>

        {/* Simple Step Checklist */}
        <div className="w-full space-y-1.5 text-left text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className={`w-4 h-4 ${stepIndex >= 0 ? "text-emerald-400" : "text-slate-600"}`} />
            <span className={stepIndex >= 0 ? "text-slate-200 font-medium" : "text-slate-500"}>Access Code Verified</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className={`w-4 h-4 ${stepIndex >= 1 ? "text-emerald-400" : "text-slate-600"}`} />
            <span className={stepIndex >= 1 ? "text-slate-200 font-medium" : "text-slate-500"}>Loading Student Profile</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className={`w-4 h-4 ${stepIndex >= 2 ? "text-emerald-400" : "text-slate-600"}`} />
            <span className={stepIndex >= 2 ? "text-slate-200 font-medium" : "text-slate-500"}>Opening Workspace...</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
          <div className="bg-blue-500 h-full rounded-full animate-progress-3s" />
        </div>

      </div>

    </div>
  );
}
