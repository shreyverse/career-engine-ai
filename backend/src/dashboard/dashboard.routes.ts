import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getDashboardData } from './dashboard.controller';

const router = Router();

router.use(authMiddleware);
router.get('/', getDashboardData);

export default router;
