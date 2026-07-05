import { Router } from 'express';
import { getAllAlgorithms, getAlgorithmBySlug } from '../controllers/algorithmController';

const router = Router();

router.get('/', getAllAlgorithms);
router.get('/:slug', getAlgorithmBySlug);

export default router;
