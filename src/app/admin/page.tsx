"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { 
  User, KeyRound, LogOut, 
  Search, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, 
  MessageSquare, Radio, Users, Video, ExternalLink, 
  X, Save, Sparkles, Loader2, Clock, Phone, Send,
  ShieldCheck, Eye, EyeOff, Lock, RefreshCw, Copy, Check,
  AlertTriangle, Flame, ArrowRight, ShieldAlert, Zap
} from "lucide-react";

interface DeleteConfirmationState {
  type: "student" | "video" | "message" | "reject_student";
  title: string;
  badge: string;
  name: string;
  detail: string;
  warningText: string;
  confirmLabel: string;
  onConfirm: () => void;
}

export default function AdminPortalPage() {
  const router = useRouter();

  // Custom Brand System Notice State
  const [systemAlert, setSystemAlert] = useState<{ 
    title: string; 
    message: string; 
    type?: "error" | "warning" | "success" | "info" 
  } | null>(null);

  // Custom Executive Deletion / Destruction Dialog State
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmationState | null>(null);

  // Admin Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [cloudSynced, setCloudSynced] = useState(false);

  // Change Password Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState("");
  const [newPassInput, setNewPassInput] = useState("");
  const [confirmPassInput, setConfirmPassInput] = useState("");
  const [changePassError, setChangePassError] = useState("");
  const [showChangePassToggle, setShowChangePassToggle] = useState(false);

  // Navigation Sub-Tabs in Admin
  const [adminTab, setAdminTab] = useState<"students" | "meet" | "videos" | "messages">("students");

  // Dashboard State
  const [students, setStudents] = useState<VajraStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");

  // Messages State & Dedicated Coach Response Console Dialog
  const [messagesList, setMessagesList] = useState<VajraMessage[]>([]);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [activeReplyMessage, setActiveReplyMessage] = useState<VajraMessage | null>(null);
  const [activeReplyText, setActiveReplyText] = useState("");

  // Course-Specific Meet Links State & Quick Updater Dialog
  const [allMeetLinks, setAllMeetLinks] = useState<Record<string, string>>({});
  const [selectedMeetCourse, setSelectedMeetCourse] = useState("SILAMBAM");
  const [meetUrlInput, setMeetUrlInput] = useState("https://meet.google.com/new");
  const [isMeetModalOpen, setIsMeetModalOpen] = useState(false);
  const [copiedLinkCourse, setCopiedLinkCourse] = useState<string | null>(null);

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

  // Add Student Modal State
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

  const loadData = useCallback(() => {
    setStudents(VajraStudentStore.getAllStudents());
    const links = VajraStudentStore.getAllMeetLinks();
    setAllMeetLinks(links);
    setMeetUrlInput(links[selectedMeetCourse] || "https://meet.google.com/new");
    setVideosList(VajraStudentStore.getAllVideos());
    setMessagesList(VajraStudentStore.getAllMessages());
  }, [selectedMeetCourse]);

  // Global Keyboard Listener for Esc to close open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (deleteConfirm) {
          setDeleteConfirm(null);
        } else if (isChangePasswordOpen) {
          setIsChangePasswordOpen(false);
        } else if (activeReplyMessage) {
          setActiveReplyMessage(null);
        } else if (isMeetModalOpen) {
          setIsMeetModalOpen(false);
        } else if (isAddVideoModalOpen) {
          setIsAddVideoModalOpen(false);
        } else if (isAddModalOpen) {
          setIsAddModalOpen(false);
        } else if (editingStudent) {
          setEditingStudent(null);
        } else if (systemAlert) {
          setSystemAlert(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    deleteConfirm,
    isChangePasswordOpen,
    activeReplyMessage,
    isMeetModalOpen,
    isAddVideoModalOpen,
    isAddModalOpen,
    editingStudent,
    systemAlert
  ]);

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
  }, [loadData, selectedMeetCourse]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // =========================================================================
  // AUTHENTICATION HANDLERS
  // =========================================================================
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (VajraStudentStore.verifyAdminCredentials(username, password)) {
      VajraStudentStore.setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setAuthError("");
      loadData();
      showToast("Access Granted: Welcome Master Administrator");
    } else {
      setAuthError("Invalid credentials. Please verify your Administrator Key.");
    }
  };

  const handleAdminLogout = () => {
    VajraStudentStore.setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    showToast("Admin session ended securely");
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStored = VajraStudentStore.getAdminPassword();
    
    if (currentPassInput.trim() !== currentStored && !(currentStored === "123" && currentPassInput.trim().toLowerCase() === "admin")) {
      setChangePassError("Current password does not match system records.");
      return;
    }

    if (!newPassInput.trim() || newPassInput.trim().length < 3) {
      setChangePassError("New password must contain at least 3 characters.");
      return;
    }

    if (newPassInput.trim() !== confirmPassInput.trim()) {
      setChangePassError("New password and confirmation do not match.");
      return;
    }

    VajraStudentStore.setAdminPassword(newPassInput.trim());
    setIsChangePasswordOpen(false);
    setCurrentPassInput("");
    setNewPassInput("");
    setConfirmPassInput("");
    setChangePassError("");
    setSystemAlert({
      title: "Master Key Updated",
      message: "Admin security credentials have been updated. Use your new password on next login.",
      type: "success"
    });
  };

  // =========================================================================
  // STUDENT REGISTRATION & EDIT HANDLERS
  // =========================================================================
  const generateRandomCode = () => {
    const code = `VAJRA-${Math.floor(1000 + Math.random() * 9000)}`;
    setCustomCode(code);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      setSystemAlert({
        title: "Cadet Name Required",
        message: "Please enter the member's full name to generate credentials.",
        type: "warning"
      });
      return;
    }

    const existing = VajraStudentStore.getStudentByPhone(newStudentPhone);
    if (existing) {
      setSystemAlert({
        title: "Student Already Registered",
        message: `Student with phone ${newStudentPhone} is already registered under "${existing.name}" (Access ID: ${existing.accessCode}).`,
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
    showToast(`Cadet ${newStudent.name} (${newStudent.accessCode}) successfully enrolled!`);
  };

  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    VajraStudentStore.updateStudent(editingStudent.accessCode, editingStudent);
    setStudents(VajraStudentStore.getAllStudents());
    setEditingStudent(null);
    showToast(`Student dossier for ${editingStudent.name} synchronized`);
  };

  const handleApproveStudent = (student: VajraStudent) => {
    const approved = VajraStudentStore.approveAdmission(student.requestCode || student.accessCode);
    if (approved) {
      setStudents(VajraStudentStore.getAllStudents());
      showToast(`Approved ${approved.name}! Permanent ID: ${approved.accessCode}`);
    }
  };

  const requestRejectStudent = (student: VajraStudent) => {
    setDeleteConfirm({
      type: "reject_student",
      title: "Reject Admission Request",
      badge: "ADMISSION DECLINE",
      name: student.name,
      detail: `Access Code: ${student.requestCode || student.accessCode} • Course: ${student.course}`,
      warningText: "This will remove the student from the pending admission waitlist.",
      confirmLabel: "Reject Admission",
      onConfirm: () => {
        VajraStudentStore.rejectAdmission(student.requestCode || student.accessCode);
        setStudents(VajraStudentStore.getAllStudents());
        setDeleteConfirm(null);
        showToast(`Admission for ${student.name} rejected`);
      }
    });
  };

  const requestDeleteStudent = (code: string, name: string, course: string) => {
    setDeleteConfirm({
      type: "student",
      title: "De-Register Cadet Record",
      badge: "SECURITY PURGE",
      name: name,
      detail: `Cadet ID: ${code} • Course: ${course}`,
      warningText: "Warning: This action will permanently remove all training records, attendance metrics, assessment logs, and credentials from cloud & local storage.",
      confirmLabel: "Purge Student Record",
      onConfirm: () => {
        VajraStudentStore.deleteStudent(code);
        setStudents(VajraStudentStore.getAllStudents());
        setDeleteConfirm(null);
        showToast(`Student record for ${name} purged`);
      }
    });
  };

  const handleToggleFeeStatus = (student: VajraStudent) => {
    const newStatus = student.feeStatus === "ACTIVE" ? "DUE" : "ACTIVE";
    VajraStudentStore.updateStudent(student.accessCode, { feeStatus: newStatus });
    setStudents(VajraStudentStore.getAllStudents());
    showToast(`Fee status for ${student.name} set to ${newStatus}`);
  };

  // =========================================================================
  // GOOGLE MEET LIVE CLASS DISPATCHER
  // =========================================================================
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
    setIsMeetModalOpen(false);
    showToast(`Google Meet link published for ${selectedMeetCourse}`);
  };

  const copyMeetLink = (crs: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkCourse(crs);
    setTimeout(() => setCopiedLinkCourse(null), 2000);
    showToast(`Copied ${crs} Meet URL to clipboard`);
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
          setNewVidDesc(`Official training masterclass: ${data.title}`);
        } else {
          setNewVidTitle(`${newVidCourse} Master Drill`);
        }
      } catch {
        setNewVidTitle(`${newVidCourse} Master Drill`);
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
        title: "YouTube Link Required",
        message: "Please enter or paste a valid YouTube video URL to publish.",
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
    showToast(`Masterclass video added for ${newVidCourse}`);
  };

  const requestDeleteVideo = (course: string, id: string, title: string) => {
    setDeleteConfirm({
      type: "video",
      title: "Delete Training Video",
      badge: "MEDIA REMOVAL",
      name: title,
      detail: `Course Track: ${course}`,
      warningText: "This video lesson will be removed from all student training portals.",
      confirmLabel: "Delete Video Lesson",
      onConfirm: () => {
        VajraStudentStore.deleteCourseVideo(course, id);
        setVideosList(VajraStudentStore.getAllVideos());
        setDeleteConfirm(null);
        showToast("Video lesson removed from portal");
      }
    });
  };

  // =========================================================================
  // COACH RESPONSE CONSOLE
  // =========================================================================
  const openCoachReplyConsole = (msg: VajraMessage) => {
    setActiveReplyMessage(msg);
    setActiveReplyText(msg.reply || replyInputs[msg.id] || "");
  };

  const handleSendDedicatedCoachReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReplyMessage) return;
    if (!activeReplyText.trim()) {
      setSystemAlert({
        title: "Reply Message Empty",
        message: "Please enter your response before broadcasting to the student portal.",
        type: "warning"
      });
      return;
    }

    VajraStudentStore.replyToMessage(activeReplyMessage.id, activeReplyText.trim());
    setMessagesList(VajraStudentStore.getAllMessages());
    setReplyInputs({ ...replyInputs, [activeReplyMessage.id]: "" });
    setActiveReplyMessage(null);
    showToast("Coach transmission broadcasted to student portal!");
  };

  const handleSendInlineCoachReply = (msgId: string) => {
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

  const requestDeleteMessage = (msg: VajraMessage) => {
    setDeleteConfirm({
      type: "message",
      title: "Purge Student Inquiry",
      badge: "DISPATCH PURGE",
      name: `Inquiry from ${msg.studentName}`,
      detail: `Student Code: ${msg.studentCode} • Phone: ${msg.studentPhone}`,
      warningText: "This will permanently delete this student message thread from the admin inbox.",
      confirmLabel: "Delete Message Thread",
      onConfirm: () => {
        VajraStudentStore.deleteMessage(msg.id);
        setMessagesList(VajraStudentStore.getAllMessages());
        setDeleteConfirm(null);
        showToast("Message purged from inbox");
      }
    });
  };

  const courses = ["SILAMBAM", "MARTIAL ARTS", "FITNESS", "YOGA", "ALL-ACCESS TRACK", "GENERAL"];

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

  /* =========================================================================
      ADMIN LOGIN SCREEN (Obsidian Command-Center Grade with Golden Glow)
     ========================================================================= */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05070E] text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 selection:bg-amber-500 selection:text-black font-sans relative overflow-hidden">
        
        {/* Ambient Radial Glow & Background Cyber Grid */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-blue-600/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#0B0F19]/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-amber-950/20 space-y-6 animate-scale-up">
          
          {/* Top Gold & Cyan Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-cyan-400 rounded-t-3xl" />

          {/* Header Brand */}
          <div className="text-center space-y-3 pt-2">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-black/80 p-1 mx-auto shadow-lg shadow-amber-500/10">
              <Image
                src="/vajra-logo.jpg"
                alt="Team Vajra Emblem"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold tracking-widest uppercase mb-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Command Center v2.6</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Team Vajra Admin Terminal
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed mt-1">
                Executive authentication portal for academy roster, live feeds, and training archives.
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-start gap-2.5 animate-shake shadow-inner">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block font-semibold text-red-200">Authentication Failed</strong>
                <span>{authError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                Master Administrator ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#121727] border border-slate-700/80 text-white text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 focus:outline-none transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                  Passcode / Master Key
                </label>
                <span className="text-[10px] font-mono text-amber-400/80">Default: 123</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#121727] border border-slate-700/80 text-white text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 focus:outline-none transition shadow-inner font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200 transition"
                  aria-label="Toggle password view"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition shadow-lg shadow-amber-500/25 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>Unlock Admin Terminal</span>
            </button>
          </form>

          {/* Helper Security Card */}
          <div className="p-3 rounded-xl bg-[#080B14] border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Encrypted Session Storage</span>
            </span>
            <span className="font-mono text-cyan-400">256-BIT</span>
          </div>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 font-medium transition py-1"
            >
              <span>← Return to Public Website</span>
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
    <div className="min-h-screen bg-[#080B14] text-slate-200 selection:bg-amber-500 selection:text-black flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 z-50 px-4 py-3 rounded-2xl bg-[#0D1220] border border-amber-500/40 text-slate-100 text-xs font-semibold shadow-2xl shadow-amber-950/40 flex items-center justify-center sm:justify-start gap-2.5 animate-fade-in ring-1 ring-white/10">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* TOPBAR */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0E1A]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-amber-500/30 bg-black/80 p-0.5 shrink-0 shadow-md">
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
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0 uppercase tracking-wider">
                    Executive
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 truncate block">
                  Master Command Terminal
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-[#0F1424] border border-slate-800 rounded-2xl p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setAdminTab("students")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  adminTab === "students"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Students ({students.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("meet")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  adminTab === "meet"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Google Meet</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("videos")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  adminTab === "videos"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Videos ({videosList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("messages")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition relative ${
                  adminTab === "messages"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
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

            {/* Quick Actions & Security */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-amber-400 text-xs font-semibold border border-amber-500/20 transition shadow-sm"
                title="Change Admin Password"
              >
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">Security Key</span>
              </button>

              <Link
                href="/portal"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 text-xs font-medium border border-slate-700 transition"
              >
                <span className="hidden xs:inline">Student Portal</span>
                <span className="xs:hidden">Portal</span>
                <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
              </Link>

              <button
                onClick={handleAdminLogout}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#141A2E] hover:bg-red-950/40 text-slate-300 hover:text-red-300 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Exit</span>
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
                  ? "bg-amber-500 text-slate-950 shadow-sm" 
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
                  ? "bg-amber-500 text-slate-950 shadow-sm" 
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
                  ? "bg-amber-500 text-slate-950 shadow-sm" 
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
                  ? "bg-amber-500 text-slate-950 shadow-sm" 
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
              
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Total Registered</span>
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{students.length}</div>
                  <span className="text-[11px] text-slate-400 block">Cadet Dossiers Enrolled</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Pass Status</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">{totalActiveFees}</div>
                  <span className="text-[11px] text-slate-400 block">{totalDueFees} Pending Renewals</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Disciplines Active</span>
                    <Radio className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">4 Disciplines</div>
                  <span className="text-[11px] text-slate-400 block truncate">Silambam, Martial Arts, Fitness, Yoga</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1220] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Video Drills</span>
                    <Video className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">{videosList.length}</div>
                  <span className="text-[11px] text-slate-400 block">Masterclass Lessons</span>
                </div>
              </div>

              {/* Students Directory Container */}
              <div className="rounded-3xl bg-[#0D1220] border border-slate-800 p-4 sm:p-6 space-y-5 shadow-xl">
                
                {/* Search & Filter Header */}
                <div className="flex flex-col gap-3 pb-4 border-b border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <span>Cadet Roster & Member Registry</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Manage admissions, access IDs, fee passes, and class cohorts in real-time.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-500/20 active:scale-95 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Onboard New Cadet</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Search student by name, phone, or VAJRA-ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none transition"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs focus:outline-none"
                      >
                        <option value="ALL">All Disciplines</option>
                        <option value="SILAMBAM">Silambam</option>
                        <option value="MARTIAL ARTS">Martial Arts</option>
                        <option value="FITNESS">Fitness</option>
                        <option value="YOGA">Yoga</option>
                      </select>
                    </div>
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="p-8 sm:p-12 text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-sm font-medium text-slate-300">No cadet records matched your search.</p>
                    <p className="text-xs text-slate-500">
                      Try searching with another keyword or click &quot;Onboard New Cadet&quot; above.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* MOBILE CARDS VIEW (< md viewports) */}
                    <div className="block md:hidden space-y-3">
                      {filteredStudents.map((st) => (
                        <div
                          key={st.accessCode}
                          className="p-4 rounded-2xl bg-[#141A2E] border border-slate-800 space-y-3 shadow-md"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-sm truncate">{st.name}</h4>
                              <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                                <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                                <span className="font-mono">{st.phone}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className={`px-2.5 py-0.5 rounded-lg border font-mono font-bold text-[11px] ${
                                st.approvalStatus === "PENDING_APPROVAL"
                                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                                  : "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
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
                                  title="Click to toggle fee pass"
                                >
                                  {st.feeStatus}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#090C16]/80 border border-slate-800/80 text-xs space-y-1.5">
                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400 text-[11px]">Track:</span>
                              <span className="font-semibold text-white">{st.course} ({st.ageGroup})</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" /> Batch:
                              </span>
                              <span className="text-slate-200 text-right truncate max-w-[200px]">{st.batchTime}</span>
                            </div>
                          </div>

                          {st.approvalStatus === "PENDING_APPROVAL" ? (
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/50 text-xs font-medium">
                              <button
                                onClick={() => handleApproveStudent(st)}
                                className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition shadow"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => requestRejectStudent(st)}
                                className="py-2.5 px-2 rounded-xl bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/20 flex items-center justify-center gap-1.5 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-700/50 text-xs font-medium">
                              <a
                                href={`https://wa.me/${st.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${st.name}, this is Team Vajra Academy regarding your ${st.course} training.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="py-2 px-2 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/20 flex items-center justify-center gap-1.5 transition"
                              >
                                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                                <span>WhatsApp</span>
                              </a>

                              <button
                                onClick={() => setEditingStudent({ ...st })}
                                className="py-2 px-2 rounded-xl bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/20 flex items-center justify-center gap-1.5 transition"
                              >
                                <Edit2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => requestDeleteStudent(st.accessCode, st.name, st.course)}
                                className="py-2 px-2 rounded-xl bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/20 flex items-center justify-center gap-1.5 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Purge</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* TABLE VIEW (Tablet & Desktop md+) */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                            <th className="pb-3 px-3 uppercase tracking-wider text-[10px]">Cadet Dossier</th>
                            <th className="pb-3 px-3 uppercase tracking-wider text-[10px]">Status / ID</th>
                            <th className="pb-3 px-3 uppercase tracking-wider text-[10px]">Track & Cohort</th>
                            <th className="pb-3 px-3 uppercase tracking-wider text-[10px]">Batch Time</th>
                            <th className="pb-3 px-3 uppercase tracking-wider text-[10px]">Fee Pass</th>
                            <th className="pb-3 px-3 text-right uppercase tracking-wider text-[10px]">Controls</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredStudents.map((st) => (
                            <tr key={st.accessCode} className="hover:bg-[#141A2E]/50 transition">
                              <td className="py-3.5 px-3">
                                <strong className="text-white text-sm block">{st.name}</strong>
                                <span className="text-slate-400 text-xs font-mono">{st.phone}</span>
                              </td>

                              <td className="py-3.5 px-3">
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
                                  <span className="font-mono font-bold text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                                    {st.accessCode}
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-3">
                                <span className="text-white font-medium block">{st.course}</span>
                                <span className="text-slate-400 text-[11px]">{st.ageGroup}</span>
                              </td>

                              <td className="py-3.5 px-3 text-slate-300">
                                {st.batchTime}
                              </td>

                              <td className="py-3.5 px-3">
                                {st.approvalStatus === "PENDING_APPROVAL" ? (
                                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Under Review
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleToggleFeeStatus(st)}
                                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                                      st.feeStatus === "ACTIVE"
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/10 border-red-500/20 text-red-400"
                                    }`}
                                    title="Click to toggle fee pass"
                                  >
                                    {st.feeStatus}
                                  </button>
                                )}
                              </td>

                              <td className="py-3.5 px-3 text-right">
                                {st.approvalStatus === "PENDING_APPROVAL" ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleApproveStudent(st)}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition shadow"
                                      title="Approve & Generate Permanent ID"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Approve</span>
                                    </button>
                                    <button
                                      onClick={() => requestRejectStudent(st)}
                                      className="p-1.5 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 transition border border-red-500/20"
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
                                      className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition border border-emerald-500/20"
                                      title="WhatsApp Direct Message"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                    </a>

                                    <button
                                      onClick={() => setEditingStudent({ ...st })}
                                      className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 transition border border-cyan-500/20"
                                      title="Edit Student Record"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={() => requestDeleteStudent(st.accessCode, st.name, st.course)}
                                      className="p-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 transition border border-red-500/20"
                                      title="Purge Cadet Dossier"
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
              TAB 2: GOOGLE MEET LIVE LINKS
             =================================================================== */}
          {adminTab === "meet" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 sm:p-8 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-6 shadow-xl">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Radio className="w-5 h-5 text-amber-400" />
                      <span>Live Google Meet Dispatcher</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure active Google Meet links per discipline. Enrolled cadets see their course stream link immediately in their portal.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsMeetModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-500/20 shrink-0"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Open Link Editor</span>
                  </button>
                </div>

                {/* Course Selector Buttons */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Select Discipline to Configure:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {courses.map((crs) => {
                      const isSelected = selectedMeetCourse === crs;
                      return (
                        <button
                          key={crs}
                          type="button"
                          onClick={() => handleSelectMeetCourse(crs)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                              : "bg-[#141A2E] border border-slate-700 text-slate-300 hover:text-white"
                          }`}
                        >
                          {crs}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Inline URL Update Box */}
                <form onSubmit={handleSaveCourseMeetLink} className="p-4 sm:p-6 rounded-2xl bg-[#090C16] border border-amber-500/20 space-y-3">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs">
                    <span className="text-slate-300 font-medium">
                      Active Stream URL for <strong className="text-amber-400 font-bold">{selectedMeetCourse}</strong>:
                    </span>
                    <a
                      href={meetUrlInput}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-medium"
                    >
                      <span>Test Open in Google Meet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="url"
                      required
                      value={meetUrlInput}
                      onChange={(e) => setMeetUrlInput(e.target.value)}
                      placeholder="https://meet.google.com/xyz-abcd-efg"
                      className="flex-1 px-4 py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save & Publish</span>
                    </button>
                  </div>
                </form>

                {/* Summary of all links */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    All Discipline Feeds Overview:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {courses.map((crs) => (
                      <div key={crs} className="p-3.5 rounded-2xl bg-[#141A2E] border border-slate-800 flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0 flex-1">
                          <strong className="text-white block font-bold">{crs}</strong>
                          <span className="text-[11px] text-slate-400 font-mono truncate block mt-0.5">
                            {allMeetLinks[crs] || "https://meet.google.com/new"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => copyMeetLink(crs, allMeetLinks[crs] || "https://meet.google.com/new")}
                            className="p-2 rounded-xl bg-[#0B0F19] text-slate-300 hover:text-amber-400 border border-slate-700"
                            title="Copy URL"
                          >
                            {copiedLinkCourse === crs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectMeetCourse(crs);
                              setIsMeetModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-semibold"
                          >
                            Configure
                          </button>
                        </div>
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
              <div className="p-4 sm:p-8 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-6 shadow-xl">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Video className="w-5 h-5 text-cyan-400" />
                      <span>Masterclass & Training Archive</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Publish YouTube training masterclasses with auto-metadata scraping and belt level tagging.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={selectedVideoCourse}
                      onChange={(e) => setSelectedVideoCourse(e.target.value)}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs focus:outline-none"
                    >
                      <option value="ALL">All Disciplines</option>
                      <option value="SILAMBAM">Silambam</option>
                      <option value="MARTIAL ARTS">Martial Arts</option>
                      <option value="FITNESS">Fitness</option>
                      <option value="YOGA">Yoga</option>
                    </select>

                    <button
                      onClick={() => setIsAddVideoModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-cyan-500/20 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Masterclass</span>
                    </button>
                  </div>
                </div>

                {/* Videos Cards Grid */}
                {videosList.filter(v => selectedVideoCourse === "ALL" || v.course === selectedVideoCourse).length === 0 ? (
                  <div className="p-8 sm:p-12 text-center text-slate-400 space-y-2 rounded-2xl bg-[#090C16] border border-slate-800">
                    <Video className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-sm font-medium text-slate-300">No practice masterclasses published yet.</p>
                    <p className="text-xs text-slate-500">
                      Click &quot;Upload Masterclass&quot; above to add training drills for your cadets.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videosList
                      .filter(v => selectedVideoCourse === "ALL" || v.course === selectedVideoCourse)
                      .map((vid) => (
                        <div key={vid.id} className="p-4 sm:p-5 rounded-2xl bg-[#141A2E] border border-slate-800 flex flex-col justify-between space-y-3.5 shadow-md">
                          
                          {vid.thumbnail && (
                            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/80 border border-slate-700">
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
                              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-semibold text-[10px] border border-cyan-500/20">
                                {vid.course}
                              </span>
                              <span className="text-slate-400 text-xs font-mono">{vid.duration}</span>
                            </div>

                            <h4 className="text-sm font-bold text-white line-clamp-2">
                              {vid.title}
                            </h4>

                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {vid.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2.5 border-t border-slate-700/60 text-xs">
                            <a
                              href={vid.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-red-400 hover:text-red-300 inline-flex items-center gap-1.5 font-semibold py-1"
                            >
                              <Video className="w-3.5 h-3.5 text-red-400" />
                              <span>Watch Drill</span>
                            </a>

                            <button
                              onClick={() => requestDeleteVideo(vid.course, vid.id, vid.title)}
                              className="p-1.5 text-slate-400 hover:text-red-400 transition rounded-lg"
                              title="Delete Video Lesson"
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
              <div className="p-4 sm:p-6 rounded-3xl bg-[#0D1220] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span>Cadet Direct Inquiries & Doubt Hotline</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Read inquiries sent from student portals and broadcast coach responses with 1-click presets.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                    Total Inquiries: {messagesList.length}
                  </span>
                </div>
              </div>

              {messagesList.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#0D1220] border border-dashed border-slate-800 text-center space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="font-bold text-white text-base">No Cadet Inquiries Pending</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    When cadets ask doubts from their Student Portal, their messages and identity tags will instantly appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messagesList.map((msg) => (
                    <div 
                      key={msg.id}
                      className="p-4 sm:p-6 rounded-3xl bg-[#0D1220] border border-slate-800 space-y-4 shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <strong className="text-white font-bold text-sm">{msg.studentName}</strong>
                          <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold">
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
                            onClick={() => openCoachReplyConsole(msg)}
                            className="px-3 py-1 rounded-xl bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-semibold"
                          >
                            Console Reply
                          </button>

                          <button
                            onClick={() => requestDeleteMessage(msg)}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition rounded-lg"
                            title="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span className="uppercase font-bold tracking-wider text-slate-400">Cadet Inquiry</span>
                          <span>{msg.createdAt}</span>
                        </div>
                        <p className="text-slate-200 bg-[#141A2E] p-3.5 rounded-2xl border border-slate-700/60 leading-relaxed text-xs sm:text-sm break-words">
                          {msg.message}
                        </p>
                      </div>

                      {msg.reply && (
                        <div className="pl-3 border-l-2 border-emerald-500 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <strong className="text-emerald-400 font-bold">Transmitted Coach Response</strong>
                            <span className="text-slate-400">{msg.repliedAt}</span>
                          </div>
                          <p className="text-emerald-100 bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-500/20 leading-relaxed">
                            {msg.reply}
                          </p>
                        </div>
                      )}

                      {/* Quick Inline Reply Bar */}
                      <div className="pt-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder={msg.reply ? "Update coach response..." : "Quick type reply to cadet..."}
                            value={replyInputs[msg.id] || ""}
                            onChange={(e) => setReplyInputs({ ...replyInputs, [msg.id]: e.target.value })}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendInlineCoachReply(msg.id)}
                            className="min-h-[40px] px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 shrink-0"
                          >
                            <span>{msg.reply ? "Update" : "Send Response"}</span>
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
          DIALOG 1: EXECUTIVE ADD NEW STUDENT ONBOARDING MODAL
         ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg max-h-[92vh] my-auto bg-gradient-to-b from-[#101726] to-[#0A0E1A] border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-950/40 space-y-5 overflow-y-auto">
            
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-cyan-400 rounded-t-3xl" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Cadet Onboarding Roster</h3>
                  <span className="text-[11px] text-slate-400">Enroll new student & generate permanent ID credentials</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Cadet Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Adithya Kumar"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  WhatsApp Contact Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 sm:top-3.5 text-slate-400 font-mono text-xs">+91</span>
                  <input
                    type="tel"
                    required
                    placeholder="86681 02797"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                    Training Track
                  </label>
                  <select
                    value={newStudentCourse}
                    onChange={(e) => setNewStudentCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:border-amber-400 focus:outline-none text-xs"
                  >
                    <option value="SILAMBAM">Silambam</option>
                    <option value="MARTIAL ARTS">Martial Arts</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="YOGA">Yoga</option>
                    <option value="ALL-ACCESS TRACK">All-Access Track</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                    Age Cohort
                  </label>
                  <select
                    value={newStudentAgeGroup}
                    onChange={(e) => setNewStudentAgeGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:border-amber-400 focus:outline-none text-xs"
                  >
                    <option value="Junior (5–14 yrs)">Junior (5–14 yrs)</option>
                    <option value="Teens (14–18 yrs)">Teens (14–18 yrs)</option>
                    <option value="Adult (18–45 yrs)">Adult (18–45 yrs)</option>
                    <option value="Senior (45+ yrs)">Senior (45+ yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Assigned Batch Schedule
                </label>
                <select
                  value={newStudentBatch}
                  onChange={(e) => setNewStudentBatch(e.target.value)}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:border-amber-400 focus:outline-none text-xs"
                >
                  <option value="Morning (05:30 AM – 07:30 AM)">Morning (05:30 AM – 07:30 AM)</option>
                  <option value="Evening (05:00 PM – 06:30 PM)">Evening (05:00 PM – 06:30 PM)</option>
                  <option value="Night (07:00 PM – 08:30 PM)">Night (07:00 PM – 08:30 PM)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                    Permanent Cadet ID / Access Code
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-amber-400 hover:text-amber-300 text-[10px] font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Auto-generated (e.g. VAJRA-8291)"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-amber-400 font-mono font-bold uppercase focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/25 active:scale-95"
                >
                  Confirm & Register Cadet
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          DIALOG 2: EDIT STUDENT RECORD MODAL & FORM
         ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg max-h-[92vh] my-auto bg-gradient-to-b from-[#101726] to-[#0A0E1A] border border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-cyan-950/40 space-y-5 overflow-y-auto">
            
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-400 to-amber-400 rounded-t-3xl" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Modify Cadet Record</h3>
                  <span className="text-[11px] text-cyan-400 font-mono font-bold">{editingStudent.accessCode}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                    Training Track
                  </label>
                  <select
                    value={editingStudent.course}
                    onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none text-xs"
                  >
                    <option value="SILAMBAM">Silambam</option>
                    <option value="MARTIAL ARTS">Martial Arts</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="YOGA">Yoga</option>
                    <option value="ALL-ACCESS TRACK">All-Access Track</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                    Age Cohort
                  </label>
                  <select
                    value={editingStudent.ageGroup}
                    onChange={(e) => setEditingStudent({ ...editingStudent, ageGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none text-xs"
                  >
                    <option value="Junior (5–14 yrs)">Junior (5–14 yrs)</option>
                    <option value="Teens (14–18 yrs)">Teens (14–18 yrs)</option>
                    <option value="Adult (18–45 yrs)">Adult (18–45 yrs)</option>
                    <option value="Senior (45+ yrs)">Senior (45+ yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                    Monthly Pass Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingStudent({ ...editingStudent, feeStatus: "ACTIVE" })}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition border ${
                        editingStudent.feeStatus === "ACTIVE"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow"
                          : "bg-[#141A2E] border-slate-700 text-slate-400"
                      }`}
                    >
                      ✓ Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStudent({ ...editingStudent, feeStatus: "DUE" })}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition border ${
                        editingStudent.feeStatus === "DUE"
                          ? "bg-red-500/20 border-red-500 text-red-400 shadow"
                          : "bg-[#141A2E] border-slate-700 text-slate-400"
                      }`}
                    >
                      ! Due
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Assigned Batch Timing
                </label>
                <select
                  value={editingStudent.batchTime}
                  onChange={(e) => setEditingStudent({ ...editingStudent, batchTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none text-xs"
                >
                  <option value="Morning (05:30 AM – 07:30 AM)">Morning (05:30 AM – 07:30 AM)</option>
                  <option value="Evening (05:00 PM – 06:30 PM)">Evening (05:00 PM – 06:30 PM)</option>
                  <option value="Night (07:00 PM – 08:30 PM)">Night (07:00 PM – 08:30 PM)</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  Save Dossier Updates
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          DIALOG 3: INTELLIGENT MASTERCLASS PRACTICE VIDEO MODAL
         ========================================================================= */}
      {isAddVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg max-h-[92vh] my-auto bg-gradient-to-b from-[#101726] to-[#0A0E1A] border border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-cyan-950/40 space-y-4 overflow-y-auto">
            
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 rounded-t-3xl" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Upload Training Masterclass</h3>
                  <span className="text-[11px] text-slate-400">Auto-fetch YouTube metadata & sync to student portals</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddVideoModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Target Discipline *
                </label>
                <select
                  value={newVidCourse}
                  onChange={(e) => setNewVidCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none text-xs"
                >
                  <option value="SILAMBAM">Silambam</option>
                  <option value="MARTIAL ARTS">Martial Arts</option>
                  <option value="FITNESS">Fitness</option>
                  <option value="YOGA">Yoga</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                    YouTube Video URL *
                  </label>
                  {isFetchingYt && (
                    <span className="text-cyan-400 text-[10px] flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Scraping YouTube...</span>
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newVidUrl}
                  onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition"
                />
              </div>

              {/* Auto-Fetched Live Preview Card */}
              {ytThumbnail ? (
                <div className="p-3.5 rounded-2xl bg-[#090C16] border border-cyan-500/30 space-y-2.5 shadow-inner">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                    ✓ Verified YouTube Stream
                  </span>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative w-full sm:w-28 aspect-video rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-black">
                      <Image
                        src={ytThumbnail}
                        alt="YouTube Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-white text-xs line-clamp-2">
                        {newVidTitle || "YouTube Video Drill"}
                      </h5>
                      <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                        {ytAuthor || "Team Vajra Martial Arts"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Lesson Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Spin & Footwork Combinations"
                  value={newVidTitle}
                  onChange={(e) => setNewVidTitle(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newVidDuration}
                    onChange={(e) => setNewVidDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                    Belt Level / Stage
                  </label>
                  <input
                    type="text"
                    value={newVidLevel}
                    onChange={(e) => setNewVidLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A2E] border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVideoModalOpen(false)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  Publish Video to Cadet Portal
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          DIALOG 4: DEDICATED COACH RESPONSE CONSOLE MODAL
         ========================================================================= */}
      {activeReplyMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg max-h-[92vh] my-auto bg-gradient-to-b from-[#101726] to-[#0A0E1A] border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-950/40 space-y-5 overflow-y-auto">
            
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-cyan-400 rounded-t-3xl" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Coach Transmission Console</h3>
                  <span className="text-[11px] text-slate-400">Respond directly to cadet in-app portal</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveReplyMessage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cadet Inquiry Card */}
            <div className="p-4 rounded-2xl bg-[#090C16] border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <strong className="text-white font-bold text-sm">{activeReplyMessage.studentName}</strong>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px]">
                    {activeReplyMessage.studentCode}
                  </span>
                </div>
                <span className="text-slate-400 text-[11px]">{activeReplyMessage.createdAt}</span>
              </div>
              <p className="text-slate-300 leading-relaxed break-words bg-[#141A2E] p-3 rounded-xl border border-slate-700/60">
                &quot;{activeReplyMessage.message}&quot;
              </p>
            </div>

            {/* Quick Response Presets */}
            <div>
              <label className="block text-slate-400 font-semibold mb-2 uppercase tracking-wider text-[10px]">
                Quick Coach Presets:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "🥋 Check drill #3 in your video masterclass tab.",
                  "✅ Class schedule confirmed. Join the live Google Meet.",
                  "💳 Fee verified and updated in your active pass.",
                  "🔥 Master Anand will review your form in today's class."
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveReplyText(preset)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#141A2E] hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/80 text-[11px] transition text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendDedicatedCoachReply} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Coach Response Text *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your official coach message to the cadet..."
                  value={activeReplyText}
                  onChange={(e) => setActiveReplyText(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#141A2E] border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none transition leading-relaxed"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveReplyMessage(null)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>

                <a
                  href={`https://wa.me/${activeReplyMessage.studentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${activeReplyMessage.studentName}, regarding your question: ${activeReplyText || activeReplyMessage.message}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </a>

                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/25 active:scale-95"
                >
                  Broadcast to Portal
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          DIALOG 5: CHANGE ADMIN PASSWORD & SECURITY KEY MODAL
         ========================================================================= */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-md my-auto bg-gradient-to-b from-[#101726] to-[#0A0E1A] border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-950/40 space-y-4">
            
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-cyan-400 rounded-t-3xl" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Security Master Key</h3>
                  <span className="text-[11px] text-slate-400">Update Administrator terminal passcode</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {changePassError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{changePassError}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Current Admin Password
                </label>
                <input
                  type={showChangePassToggle ? "text" : "password"}
                  required
                  placeholder="Enter existing password"
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white font-mono text-sm focus:border-amber-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  New Admin Password
                </label>
                <input
                  type={showChangePassToggle ? "text" : "password"}
                  required
                  placeholder="Minimum 3 characters"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white font-mono text-sm focus:border-amber-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Confirm New Password
                </label>
                <input
                  type={showChangePassToggle ? "text" : "password"}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white font-mono text-sm focus:border-amber-400 focus:outline-none transition"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => setShowChangePassToggle(!showChangePassToggle)}
                  className="text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition"
                >
                  {showChangePassToggle ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showChangePassToggle ? "Hide Passwords" : "Show Passwords"}</span>
                </button>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/25 active:scale-95"
                >
                  Update Master Key
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          DIALOG 6: QUICK GOOGLE MEET DISPATCHER MODAL
         ========================================================================= */}
      {isMeetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg my-auto bg-gradient-to-b from-[#101726] to-[#0A0E1A] border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-950/40 space-y-5">
            
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-cyan-400 rounded-t-3xl" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Google Meet Dispatcher</h3>
                  <span className="text-[11px] text-slate-400">Publish active video stream for {selectedMeetCourse}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMeetModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                Select Discipline
              </label>
              <div className="flex flex-wrap gap-2">
                {courses.map((crs) => (
                  <button
                    key={crs}
                    type="button"
                    onClick={() => handleSelectMeetCourse(crs)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedMeetCourse === crs
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "bg-[#141A2E] text-slate-300 border border-slate-700"
                    }`}
                  >
                    {crs}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveCourseMeetLink} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
                  Google Meet Link URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/xyz-abcd-efg"
                  value={meetUrlInput}
                  onChange={(e) => setMeetUrlInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#141A2E] border border-slate-700 text-white font-mono text-xs focus:border-amber-400 focus:outline-none transition"
                />
              </div>

              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#090C16] border border-slate-800">
                <span className="text-slate-400">Need a instant Google Meet link?</span>
                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Create on Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMeetModalOpen(false)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/25 active:scale-95"
                >
                  Publish Live Stream Link
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          DIALOG 7: EXECUTIVE DELETION & DESTRUCTION CONFIRMATION MODAL
         ========================================================================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#180F16] via-[#100D15] to-[#07050A] border border-red-500/40 p-6 sm:p-7 shadow-2xl shadow-red-950/60 ring-1 ring-red-500/20 text-center space-y-4 animate-scale-up"
            role="alertdialog"
          >
            {/* Top Danger Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-t-3xl" />

            <div className="flex flex-col items-center gap-2.5 pt-1">
              <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 shadow-lg shadow-red-950/50">
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 font-bold px-2.5 py-0.5 rounded-full bg-red-950/50 border border-red-500/30">
                {deleteConfirm.badge}
              </span>
            </div>

            <div className="space-y-1.5 px-2">
              <h4 className="text-lg font-bold text-white tracking-tight">
                {deleteConfirm.title}
              </h4>
              <p className="text-sm font-semibold text-red-200">
                {deleteConfirm.name}
              </p>
              {deleteConfirm.detail && (
                <span className="text-xs text-slate-400 block font-mono">
                  {deleteConfirm.detail}
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 text-xs text-red-300 leading-relaxed text-left">
              {deleteConfirm.warningText}
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-bold text-xs transition"
              >
                Cancel / Retain
              </button>
              <button
                type="button"
                onClick={deleteConfirm.onConfirm}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleteConfirm.confirmLabel}</span>
              </button>
            </div>

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
          <span className="flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>TEAM VAJRA FITNESS ARTS • MASTER ADMIN CONSOLE</span>
          </span>
          <span>Cadet Hotline: <strong className="text-slate-300">+91 86681 02797</strong></span>
        </div>
      </footer>

    </div>
  );
}
