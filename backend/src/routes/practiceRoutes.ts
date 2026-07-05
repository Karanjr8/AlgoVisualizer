import { Router } from 'express';
import { savePracticeAttempt } from '../controllers/practiceController';

const router = Router();

router.post('/attempts', savePracticeAttempt);

export default router;
