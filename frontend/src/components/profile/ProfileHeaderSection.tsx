import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit3, Share2, Settings, Flame, Zap, Award, Check, Sparkles, Trophy, ShieldCheck } from 'lucide-react';

interface ProfileHeaderSectionProps {
  profile: any;
  user: any;
  onOpenEditModal: () => void;
  onOpenSettingsModal: () => void;
}

export const ProfileHeaderSection = ({
  profile,
  user,
  onOpenEditModal,
  onOpenSettingsModal,
}: ProfileHeaderSectionProps) => {
  const [copied, setCopied] = useState(false);

  const name = profile?.name || user?.username || 'Algorithm Scholar';
  const username = profile?.username || user?.username || 'visualizer';
  const email = profile?.email || user?.email || 'scholar@algovis.io';
  const avatar = profile?.avatar;
  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'August 2025';

  const level = profile?.level || 1;
  const xp = profile?.xp || 1450;
  const streak = profile?.currentStreak || 7;

  // Rank calculation based on level & XP
  let rank = 'Novice Visualizer';
  if (level >= 15 || xp >= 5000) rank = 'Grandmaster Visualizer';
  else if (level >= 10 || xp >= 3000) rank = 'DP Specialist';
  else if (level >= 6 || xp >= 1500) rank = 'Graph Architect';
  else if (level >= 3 || xp >= 500) rank = 'Algorithm Apprentice';

  // Badges Earned Check Logic
  const allEarnedBadges = [
    { name: 'Consistency Badge', icon: Flame, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', earned: streak >= 3 },
    { name: 'Graph Master', icon: Trophy, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', earned: level >= 4 || xp >= 1000 },
    { name: 'DP Specialist', icon: Zap, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', earned: level >= 6 || xp >= 1500 },
    { name: 'Recursion Expert', icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', earned: true },
    { name: 'Interview Ready', icon: Award, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', earned: level >= 2 },
  ];

  const earnedBadges = allEarnedBadges.filter((b) => b.earned);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full relative bg-gradient-to-r from-purple-950/60 via-card/80 to-blue-950/40 border border-white/10 rounded-3xl p-6 lg:p-8 backdrop-blur-md transform-gpu shadow-2xl overflow-hidden">
      {/* Background Accent Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      {/* Main Flex Layout: Horizontal on Desktop */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
        
        {/* Left Column: Avatar & Primary Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
          {/* Avatar frame */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-primary via-purple-500 to-blue-500 p-[3px] shadow-2xl shadow-purple-500/20">
              <div className="w-full h-full bg-card rounded-[22px] overflow-hidden flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-blue-900/60 flex items-center justify-center text-purple-300">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>

            <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-xl bg-purple-600 border border-purple-300 text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3 fill-white" /> Lvl {level}
            </div>
          </div>

          {/* User Text Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">{name}</h1>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {rank}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground">
              <span className="font-mono text-primary font-black">@{username}</span>
              <span>•</span>
              <span>{email}</span>
              <span>•</span>
              <span>Joined {joinDate}</span>
            </div>

            {/* Level XP Progress Bar */}
            <div className="pt-2 w-full max-w-md space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-muted-foreground">Level {level} Progress</span>
                <span className="text-purple-400 font-black">{xp} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((xp % 1000) / 10, 100)}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500"
                />
              </div>
            </div>

            {/* Earned Badges Row */}
            {earnedBadges.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1">Earned Badges:</span>
                {earnedBadges.map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={idx}
                      className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${badge.color}`}
                      title={`${badge.name} (Unlocked)`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{badge.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
          <button
            onClick={onOpenEditModal}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-blue-600 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>

          <button
            onClick={handleShare}
            className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs sm:text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-purple-400" /> Share Profile
              </>
            )}
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            title="Dashboard Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};
