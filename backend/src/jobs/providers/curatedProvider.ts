import { JobProvider } from '../jobs.provider';
import { NormalizedJob, JobSearchQuery } from '../../types/jobs.types';

export const CURATED_JOBS_FEED: NormalizedJob[] = [
  {
    id: 'job-curated-001',
    source: 'CareerEngine Curated',
    sourceJobId: 'ce-swe-01',
    title: 'Senior Fullstack Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    remoteType: 'REMOTE',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    description: 'We are looking for a Senior Fullstack Engineer to design high-throughput financial infrastructure and intuitive dashboards using React, TypeScript, Node.js, and PostgreSQL.',
    requirements: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Distributed Systems'],
    preferredSkills: ['Redis', 'GraphQL', 'AWS', 'Kubernetes'],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    experienceRequirement: '4+ years of professional fullstack engineering',
    educationRequirement: "Bachelor's in Computer Science or equivalent practical experience",
    salary: { min: 165000, max: 215000, currency: 'USD', period: 'YEAR' },
    applicationUrl: 'https://stripe.com/jobs',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-curated-002',
    source: 'CareerEngine Curated',
    sourceJobId: 'ce-swe-02',
    title: 'Fullstack Developer',
    company: 'Datadog',
    location: 'New York, NY',
    remoteType: 'HYBRID',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    description: 'Join our telemetry platform team to build real-time monitoring visualizations and robust backend APIs in TypeScript, React, and Go.',
    requirements: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL'],
    preferredSkills: ['Docker', 'Microservices', 'Kafka'],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    experienceRequirement: '2+ years building web applications',
    salary: { min: 135000, max: 175000, currency: 'USD', period: 'YEAR' },
    applicationUrl: 'https://www.datadoghq.com/careers',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-curated-003',
    source: 'CareerEngine Curated',
    sourceJobId: 'ce-swe-03',
    title: 'Junior Software Engineer',
    company: 'Figma',
    location: 'San Francisco, CA',
    remoteType: 'REMOTE',
    employmentType: 'FULL_TIME',
    experienceLevel: 'ENTRY',
    description: 'We welcome enthusiastic builders with strong foundational computer science skills in JavaScript/TypeScript, React, and data structures. Project work and passion for design systems valued.',
    requirements: ['JavaScript', 'TypeScript', 'React', 'HTML/CSS', 'Data Structures'],
    preferredSkills: ['Node.js', 'Git', 'REST APIs'],
    technologies: ['JavaScript', 'TypeScript', 'React', 'Git'],
    experienceRequirement: '0-2 years of software development or intensive portfolio projects',
    salary: { min: 110000, max: 140000, currency: 'USD', period: 'YEAR' },
    applicationUrl: 'https://www.figma.com/careers',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-curated-004',
    source: 'CareerEngine Curated',
    sourceJobId: 'ce-swe-04',
    title: 'Backend Cloud Architect',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    remoteType: 'REMOTE',
    employmentType: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    description: 'Design and operate massive-scale distributed streaming delivery systems using AWS, Kubernetes, Go/Java, and event-driven patterns.',
    requirements: ['Distributed Systems', 'AWS', 'Kubernetes', 'Microservices', 'PostgreSQL', 'Redis'],
    preferredSkills: ['Kafka', 'gRPC', 'Terraform'],
    technologies: ['AWS', 'Kubernetes', 'PostgreSQL', 'Redis', 'Kafka'],
    experienceRequirement: '6+ years in distributed architecture',
    salary: { min: 220000, max: 320000, currency: 'USD', period: 'YEAR' },
    applicationUrl: 'https://jobs.netflix.com',
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job-curated-005',
    source: 'CareerEngine Curated',
    sourceJobId: 'ce-swe-05',
    title: 'Frontend React Developer',
    company: 'Vercel',
    location: 'Remote',
    remoteType: 'REMOTE',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    description: 'Build cutting-edge developer tooling interfaces and web performance analytics using Next.js, React, Tailwind CSS, and TypeScript.',
    requirements: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Web Performance'],
    preferredSkills: ['Edge Computing', 'GraphQL'],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    experienceRequirement: '2+ years of modern frontend engineering',
    salary: { min: 140000, max: 180000, currency: 'USD', period: 'YEAR' },
    applicationUrl: 'https://vercel.com/careers',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export class CuratedJobProvider implements JobProvider {
  public name = 'CuratedProvider';

  public async fetchJobs(query: JobSearchQuery): Promise<NormalizedJob[]> {
    let results = [...CURATED_JOBS_FEED];

    if (query.query) {
      const q = query.query.toLowerCase();
      results = results.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.technologies.some((t) => t.toLowerCase().includes(q)) ||
          j.requirements.some((r) => r.toLowerCase().includes(q))
      );
    }

    if (query.remote) {
      results = results.filter((j) => j.remoteType === 'REMOTE');
    }

    if (query.remoteType) {
      results = results.filter((j) => j.remoteType === query.remoteType);
    }

    if (query.experienceLevel) {
      results = results.filter((j) => j.experienceLevel === query.experienceLevel);
    }

    if (query.employmentType) {
      results = results.filter((j) => j.employmentType === query.employmentType);
    }

    return results;
  }

  public async getJobById(id: string): Promise<NormalizedJob | null> {
    return CURATED_JOBS_FEED.find((j) => j.id === id) || null;
  }
}
