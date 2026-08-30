import { Router } from 'express';
import { SkillsController } from './skills.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', SkillsController.getSkillsWorkspace);
router.put('/:skillName', SkillsController.updateSkillProgress);

export default router;