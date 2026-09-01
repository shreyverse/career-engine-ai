import { ResumeData } from '../types/resume.types';
import { ATSScoreBreakdown, ATSMatchCategory } from '../types/ats.types';
import { GeminiSemanticAnalysisResult } from './ats.semantic';
import { ResumeQualityFindings } from './ats.quality.agent';
import { JobRelevanceAnalysis, MatchedSkillItem } from './ats.relevance.agent';

export interface DeterministicATSReport {
  overallScore: number;
  breakdown: {
    atsCompatibility: number;
    keywordMatch: number;
    experienceRelevance: number;
    projectRelevance: number;
    achievementQuality: number;
    formatting: number;
    sectionCompleteness: number;
  };
  breakdownExplanations: {
    atsCompatibility: string;
    keywordMatch: string;
    experienceRelevance: string;
    projectRelevance: string;
    achievementQuality: string;
  };
  strengths: string[];
  weaknesses: string[];
  matchedSkills: MatchedSkillItem[];
  missingKeywords: string[];
  recommendations: string[];
  targetRole: string;
}

export class ATSScoringEngine {
  public static calculate(
    resumeData: ResumeData,
    quality: ResumeQualityFindings,
    relevance: JobRelevanceAnalysis
  ): DeterministicATSReport {
    // 6-Pillar Weighted Formula (100 Points Total)
    // 1. ATS Structure & Parseability: 20%
    const atsParsingScore = quality.structureScore;

    // 2. Target Skill Match: 30%
    const keywordScore = relevance.skillMatchPercentage;

    // 3. Experience Relevance: 20%
    const expScore = relevance.experienceRelevanceScore;

    // 4. Project Relevance: 15%
    const projScore = relevance.projectRelevanceScore;

    // 5. Quantifiable Metrics & Achievement Quality: 10%
    const metricScore = quality.achievementScore;

    // 6. Formatting & Cleanliness: 5%
    const formatScore = quality.formattingScore;

    const overallScore = Math.round(
      atsParsingScore * 0.20 +
      keywordScore * 0.30 +
      expScore * 0.20 +
      projScore * 0.15 +
      metricScore * 0.10 +
      formatScore * 0.05
    );

    const breakdownExplanations = {
      atsCompatibility: quality.hasContactInfo && quality.hasExperience
        ? 'Standard contact headers and clean chronological structure ensure seamless ATS text parsing.'
        : 'Missing standard contact links or section headers may reduce parsing fidelity in older ATS systems.',

      keywordMatch: relevance.matchedSkills.length >= 6
        ? `Verified ${relevance.matchedSkills.length} relevant technologies matching ${relevance.targetRole} requirements (${relevance.matchedSkills.slice(0, 4).map(s => s.name).join(', ')}).`
        : `Contains ${relevance.matchedSkills.length} matched skills for ${relevance.targetRole}. Recommended to add proof of: ${relevance.missingSkills.slice(0, 3).join(', ')}.`,

      experienceRelevance: resumeData.experience && resumeData.experience.length >= 1
        ? `Relevant career engagements detected across ${resumeData.experience.length} roles/internships.`
        : 'Limited formal work history entries; projects and academic achievements carry higher weighting.',

      projectRelevance: resumeData.projects && resumeData.projects.length >= 1
        ? `Strong technical artifact demonstrations across ${resumeData.projects.length} project portfolios.`
        : 'Adding dedicated technical projects with GitHub repositories significantly boosts relevance.',

      achievementQuality: quality.hasMetrics
        ? `Includes verifiable quantifiable achievements (${quality.metricExamples.slice(0, 2).join(', ')}).`
        : 'Bullet points lack numeric metrics; add quantified impact (e.g. "% speed improvement", "user count").'
    };

    const recommendations: string[] = [];
    if (!quality.hasMetrics) {
      recommendations.push('Add quantifiable metrics to project/experience bullets (e.g. "Optimized API throughput by 35%").');
    }
    if (relevance.missingSkills.length > 0) {
      recommendations.push(`Incorporate genuine proof of ${relevance.missingSkills.slice(0, 3).join(', ')} into your project descriptions.`);
    }
    if (!quality.hasSummary) {
      recommendations.push('Add a 2-sentence technical summary highlighting your core expertise and target role.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Tailor secondary keywords for each specific job application.');
    }

    return {
      overallScore: Math.min(99, Math.max(30, overallScore)),
      targetRole: relevance.targetRole,
      breakdown: {
        atsCompatibility: atsParsingScore,
        keywordMatch: keywordScore,
        experienceRelevance: expScore,
        projectRelevance: projScore,
        achievementQuality: metricScore,
        formatting: formatScore,
        sectionCompleteness: atsParsingScore,
      },
      breakdownExplanations,
      strengths: quality.strengths,
      weaknesses: quality.issues,
      matchedSkills: relevance.matchedSkills,
      missingKeywords: relevance.missingSkills,
      recommendations,
    };
  }

  public static calculateScore(
    resumeData: ResumeData,
    targetRole: string,
    careerStage: 'FRESHER' | 'PROFESSIONAL',
    semanticAnalysis: GeminiSemanticAnalysisResult,
    _jobDescription?: string
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
        structureCompleteness * 0.20 +
        roleAlignment * 0.10 +
        contentQuality * 0.10
      );
    } else {
      overall = Math.round(
        keywordMatch * 0.30 +
        experienceRelevance * 0.30 +
        structureCompleteness * 0.15 +
        roleAlignment * 0.15 +
        contentQuality * 0.10
      );
    }

    const finalScore = Math.min(100, Math.max(0, overall));

    let matchLevel: ATSMatchCategory = 'MODERATE';
    if (finalScore >= 80) matchLevel = 'STRONG';
    else if (finalScore >= 60) matchLevel = 'GOOD';
    else if (finalScore < 40) matchLevel = 'NEEDS_IMPROVEMENT';

    return {
      score: finalScore,
      breakdown: {
        overall: finalScore,
        keywordMatch,
        experienceRelevance,
        projectRelevance,
        structureCompleteness,
        roleAlignment,
        contentQuality,
      },
      matchLevel,
    };
  }
}
