import { DeterministicATSReport } from './ats.scoring';
import { ResumeData } from '../types/resume.types';

export class ATSCriticAgent {
  public static validate(
    report: DeterministicATSReport,
    resumeData: ResumeData,
    rawText: string
  ): DeterministicATSReport {
    const validated = { ...report };

    const totalSkills = resumeData.skills?.length || 0;
    if (rawText.length < 150 || totalSkills === 0) {
      validated.overallScore = Math.min(45, validated.overallScore);
      validated.breakdown.keywordMatch = Math.min(40, validated.breakdown.keywordMatch);
      validated.breakdown.sectionCompleteness = Math.min(35, validated.breakdown.sectionCompleteness);
      if (!validated.weaknesses.includes('Resume content is too brief for competitive ATS evaluation.')) {
        validated.weaknesses.unshift('Resume content is too brief for competitive ATS evaluation.');
      }
    }

    const hasNumbers = /\b(\d+%|\$\d+|\d+x|\d+\+?\s*(users|clients|ms|s))\b/i.test(rawText);
    if (!hasNumbers) {
      validated.breakdown.achievementQuality = Math.min(60, validated.breakdown.achievementQuality);
    }

    const textLower = rawText.toLowerCase();
    validated.matchedSkills = validated.matchedSkills.filter(skill => 
      textLower.includes(skill.toLowerCase()) || 
      (resumeData.skills || []).some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === skill.toLowerCase())
    );

    return validated;
  }
}