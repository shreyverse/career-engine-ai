import { ResumeData } from '../types/resume.types';
import { ATSScoreBreakdown, ATSMatchCategory } from '../types/ats.types';
import { GeminiSemanticAnalysisResult } from './ats.semantic';
import { ResumeQualityFindings } from './ats.quality.agent';
import { JobRelevanceAnalysis } from './ats.relevance.agent';

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
  matchedSkills: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export class ATSScoringEngine {
  public static calculate(
    resumeData: ResumeData,
    quality: ResumeQualityFindings,
    relevance: JobRelevanceAnalysis
  ): DeterministicATSReport {
    const atsParsingScore = quality.structureScore;
    const keywordScore = relevance.skillMatchPercentage;
    const expScore = relevance.experienceRelevanceScore;
    const projScore = relevance.projectRelevanceScore;
    const metricScore = quality.achievementScore;
    const formatScore = quality.formattingScore;
    const completenessScore = quality.structureScore;
    const contactScore = quality.hasContactInfo ? 100 : 40;

    const overallScore = Math.round(
      atsParsingScore * 0.20 +
      keywordScore * 0.25 +
      expScore * 0.20 +
      projScore * 0.10 +
      metricScore * 0.10 +
      formatScore * 0.05 +
      completenessScore * 0.05 +
      contactScore * 0.05
    );

    const breakdownExplanations = {
      atsCompatibility: quality.hasContactInfo && quality.hasExperience
        ? 'Standard contact headers and clean chronological structure ensure seamless ATS text parsing.'
        : 'Missing standard contact links or section headers may reduce parsing fidelity in older ATS systems.',
      
      keywordMatch: relevance.matchedSkills.length >= 4
        ? 'Contains ' + relevance.matchedSkills.length + ' core keywords matching ' + relevance.targetRole + ' benchmarks (' + relevance.matchedSkills.slice(0, 3).join(', ') + ').'
        : 'Limited keyword density for ' + relevance.targetRole + '. Missing high-priority skills: ' + relevance.missingSkills.slice(0, 3).join(', ') + '.',
      
      experienceRelevance: resumeData.experience && resumeData.experience.length >= 2
        ? 'Strong career trajectory across ' + resumeData.experience.length + ' roles with relevant engineering responsibilities.'
        : 'Limited formal experience entries; consider adding internships, freelance, or open-source engagements.',
      
      projectRelevance: resumeData.projects && resumeData.projects.length >= 1
        ? 'Demonstrates practical application with ' + resumeData.projects.length + ' portfolio projects highlighting relevant tooling.'
        : 'Adding dedicated technical projects with GitHub repositories significantly boosts relevance.',
      
      achievementQuality: quality.hasMetrics
        ? 'Includes verifiable quantifiable achievements (' + quality.metricExamples.slice(0, 2).join(', ') + ').'
        : 'Bullet points lack numeric metrics; add quantified impact (e.g. "% speed improvement", "user count").'
    };

    const recommendations: string[] = [];
    if (!quality.hasMetrics) {
      recommendations.push('Add quantifiable metrics to bullet points (e.g. "Scaled API throughput by 40% for 10k users").');
    }
    if (relevance.missingSkills.length > 0) {
      recommendations.push('Incorporate genuine proof of ' + relevance.missingSkills.slice(0, 3).join(', ') + ' into project descriptions.');
    }
    if (!quality.hasSummary) {
      recommendations.push('Add a 2-sentence technical summary highlighting your core expertise and target role.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Tailor secondary keywords for each specific job application.');
    }

    return {
      overallScore: Math.min(99, Math.max(30, overallScore)),
      breakdown: {
        atsCompatibility: atsParsingScore,
        keywordMatch: keywordScore,
        experienceRelevance: expScore,
        projectRelevance: projScore,
        achievementQuality: metricScore,
        formatting: formatScore,
        sectionCompleteness: completenessScore,
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

