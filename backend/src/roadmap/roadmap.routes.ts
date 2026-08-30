import { Router } from 'express';
import { RoadmapController } from './roadmap.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', RoadmapController.getRoadmap);
router.post('/', RoadmapController.generateRoadmap);
router.post('/regenerate', RoadmapController.regenerateRoadmap);
router.put('/tasks/:taskId', RoadmapController.updateTask);
router.put('/projects/:projectId', RoadmapController.updateProject);

export default router;