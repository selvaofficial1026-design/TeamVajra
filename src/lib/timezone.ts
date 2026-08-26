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

  if (batchString.includes("05:30") || batchString.toLowerCase().includes("morning")) {
    const start = convertIstHourMinToTarget(5, 30, targetTz.timeZone);
    const end = convertIstHourMinToTarget(7, 30, targetTz.timeZone);
    const convertedTime = `${start.timeStr} – ${end.timeStr} ${targetTz.code} ${start.isDifferentDay || ""}`.trim();
    return {
      originalIst: "05:30 AM – 07:30 AM IST",
      convertedTime,
      fullLabel: isIndia ? "Morning (05:30 AM – 07:30 AM IST)" : `Morning: ${convertedTime} (05:30 AM IST)`,
      badgeLabel: isIndia ? "Morning • 05:30 AM – 07:30 AM IST" : `Morning • ${convertedTime}`,
    };
  }

  if (batchString.includes("05:00") || batchString.toLowerCase().includes("evening")) {
    const start = convertIstHourMinToTarget(17, 0, targetTz.timeZone);
    const end = convertIstHourMinToTarget(19, 0, targetTz.timeZone);
    const convertedTime = `${start.timeStr} – ${end.timeStr} ${targetTz.code} ${start.isDifferentDay || ""}`.trim();
    return {
      originalIst: "05:00 PM – 07:00 PM IST",
      convertedTime,
      fullLabel: isIndia ? "Evening (05:00 PM – 07:00 PM IST)" : `Evening: ${convertedTime} (05:00 PM IST)`,
      badgeLabel: isIndia ? "Evening • 05:00 PM – 07:00 PM IST" : `Evening • ${convertedTime}`,
    };
  }

  if (batchString.includes("07:00") || batchString.toLowerCase().includes("night")) {
    const start = convertIstHourMinToTarget(19, 0, targetTz.timeZone);
    const end = convertIstHourMinToTarget(20, 30, targetTz.timeZone);
    const convertedTime = `${start.timeStr} – ${end.timeStr} ${targetTz.code} ${start.isDifferentDay || ""}`.trim();
    return {
      originalIst: "07:00 PM – 08:30 PM IST",
      convertedTime,
      fullLabel: isIndia ? "Night (07:00 PM – 08:30 PM IST)" : `Night: ${convertedTime} (07:00 PM IST)`,
      badgeLabel: isIndia ? "Night • 07:00 PM – 08:30 PM IST" : `Night • ${convertedTime}`,
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
