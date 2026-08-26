"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VajraStudent, VajraStudentStore, TrainingVideo } from "@/lib/store";
import { listenToMeetLinksCloud, listenToVideosCloud } from "@/lib/firebase";
import { 
  User, Shield, Flame, Dumbbell, Sparkles, CheckCircle2, 
  Copy, Check, LogOut, MessageSquare, Phone, ChevronRight, 
  ChevronLeft, Video, Play, ExternalLink, Radio, Pause, 
  Calendar, Clock, Award
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

  // Real-time Meet Link & Live Timestamp Notification
  const [meetInfo, setMeetInfo] = useState<{ url: string; updatedAt: number | null; timeAgoText: string; isRecent: boolean }>({
    url: "https://meet.google.com/new",
    updatedAt: null,
    timeAgoText: "Active Session Link",
    isRecent: false
  });

  useEffect(() => {
    const existing = VajraStudentStore.getStudent();
    if (!existing) {
      router.push("/course");
    } else {
      setStudent(existing);
      const vids = VajraStudentStore.getCourseVideos(existing.course);
      setVideos(vids);
      setMeetInfo(VajraStudentStore.getMeetLinkInfo(existing.course));
    }
  }, [router]);

  useEffect(() => {
    if (!student) return;

    const updateMeet = () => {
      const info = VajraStudentStore.getMeetLinkInfo(student.course);
      setMeetInfo(info);
    };

    updateMeet();
    window.addEventListener("vajra_meet_link_updated", updateMeet);
    window.addEventListener("vajra_videos_updated", () => {
      setVideos(VajraStudentStore.getCourseVideos(student.course));
    });

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

    const interval = setInterval(updateMeet, 10000);

    return () => {
      window.removeEventListener("vajra_meet_link_updated", updateMeet);
      unsubMeet();
      unsubVideos();
      clearInterval(interval);
    };
  }, [student]);

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
    { id: "doubt", label: "Doubt & Contact", shortLabel: "Doubts", icon: MessageSquare },
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

            {/* Student Code & Logout */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1424] border border-slate-800 text-xs">
                <span className="text-slate-400">Student Code:</span>
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
                    Coach posted a Google Meet class link for <span className="text-blue-400">{student.course}</span>!
                  </h3>
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
              
              {/* Left: Clean Student Membership Card (6 Cols) */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-4 sm:p-7 space-y-4 sm:space-y-5">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-slate-800 gap-2">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-slate-700 bg-black/60 p-0.5 shrink-0">
                        <Image src="/vajra-logo.jpg" alt="Team Vajra Emblem" fill className="object-contain" />
                      </div>
                      <div className="min-w-0">
                        <strong className="text-white font-semibold text-xs sm:text-sm block truncate">Team Vajra Fitness Arts</strong>
                        <span className="text-[11px] sm:text-xs text-slate-400 block truncate">Student Membership Card</span>
                      </div>
                    </div>

                    <span className="px-2 sm:px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-medium shrink-0">
                      ● Active Pass
                    </span>
                  </div>

                  {/* Student Details Grid (Optimized word breaking for mobile) */}
                  <div className="space-y-2.5 sm:space-y-3.5 text-xs">
                    
                    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 gap-3">
                      <span className="text-slate-400 shrink-0">Student Name:</span>
                      <strong className="text-white font-medium text-xs sm:text-sm text-right break-words">{student.name}</strong>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 gap-2">
                      <span className="text-slate-400 shrink-0">Access Code:</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <strong className="font-mono text-xs sm:text-sm text-blue-400 font-bold">{student.accessCode}</strong>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="min-w-[32px] min-h-[32px] p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 flex items-center justify-center transition"
                          title="Copy Code"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 gap-3">
                      <span className="text-slate-400 shrink-0">Course:</span>
                      <span className="text-white font-medium text-right break-words">{student.course}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 gap-3">
                      <span className="text-slate-400 shrink-0">Batch Timing:</span>
                      <span className="text-slate-300 text-right text-[11px] sm:text-xs break-words">{student.batchTime}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 gap-3">
                      <span className="text-slate-400 shrink-0">Registered Phone:</span>
                      <span className="text-slate-300 font-mono text-right">{student.phone}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 gap-3">
                      <span className="text-slate-400 shrink-0">Admission Date:</span>
                      <span className="text-slate-300 text-right">{student.joinedDate}</span>
                    </div>

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

                {/* Attendance & Streak Metric Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-1">
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">Attendance Rate</span>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-400">{student.attendanceRate}%</div>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">Floor Presence</span>
                  </div>

                  <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-1">
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">Active Streak</span>
                    <div className="text-xl sm:text-2xl font-bold text-blue-400">{student.streakDays} Day</div>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">Regular Training</span>
                  </div>
                </div>

                {/* Quick Help Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <span className="text-slate-400 block truncate">Need assistance or form doubt?</span>
                    <strong className="text-white block mt-0.5 truncate">Contact Instructor Desk</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("doubt")}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 active:scale-95 font-semibold transition shrink-0"
                  >
                    Open Desk
                  </button>
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
                  <span className="text-slate-400 block">Scheduled Batch</span>
                  <strong className="text-blue-400 text-sm block">{student.batchTime}</strong>
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
              SECTION 4: DOUBT & CONTACT
             ===================================================================== */}
          <div className={activeTab === "doubt" ? "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fade-in max-w-4xl mx-auto" : "hidden"}>
            
            {/* Ask Coach */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Coach WhatsApp Hotline</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white">Ask Training Doubts</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Send your practice videos or posture questions directly to the head master coach.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-[#141A2E] text-xs flex items-center justify-between text-slate-300">
                  <span>Student Code:</span>
                  <strong className="text-blue-400 font-mono">{student.accessCode}</strong>
                </div>

                <a
                  href={`https://wa.me/918668102797?text=${encodeURIComponent(`Hello Coach, I am ${student.name} (Code: ${student.accessCode}). I have a question regarding my ${student.course} practice.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full min-h-[44px] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Message Coach on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Academy Reception */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Academy Office Desk</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white">Schedule & Batch Inquiries</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For batch timing changes, admissions, or official certificate inquiries.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-[#141A2E] text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Phone:</span>
                    <span className="text-white font-mono">+91 86681 02797</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Timings:</span>
                    <span className="text-slate-300">05:30 AM – 08:30 PM</span>
                  </div>
                </div>

                <a
                  href="tel:+918668102797"
                  className="w-full min-h-[44px] py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Call Academy Desk</span>
                </a>
              </div>
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

