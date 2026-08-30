import React from "react";
import { Container } from "./Container";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tag?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  align?: "left" | "center";
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  noContainer?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  tag,
  title,
  subtitle,
  description,
  badge,
  align = "left",
  containerSize = "lg",
  noContainer = false,
  className,
  children,
  ...props
}) => {
  const content = (
    <>
      {(badge || subtitle || title || description) && (
        <div
          className={cn(
            "mb-12 sm:mb-16 space-y-3",
            align === "center" ? "text-center max-w-3xl mx-auto" : "max-w-2xl"
          )}
        >
          {badge && <Badge variant="primary">{badge}</Badge>}
          {subtitle && (
            <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-primary-light font-semibold">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-text">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </>
  );

  return (
    <section className={cn("py-16 sm:py-24 relative overflow-hidden", className)} {...props}>
      {noContainer ? content : <Container size={containerSize}>{content}</Container>}
    </section>
  );
};
