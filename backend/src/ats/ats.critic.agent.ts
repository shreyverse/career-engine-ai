import { DeterministicATSReport } from './ats.scoring';
import { ResumeData } from '../types/resume.types';

export class ATSCriticAgent {
  public static validate(
    report: DeterministicATSReport,
    resumeData: ResumeData,
    rawText: string
  ): DeterministicATSReport {
    const validated = { ...report };

    // 1. Strict Anti-Contradiction Check
    // A skill CANNOT be in both matchedSkills and missingKeywords
    const matchedNames = new Set(validated.matchedSkills.map(m => m.name.toLowerCase()));
    validated.missingKeywords = validated.missingKeywords.filter(missing =>
      !matchedNames.has(missing.toLowerCase())
    );

    // 2. Sanity Check: If resume has very short text (<150 chars) or zero skills
    if (rawText.length < 150 || validated.matchedSkills.length === 0) {
      validated.overallScore = Math.min(45, validated.overallScore);
      validated.breakdown.keywordMatch = Math.min(35, validated.breakdown.keywordMatch);
      validated.breakdown.sectionCompleteness = Math.min(35, validated.breakdown.sectionCompleteness);
      if (!validated.weaknesses.includes('Resume content is too brief for competitive ATS evaluation.')) {
        validated.weaknesses.unshift('Resume content is too brief for competitive ATS evaluation.');
      }
    }

    // 3. Metric sanity check
    const hasNumbers = /\b(\d+%|\$\d+|\d+x|\d+\+?\s*(users|clients|ms|s))\b/i.test(rawText);
    if (!hasNumbers) {
      validated.breakdown.achievementQuality = Math.min(60, validated.breakdown.achievementQuality);
    }

    return validated;
  }
}
