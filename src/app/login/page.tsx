"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VajraStudentStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentVerificationSplash from "@/components/StudentVerificationSplash";
import VajraAlertModal from "@/components/VajraAlertModal";
import { 
  MessageSquare, User, Phone, CheckCircle2, Shield, ArrowRight, 
  KeyRound, Sparkles, Dumbbell, Flame, Copy, Check, LogIn, AlertCircle
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"register" | "login">("register");

  // Custom System Notice Modal State
  const [systemAlert, setSystemAlert] = useState<{ title: string; message: string; type?: "error" | "warning" | "success" } | null>(null);

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCourse, setRegCourse] = useState("FITNESS");
  const [regAgeGroup, setRegAgeGroup] = useState("Adult (18–45 yrs)");
  const [regBatchTime, setRegBatchTime] = useState("Morning (05:30 AM – 07:30 AM)");
  
  // Generated Student Access Code
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  // Login Form State
  const [loginCode, setLoginCode] = useState("");
  const [loginName, setLoginName] = useState("");

  // 3-Second Welcome Animation Splash State
  const [isWelcomeLoading, setIsWelcomeLoading] = useState(false);
  const [welcomeStudentName, setWelcomeStudentName] = useState("");
  const [welcomeStudentCode, setWelcomeStudentCode] = useState("");
  const [welcomeCourse, setWelcomeCourse] = useState("");
  const [isAdminRedirect, setIsAdminRedirect] = useState(false);

  // Success State
  const [isSuccess, setIsSuccess] = useState(false);
  const [successType, setSuccessType] = useState<"register" | "login">("register");

  // Duplicate Phone Error State
  const [phoneExistsError, setPhoneExistsError] = useState<{ name: string; code: string; course: string; phone: string } | null>(null);

  const generateRandomCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `VAJRA-${randomNum}`;
  };

  const triggerWelcomeTransition = (code: string, name: string, course?: string) => {
    setWelcomeStudentCode(code);
    setWelcomeStudentName(name);
    setWelcomeCourse(course || "Martial Arts");
    setIsWelcomeLoading(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setSystemAlert({
        title: "Name Required",
        message: "Please enter your Full Name to proceed with registration.",
        type: "warning"
      });
      return;
    }
    if (!regPhone || regPhone.length < 10) {
      setSystemAlert({
        title: "Valid Phone Required",
        message: "Please enter a valid 10-digit WhatsApp number.",
        type: "warning"
      });
      return;
    }

    // Check if Phone Number Already Exists in Registry
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

    // Save actual student profile in local store & registry
    const student = VajraStudentStore.createStudentProfile(
      accessCode,
      regName.trim(),
      regPhone.trim(),
      regCourse,
      regAgeGroup,
      regBatchTime
    );
    VajraStudentStore.setStudent(student);

    const message = `*Team Vajra Student Registration*%0A%0A*Name:* ${encodeURIComponent(regName)}%0A*WhatsApp:* ${encodeURIComponent(regPhone)}%0A*Selected Course:* ${encodeURIComponent(regCourse)}%0A*Age Group:* ${encodeURIComponent(regAgeGroup)}%0A*Preferred Batch:* ${encodeURIComponent(regBatchTime)}%0A*Student Access Code:* ${encodeURIComponent(accessCode)}%0A%0APlease confirm my registration.`;
    
    // Open WhatsApp
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

  const handleSwitchToLoginWithCode = () => {
    setLoginCode(generatedCode);
    setLoginName(regName);
    setAuthMode("login");
    setIsSuccess(false);
  };

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginCode || loginCode.trim().length === 0) {
      setSystemAlert({
        title: "Access Code Required",
        message: "Please enter or paste your Student Access Code or Password.",
        type: "warning"
      });
      return;
    }

    const rawName = loginName.trim().toLowerCase();
    const rawCode = loginCode.trim();

    // Check if Admin Login (username: admin, password: 123 or admin)
    if (
      (rawName === "admin" && (rawCode === "123" || rawCode.toLowerCase() === "admin")) ||
      (rawCode === "123" && (rawName === "admin" || rawName === ""))
    ) {
      VajraStudentStore.setAdminAuthenticated(true);
      setIsAdminRedirect(true);
      triggerWelcomeTransition("MASTER-ADMIN", "Academy Administrator", "Admin Master Console");
      return;
    }

    setIsAdminRedirect(false);
    const code = rawCode.toUpperCase();

    // Check registry first
    const registered = VajraStudentStore.getMemberFromRegistry(code);
    if (registered) {
      VajraStudentStore.setStudent(registered);
      triggerWelcomeTransition(registered.accessCode, registered.name, registered.course);
      return;
    }

    // Check active session
    const existing = VajraStudentStore.getStudent();
    if (existing && existing.accessCode === code) {
      triggerWelcomeTransition(existing.accessCode, existing.name, existing.course);
      return;
    }

    // If new code login, use provided member name
    const finalName = loginName.trim() || regName.trim() || "Student Member";
    const newStudent = VajraStudentStore.createStudentProfile(
      code,
      finalName,
      regPhone || "+91 86681 02797",
      regCourse || "MARTIAL ARTS",
      regAgeGroup || "Adult (18–45 yrs)",
      regBatchTime || "Morning (05:30 AM – 07:30 AM)"
    );
    VajraStudentStore.setStudent(newStudent);
    triggerWelcomeTransition(code, newStudent.name, newStudent.course);
  };

  return (
    <div className="min-h-screen bg-[#090C15] text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col">
      <Navbar onOpenBooking={() => {}} />

      <main className="flex-1 pt-28 sm:pt-36 pb-16 sm:pb-24 flex items-center justify-center px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-radial-hero">
        
        {/* Background Ambient Glow matching Team Vajra Theme */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-44 left-1/4 w-56 h-56 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="w-full max-w-lg relative">
          
          {/* Top Emblem & Header */}
          <div className="text-center mb-6 sm:mb-8">
            <Link href="/" className="inline-block relative w-28 sm:w-36 h-16 sm:h-20 rounded-2xl overflow-hidden border border-white/20 bg-[#06080F]/90 shadow-2xl mb-3 sm:mb-4 p-2 backdrop-blur-xl group">
              <Image
                src="/vajra-logo.jpg"
                alt="Team Vajra Official Logo"
                fill
                className="object-contain p-1 group-hover:scale-105 transition-transform"
                priority
              />
            </Link>
            <h1 className="font-display text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Student Portal Access
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Official WhatsApp Registration & Instant Access Code Login
            </p>
          </div>

          {/* Theme-Aligned Obsidian Dojo Card Container */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#0F1424] border border-slate-700/80 shadow-2xl p-4 sm:p-8 relative overflow-hidden ring-1 ring-white/10">
            
            {/* Top Accent Gradient Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500" />

            {!isSuccess ? (
              <div>
                
                {/* Mode Selector Tabs (Optimized for 320px–390px screens) */}
                <div className="grid grid-cols-2 p-1 rounded-xl sm:rounded-2xl bg-[#13192B] border border-slate-700/60 mb-5 sm:mb-6 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                    }}
                    className={`min-h-[42px] py-2 px-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider rounded-lg sm:rounded-xl transition-all flex items-center justify-center text-center ${
                      authMode === "register"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Register Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className={`min-h-[42px] py-2 px-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider rounded-lg sm:rounded-xl transition-all flex items-center justify-center text-center ${
                      authMode === "login"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Login With Code</span>
                  </button>
                </div>

                {/* =========================================================================
                    TAB 1: WHATSAPP REGISTRATION (No Placeholders)
                   ========================================================================= */}
                {authMode === "register" ? (
                  <div className="space-y-4">
                    {/* ALREADY EXISTS ERROR BANNER */}
                    {phoneExistsError && (
                      <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-950/40 border border-amber-500/50 text-left space-y-2.5 animate-fade-in shadow-xl">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Account Already Exists for this Number!</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed break-words">
                          This phone number is already registered for <strong>{phoneExistsError.name}</strong> ({phoneExistsError.course}) with Access Code: <strong className="text-blue-400 font-mono">{phoneExistsError.code}</strong>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setLoginCode(phoneExistsError.code);
                              setLoginName(phoneExistsError.name);
                              setAuthMode("login");
                              setPhoneExistsError(null);
                            }}
                            className="min-h-[40px] flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                          >
                            <LogIn className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Login with Code ({phoneExistsError.code})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPhoneExistsError(null)}
                            className="min-h-[40px] py-2 px-3 rounded-xl bg-[#13192B] border border-slate-700 text-slate-300 text-xs font-semibold active:scale-95 transition"
                          >
                            Change Number
                          </button>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5 sm:space-y-4">
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Student Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-blue-400 absolute left-3.5 top-3 sm:top-3.5" />
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 sm:py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          WhatsApp Mobile Number
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-xs font-mono font-bold text-blue-400">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
                            className="w-full pl-12 pr-3.5 py-2.5 sm:py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none font-mono transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Selected Course
                          </label>
                          <select
                            value={regCourse}
                            onChange={(e) => setRegCourse(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-xs sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
                          >
                            <option value="FITNESS">FITNESS</option>
                            <option value="YOGA">YOGA</option>
                            <option value="MARTIAL ARTS">MARTIAL ARTS</option>
                            <option value="SILAMBAM">SILAMBAM (சிலம்பம்)</option>
                            <option value="ALL-ACCESS TRACK">ALL-ACCESS (4 Arts)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Age Cohort
                          </label>
                          <select
                            value={regAgeGroup}
                            onChange={(e) => setRegAgeGroup(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-xs sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
                          >
                            <option value="Junior (5–12 yrs)">Junior (5–12 yrs)</option>
                            <option value="Teen (13–17 yrs)">Teen (13–17 yrs)</option>
                            <option value="Adult (18–45 yrs)">Adult (18–45 yrs)</option>
                            <option value="Senior (45+ yrs)">Senior (45+ yrs)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Preferred Batch Window
                        </label>
                        <select
                          value={regBatchTime}
                          onChange={(e) => setRegBatchTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-xs sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
                        >
                          <option value="Morning (05:30 AM – 07:30 AM)">Morning (05:30 AM – 07:30 AM)</option>
                          <option value="Evening (05:00 PM – 07:00 PM)">Evening (05:00 PM – 07:00 PM)</option>
                          <option value="Night (07:00 PM – 08:30 PM)">Night (07:00 PM – 08:30 PM)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full min-h-[46px] mt-3 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 active:scale-[0.98] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 shrink-0" />
                        <span>Register via WhatsApp</span>
                      </button>

                      <p className="text-[11px] text-slate-400 text-center">
                        Upon submission, your Student Access Code is generated instantly.
                      </p>

                    </form>
                  </div>
                ) : (
                    
                    /* =========================================================================
                        TAB 2: LOGIN WITH ACCESS CODE (Direct Real Member Login)
                       ========================================================================= */
                    <form onSubmit={handleVerifyLogin} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Member Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            required
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Student Access Code *
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            required
                            value={loginCode}
                            onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base font-mono font-bold tracking-wider focus:border-blue-500 focus:outline-none transition uppercase"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full min-h-[46px] py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 active:scale-[0.98] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-4 h-4 shrink-0" />
                        <span>Login to Student Portal</span>
                      </button>

                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setAuthMode("register")}
                          className="text-xs text-blue-400 hover:text-blue-300 transition py-1"
                        >
                          Don&apos;t have a Student Code? Register here
                        </button>
                      </div>
                    </form>
                  )}

              </div>
            ) : (
                
                /* =========================================================================
                    SUCCESS STATE: ULTRA-PROFESSIONAL REGISTRATION COMPLETED BOX
                   ========================================================================= */
                <div className="text-center py-2 space-y-4 sm:space-y-5 animate-fade-in">
                  
                  {/* Glowing Success Badge */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block mb-1.5">
                      ● ENROLLMENT CONFIRMED
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {successType === "register" ? "Registration Completed" : "Welcome Back"}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Your official student workspace is ready. Use your Access Code to log in anytime.
                    </p>
                  </div>

                  {/* Primary Student Access Code Display */}
                  <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#13192B] to-[#0A0D18] border border-blue-500/40 space-y-2.5 shadow-xl">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                      Your Official Student Access Code
                    </span>
                    <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
                      <span className="font-mono text-xl sm:text-3xl font-black text-blue-400 tracking-wider break-all sm:break-normal">
                        {generatedCode || loginCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 transition flex items-center gap-1.5 text-xs font-semibold active:scale-95 shrink-0"
                      >
                        {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                        <span>{codeCopied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Verified Student Pass Details */}
                  <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#0C101F] border border-slate-800 text-left space-y-2.5 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Student Pass Summary</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ACTIVE
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Member Name</span>
                        <strong className="text-white text-xs block truncate">{regName || loginName || "Member"}</strong>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Program</span>
                        <strong className="text-blue-400 text-xs block truncate">{regCourse}</strong>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Batch Slot</span>
                        <strong className="text-slate-300 text-[11px] block truncate">{regBatchTime}</strong>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Cohort</span>
                        <strong className="text-slate-300 text-[11px] block truncate">{regAgeGroup}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => triggerWelcomeTransition(generatedCode || loginCode, regName || loginName, regCourse)}
                      className="min-h-[46px] flex-1 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 text-center"
                    >
                      <span>Enter Student Portal</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSuccess(false);
                        setAuthMode("register");
                      }}
                      className="min-h-[46px] py-3.5 px-5 rounded-xl sm:rounded-2xl bg-[#13192B] hover:bg-[#1C253D] active:scale-[0.98] text-slate-300 border border-slate-700 font-semibold text-xs transition flex items-center justify-center"
                    >
                      New Session
                    </button>
                  </div>

                </div>
              )}

          </div>

        </div>
      </main>

      {/* =========================================================================
          UNIQUE & FORMAL VERIFICATION LOADING SPLASH (STUDENT & ADMIN)
         ========================================================================= */}
      {isWelcomeLoading && (
        <StudentVerificationSplash
          studentName={welcomeStudentName}
          studentCode={welcomeStudentCode}
          course={welcomeCourse}
          onComplete={() => {
            setIsWelcomeLoading(false);
            if (isAdminRedirect) {
              router.push("/admin");
            } else {
              router.push("/portal");
            }
          }}
        />
      )}

      {/* Custom Vajra System Alert Modal */}
      {systemAlert && (
        <VajraAlertModal
          isOpen={true}
          title={systemAlert.title}
          message={systemAlert.message}
          type={systemAlert.type || "warning"}
          onClose={() => setSystemAlert(null)}
        />
      )}

      <Footer />
    </div>
  );
}
