import React from "react";
import { cn } from "../../lib/utils";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "none" | "sm" | "md" | "lg" | "xl";
}

export const Grid: React.FC<GridProps> = ({
  cols = 3,
  gap = "md",
  className,
  children,
  ...props
}) => {
  const colStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-12",
  };

  const gapStyles = {
    none: "gap-0",
    sm: "gap-3 sm:gap-4",
    md: "gap-6",
    lg: "gap-6 sm:gap-8",
    xl: "gap-8 sm:gap-10",
  };

  return (
    <div
      className={cn("grid", colStyles[cols], gapStyles[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
};
