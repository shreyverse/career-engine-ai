import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { ToastMessage } from "../../types";
import { cn } from "../../lib/utils";

export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  const icons = {
    info: <Info className="w-4 h-4 text-primary-light" />,
    success: <CheckCircle2 className="w-4 h-4 text-accent-emerald" />,
    warning: <AlertTriangle className="w-4 h-4 text-accent-amber" />,
    error: <AlertCircle className="w-4 h-4 text-accent-rose" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const type = toast.type || "info";

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border bg-surface-elevated text-text shadow-elevated-card animate-in fade-in slide-in-from-bottom-2 duration-200 text-left border-border",
              type === "error" && "border-accent-rose/40",
              type === "success" && "border-accent-emerald/40",
              type === "warning" && "border-accent-amber/40"
            )}
          >
            <div className="mt-0.5">{icons[type]}</div>
            <div className="flex-1 min-w-0">
              {toast.title && <h6 className="text-xs font-semibold text-text">{toast.title}</h6>}
              <p className="text-xs text-text-muted leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-text-dim hover:text-text p-1 -mr-1 -mt-1 rounded"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
