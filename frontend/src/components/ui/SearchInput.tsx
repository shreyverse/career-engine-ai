import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
  shortcutHint?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, shortcutHint = "⌘K", placeholder = "Search skills, roles, roadmaps...", disabled, ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div className="relative flex items-center w-full">
        <div className="absolute left-3 text-text-muted pointer-events-none flex items-center justify-center">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full h-10 pl-9 pr-14 bg-surface-elevated text-text placeholder:text-text-dim text-sm rounded-lg border border-border transition-all duration-200",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {hasValue && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-text-muted hover:text-text rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {shortcutHint && (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-text-dim bg-surface rounded border border-border">
              {shortcutHint}
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
