"use client";

import { useState, useEffect, useCallback } from "react";

export interface VajraTimezone {
  id: string; // Unique key
  country: string;
  flag: string;
  label: string;
  code: string; // e.g. IST, GST, EDT, etc.
  city: string;
  timeZone: string; // IANA timeZone identifier
}

export const VAJRA_TIMEZONES: VajraTimezone[] = [
  {
    id: "IST",
    country: "India",
    flag: "🇮🇳",
    label: "India (IST)",
    code: "IST",
    city: "New Delhi / Chennai",
    timeZone: "Asia/Kolkata",
  },
  {
    id: "GST-UAE",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    label: "UAE / Dubai (GST)",
    code: "GST",
    city: "Dubai / Abu Dhabi",
    timeZone: "Asia/Dubai",
  },
  {
    id: "SGT",
    country: "Singapore",
    flag: "🇸🇬",
    label: "Singapore (SGT)",
    code: "SGT",
    city: "Singapore",
    timeZone: "Asia/Singapore",
  },
  {
    id: "MYT",
    country: "Malaysia",
    flag: "🇲🇾",
    label: "Malaysia (MYT)",
    code: "MYT",
    city: "Kuala Lumpur",
    timeZone: "Asia/Kuala_Lumpur",
  },
  {
    id: "BST-UK",
    country: "United Kingdom",
    flag: "🇬🇧",
    label: "UK / London (GMT/BST)",
    code: "UK",
    city: "London",
    timeZone: "Europe/London",
  },
  {
    id: "EDT-US",
    country: "United States (Eastern)",
    flag: "🇺🇸",
    label: "USA - New York (EST/EDT)",
    code: "EDT",
    city: "New York / Atlanta",
    timeZone: "America/New_York",
  },
  {
    id: "CDT-US",
    country: "United States (Central)",
    flag: "🇺🇸",
    label: "USA - Chicago (CST/CDT)",
    code: "CDT",
    city: "Chicago / Dallas",
    timeZone: "America/Chicago",
  },
  {
    id: "PDT-US",
    country: "United States (Pacific)",
    flag: "🇺🇸",
    label: "USA - California (PST/PDT)",
    code: "PDT",
    city: "Los Angeles / SF",
    timeZone: "America/Los_Angeles",
  },
  {
    id: "EDT-CA",
    country: "Canada (Eastern)",
    flag: "🇨🇦",
    label: "Canada - Toronto (EDT)",
    code: "EDT",
    city: "Toronto",
    timeZone: "America/Toronto",
  },
  {
    id: "PDT-CA",
    country: "Canada (Pacific)",
    flag: "🇨🇦",
    label: "Canada - Vancouver (PDT)",
    code: "PDT",
    city: "Vancouver",
    timeZone: "America/Vancouver",
  },
  {
    id: "AEST-AU",
    country: "Australia (Eastern)",
    flag: "🇦🇺",
    label: "Australia - Sydney (AEST)",
    code: "AEST",
    city: "Sydney / Melbourne",
    timeZone: "Australia/Sydney",
  },
  {
    id: "AWST-AU",
    country: "Australia (Western)",
    flag: "🇦🇺",
    label: "Australia - Perth (AWST)",
    code: "AWST",
    city: "Perth",
    timeZone: "Australia/Perth",
  },
  {
    id: "CEST-DE",
    country: "Germany / Europe",
    flag: "🇩🇪",
    label: "Germany / Berlin (CET)",
    code: "CET",
    city: "Berlin / Frankfurt",
    timeZone: "Europe/Berlin",
  },
  {
    id: "CEST-FR",
    country: "France",
    flag: "🇫🇷",
    label: "France / Paris (CET)",
    code: "CET",
    city: "Paris",
    timeZone: "Europe/Paris",
  },
  {
    id: "AST-SA",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    label: "Saudi Arabia (AST)",
    code: "AST",
    city: "Riyadh / Jeddah",
    timeZone: "Asia/Riyadh",
  },
  {
    id: "AST-QA",
    country: "Qatar",
    flag: "🇶🇦",
    label: "Qatar (AST)",
    code: "AST",
    city: "Doha",
    timeZone: "Asia/Qatar",
  },
  {
    id: "AST-KW",
    country: "Kuwait",
    flag: "🇰🇼",
    label: "Kuwait (AST)",
    code: "AST",
    city: "Kuwait City",
    timeZone: "Asia/Kuwait",
  },
  {
    id: "GST-OM",
    country: "Oman",
    flag: "🇴🇲",
    label: "Oman (GST)",
    code: "GST",
    city: "Muscat",
    timeZone: "Asia/Muscat",
  },
  {
    id: "AST-BH",
    country: "Bahrain",
    flag: "🇧🇭",
    label: "Bahrain (AST)",
    code: "AST",
    city: "Manama",
    timeZone: "Asia/Bahrain",
  },
  {
    id: "SLST",
    country: "Sri Lanka",
    flag: "🇱🇰",
    label: "Sri Lanka (SLST)",
    code: "SLST",
    city: "Colombo",
    timeZone: "Asia/Colombo",
  },
  {
    id: "JST",
    country: "Japan",
    flag: "🇯🇵",
    label: "Japan (JST)",
    code: "JST",
    city: "Tokyo",
    timeZone: "Asia/Tokyo",
  },
  {
    id: "NZST",
    country: "New Zealand",
    flag: "🇳🇿",
    label: "New Zealand (NZST)",
    code: "NZST",
    city: "Auckland",
    timeZone: "Pacific/Auckland",
  },
  {
    id: "SAST",
    country: "South Africa",
    flag: "🇿🇦",
    label: "South Africa (SAST)",
    code: "SAST",
    city: "Johannesburg",
    timeZone: "Africa/Johannesburg",
  },
];

export const DEFAULT_TIMEZONE = VAJRA_TIMEZONES[0]; // India (IST)

// Helper: Convert a time (hours:minutes in IST) to target timezone
export function convertIstHourMinToTarget(
  istHours: number,
  istMinutes: number,
  targetTimeZone: string
): { timeStr: string; isDifferentDay?: string } {
  try {
    // Create a base date in UTC that corresponds to the given IST time (IST is UTC+5:30)
    const now = new Date();
    const utcDate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      istHours - 5,
      istMinutes - 30,
      0
    ));

    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: targetTimeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const dayFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: targetTimeZone,
      weekday: "short",
    });

    const istDayFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
    });

    const formattedTime = timeFormatter.format(utcDate);
    const targetDay = dayFormatter.format(utcDate);
    const istDay = istDayFormatter.format(utcDate);

    let isDifferentDay: string | undefined;
    if (targetDay !== istDay) {
      isDifferentDay = `(${targetDay})`;
    }

    return { timeStr: formattedTime, isDifferentDay };
  } catch {
    return { timeStr: `${istHours.toString().padStart(2, "0")}:${istMinutes.toString().padStart(2, "0")}` };
  }
}

export interface VajraBatch {
  id: string;
  name: string;
  slot: "Morning" | "Evening";
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  istString: string;
  defaultLabel: string;
}

export const VAJRA_BATCHES: VajraBatch[] = [
  {
    id: "batch-1",
    name: "Early Morning Batch 1",
    slot: "Morning",
    startHour: 4,
    startMinute: 30,
    endHour: 5,
    endMinute: 15,
    istString: "04:30 AM – 05:15 AM IST",
    defaultLabel: "04:30 AM – 05:15 AM (Morning)",
  },
  {
    id: "batch-2",
    name: "Morning Batch 2",
    slot: "Morning",
    startHour: 5,
    startMinute: 30,
    endHour: 6,
    endMinute: 0,
    istString: "05:30 AM – 06:00 AM IST",
    defaultLabel: "05:30 AM – 06:00 AM (Morning)",
  },
  {
    id: "batch-3",
    name: "Morning Batch 3",
    slot: "Morning",
    startHour: 8,
    startMinute: 30,
    endHour: 9,
    endMinute: 15,
    istString: "08:30 AM – 09:15 AM IST",
    defaultLabel: "08:30 AM – 09:15 AM (Morning)",
  },
  {
    id: "batch-4",
    name: "Evening Batch 1",
    slot: "Evening",
    startHour: 15,
    startMinute: 45,
    endHour: 16,
    endMinute: 30,
    istString: "03:45 PM – 04:30 PM IST",
    defaultLabel: "03:45 PM – 04:30 PM (Evening)",
  },
  {
    id: "batch-5",
    name: "Evening Batch 2",
    slot: "Evening",
    startHour: 17,
    startMinute: 0,
    endHour: 17,
    endMinute: 45,
    istString: "05:00 PM – 05:45 PM IST",
    defaultLabel: "05:00 PM – 05:45 PM (Evening)",
  },
  {
    id: "batch-6",
    name: "Night Batch 3",
    slot: "Evening",
    startHour: 18,
    startMinute: 0,
    endHour: 18,
    endMinute: 45,
    istString: "06:00 PM – 06:45 PM IST",
    defaultLabel: "06:00 PM – 06:45 PM (Night)",
  },
];

// Convert standard Academy Batch strings to the user's selected timezone
export function convertBatchStringToTimezone(
  batchString: string,
  targetTz: VajraTimezone
): {
  originalIst: string;
  convertedTime: string;
  fullLabel: string;
  badgeLabel: string;
} {
  const isIndia = targetTz.timeZone === "Asia/Kolkata";
  const lower = batchString.toLowerCase();

  // Batch 1: 04:30 AM – 05:15 AM
  if (lower.includes("4.30") || lower.includes("4:30") || lower.includes("04:30")) {
    const start = convertIstHourMinToTarget(4, 30, targetTz.timeZone);
    const end = convertIstHourMinToTarget(5, 15, targetTz.timeZone);
    const convertedTime = `${start.timeStr} – ${end.timeStr} ${targetTz.code} ${start.isDifferentDay || ""}`.trim();
    return {
      originalIst: "04:30 AM – 05:15 AM IST",
      convertedTime,
      fullLabel: isIndia ? "04:30 AM – 05:15 AM (Morning IST)" : `04:30 AM IST (${convertedTime})`,
      badgeLabel: isIndia ? "Morning • 04:30 AM – 05:15 AM IST" : `Morning • ${convertedTime}`,
    };
  }

  // Batch 2: 05:30 AM – 06:00 AM
  if (lower.includes("5.30") || lower.includes("5:30") || lower.includes("05:30")) {
    const start = convertIstHourMinToTarget(5, 30, targetTz.timeZone);
    const end = convertIstHourMinToTarget(6, 0, targetTz.timeZone);
    const convertedTime = `${start.timeStr} – ${end.timeStr} ${targetTz.code} ${start.isDifferentDay || ""}`.trim();
    return {
      originalIst: "05:30 AM – 06:00 AM IST",
      convertedTime,
      fullLabel: isIndia ? "05:30 AM – 06:00 AM (Morning IST)" : `05:30 AM IST (${convertedTime})`,
      badgeLabel: isIndia ? "Morning • 05:30 AM – 06:00 AM IST" : `Morning • ${convertedTime}`,
    };
  }

  // Batch 3: 08:30 AM – 09:15 AM
  if (lower.includes("8.30") || lower.includes("8:30") || lower.includes("08:30")) {
    const start = convertIstHourMinToTarget(8, 30, targetTz.timeZone);
    const end = convertIstHourMinToTarget(9, 15, targetTz.timeZone);
    const convertedTime = `${start.timeStr} – ${end.timeStr} ${targetTz.code} ${start.isDifferentDay || ""}`.trim();
    return {
      originalIst: "08:30 AM – 09:15 AM IST",
      convertedTime,
      fullLabel: isIndia ? "08:30 AM – 09:15 AM (Morning IST)" : `08:30 AM IST (${convertedTime})`,
      badgeLabel: isIndia ? "Morning • 08:30 AM – 09:15 AM IST" : `Morning • ${convertedTime}`,
    };
  }

  // Batch 4: 03:45 PM – 04:30 PM
  if (lower.includes("3.45") || lower.includes("3:45") || lower.includes("03:45") || lower.includes("15:45")) {
    const start = convertIstHourMinToTarget(15, 45, targetTz.timeZone);
    const end = convertIstHourMinToTarget(16, 30, targetTz.timeZone);
    const convertedTime = `${start.timeStr} – ${end.timeStr} ${targetTz.code} ${start.isDifferentDay || ""}`.trim();
    return {
      originalIst: "03:45 PM – 04:30 PM IST",
      convertedTime,
      fullLabel: isIndia ? "03:45 PM – 04:30 PM (Evening IST)" : `03:45 PM IST (${convertedTime})`,
      badgeLabel: isIndia ? "Evening • 03:45 PM – 04:30 PM IST" : `Evening • ${convertedTime}`,
    };
  }

  // Batch 5: 05:00 PM – 05:45 PM
  if (lower.includes("5 - 5.45") || lower.includes("5:00") || lower.includes("05:00 pm") || lower.includes("5.00") || lower.includes("17:00") || (lower.includes("5") && lower.includes("5:45"))) {
    const start = convertIstHourMinToTarget(17, 0, targetTz.timeZone);
    const end = convertIstHourMinToTarget(17, 45, targetTz.timeZone);
    const convertedTime = `${start.timeStr} – ${end.timeStr} ${targetTz.code} ${start.isDifferentDay || ""}`.trim();
    return {
      originalIst: "05:00 PM – 05:45 PM IST",
      convertedTime,
      fullLabel: isIndia ? "05:00 PM – 05:45 PM (Evening IST)" : `05:00 PM IST (${convertedTime})`,
      badgeLabel: isIndia ? "Evening • 05:00 PM – 05:45 PM IST" : `Evening • ${convertedTime}`,
    };
  }

  // Batch 6: 06:00 PM – 06:45 PM
  if (lower.includes("6-645") || lower.includes("6 - 6.45") || lower.includes("6:00") || lower.includes("06:00") || lower.includes("18:00") || (lower.includes("6") && lower.includes("6:45"))) {
    const start = convertIstHourMinToTarget(18, 0, targetTz.timeZone);
    const end = convertIstHourMinToTarget(18, 45, targetTz.timeZone);
    const convertedTime = `${start.timeStr} – ${end.timeStr} ${targetTz.code} ${start.isDifferentDay || ""}`.trim();
    return {
      originalIst: "06:00 PM – 06:45 PM IST",
      convertedTime,
      fullLabel: isIndia ? "06:00 PM – 06:45 PM (Night IST)" : `06:00 PM IST (${convertedTime})`,
      badgeLabel: isIndia ? "Night • 06:00 PM – 06:45 PM IST" : `Night • ${convertedTime}`,
    };
  }

  return {
    originalIst: batchString,
    convertedTime: batchString,
    fullLabel: batchString,
    badgeLabel: batchString,
  };
}

// React Hook for dynamic timezone & live world clock
export function useVajraTimezone() {
  const [selectedTz, setSelectedTzState] = useState<VajraTimezone>(DEFAULT_TIMEZONE);
  const [liveTime, setLiveTime] = useState<string>("");
  const [liveDate, setLiveDate] = useState<string>("");
  const [istLiveTime, setIstLiveTime] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedId = localStorage.getItem("vajra_selected_tz_id");
      if (savedId) {
        const found = VAJRA_TIMEZONES.find((t) => t.id === savedId);
        if (found) {
          setSelectedTzState(found);
        }
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);

    const handleTzChange = (e: Event) => {
      const customEvent = e as CustomEvent<VajraTimezone>;
      if (customEvent.detail) {
        setSelectedTzState(customEvent.detail);
      }
    };

    window.addEventListener("vajra_timezone_change", handleTzChange);
    return () => {
      window.removeEventListener("vajra_timezone_change", handleTzChange);
    };
  }, []);

  // Update clock every second
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();

      try {
        // Selected Timezone Formatter
        const timeFmt = new Intl.DateTimeFormat("en-US", {
          timeZone: selectedTz.timeZone,
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        const dateFmt = new Intl.DateTimeFormat("en-US", {
          timeZone: selectedTz.timeZone,
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        setLiveTime(timeFmt.format(now));
        setLiveDate(dateFmt.format(now));

        // IST Formatter
        const istFmt = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setIstLiveTime(istFmt.format(now));
      } catch {
        setLiveTime(now.toLocaleTimeString());
      }
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [selectedTz]);

  const setSelectedTz = useCallback((tz: VajraTimezone) => {
    setSelectedTzState(tz);
    try {
      localStorage.setItem("vajra_selected_tz_id", tz.id);
      window.dispatchEvent(new CustomEvent("vajra_timezone_change", { detail: tz }));
    } catch {
      // ignore
    }
  }, []);

  return {
    selectedTz,
    setSelectedTz,
    liveTime,
    liveDate,
    istLiveTime,
    isLoaded,
    allTimezones: VAJRA_TIMEZONES,
    convertBatch: (batch: string) => convertBatchStringToTimezone(batch, selectedTz),
  };
}
