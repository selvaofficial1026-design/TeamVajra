"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { SlideFromLeft, PopUpCard, FadeUp } from "@/components/ScrollAnimations";
import { 
  MapPin, Phone, MessageSquare, ArrowRight, ChevronRight, 
  CheckCircle2, Sparkles, Shield, Dumbbell, Flame, Copy, Check
} from "lucide-react";

export default function ContactPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("Combat Martial Arts");
  const [customNote, setCustomNote] = useState("");
  const [userName, setUserName] = useState("");
  const [copied, setCopied] = useState(false);

  const phoneNumber = "+918668102797";
  const displayPhone = "+91 86681 02797";

  const topics = [
    { id: "martial-arts", label: "Combat Martial Arts", icon: Shield, defaultMsg: "I want to inquire about Combat Martial Arts admissions and training batches." },
    { id: "silambam", label: "Silambam (சிலம்பம்)", icon: Flame, defaultMsg: "I want to know about traditional Tamil Silambam batches and weapon training." },
    { id: "fitness", label: "Functional Fitness", icon: Dumbbell, defaultMsg: "I want to inquire about Strength & Functional Fitness conditioning." },
    { id: "yoga", label: "Yoga & Breathwork", icon: Sparkles, defaultMsg: "I would like details on Yoga, flexibility, and Pranayama sessions." },
    { id: "kids", label: "Kids & Junior Batch Trial", icon: CheckCircle2, defaultMsg: "I want to book a free trial assessment for my child." },
    { id: "general", label: "Fee Structure & Timings", icon: MessageSquare, defaultMsg: "I want details regarding monthly fees, batch timings, and admissions." }
  ];

  const currentTopicObj = topics.find(t => t.label === selectedTopic) || topics[0];

  const generateWhatsAppUrl = () => {
    let text = `*Team Vajra Official Inquiry*\n\n`;
    if (userName.trim()) {
      text += `*Name:* ${userName.trim()}\n`;
    }
    text += `*Topic:* ${selectedTopic}\n`;
    text += `*Message:* ${customNote.trim() ? customNote.trim() : currentTopicObj.defaultMsg}\n\n`;
    text += `_Sent via Team Vajra Website_`;

    return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(displayPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090C15] text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col overflow-x-hidden">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-blue-400 font-semibold">Contact Desk</span>
          </div>

          {/* Page Header */}
          <div className="max-w-3xl mb-12">
            <SlideFromLeft delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>WhatsApp Admissions Desk Online</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
                Chat Directly on WhatsApp.
              </h1>
              <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
                Connect instantly with our certified coaches and admissions team. Select your course below to start a direct WhatsApp consultation or book your trial session.
              </p>
            </SlideFromLeft>
          </div>

          {/* Main Professional WhatsApp Card */}
          <PopUpCard delay={0.2}>
            <div className="rounded-3xl bg-gradient-to-b from-[#0F162A] to-[#0A0D18] border border-slate-700/60 p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-12">
              
              {/* Background Accent Glow */}
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Topic Selector */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      1. Choose Your Inquiry Topic:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {topics.map((t) => {
                        const Icon = t.icon;
                        const isSelected = selectedTopic === t.label;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTopic(t.label)}
                            className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                              isSelected
                                ? "bg-emerald-600/15 border-emerald-500 text-white shadow-md shadow-emerald-950/40"
                                : "bg-[#13192B] border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white"
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? "bg-emerald-500 text-black font-bold" : "bg-black/40 text-slate-400"}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Name & Custom Note */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      2. Additional Details (Optional):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Rahul)"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/60 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition"
                      />
                      <input
                        type="text"
                        placeholder="Custom note (optional)"
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/60 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* 3 Value Pillars */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Direct Coach Chat</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Instant Trial Slot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Free Assessment</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Professional WhatsApp Action Box */}
                <div className="lg:col-span-5 rounded-2xl bg-[#13192B] border border-slate-700/70 p-6 sm:p-7 flex flex-col justify-between space-y-6">
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-white text-sm">
                            Team Vajra Admissions
                          </h3>
                          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Active Now • Avg response &lt; 15 min
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message Preview */}
                    <div className="space-y-1.5 mb-5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                        WhatsApp Message Preview:
                      </span>
                      <div className="p-3.5 rounded-xl bg-[#090C15] border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
                        <p className="text-emerald-400 font-semibold mb-1">*Team Vajra Official Inquiry*</p>
                        {userName.trim() && <p className="text-slate-300">*Name:* {userName.trim()}</p>}
                        <p className="text-slate-300">*Topic:* {selectedTopic}</p>
                        <p className="text-slate-400 mt-1">
                          *Message:* {customNote.trim() ? customNote.trim() : currentTopicObj.defaultMsg}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Direct CTA */}
                  <div className="space-y-3">
                    <a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2.5 group"
                    >
                      <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Start Chat on WhatsApp</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* Copy Phone Number helper */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#090C15] border border-slate-800 text-xs text-slate-400">
                      <span className="font-mono">{displayPhone}</span>
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="text-slate-400 hover:text-white flex items-center gap-1 transition"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy Number</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </PopUpCard>

          {/* Information Cards Grid (Address & Phone Number) */}
          <FadeUp delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-2xl bg-[#0F1424] border border-slate-700/60 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Academy Address</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Team Vajra Fitness Arts Academy, Main Ring Road, Tamil Nadu, India.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1424] border border-slate-700/60 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">Phone Number</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-1.5">
                    Direct call and WhatsApp support
                  </p>
                  <a 
                    href={`tel:${phoneNumber}`} 
                    className="text-sm font-semibold text-blue-400 hover:text-blue-300 font-mono"
                  >
                    {displayPhone}
                  </a>
                </div>
              </div>

            </div>
          </FadeUp>

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
