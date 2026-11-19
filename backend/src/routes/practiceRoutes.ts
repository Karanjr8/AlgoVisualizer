import { Router } from 'express';
import { optionalAuth } from '../middlewares/auth';
import {
  savePracticeAttempt,
  getPracticeHistory,
  generateDebugChallenge,
  runDebugCode,
  evaluateDebugSolution,
  generateSpeedRun,
  evaluateSpeedRun,
  generateComplexityChallenges,
  evaluateComplexityAnswer,
} from '../controllers/practiceController';

const router = Router();

// General practice endpoints
router.post('/attempts', optionalAuth, savePracticeAttempt);
router.get('/history', optionalAuth, getPracticeHistory);

// 1. Debug The Algorithm routes
router.post('/debug/generate', optionalAuth, generateDebugChallenge);
router.post('/debug/run', optionalAuth, runDebugCode);
router.post('/debug/evaluate', optionalAuth, evaluateDebugSolution);

// 2. Speed Run routes
router.post('/speedrun/generate', optionalAuth, generateSpeedRun);
router.post('/speedrun/evaluate', optionalAuth, evaluateSpeedRun);

// 3. Complexity Challenges routes
router.post('/complexity/generate', optionalAuth, generateComplexityChallenges);
router.post('/complexity/evaluate', optionalAuth, evaluateComplexityAnswer);

export default router;
