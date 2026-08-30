import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { ResumeController } from './resume.controller';
import { resumeUpload } from './resume.storage';

const router = Router();

router.use(authMiddleware);

router.post('/upload', resumeUpload.single('resume'), ResumeController.uploadResume);
router.get('/', ResumeController.listResumes);
router.post('/', ResumeController.createResume);
router.get('/:resumeId', ResumeController.getResume);
router.put('/:resumeId', ResumeController.updateResume);
router.delete('/:resumeId', ResumeController.deleteResume);
router.post('/:resumeId/improve', ResumeController.improveContent);

export default router;
