export interface CanonicalSkill {
  name: string;
  category: 'LANGUAGES' | 'FRONTEND' | 'BACKEND' | 'DATABASES' | 'CLOUD_DEVOPS' | 'AI_ML' | 'FUNDAMENTALS' | 'TOOLS' | 'ARCHITECTURE';
  aliases: string[];
}

export const SKILL_TAXONOMY: CanonicalSkill[] = [
  // Programming Languages
  { name: 'Java', category: 'LANGUAGES', aliases: ['java', 'core java', 'advanced java', 'j2ee'] },
  { name: 'Python', category: 'LANGUAGES', aliases: ['python', 'python3', 'py'] },
  { name: 'JavaScript', category: 'LANGUAGES', aliases: ['javascript', 'js', 'es6', 'ecmascript', 'vanilla js'] },
  { name: 'TypeScript', category: 'LANGUAGES', aliases: ['typescript', 'ts'] },
  { name: 'C++', category: 'LANGUAGES', aliases: ['c++', 'cpp'] },
  { name: 'C#', category: 'LANGUAGES', aliases: ['c#', 'csharp', '.net'] },
  { name: 'Go', category: 'LANGUAGES', aliases: ['golang', 'go language'] },
  { name: 'Rust', category: 'LANGUAGES', aliases: ['rust'] },
  { name: 'PHP', category: 'LANGUAGES', aliases: ['php', 'php7', 'php8'] },
  { name: 'Ruby', category: 'LANGUAGES', aliases: ['ruby', 'ruby on rails'] },
  { name: 'SQL', category: 'LANGUAGES', aliases: ['sql', 't-sql', 'pl/sql', 'structured query language'] },

  // Frontend
  { name: 'React', category: 'FRONTEND', aliases: ['react', 'react.js', 'reactjs', 'react native'] },
  { name: 'Next.js', category: 'FRONTEND', aliases: ['next.js', 'nextjs', 'next js'] },
  { name: 'Vue.js', category: 'FRONTEND', aliases: ['vue', 'vue.js', 'vuejs'] },
  { name: 'Angular', category: 'FRONTEND', aliases: ['angular', 'angularjs', 'angular.js'] },
  { name: 'HTML5', category: 'FRONTEND', aliases: ['html', 'html5'] },
  { name: 'CSS3', category: 'FRONTEND', aliases: ['css', 'css3', 'scss', 'sass'] },
  { name: 'Tailwind CSS', category: 'FRONTEND', aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
  { name: 'Redux', category: 'FRONTEND', aliases: ['redux', 'redux toolkit', 'rtk'] },

  // Backend
  { name: 'Node.js', category: 'BACKEND', aliases: ['node.js', 'nodejs', 'node js', 'node'] },
  { name: 'Express.js', category: 'BACKEND', aliases: ['express.js', 'expressjs', 'express js', 'express'] },
  { name: 'Spring Boot', category: 'BACKEND', aliases: ['spring boot', 'springboot', 'spring framework', 'spring mvc', 'spring'] },
  { name: 'Django', category: 'BACKEND', aliases: ['django', 'django rest framework', 'drf'] },
  { name: 'Flask', category: 'BACKEND', aliases: ['flask'] },
  { name: 'FastAPI', category: 'BACKEND', aliases: ['fastapi', 'fast api'] },
  { name: 'REST APIs', category: 'BACKEND', aliases: ['rest apis', 'rest api', 'restful apis', 'restful api', 'restful web services', 'restful services', 'rest', 'api development'] },
  { name: 'GraphQL', category: 'BACKEND', aliases: ['graphql', 'apollo graphql'] },
  { name: 'MERN Stack', category: 'BACKEND', aliases: ['mern stack', 'mern', 'mean stack'] },

  // Databases & Storage
  { name: 'MongoDB', category: 'DATABASES', aliases: ['mongodb', 'mongo', 'mongoose'] },
  { name: 'MySQL', category: 'DATABASES', aliases: ['mysql'] },
  { name: 'PostgreSQL', category: 'DATABASES', aliases: ['postgresql', 'postgres', 'psql'] },
  { name: 'Redis', category: 'DATABASES', aliases: ['redis', 'redis cache'] },
  { name: 'Firebase', category: 'DATABASES', aliases: ['firebase', 'firestore', 'firebase realtime db'] },
  { name: 'Supabase', category: 'DATABASES', aliases: ['supabase'] },
  { name: 'Elasticsearch', category: 'DATABASES', aliases: ['elasticsearch', 'elk stack'] },

  // CS Fundamentals
  { name: 'Data Structures & Algorithms (DSA)', category: 'FUNDAMENTALS', aliases: ['dsa', 'data structures and algorithms', 'data structures & algorithms', 'data structures', 'algorithms', 'problem solving'] },
  { name: 'Object-Oriented Programming (OOP)', category: 'FUNDAMENTALS', aliases: ['oop', 'oops', 'object-oriented programming', 'object oriented programming', 'object-oriented design', 'ood'] },
  { name: 'Database Management Systems (DBMS)', category: 'FUNDAMENTALS', aliases: ['dbms', 'database management systems', 'database management system', 'relational databases', 'rdbms'] },
  { name: 'Operating Systems (OS)', category: 'FUNDAMENTALS', aliases: ['os', 'operating systems', 'operating system', 'process management', 'threads'] },
  { name: 'Computer Networks', category: 'FUNDAMENTALS', aliases: ['computer networks', 'cn', 'networking', 'tcp/ip', 'http/https', 'network protocols'] },
  { name: 'System Design', category: 'ARCHITECTURE', aliases: ['system design', 'distributed systems', 'high availability', 'scalability', 'load balancing'] },
  { name: 'Microservices', category: 'ARCHITECTURE', aliases: ['microservices', 'microservice architecture', 'micro-services'] },

  // Cloud & DevOps & Tools
  { name: 'Git', category: 'TOOLS', aliases: ['git', 'version control', 'git cli'] },
  { name: 'GitHub', category: 'TOOLS', aliases: ['github', 'open source contributor', 'open source contribution', 'github actions'] },
  { name: 'Docker', category: 'CLOUD_DEVOPS', aliases: ['docker', 'containerization', 'containers'] },
  { name: 'Kubernetes', category: 'CLOUD_DEVOPS', aliases: ['kubernetes', 'k8s'] },
  { name: 'AWS', category: 'CLOUD_DEVOPS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'] },
  { name: 'GCP', category: 'CLOUD_DEVOPS', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { name: 'Azure', category: 'CLOUD_DEVOPS', aliases: ['azure', 'microsoft azure'] },
  { name: 'CI/CD', category: 'CLOUD_DEVOPS', aliases: ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment', 'jenkins', 'gitlab ci'] },
  { name: 'Linux', category: 'TOOLS', aliases: ['linux', 'unix', 'bash', 'shell scripting'] },

  // AI & ML & Data
  { name: 'PyTorch', category: 'AI_ML', aliases: ['pytorch'] },
  { name: 'TensorFlow', category: 'AI_ML', aliases: ['tensorflow', 'tf', 'keras'] },
  { name: 'Scikit-learn', category: 'AI_ML', aliases: ['scikit-learn', 'sklearn', 'scikit learn'] },
  { name: 'Pandas', category: 'AI_ML', aliases: ['pandas'] },
  { name: 'NumPy', category: 'AI_ML', aliases: ['numpy'] },
  { name: 'Machine Learning', category: 'AI_ML', aliases: ['machine learning', 'ml', 'supervised learning', 'unsupervised learning', 'fraud detection system', 'model training'] },
  { name: 'Deep Learning', category: 'AI_ML', aliases: ['deep learning', 'dl', 'neural networks', 'cnn', 'rnn'] },
  { name: 'Large Language Models (LLMs)', category: 'AI_ML', aliases: ['llm', 'llms', 'large language models', 'generative ai', 'genai', 'gpt', 'gemini'] },
  { name: 'RAG & Vector Databases', category: 'AI_ML', aliases: ['rag', 'retrieval-augmented generation', 'vector databases', 'vector db', 'pinecone', 'chroma', 'langchain', 'llamaindex'] },
  { name: 'NLP', category: 'AI_ML', aliases: ['nlp', 'natural language processing', 'transformers', 'hugging face', 'huggingface'] }
];
