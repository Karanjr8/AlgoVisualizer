import { Router } from 'express';
import { getRoadmapNodes } from '../controllers/roadmapController';

const router = Router();

router.get('/', getRoadmapNodes);

export default router;
