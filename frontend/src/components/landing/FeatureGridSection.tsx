import React from "react";
import {
  Compass,
  Sparkles,
  Layers,
  Milestone,
  FileText,
  Cpu,
  LayoutDashboard,
} from "lucide-react";
import { Section } from "../layout/Section";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { PRODUCT_FEATURES } from "../../constants/theme";

export const FeatureGridSection: React.FC = () => {
  const iconMap: Record<string, any> = {
    Compass,
    Sparkles,
    Layers,
    Milestone,
    FileText,
    Cpu,
    LayoutDashboard,
  };

  return (
    <Section
      id="features"
      badge="Core Platform Capabilities"
      subtitle="AI-Powered Suite"
      title="Engineered for Precision Career Growth"
      description="Explore the intelligence architecture being developed across the Career Engine platform ecosystem."
      align="center"
      className="bg-surface-subtle/30 border-t border-border/40"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCT_FEATURES.map((feature) => {
          const Icon = iconMap[feature.iconName] || Sparkles;

          return (
            <Card
              key={feature.id}
              variant="default"
              padding="lg"
              className="flex flex-col justify-between text-left group hover:border-primary/50 transition-all hover:shadow-subtle-glow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  {feature.badge && (
                    <Badge variant="primary" size="sm">
                      {feature.badge}
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-bold text-text mb-1 group-hover:text-primary-light transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs font-mono text-text-dim mb-3">
                  {feature.tagline}
                </p>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-[11px] font-mono text-text-dim uppercase tracking-wider">
                  Status
                </span>
                <span className="text-xs font-mono text-primary-light font-medium">
                  {feature.status || "Phase 2+"}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
};
