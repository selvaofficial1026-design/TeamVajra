"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VajraStudent, VajraStudentStore, TrainingVideo, VajraMessage } from "@/lib/store";
import { listenToMeetLinksCloud, listenToVideosCloud, listenToMessagesCloud } from "@/lib/firebase";
import VajraAlertModal from "@/components/VajraAlertModal";
import { 
  User, Shield, Flame, Dumbbell, Sparkles, CheckCircle2, 
  Copy, Check, LogOut, MessageSquare, Phone, ChevronRight, 
  ChevronLeft, Video, Play, ExternalLink, Radio, Pause, 
  Calendar, Clock, Award, Send, X, ShieldAlert, ShieldCheck,
  HelpCircle, Eye, Info, Sparkle, Lock, Zap
} from "lucide-react";

export default function StudentPortalPage() {
  const router = useRouter();
  const [student, setStudent] = useState<VajraStudent | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "videos" | "meet" | "doubt">("profile");
  
  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Dialog & Modal States
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedVideoModal, setSelectedVideoModal] = useState<TrainingVideo | null>(null);
  const [showMeetBriefingModal, setShowMeetBriefingModal] = useState(false);
  const [portalAlert, setPortalAlert] = useState<{ title: string; message: string; type?: "error" | "warning" | "success" | "info" } | null>(null);

  // In-App Chat / Messages State
  const [myMessages, setMyMessages] = useState<VajraMessage[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Real-time Meet Link & Live Timestamp Notification
  const [meetInfo, setMeetInfo] = useState<{ url: string; updatedAt: number | null; timeAgoText: string; isRecent: boolean }>({
    url: "https://meet.google.com/new",
    updatedAt: null,
    timeAgoText: "Active Session Link",
    isRecent: false
  });

  useEffect(() => {
    const existing = VajraStudentStore.getStudent();
    if (!existing || existing.approvalStatus !== "APPROVED") {
      VajraStudentStore.setStudent(null);
      router.push("/login");
    } else {
      setStudent(existing);
      const vids = VajraStudentStore.getCourseVideos(existing.course);
      setVideos(vids);
      setMeetInfo(VajraStudentStore.getMeetLinkInfo(existing.course));
      setMyMessages(VajraStudentStore.getStudentMessages(existing.accessCode));
    }
  }, [router]);

  useEffect(() => {
    if (!student) return;

    const updateMeet = () => {
      const info = VajraStudentStore.getMeetLinkInfo(student.course);
      setMeetInfo(info);
    };

    const updateMsgs = () => {
      setMyMessages(VajraStudentStore.getStudentMessages(student.accessCode));
    };

    updateMeet();
    updateMsgs();

    window.addEventListener("vajra_meet_link_updated", updateMeet);
    window.addEventListener("vajra_videos_updated", () => {
      setVideos(VajraStudentStore.getCourseVideos(student.course));
    });
    window.addEventListener("vajra_messages_updated", updateMsgs);

    const unsubMeet = listenToMeetLinksCloud((cloudLinks) => {
      if (cloudLinks && Object.keys(cloudLinks).length > 0) {
        VajraStudentStore.syncMeetLinksFromCloud(cloudLinks);
        updateMeet();
      }
    });

    const unsubVideos = listenToVideosCloud((cloudVideos) => {
      if (cloudVideos && cloudVideos.length > 0) {
        VajraStudentStore.syncVideosFromCloud(cloudVideos);
        setVideos(VajraStudentStore.getCourseVideos(student.course));
      }
    });

    const unsubMsgs = listenToMessagesCloud((cloudMsgs) => {
      if (cloudMsgs && cloudMsgs.length > 0) {
        VajraStudentStore.syncMessagesFromCloud(cloudMsgs);
        setMyMessages(VajraStudentStore.getStudentMessages(student.accessCode));
      }
    });

    const interval = setInterval(updateMeet, 10000);

    return () => {
      window.removeEventListener("vajra_meet_link_updated", updateMeet);
      window.removeEventListener("vajra_messages_updated", updateMsgs);
      unsubMeet();
      unsubVideos();
      unsubMsgs();
      clearInterval(interval);
    };
  }, [student]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !inputMsg.trim()) return;

    setIsSending(true);
    VajraStudentStore.sendStudentMessage(student, inputMsg.trim());
    setInputMsg("");
    setMyMessages(VajraStudentStore.getStudentMessages(student.accessCode));
    setIsSending(false);
    showNotification("Message sent to master coach!");
  };

  const handleCopyCode = () => {
    if (student?.accessCode) {
      navigator.clipboard.writeText(student.accessCode);
      setCopied(true);
      showNotification("Student access code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConfirmLogout = () => {
    VajraStudentStore.setStudent(null);
    router.push("/login");
  };

  // Carousel timer
  useEffect(() => {
    if (activeTab !== "videos" || isCarouselPaused || videos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentVideoIdx((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab, isCarouselPaused, videos.length]);

  const handleNextVideo = () => {
    if (videos.length === 0) return;
    setCurrentVideoIdx((prev) => (prev + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    if (videos.length === 0) return;
    setCurrentVideoIdx((prev) => (prev - 1 + videos.length) % videos.length);
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-[#070913] flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-300">Loading student details...</span>
        </div>
      </div>
    );
  }

  const getCourseIcon = (courseName: string) => {
    switch (courseName) {
      case "SILAMBAM": return Flame;
      case "MARTIAL ARTS": return Shield;
      case "FITNESS": return Dumbbell;
      case "YOGA": return Sparkles;
      default: return Shield;
    }
  };

  const CourseIcon = getCourseIcon(student.course);
  const activeVideo = videos[currentVideoIdx] || videos[0] || {
    id: "default",
    title: `${student.course} Practice Drills`,
    duration: "15:00",
    level: "Lesson 01",
    desc: `Core technique demonstrations and foundation exercises for ${student.course}.`,
    youtubeUrl: `https://www.youtube.com/results?search_query=Team+Vajra+${encodeURIComponent(student.course)}`,
    focusPoints: ["Basic form and posture", "Balance and coordination", "Daily practice routine"]
  };

  const navTabs = [
    { id: "profile", label: "Athlete Profile", shortLabel: "Profile", icon: User },
    { id: "videos", label: "Training Lessons", shortLabel: "Videos", icon: Video },
    { id: "meet", label: "Live Google Meet", shortLabel: "Live Meet", icon: Radio },
    { id: "doubt", label: "Instructor Desk", shortLabel: "Doubt Desk", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-200 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Toast Notification Container */}
      {notification && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0F1626] to-[#0A0D18] border border-blue-500/40 text-slate-100 text-xs font-semibold shadow-2xl shadow-blue-950/80 flex items-center gap-2.5 animate-fade-in max-w-[calc(100vw-32px)] ring-1 ring-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{notification}</span>
        </div>
      )}

      {/* =========================================================================
          1. HEADER NAVBAR (Ergonomic for 320px - 768px mobile)
         ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0E1A]/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            
            {/* Academy Brand */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-amber-400/40 bg-black/80 p-0.5 shrink-0">
                <Image
                  src="/vajra-logo.jpg"
                  alt="Team Vajra Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-display font-bold text-xs sm:text-base text-white tracking-tight truncate">
                    TEAM VAJRA
                  </span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/20 shrink-0">
                    Portal
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 block truncate">
                  {student.course}
                </span>
              </div>
            </div>

            {/* Navigation Tabs (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 bg-[#0F1424] border border-slate-800 rounded-xl p-1">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm font-bold ring-1 ring-blue-400/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Student Code & Themed Logout Trigger */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1424] border border-blue-500/20 text-xs shadow-inner">
                <span className="text-slate-400">Student ID:</span>
                <span className="font-mono font-bold text-sky-400">{student.accessCode}</span>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#141A2E] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 text-xs font-semibold transition flex items-center gap-1.5 min-h-[38px] active:scale-95"
                title="Sign out of student portal"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden border-t border-slate-800 bg-[#0A0E1A] px-2 py-1.5">
          <div className="grid grid-cols-4 gap-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`min-h-[44px] py-1.5 px-1 rounded-xl text-xs font-medium flex flex-col items-center justify-center gap-1 transition active:scale-95 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-sm ring-1 ring-blue-400/30"
                      : "text-slate-400 hover:text-slate-200 active:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate max-w-full text-[10px] sm:text-[11px] leading-tight">
                    {tab.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN WORKSPACE CONTENT
         ========================================================================= */}
      <main className="flex-1 py-4 sm:py-8">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
          
          {/* =========================================================================
              REAL-TIME LIVE GOOGLE MEET CLASS ANNOUNCEMENT BANNER
             ========================================================================= */}
          {meetInfo.isRecent && (
            <div className="p-3.5 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-950/90 via-[#0D152A] to-emerald-950/90 border-2 border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 animate-fade-in ring-1 ring-emerald-500/30 relative overflow-hidden">
              
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0">
                <div className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 items-center justify-center mt-1 sm:mt-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider border border-emerald-500/30 shrink-0">
                      ● LIVE INSTRUCTION SESSION
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                      {meetInfo.timeAgoText}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-base font-bold text-white leading-snug break-words">
                    Master Coach opened Google Meet for <span className="text-blue-400">{student.course}</span>!
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                <button
                  type="button"
                  onClick={() => setShowMeetBriefingModal(true)}
                  className="w-full sm:w-auto min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                >
                  <Radio className="w-4 h-4 animate-pulse shrink-0" />
                  <span className="truncate">Join Live Class Now</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>

            </div>
          )}
          
          {/* =====================================================================
              SECTION 1: PROFILE TAB
             ===================================================================== */}
          <div className={activeTab === "profile" ? "block space-y-4 sm:space-y-6 animate-fade-in" : "hidden"}>
            
            {/* Student Welcome Header */}
            <div className="p-4 sm:p-8 rounded-3xl bg-[#0D1220] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-1 min-w-0">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block font-mono">
                  ● TEAM VAJRA ATHLETE PORTAL
                </span>
                <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight break-words">
                  Welcome, {student.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 break-words">
                  Enrolled in <strong className="text-blue-400">{student.course}</strong> • {student.ageGroup}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("videos")}
                  className="min-h-[42px] px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-blue-950/50"
                >
                  <Video className="w-4 h-4 shrink-0" />
                  <span className="truncate">Watch Videos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("meet")}
                  className="min-h-[42px] px-3 sm:px-4 py-2.5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] active:scale-[0.98] text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Live Meet</span>
                </button>
              </div>
            </div>

            {/* Profile Grid: Left (VIP Athlete Pass) / Right (Curriculum & Guidance) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
              
              {/* Left: Elite VIP Athlete Membership Card (6 Cols) */}
              <div className="lg:col-span-6">
                <div className="relative rounded-3xl bg-gradient-to-br from-[#111827] via-[#0B0F19] to-[#04060C] border border-blue-500/30 p-5 sm:p-7 space-y-5 shadow-2xl shadow-blue-950/40 overflow-hidden ring-1 ring-white/10 group">
                  
                  {/* Subtle Holographic Grid Pattern & Glow Watermark */}
                  <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.07] pointer-events-none" />
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top VIP Accent Foil Strip */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-sky-400 to-blue-600" />

                  {/* Card Header with Smart Chip & Academy Emblem */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 gap-3 relative">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-black/80 p-1 shadow-lg shrink-0">
                        <Image src="/vajra-logo.jpg" alt="Team Vajra Emblem" fill className="object-contain p-0.5" priority />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase block font-mono">
                          OFFICIAL ATHLETE PASS
                        </span>
                        <strong className="text-white font-extrabold text-sm sm:text-base block truncate tracking-tight">
                          TEAM VAJRA ACADEMY
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Micro NFC / Smart Chip Aesthetic */}
                      <div className="hidden sm:flex w-9 h-7 rounded-md bg-gradient-to-tr from-amber-500/30 to-amber-300/60 border border-amber-400/50 items-center justify-center shadow-inner">
                        <div className="w-5 h-3.5 border border-amber-300/40 rounded-sm flex items-center justify-center">
                          <Zap className="w-2.5 h-2.5 text-amber-300" />
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active Pass</span>
                      </span>
                    </div>
                  </div>

                  {/* Student Details Grid (VIP Badge Layout) */}
                  <div className="space-y-3 text-xs relative">
                    
                    {/* Student Name */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 gap-3">
                      <span className="text-slate-400 font-medium shrink-0">Student Name</span>
                      <strong className="text-white font-bold text-sm sm:text-base text-right break-words tracking-tight">
                        {student.name}
                      </strong>
                    </div>

                    {/* Access Code Highlight Box */}
                    <div className="flex items-center justify-between py-2.5 px-3.5 rounded-2xl bg-[#070B14]/90 border border-blue-500/25 gap-2 shadow-inner">
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Student Access Code</span>
                        <strong className="font-mono text-sm sm:text-base text-sky-400 font-extrabold tracking-wider block">
                          {student.accessCode}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="min-w-[36px] min-h-[36px] px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 hover:text-white flex items-center justify-center gap-1.5 transition active:scale-95 text-xs font-semibold shrink-0"
                        title="Copy Code"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Course */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 gap-3">
                      <span className="text-slate-400 font-medium shrink-0">Course Track</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 font-semibold text-right break-words text-xs">
                        {student.course}
                      </span>
                    </div>

                    {/* Batch Timing */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 gap-3">
                      <span className="text-slate-400 font-medium shrink-0">Batch Schedule</span>
                      <span className="text-slate-200 text-right text-[11px] sm:text-xs font-medium break-words">
                        {student.batchTime}
                      </span>
                    </div>

                    {/* Registered Phone */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 gap-3">
                      <span className="text-slate-400 font-medium shrink-0">Registered Mobile</span>
                      <span className="text-slate-300 font-mono font-medium text-right">{student.phone}</span>
                    </div>

                    {/* Admission Date */}
                    <div className="flex items-center justify-between pt-1 gap-3 text-slate-400">
                      <span className="font-medium shrink-0">Enrolled Since</span>
                      <span className="text-slate-300 text-right font-medium">{student.joinedDate}</span>
                    </div>

                  </div>

                  {/* Card Bottom Security Strip & Microprint */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 tracking-wider uppercase font-mono">
                    <span>AUTHENTICATED PASS</span>
                    <span className="text-amber-400 font-semibold">VAJRA DIGITAL ID</span>
                  </div>

                </div>
              </div>

              {/* Right: Academic Overview & Quick Actions (6 Cols) */}
              <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
                
                {/* Course Track Card */}
                <div className="p-4 sm:p-6 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Curriculum Track</span>
                    <CourseIcon className="w-4 h-4 text-blue-400 shrink-0" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {student.course} Program
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Formal syllabus, practical forms, and master instructor assessments for {student.course}.
                  </p>
                </div>

                {/* Quick Help & Instructor Support */}
                <div className="p-4 sm:p-6 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Direct Support</span>
                    <h5 className="text-sm font-bold text-white">Master Instructor Communication</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Need clarification on your {student.course} forms, batch timings, or practice drills?
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("doubt")}
                      className="flex-1 min-h-[42px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/50"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask Doubt Directly</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("videos")}
                      className="flex-1 min-h-[42px] py-2.5 px-4 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-200 border border-slate-700 font-semibold text-xs transition text-center"
                    >
                      Watch Practice Videos
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* =====================================================================
              SECTION 2: TRAINING VIDEOS
             ===================================================================== */}
          <div className={activeTab === "videos" ? "block space-y-4 sm:space-y-6 animate-fade-in" : "hidden"}>
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 sm:pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-white">
                  {student.course} Practice Lessons
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Training lessons and form demonstrations recorded by academy masters.
                </p>
              </div>

              {videos.length > 0 && (
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                  <button
                    type="button"
                    onClick={handlePrevVideo}
                    className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-[#0D1220] border border-slate-700 text-slate-300 hover:text-white active:scale-95 transition flex items-center justify-center"
                    title="Previous lesson"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCarouselPaused(!isCarouselPaused)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#0D1220] border border-slate-700 text-xs text-slate-300 hover:text-white active:scale-95 transition flex items-center gap-1.5"
                  >
                    {isCarouselPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Pause className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    <span>{isCarouselPaused ? "Resume Auto" : "Pause Auto"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextVideo}
                    className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-[#0D1220] border border-slate-700 text-slate-300 hover:text-white active:scale-95 transition flex items-center justify-center"
                    title="Next lesson"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* If no videos uploaded yet */}
            {videos.length === 0 ? (
              <div className="p-8 sm:p-12 text-center text-slate-400 space-y-3 rounded-3xl bg-[#0D1220] border border-slate-800">
                <Video className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">No training videos uploaded yet for {student.course}.</p>
                <p className="text-xs text-slate-400">
                  New video lessons uploaded by your master coach will appear here.
                </p>
              </div>
            ) : (
              <div 
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
                className="rounded-3xl bg-[#0D1220] border border-slate-800 overflow-hidden shadow-2xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  
                  {/* Left: Video Banner & Thumbnail */}
                  <div className="lg:col-span-7 relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
                    <Image
                      src={
                        activeVideo.thumbnail ||
                        (student.course === "SILAMBAM"
                          ? "/courses/silambam.jpg"
                          : student.course === "MARTIAL ARTS"
                          ? "/courses/martial-arts.jpg"
                          : student.course === "FITNESS"
                          ? "/courses/fitness.jpg"
                          : "/courses/yoga.jpg")
                      }
                      alt={activeVideo.title}
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 transition duration-500"
                    />

                    {/* Play Button Dialog Launcher */}
                    <button
                      type="button"
                      onClick={() => setSelectedVideoModal(activeVideo)}
                      className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center shadow-2xl transition transform group-hover:scale-110 ring-4 ring-red-600/30"
                      title="Open Video Theater Dialog"
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </button>

                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/80 text-white text-[11px] font-mono border border-white/10">
                      Lesson {currentVideoIdx + 1} of {videos.length}
                    </div>
                  </div>

                  {/* Right: Lesson Details */}
                  <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between space-y-4 sm:space-y-5">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="text-blue-400 font-semibold">{student.course} Technique</span>
                        <span className="font-mono">{activeVideo.duration}</span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
                        {activeVideo.title}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeVideo.desc}
                      </p>

                      {/* Focus Points */}
                      {activeVideo.focusPoints && activeVideo.focusPoints.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                          <span className="text-slate-400 font-medium block">Key Practice Points:</span>
                          <ul className="space-y-1 text-slate-300">
                            {activeVideo.focusPoints.map((pt, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="leading-snug">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedVideoModal(activeVideo)}
                        className="flex-1 min-h-[44px] py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-red-950/50"
                      >
                        <Play className="w-4 h-4 fill-white shrink-0" />
                        <span>Watch in Video Modal</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Video List Thumbnails */}
            {videos.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2">
                {videos.map((vid, idx) => {
                  const isSelected = idx === currentVideoIdx;
                  return (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => setCurrentVideoIdx(idx)}
                      className={`min-h-[68px] p-3 rounded-2xl border text-left transition active:scale-95 flex flex-col justify-between ${
                        isSelected
                          ? "bg-gradient-to-br from-blue-950/60 to-[#0F1424] border-blue-500 text-white shadow-lg ring-1 ring-blue-500/30"
                          : "bg-[#0D1220] border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1">
                        <span className="text-blue-400 font-bold font-mono">0{idx + 1}</span>
                        <span className="text-slate-400 font-mono">{vid.duration}</span>
                      </div>
                      <h5 className="font-semibold text-xs line-clamp-2 text-slate-200 leading-snug">
                        {vid.title}
                      </h5>
                    </button>
                  );
                })}
              </div>
            )}

          </div>

          {/* =====================================================================
              SECTION 3: GOOGLE MEET
             ===================================================================== */}
          <div className={activeTab === "meet" ? "block space-y-4 sm:space-y-6 animate-fade-in" : "hidden"}>
            
            <div className="p-4 sm:p-8 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-5 sm:space-y-6 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Radio className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Live Google Meet Instruction
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Online live classes and direct form corrections for <strong>{student.course}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    ● Live Room Active
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    ({meetInfo.timeAgoText})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#141A2E] border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-medium">Training Art</span>
                  <strong className="text-white text-sm block">{student.course}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-[#141A2E] border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-medium">Assigned Batch</span>
                  <strong className="text-blue-400 text-sm block">{student.batchTime}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-[#141A2E] border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-medium">Platform</span>
                  <strong className="text-emerald-400 text-sm block">Google Meet HD</strong>
                </div>
              </div>

              {/* Join CTA with Pre-Flight Briefing Modal */}
              <div className="p-5 sm:p-7 rounded-2xl bg-[#090C16] border border-slate-800/80 text-center space-y-3 relative overflow-hidden">
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Click below to view the class guidelines and launch your direct Google Meet connection.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMeetBriefingModal(true)}
                    className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/50"
                  >
                    <Video className="w-4 h-4 shrink-0" />
                    <span>Join Google Meet Class</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* =====================================================================
              SECTION 4: IN-APP LIVE INSTRUCTOR DESK & DOUBT CENTER
             ===================================================================== */}
          <div className={activeTab === "doubt" ? "block space-y-6 animate-fade-in max-w-4xl mx-auto" : "hidden"}>
            
            {/* Top In-App Chat Header & Composer */}
            <div className="p-5 sm:p-7 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-5 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Instructor Message Desk
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Send doubts directly to your master coach inside the academy portal.
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold self-start sm:self-auto">
                  ● Direct Coach Line
                </span>
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Ask a Question or Form Doubt ({student.course})
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Type your question or form doubt here (e.g., stance correction, drill clarification)..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#141A2E] border border-slate-700/80 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none transition resize-none placeholder:text-slate-500 shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-400">
                    Coach replies will appear directly in this feed.
                  </span>
                  <button
                    type="submit"
                    disabled={isSending || !inputMsg.trim()}
                    className="min-h-[42px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-blue-600/30 flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? "Sending..." : "Send Message"}</span>
                  </button>
                </div>
              </form>

            </div>

            {/* In-App Live Messages History Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Conversation with Coach ({myMessages.length})
                </h4>
              </div>

              {myMessages.length === 0 ? (
                <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0E19] border border-dashed border-slate-800 text-center space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                  <strong className="text-white text-sm block">No Messages Yet</strong>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Type a question above to start communicating with your academy instructors.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className="p-4 sm:p-6 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-3.5 shadow-xl"
                    >
                      {/* Student Message */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{student.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">• {msg.createdAt}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words bg-[#13192B] p-3.5 rounded-2xl border border-slate-800/80">
                            {msg.message}
                          </p>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                          msg.status === "REPLIED" 
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" 
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}>
                          {msg.status === "REPLIED" ? "● REPLIED" : "● SENT TO COACH"}
                        </span>
                      </div>

                      {/* Coach Reply if available */}
                      {msg.reply && (
                        <div className="ml-3 sm:ml-6 pl-3 border-l-2 border-amber-400 space-y-1.5 pt-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs text-amber-400 font-bold">Master Coach Response</strong>
                            {msg.repliedAt && (
                              <span className="text-[10px] text-slate-400 font-mono">• {msg.repliedAt}</span>
                            )}
                          </div>
                          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#121A2D] to-[#0A0E18] border border-blue-500/30 text-xs text-blue-100 leading-relaxed break-words shadow-inner">
                            {msg.reply}
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* =========================================================================
          INTERACTIVE MODAL 1: VIDEO THEATER & LESSON DIALOG
         ========================================================================= */}
      {selectedVideoModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedVideoModal(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#11172A] via-[#0B0F1A] to-[#04060C] border border-blue-500/40 p-4 sm:p-7 shadow-2xl shadow-blue-950/80 space-y-4 ring-1 ring-white/15 overflow-hidden animate-scale-up">
            
            {/* Top Foil Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-blue-600" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedVideoModal(null)}
              className="absolute top-3.5 right-3.5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition active:scale-95 z-20"
              aria-label="Close Video Dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2.5 pr-8">
              <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <Play className="w-4 h-4 fill-red-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold tracking-wider block">
                  {student.course} Lesson Theater
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {selectedVideoModal.title}
                </h3>
              </div>
            </div>

            {/* Video Preview Frame */}
            <div className="relative aspect-video rounded-2xl bg-black overflow-hidden border border-slate-800 shadow-inner group">
              <Image
                src={
                  selectedVideoModal.thumbnail ||
                  (student.course === "SILAMBAM"
                    ? "/courses/silambam.jpg"
                    : student.course === "MARTIAL ARTS"
                    ? "/courses/martial-arts.jpg"
                    : student.course === "FITNESS"
                    ? "/courses/fitness.jpg"
                    : "/courses/yoga.jpg")
                }
                alt={selectedVideoModal.title}
                fill
                className="object-cover opacity-75 group-hover:scale-105 transition duration-500"
              />

              <a
                href={selectedVideoModal.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/20 transition gap-2 text-white"
              >
                <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition ring-4 ring-red-600/40">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-black/80 px-3 py-1 rounded-full border border-white/20">
                  Launch in YouTube HD
                </span>
              </a>
            </div>

            {/* Lesson Details & Key Points */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#090D18] border border-slate-800 text-xs space-y-2 text-slate-300">
              <p className="leading-relaxed">
                {selectedVideoModal.desc}
              </p>

              {selectedVideoModal.focusPoints && selectedVideoModal.focusPoints.length > 0 && (
                <div className="space-y-1 pt-1.5 border-t border-slate-800">
                  <span className="text-slate-400 font-semibold block text-[11px]">Instructor Practice Focus:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-200">
                    {selectedVideoModal.focusPoints.map((pt, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
              <span className="text-[11px] font-mono text-slate-400">
                Duration: <strong className="text-white">{selectedVideoModal.duration}</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedVideoModal(null)}
                  className="flex-1 sm:flex-none min-h-[40px] px-4 py-2 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition"
                >
                  Close Theater
                </button>
                <a
                  href={selectedVideoModal.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none min-h-[40px] px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/50"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Video</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 2: LIVE GOOGLE MEET PRE-SESSION BRIEFING
         ========================================================================= */}
      {showMeetBriefingModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMeetBriefingModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#11172A] via-[#0B0F1A] to-[#04060C] border border-emerald-500/40 p-5 sm:p-7 shadow-2xl shadow-emerald-950/80 space-y-4 ring-1 ring-white/15 overflow-hidden animate-scale-up text-center">
            
            {/* Top Emerald/Gold Foil Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowMeetBriefingModal(false)}
              className="absolute top-3.5 right-3.5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition active:scale-95"
              aria-label="Close Briefing Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Martial Arts Video Frame */}
            <div className="flex flex-col items-center gap-2 pt-1">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60 blur-sm animate-pulse" />
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-400/50 bg-[#060810] p-1.5 shadow-xl flex items-center justify-center text-emerald-400">
                  <Radio className="w-7 h-7 animate-pulse" />
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>COACH LIVE SESSION READY</span>
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white tracking-tight">
                Join {student.course} Live Class
              </h4>
              <p className="text-xs text-slate-400">
                Scheduled Batch: <strong className="text-blue-400">{student.batchTime}</strong>
              </p>
            </div>

            {/* Pre-Session Checklist */}
            <div className="p-4 rounded-2xl bg-[#090D18] border border-slate-800 text-left text-xs space-y-2 text-slate-300">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                Athlete Pre-Class Checklist:
              </span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Wear appropriate training uniform/athletic wear</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ensure at least 6×6 ft clear workout space</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Keep camera positioned at full-body height</span>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setShowMeetBriefingModal(false)}
                className="w-full sm:w-1/2 min-h-[42px] py-2.5 px-4 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition"
              >
                Return
              </button>
              <a
                href={meetInfo.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowMeetBriefingModal(false)}
                className="w-full sm:w-1/2 min-h-[42px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50"
              >
                <span>Launch Meet HD</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          THEMED CONFIRMATION MODAL: LOGOUT DIALOG
         ========================================================================= */}
      {showLogoutModal && (
        <VajraAlertModal
          isOpen={true}
          type="confirm"
          confirmVariant="danger"
          title="Sign Out of Student Portal?"
          message={`Are you sure you want to end your current authenticated session for ${student.name} (${student.accessCode})?`}
          actionText="Confirm Sign Out"
          cancelText="Stay in Portal"
          onAction={handleConfirmLogout}
          onClose={() => setShowLogoutModal(false)}
          badgeText="AUTHENTICATION SIGN OUT"
        />
      )}

      {/* System Notice Alert Modal */}
      {portalAlert && (
        <VajraAlertModal
          isOpen={true}
          type={portalAlert.type || "info"}
          title={portalAlert.title}
          message={portalAlert.message}
          onClose={() => setPortalAlert(null)}
        />
      )}

      {/* =========================================================================
          FOOTER
         ========================================================================= */}
      <footer className="border-t border-slate-800/80 py-4 sm:py-5 text-center text-slate-400 text-xs bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TEAM VAJRA FITNESS ARTS • STUDENT PORTAL</span>
          <span>Admissions & Desk: <strong className="text-slate-300">+91 86681 02797</strong></span>
        </div>
      </footer>

    </div>
  );
}

