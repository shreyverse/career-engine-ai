import { FeatureItem, StepItem } from "../types";

export const THEME_COLORS = {
  background: "#090D16", // Obsidian Charcoal
  surface: "#0F172A",
  surfaceElevated: "#131D31",
  primary: "#6366F1", // Indigo
  secondary: "#8B5CF6", // Violet
  success: "#10B981", // Emerald
  muted: "#94A3B8", // Slate
  border: "#1E293B",
};

export const HOW_IT_WORKS_STEPS: StepItem[] = [
  {
    number: 1,
    title: "Tell us about yourself",
    description: "Share your background, current expertise, education, and passions in an intuitive assessment.",
    iconName: "UserCheck",
  },
  {
    number: 2,
    title: "Understand your career goal",
    description: "Define where you want to go — whether breaking into tech, switching tracks, or aiming for a senior role.",
    iconName: "Compass",
  },
  {
    number: 3,
    title: "Analyze your skill gaps",
    description: "Compare your current profile against thousands of real industry roles to pinpoint high-leverage missing skills.",
    iconName: "Target",
  },
  {
    number: 4,
    title: "Build your roadmap",
    description: "Receive an actionable, personalized milestone-by-milestone curriculum tailored to your exact timeline.",
    iconName: "Route",
  },
  {
    number: 5,
    title: "Track your progress",
    description: "Monitor competency growth, verify completed projects, and stay accountable to your career trajectory.",
    iconName: "TrendingUp",
  },
];

export const PRODUCT_FEATURES: FeatureItem[] = [
  {
    id: "career-assessment",
    title: "Career Assessment",
    tagline: "Understand your current position",
    description: "A deep dive evaluation mapping your practical technical skills, project depth, and professional competencies.",
    iconName: "Compass",
    badge: "Foundation",
    status: "Coming Soon",
  },
  {
    id: "ai-career-analysis",
    title: "AI Career Analysis",
    tagline: "Identify what is holding you back",
    description: "Intelligent diagnostic models detect hidden blindspots, resume gaps, and market misalignments.",
    iconName: "Sparkles",
    badge: "AI Powered",
    status: "Coming Soon",
  },
  {
    id: "skill-gap",
    title: "Skill Gap",
    tagline: "Discover the skills you need next",
    description: "Systematic matrix comparison revealing missing high-demand frameworks, architectural concepts, and tooling.",
    iconName: "Layers",
    badge: "Analytics",
    status: "Coming Soon",
  },
  {
    id: "personalized-roadmap",
    title: "Personalized Roadmap",
    tagline: "Get a structured path toward your goal",
    description: "Structured sprint plans with curated learning resources, verifiable milestone deliverables, and checkpoints.",
    iconName: "Milestone",
    badge: "Roadmap",
    status: "Coming Soon",
  },
  {
    id: "resume-builder",
    title: "Resume Builder",
    tagline: "Build a professional resume",
    description: "Modern, high-impact resume templates engineered for readability, ATS parsers, and executive recruiters.",
    iconName: "FileText",
    badge: "Editor",
    status: "Coming Soon",
  },
  {
    id: "ats-analyzer",
    title: "ATS Analyzer",
    tagline: "Understand how well your resume matches",
    description: "Real-time semantic matching scores your resume directly against specific target job descriptions.",
    iconName: "Cpu",
    badge: "Scanner",
    status: "Coming Soon",
  },
  {
    id: "career-dashboard",
    title: "Career Dashboard",
    tagline: "Track your progress",
    description: "Centralized intelligence hub providing velocity metrics, competency rings, and upcoming target dates.",
    iconName: "LayoutDashboard",
    badge: "Workspace",
    status: "Coming Soon",
  },
];
