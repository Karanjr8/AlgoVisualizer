import { useState, useMemo } from 'react';
import { Flame, Zap, Calendar, Activity } from 'lucide-react';

interface ContributionHeatmapProps {
  heatmapData: {
    dateScores: Record<string, number>;
    currentStreak: number;
    longestStreak: number;
    activeDays: number;
    thisMonthActivity: number;
  };
}

interface DayCell {
  dateStr: string;
  displayDate: string;
  score: number;
  level: number;
}

export const ContributionHeatmap = ({ heatmapData }: ContributionHeatmapProps) => {
  const [hoveredDay, setHoveredDay] = useState<DayCell | null>(null);

  const { weeksGrid } = useMemo(() => {
    const today = new Date();
    const resultWeeks: DayCell[][] = [];
    let currentWeek: DayCell[] = [];

    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);

    for (let i = 0; i < 365; i++) {
      const curDate = new Date(startDate);
      curDate.setDate(startDate.getDate() + i);
      const dateStr = curDate.toISOString().split('T')[0];

      const score = heatmapData.dateScores[dateStr] || 0;
      let level = 0;
      if (score === 1) level = 1;
      else if (score === 2 || score === 3) level = 2;
      else if (score >= 4 && score <= 6) level = 3;
      else if (score > 6) level = 4;

      const displayDate = curDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      currentWeek.push({ dateStr, displayDate, score, level });

      if (currentWeek.length === 7 || i === 364) {
        resultWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return { weeksGrid: resultWeeks };
  }, [heatmapData]);

  const levelStyles = [
    'bg-white/5 border-white/10 hover:border-white/30', // 0
    'bg-purple-950/60 border-purple-500/30 text-purple-400 hover:scale-125 shadow-sm', // 1
    'bg-purple-800/70 border-purple-400/50 text-purple-300 hover:scale-125 shadow-purple-500/20 shadow-md', // 2
    'bg-purple-600 border-purple-300 text-white hover:scale-125 shadow-purple-500/40 shadow-lg', // 3
    'bg-gradient-to-tr from-purple-500 via-indigo-500 to-emerald-400 border-white/60 text-white hover:scale-125 shadow-emerald-400/50 shadow-xl', // 4
  ];

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <section className="w-full bg-card/60 backdrop-blur-md transform-gpu border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
      {/* Top Metrics Row ABOVE Heatmap */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Current Streak
            </span>
            <span className="text-xl font-black text-foreground">
              {heatmapData.currentStreak} <span className="text-xs font-bold text-amber-400">days 🔥</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Longest Streak
            </span>
            <span className="text-xl font-black text-foreground">
              {heatmapData.longestStreak} <span className="text-xs font-bold text-purple-400">days ⚡</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Active Days
            </span>
            <span className="text-xl font-black text-foreground">
              {heatmapData.activeDays} <span className="text-xs font-bold text-emerald-400">days 📅</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              This Month Activity
            </span>
            <span className="text-xl font-black text-foreground">
              {heatmapData.thisMonthActivity} <span className="text-xs font-bold text-blue-400">events ⚡</span>
            </span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        {/* Month Header */}
        <div className="flex text-xs font-bold text-muted-foreground mb-2.5 min-w-[760px] justify-between px-1">
          {monthLabels.map((m, idx) => (
            <span key={idx}>{m}</span>
          ))}
        </div>

        {/* Weeks */}
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-white/5 text-xs font-semibold text-muted-foreground">
          <div>
            {hoveredDay ? (
              <span className="text-foreground font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping inline-block" />
                {hoveredDay.displayDate}:{' '}
                <span className="text-purple-300 font-black">
                  {hoveredDay.score > 0 ? `${hoveredDay.score} activity score` : 'No activity logged'}
                </span>
              </span>
            ) : (
              <span>Daily contribution score from visualizer, practice, and interview sessions</span>
            )}
          </div>

          <div className="flex items-center gap-2">
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
