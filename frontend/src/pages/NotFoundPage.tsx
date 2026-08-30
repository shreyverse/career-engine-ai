import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft, HelpCircle } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col justify-center items-center p-4 relative subtle-radial-glow">
      <div className="absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none" />

      <Card variant="elevated" padding="lg" className="w-full max-w-md z-10 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border mx-auto flex items-center justify-center text-primary shadow-subtle-glow">
          <HelpCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider">
            404 Error
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            The requested career intelligence route or resource does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/">
            <Button
              variant="primary"
              className="w-full"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Return to Landing Page
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
