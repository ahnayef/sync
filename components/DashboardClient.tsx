"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  FiClock, 
  FiBookOpen, 
  FiUsers, 
  FiGrid, 
  FiMapPin, 
  FiActivity, 
  FiPlusCircle, 
  FiSearch, 
  FiUser, 
  FiHome, 
  FiZap,
  FiTrendingUp,
  FiSliders,
  FiCalendar,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiBell,
  FiSettings
} from "react-icons/fi";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";

// Days mapping
const daysMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// Premium custom SVG Circular Progress ring for stat cards
const CircularProgress = ({ percent, color = "var(--color-accent)" }: { percent: number; color?: string }) => {
  const radius = 18;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center h-12 w-12">
      <svg className="w-full h-full transform -rotate-90">
        {/* Background Circle */}
        <circle
          className="text-[var(--color-border)]"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
          opacity={0.3}
        />
        {/* Progress Circle */}
        <circle
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-[9px] font-extrabold font-mono text-[var(--color-text-primary)]">
        {Math.round(percent)}%
      </span>
    </div>
  );
};

export default function DashboardClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("10:30:00");
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    const updateTime = () => {
      if (demoMode) {
        setCurrentTimeStr("10:30:00");
      } else {
        const now = new Date();
        setCurrentTimeStr(now.toTimeString().split(" ")[0]);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, [demoMode]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const timeToMinutes = (tStr: string) => {
    if (!tStr) return 0;
    const parts = tStr.split(":");
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return h * 60 + m;
  };

  // Compute live class status
  const todaySchedulesWithStatus = useMemo(() => {
    if (!data?.todaySchedule) return [];
    const currentMin = timeToMinutes(currentTimeStr);
    
    return data.todaySchedule.map((s: any) => {
      const startMin = timeToMinutes(s.start_time);
      const endMin = timeToMinutes(s.end_time);
      const duration = endMin - startMin;
      
      let status: "ongoing" | "upcoming" | "past" = "upcoming";
      let progress = 0;
      
      if (currentMin >= startMin && currentMin <= endMin) {
        status = "ongoing";
        progress = Math.round(((currentMin - startMin) / duration) * 100);
      } else if (currentMin > endMin) {
        status = "past";
        progress = 100;
      }
      
      return {
        ...s,
        status,
        progress,
        durationMin: duration,
      };
    });
  }, [data?.todaySchedule, currentTimeStr]);

  // Live timeline limit (5 items by default)
  const displayedClasses = useMemo(() => {
    return showAllClasses 
      ? todaySchedulesWithStatus 
      : todaySchedulesWithStatus.slice(0, 5);
  }, [todaySchedulesWithStatus, showAllClasses]);

  const ongoingClasses = useMemo(() => {
    return todaySchedulesWithStatus.filter((s: any) => s.status === "ongoing");
  }, [todaySchedulesWithStatus]);

  const upcomingClasses = useMemo(() => {
    return todaySchedulesWithStatus.filter((s: any) => s.status === "upcoming");
  }, [todaySchedulesWithStatus]);

  // Heatmap calculations
  const heatmapData = useMemo(() => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
    const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
    
    const grid: Record<string, Record<string, number>> = {};
    days.forEach(d => {
      grid[d] = {};
      hours.forEach(h => {
        grid[d][h] = 0;
      });
    });

    if (!data?.weeklySchedules) return { grid, maxDensity: 0, days, hours };

    let maxDensity = 0;

    data.weeklySchedules.forEach((s: any) => {
      const d = s.day?.toLowerCase();
      if (!grid[d]) return;

      const classStart = timeToMinutes(s.start_time);
      const classEnd = timeToMinutes(s.end_time);

      hours.forEach(h => {
        const slotStart = timeToMinutes(h);
        const slotEnd = slotStart + 60;

        if (Math.max(classStart, slotStart) < Math.min(classEnd, slotEnd)) {
          grid[d][h] += 1;
          if (grid[d][h] > maxDensity) {
            maxDensity = grid[d][h];
          }
        }
      });
    });

    return { grid, maxDensity, days, hours };
  }, [data?.weeklySchedules]);



  const formatTo12h = (hourStr: string) => {
    const [hStr, mStr] = hourStr.split(":");
    const h = parseInt(hStr, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${mStr} ${ampm}`;
  };

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const getRelativeTime = (timestamp: number) => {
    const now = new Date().getTime();
    const diff = now - timestamp;
    
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(diff / 86400000);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  // --- Recharts Data Mappings ---
  const weeklyDistributionData = useMemo(() => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
    if (!data?.weeklySchedules) return [];

    // Find all distinct departments
    const deptsSet = new Set<string>();
    data.weeklySchedules.forEach((s: any) => {
      if (s.department_name) deptsSet.add(s.department_name);
    });
    const depts = Array.from(deptsSet);

    return days.map(day => {
      const result: Record<string, any> = {
        name: day.charAt(0).toUpperCase() + day.slice(1, 3), // e.g. "Sun", "Mon"
        dayRaw: day
      };

      // Initialize all departments with 0 count
      depts.forEach(dept => {
        result[dept] = 0;
      });

      // Count schedules for this day and department
      data.weeklySchedules.forEach((s: any) => {
        if (s.day?.toLowerCase() === day) {
          const dept = s.department_name;
          if (dept) {
            result[dept] = (result[dept] || 0) + 1;
          }
        }
      });

      return result;
    });
  }, [data?.weeklySchedules]);

  const departmentsList = useMemo(() => {
    if (!data?.weeklySchedules) return [];
    const deptsSet = new Set<string>();
    data.weeklySchedules.forEach((s: any) => {
      if (s.department_name) deptsSet.add(s.department_name);
    });
    return Array.from(deptsSet);
  }, [data?.weeklySchedules]);

  const peakHoursData = useMemo(() => {
    const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
    if (!data?.weeklySchedules) return [];
    
    // Find all distinct departments
    const deptsSet = new Set<string>();
    data.weeklySchedules.forEach((s: any) => {
      if (s.department_name) deptsSet.add(s.department_name);
    });
    const depts = Array.from(deptsSet);

    return hours.map(h => {
      const slotStart = timeToMinutes(h);
      const slotEnd = slotStart + 60;
      
      const result: Record<string, any> = {
        hour: formatTo12h(h),
        hourRaw: h
      };

      // Initialize all departments with 0 count
      depts.forEach(dept => {
        result[dept] = 0;
      });

      // Count classes per department for this hour slot
      data.weeklySchedules.forEach((s: any) => {
        const classStart = timeToMinutes(s.start_time);
        const classEnd = timeToMinutes(s.end_time);
        if (Math.max(classStart, slotStart) < Math.min(classEnd, slotEnd)) {
          const dept = s.department_name;
          if (dept) {
            result[dept] = (result[dept] || 0) + 1;
          }
        }
      });
      
      return result;
    });
  }, [data?.weeklySchedules]);

  const roomOccupancyBarData = useMemo(() => {
    if (!data?.roomAnalytics?.occupancy) return [];
    return data.roomAnalytics.occupancy.map((room: any) => {
      const occupancyPct = Math.min(Math.round((Number(room.total_minutes) / 2700) * 100), 100);
      return {
        name: `Room ${room.number}`,
        Occupancy: occupancyPct,
        Hours: Number((room.total_minutes / 60).toFixed(1))
      };
    }).slice(0, 5); 
  }, [data?.roomAnalytics?.occupancy]);

  const roomCapacityPieData = useMemo(() => {
    if (!data?.roomAnalytics?.occupancy) return [];
    
    const groups = {
      "Small Classrooms": 0,    // <= 30 seats
      "Medium Classrooms": 0,   // 31 - 50 seats
      "Large Classrooms": 0     // > 50 seats
    };

    data.roomAnalytics.occupancy.forEach((r: any) => {
      const cap = r.capacity || 0;
      if (cap <= 30) {
        groups["Small Classrooms"] += 1;
      } else if (cap <= 50) {
        groups["Medium Classrooms"] += 1;
      } else {
        groups["Large Classrooms"] += 1;
      }
    });

    const colorsMap = {
      "Small Classrooms": "#6f93da",
      "Medium Classrooms": "#9a7bd9",
      "Large Classrooms": "#c59d4a"
    };

    return Object.entries(groups)
      .filter(([_, val]) => val > 0)
      .map(([name, value]) => ({
        name,
        value,
        color: colorsMap[name as keyof typeof colorsMap] || "#6f93da"
      }));
  }, [data?.roomAnalytics?.occupancy]);

  const teacherWorkloadBarData = useMemo(() => {
    if (!data?.teacherAnalytics?.workload) return [];
    return data.teacherAnalytics.workload.map((t: any) => {
      return {
        name: t.short,
        Hours: Number((t.total_minutes / 60).toFixed(1)),
        Classes: t.class_count
      };
    }).slice(0, 5); 
  }, [data?.teacherAnalytics?.workload]);

  const deptClassesBarData = useMemo(() => {
    if (!data?.departmentAnalytics?.classes) return [];
    return data.departmentAnalytics.classes.map((d: any) => {
      return {
        name: d.department_name,
        Classes: d.class_count
      };
    });
  }, [data?.departmentAnalytics?.classes]);

  const deptLabTheoryStackedData = useMemo(() => {
    if (!data?.departmentAnalytics?.labTheory) return [];
    return data.departmentAnalytics.labTheory.map((dept: any) => {
      return {
        name: dept.department_name,
        "Syllabus Subjects": Number(dept.total_courses || 0),
        "Weekly Classes": Number(dept.scheduled_classes || 0)
      };
    });
  }, [data?.departmentAnalytics?.labTheory]);

  // Premium, customized dark mode Recharts tooltips
  const CustomRechartsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-xl border border-[var(--color-border)] p-3 text-xs shadow-xl animate-fade-in z-50">
          <p className="font-bold text-[var(--color-text-primary)] mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mt-1" style={{ color: entry.fill || entry.color || "var(--color-accent)" }}>
              <span className="h-2 w-2 rounded-full bg-current" />
              <span className="text-[var(--color-text-secondary)]">{entry.name}:</span>
              <span className="font-bold text-[var(--color-text-primary)] font-mono">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)]">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent" />
          <p className="text-sm font-medium text-[var(--color-text-secondary)] font-sans">Synthesizing comprehensive academic charts...</p>
        </div>
      </div>
    );
  }

  const { stats } = data;

  // Derive top circular widget percentages
  const classroomOccupancyPct = stats.totalRooms > 0 
    ? Math.round(((stats.totalRooms - stats.freeRoomsRightNow) / stats.totalRooms) * 100) 
    : 0;

  const todayClassesPct = stats.totalWeeklyClasses > 0
    ? Math.round((stats.todaysClasses / (stats.totalWeeklyClasses / 5)) * 100)
    : 0;

  const teacherCoveragePct = stats.totalTeachers > 0
    ? Math.min(Math.round((stats.totalWeeklyClasses / (stats.totalTeachers * 3)) * 100), 100)
    : 0;

  const weeklyScheduleUtilPct = Math.min(Math.round((stats.totalWeeklyClasses / 90) * 100), 100);

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)] font-sans">
      
      {/* ─── MAIN SaaS 3-COLUMN LAYOUT ─── */}
      <div className="flex flex-col xl:flex-row max-w-[1600px] mx-auto min-h-screen">
        
        {/* ========================================================
            LEFT COLUMN (2/3 Width): HEADER, STATS CARDS & CHARTS 
           ======================================================== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 xl:border-r border-[var(--color-border)]/40">
          
          {/* ─── 1. TOP HEADER BANNER ─── */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)]/40 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] bg-[var(--color-accent-muted)] text-[var(--color-accent)] px-2.5 py-0.5 rounded-md border border-[rgba(111,147,218,0.15)]">
                  Academic Platform
                </span>
                <span className="text-[10px] font-bold text-[var(--color-success)] bg-[rgba(103,182,107,0.06)] px-2 py-0.5 rounded border border-[rgba(103,182,107,0.15)]">
                  Live DB Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Academic <span className="gradient-text">Analytics Engine</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Demo toggle */}
              <button 
                id="dashboard-demo-toggle-btn"
                onClick={() => setDemoMode(!demoMode)} 
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold border transition-all duration-150 cursor-pointer ${
                  demoMode 
                    ? "bg-[rgba(163,113,247,0.12)] border-[rgba(163,113,247,0.25)] text-[var(--color-lab)] hover:bg-[rgba(163,113,247,0.18)]"
                    : "bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
                title="Toggles mock active hours for test coverage"
              >
                <FiSliders className="w-3 h-3" />
                <span>Demo Mode: {demoMode ? "ON" : "OFF"}</span>
              </button>

              {/* Refresh button */}
              <button 
                id="dashboard-refresh-btn"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-3 py-1.5 text-xs font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-50 cursor-pointer"
              >
                <FiRefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
                <span>{refreshing ? "Syncing..." : "Sync"}</span>
              </button>
            </div>
          </header>

          {/* ─── 2. PREMIUM GAUGES STATS GRID ─── */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: "Classroom Occupancy", 
                val: `${stats.totalRooms - stats.freeRoomsRightNow} / ${stats.totalRooms}`, 
                desc: "Active classroom blocks", 
                isGauge: true, 
                pct: classroomOccupancyPct, 
                color: "#6f93da" 
              },
              { 
                label: "Today's Schedule Routine", 
                val: `${stats.todaysClasses} classes`, 
                desc: "Scheduled for today", 
                isGauge: false, 
                icon: FiClock, 
                colorClass: "bg-rose-500/10 border-rose-500/20 text-rose-400" 
              },
              { 
                label: "Faculty Workload Share", 
                val: `${stats.totalTeachers} teachers`, 
                desc: "Avg 3 routines / teacher", 
                isGauge: false, 
                icon: FiUser, 
                colorClass: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" 
              },
              { 
                label: "Routines Allocation Util", 
                val: `${stats.totalWeeklyClasses} slots`, 
                desc: "Weekly scheduled capacity", 
                isGauge: false, 
                icon: FiBookOpen, 
                colorClass: "bg-amber-500/10 border-amber-500/20 text-amber-400" 
              },
            ].map((card, idx) => {
              const Icon = card.icon as any;
              return (
                <div 
                  key={idx}
                  className="glass relative overflow-hidden rounded-xl border border-[var(--color-border)] p-4 flex items-center justify-between gap-4 shadow-sm group hover:border-[rgba(111,147,218,0.2)] transition-all"
                >
                  <div className="space-y-1 z-10">
                    <span className="block text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{card.label}</span>
                    <span className="block text-xl font-extrabold text-[var(--color-text-primary)] font-sans leading-tight">
                      {card.val}
                    </span>
                    <span className="block text-[10px] text-[var(--color-text-muted)] font-medium">
                      {card.desc}
                    </span>
                  </div>
                  <div className="z-10 flex-shrink-0">
                    {card.isGauge ? (
                      <CircularProgress percent={card.pct!} color={card.color} />
                    ) : (
                      <div className={`h-11 w-11 rounded-lg flex items-center justify-center border ${card.colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ─── 3. PRIMARY CHARTS GRID (SECTION A) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Left 2/3 Column: Academic Load by Department (Stacked Bar Chart) */}
            <section className="lg:col-span-2 glass rounded-xl border border-[var(--color-border)] p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[var(--color-border)]/40 pb-3 mb-4">
                <div className="space-y-0.5">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-primary)]">
                    Syllabus Subjects vs. Weekly Classes
                  </h2>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    Comparing registered curriculum subjects (purple) against actual classes running on the weekly timetable (blue).
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-2 py-0.5 rounded">
                  Weekly Analysis
                </span>
              </div>

              <div className="h-[250px] w-full">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={deptLabTheoryStackedData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="var(--color-text-muted)" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="var(--color-text-muted)" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false} 
                      />
                      <Tooltip content={<CustomRechartsTooltip />} />
                      <Legend 
                        verticalAlign="top" 
                        height={32} 
                        iconSize={8}
                        iconType="circle"
                        wrapperStyle={{ fontSize: 9, fontWeight: 'bold' }} 
                      />
                      <Bar dataKey="Syllabus Subjects" name="Syllabus Subjects" fill="var(--color-lab)" radius={[4, 4, 0, 0]} barSize={12} />
                      <Bar dataKey="Weekly Classes" name="Weekly Classes" fill="var(--color-accent)" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[var(--color-text-muted)]">Generating bar charts...</div>
                )}
              </div>
            </section>

            {/* Right 1/3 Column: Infrastructure Capacity (Doughnut Chart) */}
            <section className="glass rounded-xl border border-[var(--color-border)] p-4 shadow-sm flex flex-col justify-between">
              <div className="border-b border-[var(--color-border)]/40 pb-3 mb-4">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Infrastructure capacity
                </h2>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Active rooms grouped by student seating capacity.
                </p>
              </div>

              <div className="h-[140px] relative flex items-center justify-center">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<CustomRechartsTooltip />} />
                      <Pie
                        data={roomCapacityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {roomCapacityPieData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[var(--color-text-muted)]">Loading pie metrics...</div>
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-extrabold text-[var(--color-text-primary)] font-mono">
                    {data.roomAnalytics.occupancy.length}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-[var(--color-text-muted)] font-extrabold">Active Rooms</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3 border-t border-[var(--color-border)]/40 text-[9px] font-bold text-[var(--color-text-secondary)]">
                {roomCapacityPieData.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5 text-center">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[var(--color-text-muted)] font-semibold">{item.name}:</span>
                    <span className="font-extrabold font-mono text-[var(--color-text-primary)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ─── 4. SECONDARY CHARTS GRID (SECTION B) ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Peak Hourly Densities (Smooth Area Chart) */}
            <section className="glass rounded-xl border border-[var(--color-border)] p-4 shadow-sm">
              <div className="border-b border-[var(--color-border)]/40 pb-2 mb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Peak Class Hours (Hourly Utilization Density)
                </h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Weekly active class schedule slots tracked hourly from 8:00 AM to 5:00 PM.
                </p>
              </div>

              <div className="h-[200px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={peakHoursData}
                      margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                    >
                      <defs>
                        {departmentsList.map((dept, index) => {
                          const colors = ["#6f93da", "#9a7bd9", "#67b66b", "#c59d4a", "#d96b64"];
                          const color = colors[index % colors.length];
                          return (
                            <linearGradient key={dept} id={`glow-${dept}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={color} stopOpacity={0.25}/>
                              <stop offset="95%" stopColor={color} stopOpacity={0.0}/>
                            </linearGradient>
                          );
                        })}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                      <XAxis 
                        dataKey="hour" 
                        stroke="var(--color-text-muted)" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="var(--color-text-muted)" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip content={<CustomRechartsTooltip />} />
                      {/* Dynamic overlapping glowing areas per department */}
                      {departmentsList.map((dept, index) => {
                        const colors = ["#6f93da", "#9a7bd9", "#67b66b", "#c59d4a", "#d96b64"];
                        const color = colors[index % colors.length];
                        return (
                          <Area 
                            key={dept}
                            type="monotone" 
                            dataKey={dept} 
                            stroke={color} 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill={`url(#glow-${dept})`}
                            name={dept}
                          />
                        );
                      })}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[var(--color-text-muted)]">Loading densities...</div>
                )}
              </div>
            </section>

            {/* Weekly Routine Volume (Line Chart) */}
            <section className="glass rounded-xl border border-[var(--color-border)] p-4 shadow-sm">
              <div className="border-b border-[var(--color-border)]/40 pb-2 mb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Daily Class Distribution Volume
                </h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Total routines executed per day across the weekly cycle.
                </p>
              </div>

              <div className="h-[200px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weeklyDistributionData}
                      margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        stroke="var(--color-text-muted)" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="var(--color-text-muted)" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip content={<CustomRechartsTooltip />} />
                      {/* Dynamic colored lines per department */}
                      {departmentsList.map((dept, index) => {
                        const colors = ["#6f93da", "#9a7bd9", "#67b66b", "#c59d4a", "#d96b64"];
                        const color = colors[index % colors.length];
                        return (
                          <Line 
                            key={dept}
                            type="monotone" 
                            dataKey={dept} 
                            stroke={color} 
                            strokeWidth={2}
                            dot={{ stroke: color, strokeWidth: 1, r: 3, fill: 'var(--color-bg-surface)' }}
                            activeDot={{ r: 4 }}
                            name={dept}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[var(--color-text-muted)]">Loading volumes...</div>
                )}
              </div>
            </section>

          </div>

          {/* ─── 5. TERTIARY GRID (SECTION C) ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Room Utilization Rates (Horizontal Bar Chart) */}
            <section className="glass rounded-xl border border-[var(--color-border)] p-4 shadow-sm">
              <div className="border-b border-[var(--color-border)]/40 pb-2 mb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Room Capacity Occupancy Rate (%)
                </h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Weekly utilized operational minutes ratio per physical classroom/lab.
                </p>
              </div>

              <div className="h-[210px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={roomOccupancyBarData}
                      layout="vertical"
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} horizontal={false} />
                      <XAxis 
                        type="number" 
                        domain={[0, 100]} 
                        stroke="var(--color-text-muted)" 
                        fontSize={9}
                        tickLine={false}
                        axisLine={false} 
                        unit="%"
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="var(--color-text-muted)" 
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        width={65}
                      />
                      <Tooltip content={<CustomRechartsTooltip />} />
                      <Bar 
                        dataKey="Occupancy" 
                        fill="var(--color-accent)" 
                        radius={[0, 4, 4, 0]}
                        barSize={12}
                      >
                        {roomOccupancyBarData.map((entry: any, index: number) => {
                          const col = entry.Occupancy > 60 ? "#d96b64" : entry.Occupancy > 30 ? "#6f93da" : "#67b66b";
                          return <Cell key={`cell-${index}`} fill={col} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[var(--color-text-muted)]">Loading room occupancies...</div>
                )}
              </div>
            </section>

            {/* Faculty Workload Contributions (Vertical Bar Chart) */}
            <section className="glass rounded-xl border border-[var(--color-border)] p-4 shadow-sm">
              <div className="border-b border-[var(--color-border)]/40 pb-2 mb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Top Faculty Weekly Teaching Load (Hours)
                </h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Accumulated lecture hours taught per teacher shortcode during the weekly cycle.
                </p>
              </div>

              <div className="h-[210px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teacherWorkloadBarData}
                      margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="var(--color-text-muted)" 
                        fontSize={9}
                        tickLine={false}
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="var(--color-text-muted)" 
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        unit="h"
                      />
                      <Tooltip content={<CustomRechartsTooltip />} />
                      <Bar 
                        dataKey="Hours" 
                        fill="url(#teacherWorkloadGradient)" 
                        radius={[4, 4, 0, 0]}
                        barSize={18}
                      >
                        <defs>
                          <linearGradient id="teacherWorkloadGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9a7bd9" />
                            <stop offset="100%" stopColor="#6f93da" />
                          </linearGradient>
                        </defs>
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[var(--color-text-muted)]">Loading workload hours...</div>
                )}
              </div>
            </section>

          </div>

          {/* ─── 6. HEATMAP (BOTTOM FULL-WIDTH CONSOLE) ─── */}
          <section className="glass rounded-xl border border-[var(--color-border)] p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[var(--color-border)]/40 pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Routine Analysis
                </span>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-extrabold text-[var(--color-text-primary)] font-mono leading-none">
                    {data.weeklySchedules?.length || 0} Classes
                  </h3>
                  <span className="text-[9px] font-extrabold text-[#67b66b] bg-[#67b66b]/10 border border-[#67b66b]/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    Optimal Load
                  </span>
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Weekly Class Routine Schedule Density Heatmap. Hover over a tile to view active schedules.
                </p>
              </div>

              {/* Mockup Connected Segmented Legend Bar */}
              <div className="flex items-center gap-1 text-[9px] font-bold text-[var(--color-text-secondary)] self-end">
                <span className="text-[9px] text-[var(--color-text-muted)] mr-2 mb-0.5">Active Load:</span>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-[var(--color-text-muted)] mb-0.5 font-mono">0</span>
                  <div className="h-1.5 w-8 rounded-l border border-[var(--color-border)] bg-[rgba(26,34,45,0.4)]" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-[var(--color-text-muted)] mb-0.5 font-mono">1-3</span>
                  <div className="h-1.5 w-8 border-y border-r border-[rgba(111,147,218,0.4)] bg-[rgba(111,147,218,0.22)]" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-[var(--color-text-muted)] mb-0.5 font-mono">4-7</span>
                  <div className="h-1.5 w-8 border-y border-r border-[rgba(111,147,218,0.85)] bg-[rgba(111,147,218,0.65)]" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-[var(--color-text-muted)] mb-0.5 font-mono">&gt;7</span>
                  <div className="h-1.5 w-8 rounded-r border-y border-r border-[rgba(154,123,217,0.95)] bg-[rgba(154,123,217,0.85)] shadow-[0_0_8px_rgba(154,123,217,0.3)] animate-pulse" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]/40 bg-[var(--color-bg-surface)]/20 p-5">
              <div className="min-w-[620px] space-y-4">
                {/* Heatmap rows */}
                <div className="space-y-2">
                  {heatmapData.days.map(day => (
                    <div key={day} className="grid grid-cols-[75px_repeat(9,1fr)] items-center gap-2">
                      {/* Left Row Label */}
                      <div className="text-left font-bold capitalize text-xs text-[var(--color-text-secondary)] pr-2">
                        {day === "wednesday" ? "Wed" : day === "thursday" ? "Thu" : day.slice(0, 3)}
                      </div>
                      
                      {/* Hour Cells (Solid Squares with Numbers!) */}
                      {heatmapData.hours.map(hour => {
                        const count = heatmapData.grid[day][hour] || 0;
                        const pct = heatmapData.maxDensity > 0 ? count / heatmapData.maxDensity : 0;
                        
                        let cellBg = "rgba(26, 34, 45, 0.35)";
                        let borderStyle = "border-[var(--color-border)]/30";
                        let textCol = "text-[var(--color-text-muted)]/30 font-semibold font-mono";
                        let glowStyle = "";

                        if (count > 0) {
                          if (pct <= 0.35) {
                            // Low Density - Soft Sky Blue (Muted brand accent)
                            cellBg = "rgba(111, 147, 218, 0.22)";
                            borderStyle = "border-[rgba(111,147,218,0.4)]";
                            textCol = "text-[#9fc0ff] font-extrabold font-mono";
                          } else if (pct <= 0.75) {
                            // Medium Density - Vibrant Brand Sky Blue (Accent)
                            cellBg = "rgba(111, 147, 218, 0.65)";
                            borderStyle = "border-[rgba(111,147,218,0.85)]";
                            textCol = "text-white font-extrabold font-mono";
                          } else {
                            // Peak Density - Vibrant Brand Violet (Lab)
                            cellBg = "rgba(154, 123, 217, 0.85)";
                            borderStyle = "border-[rgba(154,123,217,0.95)]";
                            textCol = "text-white font-extrabold font-mono";
                            glowStyle = "shadow-[0_0_12px_rgba(154,123,217,0.45)] animate-pulse";
                          }
                        }

                        return (
                          <div key={hour} className="relative group flex justify-center w-full">
                            <div 
                              className={`h-8 w-8 rounded-md border ${borderStyle} ${glowStyle} flex items-center justify-center text-[10px] transition-all duration-200 hover:scale-[1.15] hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer ${textCol}`}
                              style={{ backgroundColor: cellBg }}
                            >
                              {count}
                            </div>
                            
                            {/* Floating CSS Tooltip on Hover */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 animate-fade-in pointer-events-none">
                              <div className="glass rounded-lg border border-[var(--color-border)] p-2 shadow-xl text-[9px] font-bold text-center min-w-[100px] whitespace-nowrap">
                                <p className="text-[var(--color-text-primary)] capitalize mb-0.5">{day} at {formatTo12h(hour)}</p>
                                <p className="text-[var(--color-accent)] font-mono">{count} Active Classes</p>
                              </div>
                              <div className="w-2 h-2 bg-[var(--color-bg-surface)] border-r border-b border-[var(--color-border)] transform rotate-45 mx-auto -mt-1" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Column Labels printed cleanly at the bottom */}
                <div className="grid grid-cols-[75px_repeat(9,1fr)] gap-2 pt-2 border-t border-[var(--color-border)]/20">
                  <div /> {/* Row Day offset placeholder */}
                  {heatmapData.hours.map(hour => (
                    <div key={hour} className="font-mono text-[9px] font-bold text-[var(--color-text-muted)] text-center">
                      {formatTo12h(hour)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* ========================================================
            RIGHT SIDEBAR (1/3 Width): OPERATIONS & TIMELINE (mockup inspired)
           ======================================================== */}
        <aside className="w-full xl:w-[360px] p-4 sm:p-6 lg:p-8 space-y-6 flex flex-col bg-[var(--color-bg-surface)]/30">
          
          {/* ─── A. USER HEADER SECTION ─── */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)]/40 pb-5">
            <div className="flex items-center gap-3">
              {/* Profile Avatar Initial Circle */}
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-[#a371f7] flex items-center justify-center font-extrabold text-white text-sm shadow-md border border-white/10">
                A
              </div>
              <div className="space-y-0.5">
                <span className="block text-xs font-bold text-[var(--color-text-primary)]">Academic Admin</span>
                <span className="block text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] font-extrabold">Loop Registrar</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
              <button className="p-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl hover:text-white cursor-pointer" title="Reminders">
                <FiBell className="w-3.5 h-3.5" />
              </button>
              <button className="p-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl hover:text-white cursor-pointer" title="Settings">
                <FiSettings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ─── B. QUICK ACTION TOOLS ─── */}
          <section className="glass rounded-xl border border-[var(--color-border)] p-4 space-y-3 shadow-sm">
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-text-primary)] flex items-center gap-2">
              <FiZap className="text-[var(--color-warning)] w-3.5 h-3.5" />
              <span>Administrative Tools</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "action-add-routine", label: "Add Routine Block", href: "/dashboard/manage-schedule", icon: FiPlusCircle, color: "text-[var(--color-accent)]" },
                { id: "action-add-teacher-sidebar", label: "Faculty Registration", href: "/dashboard/manage-teachers", icon: FiUser, color: "text-indigo-400" },
                { id: "action-add-room-sidebar", label: "Classroom Provisioning", href: "/dashboard/manage-rooms", icon: FiHome, color: "text-purple-400" },
                { id: "action-search-routine-sidebar", label: "Search Routines List", href: "/routine", icon: FiSearch, color: "text-emerald-400" },
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <Link 
                    key={act.id}
                    id={act.id}
                    href={act.href}
                    className="flex items-center justify-between bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg p-2.5 no-underline group transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-7 w-7 rounded bg-[rgba(111,147,218,0.06)] border border-[var(--color-border)] flex items-center justify-center ${act.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                        {act.label}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-2 py-0.5 rounded opacity-60 group-hover:opacity-100 transition-opacity">
                      Open
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ─── C. LIVE TIMELINE PANELS (COMPACT) ─── */}
          <section className="glass rounded-xl border border-[var(--color-border)] p-4 space-y-3.5 shadow-sm flex-1 flex flex-col justify-between">
            
            <div className="space-y-3.5 flex-1">
              <div className="flex items-center justify-between border-b border-[var(--color-border)]/40 pb-2.5">
                <div className="space-y-0.5">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <FiClock className="text-[var(--color-accent)] w-3.5 h-3.5" />
                    <span>Live Operations</span>
                  </h3>
                  <span className="block text-[9px] text-[var(--color-text-muted)] font-medium">
                    {stats.isWeekend && !demoMode ? "Weekend Demo Feed" : "Active schedule tracking"}
                  </span>
                </div>

                <div className="text-right">
                  <span className="block text-[9px] text-[var(--color-text-muted)] font-semibold">Ticking Time</span>
                  <span className="block text-[10px] font-bold font-mono text-[var(--color-text-primary)]">{currentTimeStr}</span>
                </div>
              </div>

              {todaySchedulesWithStatus.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-[var(--color-border)]/60 rounded-lg">
                  <FiCalendar className="w-7 h-7 text-[var(--color-text-muted)] mb-2 animate-float" />
                  <span className="text-xs font-bold text-[var(--color-text-primary)]">No Classes Today</span>
                  <p className="text-[9px] text-[var(--color-text-muted)] mt-0.5">Toggle Demo Mode in header to load mock active routines.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {displayedClasses.map((s: any) => {
                    const isOngoing = s.status === "ongoing";
                    const isUpcoming = s.status === "upcoming";

                    return (
                      <div 
                        key={s.id}
                        className={`relative border rounded-lg p-2.5 transition-all duration-150 ${
                          isOngoing 
                            ? "bg-[rgba(103,182,107,0.04)] border-[rgba(103,182,107,0.25)] shadow-[0_2px_8px_rgba(103,182,107,0.04)]" 
                            : "bg-[var(--color-bg-surface)]/60 border-[var(--color-border)]/60 hover:bg-[var(--color-bg-surface)]"
                        }`}
                      >
                        {/* Glow indicator line for ongoing */}
                        {isOngoing && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-success)] rounded-l" />}

                        <div className="flex items-start justify-between gap-2.5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-[var(--color-text-primary)]">{s.course_code}</span>
                              {s.is_lab === 1 && (
                                <span className="text-[7px] font-extrabold uppercase px-1 rounded bg-[rgba(163,113,247,0.1)] text-[var(--color-lab)]">Lab</span>
                              )}
                              {isOngoing && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                              )}
                            </div>
                            <span className="block text-[10px] text-[var(--color-text-secondary)] font-semibold truncate max-w-[170px]">{s.course_name}</span>
                            
                            <div className="flex items-center gap-2 text-[9px] text-[var(--color-text-muted)] font-bold">
                              <span>Room {s.room_number}</span>
                              <span>•</span>
                              <span>Batch {s.batch_name} ({s.section})</span>
                            </div>
                          </div>

                          <div className="text-right space-y-0.5">
                            <span className="block text-[10px] font-bold font-mono text-[var(--color-text-primary)]">{s.start_time}</span>
                            {isOngoing ? (
                              <div className="w-16 space-y-0.5">
                                <span className="block text-[8px] font-bold text-[var(--color-success)]">{s.progress}% Done</span>
                                <div className="h-0.5 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
                                  <div className="h-full bg-[var(--color-success)] rounded-full" style={{ width: `${s.progress}%` }} />
                                </div>
                              </div>
                            ) : isUpcoming ? (
                              <span className="block text-[8px] text-[var(--color-accent)] font-extrabold tracking-wider uppercase">Scheduled</span>
                            ) : (
                              <span className="block text-[8px] text-[var(--color-text-muted)] font-extrabold tracking-wider uppercase">Done</span>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination/Toggle for Sidebar Timeline list */}
            {todaySchedulesWithStatus.length > 5 && (
              <div className="border-t border-[var(--color-border)]/40 pt-2.5 flex justify-center">
                <button
                  onClick={() => setShowAllClasses(!showAllClasses)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--color-accent)] hover:text-white bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <span>{showAllClasses ? "Show Less" : `Show All today (${todaySchedulesWithStatus.length})`}</span>
                  {showAllClasses ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>
            )}

            {/* Compact Upcoming summary list */}
            {upcomingClasses.length > 0 && !showAllClasses && (
              <div className="bg-[rgba(111,147,218,0.02)] border border-[rgba(111,147,218,0.12)] rounded-lg p-2.5 space-y-1.5">
                <span className="block text-[8px] font-extrabold uppercase tracking-wider text-[var(--color-accent)]">Next Scheduled:</span>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-[var(--color-text-primary)] truncate max-w-[130px]">{upcomingClasses[0].course_code} — Room {upcomingClasses[0].room_number}</span>
                  <span className="font-mono font-bold text-[var(--color-accent)]">{upcomingClasses[0].start_time}</span>
                </div>
              </div>
            )}

          </section>

          {/* ─── D. RECENT ACTIVITY LOGS PANEL ─── */}
          <section className="glass rounded-xl border border-[var(--color-border)] p-4 shadow-sm flex flex-col justify-between">
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-text-primary)] mb-3 flex items-center gap-1.5">
              <FiActivity className="text-[var(--color-accent)] w-3.5 h-3.5" />
              <span>Administrative Logs</span>
            </h3>

            <div className="overflow-y-auto max-h-[170px] pr-1 space-y-3">
              {data.recentActivity && data.recentActivity.length > 0 ? (
                <div className="relative pl-3.5 border-l border-[var(--color-border)]/60 ml-1 py-0.5 space-y-3">
                  {data.recentActivity.map((log: any, idx: number) => {
                    let text = "";
                    if (log.type === "schedule") {
                      text = `Assigned routine: ${log.details1} with ${log.details2} in Room ${log.details3} (Batch ${log.details4})`;
                    } else if (log.type === "teacher") {
                      text = `Staff assigned: ${log.details1} (${log.details2}) registered in ${log.details3} dept`;
                    } else if (log.type === "room") {
                      text = `Room setup: Room ${log.details1} (${log.details2}) provisioned in ${log.details3}`;
                    }

                    return (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[18px] top-1.5 h-1.5 w-1.5 rounded-full border ${
                          log.type === 'schedule' 
                            ? "bg-rose-400 border-rose-400" 
                            : log.type === 'room' 
                              ? "bg-purple-400 border-purple-400" 
                              : "bg-indigo-400 border-indigo-400"
                        }`} />
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-[var(--color-text-primary)] font-semibold leading-relaxed">
                            {text}
                          </p>
                          <span className="block text-[8px] text-[var(--color-text-muted)] font-mono font-bold">
                            {getRelativeTime(log.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 text-[var(--color-text-muted)]">
                  <FiActivity className="w-5 h-5 opacity-30 mb-2.5" />
                  <p className="text-[10px] font-semibold">No recent logs found.</p>
                </div>
              )}
            </div>
          </section>

        </aside>

      </div>

    </div>
  );
}
