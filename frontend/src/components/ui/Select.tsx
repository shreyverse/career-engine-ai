import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-text-muted uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              "w-full h-10 pl-3.5 pr-10 bg-surface-elevated text-text text-sm rounded-lg border border-border appearance-none cursor-pointer transition-all duration-200",
              "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-accent-rose focus:border-accent-rose focus:ring-accent-rose",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-text-dim bg-surface-elevated">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-surface-elevated text-text"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 text-text-muted pointer-events-none flex items-center justify-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-accent-rose font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-dim">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
