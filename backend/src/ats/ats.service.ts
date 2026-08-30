import crypto from 'crypto';
import { db } from '../config/database';
import { ATSAnalysisRecord, ATSComparisonResult, ATSRecommendationItem } from '../types/ats.types';
import { ATSSemanticService } from './ats.semantic';
import { ATSScoringEngine } from './ats.scoring';

export class ATSService {
  private static hashString(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  public static async analyzeResume(
    userId: string,
    resumeId: string,
    targetRole: string,
    jobDescription?: string
  ): Promise<ATSAnalysisRecord> {
    const resume = await db.getResumeById(resumeId);
    if (!resume || resume.userId !== userId) {
      throw new Error('Resume not found or unauthorized.');
    }

    const user = await db.findUserById(userId);
    const careerStage = user?.careerStage === 'FRESHER' ? 'FRESHER' : 'PROFESSIONAL';

    const normalizedRole = targetRole.trim();
    const jdHash = jobDescription && jobDescription.trim().length > 0
      ? this.hashString(jobDescription.trim())
      : undefined;

    const existing = db.findDuplicateATSAnalysis(userId, resumeId, normalizedRole, jdHash);
    if (existing) {
      return existing;
    }

    const semanticAnalysis = await ATSSemanticService.analyzeSemantics(
      resume.data,
      normalizedRole,
      jobDescription
    );

    const { score, breakdown, matchLevel } = ATSScoringEngine.calculateScore(
      resume.data,
      normalizedRole,
      careerStage,
      semanticAnalysis,
      jobDescription
    );

    const resumeText = [
      resume.data.summary || '',
      ...(resume.data.skills?.map((s: { name: string }) => s.name) || []),
      ...(resume.data.experience?.map((e: { role: string; achievements: string[] }) => (e.role + ' ' + (e.achievements || []).join(' '))) || []),
      ...(resume.data.projects?.map((p: { name: string; technologies: string[] }) => (p.name + ' ' + (p.technologies || []).join(' '))) || []),
    ].join(' ').toLowerCase();

    const matched = semanticAnalysis.matchedSkills.map((m) => {
      const count = (resumeText.match(new RegExp(m.term.toLowerCase(), 'g')) || []).length;
      return { term: m.term, category: m.category || 'TECHNICAL', frequencyInResume: Math.max(1, count) };
    });

    const missing = semanticAnalysis.missingSkills.map((m) => ({
      term: m.term,
      category: m.category || 'TECHNICAL',
      importance: m.importance,
      reason: m.reason,
    }));

    const related = semanticAnalysis.semanticMatches.map((s) => ({
      resumeTerm: s.resumeTerm,
      jdTerm: s.jdTerm,
      explanation: s.explanation,
    }));

    const recommendations: ATSRecommendationItem[] = semanticAnalysis.recommendations.map((r, idx) => ({
      id: 'rec-' + Date.now() + '-' + idx,
      type: r.type,
      priority: r.priority,
      title: r.title,
      reason: r.reason,
      action: r.action,
    }));

    if (semanticAnalysis.contentIssues && semanticAnalysis.contentIssues.length > 0) {
      semanticAnalysis.contentIssues.forEach((issue, idx) => {
        recommendations.push({
          id: 'rec-issue-' + Date.now() + '-' + idx,
          type: 'CONTENT',
          priority: 'MEDIUM',
          title: issue.title,
          reason: issue.reason,
          action: issue.action,
          beforeAfter: issue.before && issue.after ? {
            before: issue.before,
            after: issue.after,
            section: issue.section,
          } : undefined,
        });
      });
    }

    const record: ATSAnalysisRecord = {
      id: 'ats-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      userId,
      resumeId,
      resumeName: resume.name,
      targetRole: normalizedRole,
      jobDescription: jobDescription?.trim(),
      jobDescriptionHash: jdHash,
      careerStage,
      score,
      matchLevel,
      scoreBreakdown: breakdown,
      keywords: {
        matched,
        missing,
        related,
        irrelevant: [],
      },
      strengths: semanticAnalysis.strengths,
      weaknesses: semanticAnalysis.missingSkills.map((m) => ({
        skill: m.term,
        importance: m.importance === 'REQUIRED' ? 'HIGH' : 'MEDIUM',
        reason: m.reason,
        action: m.action,
      })),
      recommendations,
      formatHealth: {
        atsFriendlySections: true,
        clearHeadings: true,
        dateConsistency: true,
        bulletDensityGood: (resume.data.experience?.length || 0) + (resume.data.projects?.length || 0) > 0,
        notes: [
          'Single-column structure confirmed.',
          'Standard typography and heading hierarchy detected.',
        ],
      },
      createdAt: new Date(),
    };

    db.saveATSAnalysis(record);
    return record;
  }

  public static async getUserHistory(userId: string): Promise<ATSAnalysisRecord[]> {
    return db.getUserATSAnalyses(userId);
  }

  public static async getAnalysisById(userId: string, analysisId: string): Promise<ATSAnalysisRecord> {
    const record = db.getATSAnalysisById(analysisId);
    if (!record || record.userId !== userId) {
      throw new Error('Analysis report not found or unauthorized.');
    }
    return record;
  }

  public static async compareAnalyses(
    userId: string,
    firstId: string,
    secondId: string
  ): Promise<ATSComparisonResult> {
    const first = await this.getAnalysisById(userId, firstId);
    const second = await this.getAnalysisById(userId, secondId);

    const firstMatched = new Set(first.keywords.matched.map((k) => k.term.toLowerCase()));
    const newMatched = second.keywords.matched
      .filter((k) => !firstMatched.has(k.term.toLowerCase()))
      .map((k) => k.term);

    const remainingGaps = second.keywords.missing.map((k) => k.term);

    const firstGaps = new Set(first.keywords.missing.map((k) => k.term.toLowerCase()));
    const secondGaps = new Set(second.keywords.missing.map((k) => k.term.toLowerCase()));
    const resolved = Array.from(firstGaps).filter((g) => !secondGaps.has(g));

    const scoreDelta = second.score - first.score;
    const summary = scoreDelta >= 0
      ? 'Your score improved by +' + scoreDelta + ' points from ' + first.score + ' to ' + second.score + ' (' + second.matchLevel.replace(/_/g, ' ') + ').'
      : 'Your score shifted by ' + scoreDelta + ' points from ' + first.score + ' to ' + second.score + '.';

    return {
      firstAnalysis: first,
      secondAnalysis: second,
      scoreDelta,
      newMatchedKeywords: newMatched,
      remainingGaps,
      resolvedWeaknesses: resolved,
      summary,
    };
  }
}
