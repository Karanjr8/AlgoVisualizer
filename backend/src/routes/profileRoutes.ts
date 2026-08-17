import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { 
  getUserProfile, 
  getUserProgress, 
  getUserPracticeStats,
  getUserFeed,
  getUserRecommendations,
  updateUserProfile
} from '../controllers/profileController';

const router = Router();

// Apply auth middleware to all profile routes
router.use(requireAuth);

router.get('/', getUserProfile);
router.put('/', updateUserProfile);
router.get('/progress', getUserProgress);
router.get('/practice-stats', getUserPracticeStats);
router.get('/feed', getUserFeed);
router.get('/recommendations', getUserRecommendations);

export default router;
