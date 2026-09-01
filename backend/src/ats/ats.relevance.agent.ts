import { ResumeData } from '../types/resume.types';

export interface JobRelevanceAnalysis {
  targetRole: string;
  isSpecificRole: boolean;
  matchedSkills: string[];
  missingSkills: string[];
  relevantSkillsCount: number;
  skillMatchPercentage: number;
  experienceRelevanceScore: number;
  projectRelevanceScore: number;
  explanation: string;
}

export class JobRelevanceAgent {
  private static readonly ROLE_BENCHMARKS: Record<string, { required: string[]; preferred: string[] }> = {
    'ai engineer': {
      required: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'RAG', 'Vector Databases', 'LangChain', 'Deep Learning'],
      preferred: ['FastAPI', 'Docker', 'AWS', 'Kubernetes', 'Hugging Face', 'NLP']
    },
    'machine learning engineer': {
      required: ['Python', 'Scikit-learn', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Machine Learning', 'SQL'],
      preferred: ['MLOps', 'Docker', 'AWS', 'Deep Learning', 'Kubernetes']
    },
    'data scientist': {
      required: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'Data Science', 'Machine Learning'],
      preferred: ['Tableau', 'Power BI', 'R', 'PyTorch', 'BigQuery', 'Statistics']
    },
    'frontend developer': {
      required: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'REST API'],
      preferred: ['Next.js', 'Vue', 'GraphQL', 'Jest', 'Webpack', 'Figma']
    },
    'backend developer': {
      required: ['Node.js', 'TypeScript', 'Python', 'Java', 'REST API', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis'],
      preferred: ['Docker', 'Kubernetes', 'AWS', 'Microservices', 'GraphQL', 'CI/CD']
    },
    'full stack developer': {
      required: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'SQL', 'PostgreSQL', 'REST API', 'Git'],
      preferred: ['Docker', 'AWS', 'Next.js', 'MongoDB', 'Tailwind CSS', 'CI/CD']
    },
    'devops engineer': {
      required: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform', 'Git', 'Python'],
      preferred: ['Ansible', 'Prometheus', 'Grafana', 'Jenkins', 'GCP', 'Azure']
    },
    'software engineer': {
      required: ['Data Structures', 'System Design', 'Git', 'SQL', 'REST API', 'JavaScript', 'Python', 'Java'],
      preferred: ['Docker', 'React', 'Node.js', 'PostgreSQL', 'Microservices', 'CI/CD']
    }
  };

  public static analyze(resumeData: ResumeData, targetRole?: string): JobRelevanceAnalysis {
    const roleNormalized = (targetRole || 'Software Engineer').trim().toLowerCase();
    const isSpecificRole = Boolean(targetRole && targetRole.trim().length > 0);

    let benchmarkKey = Object.keys(this.ROLE_BENCHMARKS).find(k => roleNormalized.includes(k)) || 'software engineer';
    const benchmark = this.ROLE_BENCHMARKS[benchmarkKey];

    const resumeSkillNames = (resumeData.skills || []).map((s: any) => typeof s === 'string' ? s.toLowerCase() : (s?.name ? String(s.name).toLowerCase() : ''));
    
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    benchmark.required.forEach(skill => {
      if (resumeSkillNames.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    benchmark.preferred.forEach(skill => {
      if (resumeSkillNames.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))) {
        if (!matchedSkills.includes(skill)) matchedSkills.push(skill);
      } else {
        if (!missingSkills.includes(skill) && missingSkills.length < 6) missingSkills.push(skill);
      }
    });

    const totalBenchmarkSkills = benchmark.required.length;
    const matchRatio = matchedSkills.length / Math.max(1, totalBenchmarkSkills);
    const skillMatchPercentage = Math.min(98, Math.max(35, Math.round(matchRatio * 85) + 15));

    let experienceRelevanceScore = 50;
    const expCount = resumeData.experience?.length || 0;
    if (expCount >= 3) experienceRelevanceScore = 90;
    else if (expCount === 2) experienceRelevanceScore = 80;
    else if (expCount === 1) experienceRelevanceScore = 70;
    if (matchedSkills.length >= 4) experienceRelevanceScore += 10;
    experienceRelevanceScore = Math.min(96, experienceRelevanceScore);

    let projectRelevanceScore = 55;
    const projCount = resumeData.projects?.length || 0;
    if (projCount >= 2) projectRelevanceScore += 30;
    else if (projCount === 1) projectRelevanceScore += 15;
    projectRelevanceScore = Math.min(95, projectRelevanceScore);

    let explanation = '';
    const roleTitle = targetRole || 'Software Engineer';
    if (matchedSkills.length >= 5) {
      explanation = 'Strong keyword alignment with ' + roleTitle + ' hiring benchmarks, matching ' + matchedSkills.length + ' key technologies.';
    } else {
      explanation = 'Matches ' + matchedSkills.length + ' relevant technologies for ' + roleTitle + '. Lacks high-demand competencies such as ' + missingSkills.slice(0, 3).join(', ') + '.';
    }

    return {
      targetRole: roleTitle,
      isSpecificRole,
      matchedSkills,
      missingSkills,
      relevantSkillsCount: matchedSkills.length,
      skillMatchPercentage,
      experienceRelevanceScore,
      projectRelevanceScore,
      explanation,
    };
  }
}