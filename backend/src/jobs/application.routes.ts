import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createApplication,
  updateApplication,
  getApplications,
  deleteApplication,
} from './jobs.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getApplications);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
