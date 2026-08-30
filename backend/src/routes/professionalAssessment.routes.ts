import { Router } from "express";
import { ProfessionalAssessmentController } from "../controllers/professionalAssessment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", ProfessionalAssessmentController.getAssessment);
router.put("/", ProfessionalAssessmentController.saveStep);
router.post("/complete", ProfessionalAssessmentController.complete);

export default router;
