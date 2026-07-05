import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Zap, Clock, CheckCircle, Flame, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

// Types based on our backend responses
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
    // If not logged in, we can't fetch. ProtectedRoute handles redirection anyway.
    if (!user) return;

    const fetchAll = async () => {
      try {
        const [profRes] = await Promise.all([
          fetch(`http://localhost:5000/api/profile/${user.id}`)
        ]);

        if (profRes.ok) setProfile(await profRes.json());
        // setRecs(await recsRes.json());
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
          <div className="w-12 h-12 border-4 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-mono text-sm tracking-widest">LOADING PROFILE_</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="bg-[#141517] p-8 rounded-2xl border border-red-500/30 text-center max-w-md">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400">We couldn't load your profile data. Please ensure you are logged in and the server is running.</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <WorkspaceLayout>
      <div className="space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-[#141517] to-[#0d0e10] border border-[#2a2b2f] rounded-3xl p-8 overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#00ff88] p-[2px]">
              <div className="w-full h-full bg-[#141517] rounded-2xl flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{profile.name}</h1>
              <div className="flex items-center gap-4 text-gray-400 mb-6">
                <span className="font-mono text-[#00f0ff]">@{profile.username}</span>
                <span>•</span>
                <span>Joined {joinDate}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#0d0e10] rounded-xl p-3 border border-[#2a2b2f]">
                  <div className="flex items-center gap-2 text-orange-400 mb-1">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{profile.currentStreak} <span className="text-sm text-gray-500 font-normal">days</span></div>
                </div>
                
                <div className="bg-[#0d0e10] rounded-xl p-3 border border-[#2a2b2f]">
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Learning</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{profile.learningHours} <span className="text-sm text-gray-500 font-normal">hrs</span></div>
                </div>

                <div className="bg-[#0d0e10] rounded-xl p-3 border border-[#2a2b2f]">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Level {profile.level}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{profile.xp} <span className="text-sm text-gray-500 font-normal">XP</span></div>
                </div>

                <div className="bg-[#0d0e10] rounded-xl p-3 border border-[#2a2b2f]">
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Mastery</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{profile.stats.overallProgress}%</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

          </div>

    </WorkspaceLayout>
  );
}
