import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface Step {
  number: number;
  title: string;
}

export interface AssessmentProgressProps {
  steps: Step[];
  currentStep: number;
}

export const AssessmentProgress: React.FC<AssessmentProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4 mb-6">
      <div className="flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-border w-full -z-0" />
        
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center group">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 border-2",
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isCurrent
                    ? "bg-surface-elevated border-primary text-primary shadow-subtle-glow"
                    : "bg-surface border-border text-text-dim"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium mt-1.5 hidden sm:block whitespace-nowrap transition-colors",
                  isCurrent ? "text-primary-light font-semibold" : isCompleted ? "text-text" : "text-text-dim"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
