"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { PopUpCard, FadeUp } from "@/components/ScrollAnimations";
import { 
  Sparkles, Flame, Shield, Dumbbell, Maximize2, 
  X, ChevronLeft, ChevronRight, Camera, MessageSquare, Phone,
  Layers, Compass, RefreshCw
} from "lucide-react";

interface GalleryItem {
  id: string;
  course: "SILAMBAM" | "MARTIAL ARTS" | "FITNESS" | "YOGA";
  title: string;
  category: string;
  image: string;
  description: string;
  tag: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    course: "SILAMBAM",
    title: "Silambam Footwork & Stance Practice",
    category: "Traditional Silambam (சிலம்பம்)",
    image: "/courses/silambam.jpg",
    description: "Students practicing traditional 18 Kaaladi footwork lines, balance, and stance transitions under master guidance.",
    tag: "Footwork Forms"
  },
  {
    id: "gal-2",
    course: "MARTIAL ARTS",
    title: "Martial Arts Striking & Defense Drills",
    category: "Combat & Self-Defense",
    image: "/courses/martial-arts.jpg",
    description: "Focus mitt training focusing on punch precision, reflex timing, and guard protection.",
    tag: "Striking Drills"
  },
  {
    id: "gal-3",
    course: "FITNESS",
    title: "Strength & Conditioning Sessions",
    category: "Functional Fitness",
    image: "/courses/fitness.jpg",
    description: "Guided barbell and bodyweight workouts designed to build core strength, stamina, and energy.",
    tag: "Strength Training"
  },
  {
    id: "gal-4",
    course: "YOGA",
    title: "Classical Yoga Flow & Flexibility",
    category: "Hatha & Vinyasa Yoga",
    image: "/courses/yoga.jpg",
    description: "Posture alignment and breathing exercises for joint flexibility, mental focus, and muscle recovery.",
    tag: "Mind & Body"
  },
  {
    id: "gal-5",
    course: "SILAMBAM",
    title: "Silambam Single Stick Speed Drills",
    category: "Staff Mastery",
    image: "/courses/silambam.jpg",
    description: "Continuous wrist rotation exercises to improve stick control, grip strength, and speed.",
    tag: "Stick Drills"
  },
  {
    id: "gal-6",
    course: "MARTIAL ARTS",
    title: "Practical Self-Defense Techniques",
    category: "Practical Defense",
    image: "/courses/martial-arts.jpg",
    description: "Effective evasion, joint locks, and situational self-defense training for all age groups.",
    tag: "Self-Defense"
  }
];

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Interactive View Mode: 'orbit' (Burst split from rotating logo) or 'grid' (Structured grid)
  const [viewMode, setViewMode] = useState<"orbit" | "grid">("orbit");
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [splitBurstKey, setSplitBurstKey] = useState(0);

  const filteredItems = selectedFilter === "ALL" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.course === selectedFilter);

  const activePhoto = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handleNextPhoto = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
  };

  const handlePrevPhoto = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const triggerResplit = () => {
    setSplitBurstKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-200 selection:bg-blue-600 selection:text-white flex flex-col font-sans overflow-x-hidden">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      <main className="flex-1 pt-32 pb-24 relative">
        
        {/* Background Ambient Radial Glow */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/[0.06] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" />
                <span>Interactive Photo Showcase</span>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Academy Training & Practice Photos
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Watch practice moments split and radiate outwards from the central Team Vajra emblem.
              </p>
            </FadeUp>
          </div>

          {/* Filter Tabs & View Switcher */}
          <FadeUp delay={0.25}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { id: "ALL", label: "All Arts", icon: Sparkles },
                  { id: "SILAMBAM", label: "Silambam (சிலம்பம்)", icon: Flame },
                  { id: "MARTIAL ARTS", label: "Martial Arts", icon: Shield },
                  { id: "FITNESS", label: "Fitness", icon: Dumbbell },
                  { id: "YOGA", label: "Yoga", icon: Sparkles },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = selectedFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setSelectedFilter(tab.id);
                        triggerResplit();
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-blue-600 text-white font-bold shadow"
                          : "bg-[#0D1220] border border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* View Mode Toggle + Re-Split Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerResplit}
                  className="px-3 py-2 rounded-xl bg-[#0D1220] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition"
                  title="Re-trigger Logo Split Animation"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Split Burst</span>
                </button>

                <div className="p-1 rounded-xl bg-[#0D1220] border border-slate-800 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("orbit")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      viewMode === "orbit"
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Logo Split View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Grid View</span>
                  </button>
                </div>
              </div>

            </div>
          </FadeUp>

          {/* ===================================================================
              VIEW 1: SIGNATURE LOGO ROTATION & RADIAL SPLIT SHOWCASE
             =================================================================== */}
          {viewMode === "orbit" ? (
            <div className="relative py-12 px-2 flex flex-col items-center justify-center min-h-[700px] select-none">
              
              {/* Radial Orbit Guide Rings */}
              <div className="absolute w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] lg:w-[680px] lg:h-[680px] rounded-full border border-blue-500/15 pointer-events-none animate-pulse" />
              <div className="absolute w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-slate-700/40 pointer-events-none" />

              {/* 🌟 CENTRAL ROTATING TEAM VAJRA LOGO CORE 🌟 */}
              <div 
                className="relative z-30 flex flex-col items-center justify-center cursor-pointer my-8"
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
                onClick={triggerResplit}
                title="Click or Hover to Split Photos from Logo"
              >
                {/* Continuous Smooth 360 Rotation Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-blue-500/40 border-t-cyan-400 border-r-transparent border-b-blue-600 border-l-transparent shadow-lg shadow-blue-500/20"
                />

                {/* Pulsing Energy Glow Ring */}
                <div className={`absolute -inset-2 rounded-full bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-blue-600/30 blur-md transition duration-500 ${isLogoHovered ? "scale-125 opacity-100" : "scale-100 opacity-60"}`} />

                {/* Team Vajra Official Logo Centerpiece */}
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-blue-400/80 bg-black/90 p-1 shadow-2xl transition transform hover:scale-105">
                  <Image
                    src="/vajra-logo.jpg"
                    alt="Team Vajra Centerpiece Logo"
                    fill
                    className="object-contain p-1"
                    priority
                  />
                </div>

                {/* Center Core Badge */}
                <div className="mt-3 px-3 py-1 rounded-full bg-[#0D1220]/90 border border-blue-500/30 text-white text-[10px] font-bold tracking-wider uppercase shadow flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>VAJRA CORE</span>
                </div>
              </div>

              {/* 💥 PHOTO CARDS SPLITTING & RADIATING OUTWARD FROM THE LOGO 💥 */}
              <div key={splitBurstKey} className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-20 pt-4">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, idx) => {
                    
                    // Directional offset angles for burst split from center
                    const angles = [-35, 0, 35, -20, 20, -40];
                    const angle = angles[idx % angles.length];

                    return (
                      <motion.div
                        key={item.id}
                        initial={{
                          opacity: 0,
                          scale: 0.1,
                          y: 80,
                          rotate: angle * 0.5,
                        }}
                        animate={{
                          opacity: 1,
                          scale: isLogoHovered ? 1.03 : 1,
                          y: 0,
                          rotate: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.2,
                          transition: { duration: 0.2 }
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 14,
                          delay: idx * 0.08,
                        }}
                        onClick={() => setActiveLightboxIndex(idx)}
                        className="group rounded-2xl bg-[#0D1220] border border-slate-800 hover:border-blue-500/50 overflow-hidden cursor-pointer shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                      >
                        {/* Image Frame */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          
                          {/* Radial Split Indicator Badge */}
                          <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-md bg-black/80 text-white text-xs font-medium border border-white/10">
                            {item.tag}
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                              <Maximize2 className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 space-y-1.5 bg-[#0D1220]">
                          <span className="text-[11px] text-blue-400 font-semibold uppercase block">
                            {item.category}
                          </span>
                          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

            </div>
          ) : (
            
            /* ===================================================================
                VIEW 2: STRUCTURED MASONRY GRID VIEW
               =================================================================== */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <PopUpCard key={item.id} delay={0.08 * (idx + 1)}>
                  <div 
                    onClick={() => setActiveLightboxIndex(idx)}
                    className="group rounded-2xl bg-[#0D1220] border border-slate-800 hover:border-slate-700 overflow-hidden cursor-pointer transition duration-300"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-md bg-black/80 text-white text-xs font-medium">
                        {item.tag}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-1.5 bg-[#0D1220]">
                      <span className="text-[11px] text-blue-400 font-semibold uppercase block">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </PopUpCard>
              ))}
            </div>
          )}

          {/* CTA Banner */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#0D1220] border border-slate-800 text-center space-y-4 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white">
              Join Our Training Batches
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Morning and evening batches available for children, teens, and adults. Visit our academy or contact us directly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href="https://wa.me/918668102797?text=Hello%20Team%20Vajra,%20I%20would%20like%20to%20know%20more%20about%20your%20training%20batches."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Admission Desk</span>
              </a>

              <a
                href="tel:+918668102797"
                className="px-6 py-3 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call +91 86681 02797</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <button
            type="button"
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handlePrevPhoto}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNextPhoto}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl bg-[#0D1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <Image
                src={activePhoto.image}
                alt={activePhoto.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="p-6 bg-[#090C16] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-blue-400 font-semibold">{activePhoto.category}</span>
                <h3 className="text-xl font-bold text-white">{activePhoto.title}</h3>
                <p className="text-xs text-slate-300">{activePhoto.description}</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Photo {(activeLightboxIndex ?? 0) + 1} of {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}

