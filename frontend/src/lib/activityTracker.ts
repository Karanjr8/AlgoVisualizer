import { api } from './api';
import { useAuthStore } from '../store/useAuthStore';

export type ActivityType =
  | 'TOPIC_OPENED'
  | 'TOPIC_COMPLETED'
  | 'PROBLEM_OPENED'
  | 'PROBLEM_COMPLETED'
  | 'VISUALIZER_USED'
  | 'PRACTICE_COMPLETED'
  | 'INTERVIEW_COMPLETED'
  | 'ROADMAP_MILESTONE'
  | 'PLAYGROUND_USED';

export interface TrackActivityParams {
  type: ActivityType;
  topicId?: string;
  problemId?: string;
  duration?: number;
  details?: string;
}

export const trackActivity = async ({
  type,
  topicId,
  problemId,
  duration = 0,
  details,
}: TrackActivityParams) => {
  const { token, checkAuth } = useAuthStore.getState();

  // If user is guest / not authenticated, skip DB logging
  if (!token) return;

  try {
    const res = await api.post('/profile/activity', {
      type,
      topicId,
      problemId,
      duration,
      details,
    });

    // Notify listeners across UI for instant live update without manual refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('algovis-activity-logged', {
          detail: {
            type,
            topicId,
            problemId,
            stats: res.data?.stats,
          },
        })
      );
    }

    // Refresh user session state in Zustand store
    checkAuth();

    return res.data;
  } catch (error) {
    console.warn('Failed to track activity:', error);
  }
};
