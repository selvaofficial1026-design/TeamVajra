"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Info, X, ShieldAlert, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

export interface VajraAlertProps {
  isOpen: boolean;
  type?: "error" | "warning" | "success" | "info" | "confirm";
  title: string;
  message: string | React.ReactNode;
  onClose: () => void;
  actionText?: string;
  onAction?: () => void;
  cancelText?: string;
  confirmVariant?: "danger" | "primary" | "warning" | "success";
  badgeText?: string;
}

export default function VajraAlertModal({
  isOpen,
  type = "error",
  title,
  message,
  onClose,
  actionText,
  onAction,
  cancelText = "Cancel",
  confirmVariant = "primary",
  badgeText,
}: VajraAlertProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isError = type === "error";
  const isWarning = type === "warning";
  const isSuccess = type === "success";
  const isConfirm = type === "confirm";
  const isInfo = type === "info";

  // Accent gradient border
  const getRibbonGradient = () => {
    if (isSuccess) return "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600";
    if (isWarning) return "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600";
    if (isError) return "bg-gradient-to-r from-rose-600 via-red-500 to-amber-600";
    if (isConfirm) return "bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500";
    return "bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600";
  };

  const getStatusIcon = () => {
    if (isSuccess) return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    if (isWarning) return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    if (isError) return <ShieldAlert className="w-5 h-5 text-rose-400" />;
    if (isConfirm) return <HelpCircle className="w-5 h-5 text-sky-400" />;
    return <Info className="w-5 h-5 text-blue-400" />;
  };

  const getBadgeDefaultText = () => {
    if (badgeText) return badgeText;
    if (isSuccess) return "OPERATION SUCCESSFUL";
    if (isWarning) return "ATTENTION REQUIRED";
    if (isError) return "ACTION FAILED";
    if (isConfirm) return "CONFIRMATION REQUESTED";
    return "SYSTEM NOTICE";
  };

  const getBadgeColors = () => {
    if (isSuccess) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (isWarning) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    if (isError) return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    if (isConfirm) return "bg-sky-500/10 text-sky-400 border-sky-500/30";
    return "bg-blue-500/10 text-blue-400 border-blue-500/30";
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-gradient-to-b from-[#101728] via-[#0B0F1A] to-[#05070E] border border-blue-500/30 p-5 sm:p-7 shadow-2xl shadow-blue-950/70 ring-1 ring-white/10 overflow-hidden text-center space-y-4 sm:space-y-5 animate-scale-up"
        role="alertdialog"
        aria-modal="true"
      >
        {/* Top Metallic Foil Accent Ribbon */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${getRibbonGradient()}`} />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition active:scale-95"
          aria-label="Close Dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Martial Arts Academy Emblem & Status Icon Frame */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <div className="relative">
            {/* Outer Gold/Sky-Blue Foil Halo */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/40 via-sky-400/40 to-blue-600/40 blur-sm" />
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-[#060810] p-1.5 shadow-xl flex items-center justify-center">
              <Image
                src="/vajra-logo.jpg"
                alt="Team Vajra Emblem"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-[#0B0F1A] border border-slate-700 shadow-md">
              {getStatusIcon()}
            </div>
          </div>

          {/* System Badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-[0.15em] uppercase border ${getBadgeColors()} mt-1`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>{getBadgeDefaultText()}</span>
          </span>
        </div>

        {/* Dialog Title & Message Content */}
        <div className="space-y-2 px-1 sm:px-2">
          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight break-words">
            {title}
          </h4>
          <div className="text-xs text-slate-300 leading-relaxed break-words max-h-56 overflow-y-auto pr-1">
            {message}
          </div>
        </div>

        {/* Action Controls Hierarchy */}
        <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {isConfirm || (actionText && onAction) ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/2 min-h-[42px] py-2.5 px-4 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700 font-semibold text-xs transition active:scale-95 order-2 sm:order-1"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onAction) onAction();
                  onClose();
                }}
                className={`w-full sm:w-1/2 min-h-[42px] py-2.5 px-4 rounded-xl font-bold text-xs shadow-lg transition active:scale-95 order-1 sm:order-2 ${
                  confirmVariant === "danger"
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50"
                    : confirmVariant === "warning"
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/50"
                    : confirmVariant === "success"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/50"
                }`}
              >
                {actionText || "Confirm"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[42px] py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95"
            >
              Understood
            </button>
          )}
        </div>

        {/* Security / Micro Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-widest px-1">
          <span>TEAM VAJRA SYSTEM</span>
          <span className="text-amber-400/80">SECURE PROTOCOL</span>
        </div>

      </div>
    </div>
  );
}
