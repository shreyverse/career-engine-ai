import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Brain,
  Route,
  Sparkles,
  Briefcase,
  GraduationCap,
  User,
  FileText,
  Target,
  CheckSquare,
  TrendingUp,
  Zap,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const sections = [
    {
      title: "MAIN",
      items: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Career Analysis", href: "/career-analysis", icon: Brain },
        { name: "Skill Gap Analysis", href: "/skills", icon: Sparkles },
        { name: "Career Roadmap", href: "/career-path", icon: Route },
        { name: "Job Matches", href: "/jobs", icon: Briefcase },
        { name: "Learning Path", href: "/coach", icon: GraduationCap },
      ],
    },
    {
      title: "CAREER",
      items: [
        { name: "My Profile", href: "/settings", icon: User },
        { name: "Resume", href: "/resume", icon: FileText },
        { name: "Career Goals", href: "/onboarding", icon: Target },
        { name: "Assessments", href: "/onboarding", icon: CheckSquare },
      ],
    },
    {
      title: "INSIGHTS",
      items: [
        { name: "Progress", href: "/progress", icon: TrendingUp },
        { name: "Recommendations", href: "/career-analysis", icon: Zap },
        { name: "Market Insights", href: "/jobs", icon: BarChart3 },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Help & Support", href: "#help", icon: HelpCircle },
      ],
    },
  ];

  const roleTitle = user?.careerStage === 'PROFESSIONAL' ? 'Professional' : 'Career Explorer';

  return (
    <aside className="w-[260px] min-w-[260px] max-w-[260px] shrink-0 flex-shrink-0 bg-[#07090D] border-r border-white/[0.08] h-screen flex flex-col justify-between text-left select-none z-30 overflow-hidden">
      
      {/* Fixed Brand Header */}
      <div className="p-6 pb-4 border-b border-white/[0.08] shrink-0 flex-shrink-0">
        <Link to="/" className="flex items-center gap-3.5 group" onClick={onClose}>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:border-blue-400/60 group-hover:shadow-[0_0_18px_rgba(59,130,246,0.35)] transition-all shrink-0">
            <Sparkles className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-extrabold text-[19px] tracking-tight text-white leading-tight group-hover:text-blue-200 transition-colors">
              Career Engine
            </span>
            <span className="text-[10.5px] font-mono tracking-wider text-blue-400 uppercase font-bold mt-0.5">
              CAREER INTELLIGENCE
            </span>
          </div>
        </Link>
      </div>

      {/* Internal Navigation Section */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 custom-scrollbar">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3.5 text-[11px] font-mono font-bold tracking-[0.14em] text-[#8D96AA]/80 uppercase mb-1.5">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[14px] transition-all duration-150 group min-h-[44px]",
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white border border-blue-500/35 font-semibold shadow-[0_0_16px_rgba(59,130,246,0.18)]"
                        : "text-[#8D96AA] hover:text-white hover:bg-white/[0.05] font-medium"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors shrink-0",
                        isActive ? "text-blue-400" : "text-[#8D96AA] group-hover:text-blue-300"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Anchored User Profile Footer */}
      <div className="p-3.5 border-t border-white/[0.08] bg-[#050608]/40 shrink-0 flex-shrink-0 mt-auto">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-md">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-[14px] font-bold text-white truncate">
                {user?.fullName || 'Shreyansh Srivastava'}
              </span>
              <span className="text-[11.5px] text-[#8D96AA] truncate font-medium">
                {roleTitle}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl text-[#8D96AA] hover:text-rose-400 hover:bg-white/[0.08] transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
