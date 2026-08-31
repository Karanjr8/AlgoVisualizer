import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/api';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton';

// Streamlined Subcomponents
import { CompactHeader } from '../components/profile/CompactHeader';
import { ContributionHeatmap } from '../components/profile/ContributionHeatmap';
import { LearningProgressRows } from '../components/profile/LearningProgressRows';
import { ContinueLearningCards } from '../components/profile/ContinueLearningCards';
import { RecentActivityTimeline } from '../components/profile/RecentActivityTimeline';

export function Profile() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/profile/dashboard');
        if (isMounted && res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
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

  // Fallback state if server data not fetched
  const profile = dashboardData?.profile || {
    name: user?.username || 'Algorithm Scholar',
    email: user?.email || 'scholar@algovis.io',
    avatar: null,
    createdAt: new Date().toISOString(),
    algorithmsCompleted: 14,
    currentStreak: 7,
    longestStreak: 14,
    learningHours: 24.5,
  };

  const heatmap = dashboardData?.heatmap || {
    dateScores: {},
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    activeDays: 38,
    thisMonthActivity: 42,
  };

  const learningProgress = dashboardData?.learningProgress || [];
  const continueLearning = dashboardData?.continueLearning || [];
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <WorkspaceLayout>
      <div className="w-full flex flex-col gap-8 text-left pb-16">
        {/* ROW 1: COMPACT PROFILE HEADER */}
        <CompactHeader profile={profile} />

        {/* ROW 2: MAIN CONTRIBUTION HEATMAP (HERO COMPONENT) */}
        <ContributionHeatmap heatmapData={heatmap} />

        {/* ROW 3: LEARNING PROGRESS & CONTINUE LEARNING (2-COLUMN GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <LearningProgressRows progressItems={learningProgress} />
          </div>
          <div className="lg:col-span-5">
            <ContinueLearningCards items={continueLearning} />
          </div>
        </div>

        {/* ROW 4: RECENT ACTIVITY */}
        <RecentActivityTimeline activities={recentActivity} />
      </div>
    </WorkspaceLayout>
  );
}
