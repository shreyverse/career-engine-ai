import { HealthController } from '../controllers/health.controller';
import { Router } from 'express';
import authRouter from './auth.routes';
import onboardingRouter from './onboarding.routes';
import careerAnalysisRouter from './careerAnalysis.routes';
import roadmapRouter from '../roadmap/roadmap.routes';
import skillsRouter from '../skills/skills.routes';
import resumeRouter from '../resume/resume.routes';
import atsRouter from '../ats/ats.routes';
import dashboardRouter from '../dashboard/dashboard.routes';
import coachRouter from '../coach/coach.routes';
import jobsRouter from '../jobs/jobs.routes';
import applicationRouter from '../jobs/application.routes';
import {
  fresherAssessmentRouter,
  professionalAssessmentRouter,
  assessmentRouter,
} from './assessment.routes';

const router = Router();

router.get("/health", HealthController.getHealth);

router.use('/auth', authRouter);
router.use('/onboarding', onboardingRouter);
router.use('/fresher-assessment', fresherAssessmentRouter);
router.use('/professional-assessment', professionalAssessmentRouter);
router.use('/assessment', assessmentRouter);
router.use('/career-analysis', careerAnalysisRouter);
router.use('/roadmap', roadmapRouter);
router.use('/skills', skillsRouter);
router.use('/resumes', resumeRouter);
router.use('/resume', resumeRouter);
router.use('/ats', atsRouter);
router.use('/dashboard', dashboardRouter);
router.use('/coach', coachRouter);
router.use('/jobs', jobsRouter);
router.use('/applications', applicationRouter);

export default router;
