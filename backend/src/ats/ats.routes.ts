import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { analyzeResume, getAnalysis, listAnalyses, compareAnalyses } from './ats.controller';

const router = Router();

router.use(authMiddleware);

router.post('/analyze', analyzeResume);
router.get('/history', listAnalyses);
router.get('/compare', compareAnalyses);
router.get('/:analysisId', getAnalysis);

export default router;
