import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { 
  getUserProfile, 
  getUserProgress, 
  getUserPracticeStats,
  getUserFeed,
  getUserRecommendations,
  updateUserProfile,
  logUserEvent,
  recordUserActivity,
  getDashboardData
} from '../controllers/profileController';

const router = Router();

// Apply auth middleware to all profile routes
router.use(requireAuth);

router.get('/', getUserProfile);
router.put('/', updateUserProfile);
router.get('/dashboard', getDashboardData);
router.post('/events', logUserEvent);
router.post('/activity', recordUserActivity);
router.get('/progress', getUserProgress);
router.get('/practice-stats', getUserPracticeStats);
router.get('/feed', getUserFeed);
router.get('/recommendations', getUserRecommendations);

export default router;
