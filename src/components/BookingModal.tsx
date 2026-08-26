"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { VajraStudentStore } from "@/lib/store";
import { 
  X, CheckCircle2, ArrowRight, MessageSquare, User, 
  KeyRound, Copy, Check, LogIn, AlertCircle
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialArt?: string;
}

export default function BookingModal({ isOpen, onClose, initialArt }: BookingModalProps) {
  const router = useRouter();
  const [authTab, setAuthTab] = useState<"register" | "login">("register");

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCourse, setRegCourse] = useState(initialArt || "FITNESS");
  const [regAgeGroup, setRegAgeGroup] = useState("Adult (18–45 yrs)");
  const [regBatchTime, setRegBatchTime] = useState("Morning (05:30 AM – 07:30 AM)");

  // Generated Access Code State
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  // Login Form State
  const [loginCode, setLoginCode] = useState("");

  // Success State
  const [isSuccess, setIsSuccess] = useState(false);
  const [successType, setSuccessType] = useState<"register" | "login">("register");
  
  // Duplicate Phone Error State
  const [phoneExistsError, setPhoneExistsError] = useState<{ name: string; code: string; course: string; phone: string } | null>(null);

  useEffect(() => {
    if (initialArt) {
      setRegCourse(initialArt.toUpperCase());
    }
  }, [initialArt]);

  if (!isOpen) return null;

  const generateRandomCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `VAJRA-${randomNum}`;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      alert("Please enter your Full Name.");
      return;
    }
    if (!regPhone || regPhone.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    // Check if Phone Number Already Exists
    const existingStudent = VajraStudentStore.getStudentByPhone(regPhone);
    if (existingStudent) {
      setPhoneExistsError({
        name: existingStudent.name,
        code: existingStudent.accessCode,
        course: existingStudent.course,
        phone: existingStudent.phone
      });
      return;
    }

    setPhoneExistsError(null);
    const accessCode = generateRandomCode();
    setGeneratedCode(accessCode);

    // Save actual student profile
    const student = VajraStudentStore.createStudentProfile(
      accessCode,
      regName.trim(),
      regPhone.trim(),
      regCourse,
      regAgeGroup,
      regBatchTime
    );
    VajraStudentStore.setStudent(student);

    const message = `*Team Vajra Student Registration & Enrollment*%0A%0A*Name:* ${encodeURIComponent(regName)}%0A*WhatsApp:* ${encodeURIComponent(regPhone)}%0A*Selected Course:* ${encodeURIComponent(regCourse)}%0A*Age Group:* ${encodeURIComponent(regAgeGroup)}%0A*Preferred Batch:* ${encodeURIComponent(regBatchTime)}%0A*Student Access Code:* ${encodeURIComponent(accessCode)}%0A%0APlease confirm my registration and batch slot.`;
    
    // Transmit to WhatsApp
    window.open(`https://wa.me/918668102797?text=${message}`, "_blank");
    
    setSuccessType("register");
    setIsSuccess(true);
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginCode || loginCode.trim().length === 0) {
      alert("Please enter or paste your Student Access Code.");
      return;
    }
    const code = loginCode.trim().toUpperCase();
    const registered = VajraStudentStore.getMemberFromRegistry(code);
    if (registered) {
      VajraStudentStore.setStudent(registered);
    } else {
      const newStudent = VajraStudentStore.createStudentProfile(
        code,
        regName || "Member",
        regPhone || "+91 86681 02797",
        regCourse || "MARTIAL ARTS",
        regAgeGroup,
        regBatchTime
      );
      VajraStudentStore.setStudent(newStudent);
    }

    onClose();
    router.push("/portal");
  };

  const handleEnterPortal = () => {
    onClose();
    router.push("/portal");
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#0F1424] border border-slate-700/80 shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden ring-1 ring-white/10 max-h-[92vh] overflow-y-auto">
        
        {/* Top Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
        
        {/* Close Button - 44px min touch target */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
          aria-label="Close Booking Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            
            {/* Header with Logo Emblem */}
            <div className="flex items-center gap-3 mb-5 pr-10">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-slate-700 bg-black/60 shrink-0 p-1">
                <Image
                  src="/vajra-logo.jpg"
                  alt="Team Vajra Official Emblem"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="min-w-0">
                <span className="eyebrow-label text-[10px] block text-blue-400 truncate">
                  Student Enrollment & Access
                </span>
                <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-white tracking-tight truncate">
                  Team Vajra Academy
                </h3>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#13192B] border border-slate-700/60 mb-5">
              <button
                type="button"
                onClick={() => setAuthTab("register")}
                className={`min-h-[44px] flex items-center justify-center py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  authTab === "register"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Register & Enroll
              </button>
              <button
                type="button"
                onClick={() => setAuthTab("login")}
                className={`min-h-[44px] flex items-center justify-center py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  authTab === "login"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Login With Code
              </button>
            </div>

            {/* =========================================================================
                TAB 1: ENROLLMENT & REGISTRATION
               ========================================================================= */}
            {authTab === "register" ? (
              <div className="space-y-3.5">
                {/* ALREADY EXISTS ERROR BANNER */}
                {phoneExistsError && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-left space-y-2.5 animate-fade-in shadow-xl text-xs">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Account Already Exists!</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      Already registered for <strong>{phoneExistsError.name}</strong> with Access Code: <strong className="text-blue-400 font-mono">{phoneExistsError.code}</strong>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginCode(phoneExistsError.code);
                          setAuthTab("login");
                          setPhoneExistsError(null);
                        }}
                        className="min-h-[44px] flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Login with {phoneExistsError.code}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhoneExistsError(null)}
                        className="min-h-[44px] py-2.5 px-3.5 rounded-xl bg-[#13192B] border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white"
                      >
                        Change Number
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Student Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-blue-400 absolute left-3 top-3.5 shrink-0" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full min-h-[44px] pl-9 pr-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-mono font-bold text-blue-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full min-h-[44px] pl-11 pr-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none font-mono transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Course Selection
                      </label>
                      <select
                        value={regCourse}
                        onChange={(e) => setRegCourse(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
                      >
                        <option value="FITNESS">FITNESS</option>
                        <option value="YOGA">YOGA</option>
                        <option value="MARTIAL ARTS">MARTIAL ARTS</option>
                        <option value="SILAMBAM">SILAMBAM (சிலம்பம்)</option>
                        <option value="ALL-ACCESS TRACK">ALL 4 COURSES</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Age Bracket
                      </label>
                      <select
                        value={regAgeGroup}
                        onChange={(e) => setRegAgeGroup(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
                      >
                        <option value="Junior (5–12 yrs)">Junior (5–12 yrs)</option>
                        <option value="Teen (13–17 yrs)">Teen (13–17 yrs)</option>
                        <option value="Adult (18–45 yrs)">Adult (18–45 yrs)</option>
                        <option value="Senior (45+ yrs)">Senior (45+ yrs)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Preferred Batch Time
                    </label>
                    <select
                      value={regBatchTime}
                      onChange={(e) => setRegBatchTime(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
                    >
                      <option value="Morning (05:30 AM – 07:30 AM)">Morning (05:30 AM – 07:30 AM)</option>
                      <option value="Evening (05:00 PM – 07:00 PM)">Evening (05:00 PM – 07:00 PM)</option>
                      <option value="Night (07:00 PM – 08:30 PM)">Night (07:00 PM – 08:30 PM)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[44px] mt-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Register & Enroll via WhatsApp</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    Upon registration, your Student Access Code is generated instantly.
                  </p>

                </form>
              </div>
            ) : (
                
                /* =========================================================================
                    TAB 2: STUDENT LOGIN WITH ACCESS CODE
                   ========================================================================= */
                <form onSubmit={handleVerifyLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Paste / Enter Student Access Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-blue-400 absolute left-3 top-3.5 shrink-0" />
                      <input
                        type="text"
                        required
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                        className="w-full min-h-[44px] pl-9 pr-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm font-mono font-bold tracking-wider focus:border-blue-500 focus:outline-none transition uppercase"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1.5 block">
                      Paste the Student Code from your registration (e.g. VAJRA-7842).
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[44px] py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login to Student Portal</span>
                  </button>
                </form>
              )}

          </div>
        ) : (
          
          /* =========================================================================
              SUCCESS STATE: GENERATED CODE + ENROLLMENT BADGE
             ========================================================================= */
          <div className="text-center py-2 space-y-4">
            
            {/* Top Success Badge */}
            <div className="relative w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-950/40">
              <CheckCircle2 className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 inline-block mb-1">
                ● ENROLLMENT CONFIRMED
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                {successType === "register" ? "Registration Submitted" : "Welcome Back"}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Your official access code has been generated. Use it anytime to enter your portal.
              </p>
            </div>

            {/* Generated Code with Copy Button */}
            {successType === "register" && (
              <div className="p-3.5 rounded-2xl bg-[#13192B] border border-blue-500/40 space-y-2 shadow-md">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Your Student Access Code
                </span>
                <div className="flex items-center justify-center gap-2.5">
                  <span className="font-mono text-xl sm:text-2xl font-black text-blue-400 tracking-wider">
                    {generatedCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 transition flex items-center justify-center gap-1.5 text-xs font-semibold active:scale-95"
                  >
                    {codeCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{codeCopied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Student ID Card Preview */}
            <div className="p-3.5 rounded-2xl bg-[#0C101F] border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Student Pass Summary</span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Member</span>
                  <strong className="text-white text-xs block truncate">{regName || "Member"}</strong>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Course</span>
                  <strong className="text-blue-400 text-xs block truncate">{regCourse}</strong>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Batch</span>
                  <strong className="text-slate-300 text-[11px] block truncate">{regBatchTime}</strong>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Cohort</span>
                  <strong className="text-slate-300 text-[11px] block truncate">{regAgeGroup}</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleEnterPortal}
                className="min-h-[44px] flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 text-center"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="min-h-[44px] py-3 px-5 rounded-xl bg-[#13192B] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition flex items-center justify-center"
              >
                Close
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}