import { Router } from 'express';
import { getAllAchievements } from '../controllers/achievementController';

const router = Router();

router.get('/', getAllAchievements);

export default router;
