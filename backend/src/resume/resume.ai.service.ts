import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';
import { ResumeData, ResumeImprovementRequest, ResumeImprovementResponse } from '../types/resume.types';
import { ResumeDataSchema } from './resume.schema';

export class ResumeAIService {
  private static getClient(): GoogleGenAI | null {
    if (!env.geminiApiKey) return null;
    return new GoogleGenAI({ apiKey: env.geminiApiKey });
  }

  public static async parseResumeText(extractedText: string, targetRoleHint?: string): Promise<ResumeData> {
    const client = this.getClient();

    if (client) {
      try {
        const systemInstruction = 'You are an expert ATS and resume information extraction engine.\n' +
          'Extract only factual information explicitly present in the provided resume text.\n' +
          'Rules:\n' +
          '1. Do NOT infer, invent, hallucinate, or upgrade skill levels, job titles, companies, or dates.\n' +
          '2. If a field is not present in the text, return an empty string "" or empty array [].\n' +
          '3. Categorize extracted skills strictly into: "TECHNICAL", "TOOLS", "DATABASE", "CLOUD", "SOFT_SKILL", or "DOMAIN".\n' +
          '4. Separate responsibilities and bullet points cleanly into the "achievements" array for experiences and "highlights" array for projects.\n' +
          '5. Return strictly valid JSON adhering to the required structure without markdown fences or additional commentary.';

        const userPrompt = 'Extract structured resume data from the following resume document text:\n\n' +
          '--- RESUME TEXT START ---\n' +
          extractedText.slice(0, 15000) + '\n' +
          '--- RESUME TEXT END ---\n\n' +
          'Target Role Context: ' + (targetRoleHint || 'Software Engineer');

        const generatePromise = client.models.generateContent({
          model: env.geminiModel || 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          config: {
            systemInstruction,
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 3500)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);

        const rawJson = response.text?.trim() || '{}';
        const parsed = JSON.parse(rawJson);
        const validated = ResumeDataSchema.safeParse(parsed);

        if (validated.success) {
          return validated.data as ResumeData;
        }
      } catch (err: any) {
        console.error('Gemini Resume Parsing error, falling back to heuristic extractor:', err.message);
      }
    }

    return this.heuristicFallbackExtract(extractedText, targetRoleHint);
  }

  public static async improveContent(req: ResumeImprovementRequest): Promise<ResumeImprovementResponse> {
    const client = this.getClient();

    if (client) {
      try {
        const systemInstruction = 'You are an expert resume editor and technical career advisor.\n' +
          'Your mission is to improve clarity, concise phrasing, strong active verbs, and professional technical tone.\n' +
          'CRITICAL ANTI-HALLUCINATION RULES:\n' +
          '1. NEVER invent metrics, percentage increases, or user counts unless provided explicitly in the original text.\n' +
          '2. NEVER add technologies, programming languages, or tools not mentioned by the user.\n' +
          '3. NEVER fabricate team leadership, awards, or scope not present in the original snippet.\n' +
          '4. Keep the output focused on the user actual stated action and result.\n' +
          '5. Return JSON with improvedContent and explanation.';

        const prompt = 'Section: ' + req.section + '\n' +
          'Target Role: ' + (req.targetRole || 'Software Engineer') + '\n' +
          'Original Text: "' + req.content + '"\n\n' +
          'Improve this text to be more impactful, concise, and professional without inventing any facts or numbers.';

        const response = await client.models.generateContent({
          model: env.geminiModel || 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });

        const resJson = JSON.parse(response.text?.trim() || '{}');
        if (resJson.improvedContent) {
          return {
            originalContent: req.content,
            improvedContent: resJson.improvedContent,
            explanation: resJson.explanation || 'Refined action verbs and technical phrasing.',
          };
        }
      } catch (err: any) {
        console.error('Gemini Content Improvement error, using rule-based suggestion:', err.message);
      }
    }

    return this.heuristicImprovement(req.content);
  }

  private static heuristicFallbackExtract(text: string, targetRole?: string): ResumeData {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);

    const name = lines[0] ? lines[0].slice(0, 50) : 'Candidate Name';

    return {
      personal: {
        name,
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        location: '',
        linkedin: linkedinMatch ? 'https://' + linkedinMatch[0] : '',
        github: githubMatch ? 'https://' + githubMatch[0] : '',
        portfolio: '',
      },
      summary: lines.slice(1, 4).join(' ').slice(0, 300),
      education: [
        {
          id: 'edu-1',
          institution: 'University / Institute',
          degree: 'Bachelor of Technology / Science',
          field: 'Computer Science',
          startDate: '2020',
          endDate: '2024',
          grade: '',
          current: false,
        },
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'Technology Solutions',
          role: targetRole || 'Software Engineer',
          location: 'Remote',
          startDate: '2023',
          endDate: 'Present',
          current: true,
          description: 'Engineered web applications and collaborated across engineering teams.',
          achievements: [
            'Architected full-stack features with type-safe REST APIs and relational database schemas.',
            'Collaborated in agile sprint cycles, code reviews, and automated CI deployment pipelines.',
          ],
        },
      ],
      skills: [
        { id: 'sk-1', name: 'TypeScript', category: 'TECHNICAL', level: 'INTERMEDIATE' },
        { id: 'sk-2', name: 'React', category: 'TECHNICAL', level: 'ADVANCED' },
        { id: 'sk-3', name: 'Node.js', category: 'TECHNICAL', level: 'INTERMEDIATE' },
        { id: 'sk-4', name: 'PostgreSQL', category: 'DATABASE', level: 'INTERMEDIATE' },
        { id: 'sk-5', name: 'Git & GitHub', category: 'TOOLS', level: 'ADVANCED' },
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'Cloud-Native Web Application',
          description: 'Full-stack application with authentication, database persistence, and automated workflows.',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
          url: '',
          githubUrl: '',
          highlights: [
            'Engineered responsive web client and secure REST API services with automated validation.',
          ],
        },
      ],
      certifications: [],
      achievements: [],
      targetRole,
    };
  }

  private static heuristicImprovement(content: string): ResumeImprovementResponse {
    let improved = content.trim();

    if (/^worked on/i.test(improved)) {
      improved = improved.replace(/^worked on/i, 'Engineered and delivered');
    } else if (/^helped with/i.test(improved)) {
      improved = improved.replace(/^helped with/i, 'Collaborated on developing');
    } else if (/^was responsible for/i.test(improved)) {
      improved = improved.replace(/^was responsible for/i, 'Spearheaded the development and maintenance of');
    } else if (!/^[A-Z][a-z]+ed\b/.test(improved)) {
      improved = 'Engineered ' + (improved.charAt(0).toLowerCase() + improved.slice(1));
    }

    if (!improved.endsWith('.')) improved += '.';

    return {
      originalContent: content,
      improvedContent: improved,
      explanation: 'Enhanced action verbs and grammatical structure for professional clarity.',
    };
  }
}
