import React from "react";
import { UserCheck, Compass, Target, Route, TrendingUp } from "lucide-react";
import { Section } from "../layout/Section";
import { Card } from "../ui/Card";
import { HOW_IT_WORKS_STEPS } from "../../constants/theme";

export const HowItWorksSection: React.FC = () => {
  const iconMap: Record<string, any> = {
    UserCheck,
    Compass,
    Target,
    Route,
    TrendingUp,
  };

  return (
    <Section
      id="how-it-works"
      badge="Workflow"
      subtitle="Structured Intelligence"
      title="How Career Engine Works"
      description="A five-step systematic framework engineered to turn ambiguity into concrete career progression."
      align="center"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
        {HOW_IT_WORKS_STEPS.map((step) => {
          const Icon = iconMap[step.iconName] || Compass;

          return (
            <Card
              key={step.number}
              variant="default"
              padding="md"
              className="flex flex-col justify-between relative group hover:border-primary/50 transition-all text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center font-mono text-xs font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {step.number.toString().padStart(2, "0")}
                  </span>
                  <div className="text-text-dim group-hover:text-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-semibold text-text mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-text-dim">
                <span>Step {step.number} of 5</span>
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
};
