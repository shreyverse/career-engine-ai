import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  onClose,
  className,
}) => {
  const variantStyles = {
    info: "bg-primary/10 border-primary/30 text-text",
    success: "bg-accent-emerald/10 border-accent-emerald/30 text-text",
    warning: "bg-accent-amber/10 border-accent-amber/30 text-text",
    error: "bg-accent-rose/10 border-accent-rose/30 text-text",
  };

  const icons = {
    info: <Info className="w-5 h-5 text-primary-light flex-shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-accent-emerald flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-accent-amber flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-accent-rose flex-shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border text-sm text-left relative",
        variantStyles[variant],
        className
      )}
    >
      {icons[variant]}
      <div className="flex-1 space-y-0.5">
        {title && <h5 className="font-semibold text-text leading-tight">{title}</h5>}
        <div className="text-text-muted text-xs leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text p-1 -mr-1 -mt-1 rounded"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
