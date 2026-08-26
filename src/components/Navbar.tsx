"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { VajraStudent, VajraStudentStore } from "@/lib/store";
import StudentVerificationSplash from "@/components/StudentVerificationSplash";
import { Menu, X, ArrowUpRight, User, KeyRound, LogIn, ChevronRight } from "lucide-react";

interface NavbarProps {
  onOpenBooking: (selectedCourse?: string) => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<VajraStudent | null>(null);
  const [quickLoginOpen, setQuickLoginOpen] = useState(false);
  const [quickName, setQuickName] = useState("");
  const [quickCode, setQuickCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedPayload, setVerifiedPayload] = useState<{ name: string; code: string; course: string } | null>(null);
  const pathname = usePathname();

  const [isAdminRedirect, setIsAdminRedirect] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Sync student session
    const syncStudent = () => {
      setActiveStudent(VajraStudentStore.getStudent());
    };
    syncStudent();

    window.addEventListener("vajra_student_change", syncStudent);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("vajra_student_change", syncStudent);
    };
  }, []);

  const handleQuickLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCode.trim()) {
      alert("Please enter your Student Access Code or Password.");
      return;
    }

    const rawName = quickName.trim().toLowerCase();
    const rawCode = quickCode.trim();

    // Check if Admin Login (username: admin, password: 123 or admin)
    if (
      (rawName === "admin" && (rawCode === "123" || rawCode.toLowerCase() === "admin")) ||
      (rawCode === "123" && (rawName === "admin" || rawName === ""))
    ) {
      VajraStudentStore.setAdminAuthenticated(true);
      setQuickLoginOpen(false);
      setVerifiedPayload({
        name: "Academy Administrator",
        code: "MASTER-ADMIN",
        course: "Admin Master Console"
      });
      setIsAdminRedirect(true);
      setIsVerifying(true);
      return;
    }

    const code = rawCode.toUpperCase();
    const registered = VajraStudentStore.getMemberFromRegistry(code);

    let currentStudent: VajraStudent;
    if (registered) {
      VajraStudentStore.setStudent(registered);
      currentStudent = registered;
    } else {
      currentStudent = VajraStudentStore.createStudentProfile(
        code,
        quickName.trim() || "Member",
        "+91 86681 02797",
        "SILAMBAM",
        "Adult (18–45 yrs)",
        "Morning (05:30 AM – 07:30 AM)"
      );
      VajraStudentStore.setStudent(currentStudent);
    }

    setQuickLoginOpen(false);
    setIsAdminRedirect(false);
    setVerifiedPayload({
      name: currentStudent.name,
      code: currentStudent.accessCode,
      course: currentStudent.course
    });
    setIsVerifying(true);
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Course", href: "/course" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 overflow-x-clip ${
          scrolled
            ? "bg-[#080B11]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/50 py-2 sm:py-2.5"
            : "bg-[#080B11]/85 backdrop-blur-md border-b border-white/[0.04] py-3 sm:py-3.5"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* LEFT: Logo & Brand Name */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0 py-1">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-white/15 bg-black/60 shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
                <Image 
                  src="/vajra-logo.jpg" 
                  alt="Team Vajra Emblem" 
                  fill 
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold tracking-tight text-sm sm:text-base md:text-lg text-white group-hover:text-blue-400 transition-colors leading-none truncate">
                  TEAM VAJRA
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-slate-400 font-semibold uppercase mt-0.5">
                  Fitness Arts
                </span>
              </div>
            </Link>

            {/* RIGHT: Navigation Links & Actions (Desktop / Tablet) */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3.5 shrink-0">
              <nav className="flex items-center gap-0.5 bg-[#0F1424]/80 border border-white/[0.08] rounded-full p-1 backdrop-blur-md">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Logged-In Student vs Member Login Trigger */}
              {activeStudent ? (
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-600/15 border border-blue-500/40 text-blue-300 hover:bg-blue-600/25 transition-all shadow-sm min-h-[38px]"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="font-bold text-white max-w-[100px] truncate">{activeStudent.name}</span>
                  <span className="font-mono text-[11px] text-blue-400 shrink-0">({activeStudent.accessCode})</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setQuickLoginOpen(true)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all min-h-[38px] ${
                    pathname === "/login" || pathname === "/register"
                      ? "text-blue-400 bg-blue-600/15 border border-blue-500/30 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Student Login</span>
                </button>
              )}

              {/* Enroll CTA Button */}
              <Link
                href="/course"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all duration-200 shrink-0 min-h-[38px]"
              >
                <span>Enroll in Course</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Actions: Touch targets >= 44px */}
            <div className="md:hidden flex items-center gap-1 sm:gap-2">
              {activeStudent ? (
                <Link
                  href="/portal"
                  className="min-h-[44px] px-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{activeStudent.accessCode}</span>
                </Link>
              ) : (
                <button
                  onClick={() => setQuickLoginOpen(true)}
                  className="min-h-[44px] min-w-[44px] rounded-xl text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.06] flex items-center justify-center active:scale-95 transition"
                  aria-label="Student Login"
                >
                  <User className="w-4 h-4 text-blue-400" />
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-h-[44px] min-w-[44px] rounded-xl text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center active:scale-95 transition"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0A0E1A]/98 border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl shadow-2xl animate-fade-in">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[44px] flex items-center px-4 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setQuickLoginOpen(true);
              }}
              className="w-full min-h-[44px] flex items-center gap-2.5 px-4 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] text-left border border-white/[0.04]"
            >
              <User className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">
                {activeStudent ? `Portal (${activeStudent.accessCode})` : "Student Login with Code & Name"}
              </span>
            </button>

            <div className="pt-2">
              <Link
                href="/course"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-xs uppercase tracking-wider shadow-md active:scale-[0.99] transition"
              >
                Browse & Register Courses
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          NAVBAR QUICK STUDENT ACCESS LOGIN MODAL
         ========================================================================= */}
      {quickLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0F1424] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 shadow-2xl overflow-hidden ring-1 ring-white/10 max-h-[92vh] overflow-y-auto">
            
            {/* Top Close Button - 44px touch target */}
            <button
              onClick={() => setQuickLoginOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close Login Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4 pr-10">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-blue-500/40 bg-black/80 shadow-md p-1 shrink-0">
                <Image
                  src="/vajra-logo.jpg"
                  alt="Team Vajra Emblem"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">Student Portal Login</h3>
                <span className="text-xs text-slate-400">Enter your Member Name & Access Code</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleQuickLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Member Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5 shrink-0" />
                  <input
                    type="text"
                    required
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Student Access Code *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5 shrink-0" />
                  <input
                    type="text"
                    required
                    value={quickCode}
                    onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl bg-[#13192B] border border-slate-700/70 text-white text-base sm:text-sm font-mono font-bold tracking-wider focus:border-blue-500 focus:outline-none transition uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Verify & Enter Portal</span>
              </button>
            </form>

            {/* Course Redirect if Not Registered */}
            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400 mb-2">
                Haven&apos;t enrolled in a course yet?
              </p>
              <Link
                href="/course"
                onClick={() => setQuickLoginOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition min-h-[36px] py-1 px-2"
              >
                <span>Select a Course & Register Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          UNIQUE & FORMAL VERIFICATION LOADING SPLASH (STUDENT & ADMIN)
         ========================================================================= */}
      {isVerifying && verifiedPayload && (
        <StudentVerificationSplash
          studentName={verifiedPayload.name}
          studentCode={verifiedPayload.code}
          course={verifiedPayload.course}
          onComplete={() => {
            setIsVerifying(false);
            if (isAdminRedirect) {
              router.push("/admin");
            } else {
              router.push("/portal");
            }
          }}
        />
      )}
    </>
  );
}
