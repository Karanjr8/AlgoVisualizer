import { Router } from 'express';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getPlatformAnalytics,
  createTopic,
  createQuestion,
} from '../controllers/adminController';
import { requireAuth, requireAdmin } from '../middlewares/auth';

const router = Router();

// All admin routes require valid auth AND admin role
router.use(requireAuth, requireAdmin);

router.get('/users', getUsers);
router.patch('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);
router.get('/analytics', getPlatformAnalytics);
router.post('/topics', createTopic);
router.post('/questions', createQuestion);

export default router;
