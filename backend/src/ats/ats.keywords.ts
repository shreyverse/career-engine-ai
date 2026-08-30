export class ATSKeywordsEngine {
  private static STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
    'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
    'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for',
    'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
    'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more',
    'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
    'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such',
    'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
    'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what',
    'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours',
    'yourself', 'yourselves', 'will', 'must', 'shall', 'years', 'experience', 'responsible', 'working',
    'ability', 'strong', 'good', 'demonstrated', 'ideal', 'candidate', 'looking', 'join', 'team',
    'qualifications', 'requirements', 'responsibilities', 'role', 'job', 'position', 'company',
  ]);

  private static TECH_TERMS = [
    'typescript', 'javascript', 'python', 'java', 'golang', 'rust', 'c++', 'c#', '.net', 'php', 'ruby',
    'react', 'next.js', 'vue', 'angular', 'svelte', 'node.js', 'express', 'nestjs', 'django', 'fastapi',
    'flask', 'spring boot', 'graphql', 'rest api', 'restful', 'grpc', 'microservices', 'distributed systems',
    'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'ci/cd', 'github actions', 'jenkins',
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'dynamodb', 'sqlite',
    'tailwind css', 'css3', 'html5', 'redux', 'zustand', 'websockets', 'oauth', 'jwt', 'prisma', 'typeorm',
    'git', 'linux', 'system design', 'agile', 'scrum', 'unit testing', 'jest', 'vitest', 'cypress', 'playwright'
  ];

  public static extractKeywordsFromText(text: string): string[] {
    if (!text) return [];
    const normalized = text.toLowerCase();
    const found = new Set<string>();

    for (const term of this.TECH_TERMS) {
      const regex = new RegExp('\\b' + term.replace(/[.+*?^${}()|[\]\\/]/g, '\\$&') + '\\b', 'i');
      if (regex.test(normalized)) {
        found.add(term);
      }
    }

    const words = normalized.match(/\\b[a-z0-9#+.-]{2,25}\\b/g) || [];
    for (const w of words) {
      if (!this.STOP_WORDS.has(w) && isNaN(Number(w))) {
        if (this.TECH_TERMS.includes(w)) {
          found.add(w);
        }
      }
    }

    return Array.from(found);
  }

  public static parseJobDescriptionRequirements(jdText: string): { required: string[]; preferred: string[] } {
    if (!jdText) return { required: [], preferred: [] };
    const lines = jdText.split('\n');
    const required: Set<string> = new Set();
    const preferred: Set<string> = new Set();

    let currentSection: 'REQUIRED' | 'PREFERRED' | 'GENERAL' = 'GENERAL';

    for (const line of lines) {
      const lower = line.toLowerCase().trim();
      if (lower.includes('preferred') || lower.includes('nice to have') || lower.includes('bonus') || lower.includes('plus')) {
        currentSection = 'PREFERRED';
      } else if (lower.includes('required') || lower.includes('qualifications') || lower.includes('must have') || lower.includes('requirements')) {
        currentSection = 'REQUIRED';
      }

      const extracted = this.extractKeywordsFromText(line);
      for (const kw of extracted) {
        if (currentSection === 'PREFERRED') {
          preferred.add(kw);
        } else {
          required.add(kw);
        }
      }
    }

    if (required.size === 0 && preferred.size === 0) {
      const all = this.extractKeywordsFromText(jdText);
      all.forEach((k) => required.add(k));
    }

    return {
      required: Array.from(required),
      preferred: Array.from(preferred).filter((k) => !required.has(k)),
    };
  }
}
