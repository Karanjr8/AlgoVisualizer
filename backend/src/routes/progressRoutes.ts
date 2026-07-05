import { Router } from 'express';
import { getProgress, updateProgress } from '../controllers/progressController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getProgress);
router.post('/:algorithmId', updateProgress);

export default router;
