import { db } from '../config/database';

export interface SanitizedCareerContext {
  user: {
    fullName: string;
    careerStage: string;
  };
  careerTarget: {
    targetRole: string;
    currentLevel: string;
    targetIndustry?: string;
  };
  careerAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    skillGaps: Array<{ skill: string; priority: string; currentLevel: string; requiredLevel: string }>;
    recommendedTechnologies: string[];
  };
  roadmap?: {
    hasRoadmap: boolean;
    activePhaseTitle?: string;
    activePhaseNumber?: number;
    totalPhases?: number;
    totalTasks?: number;
    completedTasks?: number;
    nextTask?: {
      id: string;
      title: string;
      priority: string;
      skills: string[];
    };
  };
  skillsTracked?: Array<{ name: string; status: string; progress: number }>;
  resume?: {
    hasResume: boolean;
    name?: string;
    completeness?: number;
  };
  ats?: {
    hasATS: boolean;
    score?: number;
    matchLevel?: string;
    missingRequiredSkills?: string[];
  };
}

export class CoachContextBuilder {
  public static async buildContext(userId: string): Promise<SanitizedCareerContext> {
    const user = await db.findUserById(userId);
    if (!user) throw new Error('User not found');

    const profile = await db.getCareerProfile(userId);
    const careerAnalysisRecord = await db.getCareerAnalysis(userId);
    const analysis = careerAnalysisRecord?.analysisData;
    const roadmapRecord = await db.getRoadmap(userId);
    const skillProgressMap = await db.getUserSkillProgressMap(userId);
    const resumes = await db.getUserResumes(userId);
    const atsAnalyses = await db.getUserATSAnalyses(userId);

    // Sanitized User Info
    const userSummary = {
      fullName: user.fullName || 'Candidate',
      careerStage: user.careerStage || 'FRESHER',
    };

    const careerTarget = {
      targetRole: profile?.targetRole || analysis?.targetRole || (user.careerStage === 'FRESHER' ? 'Software Engineer' : 'Senior Fullstack Engineer'),
      currentLevel: analysis?.currentLevel || (user.careerStage === 'FRESHER' ? 'BEGINNER' : 'INTERMEDIATE'),
      targetIndustry: profile?.targetIndustry,
    };

    // Career Analysis
    const analysisSummary = analysis ? {
      strengths: (analysis.strengths || []).slice(0, 4),
      weaknesses: (analysis.weaknesses || []).slice(0, 4),
      skillGaps: (analysis.skillGaps || []).slice(0, 5).map((g) => ({
        skill: g.skill,
        priority: g.priority || 'HIGH',
        currentLevel: g.currentLevel,
        requiredLevel: g.requiredLevel,
      })),
      recommendedTechnologies: (analysis.recommendedTechnologies || []).slice(0, 4).map((t: any) => typeof t === 'string' ? t : t.name),
    } : undefined;

    // Roadmap Context
    let roadmapSummary = undefined;
    if (roadmapRecord && roadmapRecord.roadmapData?.phases) {
      const phases = roadmapRecord.roadmapData.phases;
      const taskStatusMap = await db.getUserTaskProgressMap(userId, roadmapRecord.id);
      let totalTasks = 0;
      let completedTasks = 0;
      let activePhase = phases[0];
      let nextTask = undefined;

      for (const phase of phases) {
        for (const task of phase.tasks) {
          totalTasks++;
          const isCompleted = taskStatusMap.get(task.id) === 'COMPLETED' || task.completed;
          if (isCompleted) {
            completedTasks++;
          } else if (!nextTask) {
            nextTask = {
              id: task.id,
              title: task.title,
              priority: task.priority || 'HIGH',
              skills: task.skills || [],
            };
            activePhase = phase;
          }
        }
      }

      roadmapSummary = {
        hasRoadmap: true,
        activePhaseTitle: activePhase?.title,
        activePhaseNumber: activePhase?.phaseNumber,
        totalPhases: phases.length,
        totalTasks,
        completedTasks,
        nextTask,
      };
    }

    // Skills
    const skillsTracked = Array.from(skillProgressMap.values()).slice(0, 8).map((sp) => ({
      name: sp.skillName,
      status: sp.status,
      progress: sp.progress,
    }));

    // Resume
    const primaryResume = resumes.length > 0 ? resumes[0] : null;
    const resumeSummary = {
      hasResume: !!primaryResume,
      name: primaryResume?.name,
      completeness: primaryResume?.completeness,
    };

    // ATS
    const latestATS = atsAnalyses.length > 0 ? atsAnalyses[0] : null;
    const atsSummary = {
      hasATS: !!latestATS,
      score: latestATS?.score,
      matchLevel: latestATS?.matchLevel,
      missingRequiredSkills: latestATS?.keywords?.missing?.filter((m) => m.importance === 'REQUIRED').map((m) => m.term).slice(0, 5),
    };

    return {
      user: userSummary,
      careerTarget,
      careerAnalysis: analysisSummary,
      roadmap: roadmapSummary,
      skillsTracked: skillsTracked.length > 0 ? skillsTracked : undefined,
      resume: resumeSummary,
      ats: atsSummary,
    };
  }
}
