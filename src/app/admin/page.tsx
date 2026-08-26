"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VajraStudent, VajraStudentStore, TrainingVideo, VajraMessage } from "@/lib/store";
import VajraAlertModal from "@/components/VajraAlertModal";
import { 
  listenToStudentsCloud, 
  listenToMeetLinksCloud, 
  listenToVideosCloud, 
  listenToMessagesCloud, 
  isFirebaseConfigured 
} from "@/lib/firebase";
import { useVajraTimezone } from "@/lib/timezone";
import TimezoneSelector from "@/components/TimezoneSelector";
import { 
  User, KeyRound, LogOut, 
  Search, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, 
  MessageSquare, Radio, Users, Video, ExternalLink, 
  X, Save, Sparkles, Loader2, Clock, Phone, Cloud, Send, Globe
} from "lucide-react";

export default function AdminPortalPage() {
  const router = useRouter();
  const { selectedTz, convertBatch, liveTime } = useVajraTimezone();

  // Custom Brand System Notice State
  const [systemAlert, setSystemAlert] = useState<{ title: string; message: string; type?: "error" | "warning" | "success" } | null>(null);

  // Admin Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [cloudSynced, setCloudSynced] = useState(false);

  // Navigation Sub-Tabs in Admin
  const [adminTab, setAdminTab] = useState<"students" | "meet" | "videos" | "messages">("students");

  // Dashboard State
  const [students, setStudents] = useState<VajraStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");

  // Messages State
  const [messagesList, setMessagesList] = useState<VajraMessage[]>([]);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Course-Specific Meet Links State
  const [allMeetLinks, setAllMeetLinks] = useState<Record<string, string>>({});
  const [selectedMeetCourse, setSelectedMeetCourse] = useState("SILAMBAM");
  const [meetUrlInput, setMeetUrlInput] = useState("https://meet.google.com/new");

  // Video Management State
  const [videosList, setVideosList] = useState<TrainingVideo[]>([]);
  const [selectedVideoCourse, setSelectedVideoCourse] = useState("ALL");
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

  // New Video Form State & Intelligent YouTube Auto-Fetcher
  const [newVidCourse, setNewVidCourse] = useState("SILAMBAM");
  const [newVidUrl, setNewVidUrl] = useState("");
  const [newVidTitle, setNewVidTitle] = useState("");
  const [newVidDuration, setNewVidDuration] = useState("15:00");
  const [newVidLevel, setNewVidLevel] = useState("Lesson 01");
  const [newVidDesc, setNewVidDesc] = useState("");
  const [ytThumbnail, setYtThumbnail] = useState<string | null>(null);
  const [ytAuthor, setYtAuthor] = useState<string | null>(null);
  const [isFetchingYt, setIsFetchingYt] = useState(false);

  // Add / Edit Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentCourse, setNewStudentCourse] = useState("SILAMBAM");
  const [newStudentAgeGroup, setNewStudentAgeGroup] = useState("Adult (18–45 yrs)");
  const [newStudentBatch, setNewStudentBatch] = useState("Morning (05:30 AM – 07:30 AM)");
  const [customCode, setCustomCode] = useState("");

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState<VajraStudent | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const isAuth = VajraStudentStore.isAdminAuthenticated();
    setIsAuthenticated(isAuth);
    setCloudSynced(isFirebaseConfigured());

    if (isAuth) {
      loadData();
    }

    // Real-time Cloud Subscriptions
    const unsubStudents = listenToStudentsCloud((cloudStudents) => {
      if (cloudStudents && cloudStudents.length > 0) {
        VajraStudentStore.syncMembersFromCloud(cloudStudents);
        setStudents(VajraStudentStore.getAllStudents());
      }
    });

    const unsubMeet = listenToMeetLinksCloud((cloudLinks) => {
      if (cloudLinks && Object.keys(cloudLinks).length > 0) {
        VajraStudentStore.syncMeetLinksFromCloud(cloudLinks);
        const links = VajraStudentStore.getAllMeetLinks();
        setAllMeetLinks(links);
        setMeetUrlInput(links[selectedMeetCourse] || "https://meet.google.com/new");
      }
    });

    const unsubVideos = listenToVideosCloud((cloudVideos) => {
      if (cloudVideos && cloudVideos.length > 0) {
        VajraStudentStore.syncVideosFromCloud(cloudVideos);
        setVideosList(VajraStudentStore.getAllVideos());
      }
    });

    const unsubMsgs = listenToMessagesCloud((cloudMsgs) => {
      if (cloudMsgs && cloudMsgs.length > 0) {
        VajraStudentStore.syncMessagesFromCloud(cloudMsgs);
        setMessagesList(VajraStudentStore.getAllMessages());
      }
    });

    const handleLocalRegistryChange = () => {
      setStudents(VajraStudentStore.getAllStudents());
    };
    const handleLocalMsgsChange = () => {
      setMessagesList(VajraStudentStore.getAllMessages());
    };

    window.addEventListener("vajra_registry_change", handleLocalRegistryChange);
    window.addEventListener("vajra_messages_updated", handleLocalMsgsChange);

    return () => {
      unsubStudents();
      unsubMeet();
      unsubVideos();
      unsubMsgs();
      window.removeEventListener("vajra_registry_change", handleLocalRegistryChange);
      window.removeEventListener("vajra_messages_updated", handleLocalMsgsChange);
    };
  }, [selectedMeetCourse]);

  const loadData = () => {
    setStudents(VajraStudentStore.getAllStudents());
    const links = VajraStudentStore.getAllMeetLinks();
    setAllMeetLinks(links);
    setMeetUrlInput(links[selectedMeetCourse] || "https://meet.google.com/new");
    setVideosList(VajraStudentStore.getAllVideos());
    setMessagesList(VajraStudentStore.getAllMessages());
  };

  const handleSendCoachReply = (msgId: string) => {
    const text = replyInputs[msgId];
    if (!text || !text.trim()) {
      setSystemAlert({
        title: "Reply Required",
        message: "Please type your reply before sending.",
        type: "warning"
      });
      return;
    }

    VajraStudentStore.replyToMessage(msgId, text.trim());
    setMessagesList(VajraStudentStore.getAllMessages());
    setReplyInputs({ ...replyInputs, [msgId]: "" });
    showToast("Coach reply sent to student portal!");
  };

  const handleDeleteMessage = (msgId: string) => {
    if (confirm("Remove this message?")) {
      VajraStudentStore.deleteMessage(msgId);
      setMessagesList(VajraStudentStore.getAllMessages());
      showToast("Message removed");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      username.trim().toLowerCase() === "admin" &&
      (password.trim() === "123" || password.trim().toLowerCase() === "admin")
    ) {
      VajraStudentStore.setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setAuthError("");
      loadData();
      showToast("Welcome Administrator");
    } else {
      setAuthError("Invalid username or password. (admin / 123)");
    }
  };

  const handleAdminLogout = () => {
    VajraStudentStore.setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const handleSelectMeetCourse = (crs: string) => {
    setSelectedMeetCourse(crs);
    const links = VajraStudentStore.getAllMeetLinks();
    setMeetUrlInput(links[crs] || "https://meet.google.com/new");
  };

  const handleSaveCourseMeetLink = (e: React.FormEvent) => {
    e.preventDefault();
    VajraStudentStore.setLiveMeetLink(selectedMeetCourse, meetUrlInput.trim());
    const links = VajraStudentStore.getAllMeetLinks();
    setAllMeetLinks(links);
    showToast(`Google Meet link saved for ${selectedMeetCourse}`);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      setSystemAlert({
        title: "Student Name Required",
        message: "Please enter the member's full name to register.",
        type: "warning"
      });
      return;
    }

    const existing = VajraStudentStore.getStudentByPhone(newStudentPhone);
    if (existing) {
      setSystemAlert({
        title: "Student Already Registered",
        message: `Student with phone ${newStudentPhone} is already enrolled as "${existing.name}" (Access Code: ${existing.accessCode}).`,
        type: "warning"
      });
      return;
    }

    const finalCode = customCode.trim() 
      ? customCode.trim().toUpperCase() 
      : `VAJRA-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent = VajraStudentStore.createStudentProfile(
      finalCode,
      newStudentName.trim(),
      newStudentPhone.trim() || "+91 86681 02797",
      newStudentCourse,
      newStudentAgeGroup,
      newStudentBatch
    );

    setStudents(VajraStudentStore.getAllStudents());
    setIsAddModalOpen(false);
    setNewStudentName("");
    setNewStudentPhone("");
    setCustomCode("");
    showToast(`Student ${newStudent.name} (${newStudent.accessCode}) registered`);
  };

  const handleApproveStudent = (student: VajraStudent) => {
    const approved = VajraStudentStore.approveAdmission(student.requestCode || student.accessCode);
    if (approved) {
      setStudents(VajraStudentStore.getAllStudents());
      showToast(`Approved ${approved.name}! Permanent Code: ${approved.accessCode}`);
    }
  };

  const handleRejectStudent = (student: VajraStudent) => {
    if (confirm(`Reject admission request for ${student.name}?`)) {
      VajraStudentStore.rejectAdmission(student.requestCode || student.accessCode);
      setStudents(VajraStudentStore.getAllStudents());
      showToast(`Admission request for ${student.name} rejected`);
    }
  };

  const handleToggleFeeStatus = (student: VajraStudent) => {
    const newStatus = student.feeStatus === "ACTIVE" ? "DUE" : "ACTIVE";
    VajraStudentStore.updateStudent(student.accessCode, { feeStatus: newStatus });
    setStudents(VajraStudentStore.getAllStudents());
    showToast(`Fee status for ${student.name} updated to ${newStatus}`);
  };

  const handleDeleteStudent = (code: string, name: string) => {
    if (confirm(`Remove student ${name} (${code}) from registry?`)) {
      VajraStudentStore.deleteStudent(code);
      setStudents(VajraStudentStore.getAllStudents());
      showToast(`Student ${name} removed`);
    }
  };

  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    VajraStudentStore.updateStudent(editingStudent.accessCode, editingStudent);
    setStudents(VajraStudentStore.getAllStudents());
    setEditingStudent(null);
    showToast(`Saved changes for ${editingStudent.name}`);
  };

  // =========================================================================
  // INTELLIGENT YOUTUBE AUTO-METADATA FETCHER
  // =========================================================================
  const extractYouTubeId = (url: string): string | null => {
    const cleanUrl = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleYouTubeUrlChange = async (url: string) => {
    setNewVidUrl(url);
    const videoId = extractYouTubeId(url);

    if (videoId) {
      const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      setYtThumbnail(thumb);
      setIsFetchingYt(true);

      try {
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        const data = await response.json();
        if (data && data.title) {
          setNewVidTitle(data.title);
          setYtAuthor(data.author_name || "Team Vajra YouTube");
          setNewVidDesc(`Official practice session: ${data.title}`);
        } else {
          setNewVidTitle(`${newVidCourse} Practice Session`);
        }
      } catch (err) {
        console.log("Could not auto-fetch title, fallback to default", err);
        setNewVidTitle(`${newVidCourse} Practice Session`);
      } finally {
        setIsFetchingYt(false);
      }
    } else {
      setYtThumbnail(null);
      setYtAuthor(null);
    }
  };

  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidUrl.trim()) {
      setSystemAlert({
        title: "YouTube URL Required",
        message: "Please enter or paste a valid YouTube video link.",
        type: "warning"
      });
      return;
    }

    const videoId = extractYouTubeId(newVidUrl);
    const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined;
    const finalTitle = newVidTitle.trim() || `${newVidCourse} Practice Drill`;

    VajraStudentStore.addCourseVideo({
      course: newVidCourse,
      title: finalTitle,
      youtubeUrl: newVidUrl.trim(),
      thumbnail: thumb,
      duration: newVidDuration.trim() || "15:00",
      level: newVidLevel.trim() || "Lesson 01",
      desc: newVidDesc.trim() || `Official practice video for ${newVidCourse}.`,
      focusPoints: ["Posture & Stance", "Movement Rhythm", "Daily Practice Drills"]
    });

    setVideosList(VajraStudentStore.getAllVideos());
    setIsAddVideoModalOpen(false);
    setNewVidTitle("");
    setNewVidUrl("");
    setNewVidDesc("");
    setYtThumbnail(null);
    setYtAuthor(null);
    showToast(`Video lesson added for ${newVidCourse}`);
  };

  const handleDeleteVideo = (course: string, id: string, title: string) => {
    if (confirm(`Delete video "${title}"?`)) {
      VajraStudentStore.deleteCourseVideo(course, id);
      setVideosList(VajraStudentStore.getAllVideos());
      showToast("Video deleted");
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.accessCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);

    const matchesCourse = 
      selectedCourse === "ALL" || s.course === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  const totalActiveFees = students.filter(s => s.feeStatus === "ACTIVE").length;
  const totalDueFees = students.filter(s => s.feeStatus === "DUE").length;
  const courses = ["SILAMBAM", "MARTIAL ARTS", "FITNESS", "YOGA", "ALL-ACCESS TRACK", "GENERAL"];

  /* =========================================================================
      ADMIN LOGIN SCREEN (Optimized for all viewports from 320px)
     ========================================================================= */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080B14] text-slate-200 flex flex-col items-center justify-center p-3 sm:p-6 selection:bg-blue-600 selection:text-white font-sans">
        
        <div className="w-full max-w-md bg-[#0D1220] border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2.5">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-700 bg-black/60 p-0.5 mx-auto shadow-md">
              <Image
                src="/vajra-logo.jpg"
                alt="Team Vajra Emblem"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight pt-1">
              Team Vajra Admin Login
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Sign in to manage student admissions, live class links, and training videos.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-blue-600/20 active:scale-[0.99]"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="text-center pt-1 border-t border-slate-800/80">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition py-1"
            >
              <span>← Return to Main Website</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  /* =========================================================================
      ADMIN MASTER DASHBOARD
     ========================================================================= */
  return (
    <div className="min-h-screen bg-[#080B14] text-slate-200 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium shadow-2xl flex items-center justify-center sm:justify-start gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* TOPBAR */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0E1A]/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
            
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-slate-700 bg-black/60 p-0.5 shrink-0">
                <Image
                  src="/vajra-logo.jpg"
                  alt="Team Vajra Emblem"
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
                  <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/20 shrink-0">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 truncate block">
                  Academy Management
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-[#0F1424] border border-slate-800 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setAdminTab("students")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  adminTab === "students"
                    ? "bg-blue-600 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Students ({students.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("meet")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  adminTab === "meet"
                    ? "bg-blue-600 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Google Meet</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("videos")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  adminTab === "videos"
                    ? "bg-blue-600 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Videos ({videosList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("messages")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition relative ${
                  adminTab === "messages"
                    ? "bg-blue-600 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Messages ({messagesList.length})</span>
                {messagesList.filter(m => m.status === "UNREAD").length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <TimezoneSelector compact className="shrink-0" />

              <Link
                href="/portal"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 text-xs font-medium border border-slate-700 transition"
              >
                <span className="hidden xs:inline">Student Portal</span>
                <span className="xs:hidden">Portal</span>
                <ExternalLink className="w-3 h-3 text-blue-400 shrink-0" />
              </Link>

              <button
                onClick={handleAdminLogout}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#141A2E] hover:bg-red-950/40 text-slate-300 hover:text-red-300 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Segmented Tabs */}
        <div className="md:hidden border-t border-slate-800/80 bg-[#0A0E1A] px-2 py-1.5">
          <div className="grid grid-cols-4 gap-1 bg-[#090C16] border border-slate-800 rounded-xl p-1 text-[11px]">
            <button
              onClick={() => setAdminTab("students")}
              className={`py-2 px-0.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition ${
                adminTab === "students" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Students</span>
            </button>
            <button
              onClick={() => setAdminTab("meet")}
              className={`py-2 px-0.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition ${
                adminTab === "meet" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Radio className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Meet</span>
            </button>
            <button
              onClick={() => setAdminTab("videos")}
              className={`py-2 px-0.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition ${
                adminTab === "videos" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Videos</span>
            </button>
            <button
              onClick={() => setAdminTab("messages")}
              className={`py-2 px-0.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition relative ${
                adminTab === "messages" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Msgs</span>
              {messagesList.filter(m => m.status === "UNREAD").length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse absolute top-1.5 right-1" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 py-4 sm:py-8">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          {/* ===================================================================
              TAB 1: STUDENTS DIRECTORY
             =================================================================== */}
          {adminTab === "students" && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in">
              
              {/* Summary Cards Grid (1 col on mobile, 2 on tablet, 4 on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Total Students</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{students.length}</div>
                  <span className="text-[11px] text-slate-400 block">Enrolled Member Profiles</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Active Passes</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">{totalActiveFees}</div>
                  <span className="text-[11px] text-slate-400 block">{totalDueFees} Pending Renewals</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Training Arts</span>
                    <Radio className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">4 Courses</div>
                  <span className="text-[11px] text-slate-400 block truncate">Silambam, Martial Arts, Fitness, Yoga</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Practice Videos</span>
                    <Video className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{videosList.length}</div>
                  <span className="text-[11px] text-slate-400 block">Uploaded Lessons</span>
                </div>
              </div>

              {/* Students Directory Container */}
              <div className="rounded-2xl bg-[#0D1220] border border-slate-800 p-4 sm:p-6 space-y-5">
                
                {/* Search & Filter Header (Mobile Optimized Layout) */}
                <div className="flex flex-col gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Registered Student Directory
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      View and manage registered student profiles, batches, and admission status.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs focus:outline-none"
                      >
                        <option value="ALL">All Courses</option>
                        <option value="SILAMBAM">Silambam</option>
                        <option value="MARTIAL ARTS">Martial Arts</option>
                        <option value="FITNESS">Fitness</option>
                        <option value="YOGA">Yoga</option>
                      </select>

                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Student</span>
                      </button>
                    </div>
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="p-8 sm:p-12 text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-sm font-medium text-slate-300">No student records found.</p>
                    <p className="text-xs text-slate-500">
                      Student registrations from the website will appear here.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* MOBILE CARDS VIEW (< md viewports: Highly readable, 0 clipping, big touch targets) */}
                    <div className="block md:hidden space-y-3">
                      {filteredStudents.map((st) => (
                        <div
                          key={st.accessCode}
                          className="p-4 rounded-xl bg-[#141A2E] border border-slate-800 space-y-3 shadow-sm"
                        >
                          {/* Card Header: Name, Access Code & Fee/Approval Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-sm truncate">{st.name}</h4>
                              <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                                <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                                <span className="font-mono">{st.phone}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className={`px-2 py-0.5 rounded border font-mono font-bold text-[11px] ${
                                st.approvalStatus === "PENDING_APPROVAL"
                                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                                  : "bg-blue-600/20 border-blue-500/30 text-blue-400"
                              }`}>
                                {st.accessCode}
                              </span>
                              {st.approvalStatus === "PENDING_APPROVAL" ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400">
                                  ⏳ Waitlist
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleToggleFeeStatus(st)}
                                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition ${
                                    st.feeStatus === "ACTIVE"
                                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                      : "bg-red-500/15 border-red-500/30 text-red-400"
                                  }`}
                                  title="Click to toggle status"
                                >
                                  {st.feeStatus}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Details Row: Course & Batch */}
                          <div className="p-2.5 rounded-lg bg-[#090C16]/80 border border-slate-800/80 text-xs space-y-1.5">
                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400 text-[11px]">Course:</span>
                              <span className="font-semibold text-white">{st.course} ({st.ageGroup})</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" /> Batch:
                              </span>
                              <span className="text-slate-200 text-right truncate max-w-[200px]">{st.batchTime}</span>
                            </div>
                          </div>

                          {/* Touch-Friendly Action Bar */}
                          {st.approvalStatus === "PENDING_APPROVAL" ? (
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/50 text-xs font-medium">
                              <button
                                onClick={() => handleApproveStudent(st)}
                                className="py-2.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition shadow"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Approve Admission</span>
                              </button>
                              <button
                                onClick={() => handleRejectStudent(st)}
                                className="py-2.5 px-2 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/20 flex items-center justify-center gap-1.5 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-700/50 text-xs font-medium">
                              <a
                                href={`https://wa.me/${st.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${st.name}, this is Team Vajra Academy regarding your ${st.course} classes.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="py-2 px-2 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/20 flex items-center justify-center gap-1.5 transition"
                              >
                                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                                <span>WhatsApp</span>
                              </a>

                              <button
                                onClick={() => setEditingStudent({ ...st })}
                                className="py-2 px-2 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/20 flex items-center justify-center gap-1.5 transition"
                              >
                                <Edit2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleDeleteStudent(st.accessCode, st.name)}
                                className="py-2 px-2 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/20 flex items-center justify-center gap-1.5 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* TABLE VIEW (Tablet & Desktop md+: Full tabular overview) */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-medium">
                            <th className="pb-3 px-3">Student Name</th>
                            <th className="pb-3 px-3">Status / ID</th>
                            <th className="pb-3 px-3">Course & Cohort</th>
                            <th className="pb-3 px-3">Batch Time</th>
                            <th className="pb-3 px-3">Fee Status</th>
                            <th className="pb-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredStudents.map((st) => (
                            <tr key={st.accessCode} className="hover:bg-[#141A2E]/50 transition">
                              <td className="py-3 px-3">
                                <strong className="text-white text-sm block">{st.name}</strong>
                                <span className="text-slate-400 text-xs font-mono">{st.phone}</span>
                              </td>

                              <td className="py-3 px-3">
                                {st.approvalStatus === "PENDING_APPROVAL" ? (
                                  <div className="space-y-1">
                                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs">
                                      {st.accessCode}
                                    </span>
                                    <span className="block text-[10px] text-amber-400 font-semibold">
                                      ⏳ Pending Approval
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-mono font-bold text-blue-400 text-xs">
                                    {st.accessCode}
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                <span className="text-white font-medium block">{st.course}</span>
                                <span className="text-slate-400 text-[11px]">{st.ageGroup}</span>
                              </td>

                              <td className="py-3 px-3 text-slate-300">
                                {st.batchTime}
                              </td>

                              <td className="py-3 px-3">
                                {st.approvalStatus === "PENDING_APPROVAL" ? (
                                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Under Review
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleToggleFeeStatus(st)}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                                      st.feeStatus === "ACTIVE"
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/10 border-red-500/20 text-red-400"
                                    }`}
                                    title="Click to toggle status"
                                  >
                                    {st.feeStatus}
                                  </button>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right">
                                {st.approvalStatus === "PENDING_APPROVAL" ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleApproveStudent(st)}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition shadow"
                                      title="Approve & Generate Permanent ID"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Approve</span>
                                    </button>
                                    <button
                                      onClick={() => handleRejectStudent(st)}
                                      className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
                                      title="Reject Admission"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <a
                                      href={`https://wa.me/${st.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${st.name}, this is Team Vajra Academy regarding your ${st.course} classes.`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition"
                                      title="WhatsApp Chat"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                    </a>

                                    <button
                                      onClick={() => setEditingStudent({ ...st })}
                                      className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteStudent(st.accessCode, st.name)}
                                      className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 2: GOOGLE MEET LIVE LINKS (Thumb-Friendly Controls)
             =================================================================== */}
          {adminTab === "meet" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 sm:p-8 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-6">
                
                <div className="pb-4 border-b border-slate-800">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Google Meet Live Class Links
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a course and update its active Google Meet URL. Students enrolled in that course will see this link in their portal.
                  </p>
                </div>

                {/* Course Selector Buttons (Thumb-Friendly Tap Area) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Select Course to Configure:
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {courses.map((crs) => {
                      const isSelected = selectedMeetCourse === crs;
                      return (
                        <button
                          key={crs}
                          type="button"
                          onClick={() => handleSelectMeetCourse(crs)}
                          className={`px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition ${
                            isSelected
                              ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                              : "bg-[#141A2E] border border-slate-700 text-slate-300 hover:text-white"
                          }`}
                        >
                          {crs}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* URL Update Form (Responsive Stack on Mobile) */}
                <form onSubmit={handleSaveCourseMeetLink} className="p-4 sm:p-5 rounded-xl bg-[#090C16] border border-slate-800 space-y-3">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs">
                    <span className="text-slate-300 font-medium">
                      Live Meet URL for <strong className="text-blue-400">{selectedMeetCourse}</strong>:
                    </span>
                    <a
                      href={meetUrlInput}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-medium"
                    >
                      <span>Test Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="url"
                      required
                      value={meetUrlInput}
                      onChange={(e) => setMeetUrlInput(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shrink-0 flex items-center justify-center gap-1.5 shadow"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Link</span>
                    </button>
                  </div>
                </form>

                {/* Summary of all links */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    All Course Links Summary:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {courses.map((crs) => (
                      <div key={crs} className="p-3 rounded-xl bg-[#141A2E] border border-slate-800 flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0 flex-1">
                          <strong className="text-white block truncate">{crs}</strong>
                          <span className="text-[11px] text-slate-400 font-mono truncate block">
                            {allMeetLinks[crs] || "https://meet.google.com/new"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectMeetCourse(crs)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-medium shrink-0"
                        >
                          Configure
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 3: PRACTICE VIDEOS MANAGER
             =================================================================== */}
          {adminTab === "videos" && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="p-4 sm:p-8 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Practice & Training Videos
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Upload YouTube lessons. Paste a YouTube link to auto-fetch its title, thumbnail, and details.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={selectedVideoCourse}
                      onChange={(e) => setSelectedVideoCourse(e.target.value)}
                      className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs focus:outline-none"
                    >
                      <option value="ALL">All Courses</option>
                      <option value="SILAMBAM">Silambam</option>
                      <option value="MARTIAL ARTS">Martial Arts</option>
                      <option value="FITNESS">Fitness</option>
                      <option value="YOGA">Yoga</option>
                    </select>

                    <button
                      onClick={() => setIsAddVideoModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Video</span>
                    </button>
                  </div>
                </div>

                {/* Videos Cards Grid */}
                {videosList.filter(v => selectedVideoCourse === "ALL" || v.course === selectedVideoCourse).length === 0 ? (
                  <div className="p-8 sm:p-12 text-center text-slate-400 space-y-2 rounded-xl bg-[#090C16] border border-slate-800">
                    <Video className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-sm font-medium text-slate-300">No practice videos uploaded yet.</p>
                    <p className="text-xs text-slate-500">
                      Click &quot;Upload Video&quot; above to add YouTube training lessons for your students.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    {videosList
                      .filter(v => selectedVideoCourse === "ALL" || v.course === selectedVideoCourse)
                      .map((vid) => (
                        <div key={vid.id} className="p-4 sm:p-5 rounded-xl bg-[#141A2E] border border-slate-800 flex flex-col justify-between space-y-3">
                          
                          {/* Thumbnail if available */}
                          {vid.thumbnail && (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/60 border border-slate-700">
                              <Image
                                src={vid.thumbnail}
                                alt={vid.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 font-semibold text-[10px]">
                                {vid.course}
                              </span>
                              <span className="text-slate-400 text-xs">{vid.duration}</span>
                            </div>

                            <h4 className="text-sm font-bold text-white line-clamp-2">
                              {vid.title}
                            </h4>

                            <p className="text-xs text-slate-400 line-clamp-2">
                              {vid.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2.5 border-t border-slate-700/60 text-xs">
                            <a
                              href={vid.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-red-400 hover:text-red-300 inline-flex items-center gap-1.5 font-medium py-1"
                            >
                              <Video className="w-3.5 h-3.5 text-red-400" />
                              <span>Watch Lesson</span>
                            </a>

                            <button
                              onClick={() => handleDeleteVideo(vid.course, vid.id, vid.title)}
                              className="p-1.5 text-slate-400 hover:text-red-400 transition rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      ))}
                  </div>
                )}

              </div>

            </div>
          )}

          {/* =========================================================================
              SECTION 4: STUDENT INQUIRIES & MEMBER MESSAGES
             ========================================================================= */}
          {adminTab === "messages" && (
            <div className="space-y-6 animate-fade-in">
              {/* Header & Stats */}
              <div className="p-4 sm:p-6 rounded-2xl bg-[#0D1220] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-sky-400" />
                    <span>Student Messages & Doubt Hotline</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Read inquiries sent by enrolled students and reply directly to their student portals.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                    Total Messages: {messagesList.length}
                  </span>
                </div>
              </div>

              {/* Messages List Feed */}
              {messagesList.length === 0 ? (
                <div className="p-12 rounded-2xl bg-[#0D1220] border border-dashed border-slate-800 text-center space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="font-bold text-white text-base">No Student Messages Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    When students ask doubts from their Student Portal, their questions and details will instantly show here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messagesList.map((msg) => (
                    <div 
                      key={msg.id}
                      className="p-4 sm:p-6 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-4 shadow-xl"
                    >
                      {/* Student Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <strong className="text-white font-bold text-sm">{msg.studentName}</strong>
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold">
                            {msg.studentCode}
                          </span>
                          <span className="text-slate-400 font-medium">({msg.course})</span>
                          <span className="text-slate-400">• Phone: {msg.studentPhone}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            msg.status === "REPLIED" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {msg.status === "REPLIED" ? "✓ Replied" : "● Needs Reply"}
                          </span>

                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition rounded-lg"
                            title="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inquiry Content */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span className="uppercase font-bold tracking-wider text-slate-400">Student Inquiry</span>
                          <span>{msg.createdAt}</span>
                        </div>
                        <p className="text-slate-200 bg-[#141A2E] p-3.5 rounded-xl border border-slate-700/60 leading-relaxed text-xs sm:text-sm break-words">
                          {msg.message}
                        </p>
                      </div>

                      {/* Coach Reply Section */}
                      {msg.reply && (
                        <div className="pl-3 border-l-2 border-emerald-500 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <strong className="text-emerald-400 font-bold">Sent Coach Response</strong>
                            <span className="text-slate-400">{msg.repliedAt}</span>
                          </div>
                          <p className="text-emerald-100 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20 leading-relaxed">
                            {msg.reply}
                          </p>
                        </div>
                      )}

                      {/* Reply Input Form */}
                      <div className="pt-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder={msg.reply ? "Update your reply..." : "Type reply to student..."}
                            value={replyInputs[msg.id] || ""}
                            onChange={(e) => setReplyInputs({ ...replyInputs, [msg.id]: e.target.value })}
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendCoachReply(msg.id)}
                            className="min-h-[40px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow shrink-0"
                          >
                            <span>{msg.reply ? "Update Reply" : "Send Reply"}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          INTELLIGENT YOUTUBE AUTO-FETCH ADD VIDEO MODAL (Responsive Max Height & Scroll)
         ========================================================================= */}
      {isAddVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="w-full max-w-md max-h-[90vh] my-auto bg-[#0D1220] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Upload Training Video</h3>
              </div>
              <button
                onClick={() => setIsAddVideoModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="space-y-3.5 text-xs">
              
              {/* Course Selector */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Course *</label>
                <select
                  value={newVidCourse}
                  onChange={(e) => setNewVidCourse(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:outline-none"
                >
                  <option value="SILAMBAM">Silambam</option>
                  <option value="MARTIAL ARTS">Martial Arts</option>
                  <option value="FITNESS">Fitness</option>
                  <option value="YOGA">Yoga</option>
                </select>
              </div>

              {/* YouTube URL input - Auto Fetch Trigger */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">YouTube URL *</label>
                  {isFetchingYt && (
                    <span className="text-cyan-400 text-[10px] flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Fetching details...</span>
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  required
                  value={newVidUrl}
                  onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Auto-Fetched Live Preview Card (Optimized Responsive Layout) */}
              {ytThumbnail ? (
                <div className="p-3 rounded-xl bg-[#090C16] border border-cyan-500/30 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                    ✓ Auto-Fetched Video Details
                  </span>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative w-full sm:w-28 aspect-video rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-black">
                      <Image
                        src={ytThumbnail}
                        alt="YouTube Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-white text-xs line-clamp-2">
                        {newVidTitle || "YouTube Video"}
                      </h5>
                      <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                        {ytAuthor || "Team Vajra"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Video Title */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  value={newVidTitle}
                  onChange={(e) => setNewVidTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVideoModalOpen(false)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#141A2E] text-slate-300 border border-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow"
                >
                  Save Video to Portal
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          ADD NEW STUDENT MODAL (Responsive Max Height & Safe Scroll)
         ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="w-full max-w-md max-h-[90vh] my-auto bg-[#0D1220] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Register Student</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block text-slate-300 font-medium mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">WhatsApp Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Training Course</label>
                  <select
                    value={newStudentCourse}
                    onChange={(e) => setNewStudentCourse(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="SILAMBAM">Silambam</option>
                    <option value="MARTIAL ARTS">Martial Arts</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="YOGA">Yoga</option>
                    <option value="ALL-ACCESS TRACK">All-Access Track</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Age Group</label>
                  <select
                    value={newStudentAgeGroup}
                    onChange={(e) => setNewStudentAgeGroup(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Junior (5–14 yrs)">Junior (5–14 yrs)</option>
                    <option value="Teens (14–18 yrs)">Teens (14–18 yrs)</option>
                    <option value="Adult (18–45 yrs)">Adult (18–45 yrs)</option>
                    <option value="Senior (45+ yrs)">Senior (45+ yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assigned Batch Timing</label>
                <select
                  value={newStudentBatch}
                  onChange={(e) => setNewStudentBatch(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:outline-none"
                >
                  <option value="Morning (05:30 AM – 07:30 AM)">Morning (05:30 AM – 07:30 AM)</option>
                  <option value="Evening (05:00 PM – 06:30 PM)">Evening (05:00 PM – 06:30 PM)</option>
                  <option value="Night (07:00 PM – 08:30 PM)">Night (07:00 PM – 08:30 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Custom Student ID (Optional)</label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white font-mono uppercase focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#141A2E] text-slate-300 border border-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow"
                >
                  Save Student
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT STUDENT MODAL (Responsive Max Height & Safe Scroll)
         ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="w-full max-w-md max-h-[90vh] my-auto bg-[#0D1220] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Edit Student Profile</h3>
                <span className="text-xs text-blue-400 font-mono font-bold">{editingStudent.accessCode}</span>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block text-slate-300 font-medium mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Course</label>
                  <select
                    value={editingStudent.course}
                    onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="SILAMBAM">Silambam</option>
                    <option value="MARTIAL ARTS">Martial Arts</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="YOGA">Yoga</option>
                    <option value="ALL-ACCESS TRACK">All-Access Track</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#141A2E] text-slate-300 border border-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Custom Brand System Notice Alert Modal */}
      {systemAlert && (
        <VajraAlertModal
          isOpen={true}
          title={systemAlert.title}
          message={systemAlert.message}
          type={systemAlert.type || "warning"}
          onClose={() => setSystemAlert(null)}
        />
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-5 text-center text-slate-400 text-xs bg-[#080B14] mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TEAM VAJRA FITNESS ARTS • ADMIN CONSOLE</span>
          <span>Contact: <strong className="text-slate-300">+91 86681 02797</strong></span>
        </div>
      </footer>

    </div>
  );
}
