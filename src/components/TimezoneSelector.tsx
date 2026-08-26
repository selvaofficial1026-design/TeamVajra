"use client";

import React, { useState } from "react";
import { useVajraTimezone, VajraTimezone } from "@/lib/timezone";
import { Globe, Clock, Search, Check, ChevronDown, X, Sparkles } from "lucide-react";

interface TimezoneSelectorProps {
  compact?: boolean;
  className?: string;
  showSeconds?: boolean;
}

export default function TimezoneSelector({
  compact = false,
  className = "",
  showSeconds = true,
}: TimezoneSelectorProps) {
  const { selectedTz, setSelectedTz, liveTime, liveDate, istLiveTime, allTimezones, isLoaded } = useVajraTimezone();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isLoaded) {
    return null;
  }

  const filteredTzs = allTimezones.filter(
    (tz) =>
      tz.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isIndia = selectedTz.id === "IST";

  return (
    <>
      {/* Trigger Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1424] hover:bg-[#151C30] border border-blue-500/30 hover:border-blue-400/60 transition-all text-xs text-slate-200 active:scale-95 shadow-sm ${className}`}
        title="Click to switch Country / Timezone for Class Schedules & World Clock"
      >
        <span className="text-sm leading-none shrink-0">{selectedTz.flag}</span>
        
        <div className="flex flex-col text-left leading-tight min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-white tracking-tight truncate max-w-[120px] sm:max-w-[140px]">
              {compact ? selectedTz.code : selectedTz.label}
            </span>
            <ChevronDown className="w-3 h-3 text-blue-400 group-hover:text-blue-300 transition-transform group-hover:translate-y-0.5" />
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-mono font-bold mt-0.5">
            <Clock className="w-2.5 h-2.5 shrink-0 text-blue-400 animate-pulse" />
            <span>{liveTime || "Live Clock"}</span>
          </div>
        </div>
      </button>

      {/* Country & Timezone Selector Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
          <div 
            className="w-full max-w-lg bg-[#0D1220] border border-blue-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col text-left ring-1 ring-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-blue-500/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>Select Country & Timezone</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Schedules and Google Meet classes will convert to your local time automatically.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#141A2E] hover:bg-[#1C253D] text-slate-400 hover:text-white border border-slate-700/60 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Live Timezone Card */}
            <div className="p-3.5 rounded-2xl bg-[#090C16] border border-blue-500/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedTz.flag}</span>
                <div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span>Active Timezone:</span>
                    <strong className="text-white">{selectedTz.country}</strong>
                  </div>
                  <div className="text-sm font-bold text-blue-400 font-mono flex items-center gap-2 mt-0.5">
                    <span>{liveTime}</span>
                    <span className="text-[11px] text-slate-400 font-normal">({liveDate})</span>
                  </div>
                </div>
              </div>

              {!isIndia && (
                <button
                  type="button"
                  onClick={() => {
                    const ist = allTimezones[0];
                    setSelectedTz(ist);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <span>Reset to IST</span>
                  <span>🇮🇳</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-3 shrink-0" />
              <input
                type="text"
                placeholder="Search country, city or timezone (e.g. Dubai, Singapore, USA, London)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13192B] border border-blue-500/30 text-white text-xs sm:text-sm focus:border-blue-400 focus:outline-none transition shadow-inner placeholder:text-slate-500"
              />
            </div>

            {/* Country Timezone List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-72 custom-scrollbar">
              {filteredTzs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching countries or timezones found for &quot;{searchQuery}&quot;.
                </div>
              ) : (
                filteredTzs.map((tz) => {
                  const isSelected = selectedTz.id === tz.id;
                  
                  // Compute live time preview for this timezone
                  let tzTimePreview = "";
                  try {
                    tzTimePreview = new Intl.DateTimeFormat("en-US", {
                      timeZone: tz.timeZone,
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }).format(new Date());
                  } catch {
                    tzTimePreview = "";
                  }

                  return (
                    <button
                      key={tz.id}
                      type="button"
                      onClick={() => {
                        setSelectedTz(tz);
                        setIsOpen(false);
                      }}
                      className={`w-full p-3 rounded-xl border transition flex items-center justify-between text-left ${
                        isSelected
                          ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-900/30"
                          : "bg-[#13192B] hover:bg-[#182138] border-slate-800 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl shrink-0">{tz.flag}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-white truncate">
                              {tz.country}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isSelected ? "bg-blue-500 text-white" : "bg-slate-800 text-blue-400"
                            }`}>
                              {tz.code}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                            {tz.city} • {tz.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 pl-2 text-right">
                        <span className="font-mono text-xs font-bold text-blue-400">
                          {tzTimePreview}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Tip */}
            <div className="pt-2 border-t border-blue-500/20 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <span className="flex items-center gap-1 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Base Dojo Training: <strong>IST (UTC+5:30)</strong></span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-blue-400 hover:underline font-bold"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
