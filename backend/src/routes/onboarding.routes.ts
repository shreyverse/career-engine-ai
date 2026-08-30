import { Router } from "express";
import { OnboardingController } from "../controllers/onboarding.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/career-type", OnboardingController.setCareerType);
router.post("/reset", OnboardingController.resetOnboarding);

export default router;
