import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card } from "./Card";

export interface MetricProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Metric: React.FC<MetricProps> = ({
  label,
  value,
  change,
  trend = "neutral",
  subtext,
  icon,
  className,
}) => {
  return (
    <Card className={cn("p-4 sm:p-5 flex flex-col justify-between", className)}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </span>
        {icon && <div className="text-text-dim">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl sm:text-3xl font-mono font-bold text-text tracking-tight">
          {value}
        </div>
        {change && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-mono font-medium",
              trend === "up" && "text-accent-emerald",
              trend === "down" && "text-accent-rose",
              trend === "neutral" && "text-text-muted"
            )}
          >
            {trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
            {trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {trend === "neutral" && <Minus className="w-3 h-3 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      {subtext && <p className="text-xs text-text-dim mt-2">{subtext}</p>}
    </Card>
  );
};
