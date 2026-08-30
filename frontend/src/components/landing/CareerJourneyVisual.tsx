import React, { useState } from "react";
import { Compass, Sparkles, Route, Trophy, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

interface JourneyStage {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  icon: any;
  statusBadge: string;
  badgeVariant: "muted" | "primary" | "secondary" | "emerald";
  details: {
    label: string;
    items: string[];
    metric?: string;
  };
}

export const CareerJourneyVisual: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages: JourneyStage[] = [
    {
      id: "current",
      step: "01",
      title: "Current Position",
      subtitle: "Baseline assessment & profile data",
      icon: Compass,
      statusBadge: "Assessed",
      badgeVariant: "muted",
      details: {
        label: "Profile Signals",
        items: ["Junior Developer / Fresher", "React & JavaScript Basics", "Git Version Control"],
        metric: "14 Verified Skills",
      },
    },
    {
      id: "analysis",
      step: "02",
      title: "Skill Analysis",
      subtitle: "AI gap detection & matrix match",
      icon: Sparkles,
      statusBadge: "Deep Analysis",
      badgeVariant: "primary",
      details: {
        label: "Identified Levers",
        items: ["System Design & High Availability", "PostgreSQL & Prisma ORM", "Microservices & Docker"],
        metric: "72% Target Role Match",
      },
    },
    {
      id: "path",
      step: "03",
      title: "Personalized Path",
      subtitle: "Milestone-driven custom roadmap",
      icon: Route,
      statusBadge: "Sprint Generated",
      badgeVariant: "secondary",
      details: {
        label: "Sprint Curriculum",
        items: ["Phase 1: Advanced Backend Systems", "Phase 2: Fullstack Architecture", "Phase 3: Production Portfolio"],
        metric: "12-Week Roadmap",
      },
    },
    {
      id: "goal",
      step: "04",
      title: "Career Goal",
      subtitle: "Target role achieved & verified",
      icon: Trophy,
      statusBadge: "Outcome",
      badgeVariant: "emerald",
      details: {
        label: "Target Position",
        items: ["Senior Fullstack Engineer", "$140k+ Target Compensation", "High-Impact Product Team"],
        metric: "98% Placement Ready",
      },
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-8 p-6 sm:p-8 rounded-2xl bg-surface/90 border border-border shadow-elevated-card backdrop-blur-md">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border/80 gap-4 text-left">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted font-semibold">
              Live Career Trajectory Engine
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-text">
            From Current Position to Target Career Goal
          </h3>
        </div>
        <Badge variant="primary" size="md">
          Interactive Architecture Demo
        </Badge>
      </div>

      {/* Nodes Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isSelected = activeStage === index;
          const isPast = activeStage > index;

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(index)}
              className={cn(
                "p-4 rounded-xl border text-left transition-all duration-200 relative group flex flex-col justify-between",
                isSelected
                  ? "bg-surface-elevated border-primary shadow-subtle-glow"
                  : isPast
                  ? "bg-surface/50 border-border hover:border-border-bright"
                  : "bg-surface/30 border-border/50 opacity-80 hover:opacity-100"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-surface-elevated text-text-muted border border-border"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-text-dim">{stage.step}</span>
                </div>
                <h4 className="text-sm font-semibold text-text mb-1 group-hover:text-primary-light transition-colors">
                  {stage.title}
                </h4>
                <p className="text-xs text-text-muted leading-tight">{stage.subtitle}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                <Badge variant={stage.badgeVariant} size="sm">
                  {stage.statusBadge}
                </Badge>
                {isSelected && (
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep Dive Terminal View */}
      <div className="p-5 sm:p-6 rounded-xl bg-surface-elevated border border-border text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-border/60 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold">
              {stages[activeStage].step}
            </div>
            <div>
              <h5 className="text-sm font-semibold text-text">
                {stages[activeStage].title} Inspector
              </h5>
              <p className="text-xs text-text-muted">{stages[activeStage].subtitle}</p>
            </div>
          </div>
          {stages[activeStage].details.metric && (
            <div className="px-3 py-1 bg-surface rounded-lg border border-border font-mono text-xs font-semibold text-accent-emerald">
              {stages[activeStage].details.metric}
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-3">
            {stages[activeStage].details.label}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stages[activeStage].details.items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-surface/70 border border-border text-xs text-text font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
