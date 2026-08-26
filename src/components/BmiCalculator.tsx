"use client";

import React, { useState } from "react";
import { Activity, ArrowRight, CheckCircle2, Sparkles, Shield, Dumbbell, Flame } from "lucide-react";

interface BmiCalculatorProps {
  onOpenBooking: (recommendedArt: string) => void;
}

export default function BmiCalculator({ onOpenBooking }: BmiCalculatorProps) {
  const [height, setHeight] = useState<string>("172");
  const [weight, setWeight] = useState<string>("70");
  const [goal, setGoal] = useState<string>("strength");
  
  const [result, setResult] = useState<{
    bmi: number;
    classification: string;
    targetArt: string;
    rationale: string;
  } | null>(null);

  const calculateBiometrics = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;

    const bmiVal = parseFloat((w / (h * h)).toFixed(1));
    let classification = "Normal Athletic Range";
    let targetArt = "FITNESS";
    let rationale = "Functional resistance and athletic conditioning will elevate your power output and metabolic conditioning.";

    if (bmiVal < 18.5) {
      classification = "Lean / Low Biomass";
      if (goal === "combat") {
        targetArt = "MARTIAL ARTS";
        rationale = "Combat striking and resistance conditioning will develop dense functional muscle and defensive reflexes.";
      } else if (goal === "heritage") {
        targetArt = "SILAMBAM";
        rationale = "Light frame agility provides supreme leverage for high-velocity bamboo staff rotational patterns.";
      } else {
        targetArt = "FITNESS";
        rationale = "Hypertrophy-focused resistance training with structured caloric surplus to build lean warrior muscle.";
      }
    } else if (bmiVal >= 18.5 && bmiVal < 25) {
      classification = "Optimal Biomass Range";
      if (goal === "heritage") {
        targetArt = "SILAMBAM";
        rationale = "Your physiological baseline is primed for explosive 18 Kaaladi footwork and tournament combat staff mastery.";
      } else if (goal === "combat") {
        targetArt = "MARTIAL ARTS";
        rationale = "Calibrate fast-twitch reflexes, distance management, and full-contact pad striking in Martial Arts.";
      } else if (goal === "flexibility") {
        targetArt = "YOGA";
        rationale = "Deepen fascia mobility, spine decompression, and autonomic respiratory control in Classical Yoga.";
      } else {
        targetArt = "FITNESS";
        rationale = "Advance into high-threshold interval training, Olympic lifting mechanics, and power endurance.";
      }
    } else if (bmiVal >= 25 && bmiVal < 30) {
      classification = "Elevated Biomass";
      if (goal === "flexibility") {
        targetArt = "YOGA";
        rationale = "Low-impact therapeutic asanas will safeguard joint cartilage while enhancing metabolic circulation.";
      } else {
        targetArt = "FITNESS";
        rationale = "High-energy functional circuits tailored for steady fat oxidation while reinforcing spinal and knee stability.";
      }
    } else {
      classification = "High Biomass / Joint Care";
      targetArt = "YOGA";
      rationale = "Begin with restorative mobility and breath regulation to decompress joints and reset metabolic baseline before high-impact sparring.";
    }

    setResult({
      bmi: bmiVal,
      classification,
      targetArt,
      rationale
    });
  };

  return (
    <section id="calculator" className="py-24 relative border-t border-white/[0.06] bg-[#070A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="eyebrow text-blue-400 block">
              Biometric Assessment Engine
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Discover your ideal <br />
              <span className="text-slate-400 font-normal">training course.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every individual possesses unique biomechanical baselines. Input your physical metrics to receive an objective recommendation from Team Vajra coaches.
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Immediate BMI & metabolic classification calculation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Tailored course match aligned with your physical goals</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Pre-filled pass for a 100% complimentary trial screening</span>
              </div>
            </div>
          </div>

          {/* Right Column: Diagnostic Form & Report */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0B0F1A] border border-white/[0.08] shadow-2xl">
              
              <form onSubmit={calculateBiometrics} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Height */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Height (Centimeters)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="230"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#0F1424] border border-white/[0.08] text-white text-sm focus:border-blue-500 focus:outline-none transition"
                      placeholder="e.g. 172"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Weight (Kilograms)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="200"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#0F1424] border border-white/[0.08] text-white text-sm focus:border-blue-500 focus:outline-none transition"
                      placeholder="e.g. 70"
                    />
                  </div>
                </div>

                {/* Primary Training Goal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Primary Athletic Objective
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "strength", label: "Strength & Power" },
                      { id: "flexibility", label: "Mobility & Calm" },
                      { id: "combat", label: "Combat Defense" },
                      { id: "heritage", label: "Tamil Silambam" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setGoal(item.id)}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                          goal === item.id
                            ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm"
                            : "bg-[#0F1424] border-white/[0.06] text-slate-400 hover:border-white/15"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Generate Biometric Assessment</span>
                </button>

              </form>

              {/* Assessment Report Card */}
              {result && (
                <div className="mt-8 pt-6 border-t border-white/[0.08] space-y-4">
                  
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#0F1424] border border-white/[0.06]">
                    <div>
                      <span className="text-[11px] font-mono text-slate-500 uppercase block">Calculated BMI</span>
                      <span className="font-display text-2xl font-bold text-white mt-0.5 block">{result.bmi}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-slate-500 uppercase block">Status</span>
                      <span className="text-xs font-semibold text-blue-400 mt-1 block">{result.classification}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0E1528] border border-blue-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-blue-400 uppercase font-semibold">Recommended Track</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">Matched</span>
                    </div>

                    <h4 className="font-display text-xl font-bold text-white tracking-tight">
                      {result.targetArt}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {result.rationale}
                    </p>

                    <button
                      onClick={() => onOpenBooking(result.targetArt)}
                      className="w-full mt-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <span>Claim Free Trial in {result.targetArt}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
