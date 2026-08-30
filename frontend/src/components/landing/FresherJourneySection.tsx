import React from "react";
import { Sparkles, Code, FolderGit2, FileText, Users, Briefcase, ArrowRight } from "lucide-react";
import { Section } from "../layout/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";

export const FresherJourneySection: React.FC = () => {
  const steps = [
    {
      title: "Interest",
      icon: Sparkles,
      desc: "Identify natural aptitudes, curiosity, and emerging domain interests.",
      badge: "Discovery",
    },
    {
      title: "Skills",
      icon: Code,
      desc: "Acquire high-leverage foundations in modern frameworks and computer science.",
      badge: "Capability",
    },
    {
      title: "Projects",
      icon: FolderGit2,
      desc: "Build fullstack, production-grade portfolio applications with live deployments.",
      badge: "Proof of Work",
    },
    {
      title: "Resume",
      icon: FileText,
      desc: "Package achievements and technical deliverables into high-scoring ATS formats.",
      badge: "Positioning",
    },
    {
      title: "Interview",
      icon: Users,
      desc: "Master system design patterns, behavioral scenarios, and live coding rounds.",
      badge: "Preparation",
    },
    {
      title: "Job",
      icon: Briefcase,
      desc: "Secure entry-level and junior positions at high-growth engineering teams.",
      badge: "Placement",
    },
  ];

  return (
    <Section
      id="freshers"
      badge="For Freshers & Students"
      subtitle="From Classroom to Tech Career"
      title="Starting your career?"
      description="Career Engine provides an end-to-end blueprint guiding university graduates and early-career learners into their first engineering roles."
      align="center"
      className="bg-surface-subtle/40 border-y border-border/40"
    >
      {/* Visual Journey Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 my-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.title}
              variant="default"
              padding="sm"
              className="flex flex-col justify-between text-left relative group hover:border-primary/60 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-text-dim">0{idx + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-text mb-1">{step.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-border/40">
                <Badge variant="muted" size="sm">
                  {step.badge}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/onboarding">
          <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Start Fresher Assessment
          </Button>
        </Link>
      </div>
    </Section>
  );
};
