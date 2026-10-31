import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Zap, Calendar, Activity, Info, BarChart2 } from 'lucide-react';
import { api } from '../../lib/api';

interface ContributionHeatmapProps {
  heatmapData: {
    dateScores: Record<string, number>;
    currentStreak: number;
    longestStreak: number;
    activeDays: number;
    thisMonthActivity: number;
  };
  onRefresh?: () => void;
}

interface DayCell {
  dateStr: string;
  displayDate: string;
  score: number;
  level: number;
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ heatmapData, onRefresh }) => {
  const [hoveredDay, setHoveredDay] = useState<DayCell | null>(null);
  const [viewMode, setViewMode] = useState<'year' | 'month'>('year');
  const [liveScores, setLiveScores] = useState<Record<string, number>>(heatmapData.dateScores || {});

  // Sync with prop updates & listen to real-time activity events
  useEffect(() => {
    setLiveScores(heatmapData.dateScores || {});
  }, [heatmapData.dateScores]);

  useEffect(() => {
    const handleActivityLogged = () => {
      // Re-fetch analytics dynamically
      if (onRefresh) {
        onRefresh();
      } else {
        api.get('/profile/dashboard').then((res) => {
          if (res.data?.heatmap?.dateScores) {
            setLiveScores(res.data.heatmap.dateScores);
          }
        }).catch(() => {});
      }
    };

    window.addEventListener('algovis-activity-logged', handleActivityLogged);
    return () => window.removeEventListener('algovis-activity-logged', handleActivityLogged);
  }, [onRefresh]);

  // Compute 52 weeks (365 days) grid
  const { weeksGrid, monthHeaders } = useMemo(() => {
    const today = new Date();
    const resultWeeks: DayCell[][] = [];
    let currentWeek: DayCell[] = [];
    const headers: { monthName: string; weekIndex: number }[] = [];

    const totalDays = viewMode === 'year' ? 364 : 29;
    const startDate = new Date();
    startDate.setDate(today.getDate() - totalDays);

    let lastMonth = -1;

    for (let i = 0; i <= totalDays; i++) {
      const curDate = new Date(startDate);
      curDate.setDate(startDate.getDate() + i);
      const dateStr = curDate.toISOString().split('T')[0];

      // Exact score from real DB activity
      const score = liveScores[dateStr] || 0;

      // 5 Intensity levels
      let level = 0;
      if (score === 1) level = 1; // Low
      else if (score >= 2 && score <= 3) level = 2; // Medium
      else if (score >= 4 && score <= 6) level = 3; // High
      else if (score >= 7) level = 4; // Very High

      const displayDate = curDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const monthIndex = curDate.getMonth();
      if (monthIndex !== lastMonth) {
        headers.push({
          monthName: curDate.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex: resultWeeks.length,
        });
        lastMonth = monthIndex;
      }

      currentWeek.push({ dateStr, displayDate, score, level });

      if (currentWeek.length === 7 || i === totalDays) {
        resultWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return { weeksGrid: resultWeeks, monthHeaders: headers };
  }, [liveScores, viewMode]);

  const levelStyles = [
    'bg-white/[0.04] border-white/5 hover:border-white/20', // Level 0: No activity
    'bg-purple-950/70 border-purple-500/40 text-purple-300 hover:scale-125 shadow-sm', // Level 1: Low (1)
    'bg-purple-800/80 border-purple-400/60 text-purple-200 hover:scale-125 shadow-purple-500/30 shadow-md', // Level 2: Medium (2-3)
    'bg-purple-600 border-purple-300 text-white hover:scale-125 shadow-purple-500/50 shadow-lg', // Level 3: High (4-6)
    'bg-gradient-to-tr from-purple-500 via-indigo-500 to-emerald-400 border-white text-white hover:scale-125 shadow-emerald-400/50 shadow-xl', // Level 4: Very High (7+)
  ];

  return (
    <section className="w-full bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
      {/* Top Metrics Row ABOVE Heatmap */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Current Streak
            </span>
            <span className="text-xl font-black text-foreground">
              {heatmapData.currentStreak} <span className="text-xs font-bold text-amber-400">days 🔥</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Longest Streak
            </span>
            <span className="text-xl font-black text-foreground">
              {heatmapData.longestStreak} <span className="text-xs font-bold text-purple-400">days ⚡</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Total Active Days
            </span>
            <span className="text-xl font-black text-foreground">
              {heatmapData.activeDays} <span className="text-xs font-bold text-emerald-400">days 📅</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Month Activity
            </span>
            <span className="text-xl font-black text-foreground">
              {heatmapData.thisMonthActivity} <span className="text-xs font-bold text-blue-400">events ⚡</span>
            </span>
          </div>
        </div>
      </div>

      {/* Heatmap Section Header & View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Activity Contribution Graph</h3>
        </div>

        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('year')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'year' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Year
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'month' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        {/* Month Header */}
        <div className="flex text-[11px] font-bold text-muted-foreground mb-2.5 min-w-[760px] justify-between px-1">
          {monthHeaders.map((h, idx) => (
            <span key={idx}>{h.monthName}</span>
          ))}
        </div>

        {/* 52-Week Cells */}
        <div className="flex gap-1.5 min-w-[760px] justify-between">
          {weeksGrid.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1.5">
              {week.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3.5 h-3.5 rounded-[4px] border transition-all duration-150 cursor-pointer ${levelStyles[day.level]}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Heatmap Footer Legend & Hover Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-muted-foreground">
          <div>
            {hoveredDay ? (
              <span className="text-foreground font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping inline-block" />
                {hoveredDay.displayDate}:{' '}
                <span className="text-purple-300 font-black">
                  {hoveredDay.score > 0 ? `${hoveredDay.score} action${hoveredDay.score > 1 ? 's' : ''}` : 'No activity'}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                Automatically derived from database problem, topic, and visualizer actions.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span>Less</span>
            <div className="flex gap-1 items-center">
              {levelStyles.map((style, idx) => (
                <div key={idx} className={`w-3 h-3 rounded-[3px] border ${style}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
};
