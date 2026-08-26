"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { SlideFromLeft, PopUpCard, FadeUp } from "@/components/ScrollAnimations";
import { 
  ShieldCheck, Activity, Award, Users2, ArrowRight, CheckCircle2, 
  ChevronRight, MessageSquare, MapPin, Phone, Flame, Sparkles, Dumbbell
} from "lucide-react";

export default function AboutPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const pillars = [
    {
      icon: Flame,
      title: "Traditional Silambam Lineage",
      desc: "Authentic Tamil Silambam training with complete 18 Kaaladi footwork, single stick rotations, and tournament sparring."
    },
    {
      icon: ShieldCheck,
      title: "Combat Martial Arts",
      desc: "Practical self-defense, striking fundamentals, guard posture, and reaction speed for all age groups."
    },
    {
      icon: Dumbbell,
      title: "Functional Strength & Conditioning",
      desc: "Progressive compound strength and core workouts designed for joint safety, daily stamina, and muscle tone."
    },
    {
      icon: Sparkles,
      title: "Classical Hatha & Vinyasa Yoga",
      desc: "Guided breathing, spinal alignment, and flexibility routines for stress recovery and mental focus."
    }
  ];

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-200 selection:bg-blue-600 selection:text-white flex flex-col font-sans overflow-x-hidden">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-semibold">About Academy</span>
          </div>

          {/* Page Hero Header */}
          <div className="max-w-3xl space-y-3">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Team Vajra Fitness Arts</span>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Building Physical Strength & Martial Course
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Team Vajra is a premier training academy providing authentic coaching in physical conditioning, restorative yoga, combat martial arts, and traditional Tamil weaponry.
              </p>
            </FadeUp>
          </div>

          {/* =========================================================================
              FOUNDER & HEAD COACH SPOTLIGHT SECTION (Real Photo Integration)
             ========================================================================= */}
          <div className="rounded-3xl bg-[#0D1220] border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left: Founder Real Photo Frame */}
              <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-88 md:h-88 rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-2xl group">
                  <Image
                    src="/founder.jpg"
                    alt="Founder & Head Coach - Team Vajra"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220] via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>
              </div>

              {/* Right: Founder Bio & Coach Profile */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                    Academy Leadership
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                    Founder & Head Coach
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">
                    Team Vajra Fitness & Martial Arts Academy
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Dedicated to preserving and teaching authentic Tamil Silambam, combat striking arts, and modern functional fitness. With years of hands-on coaching experience, our training focuses on coursed form, joint safety, and progressive student development.
                </p>

                {/* Key Coach Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Master Coach in Silambam & Martial Arts</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Functional Conditioning Specialist</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Structured Progress Testing & Certification</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Separate Kids, Teens & Adult Batches</span>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="pt-3 flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/918668102797?text=Hello%20Master,%20I%20would%20like%20to%20know%20more%20about%20your%20training%20batches."
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat With Coach on WhatsApp</span>
                  </a>

                  <a
                    href="tel:+918668102797"
                    className="px-5 py-3 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call +91 86681 02797</span>
                  </a>
                </div>

              </div>

            </div>
          </div>

          {/* =========================================================================
              4 CORE TRAINING COURSES
             ========================================================================= */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Our Programs
              </span>
              <h3 className="text-2xl font-bold text-white">
                Core Training Courses
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <PopUpCard key={idx} delay={0.08 * (idx + 1)}>
                    <div className="p-6 rounded-2xl bg-[#0D1220] border border-slate-800 flex flex-col justify-between h-full space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </PopUpCard>
                );
              })}
            </div>
          </div>

          {/* Academy Facility & Location */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0D1220] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl font-bold text-white">
                Academy Facility & Floor Location
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Equipped with high-density tatami training mats, punch bags, sanitized yoga props, and competition bamboo Silambam staffs.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Main Ring Road, Tamil Nadu, India • +91 86681 02797</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider transition shadow"
              >
                Enroll Now
              </button>
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-200 border border-slate-700 font-semibold text-xs uppercase tracking-wider transition"
              >
                Contact Us
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
