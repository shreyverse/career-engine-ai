import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, CheckCircle2, AlertCircle } from "lucide-react";
import { Container } from "./Container";
import { StatusIndicator } from "../ui/StatusIndicator";
import { apiService } from "../../services/api";

export const Footer: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    let isMounted = true;
    apiService
      .getHealth()
      .then((res) => {
        if (isMounted) {
          setApiStatus(res.status === "ok" ? "online" : "offline");
        }
      })
      .catch(() => {
        if (isMounted) {
          setApiStatus("offline");
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const footerNav = [
    {
      title: "Product",
      links: [
        { label: "Career Assessment", href: "#features" },
        { label: "AI Analysis", href: "#features" },
        { label: "Skill Gap Matrix", href: "#features" },
        { label: "Personalized Roadmap", href: "#features" },
        { label: "Career Dashboard", href: "/dashboard" },
      ],
    },
    {
      title: "Navigation",
      links: [
        { label: "For Freshers", href: "#freshers" },
        { label: "For Professionals", href: "#professionals" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Onboarding Flow", href: "/onboarding" },
        { label: "Resume Hub", href: "/resume" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/settings" },
        { label: "Contact", href: "/settings" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface-subtle/80 pt-16 pb-12 text-left">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-border/60">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-primary">
                <Compass className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display text-lg font-bold text-text">Career Engine</span>
            </Link>
            <p className="text-xs text-text-muted max-w-sm leading-relaxed">
              AI-powered Career Intelligence Platform. Designed to analyze where you are, where you want to go, and what skills you need to get there.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <StatusIndicator
                status={apiStatus === "online" ? "online" : apiStatus === "checking" ? "idle" : "busy"}
                size="sm"
                label={
                  apiStatus === "online"
                    ? "API Systems Operational"
                    : apiStatus === "checking"
                    ? "Checking API Health..."
                    : "API Standby / Offline"
                }
              />
            </div>
          </div>

          {/* Nav Cols */}
          {footerNav.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-text font-semibold">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => {
                  const isAnchor = link.href.startsWith("#");
                  return (
                    <li key={link.label}>
                      {isAnchor ? (
                        <a
                          href={link.href}
                          className="text-xs text-text-muted hover:text-text transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-xs text-text-muted hover:text-text transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-dim">
          <p>© {new Date().getFullYear()} Career Engine. Phase 1 Architecture Foundation.</p>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Obsidian & Indigo UI</span>
            <span>•</span>
            <span>REST API v1.0</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
