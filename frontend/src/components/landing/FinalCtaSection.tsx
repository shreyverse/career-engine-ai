import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden subtle-radial-glow border-t border-border/80">
      {/* Background decoration */}
      <div className="absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none" />

      <Container>
        <div className="max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-surface-elevated/80 border border-border shadow-elevated-card backdrop-blur-md text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Free Assessment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-text tracking-tight">
            Your next career move starts here.
          </h2>

          <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
            Turn uncertainty into a clear, actionable career path. Get personalized insights into your skills and target trajectory.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Build My Career Path
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In to Account
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
