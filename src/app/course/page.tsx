"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { SlideFromLeft, PopUpCard, FadeUp } from "@/components/ScrollAnimations";
import { useVajraTimezone } from "@/lib/timezone";
import { 
  Dumbbell, Sparkles, Shield, Flame, CheckCircle2, Clock, Users, 
  ArrowRight, ChevronRight, Zap, Globe
} from "lucide-react";

export default function CoursePage() {
  const { selectedTz, convertBatch } = useVajraTimezone();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingCourse, setBookingCourse] = useState("FITNESS");

  const handleOpenBooking = (courseName?: string) => {
    if (courseName) setBookingCourse(courseName);
    setIsBookingOpen(true);
  };

  const coursesList = [
    {
      id: "fitness",
      title: "FITNESS",
      category: "Functional Training & Conditioning",
      image: "/courses/fitness.jpg",
      desc: "Full-body strength training, metabolic conditioning, weight management, and core stamina.",
      icon: Dumbbell,
      ageGroup: "Teens & Adults (Age 14+)",
      highlights: [
        "Compound resistance & bodyweight training",
        "Targeted core strengthening & fat loss circuits",
        "Personalized fitness progression under coaches"
      ]
    },
    {
      id: "yoga",
      title: "YOGA",
      category: "Flexibility & Pranayama",
      image: "/courses/yoga.jpg",
      desc: "Traditional Hatha and Vinyasa yoga for spinal health, muscle flexibility, and breath control.",
      icon: Sparkles,
      ageGroup: "All Age Groups (Kids, Adults & Seniors)",
      highlights: [
        "Spine decompression & joint mobility postures",
        "Pranayama breathing & stress relief practices",
        "Core balance & overall postural correction"
      ]
    },
    {
      id: "martial-arts",
      title: "MARTIAL ARTS",
      category: "Combat Karate & Self-Defense",
      image: "/courses/martial-arts.jpg",
      desc: "Practical striking mechanics, defensive evasions, pad work, and recognized academy certifications.",
      icon: Shield,
      ageGroup: "Juniors (5+) & Adults",
      highlights: [
        "Striking fundamentals: punches, kicks, and blocks",
        "Practical street self-defense & reflex sparring",
        "State and national tournament coaching roadmap"
      ]
    },
    {
      id: "silambam",
      title: "SILAMBAM (சிலம்பம்)",
      category: "Traditional Tamil Martial Art",
      image: "/courses/silambam.jpg",
      desc: "Ancient Tamil weapon course focusing on footwork (18 Kaaladi), bamboo staff rotations, and Katas.",
      icon: Flame,
      ageGroup: "Juniors (5+) & Adults",
      highlights: [
        "Traditional 18 Kaaladi footwork patterns",
        "Single stick (Nedunkambu) rotation & speed drills",
        "Por Silambam paired combat and tournament katas"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#090C15] text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col overflow-x-hidden">
      <Navbar onOpenBooking={handleOpenBooking} />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-semibold">Courses</span>
          </div>

          {/* Page Header: Slide from Left */}
          <div className="max-w-3xl mb-12">
            <SlideFromLeft delay={0.1}>
              <span className="eyebrow-label block mb-2">
                Training Courses
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
                Choose Your Training Course
              </h1>
              <p className="mt-4 text-slate-300 text-base leading-relaxed">
                Select any of our 4 specialized courses below. Each program offers progressive levels, flexible morning and evening batch timings, and coaching by certified instructors.
              </p>
            </SlideFromLeft>
          </div>

          {/* =========================================================================
              2x2 MEDIUM CARDS GRID WITH POP UP ANIMATIONS
             ========================================================================= */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {coursesList.map((c, idx) => {
              const Icon = c.icon;
              return (
                <PopUpCard key={c.id} delay={0.15 * idx}>
                  <div
                    id={`course-${c.id}`}
                    className="rounded-2xl bg-[#0F1424] border border-slate-700/60 transition-all duration-300 flex flex-col justify-between overflow-hidden relative premium-card h-full"
                  >
                    <div>
                      {/* Medium Image Frame */}
                      <div className="relative h-56 w-full overflow-hidden bg-black/80 border-b border-slate-800">
                        <Image
                          src={c.image}
                          alt={`${c.title} Course`}
                          fill
                          className="object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
                          priority
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1424] via-black/40 to-black/20" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                          <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-slate-700 text-xs font-semibold text-white">
                            {c.category}
                          </span>
                        </div>

                        {/* Title on Image */}
                        <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-black/80 border border-slate-700 text-blue-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h2 className="font-display text-xl font-bold text-white tracking-tight">
                              {c.title}
                            </h2>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 space-y-4">
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[36px]">
                          {c.desc}
                        </p>

                        {/* 3 Highlights */}
                        <div className="space-y-2 border-t border-slate-800 pt-3.5">
                          {c.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                              <span className="leading-snug">{h}</span>
                            </div>
                          ))}
                        </div>

                        {/* Cohort & Batch Timing Indicators */}
                        <div className="space-y-1.5">
                          <div className="p-2.5 rounded-xl bg-[#13192B] border border-slate-700/60 text-xs flex items-center justify-between text-slate-300">
                            <span className="text-[11px] font-mono text-slate-400 uppercase">Age Group</span>
                            <div className="flex items-center gap-1.5 text-white font-medium">
                              <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>{c.ageGroup}</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#090C16] border border-blue-500/20 text-xs flex items-center justify-between text-slate-300">
                            <span className="text-[11px] font-mono text-blue-400 uppercase flex items-center gap-1">
                              <Clock className="w-3 h-3 text-blue-400" />
                              <span>Batches ({selectedTz.code})</span>
                            </span>
                            <span className="text-white text-[11px] font-bold text-right truncate">
                              {selectedTz.flag} {convertBatch("Morning (05:30 AM – 07:30 AM)").convertedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enroll Action */}
                    <div className="p-5 bg-[#0C0F1A] border-t border-slate-800">
                      <button
                        onClick={() => handleOpenBooking(c.title)}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-sm transition flex items-center justify-center gap-2"
                      >
                        <span>Enroll Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </PopUpCard>
              );
            })}
          </div>

          {/* All-Access Banner: PopUpCard */}
          <PopUpCard delay={0.3}>
            <div className="max-w-5xl mx-auto rounded-2xl bg-[#0F1424] border border-slate-700/60 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  <span>All-Access Plan</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Train in all 4 courses with one enrollment.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Combined weekly schedule across Fitness, Yoga, Martial Arts, and Silambam.
                </p>
              </div>

              <button
                onClick={() => handleOpenBooking("ALL-ACCESS TRACK")}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider shadow-sm shrink-0 transition"
              >
                Enroll in All-Access Track
              </button>
            </div>
          </PopUpCard>

        </div>
      </main>

      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialArt={bookingCourse}
      />
    </div>
  );
}
