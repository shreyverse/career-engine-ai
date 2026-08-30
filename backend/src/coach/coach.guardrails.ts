export class CoachGuardrails {
  public static sanitizeUserInput(text: string): string {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();
  }

  public static checkSafetyAndCompliance(userPrompt: string): { isSafe: boolean; warning?: string; isOffTopic?: boolean } {
    const lower = userPrompt.toLowerCase().trim();

    // Check for prompt injection attempts
    if (lower.includes('ignore all previous instructions') || lower.includes('system prompt override')) {
      return {
        isSafe: false,
        warning: 'I am your Career Engine AI Coach. I will help guide your career based on verified data from your profile and roadmap.',
      };
    }

    // Check for requests to fabricate resume claims
    if (lower.includes('fake experience') || lower.includes('lie on my resume') || lower.includes('add skills i do not have')) {
      return {
        isSafe: true,
        warning: 'Career Engine strongly recommends adding only genuine skills and verified project achievements to your resume.',
      };
    }

    // Common off-topic / dismissive / gibberish keywords or slang (Hindi/Hinglish/English)
    const offTopicPatterns = [
      /^chup$/i,
      /^chup\b/i,
      /^kam nahi/i,
      /^kaam nahi/i,
      /^kuch nahi/i,
      /^kuch bhi/i,
      /^pagal/i,
      /^bakwas/i,
      /^shut up/i,
      /^tell me a joke/i,
      /^what is the weather/i,
      /^who are you/i,
      /^hi$/i,
      /^hello$/i,
      /^hey$/i,
      /^bye$/i,
      /^ok$/i,
      /^okay$/i,
      /^[a-z]{1,3}$/i,
    ];

    const isMatchOffTopic = offTopicPatterns.some((pattern) => pattern.test(lower));
    if (isMatchOffTopic) {
      return {
        isSafe: true,
        isOffTopic: true,
        warning: "Sorry, I didn't understand or catch a career-related question in your message. I am your AI Career Coach specialized in technical career growth, skill gaps, roadmaps, interview prep, and resumes.\n\nHow can I help you with your career goals, target skills, or roadmap tasks today?",
      };
    }

    return { isSafe: true };
  }

  public static isCareerRelated(userPrompt: string): boolean {
    const lower = userPrompt.toLowerCase();
    const careerKeywords = [
      'career', 'job', 'skill', 'roadmap', 'resume', 'ats', 'interview', 'salary',
      'role', 'engineer', 'developer', 'frontend', 'backend', 'fullstack', 'full stack',
      'react', 'node', 'javascript', 'typescript', 'python', 'java', 'sql', 'database',
      'aws', 'cloud', 'system design', 'architecture', 'project', 'company', 'experience',
      'week', 'focus', 'task', 'priority', 'learn', 'practice', 'prep', 'study',
      'fresher', 'portfolio', 'apply', 'applied', 'hiring', 'assessment', 'level'
    ];

    return careerKeywords.some((kw) => lower.includes(kw));
  }
}
