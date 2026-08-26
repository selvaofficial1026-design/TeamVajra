"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { SlideFromLeft, PopUpCard, FadeUp } from "@/components/ScrollAnimations";
import { 
  ArrowRight, Calculator, Dumbbell, Sparkles, Shield, Flame
} from "lucide-react";

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("FITNESS");

  // Assessment State
  const [userHeight, setUserHeight] = useState<number>(172);
  const [userWeight, setUserWeight] = useState<number>(68);
  const [userAge, setUserAge] = useState<string>("adult");

  const handleOpenBooking = (courseName?: string) => {
    if (courseName) setSelectedCourse(courseName);
    setIsBookingOpen(true);
  };

  const getFeetInches = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}′${inches}″`;
  };

  // Natural Human Recommendations
  const getRankedRecommendations = () => {
    const hInMeters = userHeight / 100;
    const bmi = parseFloat((userWeight / (hInMeters * hInMeters)).toFixed(1));

    let bmiCategory = "Healthy Balanced Build";
    let bmiColor = "text-emerald-400";

    // Normal Range (18.5 - 24.9)
    let choices = [
      {
        rankBadge: "1st Choice",
        course: "MARTIAL ARTS",
        icon: Shield,
        reason: "Your body balance is ideal for learning fast strikes, reflex defense, and agility."
      },
      {
        rankBadge: "2nd Choice",
        course: "SILAMBAM (சிலம்பம்)",
        icon: Flame,
        reason: "Great fitness and coordination for mastering Tamil bamboo staff spins and traditional footwork."
      },
      {
        rankBadge: "3rd Choice",
        course: "FITNESS",
        icon: Dumbbell,
        reason: "Maintains high energy, tones your muscles, and builds strong daily stamina."
      }
    ];

    if (bmi < 18.5) {
      bmiCategory = "Lean Build / Strength Focus";
      bmiColor = "text-blue-400";
      choices = [
        {
          rankBadge: "1st Choice",
          course: "FITNESS",
          icon: Dumbbell,
          reason: "Builds core strength, healthy muscle tone, and overall body stamina with guided workouts."
        },
        {
          rankBadge: "2nd Choice",
          course: "SILAMBAM (சிலம்பம்)",
          icon: Flame,
          reason: "Develops quick hand speed, staff control, and active reflexes without heavy strain."
        },
        {
          rankBadge: "3rd Choice",
          course: "MARTIAL ARTS",
          icon: Shield,
          reason: "Teaches sharp self-defense skills, quick evasion, and athletic alertness."
        }
      ];
    } else if (bmi >= 25 && bmi <= 29.9) {
      bmiCategory = "Weight Management & Cardio";
      bmiColor = "text-amber-400";
      choices = [
        {
          rankBadge: "1st Choice",
          course: "FITNESS",
          icon: Dumbbell,
          reason: "Burns calories effectively, reduces excess fat, and strengthens your body safely."
        },
        {
          rankBadge: "2nd Choice",
          course: "YOGA",
          icon: Sparkles,
          reason: "Relieves back and neck stiffness, improves body flexibility, and calms daily stress."
        },
        {
          rankBadge: "3rd Choice",
          course: "SILAMBAM (சிலம்பம்)",
          icon: Flame,
          reason: "Continuous bamboo staff rotation gives an energetic full-body workout that is gentle on joints."
        }
      ];
    } else if (bmi >= 30) {
      bmiCategory = "Mobility & Joint Care";
      bmiColor = "text-rose-400";
      choices = [
        {
          rankBadge: "1st Choice",
          course: "YOGA",
          icon: Sparkles,
          reason: "Gentle postures that protect knees and spine, improve breathing, and restore natural posture."
        },
        {
          rankBadge: "2nd Choice",
          course: "FITNESS",
          icon: Dumbbell,
          reason: "Comfortable low-impact workouts designed to build steady stamina and burn calories."
        },
        {
          rankBadge: "3rd Choice",
          course: "SILAMBAM (சிலம்பம்)",
          icon: Flame,
          reason: "Standing movements that improve shoulder mobility, grip strength, and balance."
        }
      ];
    }

    return { bmi, bmiCategory, bmiColor, choices };
  };

  const results = getRankedRecommendations();

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-200 selection:bg-blue-600 selection:text-white flex flex-col overflow-x-clip font-sans">
      <Navbar onOpenBooking={handleOpenBooking} />

      <main className="flex-1">
        
        {/* =========================================================================
            1. HERO SECTION (Fluid, High-Contrast, Ergonomic)
           ========================================================================= */}
        <section className="relative pt-28 pb-14 sm:pt-36 sm:pb-18 md:pt-44 md:pb-24 overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] md:w-[700px] h-[280px] sm:h-[380px] bg-blue-600/[0.08] blur-[120px] pointer-events-none rounded-full" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-5 sm:space-y-6">
              
              {/* Eyebrow badge */}
              <FadeUp delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#0D1220] border border-slate-800 backdrop-blur-md shadow-sm max-w-[95%] sm:max-w-none">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                  <span className="text-blue-400 font-semibold text-[11px] sm:text-xs tracking-wide">
                    Fitness & Martial Arts Academy • Tamil Nadu
                  </span>
                </div>
              </FadeUp>

              {/* Grand Logo Emblem (Fluid & Mobile Optimized) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative cursor-pointer group pt-1 sm:pt-2 w-full flex justify-center"
              >
                <div className="relative w-full max-w-[270px] sm:max-w-[340px] md:max-w-[380px] h-36 sm:h-48 md:h-56 rounded-2xl overflow-hidden border border-slate-700 bg-black/80 shadow-2xl p-3 sm:p-4 flex items-center justify-center">
                  <Image
                    src="/vajra-logo.jpg"
                    alt="Team Vajra Official Logo"
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>
              </motion.div>

              {/* Main Headline (Pure Crisp White & High Contrast) */}
              <SlideFromLeft delay={0.2}>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] sm:leading-tight">
                  Train With Course. <br />
                  <span className="text-blue-400">Master Your Body & Mind.</span>
                </h1>
              </SlideFromLeft>

              {/* Natural Subtitle */}
              <SlideFromLeft delay={0.3}>
                <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed px-1 sm:px-0">
                  Team Vajra offers certified training in Functional Fitness, Traditional Yoga, Combat Martial Arts, and authentic Tamil Silambam for children, teens, and adults.
                </p>
              </SlideFromLeft>

              {/* Action Buttons: 44px min touch targets */}
              <FadeUp delay={0.4} className="w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleOpenBooking()}
                    className="w-full sm:w-auto min-h-[44px] px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 active:scale-[0.99]"
                  >
                    <span>Enroll in Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href="/course"
                    className="w-full sm:w-auto min-h-[44px] px-6 py-3.5 rounded-xl bg-[#0D1220] hover:bg-[#141A2E] text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center text-center active:scale-[0.99]"
                  >
                    Explore 4 Courses
                  </Link>
                </div>
              </FadeUp>

            </div>
          </div>
        </section>

        {/* =========================================================================
            2. PERSONALIZED COURSE RECOMMENDATION SECTION
           ========================================================================= */}
        <section className="py-14 sm:py-16 md:py-20 border-t border-slate-800/80 bg-[#0A0D18]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
            
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <SlideFromLeft delay={0.1}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Course Finder</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight pt-1">
                  Find the Right Course For Your Body
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Enter your height and weight below to get personalized 1st, 2nd, and 3rd training recommendations.
                </p>
              </SlideFromLeft>
            </div>

            {/* Assessment Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* LEFT: Height & Weight Controls */}
              <div className="lg:col-span-5">
                <PopUpCard delay={0.2}>
                  <div className="p-4 sm:p-6 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-4 sm:space-y-5 shadow-lg">
                    
                    <div className="pb-3 border-b border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">Your Body Measurements</span>
                      <span className="text-blue-400 font-medium">Live Calculated</span>
                    </div>

                    {/* Height Slider */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#141A2E] border border-slate-800 space-y-2.5 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Height: <strong className="text-slate-400 font-normal">({getFeetInches(userHeight)})</strong></span>
                        <span className="font-mono text-blue-400 font-bold text-sm bg-blue-600/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                          {userHeight} cm
                        </span>
                      </div>
                      <input
                        type="range"
                        min="120"
                        max="210"
                        value={userHeight}
                        onChange={(e) => setUserHeight(Number(e.target.value))}
                        className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        aria-label="Height Slider"
                      />
                    </div>

                    {/* Weight Slider */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#141A2E] border border-slate-800 space-y-2.5 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Body Weight:</span>
                        <span className="font-mono text-blue-400 font-bold text-sm bg-blue-600/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                          {userWeight} kg
                        </span>
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="140"
                        value={userWeight}
                        onChange={(e) => setUserWeight(Number(e.target.value))}
                        className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        aria-label="Weight Slider"
                      />
                    </div>

                    {/* Age Selector */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#141A2E] border border-slate-800 space-y-2 text-xs">
                      <span className="block text-slate-300 font-medium">Age Group</span>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        {[
                          { id: "junior", label: "Junior (5-14)" },
                          { id: "adult", label: "Adult (15-45)" },
                          { id: "senior", label: "Senior (45+)" },
                        ].map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => setUserAge(a.id)}
                            className={`min-h-[44px] py-2 px-1.5 rounded-xl border text-[11px] sm:text-xs font-medium transition flex items-center justify-center text-center leading-tight ${
                              userAge === a.id
                                ? "bg-blue-600 text-white border-blue-500 font-bold shadow-sm"
                                : "bg-[#0D1220] border-slate-700 text-slate-400 hover:text-white"
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* BMI Result Box */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#141A2E] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Body Mass Index (BMI):</span>
                        <span className="font-mono text-lg sm:text-xl font-bold text-white">{results.bmi}</span>
                      </div>
                      <div className="sm:text-right">
                        <span className={`font-semibold block text-xs sm:text-sm ${results.bmiColor}`}>{results.bmiCategory}</span>
                        <span className="text-[10px] text-slate-400">Normal Range: 18.5 – 24.9</span>
                      </div>
                    </div>

                  </div>
                </PopUpCard>
              </div>

              {/* RIGHT: Ranked Choices */}
              <div className="lg:col-span-7 space-y-3.5">
                <PopUpCard delay={0.3}>
                  <div className="space-y-3">
                    
                    {results.choices.map((c, idx) => {
                      const Icon = c.icon;
                      const isPrimary = idx === 0;
                      return (
                        <div
                          key={c.course}
                          className={`rounded-2xl p-4 sm:p-5 border transition ${
                            isPrimary
                              ? "bg-[#0D1220] border-blue-500/50 shadow-md"
                              : "bg-[#0D1220] border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-2.5 rounded-xl border shrink-0 ${isPrimary ? "bg-blue-600/20 text-blue-400 border-blue-500/30" : "bg-[#141A2E] text-slate-400 border-slate-700"}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${isPrimary ? "bg-blue-600/20 text-blue-400" : "bg-slate-800 text-slate-400"}`}>
                                  {c.rankBadge}
                                </span>
                                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5 truncate">
                                  {c.course}
                                </h3>
                              </div>
                            </div>

                            <button
                              onClick={() => handleOpenBooking(c.course)}
                              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 flex items-center justify-center gap-1.5 w-full sm:w-auto active:scale-[0.98] ${
                                isPrimary
                                  ? "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                                  : "bg-[#141A2E] hover:bg-[#1C253D] active:bg-[#232D4B] text-slate-200 border border-slate-700"
                              }`}
                            >
                              <span>Enroll</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed pt-2.5 border-t border-slate-800/80">
                            <strong className="text-slate-100 font-medium">Why this fits: </strong>
                            {c.reason}
                          </p>
                        </div>
                      );
                    })}

                  </div>
                </PopUpCard>
              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialArt={selectedCourse}
      />
    </div>
  );
}
