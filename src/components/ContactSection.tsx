"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("FITNESS");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const formattedMsg = `*Team Vajra Website Inquiry*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Interested Course:* ${encodeURIComponent(course)}%0A*Message:* ${encodeURIComponent(message || "I would like to inquire about training batches and trial class.")}`;
    
    window.open(`https://wa.me/918668102797?text=${formattedMsg}`, "_blank");
  };

  return (
    <section id="contact" className="py-24 relative border-t border-white/[0.06] bg-[#070A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="eyebrow text-blue-400 block mb-3">
            Get In Touch
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Visit our dojo. <br />
            <span className="text-slate-400 font-normal">Connect with master instructors.</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Have questions about junior admissions, belt grading, trial sessions, or batch timings? Reach out directly via WhatsApp or submit your inquiry below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Details & Timings */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="rounded-2xl bg-[#0B0F1A] border border-white/[0.08] p-6 sm:p-8 space-y-6">
              <h3 className="font-display text-xl font-bold text-white">
                Dojo Headquarters
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-xs uppercase tracking-wider mb-0.5">Location</strong>
                    <p className="text-slate-400 text-xs sm:text-sm">Team Vajra Fitness Arts Academy, Main Ring Road, Tamil Nadu, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-white/[0.06]">
                  <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-xs uppercase tracking-wider mb-0.5">Phone / Admissions</strong>
                    <a href="tel:+918668102797" className="text-blue-400 hover:text-blue-300 transition text-xs sm:text-sm">+91 86681 02797</a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-white/[0.06]">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-xs uppercase tracking-wider mb-0.5">Email Desk</strong>
                    <a href="mailto:admissions@teamvajra.com" className="text-slate-400 hover:text-white transition text-xs sm:text-sm">admissions@teamvajra.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-white/[0.06]">
                  <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-xs uppercase tracking-wider mb-0.5">Operating Hours</strong>
                    <p className="text-slate-400 text-xs sm:text-sm">Monday – Saturday: 05:30 AM – 08:30 PM<br /><span className="text-slate-500">(Sunday Open for Special Weapon Workshops)</span></p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-2">
                <a
                  href="https://wa.me/918668102797?text=Hello%20Team%20Vajra!%20I%20would%20like%20to%20inquire%20about%20your%20training%20programs."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Directly on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#0B0F1A] border border-white/[0.08] p-6 sm:p-8 shadow-2xl">
              
              {!submitted ? (
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-1">
                    Send Direct Inquiry / Book Trial
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Fill in your details below and our chief instructor will respond directly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1424] border border-white/[0.08] text-white text-sm focus:border-blue-500 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 86681 02797"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1424] border border-white/[0.08] text-white text-sm focus:border-blue-500 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Course Course of Interest *
                      </label>
                      <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1424] border border-white/[0.08] text-white text-sm focus:border-blue-500 focus:outline-none transition"
                      >
                        <option value="FITNESS">FITNESS (Functional Strength & Conditioning)</option>
                        <option value="YOGA">YOGA (Classical Restorative & Pranayama)</option>
                        <option value="MARTIAL ARTS">MARTIAL ARTS (Combat Kickboxing & Self-Defense)</option>
                        <option value="SILAMBAM">SILAMBAM (Traditional Tamil Weapon & Staff)</option>
                        <option value="WARRIOR MULTI-ART">ALL 4 COURSES (Warrior Track)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Your Message / Questions
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Inquiring about junior weekend batch for age 8..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1424] border border-white/[0.08] text-white text-sm focus:border-blue-500 focus:outline-none transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry via WhatsApp</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Inquiry Submitted!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                    Thank you <strong className="text-white">{name}</strong>. Your inquiry for <strong className="text-blue-400">{course}</strong> has been transmitted. Our desk will connect with you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold transition"
                  >
                    Send Another Message
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
