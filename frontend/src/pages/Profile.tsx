import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/api';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton';
import { CompactHeader } from '../components/profile/CompactHeader';
import { ContributionHeatmap } from '../components/profile/ContributionHeatmap';
import { LearningProgressRows } from '../components/profile/LearningProgressRows';
import { RecentActivityTimeline } from '../components/profile/RecentActivityTimeline';

export function Profile() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile/dashboard');
      if (res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load real profile dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    // Listen to real-time live activity events
    const handleActivityLogged = () => {
      fetchDashboard();
    };

    window.addEventListener('algovis-activity-logged', handleActivityLogged);
    return () => window.removeEventListener('algovis-activity-logged', handleActivityLogged);
  }, [user]);

  if (loading && !dashboardData) {
    return (
      <WorkspaceLayout>
        <div className="w-full flex flex-col gap-6 text-left">
          <div className="bg-card/40 border border-white/10 rounded-2xl p-6 flex items-center gap-6 shadow-xl">
            <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-48 rounded-xl" />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </div>
          </div>
          <SkeletonCard />
        </div>
      </WorkspaceLayout>
    );
  }

  // 100% Real Database Derived Profile Metrics
  const profile = dashboardData?.profile || {
    name: user?.fullName || user?.name || user?.username || 'Algorithm Scholar',
    email: user?.email || '',
    avatar: user?.avatar || null,
    createdAt: user?.createdAt || new Date().toISOString(),
    algorithmsCompleted: user?.completedTopics?.length || 0,
    currentStreak: user?.streak || 0,
    longestStreak: user?.longestStreak || 0,
    learningHours: user?.learningHours || 0,
  };

  const heatmap = dashboardData?.heatmap || {
    dateScores: {},
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    activeDays: profile.currentStreak > 0 ? Math.max(1, profile.currentStreak) : 0,
    thisMonthActivity: 0,
  };

  const learningProgress = dashboardData?.learningProgress || [];
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <WorkspaceLayout>
      <div className="w-full flex flex-col gap-8 text-left pb-16">
        {/* ROW 1: REAL USER PROFILE HEADER */}
        <CompactHeader profile={profile} />

        {/* ROW 2: GITHUB-STYLE CONTRIBUTION HEATMAP & STREAKS */}
        <ContributionHeatmap heatmapData={heatmap} onRefresh={fetchDashboard} />

        {/* ROW 3: REAL TOPIC LEARNING PROGRESS BREAKDOWN */}
        <div className="w-full">
          <LearningProgressRows progressItems={learningProgress} />
        </div>

        {/* ROW 4: REAL RECENT USER ACTIVITY TIMELINE */}
        <RecentActivityTimeline activities={recentActivity} />
      </div>
    </WorkspaceLayout>
  );
}
