"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VajraStudent, VajraStudentStore, TrainingVideo, VajraMessage } from "@/lib/store";
import { listenToMeetLinksCloud, listenToVideosCloud, listenToMessagesCloud } from "@/lib/firebase";
import { useVajraTimezone } from "@/lib/timezone";
import TimezoneSelector from "@/components/TimezoneSelector";
import { 
  User, Shield, Flame, Dumbbell, Sparkles, CheckCircle2, 
  Copy, Check, LogOut, MessageSquare, Phone, ChevronRight, 
  ChevronLeft, Video, Play, ExternalLink, Radio, Pause, 
  Calendar, Clock, Award, Send, Globe
} from "lucide-react";

export default function StudentPortalPage() {
  const router = useRouter();
  const { selectedTz, convertBatch, liveTime } = useVajraTimezone();
  const [student, setStudent] = useState<VajraStudent | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "videos" | "meet" | "doubt">("profile");
  
  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

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
      showNotification("Student code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
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
    { id: "profile", label: "Profile", shortLabel: "Profile", icon: User },
    { id: "videos", label: "Training Videos", shortLabel: "Videos", icon: Video },
    { id: "meet", label: "Google Meet", shortLabel: "Meet", icon: Radio },
    { id: "doubt", label: "Ask Doubt Directly", shortLabel: "Ask Doubt", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-200 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium shadow-2xl flex items-center gap-2 animate-fade-in max-w-[calc(100vw-32px)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{notification}</span>
        </div>
      )}

      {/* =========================================================================
          1. HEADER NAVBAR (Optimized for 320px - 768px mobile)
         ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0E1A]/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            
            {/* Academy Brand */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-slate-700 bg-black/60 p-0.5 shrink-0">
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
                        ? "bg-blue-600 text-white shadow-sm font-bold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Student Code, Timezone Selector & Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <TimezoneSelector compact className="shrink-0" />

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1424] border border-slate-800 text-xs">
                <span className="text-slate-400">Code:</span>
                <span className="font-mono font-bold text-blue-400">{student.accessCode}</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-[#141A2E] hover:bg-red-950/40 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800 text-xs font-semibold transition flex items-center gap-1.5 min-h-[36px]"
                title="Logout from student portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Tabs (Touch-friendly 44px+ tap targets, no overflow) */}
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
                  className={`min-h-[44px] py-1.5 px-1 rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1 transition active:scale-95 ${
                    isActive
                      ? "bg-blue-600 text-white font-bold shadow-sm"
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
            <div className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/90 via-[#0D152A] to-emerald-950/90 border-2 border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 animate-fade-in ring-1 ring-emerald-500/30">
              
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0">
                <div className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 items-center justify-center mt-1 sm:mt-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider border border-emerald-500/30 shrink-0">
                      ● LIVE CLASS ACTIVE
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                      {meetInfo.timeAgoText}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-base font-bold text-white leading-snug break-words">
                    Coach posted Google Meet link for <span className="text-blue-400">{student.course}</span>!
                  </h3>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1.5 pt-0.5">
                    <span>Your Local Batch:</span>
                    <strong className="text-blue-400 font-mono font-bold">{selectedTz.flag} {convertBatch(student.batchTime).convertedTime}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                <a
                  href={meetInfo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                >
                  <Radio className="w-4 h-4 animate-pulse shrink-0" />
                  <span className="truncate">Join Live Class Now</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

            </div>
          )}
          
          {/* =====================================================================
              SECTION 1: PROFILE TAB
             ===================================================================== */}
          <div className={activeTab === "profile" ? "block space-y-4 sm:space-y-6 animate-fade-in" : "hidden"}>
            
            {/* Student Welcome Header */}
            <div className="p-4 sm:p-8 rounded-2xl bg-[#0D1220] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                  Team Vajra Academy
                </span>
                <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight break-words">
                  Welcome, {student.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 break-words">
                  Enrolled in <strong className="text-slate-200">{student.course}</strong> • {student.ageGroup}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("videos")}
                  className="min-h-[42px] px-3 sm:px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  <Video className="w-4 h-4 shrink-0" />
                  <span className="truncate">Watch Videos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("meet")}
                  className="min-h-[42px] px-3 sm:px-4 py-2.5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] active:scale-[0.98] text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Radio className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="truncate">Join Live Class</span>
                </button>
              </div>
            </div>

            {/* Profile Grid: Left (Membership Card) / Right (Details) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
              
              {/* Left: Elite VIP Athlete Membership Card (6 Cols) */}
              <div className="lg:col-span-6">
                <div className="relative rounded-3xl bg-gradient-to-br from-[#111827] via-[#0B0F19] to-[#04060C] border border-blue-500/30 p-5 sm:p-7 space-y-5 shadow-2xl shadow-blue-950/40 overflow-hidden ring-1 ring-white/10 group">
                  
                  {/* Subtle Holographic Grid Pattern & Glow Watermark */}
                  <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.07] pointer-events-none" />
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top VIP Accent Foil Strip */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-amber-400" />

                  {/* Card Header with Smart Chip & Academy Emblem */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 gap-3 relative">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-blue-400/40 bg-black/80 p-1 shadow-lg shrink-0">
                        <Image src="/vajra-logo.jpg" alt="Team Vajra Emblem" fill className="object-contain p-0.5" priority />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase block">
                          Official Athlete Pass
                        </span>
                        <strong className="text-white font-extrabold text-sm sm:text-base block truncate tracking-tight">
                          TEAM VAJRA ACADEMY
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Micro NFC / Smart Chip Aesthetic */}
                      <div className="hidden sm:flex w-8 h-6 rounded-md bg-gradient-to-tr from-amber-500/30 to-amber-300/60 border border-amber-400/50 items-center justify-center shadow-inner">
                        <div className="w-5 h-3 border border-amber-300/40 rounded-sm" />
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
                    <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#070B14]/80 border border-blue-500/20 gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Student Access Code</span>
                        <strong className="font-mono text-sm sm:text-base text-sky-400 font-extrabold tracking-wider block">
                          {student.accessCode}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="min-w-[36px] min-h-[36px] px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 hover:text-white flex items-center justify-center gap-1.5 transition active:scale-95 text-xs font-semibold shrink-0"
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
                      <div className="text-right space-y-0.5">
                        <span className="text-blue-400 font-bold block text-xs">
                          {selectedTz.flag} {convertBatch(student.batchTime).convertedTime}
                        </span>
                        {selectedTz.id !== "IST" && (
                          <span className="text-[10px] text-slate-400 font-mono block">
                            ({convertBatch(student.batchTime).originalIst})
                          </span>
                        )}
                      </div>
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
                    <span className="text-blue-400 font-semibold">VAJRA DIGITAL ID</span>
                  </div>

                </div>
              </div>

              {/* Right: Academic Status & Overview (6 Cols) */}
              <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
                
                {/* Course Track Card */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Training Track</span>
                    <CourseIcon className="w-4 h-4 text-blue-400 shrink-0" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {student.course} Program
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Formal curriculum and regular instructor assessments for {student.course}.
                  </p>
                </div>

                {/* Quick Help & Portal Navigation Card */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Quick Support</span>
                    <h5 className="text-sm font-bold text-white">Direct Instructor Assistance</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Have questions about your {student.course} training forms, batch timings, or practice drills?
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("doubt")}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask Doubt Directly</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("videos")}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-200 border border-slate-700 font-semibold text-xs transition text-center"
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
                  {student.course} Practice Videos
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Watch training lessons and practice drills recorded by academy masters.
                </p>
              </div>

              {videos.length > 0 && (
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                  <button
                    type="button"
                    onClick={handlePrevVideo}
                    className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-[#0D1220] border border-slate-700 text-slate-300 hover:text-white active:scale-95 transition flex items-center justify-center"
                    title="Previous video"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCarouselPaused(!isCarouselPaused)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#0D1220] border border-slate-700 text-xs text-slate-300 hover:text-white active:scale-95 transition flex items-center gap-1.5"
                  >
                    {isCarouselPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Pause className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    <span>{isCarouselPaused ? "Paused" : "Auto-Slide"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextVideo}
                    className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-[#0D1220] border border-slate-700 text-slate-300 hover:text-white active:scale-95 transition flex items-center justify-center"
                    title="Next video"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* If no videos uploaded yet */}
            {videos.length === 0 ? (
              <div className="p-8 sm:p-12 text-center text-slate-400 space-y-3 rounded-2xl bg-[#0D1220] border border-slate-800">
                <Video className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">No training videos uploaded yet for {student.course}.</p>
                <p className="text-xs text-slate-400">
                  New video lessons uploaded by your instructor will appear here.
                </p>
              </div>
            ) : (
              <div 
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
                className="rounded-2xl bg-[#0D1220] border border-slate-800 overflow-hidden shadow-lg"
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

                    {/* Play Button Overlay */}
                    <a
                      href={activeVideo.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white flex items-center justify-center shadow-xl transition transform group-hover:scale-110"
                      title="Play video on YouTube"
                    >
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
                    </a>

                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/80 text-white text-[11px] font-mono">
                      YouTube Video
                    </div>
                  </div>

                  {/* Right: Lesson Details */}
                  <div className="lg:col-span-5 p-4 sm:p-7 flex flex-col justify-between space-y-4 sm:space-y-5">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="text-blue-400 font-medium">{student.course} Practice</span>
                        <span>Video {currentVideoIdx + 1} of {videos.length}</span>
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

                    <div className="pt-2">
                      <a
                        href={activeVideo.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                      >
                        <Play className="w-4 h-4 fill-white shrink-0" />
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
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
                      className={`min-h-[64px] p-2.5 sm:p-3 rounded-xl border text-left transition active:scale-95 flex flex-col justify-between ${
                        isSelected
                          ? "bg-blue-950/50 border-blue-500 text-white shadow-md"
                          : "bg-[#0D1220] border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1">
                        <span className="text-blue-400 font-bold">0{idx + 1}</span>
                        <span className="text-slate-400">{vid.duration}</span>
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
            
            <div className="p-4 sm:p-8 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-5 sm:space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Radio className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Live Google Meet Class
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Online live instruction and form correction for <strong>{student.course}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-2.5 sm:px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    ● Live Class Available
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    ({meetInfo.timeAgoText})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#141A2E] border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Training Art</span>
                  <strong className="text-white text-sm block">{student.course}</strong>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#141A2E] border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Scheduled Batch ({selectedTz.code})</span>
                  <strong className="text-blue-400 text-sm block">
                    {selectedTz.flag} {convertBatch(student.batchTime).convertedTime}
                  </strong>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#141A2E] border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Platform</span>
                  <strong className="text-emerald-400 text-sm block">Google Meet HD</strong>
                </div>
              </div>

              {/* Join CTA */}
              <div className="p-4 sm:p-6 rounded-xl bg-[#090C16] border border-slate-800/80 text-center space-y-3">
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Click below to open Google Meet directly. Please enable your camera and microphone for coaching feedback.
                </p>

                <div className="pt-2">
                  <a
                    href={meetInfo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition shadow"
                  >
                    <Video className="w-4 h-4 shrink-0" />
                    <span>Join Google Meet Class</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
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
                    className="w-full px-4 py-3 rounded-2xl bg-[#141A2E] border border-slate-700/80 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none transition resize-none placeholder:text-slate-500"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-400">
                    Coach replies will appear directly in this feed.
                  </span>
                  <button
                    type="submit"
                    disabled={isSending || !inputMsg.trim()}
                    className="min-h-[42px] px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-blue-600/30 flex items-center gap-2"
                  >
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
                <div className="p-8 rounded-2xl bg-[#0B0E19] border border-dashed border-slate-800 text-center space-y-2">
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
                      className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-3 shadow-lg"
                    >
                      {/* Student Message */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{student.name}</span>
                            <span className="text-[10px] text-slate-400">• {msg.createdAt}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words bg-[#13192B] p-3 rounded-xl border border-slate-800/80">
                            {msg.message}
                          </p>
                        </div>

                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${
                          msg.status === "REPLIED" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {msg.status === "REPLIED" ? "● Replied" : "● Sent to Coach"}
                        </span>
                      </div>

                      {/* Coach Reply if available */}
                      {msg.reply && (
                        <div className="ml-4 sm:ml-6 pl-3 border-l-2 border-blue-500 space-y-1.5 pt-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs text-blue-400 font-bold">Master Coach Response</strong>
                            {msg.repliedAt && (
                              <span className="text-[10px] text-slate-400">• {msg.repliedAt}</span>
                            )}
                          </div>
                          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-100 leading-relaxed break-words">
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
          FOOTER
         ========================================================================= */}
      <footer className="border-t border-slate-800/80 py-4 sm:py-5 text-center text-slate-400 text-xs bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TEAM VAJRA FITNESS ARTS • STUDENT PORTAL</span>
          <span>Contact: <strong className="text-slate-300">+91 86681 02797</strong></span>
        </div>
      </footer>

    </div>
  );
}

