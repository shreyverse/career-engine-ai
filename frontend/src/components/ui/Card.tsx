import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "gradientBorder" | "subtle";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-surface border border-border text-text shadow-sm",
      elevated: "bg-surface-elevated border border-border shadow-surface-card",
      interactive:
        "bg-surface hover:bg-surface-elevated border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-subtle-glow",
      gradientBorder:
        "bg-surface-elevated relative border border-border/80 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-primary/30 before:to-secondary/30 before:-z-10",
      subtle: "bg-surface-subtle border border-border-subtle text-text-muted",
    };

    const paddingStyles = {
      none: "p-0",
      sm: "p-3 sm:p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl overflow-hidden text-left relative",
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
