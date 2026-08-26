"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PopUpCard, FadeUp } from "@/components/ScrollAnimations";
import { 
  Sparkles, Flame, Shield, Dumbbell, Award, Eye, 
  Maximize2, X, ChevronLeft, ChevronRight, Camera, CheckCircle2
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
    title: "18 Kaaladi Traditional Footwork & Form",
    category: "Ancient Lineage • சிலம்பம்",
    image: "/courses/silambam.jpg",
    description: "Students executing synchronized Nilai stance transitions and directional pivots under master instruction.",
    tag: "Traditional Forms"
  },
  {
    id: "gal-2",
    course: "MARTIAL ARTS",
    title: "Combat Striking & High Guard Sparring",
    category: "Striking Arts & Defense",
    image: "/courses/martial-arts.jpg",
    description: "Precision focus mitt drills emphasizing kinetic hip rotation, snap returns, and close-quarter defensive angles.",
    tag: "Striking Clinic"
  },
  {
    id: "gal-3",
    course: "FITNESS",
    title: "Compound Strength & Core Conditioning",
    category: "Functional Athleticism",
    image: "/courses/fitness.jpg",
    description: "Biomechanical barbell deadlifts and explosive kettlebell circuits building functional athletic power.",
    tag: "Strength Arena"
  },
  {
    id: "gal-4",
    course: "YOGA",
    title: "Classical Asana Alignment & Breath Synchronization",
    category: "Hatha & Vinyasa Flow",
    image: "/courses/yoga.jpg",
    description: "Deep spinal decompression, pelvic balance holds, and diaphragmatic pranayama for nervous system recovery.",
    tag: "Mind & Body"
  },
  {
    id: "gal-5",
    course: "SILAMBAM",
    title: "Nedunkambu Speed Rotation Masterclass",
    category: "Single Stick Velocity",
    image: "/courses/silambam.jpg",
    description: "360-degree continuous wrist rotation drills cultivating forearm tendon resilience and tournament blade speed.",
    tag: "Staff Mastery"
  },
  {
    id: "gal-6",
    course: "MARTIAL ARTS",
    title: "Tactical Self-Defense & Leverage Escapes",
    category: "Combat Practicality",
    image: "/courses/martial-arts.jpg",
    description: "Real-world joint lock reversals and situational perimeter awareness training for teens and adults.",
    tag: "Self-Defense"
  }
];

export default function GallerySection() {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

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

  return (
    <section id="gallery" className="py-24 bg-[#070913] relative overflow-hidden border-t border-slate-800/80">
      
      {/* Subtle Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[250px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/10 border border-blue-500/25 text-blue-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Camera className="w-3.5 h-3.5" />
              <span>DOJO LIFE & TRAINING GALLERY</span>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Academy Moments & Master Drills
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Explore authentic training snapshots from our dojo floor across Silambam, Combat Martial Arts, Functional Fitness, and Classical Yoga.
            </p>
          </FadeUp>
        </div>

        {/* Filter Pills */}
        <FadeUp delay={0.25}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { id: "ALL", label: "All Arts", icon: Sparkles },
              { id: "SILAMBAM", label: "Silambam (சிலம்பம்)", icon: Flame },
              { id: "MARTIAL ARTS", label: "Martial Arts", icon: Shield },
              { id: "FITNESS", label: "Fitness & Strength", icon: Dumbbell },
              { id: "YOGA", label: "Classical Yoga", icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.03]"
                      : "bg-[#0F1424] border border-slate-700/70 text-slate-300 hover:text-white hover:border-slate-500"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-blue-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </FadeUp>

        {/* Masonry / Bento Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <PopUpCard key={item.id} delay={0.08 * (idx + 1)}>
              <div 
                onClick={() => setActiveLightboxIndex(idx)}
                className="group relative rounded-3xl bg-[#0C101F] border border-slate-800 hover:border-blue-500/50 shadow-xl overflow-hidden cursor-pointer transition-all duration-500 transform hover:-translate-y-1.5"
              >
                
                {/* Image Container with Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Subtle Vignette & Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C101F] via-[#0C101F]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white text-[11px] font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>{item.tag}</span>
                  </div>

                  {/* Zoom Overlay Icon on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl shadow-blue-600/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="p-5 space-y-1.5 bg-[#0C101F]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                    {item.category}
                  </span>
                  <h3 className="font-display text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
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

      </div>

      {/* =========================================================================
          FULL-SCREEN LUXURY LIGHTBOX MODAL
         ========================================================================= */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          
          {/* Close Lightbox Button */}
          <button
            type="button"
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Photo Button */}
          <button
            type="button"
            onClick={handlePrevPhoto}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Photo Button */}
          <button
            type="button"
            onClick={handleNextPhoto}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Modal Card */}
          <div className="relative w-full max-w-4xl bg-[#0C101F] border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-0">
            
            {/* Modal Image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <Image
                src={activePhoto.image}
                alt={activePhoto.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Modal Details Footer */}
            <div className="p-6 sm:p-7 bg-[#090C16] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 font-mono text-[10px] font-bold uppercase">
                    {activePhoto.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {activePhoto.category}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white tracking-tight">
                  {activePhoto.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  {activePhoto.description}
                </p>
              </div>

              <div className="text-xs font-mono text-slate-500 shrink-0">
                Photo {(activeLightboxIndex ?? 0) + 1} of {filteredItems.length}
              </div>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}

