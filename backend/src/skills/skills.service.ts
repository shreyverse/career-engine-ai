import { db } from '../config/database';
import { CareerAnalysisService } from '../ai/careerAnalysis.service';
import {
  SkillsWorkspaceData,
  SkillGapWithProgress,
  SkillLearningStatus,
} from '../types/skills.types';

export class SkillsService {
  public static async getSkillsWorkspaceData(userId: string): Promise<SkillsWorkspaceData> {
    const analysisRecord = await CareerAnalysisService.getLatestAnalysis(userId);
    const storedProgressMap = await db.getUserSkillProgressMap(userId);

    const targetRole = analysisRecord?.targetRole || 'Software Engineer';
    const currentLevel = analysisRecord?.analysisData?.currentLevel || 'EARLY';
    const skillReadinessScore = analysisRecord?.analysisData?.careerReadiness?.skills ?? null;

    const rawGaps = analysisRecord?.analysisData?.skillGaps || [];

    const enrichedGaps: SkillGapWithProgress[] = rawGaps.map((gap) => {
      const stored = storedProgressMap.get(gap.skill.toLowerCase());
      const status: SkillLearningStatus = stored ? stored.status : 'NOT_STARTED';
      const progress: number = stored ? stored.progress : status === 'COMPLETED' ? 100 : 0;

      let recommendedAction = `Study ${gap.skill} fundamentals and apply them in project exercises.`;
      if (gap.gap === 'HIGH') {
        recommendedAction = `Prioritize mastering ${gap.skill} to advance from ${gap.currentLevel} to ${gap.requiredLevel}.`;
      } else if (gap.currentLevel === 'BASIC' || gap.currentLevel === 'INTERMEDIATE') {
        recommendedAction = `Practice building production-grade features using ${gap.skill}.`;
      }

      return {
        ...gap,
        status,
        progress,
        userSkillId: stored ? stored.id : undefined,
        recommendedAction,
      };
    });

    const highPriorityGaps = enrichedGaps.filter((g) => g.priority === 'HIGH');
    const mediumPriorityGaps = enrichedGaps.filter((g) => g.priority === 'MEDIUM');
    const lowPriorityGaps = enrichedGaps.filter((g) => g.priority === 'LOW');
    const completedSkillsCount = enrichedGaps.filter((g) => g.status === 'COMPLETED').length;

    return {
      targetRole,
      currentLevel,
      skillReadinessScore,
      highPriorityGaps,
      mediumPriorityGaps,
      lowPriorityGaps,
      allGaps: enrichedGaps,
      completedSkillsCount,
      totalGapsCount: enrichedGaps.length,
    };
  }

  public static async updateSkillProgress(
    userId: string,
    skillName: string,
    status: SkillLearningStatus,
    progress: number
  ) {
    const validProgress = Math.max(0, Math.min(100, Math.round(progress)));
    const finalStatus: SkillLearningStatus =
      validProgress === 100 ? 'COMPLETED' : status;

    return db.saveSkillProgress(userId, skillName, finalStatus, validProgress);
  }
}