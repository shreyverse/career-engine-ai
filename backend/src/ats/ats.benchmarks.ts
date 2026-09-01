export interface RoleBenchmark {
  roleName: string;
  description: string;
  coreSkills: string[];
  commonSkills: string[];
}

export const ROLE_BENCHMARKS: Record<string, RoleBenchmark> = {
  'software engineer': {
    roleName: 'Software Engineer',
    description: 'Core software engineering role focusing on algorithmic problem solving, clean code, databases, APIs, and modern frameworks.',
    coreSkills: [
      'Data Structures & Algorithms (DSA)',
      'Object-Oriented Programming (OOP)',
      'Git',
      'SQL',
      'REST APIs',
      'Database Management Systems (DBMS)',
      'Operating Systems (OS)'
    ],
    commonSkills: [
      'Java',
      'Python',
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Spring Boot',
      'MongoDB',
      'MySQL',
      'PostgreSQL',
      'Docker',
      'CI/CD',
      'System Design',
      'Computer Networks'
    ]
  },
  'backend developer': {
    roleName: 'Backend Developer',
    description: 'Server-side architecture, REST/GraphQL APIs, relational and NoSQL databases, microservices, and performance optimization.',
    coreSkills: [
      'REST APIs',
      'SQL',
      'Database Management Systems (DBMS)',
      'Git',
      'Object-Oriented Programming (OOP)',
      'System Design'
    ],
    commonSkills: [
      'Java',
      'Spring Boot',
      'Node.js',
      'Express.js',
      'Python',
      'PostgreSQL',
      'MongoDB',
      'MySQL',
      'Redis',
      'Docker',
      'Microservices',
      'CI/CD',
      'AWS'
    ]
  },
  'frontend developer': {
    roleName: 'Frontend Developer',
    description: 'Client-side applications, modern JavaScript/TypeScript, reactive state management, responsive UI, and REST integration.',
    coreSkills: [
      'JavaScript',
      'TypeScript',
      'React',
      'HTML5',
      'CSS3',
      'Git',
      'REST APIs'
    ],
    commonSkills: [
      'Next.js',
      'Tailwind CSS',
      'Redux',
      'Vue.js',
      'Angular',
      'GraphQL',
      'GitHub',
      'Node.js'
    ]
  },
  'full stack developer': {
    roleName: 'Full Stack Developer',
    description: 'End-to-end web applications combining modern frontend frameworks, backend API services, databases, and deployment.',
    coreSkills: [
      'JavaScript',
      'React',
      'Node.js',
      'REST APIs',
      'SQL',
      'Git',
      'HTML5',
      'CSS3'
    ],
    commonSkills: [
      'TypeScript',
      'Express.js',
      'MongoDB',
      'PostgreSQL',
      'MySQL',
      'Next.js',
      'Tailwind CSS',
      'MERN Stack',
      'Docker',
      'AWS',
      'CI/CD'
    ]
  },
  'ai engineer': {
    roleName: 'AI / Machine Learning Engineer',
    description: 'Designing and deploying machine learning models, neural networks, LLM pipelines, and AI systems.',
    coreSkills: [
      'Python',
      'Machine Learning',
      'PyTorch',
      'TensorFlow',
      'Data Structures & Algorithms (DSA)',
      'Git'
    ],
    commonSkills: [
      'Large Language Models (LLMs)',
      'RAG & Vector Databases',
      'Deep Learning',
      'NLP',
      'Scikit-learn',
      'Pandas',
      'NumPy',
      'FastAPI',
      'Docker',
      'AWS'
    ]
  },
  'data scientist': {
    roleName: 'Data Scientist',
    description: 'Statistical analysis, data pipelines, predictive modeling, machine learning algorithms, and data visualization.',
    coreSkills: [
      'Python',
      'SQL',
      'Machine Learning',
      'Pandas',
      'NumPy',
      'Scikit-learn'
    ],
    commonSkills: [
      'Database Management Systems (DBMS)',
      'Deep Learning',
      'NLP',
      'PostgreSQL',
      'Git',
      'Docker',
      'AWS'
    ]
  },
  'devops engineer': {
    roleName: 'DevOps / Cloud Engineer',
    description: 'Automated CI/CD pipelines, container orchestration, cloud infrastructure, monitoring, and Linux administration.',
    coreSkills: [
      'Linux',
      'Docker',
      'Kubernetes',
      'CI/CD',
      'Git',
      'AWS'
    ],
    commonSkills: [
      'Python',
      'System Design',
      'GCP',
      'Azure',
      'REST APIs',
      'PostgreSQL',
      'Redis'
    ]
  }
};

export function getRoleBenchmark(targetRole?: string): RoleBenchmark {
  if (!targetRole || targetRole.trim().length === 0) {
    return ROLE_BENCHMARKS['software engineer'];
  }

  const normalized = targetRole.trim().toLowerCase();
  for (const [key, benchmark] of Object.entries(ROLE_BENCHMARKS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return benchmark;
    }
  }

  // Fallback to Software Engineer
  return ROLE_BENCHMARKS['software engineer'];
}
