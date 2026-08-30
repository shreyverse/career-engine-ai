import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "emerald" | "amber" | "rose" | "muted" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "muted",
  size = "sm",
  children,
  ...props
}) => {
  const variantStyles = {
    primary: "bg-primary/10 text-primary-light border border-primary/20",
    secondary: "bg-secondary/10 text-secondary-light border border-secondary/20",
    emerald: "bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20",
    amber: "bg-accent-amber/10 text-accent-amber border border-accent-amber/20",
    rose: "bg-accent-rose/10 text-accent-rose border border-accent-rose/20",
    muted: "bg-surface-elevated text-text-muted border border-border",
    outline: "bg-transparent text-text-muted border border-border-bright",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium rounded-full",
    md: "px-2.5 py-1 text-xs font-semibold rounded-full",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono tracking-tight select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
