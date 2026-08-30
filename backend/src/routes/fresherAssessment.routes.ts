import { Router } from "express";
import { FresherAssessmentController } from "../controllers/fresherAssessment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", FresherAssessmentController.getAssessment);
router.put("/", FresherAssessmentController.saveStep);
router.post("/complete", FresherAssessmentController.complete);

export default router;
