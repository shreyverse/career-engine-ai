import React from "react";
import { UserCheck, Target, Layers, BookOpen, TrendingUp, ArrowRight } from "lucide-react";
import { Section } from "../layout/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";

export const ProfessionalJourneySection: React.FC = () => {
  const steps = [
    {
      title: "Current Role",
      icon: UserCheck,
      desc: "Audit your current seniority, core technologies, and day-to-day responsibilities.",
      badge: "Baseline",
    },
    {
      title: "Career Goal",
      icon: Target,
      desc: "Define target elevation: Senior, Lead, Architect, or domain pivot to AI/DevOps.",
      badge: "Vision",
    },
    {
      title: "Skill Gap",
      icon: Layers,
      desc: "Pinpoint architecture, leadership, and system scale deficiencies holding you back.",
      badge: "Diagnostic",
    },
    {
      title: "Learning Plan",
      icon: BookOpen,
      desc: "Follow an optimized curriculum with targeted projects to master missing competencies.",
      badge: "Execution",
    },
    {
      title: "Growth",
      icon: TrendingUp,
      desc: "Achieve promotion, lateral elevation, or high-leverage compensation jumps.",
      badge: "Advancement",
    },
  ];

  return (
    <Section
      id="professionals"
      badge="For Working Professionals"
      subtitle="Career Acceleration"
      title="Ready for your next move?"
      description="Whether you're targeting Senior IC status, engineering management, or transitioning into specialized AI/Cloud domains, Career Engine maps the exact trajectory."
      align="center"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 my-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.title}
              variant="default"
              padding="md"
              className="flex flex-col justify-between text-left relative group hover:border-secondary/60 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-text-dim">0{idx + 1}</span>
                </div>
                <h4 className="text-base font-bold text-text mb-2">{step.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-border/40">
                <Badge variant="secondary" size="sm">
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
            Start Professional Assessment
          </Button>
        </Link>
      </div>
    </Section>
  );
};
