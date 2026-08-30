import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  className,
}) => {
  return (
    <div className={cn("space-y-2 text-left", className)}>
      {label && (
        <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border border-border bg-surface-elevated/50 hover:bg-surface-elevated cursor-pointer transition-all",
                isSelected && "border-primary bg-primary/5",
                option.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="radio"
                  id={id}
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  disabled={option.disabled}
                  onChange={() => onChange && onChange(option.value)}
                  className="sr-only peer"
                />
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border border-border bg-surface transition-all",
                    isSelected && "border-primary",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-primary"
                  )}
                />
                {isSelected && (
                  <div className="absolute w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-medium text-text block leading-tight">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-text-muted block">
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-accent-rose font-medium">{error}</p>}
    </div>
  );
};
