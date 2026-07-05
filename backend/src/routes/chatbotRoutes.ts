import { Router } from 'express';
import { chat } from '../controllers/chatbotController';

const router = Router();

router.post('/', chat);

export default router;
