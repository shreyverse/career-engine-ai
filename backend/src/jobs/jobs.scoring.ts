import { NormalizedJob, JobMatchScore, JobMatchBreakdown } from '../types/jobs.types';
import { CareerStage } from '../types/auth.types';

export interface CandidateProfileForMatching {
  careerStage: CareerStage;
  targetRole: string;
  currentLevel: string;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  projects: Array<{ name: string; technologies: string[] }>;
  preferredWorkMode?: string;
}

export class JobScoringEngine {
  public static calculateMatchScore(
    candidate: CandidateProfileForMatching,
    job: NormalizedJob
  ): JobMatchScore {
    const isFresher = candidate.careerStage === 'FRESHER';
    const candidateSkillsLower = new Set(candidate.skills.map((s) => s.toLowerCase()));

    // 1. Skill Matching
    const matchedSkills: string[] = [];
    const missingRequiredSkills: string[] = [];
    const missingPreferredSkills: string[] = [];

    for (const req of job.requirements) {
      const reqLower = req.toLowerCase();
      if (candidateSkillsLower.has(reqLower) || Array.from(candidateSkillsLower).some((cs) => cs.includes(reqLower) || reqLower.includes(cs))) {
        matchedSkills.push(req);
      } else {
        missingRequiredSkills.push(req);
      }
    }

    for (const pref of job.preferredSkills) {
      const prefLower = pref.toLowerCase();
      if (candidateSkillsLower.has(prefLower) || Array.from(candidateSkillsLower).some((cs) => cs.includes(prefLower) || prefLower.includes(cs))) {
        matchedSkills.push(pref);
      } else {
        missingPreferredSkills.push(pref);
      }
    }

    const totalReqs = job.requirements.length || 1;
    const reqMatchedCount = job.requirements.filter((r) => matchedSkills.includes(r)).length;
    const skillMatchScore = Math.round((reqMatchedCount / totalReqs) * 100);

    // 2. Role Alignment
    const targetRoleLower = candidate.targetRole.toLowerCase();
    const jobTitleLower = job.title.toLowerCase();
    let roleAlignment = 60;
    if (targetRoleLower === jobTitleLower || jobTitleLower.includes(targetRoleLower) || targetRoleLower.includes(jobTitleLower)) {
      roleAlignment = 95;
    } else if (jobTitleLower.includes('engineer') || jobTitleLower.includes('developer')) {
      roleAlignment = 80;
    }

    // 3. Experience Match
    let experienceMatch = 75;
    if (isFresher) {
      // Freshers not penalized for entry roles
      if (job.experienceLevel === 'ENTRY') experienceMatch = 95;
      else if (job.experienceLevel === 'MID') experienceMatch = 70;
      else experienceMatch = 40;
    } else {
      if (candidate.currentLevel === 'SENIOR' && job.experienceLevel === 'SENIOR') experienceMatch = 95;
      else if (job.experienceLevel === 'MID') experienceMatch = 85;
      else experienceMatch = 65;
    }

    // 4. Project & Domain Relevance
    let projectDomainRelevance = 75;
    const candidateProjectTechs = candidate.projects.flatMap((p) => p.technologies.map((t) => t.toLowerCase()));
    const matchingProjectSkills = job.technologies.filter((t) => candidateProjectTechs.includes(t.toLowerCase()));
    if (matchingProjectSkills.length >= 2) projectDomainRelevance = 95;
    else if (matchingProjectSkills.length === 1) projectDomainRelevance = 80;

    // 5. Location / Remote Preference
    let locationPreference = 85;
    if (job.remoteType === 'REMOTE') locationPreference = 100;
    else if (candidate.preferredWorkMode && candidate.preferredWorkMode.toUpperCase() === job.remoteType) locationPreference = 95;

    // 6. Career Goal Alignment
    const careerGoalAlignment = roleAlignment >= 80 ? 90 : 70;

    // Adaptive Weighted Overall Score
    let overall = 0;
    if (isFresher) {
      // Fresher: Skills 35%, Projects 25%, Role 20%, Experience 5%, Location 5%, Goal 10%
      overall = Math.round(
        skillMatchScore * 0.35 +
        projectDomainRelevance * 0.25 +
        roleAlignment * 0.20 +
        experienceMatch * 0.05 +
        locationPreference * 0.05 +
        careerGoalAlignment * 0.10
      );
    } else {
      // Professional: Skills 30%, Role 25%, Experience 20%, Projects 10%, Goal 10%, Location 5%
      overall = Math.round(
        skillMatchScore * 0.30 +
        roleAlignment * 0.25 +
        experienceMatch * 0.20 +
        projectDomainRelevance * 0.10 +
        careerGoalAlignment * 0.10 +
        locationPreference * 0.05
      );
    }

    overall = Math.min(100, Math.max(10, overall));

    const breakdown: JobMatchBreakdown = {
      overall,
      roleAlignment,
      skillMatch: skillMatchScore,
      experienceMatch,
      projectDomainRelevance,
      locationPreference,
      careerGoalAlignment,
    };

    let matchCategory: 'STRONG_MATCH' | 'STRETCH_OPPORTUNITY' | 'LONG_SHOT' = 'STRETCH_OPPORTUNITY';
    if (overall >= 80) matchCategory = 'STRONG_MATCH';
    else if (overall < 60) matchCategory = 'LONG_SHOT';

    // Explainable "Why It Fits" and "Potential Gaps"
    const whyItFits: string[] = [];
    if (matchedSkills.length > 0) {
      whyItFits.push(`Your experience with ${matchedSkills.slice(0, 3).join(', ')} matches key position requirements.`);
    }
    if (roleAlignment >= 85) {
      whyItFits.push(`Strong alignment with your target role of ${candidate.targetRole}.`);
    }
    if (matchingProjectSkills.length > 0) {
      whyItFits.push(`Your verified portfolio projects demonstrate hands-on capability in ${matchingProjectSkills.slice(0, 2).join(', ')}.`);
    }

    const potentialGaps: string[] = [];
    if (missingRequiredSkills.length > 0) {
      potentialGaps.push(`Missing core requirements: ${missingRequiredSkills.slice(0, 3).join(', ')}.`);
    }
    if (!isFresher && job.experienceLevel === 'SENIOR' && candidate.currentLevel !== 'SENIOR') {
      potentialGaps.push('Position requests senior-level tenure and distributed architecture depth.');
    }

    return {
      jobId: job.id,
      score: overall,
      matchCategory,
      breakdown,
      matchedSkills,
      missingRequiredSkills,
      missingPreferredSkills,
      whyItFits,
      potentialGaps,
    };
  }
}
