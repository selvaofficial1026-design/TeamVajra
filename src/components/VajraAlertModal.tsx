"use client";

import React from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export interface VajraAlertProps {
  isOpen: boolean;
  type?: "error" | "warning" | "success" | "info";
  title: string;
  message: string;
  onClose: () => void;
  actionText?: string;
  onAction?: () => void;
}

export default function VajraAlertModal({
  isOpen,
  type = "error",
  title,
  message,
  onClose,
  actionText,
  onAction,
}: VajraAlertProps) {
  if (!isOpen) return null;

  const isError = type === "error";
  const isWarning = type === "warning";
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#101726] via-[#0B0F1A] to-[#05070E] border border-blue-500/30 p-6 shadow-2xl shadow-blue-950/60 ring-1 ring-white/10 overflow-hidden text-center space-y-4 animate-scale-up"
        role="alertdialog"
        aria-modal="true"
      >
        {/* Top Accent Ribbon matching Vajra Theme */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isSuccess 
            ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
            : isWarning
            ? "bg-gradient-to-r from-amber-500 to-yellow-400"
            : "bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500"
        }`} />

        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          aria-label="Close Alert"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo Emblem & Status Icon */}
        <div className="flex flex-col items-center gap-2.5 pt-1">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-500/40 bg-black/80 p-1 shadow-lg">
            <Image
              src="/vajra-logo.jpg"
              alt="Team Vajra Emblem"
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 font-bold">
            Team Vajra System Notice
          </span>
        </div>

        {/* Title & Message */}
        <div className="space-y-1.5 px-2">
          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed break-words">
            {message}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-center gap-2">
          {actionText && onAction && (
            <button
              type="button"
              onClick={() => {
                onAction();
                onClose();
              }}
              className="flex-1 min-h-[42px] py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition active:scale-95"
            >
              {actionText}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`min-h-[42px] py-2.5 px-5 rounded-xl font-bold text-xs transition active:scale-95 ${
              actionText 
                ? "bg-[#141A2E] hover:bg-[#1C253D] text-slate-300 border border-slate-700" 
                : "w-full bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
            }`}
          >
            {actionText ? "Dismiss" : "Understood"}
          </button>
        </div>

      </div>
    </div>
  );
}
