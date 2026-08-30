import React from "react";
import { cn } from "../../lib/utils";

export interface StatusIndicatorProps {
  status?: "online" | "idle" | "busy" | "offline";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = "online",
  size = "md",
  label,
  className,
}) => {
  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-3.5 h-3.5",
  };

  const statusColors = {
    online: "bg-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.6)]",
    idle: "bg-accent-amber shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    busy: "bg-accent-rose shadow-[0_0_8px_rgba(244,63,94,0.6)]",
    offline: "bg-slate-500",
  };

  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      <span className={cn("rounded-full flex-shrink-0 animate-pulse-subtle", dotSizes[size], statusColors[status])} />
      {label && <span className="text-xs text-text-muted font-medium">{label}</span>}
    </div>
  );
};
