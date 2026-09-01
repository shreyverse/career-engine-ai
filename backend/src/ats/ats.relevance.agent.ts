import { ResumeData } from '../types/resume.types';
import { getRoleBenchmark, RoleBenchmark } from './ats.benchmarks';
import { ExtractedSkillWithEvidence } from './ats.extraction.agent';

export interface MatchedSkillItem {
  name: string;
  evidence: string;
  isCore: boolean;
}

export interface JobRelevanceAnalysis {
  targetRole: string;
  benchmark: RoleBenchmark;
  matchedSkills: MatchedSkillItem[];
  missingSkills: string[];
  matchedCount: number;
  coreMatchedCount: number;
  coreTotalCount: number;
  skillMatchPercentage: number;
  experienceRelevanceScore: number;
  projectRelevanceScore: number;
  explanation: string;
}

export class JobRelevanceAgent {
  public static analyze(
    resumeData: ResumeData,
    detectedSkillsWithEvidence: ExtractedSkillWithEvidence[],
    targetRole?: string
  ): JobRelevanceAnalysis {
    const benchmark = getRoleBenchmark(targetRole);
    const detectedSkillMap = new Map<string, ExtractedSkillWithEvidence>();

    detectedSkillsWithEvidence.forEach(item => {
      detectedSkillMap.set(item.name.toLowerCase(), item);
    });

    const matchedSkills: MatchedSkillItem[] = [];
    const matchedNamesSet = new Set<string>();

    // 1. Check Core Skills
    let coreMatchedCount = 0;
    benchmark.coreSkills.forEach(coreSkill => {
      const match = detectedSkillMap.get(coreSkill.toLowerCase());
      if (match) {
        coreMatchedCount++;
        matchedNamesSet.add(coreSkill.toLowerCase());
        matchedSkills.push({
          name: coreSkill,
          evidence: match.evidence,
          isCore: true
        });
      }
    });

    // 2. Check Common Skills
    benchmark.commonSkills.forEach(commonSkill => {
      const match = detectedSkillMap.get(commonSkill.toLowerCase());
      if (match && !matchedNamesSet.has(commonSkill.toLowerCase())) {
        matchedNamesSet.add(commonSkill.toLowerCase());
        matchedSkills.push({
          name: commonSkill,
          evidence: match.evidence,
          isCore: false
        });
      }
    });

    // 3. Include any other detected technical skills that belong to the relevant taxonomy
    detectedSkillsWithEvidence.forEach(item => {
      if (!matchedNamesSet.has(item.name.toLowerCase())) {
        matchedNamesSet.add(item.name.toLowerCase());
        matchedSkills.push({
          name: item.name,
          evidence: item.evidence,
          isCore: false
        });
      }
    });

    // 4. Construct Missing Skills (ONLY skills in the benchmark that are NOT in matchedSkills)
    const missingSkills: string[] = [];
    benchmark.coreSkills.forEach(skill => {
      if (!matchedNamesSet.has(skill.toLowerCase())) {
        missingSkills.push(skill);
      }
    });
    benchmark.commonSkills.forEach(skill => {
      if (!matchedNamesSet.has(skill.toLowerCase()) && missingSkills.length < 8) {
        missingSkills.push(skill);
      }
    });

    // Guaranteed Non-Contradiction Check
    // If a skill is in matchedSkills, it CANNOT be in missingSkills
    const cleanMissingSkills = missingSkills.filter(missing =>
      !matchedSkills.some(m => m.name.toLowerCase() === missing.toLowerCase())
    );

    // Calculate Skill Match Score (Weighted: Core skills 70%, Common skills 30%)
    const coreRatio = coreMatchedCount / Math.max(1, benchmark.coreSkills.length);
    const totalBenchmarkCount = benchmark.coreSkills.length + benchmark.commonSkills.length;
    const overallRatio = matchedSkills.length / Math.max(1, totalBenchmarkCount);

    let skillMatchPercentage = Math.round((coreRatio * 65) + (overallRatio * 35));
    if (matchedSkills.length >= 8) skillMatchPercentage = Math.max(82, skillMatchPercentage);
    if (matchedSkills.length >= 12) skillMatchPercentage = Math.max(92, skillMatchPercentage);
    skillMatchPercentage = Math.min(98, Math.max(35, skillMatchPercentage));

    // Experience Relevance
    let experienceRelevanceScore = 55;
    const expCount = resumeData.experience?.length || 0;
    if (expCount >= 2) experienceRelevanceScore = 88;
    else if (expCount === 1) experienceRelevanceScore = 78;
    if (matchedSkills.length >= 6) experienceRelevanceScore += 8;
    experienceRelevanceScore = Math.min(96, experienceRelevanceScore);

    // Project Relevance
    let projectRelevanceScore = 60;
    const projCount = resumeData.projects?.length || 0;
    if (projCount >= 2) projectRelevanceScore = 90;
    else if (projCount === 1) projectRelevanceScore = 80;
    projectRelevanceScore = Math.min(96, projectRelevanceScore);

    let explanation = '';
    if (matchedSkills.length >= 8) {
      explanation = `Exceptional skill alignment with ${benchmark.roleName} hiring standards. Verified ${matchedSkills.length} relevant technologies across technical sections, projects, and work history.`;
    } else if (matchedSkills.length >= 4) {
      explanation = `Solid foundational alignment with ${benchmark.roleName} benchmarks (${matchedSkills.length} skills verified). Adding proof for ${cleanMissingSkills.slice(0, 3).join(', ')} will elevate competitiveness.`;
    } else {
      explanation = `Limited technical keyword overlap for ${benchmark.roleName} (${matchedSkills.length} matched). Recommended focus: ${cleanMissingSkills.slice(0, 4).join(', ')}.`;
    }

    return {
      targetRole: benchmark.roleName,
      benchmark,
      matchedSkills,
      missingSkills: cleanMissingSkills,
      matchedCount: matchedSkills.length,
      coreMatchedCount,
      coreTotalCount: benchmark.coreSkills.length,
      skillMatchPercentage,
      experienceRelevanceScore,
      projectRelevanceScore,
      explanation
    };
  }
}
