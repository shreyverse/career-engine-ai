import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const fresherAssessmentRouter = Router();
fresherAssessmentRouter.use(authMiddleware);
fresherAssessmentRouter.get('/', AssessmentController.getFresherAssessment);
fresherAssessmentRouter.put('/', AssessmentController.saveFresherStep);
fresherAssessmentRouter.post('/complete', AssessmentController.completeFresherAssessment);

export const professionalAssessmentRouter = Router();
professionalAssessmentRouter.use(authMiddleware);
professionalAssessmentRouter.get('/', AssessmentController.getProfessionalAssessment);
professionalAssessmentRouter.put('/', AssessmentController.saveProfessionalStep);
professionalAssessmentRouter.post('/complete', AssessmentController.completeProfessionalAssessment);

export const assessmentRouter = Router();
assessmentRouter.use(authMiddleware);
assessmentRouter.get('/me', AssessmentController.getMyAssessment);
assessmentRouter.post('/fresher', AssessmentController.saveFresherStep);
assessmentRouter.post('/professional', AssessmentController.saveProfessionalStep);
