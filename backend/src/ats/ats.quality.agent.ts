import { ResumeData } from '../types/resume.types';

export interface ResumeQualityFindings {
  structureScore: number;
  formattingScore: number;
  achievementScore: number;
  hasContactInfo: boolean;
  hasSummary: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasProjects: boolean;
  hasMetrics: boolean;
  metricExamples: string[];
  actionVerbsCount: number;
  strongVerbsFound: string[];
  issues: string[];
  strengths: string[];
}

export class ResumeQualityAgent {
  public static evaluate(resumeData: ResumeData, rawText: string): ResumeQualityFindings {
    const textLower = rawText.toLowerCase();
    const issues: string[] = [];
    const strengths: string[] = [];

    const hasEmail = Boolean(resumeData.personal?.email || textLower.includes('@'));
    const hasPhone = Boolean(resumeData.personal?.phone || /\b\d{10}\b|\+\d{1,3}/.test(rawText));
    const hasContactInfo = hasEmail && (hasPhone || Boolean(resumeData.personal?.linkedin || resumeData.personal?.github));
    const hasSummary = Boolean(resumeData.summary && resumeData.summary.trim().length > 25);
    const hasExperience = Boolean(resumeData.experience && resumeData.experience.length > 0);
    const hasEducation = Boolean(resumeData.education && resumeData.education.length > 0);
    const hasProjects = Boolean(resumeData.projects && resumeData.projects.length > 0);

    let structureScore = 40;
    if (hasContactInfo) structureScore += 15;
    if (hasSummary) structureScore += 10;
    if (hasExperience) structureScore += 15;
    if (hasEducation) structureScore += 10;
    if (hasProjects) structureScore += 10;
    structureScore = Math.min(100, structureScore);

    const metricMatches = rawText.match(/\b(\d+%(?:\s*increase|\s*reduction|\s*improvement)?|\$\d+[kKmM]?|\d+x|\d+\+?\s*(?:users|clients|ms|seconds|rps|qps|endpoints|engineers|projects))\b/gi) || [];
    const hasMetrics = metricMatches.length > 0;
    let achievementScore = 45;
    if (metricMatches.length >= 4) achievementScore = 95;
    else if (metricMatches.length >= 2) achievementScore = 80;
    else if (metricMatches.length === 1) achievementScore = 65;

    const actionVerbsList = [
      'developed', 'built', 'engineered', 'implemented', 'designed', 'optimized',
      'architected', 'spearheaded', 'orchestrated', 'scaled', 'reduced', 'improved',
      'delivered', 'collaborated', 'integrated', 'accelerated', 'automated', 'deployed'
    ];
    const strongVerbsFound: string[] = [];
    actionVerbsList.forEach(v => {
      if (textLower.includes(v)) strongVerbsFound.push(v);
    });

    let formattingScore = 75;
    if (rawText.length > 300 && rawText.length < 5000) formattingScore += 15;
    if (rawText.includes('\n\n') || rawText.includes('•') || rawText.includes('- ')) formattingScore += 10;
    formattingScore = Math.min(100, formattingScore);

    if (!hasMetrics) {
      issues.push('Missing quantifiable impact metrics (e.g. "% latency reduced", "scaled for 10k users").');
    } else {
      strengths.push('Demonstrates quantifiable achievements with measurable outcomes (' + metricMatches.length + ' metrics identified).');
    }

    if (strongVerbsFound.length >= 4) {
      strengths.push('Strong technical action verbs used consistently (' + strongVerbsFound.slice(0, 4).join(', ') + ').');
    } else {
      issues.push('Action verbs are limited; replace passive phrases with strong technical verbs (e.g. "Architected", "Optimized").');
    }

    if (hasExperience && hasProjects) {
      strengths.push('Well-balanced combination of professional experience and technical project demonstrations.');
    } else if (!hasExperience) {
      issues.push('No formal work experience detected; expand academic or personal project portfolios.');
    }

    if (!hasSummary) {
      issues.push('Missing a concise technical executive summary at the beginning of the resume.');
    }

    return {
      structureScore,
      formattingScore,
      achievementScore,
      hasContactInfo,
      hasSummary,
      hasExperience,
      hasEducation,
      hasProjects,
      hasMetrics,
      metricExamples: metricMatches.slice(0, 4),
      actionVerbsCount: strongVerbsFound.length,
      strongVerbsFound,
      issues,
      strengths,
    };
  }
}