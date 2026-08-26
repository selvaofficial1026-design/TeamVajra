"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VajraStudent, VajraStudentStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentVerificationSplash from "@/components/StudentVerificationSplash";
import VajraAlertModal from "@/components/VajraAlertModal";
import { useVajraTimezone } from "@/lib/timezone";
import TimezoneSelector from "@/components/TimezoneSelector";
import { 
  MessageSquare, User, Phone, CheckCircle2, Shield, ArrowRight, 
  KeyRound, Sparkles, Dumbbell, Flame, Copy, Check, LogIn, AlertCircle,
  Search, Clock, RefreshCw, ShieldAlert, ShieldCheck, Sparkle, ExternalLink, Globe
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { selectedTz, convertBatch, liveTime } = useVajraTimezone();
  const [authMode, setAuthMode] = useState<"register" | "login" | "track">("register");

  // Custom System Notice Modal State
  const [systemAlert, setSystemAlert] = useState<{ title: string; message: string; type?: "error" | "warning" | "success" | "info" } | null>(null);

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCourse, setRegCourse] = useState("FITNESS");
  const [regAgeGroup, setRegAgeGroup] = useState("Adult (18–45 yrs)");
  const [regBatchTime, setRegBatchTime] = useState("Morning (05:30 AM – 07:30 AM)");
  
  // Tracking Code & Access Code State
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  // Track Status State
  const [trackInput, setTrackInput] = useState("");
  const [trackedStudent, setTrackedStudent] = useState<VajraStudent | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

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
        message: "Please enter your Full Legal Name to proceed with student admission registration.",
        type: "warning"
      });
      return;
    }
    if (!regPhone || regPhone.length < 10) {
      setSystemAlert({
        title: "Valid WhatsApp Number Required",
        message: "Please enter a valid 10-digit mobile number for admissions contact and attendance alerts.",
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

    // Create Pending Student with Tracking Reference Code
    const { student, requestCode } = VajraStudentStore.createPendingAdmission(
      regName.trim(),
      regPhone.trim(),
      regCourse,
      regAgeGroup,
      regBatchTime
    );

    setGeneratedCode(requestCode);
    setSuccessType("register");
    setIsSuccess(true);
  };

  const handleTrackStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) {
      setSystemAlert({
        title: "Reference Code or Phone Required",
        message: "Please enter your Tracking Reference Code (e.g. REQ-1234) or your registered 10-digit WhatsApp number.",
        type: "warning"
      });
      return;
    }

    const clean = trackInput.trim();
    let found = VajraStudentStore.getMemberFromRegistry(clean);
    if (!found) {
      found = VajraStudentStore.getStudentByPhone(clean);
    }

    setTrackSearched(true);
    setTrackedStudent(found);
  };

  const handleCopyCode = (codeToCopy: string) => {
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginCode || loginCode.trim().length === 0) {
      setSystemAlert({
        title: "Student Access Code Required",
        message: "Please enter your official Student Access Code (e.g. VAJRA-1026) or registered phone number.",
        type: "warning"
      });
      return;
    }

    const rawCode = loginCode.trim();
    setIsAdminRedirect(false);
    const cleanUpper = rawCode.toUpperCase();

    // Search registry by Access Code, Tracking Code, or Phone
    let registered = VajraStudentStore.getMemberFromRegistry(cleanUpper);
    if (!registered) {
      registered = VajraStudentStore.getStudentByPhone(rawCode);
    }

    if (!registered) {
      setSystemAlert({
        title: "Invalid Credentials: No Student Found",
        message: `We could not locate an active account for "${rawCode}". If you submitted an application, switch to the "Track Approval" tab to verify your review status.`,
        type: "error"
      });
      return;
    }

    if (registered.approvalStatus === "PENDING_APPROVAL") {
      setSystemAlert({
        title: "Application Under Executive Review",
        message: `Your admission request (${registered.requestCode || registered.accessCode}) is currently under review by the Academy Headmaster. Portal workspace will unlock once approved.`,
        type: "warning"
      });
      return;
    }

    if (registered.approvalStatus === "REJECTED") {
      setSystemAlert({
        title: "Admission Application Declined",
        message: `The admission request for ${registered.name} was not approved. Please contact the Team Vajra Front Desk (+91 86681 02797) for assistance.`,
        type: "error"
      });
      return;
    }

    // Only APPROVED students are allowed to enter
    VajraStudentStore.setStudent(registered);
    triggerWelcomeTransition(registered.accessCode, registered.name, registered.course);
  };

  return (
    <div className="min-h-screen bg-[#090C15] text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      <Navbar onOpenBooking={() => {}} />

      <main className="flex-1 pt-28 sm:pt-36 pb-16 sm:pb-24 flex items-center justify-center px-3.5 sm:px-6 lg:px-8 relative overflow-hidden bg-radial-hero">
        
        {/* Background Ambient Aura */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-44 left-1/4 w-56 h-56 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="w-full max-w-lg relative">
          
          {/* Top Emblem & Header with Luxury Martial Arts Framing */}
          <div className="text-center mb-6 sm:mb-8 space-y-2">
            <Link 
              href="/" 
              className="inline-block relative w-28 sm:w-36 h-16 sm:h-20 rounded-2xl overflow-hidden border border-amber-400/30 bg-[#06080F]/90 shadow-2xl mb-1 p-2 backdrop-blur-xl group hover:border-amber-400/60 transition duration-300"
            >
              <Image
                src="/vajra-logo.jpg"
                alt="Team Vajra Official Logo"
                fill
                className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] text-amber-400 uppercase block">
                Official Student Portal Gateway
              </span>
              <h1 className="font-display text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                Team Vajra Student Access
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Admission Registration • Approval Tracking • Athlete Sign In
              </p>
            </div>
          </div>

          {/* Theme-Aligned Obsidian Card Container with Gold/Sky-Blue Foil Strip */}
          <div className="rounded-3xl bg-[#0F1424] border border-slate-700/80 shadow-2xl p-4 sm:p-8 relative overflow-hidden ring-1 ring-white/10">
            
            {/* Top Accent Gradient Foil Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-sky-400 to-blue-600" />

            {!isSuccess ? (
              <div className="space-y-5">
                
                {/* World Clock Country Selector for Login Page */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-medium">Academy World Clock / Country:</span>
                  <TimezoneSelector compact className="text-[11px] py-1 px-2" />
                </div>

                {/* 3 Mode Selector Tabs */}
                <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#13192B] border border-slate-700/70 gap-1 text-[11px] sm:text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setTrackSearched(false);
                    }}
                    className={`min-h-[42px] py-2 px-1 uppercase rounded-xl transition-all flex items-center justify-center text-center ${
                      authMode === "register"
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-900/40 ring-1 ring-blue-400/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="truncate">Register</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("track");
                      setTrackSearched(false);
                    }}
                    className={`min-h-[42px] py-2 px-1 uppercase rounded-xl transition-all flex items-center justify-center text-center ${
                      authMode === "track"
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-900/40 ring-1 ring-blue-400/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="truncate">Track Approval</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setTrackSearched(false);
                    }}
                    className={`min-h-[42px] py-2 px-1 uppercase rounded-xl transition-all flex items-center justify-center text-center ${
                      authMode === "login"
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-900/40 ring-1 ring-blue-400/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="truncate">Login</span>
                  </button>
                </div>

                {/* =========================================================================
                    TAB 1: ADMISSION REGISTRATION
                   ========================================================================= */}
                {authMode === "register" && (
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* ALREADY EXISTS EXECUTIVE WARNING CARD */}
                    {phoneExistsError && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/50 via-[#181510] to-[#120F0B] border border-amber-500/50 text-left space-y-3 animate-fade-in shadow-xl ring-1 ring-amber-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Registered Account Found</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                            EXISTING NUMBER
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-300 leading-relaxed break-words">
                          This mobile is enrolled for <strong className="text-white">{phoneExistsError.name}</strong> ({phoneExistsError.course}) with Access Code: <strong className="text-sky-400 font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">{phoneExistsError.code}</strong>.
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
                            className="min-h-[42px] flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/50 active:scale-95 transition"
                          >
                            <LogIn className="w-4 h-4 shrink-0" />
                            <span className="truncate">Login with Code ({phoneExistsError.code})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPhoneExistsError(null)}
                            className="min-h-[42px] py-2.5 px-4 rounded-xl bg-[#13192B] hover:bg-[#1C253D] border border-slate-700 text-slate-300 text-xs font-semibold active:scale-95 transition"
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
                            placeholder="e.g. Rahul Sharma"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-sm focus:border-blue-500 focus:outline-none transition shadow-inner placeholder:text-slate-500"
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
                            placeholder="98765 43210"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
                            className="w-full pl-12 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-sm focus:border-blue-500 focus:outline-none font-mono transition shadow-inner placeholder:text-slate-500"
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
                            className="w-full px-3 py-2.5 sm:py-3 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-xs sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
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
                            className="w-full px-3 py-2.5 sm:py-3 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-xs sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
                          >
                            <option value="Junior (5–12 yrs)">Junior (5–12 yrs)</option>
                            <option value="Teen (13–17 yrs)">Teen (13–17 yrs)</option>
                            <option value="Adult (18–45 yrs)">Adult (18–45 yrs)</option>
                            <option value="Master/Senior (45+ yrs)">Senior (45+ yrs)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Assigned Batch Schedule ({selectedTz.code})
                        </label>
                        <select
                          value={regBatchTime}
                          onChange={(e) => setRegBatchTime(e.target.value)}
                          className="w-full px-3 py-2.5 sm:py-3 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-xs sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
                        >
                          <option value="Morning (05:30 AM – 07:30 AM)">
                            {convertBatch("Morning (05:30 AM – 07:30 AM)").fullLabel}
                          </option>
                          <option value="Evening (05:00 PM – 07:00 PM)">
                            {convertBatch("Evening (05:00 PM – 07:00 PM)").fullLabel}
                          </option>
                          <option value="Night (07:00 PM – 08:30 PM)">
                            {convertBatch("Night (07:00 PM – 08:30 PM)").fullLabel}
                          </option>
                        </select>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-blue-400 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                        >
                          <Shield className="w-4 h-4 shrink-0" />
                          <span>Submit Admission Application</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* =========================================================================
                    TAB 2: TRACK APPROVAL STATUS (UNIFIED TEAM VAJRA BLUE THEME)
                   ========================================================================= */}
                {authMode === "track" && (
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* Brand Mini Header */}
                    <div className="p-3 rounded-xl bg-[#090C16] border border-blue-500/30 flex items-center gap-2.5">
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-blue-500/50 bg-black shrink-0 p-0.5 shadow-sm shadow-blue-500/10">
                        <Image
                          src="/vajra-logo.jpg"
                          alt="Team Vajra Emblem"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-blue-400 tracking-wider block">
                          ADMISSION TRACKING DESK
                        </span>
                        <span className="text-[11px] text-slate-300">
                          Check real-time application & approval status
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleTrackStatus} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Enter Tracking Reference Code or Phone
                        </label>
                        <div className="relative">
                          <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-3 sm:top-3.5" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. REQ-4819 or 9876543210"
                            value={trackInput}
                            onChange={(e) => setTrackInput(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-[#13192B] border border-blue-500/30 text-white text-sm focus:border-blue-400 focus:outline-none transition uppercase font-mono placeholder:normal-case placeholder:text-slate-500 shadow-inner"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Search className="w-4 h-4" />
                        <span>Check Status</span>
                      </button>
                    </form>

                    {/* Result Cards */}
                    {trackSearched && (
                      <div className="pt-2">
                        {!trackedStudent ? (
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-blue-500/30 text-center space-y-2 animate-fade-in shadow-xl">
                            <div className="w-10 h-10 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                              <ShieldAlert className="w-5 h-5" />
                            </div>
                            <strong className="text-sm font-bold text-white block">
                              No Application Record Found
                            </strong>
                            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                              No admission record found matching <strong className="text-blue-300 font-mono">{trackInput}</strong>.
                            </p>
                            <div className="pt-1 text-[11px] text-slate-400">
                              Please verify your 10-digit phone or exact Tracking Code (e.g. <span className="font-mono text-blue-400">REQ-XXXX</span>).
                            </div>
                          </div>
                        ) : trackedStudent.approvalStatus === "PENDING_APPROVAL" ? (
                          <div className="p-5 rounded-2xl bg-[#0D1220] border border-blue-500/40 text-left space-y-3.5 shadow-2xl animate-fade-in">
                            
                            <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
                              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 animate-spin text-blue-400" />
                                <span>WAITING FOR ADMIN APPROVAL</span>
                              </span>
                              <span className="font-mono text-xs text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                                {trackedStudent.requestCode || trackedStudent.accessCode}
                              </span>
                            </div>

                            <p className="text-xs text-slate-200 leading-relaxed">
                              Hello <strong className="text-white">{trackedStudent.name}</strong>, your admission application for <strong className="text-blue-400">{trackedStudent.course}</strong> is currently under review by the Academy Administrator.
                            </p>

                            <div className="p-3.5 rounded-xl bg-[#090C16] border border-blue-500/20 text-[11px] text-slate-300 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Selected Discipline:</span>
                                <strong className="text-blue-400">{trackedStudent.course}</strong>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Age Cohort:</span>
                                <strong className="text-slate-200">{trackedStudent.ageGroup}</strong>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Assigned Batch:</span>
                                <strong className="text-blue-300">{trackedStudent.batchTime}</strong>
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-[11px] text-blue-300 leading-relaxed flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                              <span>Once approved by admin, your official Access Code will unlock here.</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-5 rounded-2xl bg-[#0D1220] border border-blue-500/40 text-left space-y-3.5 shadow-2xl animate-fade-in">
                            
                            <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                                <span>ADMISSION APPROVED!</span>
                              </span>
                              <span className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-wider">
                                ACTIVE STUDENT PASS
                              </span>
                            </div>

                            <div className="p-4 rounded-xl bg-[#070B16] border border-blue-500/40 text-center space-y-1.5 shadow-inner">
                              <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
                                Your Official Student Access Code
                              </span>
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono tracking-widest">
                                  {trackedStudent.accessCode}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(trackedStudent.accessCode)}
                                  className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 transition active:scale-95"
                                  title="Copy Code"
                                >
                                  {codeCopied ? <Check className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                VajraStudentStore.setStudent(trackedStudent);
                                triggerWelcomeTransition(trackedStudent.accessCode, trackedStudent.name, trackedStudent.course);
                              }}
                              className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/40 flex items-center justify-center gap-2 active:scale-95"
                            >
                              <span>Enter Student Portal</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* =========================================================================
                    TAB 3: DIRECT PORTAL LOGIN
                   ========================================================================= */}
                {authMode === "login" && (
                  <form onSubmit={handleVerifyLogin} className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Student Access Code or Phone
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-blue-400 absolute left-3.5 top-3 sm:top-3.5" />
                        <input
                          type="text"
                          required
                          value={loginCode}
                          onChange={(e) => setLoginCode(e.target.value)}
                          placeholder="e.g. VAJRA-1026 or registered phone"
                          className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none transition uppercase font-mono placeholder:normal-case placeholder:text-slate-500 shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-blue-400 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-4 h-4 shrink-0" />
                        <span>Sign In to Student Portal</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>
            ) : (
              /* SUCCESS STATE SCREEN: WAITING FOR ADMIN APPROVAL */
              <div className="text-center space-y-4 sm:space-y-5 animate-fade-in py-2">
                
                {/* Martial Arts Icon Frame */}
                <div className="relative inline-block">
                  <div className="absolute -inset-1 rounded-full bg-amber-500/30 blur-sm animate-pulse" />
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#131A2D] border-2 border-amber-400/50 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                    <Clock className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                </div>

                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono uppercase tracking-wider font-bold mb-2">
                    ● APPLICATION DISPATCHED • AWAITING APPROVAL
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Application Submitted!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-sm mx-auto">
                    Your enrollment request has been registered in the Team Vajra registry. Please copy your Tracking Code to monitor approval.
                  </p>
                </div>

                {/* Tracking Reference Code Box with Luxury Gold Foil Trim */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#13192B] to-[#0A0D18] border border-amber-500/40 space-y-2 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-semibold">
                    Your Tracking Reference Code
                  </span>
                  <div className="flex items-center justify-center gap-2.5 flex-wrap">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-wider">
                      {generatedCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(generatedCode)}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition flex items-center gap-1.5 text-xs font-semibold active:scale-95 shrink-0"
                    >
                      {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                      <span>{codeCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Structured Student Summary Grid */}
                <div className="p-3.5 rounded-xl bg-[#0C101F] border border-slate-800 text-left text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Applicant:</span>
                    <strong className="text-white">{regName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Course Track:</span>
                    <strong className="text-blue-400">{regCourse}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Batch Schedule:</span>
                    <span className="text-slate-200 text-[11px]">{regBatchTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Registered Phone:</span>
                    <span className="text-slate-200 font-mono">{regPhone}</span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setTrackInput(generatedCode);
                      setAuthMode("track");
                    }}
                    className="min-h-[46px] flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95"
                  >
                    <Search className="w-4 h-4" />
                    <span>Track Approval Status</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setAuthMode("register");
                    }}
                    className="min-h-[46px] py-3 px-5 rounded-xl bg-[#13192B] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition active:scale-95"
                  >
                    New Admission
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      </main>

      {/* Verification Loading Splash */}
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

