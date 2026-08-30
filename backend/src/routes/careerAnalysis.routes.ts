import { Router } from 'express';
import { CareerAnalysisController } from '../controllers/careerAnalysis.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', CareerAnalysisController.generateAnalysis);
router.get('/', CareerAnalysisController.getLatestAnalysis);
router.post('/regenerate', CareerAnalysisController.regenerateAnalysis);

export default router;
