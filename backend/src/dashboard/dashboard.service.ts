import { db } from '../config/database';
import { StoredSkillProgressRecord } from '../types/skills.types';
import {
  DashboardAggregatedResponse,
  DashboardUserData,
  DashboardCareerTarget,
  DashboardReadiness,
  DashboardNextMove,
  DashboardSkillGapItem,
  DashboardRoadmapSummary,
  DashboardResumeSummary,
  DashboardATSSummary,
  DashboardNotification,
  DashboardProgressSummary,
  DashboardProgressMilestone,
} from '../types/dashboard.types';

export class DashboardService {
  public static async getDashboardData(userId: string): Promise<DashboardAggregatedResponse> {
    const user = await db.findUserById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const profile = await db.getCareerProfile(userId);
    const careerAnalysisRecord = await db.getCareerAnalysis(userId);
    const careerAnalysis = careerAnalysisRecord?.analysisData;
    const roadmapRecord = await db.getRoadmap(userId);
    const skillProgressMap = await db.getUserSkillProgressMap(userId);
    const skillProgressList: StoredSkillProgressRecord[] = Array.from(skillProgressMap.values());
    const resumes = await db.getUserResumes(userId);
    const atsAnalyses = await db.getUserATSAnalyses(userId);

    // 1. User & Career Target
    const userData: DashboardUserData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      careerStage: user.careerStage,
      avatarUrl: user.avatarUrl,
    };

    const careerTarget: DashboardCareerTarget = {
      targetRole: profile?.targetRole || careerAnalysis?.targetRole || (user.careerStage === 'FRESHER' ? 'Software Engineer' : 'Senior Fullstack Engineer'),
      currentLevel: careerAnalysis?.currentLevel || (user.careerStage === 'FRESHER' ? 'BEGINNER' : 'INTERMEDIATE'),
      targetIndustry: profile?.targetIndustry,
      preferredWorkMode: profile?.preferredWorkMode,
      salaryExpectation: profile?.salaryExpectation,
      learningVelocity: profile?.learningVelocity,
      weeklyHoursAvailable: profile?.weeklyHoursAvailable,
    };

    // 2. Career Readiness
    const readiness: DashboardReadiness = careerAnalysis?.careerReadiness ? {
      overall: careerAnalysis.careerReadiness.overall ?? 70,
      skills: careerAnalysis.careerReadiness.skills ?? 70,
      experience: careerAnalysis.careerReadiness.experience ?? 65,
      projects: careerAnalysis.careerReadiness.projects ?? 75,
      careerAlignment: careerAnalysis.careerReadiness.careerAlignment ?? 80,
      confidence: (careerAnalysis.careerReadiness.confidence as 'HIGH' | 'MEDIUM' | 'LOW') || 'HIGH',
      reasoning: careerAnalysis.careerReadiness.reasoning || 'Solid foundational skills with clear growth paths mapped.',
    } : {
      overall: 70,
      skills: 70,
      experience: 65,
      projects: 75,
      careerAlignment: 80,
      confidence: 'MEDIUM',
      reasoning: 'Profile established. Complete your personalized roadmap to increase readiness score.',
    };

    // 3. Roadmap Summary & Next Move
    let nextMove: DashboardNextMove = {
      status: 'NO_ROADMAP',
      title: 'Generate Your Personalized Career Roadmap',
      description: 'Create a tailored step-by-step career path with curated tasks and real-world projects.',
      whyItMatters: 'A structured learning plan accelerates your journey to ' + careerTarget.targetRole + '.',
    };

    let roadmapSummary: DashboardRoadmapSummary = {
      hasRoadmap: false,
      currentPhaseNumber: 1,
      totalPhases: 0,
      currentPhaseTitle: '',
      currentPhaseProgress: 0,
      totalTasks: 0,
      completedTasks: 0,
      overallProgress: 0,
    };

    if (roadmapRecord && roadmapRecord.roadmapData?.phases) {
      const phases = roadmapRecord.roadmapData.phases;
      const taskStatusMap = await db.getUserTaskProgressMap(userId, roadmapRecord.id);
      const projectStatusMap = await db.getUserProjectProgressMap(userId, roadmapRecord.id);

      let totalTasks = 0;
      let totalCompletedTasks = 0;
      let foundNextMove = false;
      let activePhase = phases[0];
      let activePhaseProgress = 0;

      for (const phase of phases) {
        let phaseTasksCount = phase.tasks.length;
        let phaseCompletedCount = 0;

        for (const task of phase.tasks) {
          totalTasks++;
          const userStatus = taskStatusMap.get(task.id);
          const isCompleted = userStatus === 'COMPLETED' || (!userStatus && task.completed);
          if (isCompleted) {
            phaseCompletedCount++;
            totalCompletedTasks++;
          } else if (!foundNextMove) {
            const prereqsMet = !task.prerequisites || task.prerequisites.every((pId: string) => taskStatusMap.get(pId) === 'COMPLETED');
            if (prereqsMet) {
              nextMove = {
                status: 'ACTIVE',
                taskId: task.id,
                title: task.title,
                description: task.description,
                priority: task.priority || 'HIGH',
                estimatedTime: task.estimatedTime || '3-4 days',
                skills: task.skills,
                whyItMatters: 'Essential milestone in "' + phase.title + '" for ' + careerTarget.targetRole + '.',
                phaseTitle: phase.title,
                phaseNumber: phase.phaseNumber,
              };
              foundNextMove = true;
              activePhase = phase;
            }
          }
        }

        const pProgress = phaseTasksCount > 0 ? Math.round((phaseCompletedCount / phaseTasksCount) * 100) : 0;
        if (!foundNextMove && phaseCompletedCount < phaseTasksCount) {
          activePhase = phase;
          activePhaseProgress = pProgress;
        }
      }

      if (!foundNextMove && totalCompletedTasks === totalTasks && totalTasks > 0) {
        nextMove = {
          status: 'ALL_COMPLETE',
          title: 'Career Roadmap Fully Completed!',
          description: 'All milestones and projects in your current learning path are completed.',
          whyItMatters: 'You have achieved your target roadmap objectives. Ready for live job applications or goal expansion.',
        };
      }

      const overallProgress = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

      roadmapSummary = {
        hasRoadmap: true,
        currentPhaseNumber: activePhase?.phaseNumber || 1,
        totalPhases: phases.length,
        currentPhaseTitle: activePhase?.title || phases[0].title,
        currentPhaseProgress: activePhaseProgress,
        totalTasks,
        completedTasks: totalCompletedTasks,
        overallProgress,
        currentProjectTitle: activePhase?.project?.title,
        currentProjectStatus: activePhase?.project ? (projectStatusMap.get(activePhase.project.id) || 'NOT_STARTED') : undefined,
      };
    }

    // 4. Skill Gaps (Top 3-5)
    const skillGaps: DashboardSkillGapItem[] = [];
    if (careerAnalysis?.skillGaps) {
      careerAnalysis.skillGaps.slice(0, 5).forEach((gap: any) => {
        const tracked = skillProgressMap.get(gap.skill.toLowerCase());
        skillGaps.push({
          skill: gap.skill,
          priority: gap.priority || 'HIGH',
          currentLevel: gap.currentLevel,
          requiredLevel: gap.requiredLevel,
          learningStatus: tracked?.status || 'NOT_STARTED',
          progress: tracked?.progress || 0,
          reason: gap.reason,
        });
      });
    }

    // 5. Resume Summary
    const primaryResume = resumes.length > 0 ? resumes[0] : null;
    const resumeSummary: DashboardResumeSummary = {
      hasResume: !!primaryResume,
      resumeId: primaryResume?.id,
      name: primaryResume?.name,
      completeness: primaryResume?.completeness || 0,
      updatedAt: primaryResume?.updatedAt,
    };

    // 6. ATS Summary
    const latestATS = atsAnalyses.length > 0 ? atsAnalyses[0] : null;
    const atsSummary: DashboardATSSummary = {
      hasATS: !!latestATS,
      analysisId: latestATS?.id,
      score: latestATS?.score || 0,
      matchLevel: latestATS?.matchLevel,
      targetRole: latestATS?.targetRole,
      analyzedAt: latestATS ? new Date(latestATS.createdAt).toISOString() : undefined,
      matchedKeywordsCount: latestATS?.keywords?.matched?.length || 0,
      missingKeywordsCount: latestATS?.keywords?.missing?.length || 0,
    };

    // 7. Notifications & Alerts
    const notifications: DashboardNotification[] = [];
    if (!primaryResume) {
      notifications.push({
        id: 'notif-resume-missing',
        type: 'ACTION',
        title: 'Resume Not Created',
        message: 'Build an ATS-optimized resume using verified skills from your profile.',
        actionLabel: 'Build Resume',
        actionUrl: '/resume/builder',
      });
    } else if (primaryResume.completeness < 80) {
      notifications.push({
        id: 'notif-resume-incomplete',
        type: 'INFO',
        title: 'Resume Completeness at ' + primaryResume.completeness + '%',
        message: 'Add project highlights and work achievements to maximize job compatibility.',
        actionLabel: 'Edit Resume',
        actionUrl: '/resume/builder/' + primaryResume.id,
      });
    }

    if (!latestATS && primaryResume) {
      notifications.push({
        id: 'notif-ats-missing',
        type: 'ACTION',
        title: 'Run ATS Compatibility Check',
        message: 'Evaluate your resume against "' + careerTarget.targetRole + '" to uncover missing keywords.',
        actionLabel: 'Analyze Resume',
        actionUrl: '/resume/ats?resumeId=' + primaryResume.id,
      });
    }

    if (!roadmapRecord) {
      notifications.push({
        id: 'notif-roadmap-missing',
        type: 'ACTION',
        title: 'Roadmap Ready to Generate',
        message: 'Create your step-by-step career path based on your AI career assessment.',
        actionLabel: 'Generate Roadmap',
        actionUrl: '/career-path',
      });
    }

    // 8. Progress Center Milestones
    const milestones: DashboardProgressMilestone[] = [
      {
        id: 'm-onboarding',
        title: 'Career Assessment Completed',
        description: 'Profile established as ' + user.careerStage + ' targeting ' + careerTarget.targetRole + '.',
        date: new Date(user.createdAt).toLocaleDateString(),
        completed: true,
        type: 'ONBOARDING',
      },
      {
        id: 'm-analysis',
        title: 'AI Career Intelligence Generated',
        description: 'Readiness evaluated at ' + readiness.overall + '% with ' + (careerAnalysis?.skillGaps?.length || 0) + ' identified skill gaps.',
        date: careerAnalysisRecord ? new Date(careerAnalysisRecord.createdAt).toLocaleDateString() : 'Pending',
        completed: !!careerAnalysisRecord,
        type: 'ANALYSIS',
      },
      {
        id: 'm-roadmap',
        title: 'Personalized Roadmap Created',
        description: roadmapSummary.hasRoadmap
          ? roadmapSummary.totalPhases + ' learning phases with ' + roadmapSummary.totalTasks + ' actionable tasks.'
          : 'Pending roadmap generation.',
        date: roadmapRecord ? new Date(roadmapRecord.createdAt).toLocaleDateString() : 'Pending',
        completed: roadmapSummary.hasRoadmap,
        type: 'ROADMAP',
      },
      {
        id: 'm-skills',
        title: 'Active Skill Acceleration',
        description: skillProgressList.length > 0
          ? skillProgressList.filter((s: StoredSkillProgressRecord) => s.status === 'COMPLETED').length + ' of ' + skillProgressList.length + ' skills completed.'
          : 'Track and practice identified gaps.',
        date: skillProgressList.length > 0 ? 'In Progress' : 'Pending',
        completed: skillProgressList.some((s: StoredSkillProgressRecord) => s.status === 'COMPLETED'),
        type: 'SKILL',
      },
      {
        id: 'm-resume',
        title: 'ATS Resume Created',
        description: primaryResume
          ? primaryResume.name + ' (' + primaryResume.completeness + '% complete)'
          : 'Pending resume draft.',
        date: primaryResume ? new Date(primaryResume.createdAt).toLocaleDateString() : 'Pending',
        completed: !!primaryResume,
        type: 'RESUME',
      },
      {
        id: 'm-ats',
        title: 'ATS Compatibility Diagnostic',
        description: latestATS
          ? 'Score: ' + latestATS.score + '/100 (' + (latestATS.matchLevel || 'GOOD').replace(/_/g, ' ') + ')'
          : 'Pending ATS analysis.',
        date: latestATS ? new Date(latestATS.createdAt).toLocaleDateString() : 'Pending',
        completed: !!latestATS,
        type: 'ATS',
      },
    ];

    const atsScoreDelta = atsAnalyses.length >= 2
      ? atsAnalyses[0].score - atsAnalyses[1].score
      : null;

    const progress: DashboardProgressSummary = {
      readinessScore: readiness.overall,
      roadmapCompletion: roadmapSummary.overallProgress,
      skillsCompletedCount: skillProgressList.filter((s: StoredSkillProgressRecord) => s.status === 'COMPLETED').length,
      totalSkillsTracked: skillProgressList.length,
      resumeCompleteness: resumeSummary.completeness,
      atsScoreLatest: latestATS ? latestATS.score : null,
      atsScoreDelta,
      milestones,
      trackedSkills: skillProgressList.map((sp: StoredSkillProgressRecord) => ({
        name: sp.skillName,
        status: sp.status,
        progress: sp.progress,
        priority: 'HIGH',
      })),
      atsHistory: atsAnalyses.map((a) => ({
        id: a.id,
        score: a.score,
        targetRole: a.targetRole,
        date: new Date(a.createdAt).toLocaleDateString(),
      })),
    };

    const recommendedTechNames: string[] = (careerAnalysis?.recommendedTechnologies || []).map((t: any) =>
      typeof t === 'string' ? t : (t.name || '')
    ).filter(Boolean);

    return {
      user: userData,
      career: careerTarget,
      readiness,
      nextMove,
      skillGaps,
      roadmap: roadmapSummary,
      resume: resumeSummary,
      ats: atsSummary,
      notifications,
      progress,
      topStrengths: careerAnalysis?.strengths?.slice(0, 3) || ['Clear component architecture foundations', 'REST API implementation understanding'],
      topWeaknesses: careerAnalysis?.weaknesses?.slice(0, 3) || ['Distributed system architectures at scale', 'Database query optimization'],
      topRecommendedTech: recommendedTechNames.length > 0 ? recommendedTechNames.slice(0, 3) : ['Docker', 'PostgreSQL', 'Redis'],
    };
  }
}
