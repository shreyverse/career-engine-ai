import React from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight, Compass } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ label: string; href: string }>;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, links }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-surface-elevated border-l border-border p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-text">Career Engine</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col space-y-3">
            {links.map((link) => {
              const isAnchor = link.href.startsWith("#");
              return isAnchor ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="px-3 py-2 text-base font-medium text-text-muted hover:text-text hover:bg-surface rounded-lg transition-colors text-left"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={onClose}
                  className="px-3 py-2 text-base font-medium text-text-muted hover:text-text hover:bg-surface rounded-lg transition-colors text-left"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-border">
          <Link to="/login" onClick={onClose} className="block w-full">
            <Button variant="secondary" className="w-full">
              Sign In
            </Button>
          </Link>
          <Link to="/onboarding" onClick={onClose} className="block w-full">
            <Button
              variant="primary"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Build My Career Path
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
