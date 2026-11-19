import { Router } from 'express';
import { optionalAuth } from '../middlewares/auth';
import {
  createInterview,
  getInterview,
  submitAnswer,
  transcribeAudio,
  endInterview,
  getInterviewReport,
  listUserInterviews,
  retryReport,
} from '../controllers/interviewController';

const router = Router();

// Apply optionalAuth across interview endpoints to link authenticated users while keeping guest practice available
router.post('/', optionalAuth, createInterview);
router.get('/', optionalAuth, listUserInterviews);
router.get('/:id', optionalAuth, getInterview);
router.post('/:id/answers', optionalAuth, submitAnswer);
router.post('/:id/transcribe-audio', optionalAuth, transcribeAudio);
router.post('/:id/end', optionalAuth, endInterview);
router.post('/:id/retry-report', optionalAuth, retryReport);
router.get('/:id/report', optionalAuth, getInterviewReport);

export default router;
