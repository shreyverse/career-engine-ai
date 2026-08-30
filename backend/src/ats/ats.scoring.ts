import { ResumeData } from '../types/resume.types';
import { ATSScoreBreakdown, ATSMatchCategory } from '../types/ats.types';
import { GeminiSemanticAnalysisResult } from './ats.semantic';

export class ATSScoringEngine {
  public static calculateScore(
    resumeData: ResumeData,
    targetRole: string,
    careerStage: 'FRESHER' | 'PROFESSIONAL',
    semanticAnalysis: GeminiSemanticAnalysisResult,
    jobDescription?: string
  ): { score: number; breakdown: ATSScoreBreakdown; matchLevel: ATSMatchCategory } {
    const totalExpected = semanticAnalysis.matchedSkills.length + semanticAnalysis.missingSkills.length;
    const keywordMatch = totalExpected === 0
      ? 80
      : Math.min(100, Math.round((semanticAnalysis.matchedSkills.length / totalExpected) * 100) + 15);

    let structPoints = 0;
    if (resumeData.personal?.name && resumeData.personal?.email) structPoints += 25;
    if (resumeData.summary && resumeData.summary.trim().length > 20) structPoints += 15;
    if (resumeData.education && resumeData.education.length > 0) structPoints += 20;
    if (resumeData.skills && resumeData.skills.length >= 4) structPoints += 20;
    if (resumeData.projects && resumeData.projects.length >= 1) structPoints += 10;
    if (resumeData.experience && resumeData.experience.length >= 1) structPoints += 10;
    const structureCompleteness = Math.min(100, Math.max(20, structPoints));

    const projectCount = resumeData.projects?.length || 0;
    let projectRelevance = 40;
    if (projectCount >= 1) projectRelevance += 25;
    if (projectCount >= 2) projectRelevance += 20;
    const hasHighlights = resumeData.projects?.some((p) => p.highlights && p.highlights.length > 0);
    if (hasHighlights) projectRelevance += 15;
    projectRelevance = Math.min(100, projectRelevance);

    let experienceRelevance = 50;
    const expCount = resumeData.experience?.length || 0;
    if (careerStage === 'FRESHER') {
      experienceRelevance = expCount > 0 ? 90 : 75;
    } else {
      if (expCount >= 1) experienceRelevance = 70;
      if (expCount >= 2) experienceRelevance = 85;
      if (expCount >= 3) experienceRelevance = 95;
    }

    const roleNormalized = targetRole.toLowerCase();
    let roleAlignment = 65;
    if (resumeData.targetRole?.toLowerCase().includes(roleNormalized)) roleAlignment += 20;
    if (resumeData.summary?.toLowerCase().includes(roleNormalized)) roleAlignment += 10;
    roleAlignment = Math.min(100, roleAlignment);

    let contentQuality = 75;
    const issuesCount = semanticAnalysis.contentIssues?.length || 0;
    contentQuality -= issuesCount * 5;
    contentQuality = Math.min(100, Math.max(40, contentQuality));

    let overall = 0;
    if (careerStage === 'FRESHER') {
      overall = Math.round(
        keywordMatch * 0.30 +
        projectRelevance * 0.30 +
        experienceRelevance * 0.05 +
        roleAlignment * 0.15 +
        structureCompleteness * 0.10 +
        contentQuality * 0.10
      );
    } else {
      overall = Math.round(
        keywordMatch * 0.30 +
        experienceRelevance * 0.20 +
        projectRelevance * 0.15 +
        roleAlignment * 0.15 +
        structureCompleteness * 0.10 +
        contentQuality * 0.10
      );
    }

    overall = Math.min(100, Math.max(20, overall));

    let matchLevel: ATSMatchCategory = 'NEEDS_IMPROVEMENT';
    if (overall >= 85) matchLevel = 'STRONG';
    else if (overall >= 70) matchLevel = 'GOOD';
    else if (overall >= 50) matchLevel = 'MODERATE';

    const breakdown: ATSScoreBreakdown = {
      overall,
      keywordMatch,
      experienceRelevance,
      projectRelevance,
      roleAlignment,
      structureCompleteness,
      contentQuality,
    };

    return { score: overall, breakdown, matchLevel };
  }
}
