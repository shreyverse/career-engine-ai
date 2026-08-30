import { db } from "../config/database";

export class AssessmentService {
  public static async submitFresher(userId: string, data: any) {
    const saved = await db.saveFresherAssessmentStep(userId, 6, data);
    await db.completeFresherAssessment(userId);
    const profile = await db.getProfileByUserId(userId);
    const user = await db.findUserById(userId);

    return {
      assessment: saved,
      profile,
      user,
    };
  }

  public static async submitProfessional(userId: string, data: any) {
    const saved = await db.saveProfessionalAssessmentStep(userId, 6, data);
    await db.completeProfessionalAssessment(userId);
    const profile = await db.getProfileByUserId(userId);
    const user = await db.findUserById(userId);

    return {
      assessment: saved,
      profile,
      user,
    };
  }

  public static async getMyAssessment(userId: string) {
    const user = await db.findUserById(userId);
    if (!user) {
      const err: any = new Error("User not found.");
      err.statusCode = 404;
      err.code = "USER_NOT_FOUND";
      throw err;
    }

    const profile = await db.getProfileByUserId(userId);
    const isFresher = (user.careerType || user.careerStage) === "FRESHER";
    const assessment = isFresher
      ? await db.getFresherAssessment(userId)
      : await db.getProfessionalAssessment(userId);

    return {
      careerStage: user.careerStage,
      careerType: user.careerType,
      isOnboarded: user.hasCompletedOnboarding || user.isOnboarded,
      hasCompletedOnboarding: user.hasCompletedOnboarding || user.isOnboarded,
      onboardingStep: user.onboardingStep,
      profile,
      assessment,
    };
  }
}
