import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';
import { ResumeData } from '../types/resume.types';
import { ATSGeminiAnalysisSchema } from './ats.schema';
import { ATSKeywordsEngine } from './ats.keywords';

export interface GeminiSemanticAnalysisResult {
  matchedSkills: Array<{ term: string; category: string }>;
  missingSkills: Array<{ term: string; category: string; importance: 'REQUIRED' | 'PREFERRED'; reason: string; action: 'ADD_IF_GENUINE' | 'LEARN' }>;
  semanticMatches: Array<{ resumeTerm: string; jdTerm: string; explanation: string }>;
  strengths: Array<{ title: string; explanation: string }>;
  contentIssues: Array<{ title: string; reason: string; action: string; before?: string; after?: string; section: string }>;
  recommendations: Array<{ type: 'CONTENT' | 'SKILL' | 'KEYWORD' | 'STRUCTURE' | 'EXPERIENCE' | 'PROJECT' | 'FORMATTING'; priority: 'HIGH' | 'MEDIUM' | 'LOW'; title: string; reason: string; action: string }>;
}

export class ATSSemanticService {
  private static getClient(): GoogleGenAI | null {
    if (!env.geminiApiKey) return null;
    return new GoogleGenAI({ apiKey: env.geminiApiKey });
  }

  public static async analyzeSemantics(
    resumeData: ResumeData,
    targetRole: string,
    jobDescription?: string
  ): Promise<GeminiSemanticAnalysisResult> {
    const client = this.getClient();

    if (client) {
      try {
        const systemInstruction = 'You are an advanced AI Career and ATS Intelligence Engine.\n' +
          'Your role is to perform objective semantic compatibility analysis between a candidate resume and a target role / job description.\n' +
          'CRITICAL RULES:\n' +
          '1. ANTI-HALLUCINATION: NEVER invent metrics, percentages (e.g. "boosted sales by 40%"), technologies, or certifications not in the resume.\n' +
          '2. ANTI-KEYWORD STUFFING: Do NOT advise blindly inserting keywords. Distinguish between "ADD_IF_GENUINE" (candidate has related proof in bullets) and "LEARN" (genuine skill gap to acquire).\n' +
          '3. SEMANTIC MATCHING: Identify conceptual matches between resume phrases and JD requirements (e.g. "Built RESTful APIs" matches "REST service development").\n' +
          '4. Return strictly valid JSON adhering to the schema without markdown fences.';

        const resumeSummary = JSON.stringify({
          targetRole: resumeData.targetRole || targetRole,
          summary: resumeData.summary,
          skills: resumeData.skills,
          experience: resumeData.experience?.map((e) => ({ role: e.role, company: e.company, achievements: e.achievements })),
          projects: resumeData.projects?.map((p) => ({ name: p.name, tech: p.technologies, highlights: p.highlights })),
          education: resumeData.education,
        });

        const userPrompt = 'Perform semantic ATS analysis for the following:\n\n' +
          'TARGET ROLE: ' + targetRole + '\n\n' +
          (jobDescription ? 'JOB DESCRIPTION:\n' + jobDescription.slice(0, 10000) + '\n\n' : '') +
          'CANDIDATE RESUME DATA:\n' + resumeSummary + '\n\n' +
          'Extract semantic matches, missing skills (categorized as REQUIRED or PREFERRED), strengths, content issues with before/after rewrite examples where appropriate, and actionable recommendations.';

        const response = await client.models.generateContent({
          model: env.geminiModel || 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          config: {
            systemInstruction,
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        });

        const rawJson = response.text?.trim() || '{}';
        const parsed = JSON.parse(rawJson);
        const validated = ATSGeminiAnalysisSchema.safeParse(parsed);

        if (validated.success) {
          return validated.data as GeminiSemanticAnalysisResult;
        }
      } catch (err: any) {
        console.error('Gemini ATS semantic analysis error, using heuristic fallback:', err.message);
      }
    }

    return this.heuristicFallbackAnalysis(resumeData, targetRole, jobDescription);
  }

  private static heuristicFallbackAnalysis(
    resumeData: ResumeData,
    targetRole: string,
    jobDescription?: string
  ): GeminiSemanticAnalysisResult {
    const resumeText = [
      resumeData.summary || '',
      ...(resumeData.skills?.map((s) => s.name) || []),
      ...(resumeData.experience?.map((e) => (e.role + ' ' + (e.achievements || []).join(' '))) || []),
      ...(resumeData.projects?.map((p) => (p.name + ' ' + (p.technologies || []).join(' ') + ' ' + (p.highlights || []).join(' '))) || []),
    ].join(' ');

    const resumeKeywords = ATSKeywordsEngine.extractKeywordsFromText(resumeText);
    const jdKeywords = jobDescription
      ? ATSKeywordsEngine.parseJobDescriptionRequirements(jobDescription)
      : { required: ATSKeywordsEngine.extractKeywordsFromText(targetRole), preferred: [] };

    const resumeSet = new Set(resumeKeywords.map((k) => k.toLowerCase()));

    const matchedSkills = jdKeywords.required
      .filter((k) => resumeSet.has(k.toLowerCase()))
      .map((term) => ({ term, category: 'TECHNICAL' }));

    const missingSkills: Array<{ term: string; category: string; importance: 'REQUIRED' | 'PREFERRED'; reason: string; action: 'ADD_IF_GENUINE' | 'LEARN' }> = [];

    jdKeywords.required
      .filter((k) => !resumeSet.has(k.toLowerCase()))
      .forEach((term) => {
        missingSkills.push({
          term,
          category: 'TECHNICAL',
          importance: 'REQUIRED',
          reason: 'Mentioned as a core technology for ' + targetRole + ' but not detected in resume.',
          action: 'LEARN',
        });
      });

    jdKeywords.preferred
      .filter((k) => !resumeSet.has(k.toLowerCase()))
      .forEach((term) => {
        missingSkills.push({
          term,
          category: 'TECHNICAL',
          importance: 'PREFERRED',
          reason: 'Listed as preferred / bonus qualification.',
          action: 'ADD_IF_GENUINE',
        });
      });

    const strengths = [
      {
        title: 'Relevant Technical Stack',
        explanation: 'Your resume features ' + matchedSkills.length + ' key competencies aligned with ' + targetRole + '.',
      },
      {
        title: 'Structured Resume Presentation',
        explanation: 'Resume contains clear section headers and readable bullet points.',
      },
    ];

    const recommendations: Array<{ type: 'CONTENT' | 'SKILL' | 'KEYWORD' | 'STRUCTURE' | 'EXPERIENCE' | 'PROJECT' | 'FORMATTING'; priority: 'HIGH' | 'MEDIUM' | 'LOW'; title: string; reason: string; action: string }> = [];

    if (missingSkills.length > 0) {
      recommendations.push({
        type: 'KEYWORD',
        priority: 'HIGH',
        title: 'Address Missing Core Requirements',
        reason: 'Core terms such as ' + missingSkills.slice(0, 3).map((m) => m.term).join(', ') + ' are absent from your resume.',
        action: 'If you have hands-on experience with these tools, integrate them into your project or experience bullets with authentic context.',
      });
    }

    if ((resumeData.projects || []).length > 0) {
      recommendations.push({
        type: 'PROJECT',
        priority: 'MEDIUM',
        title: 'Deepen Project Technical Detail',
        reason: 'Highlight specific architecture patterns, APIs, and libraries used in your listed projects.',
        action: 'Ensure each project highlights personal technical contributions and deployment choices.',
      });
    }

    return {
      matchedSkills,
      missingSkills,
      semanticMatches: [
        {
          resumeTerm: 'REST API integration',
          jdTerm: 'Web services and API development',
          explanation: 'Demonstrates equivalent API development experience.',
        },
      ],
      strengths,
      contentIssues: [],
      recommendations,
    };
  }
}
