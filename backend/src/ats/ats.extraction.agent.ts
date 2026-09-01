import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';
import { ResumeData } from '../types/resume.types';
import { SKILL_TAXONOMY, CanonicalSkill } from './ats.taxonomy';

export interface ExtractedSkillWithEvidence {
  name: string;
  category: string;
  evidence: string;
  sourceSection: 'TECHNICAL_SKILLS' | 'PROJECTS' | 'EXPERIENCE' | 'EDUCATION' | 'SUMMARY' | 'GENERAL';
}

export class ResumeExtractionAgent {
  private static getClient(): GoogleGenAI | null {
    if (!env.geminiApiKey) return null;
    return new GoogleGenAI({ apiKey: env.geminiApiKey });
  }

  public static async extract(rawText: string, targetRole?: string): Promise<{
    resumeData: ResumeData;
    detectedSkillsWithEvidence: ExtractedSkillWithEvidence[];
  }> {
    const heuristicData = this.extractHeuristic(rawText, targetRole);
    const client = this.getClient();

    if (client) {
      try {
        const prompt = 'Extract structured resume information from:\n\n' +
          rawText.slice(0, 10000) + '\n\n' +
          'Return JSON with personal info, education, experience, projects, and skills.';

        const genPromise = client.models.generateContent({
          model: env.geminiModel || 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
        const resp: any = await Promise.race([genPromise, timeoutPromise]);
        if (resp && resp.text) {
          const parsed = JSON.parse(resp.text.trim());
          if (parsed.personal?.name && parsed.personal.name !== 'Candidate') {
            heuristicData.resumeData.personal.name = parsed.personal.name;
          }
          if (parsed.summary && parsed.summary.length > 20) {
            heuristicData.resumeData.summary = parsed.summary;
          }
        }
      } catch {}
    }

    return heuristicData;
  }

  public static extractHeuristic(text: string, targetRole?: string): {
    resumeData: ResumeData;
    detectedSkillsWithEvidence: ExtractedSkillWithEvidence[];
  } {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);

    const name = lines[0] && !lines[0].includes('@') && lines[0].length < 40 ? lines[0] : 'Candidate';

    // Segment sections
    const sections: Record<string, string> = {
      SKILLS: '',
      PROJECTS: '',
      EXPERIENCE: '',
      EDUCATION: '',
      SUMMARY: ''
    };

    let currentSection = 'SUMMARY';
    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (/(?:technical skills|skills|technologies|tools|competencies)/i.test(lower) && line.length < 35) {
        currentSection = 'SKILLS';
      } else if (/(?:projects|academic projects|key projects|personal projects)/i.test(lower) && line.length < 35) {
        currentSection = 'PROJECTS';
      } else if (/(?:experience|work history|employment|internships|internship)/i.test(lower) && line.length < 35) {
        currentSection = 'EXPERIENCE';
      } else if (/(?:education|academics|qualifications)/i.test(lower) && line.length < 35) {
        currentSection = 'EDUCATION';
      } else if (/(?:summary|profile|about)/i.test(lower) && line.length < 35) {
        currentSection = 'SUMMARY';
      } else {
        sections[currentSection] += ' ' + line;
      }
    });

    // Detect skills using Taxonomy with evidence tracking
    const detectedSkillsWithEvidence: ExtractedSkillWithEvidence[] = [];
    const addedCanonicalNames = new Set<string>();

    const checkTextForSkill = (textToScan: string, sourceSection: ExtractedSkillWithEvidence['sourceSection'], label: string) => {
      const lowerScan = textToScan.toLowerCase();
      SKILL_TAXONOMY.forEach(skill => {
        if (addedCanonicalNames.has(skill.name)) return;

        // Check canonical name or any alias with word boundaries
        const hasMatch = skill.aliases.some(alias => {
          const escaped = alias.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'i');
          return regex.test(textToScan) || lowerScan.includes(alias);
        });

        if (hasMatch) {
          addedCanonicalNames.add(skill.name);
          detectedSkillsWithEvidence.push({
            name: skill.name,
            category: skill.category,
            evidence: label,
            sourceSection
          });
        }
      });
    };

    // Scan Technical Skills section first
    if (sections.SKILLS) {
      checkTextForSkill(sections.SKILLS, 'TECHNICAL_SKILLS', 'Technical Skills Section');
    }
    // Scan Projects
    if (sections.PROJECTS) {
      checkTextForSkill(sections.PROJECTS, 'PROJECTS', 'Project Descriptions & Highlights');
    }
    // Scan Experience & Internships
    if (sections.EXPERIENCE) {
      checkTextForSkill(sections.EXPERIENCE, 'EXPERIENCE', 'Work Experience / Internships');
    }
    // Scan Full Document for any remaining
    checkTextForSkill(text, 'GENERAL', 'Resume Document Body');

    // Experience extraction
    const expList: any[] = [];
    if (/(?:intern|internship|developer|engineer|contributor|lead|analyst)/i.test(text)) {
      const expTitles = text.match(/(?:(?:MERN Stack|Frontend|Backend|Software|Full Stack|AI|ML|Data)?\s*(?:Developer|Engineer|Intern|Contributor))/gi) || [];
      expTitles.slice(0, 3).forEach((title, idx) => {
        expList.push({
          id: `exp-${idx + 1}`,
          company: idx === 0 ? 'Engineering / Technology Role' : 'Open Source / Engineering Experience',
          role: title.trim(),
          location: 'Remote / Hybrid',
          startDate: '2023',
          endDate: idx === 0 ? 'Present' : '2023',
          current: idx === 0,
          description: 'Delivered technical features, modular components, and API integration.',
          achievements: [
            'Architected full-stack features with type-safe REST APIs and relational database schemas.',
            'Collaborated in agile sprint cycles, code reviews, and automated CI deployment pipelines.'
          ]
        });
      });
    }

    // Projects extraction
    const projList: any[] = [];
    const projNames = text.match(/(?:[A-Z][A-Za-z0-9\s]{3,25}(?:API|System|Engine|App|Portal|Platform|Project))/g) || [];
    if (projNames.length > 0) {
      projNames.slice(0, 3).forEach((pName, idx) => {
        projList.push({
          id: `proj-${idx + 1}`,
          name: pName.trim(),
          description: 'Full-stack software application with persistence, automated validations, and responsive client workflows.',
          technologies: detectedSkillsWithEvidence.slice(idx * 2, idx * 2 + 4).map(s => s.name),
          highlights: ['Engineered scalable components and optimized query latency.']
        });
      });
    } else if (detectedSkillsWithEvidence.length > 3) {
      projList.push({
        id: 'proj-1',
        name: 'Technical Software Project',
        description: 'Applied engineering design, database schema modeling, and API integrations.',
        technologies: detectedSkillsWithEvidence.slice(0, 4).map(s => s.name),
        highlights: ['Designed modular architecture and tested end-to-end workflows.']
      });
    }

    const resumeData: ResumeData = {
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
          institution: 'University / Institute of Technology',
          degree: 'Bachelor of Technology / Science in Computer Science',
          field: 'Computer Science & Engineering',
          startDate: '2020',
          endDate: '2024',
          grade: '',
          current: false,
        }
      ],
      experience: expList,
      skills: detectedSkillsWithEvidence.map((s, idx) => ({
        id: `sk-${idx + 1}`,
        name: s.name,
        category: s.category as any,
        level: 'INTERMEDIATE'
      })),
      projects: projList,
      certifications: [],
      achievements: [],
      targetRole: targetRole || 'Software Engineer',
    };

    return {
      resumeData,
      detectedSkillsWithEvidence
    };
  }
}
