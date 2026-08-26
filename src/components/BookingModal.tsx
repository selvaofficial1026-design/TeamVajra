"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { VajraStudent, VajraStudentStore } from "@/lib/store";
import VajraAlertModal from "./VajraAlertModal";
import { 
  X, CheckCircle2, ArrowRight, MessageSquare, User, 
  KeyRound, Copy, Check, LogIn, AlertCircle, Clock, Shield, Search
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialArt?: string;
}

export default function BookingModal({ isOpen, onClose, initialArt }: BookingModalProps) {
  const router = useRouter();
  const [authTab, setAuthTab] = useState<"register" | "track" | "login">("register");

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCourse, setRegCourse] = useState(initialArt || "FITNESS");
  const [regAgeGroup, setRegAgeGroup] = useState("Adult (18–45 yrs)");
  const [regBatchTime, setRegBatchTime] = useState("Morning (05:30 AM – 07:30 AM)");

  // Generated Access / Tracking Code State
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  // Track Status State
  const [trackInput, setTrackInput] = useState("");
  const [trackedStudent, setTrackedStudent] = useState<VajraStudent | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Login Form State
  const [loginCode, setLoginCode] = useState("");

  // Success State
  const [isSuccess, setIsSuccess] = useState(false);
  const [successType, setSuccessType] = useState<"register" | "login">("register");
  
  // Custom System Notice Modal State
  const [systemAlert, setSystemAlert] = useState<{ title: string; message: string; type?: "error" | "warning" | "success" } | null>(null);

  // Duplicate Phone Error State
  const [phoneExistsError, setPhoneExistsError] = useState<{ name: string; code: string; course: string; phone: string } | null>(null);

  useEffect(() => {
    if (initialArt) {
      setRegCourse(initialArt.toUpperCase());
    }
  }, [initialArt]);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setSystemAlert({
        title: "Name Required",
        message: "Please enter your Full Name to complete registration.",
        type: "warning"
      });
      return;
    }
    if (!regPhone || regPhone.length < 10) {
      setSystemAlert({
        title: "Valid Number Required",
        message: "Please enter a valid 10-digit WhatsApp phone number.",
        type: "warning"
      });
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

    // Save pending student profile with Tracking Reference Code
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
        message: "Please enter or paste your Student Access Code or registered phone number.",
        type: "warning"
      });
      return;
    }
    const cleanUpper = loginCode.trim().toUpperCase();
    let registered = VajraStudentStore.getMemberFromRegistry(cleanUpper);
    if (!registered) {
      registered = VajraStudentStore.getStudentByPhone(loginCode.trim());
    }

    if (!registered) {
      setSystemAlert({
        title: "Access Denied: Invalid Credentials",
        message: `No student account found for "${loginCode}". Please verify your credentials or register as a new student.`,
        type: "error"
      });
      return;
    }

    if (registered.approvalStatus === "PENDING_APPROVAL") {
      setSystemAlert({
        title: "Waiting for Admin Approval",
        message: `Your admission request (${registered.requestCode || registered.accessCode}) is currently under review by Academy Admin. Please check back shortly once approved.`,
        type: "warning"
      });
      return;
    }

    if (registered.approvalStatus === "REJECTED") {
      setSystemAlert({
        title: "Admission Request Rejected",
        message: `The admission request for ${registered.name} was not approved. Please contact the academy office.`,
        type: "error"
      });
      return;
    }

    // Only APPROVED students are allowed to enter
    VajraStudentStore.setStudent(registered);
    handleEnterPortal();
  };

  const handleEnterPortal = () => {
    onClose();
    router.push("/portal");
  };

  const handleClose = () => {
    setIsSuccess(false);
    setTrackSearched(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      
      {/* Click Outside Backdrop Handler */}
      <div className="fixed inset-0 -z-10" onClick={handleClose} />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-[#0F1424] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden ring-1 ring-white/10 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Gold & Blue Brand Glow Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-95 transition"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            
            {/* Header with Team Vajra Logo */}
            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-white/20 bg-[#06080F]/90 shrink-0 p-1">
                <Image
                  src="/vajra-logo.jpg"
                  alt="Team Vajra Emblem"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase block">
                  TEAM VAJRA ADMISSIONS
                </span>
                <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-white tracking-tight truncate">
                  Academy Registration & Login
                </h3>
              </div>
            </div>

            {/* 3 Mode Switcher Tabs */}
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#13192B] border border-slate-700/60 mb-5 gap-1 text-[11px] sm:text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthTab("register");
                  setTrackSearched(false);
                }}
                className={`min-h-[42px] flex items-center justify-center py-2 px-1 font-bold uppercase rounded-xl transition-all ${
                  authTab === "register"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="truncate">Register</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthTab("track");
                  setTrackSearched(false);
                }}
                className={`min-h-[42px] flex items-center justify-center py-2 px-1 font-bold uppercase rounded-xl transition-all ${
                  authTab === "track"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="truncate">Track Status</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthTab("login");
                  setTrackSearched(false);
                }}
                className={`min-h-[42px] flex items-center justify-center py-2 px-1 font-bold uppercase rounded-xl transition-all ${
                  authTab === "login"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="truncate">Login</span>
              </button>
            </div>

            {/* =========================================================================
                TAB 1: ENROLLMENT & REGISTRATION
               ========================================================================= */}
            {authTab === "register" && (
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
                        className="min-h-[40px] flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Login with {phoneExistsError.code}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhoneExistsError(null)}
                        className="min-h-[40px] py-2 px-3.5 rounded-xl bg-[#13192B] border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white"
                      >
                        Change Number
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-blue-400 absolute left-3.5 top-3 shrink-0" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-xs focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      WhatsApp Phone Number *
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
                        className="w-full min-h-[44px] pl-12 pr-3.5 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-xs font-mono focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Course *
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
                        <option value="ALL-ACCESS TRACK">ALL-ACCESS (4 Arts)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Age Cohort *
                      </label>
                      <select
                        value={regAgeGroup}
                        onChange={(e) => setRegAgeGroup(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-xs font-semibold focus:border-blue-500 focus:outline-none transition"
                      >
                        <option value="Junior (5–12 yrs)">Junior (5–12 yrs)</option>
                        <option value="Teen (13–17 yrs)">Teen (13–17 yrs)</option>
                        <option value="Adult (18–45 yrs)">Adult (18–45 yrs)</option>
                        <option value="Master/Senior (45+ yrs)">Senior (45+ yrs)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Preferred Batch *
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
                    <Shield className="w-4 h-4" />
                    <span>Submit Admission Application</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    Upon submission, your Tracking Reference Code is generated for admin approval.
                  </p>

                </form>
              </div>
            )}

            {/* =========================================================================
                TAB 2: TRACK APPROVAL STATUS (UNIFIED TEAM VAJRA BLUE THEME)
               ========================================================================= */}
            {authTab === "track" && (
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
                      ADMISSION STATUS DESK
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Track your admission approval in real-time
                    </span>
                  </div>
                </div>

                <form onSubmit={handleTrackStatus} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Tracking Reference Code or Phone *
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5 shrink-0" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. REQ-4819 or 9876543210"
                        value={trackInput}
                        onChange={(e) => setTrackInput(e.target.value)}
                        className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl bg-[#13192B] border border-blue-500/30 text-white text-base sm:text-xs font-mono uppercase focus:border-blue-400 focus:outline-none transition placeholder:normal-case placeholder:text-slate-500 shadow-inner"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[44px] py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Search className="w-4 h-4" />
                    <span>Check Status</span>
                  </button>
                </form>

                {/* Tracking Result Card */}
                {trackSearched && (
                  <div className="pt-1">
                    {!trackedStudent ? (
                      <div className="p-4 rounded-2xl bg-[#0D1220] border border-blue-500/30 text-center space-y-1.5 text-xs shadow-xl">
                        <AlertCircle className="w-5 h-5 text-blue-400 mx-auto" />
                        <strong className="text-white block text-sm font-bold">No Record Found</strong>
                        <p className="text-slate-300 leading-relaxed">
                          No admission request found for <span className="font-mono text-blue-300">{trackInput}</span>.
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Please verify your 10-digit phone or exact Tracking Code (e.g. <span className="font-mono text-blue-400">REQ-XXXX</span>).
                        </p>
                      </div>
                    ) : trackedStudent.approvalStatus === "PENDING_APPROVAL" ? (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-blue-500/40 text-left space-y-3 shadow-2xl text-xs">
                        <div className="flex items-center justify-between pb-1.5 border-b border-blue-500/20">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 animate-spin text-blue-400" />
                            <span>WAITING FOR ADMIN APPROVAL</span>
                          </span>
                          <span className="font-mono text-xs text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                            {trackedStudent.requestCode || trackedStudent.accessCode}
                          </span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">
                          Hello <strong className="text-white">{trackedStudent.name}</strong>, your application for <strong className="text-blue-400">{trackedStudent.course}</strong> is currently under review by Academy Admin.
                        </p>
                        <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-[11px] text-blue-300 leading-relaxed flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>Once approved, your permanent Access Code will unlock here.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-blue-500/40 text-left space-y-3.5 shadow-2xl text-xs">
                        <div className="flex items-center justify-between pb-1.5 border-b border-blue-500/20">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>ADMISSION APPROVED!</span>
                          </span>
                          <span className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-wider">
                            ACTIVE PASS
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#070B16] border border-blue-500/40 text-center space-y-1 shadow-inner">
                          <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
                            Your Permanent Student Access Code
                          </span>
                          <div className="text-2xl font-black text-blue-400 font-mono tracking-widest">
                            {trackedStudent.accessCode}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            VajraStudentStore.setStudent(trackedStudent);
                            handleEnterPortal();
                          }}
                          className="w-full min-h-[44px] py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/40 flex items-center justify-center gap-2 active:scale-95"
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
                TAB 3: STUDENT LOGIN WITH ACCESS CODE
               ========================================================================= */}
            {authTab === "login" && (
              <form onSubmit={handleVerifyLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Student Access Code *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. VAJRA-1026"
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                      className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-xs font-mono font-bold tracking-wider focus:border-blue-500 focus:outline-none transition uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-500"
                    />
                  </div>
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
              SUCCESS STATE: WAITING FOR ADMIN APPROVAL + TRACKING CODE
             ========================================================================= */
          <div className="text-center py-2 space-y-4">
            
            {/* Top Badge */}
            <div className="relative w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block mb-1">
                ● WAITING FOR ADMIN APPROVAL
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                Admission Application Submitted!
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Your admission request has been sent for Academy Admin review. Please save your Tracking Code.
              </p>
            </div>

            {/* Tracking Reference Code with Copy Button */}
            <div className="p-3.5 rounded-2xl bg-[#13192B] border border-amber-500/40 space-y-2 shadow-md">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Your Tracking Reference Code
              </span>
              <div className="flex items-center justify-center gap-2.5">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-400 tracking-wider">
                  {generatedCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition flex items-center justify-center gap-1.5 text-xs font-semibold active:scale-95"
                >
                  {codeCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{codeCopied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Application Summary */}
            <div className="p-3.5 rounded-2xl bg-[#0C101F] border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Application Status</span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  UNDER REVIEW
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Applicant</span>
                  <strong className="text-white text-xs block truncate">{regName || "Applicant"}</strong>
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
                onClick={() => {
                  setIsSuccess(false);
                  setTrackInput(generatedCode);
                  setAuthTab("track");
                }}
                className="min-h-[44px] flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 text-center"
              >
                <Search className="w-4 h-4" />
                <span>Track Approval Status</span>
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

      {/* Brand Theme System Alert Modal */}
      {systemAlert && (
        <VajraAlertModal
          isOpen={true}
          title={systemAlert.title}
          message={systemAlert.message}
          type={systemAlert.type || "warning"}
          onClose={() => setSystemAlert(null)}
        />
      )}
    </div>
  );
}