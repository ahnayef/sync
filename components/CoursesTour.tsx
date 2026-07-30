"use client";

import { useEffect, useState, useCallback } from "react";
import { Joyride, type Step, type EventData } from "react-joyride";

const TOUR_KEY = "Sync_courses_tour_v1";

function makeSteps(filtersButtonId: string): Step[] {
  return [
    {
      target: "body",
      placement: "center",
      title: "Welcome to Course Selection 👋",
      content:
        "This quick walkthrough shows you how to find and follow your courses so your schedule stays up-to-date. Takes less than a minute!",
      skipBeacon: true,
    },
    {
      target: "#courses-search",
      placement: "bottom",
      title: "🔍 Search Courses",
      content:
        "Type a course code, title, or teacher name here to instantly narrow down the list.",
      skipBeacon: true,
    },
    {
      target: `#${filtersButtonId}`,
      placement: "bottom",
      title: "🎛️ Filter & Sort",
      content:
        "Open this panel to filter by department, batch session, class type, or selection status — and to change the sort order.",
      skipBeacon: true,
    },
    {
      target: "button[aria-label='Select all visible courses']",
      placement: "bottom",
      title: "✅ Select All Visible",
      content:
        "Click this to follow every course currently shown — great after applying a filter to quickly select a subset.",
      skipBeacon: true,
    },
    {
      target: "#courses-save",
      placement: "bottom",
      title: "💾 Save Your Selections",
      content:
        "Once you've ticked all your courses, press Save to persist them. Your routine updates immediately — no need to log out.",
      skipBeacon: true,
    },
  ];
}

export default function CoursesTour({ filtersButtonId }: { filtersButtonId: string }) {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem(TOUR_KEY)) {
      // Wait for the page to fully render its elements
      const t = setTimeout(() => setRun(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const handleEvent = useCallback((data: EventData) => {
    if (data.status === "finished" || data.status === "skipped") {
      localStorage.setItem(TOUR_KEY, "1");
      setRun(false);
    }
  }, []);

  if (!mounted) return null;

  return (
    <Joyride
      steps={makeSteps(filtersButtonId)}
      run={run}
      continuous
      onEvent={handleEvent}
      options={{
        overlayColor: "rgba(0,0,0,0.6)",
        primaryColor: "#4f8ef7",
        backgroundColor: "#151c25",
        textColor: "#d7dee6",
        arrowColor: "#151c25",
        spotlightRadius: 8,
        scrollOffset: 80,
        zIndex: 10000,
        showProgress: true,
        buttons: ["back", "close", "primary", "skip"],
      }}
      locale={{
        back: "← Back",
        close: "Close",
        last: "Got it!",
        next: "Next →",
        open: "Start tour",
        skip: "Skip tour",
      }}
    />
  );
}
