import { ResumeExtractionAgent } from './ats.extraction.agent';
import { ResumeQualityAgent } from './ats.quality.agent';
import { JobRelevanceAgent } from './ats.relevance.agent';
import { ATSScoringEngine, DeterministicATSReport } from './ats.scoring';
import { ATSCriticAgent } from './ats.critic.agent';
import { ResumeParser } from '../resume/resume.parser';
import fs from 'fs';

export interface FullATSPipelineResult extends DeterministicATSReport {
  fileName: string;
  parsedData: any;
  categoryScores: {
    atsCompatibility: number;
    skillsMatch: number;
    keywordOptimization: number;
    experienceRelevance: number;
    resumeStructure: number;
  };
  improvements: string[];
}

export class ATSPipeline {
  public static async analyzeResume(
    file: Express.Multer.File,
    targetRole?: string
  ): Promise<FullATSPipelineResult> {
    const rawText = await ResumeParser.extractTextFromFile(file.path, file.originalname);
    const resumeData = await ResumeExtractionAgent.extract(rawText, targetRole);
    const quality = ResumeQualityAgent.evaluate(resumeData, rawText);
    const relevance = JobRelevanceAgent.analyze(resumeData, targetRole);
    const initialReport = ATSScoringEngine.calculate(resumeData, quality, relevance);
    const finalReport = ATSCriticAgent.validate(initialReport, resumeData, rawText);

    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch {}

    return {
      fileName: file.originalname,
      parsedData: resumeData,
      overallScore: finalReport.overallScore,
      atsScore: finalReport.overallScore,
      breakdown: finalReport.breakdown,
      categoryScores: {
        atsCompatibility: finalReport.breakdown.atsCompatibility,
        skillsMatch: finalReport.breakdown.keywordMatch,
        keywordOptimization: finalReport.breakdown.keywordMatch,
        experienceRelevance: finalReport.breakdown.experienceRelevance,
        resumeStructure: finalReport.breakdown.formatting,
      },
      breakdownExplanations: finalReport.breakdownExplanations,
      strengths: finalReport.strengths,
      weaknesses: finalReport.weaknesses,
      matchedSkills: finalReport.matchedSkills,
      missingKeywords: finalReport.missingKeywords,
      improvements: finalReport.weaknesses.concat(finalReport.recommendations),
      recommendations: finalReport.recommendations,
    } as any;
  }
}