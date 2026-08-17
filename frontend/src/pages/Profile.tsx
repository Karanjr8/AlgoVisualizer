import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Zap, Clock, CheckCircle, Flame, Shield, Trophy, Award, Activity, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

interface ProfileStats {
  algorithmsLearned: number;
  practiceSessions: number;
  questionsSolved: number;
  interviewSimulations: number;
  overallProgress: number;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  currentStreak: number;
  learningHours: number;
  xp: number;
  level: number;
  createdAt: string;
  stats: ProfileStats;
  achievements: { achievement: any; unlockedAt: string }[];
}

export function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        const [profRes] = await Promise.all([
          fetch(`http://localhost:5000/api/profile/${user.id}`)
        ]);

        if (profRes.ok) setProfile(await profRes.json());
      } catch (e) {
        console.error('Failed to load profile data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="bg-card p-8 rounded-3xl border border-destructive/30 text-center max-w-md shadow-lg">
          <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-black text-foreground mb-2">Profile Not Found</h2>
          <p className="text-sm text-muted-foreground font-medium">We couldn't load your profile data. Please ensure you are logged in and the server is running.</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <WorkspaceLayout>
      <div className="w-full flex flex-col gap-8 text-left">
        
        {/* Header Dashboard Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-card/60 backdrop-blur-md border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-blue-500 p-[2px] shrink-0 shadow-md">
              <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <div className="flex flex-col gap-1">
                <h1 className="type-page-title">{profile.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-muted-foreground">
                  <span className="font-mono text-primary font-bold">@{profile.username}</span>
                  <span>•</span>
                  <span>Member since {joinDate}</span>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-background/80 rounded-2xl p-3.5 border border-border/70 text-left">
                  <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-foreground">{profile.currentStreak} <span className="text-xs text-muted-foreground font-semibold">days</span></div>
                </div>
                
                <div className="bg-background/80 rounded-2xl p-3.5 border border-border/70 text-left">
                  <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Learning</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-foreground">{profile.learningHours} <span className="text-xs text-muted-foreground font-semibold">hrs</span></div>
                </div>

                <div className="bg-background/80 rounded-2xl p-3.5 border border-border/70 text-left">
                  <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Lvl {profile.level}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-foreground">{profile.xp} <span className="text-xs text-muted-foreground font-semibold">XP</span></div>
                </div>

                <div className="bg-background/80 rounded-2xl p-3.5 border border-border/70 text-left">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Mastery</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-foreground">{profile.stats.overallProgress}%</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Content Grid (2 Columns: Left 70%, Right 30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Main Stats & Achievements Panel */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Detailed Analytics Grid */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Learning Analytics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card border border-border/80 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Algorithms Learned</span>
                    <span className="text-2xl font-black text-foreground">{profile.stats.algorithmsLearned}</span>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-card border border-border/80 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Practice Sessions</span>
                    <span className="text-2xl font-black text-foreground">{profile.stats.practiceSessions}</span>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-card border border-border/80 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Questions Solved</span>
                    <span className="text-2xl font-black text-foreground">{profile.stats.questionsSolved}</span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-card border border-border/80 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Mock Interviews</span>
                    <span className="text-2xl font-black text-foreground">{profile.stats.interviewSimulations}</span>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Unlocked Badges & Achievements
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.achievements && profile.achievements.length > 0 ? (
                  profile.achievements.map((ach, idx) => (
                    <div key={idx} className="bg-card border border-border/80 p-4 rounded-2xl flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-sm font-bold text-foreground truncate">{ach.achievement.title || 'Mastery Badge'}</span>
                        <span className="text-xs text-muted-foreground font-medium truncate">{ach.achievement.description || 'Unlocked through practice'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 bg-card border border-border/80 rounded-2xl p-6 text-center text-muted-foreground text-sm font-medium">
                    Complete your first algorithm visualization or practice session to unlock mastery badges!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar Status Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm flex flex-col gap-4 text-left">
              <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-2">
                Account Summary
              </h3>

              <div className="flex flex-col gap-2.5 text-xs font-semibold">
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Account Status</span>
                  <span className="text-emerald-400 font-bold">Active Scholar</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground font-bold truncate max-w-[160px]">{profile.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Current Level</span>
                  <span className="text-purple-400 font-bold">Level {profile.level}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Total XP</span>
                  <span className="text-amber-400 font-bold">{profile.xp} Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
}
