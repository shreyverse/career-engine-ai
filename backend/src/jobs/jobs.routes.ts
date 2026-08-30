import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  searchJobs,
  getRecommendedJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getSavedJobs,
} from './jobs.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', searchJobs);
router.get('/recommended', getRecommendedJobs);
router.get('/saved', getSavedJobs);
router.get('/:jobId', getJobById);
router.post('/:jobId/save', saveJob);
router.delete('/:jobId/save', unsaveJob);

export default router;
