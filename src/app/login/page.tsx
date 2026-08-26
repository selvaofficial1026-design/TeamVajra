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
import { 
  MessageSquare, User, Phone, CheckCircle2, Shield, ArrowRight, 
  KeyRound, Sparkles, Dumbbell, Flame, Copy, Check, LogIn, AlertCircle,
  Search, Clock, RefreshCw
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"register" | "login" | "track">("register");

  // Custom System Notice Modal State
  const [systemAlert, setSystemAlert] = useState<{ title: string; message: string; type?: "error" | "warning" | "success" } | null>(null);

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
        title: "Code or Phone Required",
        message: "Please enter your Tracking Code (e.g. REQ-1234) or registered WhatsApp phone number.",
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
      setSystemAlert({
        title: "Access Code Required",
        message: "Please enter your valid Student Access Code or registered phone number.",
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
        title: "Access Denied: Invalid Credentials",
        message: `No student account found for "${rawCode}". Please check your code, or use the "Track Approval" tab to check admission status.`,
        type: "error"
      });
      return;
    }

    if (registered.approvalStatus === "PENDING_APPROVAL") {
      setSystemAlert({
        title: "Waiting for Admin Approval",
        message: `Your admission request (${registered.requestCode || registered.accessCode}) is currently under review by the Academy Admin. You cannot access the student portal until your application is approved.`,
        type: "warning"
      });
      return;
    }

    if (registered.approvalStatus === "REJECTED") {
      setSystemAlert({
        title: "Admission Request Rejected",
        message: `The admission request for ${registered.name} was not approved. Please contact the academy office for inquiries.`,
        type: "error"
      });
      return;
    }

    // Only APPROVED students are allowed to enter
    VajraStudentStore.setStudent(registered);
    triggerWelcomeTransition(registered.accessCode, registered.name, registered.course);
  };

  return (
    <div className="min-h-screen bg-[#090C15] text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col">
      <Navbar onOpenBooking={() => {}} />

      <main className="flex-1 pt-28 sm:pt-36 pb-16 sm:pb-24 flex items-center justify-center px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-radial-hero">
        
        {/* Background Ambient Glow */}
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
              Admission Registration, Status Tracking & Portal Login
            </p>
          </div>

          {/* Theme-Aligned Obsidian Card Container */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#0F1424] border border-slate-700/80 shadow-2xl p-4 sm:p-8 relative overflow-hidden ring-1 ring-white/10">
            
            {/* Top Accent Gradient Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500" />

            {!isSuccess ? (
              <div>
                
                {/* 3 Mode Selector Tabs */}
                <div className="grid grid-cols-3 p-1 rounded-xl sm:rounded-2xl bg-[#13192B] border border-slate-700/60 mb-5 sm:mb-6 gap-1 text-[11px] sm:text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setTrackSearched(false);
                    }}
                    className={`min-h-[40px] py-2 px-1 font-bold uppercase rounded-lg sm:rounded-xl transition-all flex items-center justify-center text-center ${
                      authMode === "register"
                        ? "bg-blue-600 text-white shadow-md"
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
                    className={`min-h-[40px] py-2 px-1 font-bold uppercase rounded-lg sm:rounded-xl transition-all flex items-center justify-center text-center ${
                      authMode === "track"
                        ? "bg-blue-600 text-white shadow-md"
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
                    className={`min-h-[40px] py-2 px-1 font-bold uppercase rounded-lg sm:rounded-xl transition-all flex items-center justify-center text-center ${
                      authMode === "login"
                        ? "bg-blue-600 text-white shadow-md"
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
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none transition"
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
                            className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none font-mono transition"
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
                            <option value="Master/Senior (45+ yrs)">Senior (45+ yrs)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Assigned Batch Schedule
                        </label>
                        <select
                          value={regBatchTime}
                          onChange={(e) => setRegBatchTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-xs sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
                        >
                          <option value="Morning (05:30 AM – 07:30 AM)">Morning (05:30 AM – 07:30 AM)</option>
                          <option value="Evening (05:00 PM – 06:30 PM)">Evening (05:00 PM – 06:30 PM)</option>
                          <option value="Night (07:00 PM – 08:30 PM)">Night (07:00 PM – 08:30 PM)</option>
                        </select>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                        >
                          <Shield className="w-4 h-4 shrink-0" />
                          <span>Submit Admission Application</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* =========================================================================
                    TAB 2: TRACK APPROVAL STATUS
                   ========================================================================= */}
                {authMode === "track" && (
                  <div className="space-y-4 animate-fade-in">
                    <form onSubmit={handleTrackStatus} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Enter Tracking Reference Code or Phone
                        </label>
                        <div className="relative">
                          <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. REQ-4819 or 9876543210"
                            value={trackInput}
                            onChange={(e) => setTrackInput(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#13192B] border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none transition uppercase font-mono placeholder:normal-case placeholder:text-slate-500"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        <span>Check Status</span>
                      </button>
                    </form>

                    {/* Result Card */}
                    {trackSearched && (
                      <div className="pt-2">
                        {!trackedStudent ? (
                          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-center space-y-1">
                            <AlertCircle className="w-6 h-6 text-red-400 mx-auto" />
                            <strong className="text-sm text-white block">No Request Found</strong>
                            <p className="text-xs text-slate-400">
                              Please verify your Tracking Reference Code or Phone number.
                            </p>
                          </div>
                        ) : trackedStudent.approvalStatus === "PENDING_APPROVAL" ? (
                          <div className="p-5 rounded-2xl bg-[#141A2E] border border-amber-500/40 text-left space-y-3 shadow-xl animate-fade-in">
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 animate-spin" />
                                <span>Waiting for Admin Approval</span>
                              </span>
                              <span className="font-mono text-xs text-slate-400 font-bold">
                                {trackedStudent.accessCode}
                              </span>
                            </div>

                            <p className="text-xs text-slate-200 leading-relaxed">
                              Hello <strong>{trackedStudent.name}</strong>, your application for <strong>{trackedStudent.course}</strong> is currently waiting for admin review.
                            </p>

                            <div className="p-3 rounded-xl bg-[#090C16] border border-slate-800 text-[11px] text-slate-400 space-y-1">
                              <div>Cohort: <strong className="text-slate-200">{trackedStudent.ageGroup}</strong></div>
                              <div>Batch: <strong className="text-slate-200">{trackedStudent.batchTime}</strong></div>
                            </div>

                            <p className="text-[11px] text-amber-300">
                              Once approved by the academy admin, your official Access Code will be active here!
                            </p>
                          </div>
                        ) : (
                          <div className="p-5 rounded-2xl bg-[#0F1D33] border border-emerald-500/50 text-left space-y-3.5 shadow-2xl animate-fade-in">
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>ADMISSION APPROVED!</span>
                              </span>
                              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                                Permanent ID Active
                              </span>
                            </div>

                            <div className="p-4 rounded-xl bg-[#070B16] border border-blue-500/40 text-center space-y-1.5">
                              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                                Your Official Student Access Code
                              </span>
                              <div className="text-2xl font-black text-blue-400 font-mono tracking-wider">
                                {trackedStudent.accessCode}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                VajraStudentStore.setStudent(trackedStudent);
                                triggerWelcomeTransition(trackedStudent.accessCode, trackedStudent.name, trackedStudent.course);
                              }}
                              className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
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
                  <form onSubmit={handleVerifyLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Student Access Code
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-blue-400 absolute left-3.5 top-3 sm:top-3.5" />
                        <input
                          type="text"
                          required
                          value={loginCode}
                          onChange={(e) => setLoginCode(e.target.value)}
                          placeholder="e.g. VAJRA-1026"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none transition uppercase font-mono placeholder:normal-case placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
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
                
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                  <Clock className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
                </div>

                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono uppercase tracking-wider font-bold mb-2">
                    ● WAITING FOR ADMIN APPROVAL
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Application Submitted!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-sm mx-auto">
                    Your application has been received. Please save your Tracking Code to check your admission approval status.
                  </p>
                </div>

                {/* Tracking Reference Code Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#13192B] to-[#0A0D18] border border-amber-500/40 space-y-2 shadow-xl">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                    Your Tracking Reference Code
                  </span>
                  <div className="flex items-center justify-center gap-2.5 flex-wrap">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-wider">
                      {generatedCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition flex items-center gap-1.5 text-xs font-semibold active:scale-95 shrink-0"
                    >
                      {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                      <span>{codeCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0C101F] border border-slate-800 text-left text-xs text-slate-300 space-y-1">
                  <div>Applicant: <strong className="text-white">{regName}</strong></div>
                  <div>Course: <strong className="text-blue-400">{regCourse}</strong></div>
                  <div>Phone: <strong className="text-slate-200">{regPhone}</strong></div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setTrackInput(generatedCode);
                      setAuthMode("track");
                    }}
                    className="min-h-[46px] flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
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
                    className="min-h-[46px] py-3 px-5 rounded-xl bg-[#13192B] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition"
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
