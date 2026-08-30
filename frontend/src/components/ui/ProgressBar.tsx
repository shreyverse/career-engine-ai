import React from "react";
import { cn } from "../../lib/utils";

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: "primary" | "secondary" | "emerald" | "amber";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  variant = "primary",
  size = "md",
  className,
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const heightStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const fillStyles = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    emerald: "bg-accent-emerald",
    amber: "bg-accent-amber",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="font-medium text-text-muted">{label}</span>}
          {showValue && <span className="font-mono text-text font-semibold">{percentage}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-surface-elevated rounded-full overflow-hidden border border-border/50", heightStyles[size])}>
        <div
          className={cn("h-full transition-all duration-500 rounded-full", fillStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
