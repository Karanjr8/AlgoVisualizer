import { User, Flame, Zap, Clock, CheckCircle2 } from 'lucide-react';

interface CompactHeaderProps {
  profile: {
    name: string;
    email: string;
    avatar?: string | null;
    createdAt?: string;
    algorithmsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    learningHours: number;
  };
}

export const CompactHeader = ({ profile }: CompactHeaderProps) => {
  const joinDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Member';

  return (
    <div className="w-full bg-card/60 backdrop-blur-md transform-gpu border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Left: Avatar & Basic Info */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-blue-500 p-[2px] shrink-0 shadow-md">
          <div className="w-full h-full bg-card rounded-[14px] overflow-hidden flex items-center justify-center">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground truncate">
            {profile.name}
          </h1>
          <p className="text-xs font-semibold text-muted-foreground truncate">
            {profile.email} • Joined {joinDate}
          </p>
        </div>
      </div>

      {/* Right: Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
        <div className="bg-background/60 border border-white/5 rounded-xl px-4 py-2.5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-emerald-400 mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
          </div>
          <span className="text-lg font-black text-foreground">{profile.algorithmsCompleted}</span>
        </div>

        <div className="bg-background/60 border border-white/5 rounded-xl px-4 py-2.5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-amber-500 mb-0.5">
            <Flame className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Streak</span>
          </div>
          <span className="text-lg font-black text-foreground">{profile.currentStreak}d</span>
        </div>

        <div className="bg-background/60 border border-white/5 rounded-xl px-4 py-2.5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-purple-400 mb-0.5">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Longest</span>
          </div>
          <span className="text-lg font-black text-foreground">{profile.longestStreak}d</span>
        </div>

        <div className="bg-background/60 border border-white/5 rounded-xl px-4 py-2.5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-blue-400 mb-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Time</span>
          </div>
          <span className="text-lg font-black text-foreground">{profile.learningHours.toFixed(1)}h</span>
        </div>
      </div>
    </div>
  );
};
