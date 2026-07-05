import { Router } from 'express';
import { 
  getUserProfile, 
  getUserProgress, 
  getUserPracticeStats,
  getUserFeed,
  getUserRecommendations
} from '../controllers/profileController';

const router = Router();

router.get('/:id', getUserProfile);
router.get('/:id/progress', getUserProgress);
router.get('/:id/practice-stats', getUserPracticeStats);
router.get('/:id/feed', getUserFeed);
router.get('/:id/recommendations', getUserRecommendations);

export default router;
