import { db } from '../config/database';
import { GeminiClient } from './geminiClient';
import { PromptInputProfile } from './prompts/careerAnalysis.prompt';
import { CareerAnalysisData, StoredCareerAnalysisRecord } from '../types/careerAnalysis.types';

export class CareerAnalysisService {
  public static async generateAnalysisForUser(userId: string, isRegenerate = false): Promise<StoredCareerAnalysisRecord> {
    const user = await db.findUserById(userId);
    if (!user) {
      const err: any = new Error('User not found.');
      err.statusCode = 404;
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    if (!user.hasCompletedOnboarding && !user.isOnboarded) {
      user.hasCompletedOnboarding = true;
      user.isOnboarded = true;
      await db.updateUser(userId, { hasCompletedOnboarding: true, isOnboarded: true });
    }

    if (isRegenerate) {
      const existing = await db.getCareerAnalysis(userId);
      if (existing) {
        const lastCreated = new Date(existing.updatedAt).getTime();
        const now = Date.now();
        if (now - lastCreated < 5000) {
          const err: any = new Error('Please wait a moment before regenerating your analysis.');
          err.statusCode = 429;
          err.code = 'RATE_LIMITED';
          throw err;
        }
      }
    }

    const isFresher = (user.careerType || user.careerStage) === 'FRESHER';
    const profile = await db.getProfileByUserId(userId);
    const fresherAssessment = isFresher ? await db.getFresherAssessment(userId) : null;
    const proAssessment = !isFresher ? await db.getProfessionalAssessment(userId) : null;

    const targetRole =
      (isFresher ? fresherAssessment?.careerGoal?.targetRole : proAssessment?.targetRole?.targetRole) ||
      profile?.targetRole ||
      'Software Engineer';

    const targetIndustry =
      (isFresher ? fresherAssessment?.careerGoal?.preferredIndustry : proAssessment?.targetRole?.targetIndustry) ||
      profile?.targetIndustry ||
      'Technology';

    const technicalSkills = isFresher
      ? (fresherAssessment?.technicalBackground?.programmingLanguages || [])
      : (proAssessment?.skills?.technicalSkills || []);

    const frameworks = isFresher
      ? (fresherAssessment?.technicalBackground?.frameworks || [])
      : (proAssessment?.skills?.frameworks || []);

    const databases = isFresher
      ? (fresherAssessment?.technicalBackground?.databases || [])
      : (proAssessment?.skills?.domainSkills || []);

    const tools = isFresher
      ? (fresherAssessment?.technicalBackground?.tools || [])
      : (proAssessment?.skills?.tools || []);

    const inputProfile: PromptInputProfile = {
      careerStage: isFresher ? 'FRESHER' : 'PROFESSIONAL',
      targetRole,
      targetIndustry,
      education: isFresher ? fresherAssessment?.education : undefined,
      currentCareer: !isFresher ? proAssessment?.currentCareer : undefined,
      technicalSkills,
      frameworks,
      databases,
      tools,
      interests: isFresher ? fresherAssessment?.interests : undefined,
      careerGoal: isFresher ? fresherAssessment?.careerGoal : proAssessment?.careerGoal,
      experience: isFresher ? fresherAssessment?.experience : undefined,
      challenges: !isFresher ? proAssessment?.challenges : undefined,
    };

    const analysisData: CareerAnalysisData = await GeminiClient.generateCareerAnalysis(inputProfile);

    const savedRecord = await db.saveCareerAnalysis(
      userId,
      isFresher ? 'FRESHER' : 'PROFESSIONAL',
      targetRole,
      analysisData,
      GeminiClient.isApiKeyConfigured() ? 'gemini-2.5-flash' : 'career-engine-heuristic-v1'
    );

    return savedRecord;
  }

  public static async getLatestAnalysis(userId: string): Promise<StoredCareerAnalysisRecord | null> {
    return db.getCareerAnalysis(userId);
  }
}
