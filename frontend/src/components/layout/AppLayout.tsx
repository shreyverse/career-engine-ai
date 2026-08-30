import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

export interface AppLayoutProps {
  title?: string;
  subtitle?: string;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  maxWidth?: "default" | "wide" | "full";
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  title,
  subtitle,
  actions,
  children,
  contentClassName,
  maxWidth = "default",
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Explorer';

  const widthStyles = {
    default: "max-w-[1400px]",
    wide: "max-w-[1550px]",
    full: "max-w-full",
  };

  return (
    <div className="flex h-screen w-full bg-[#050608] text-white overflow-hidden select-none">
      
      {/* Desktop Persistent Fixed Sidebar (260px, never moves) */}
      <div className="hidden lg:block w-[260px] min-w-[260px] max-w-[260px] shrink-0 flex-shrink-0 h-screen overflow-hidden z-30">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-[280px] max-w-[85vw] z-10 h-full">
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Shell (Occupies available workspace = 100vw - 260px) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-screen overflow-hidden">
        
        {/* Fixed Top Navbar */}
        <header className="h-[68px] min-h-[68px] shrink-0 flex-shrink-0 border-b border-white/[0.08] bg-[#07090D]/90 backdrop-blur-xl px-6 sm:px-10 flex items-center justify-between z-20">
          
          {/* Left: Search Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl text-[#8D96AA] hover:text-white border border-white/[0.08] bg-white/[0.03]"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full">
              <Search className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D96AA]" />
              <input
                type="text"
                placeholder="Search skills, roadmaps, jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 bg-white/[0.03] border border-white/[0.08] rounded-full text-sm text-white placeholder-[#8D96AA] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Right: Notifications + User Account Chip */}
          <div className="flex items-center gap-3.5">
            <button
              className="relative w-11 h-11 rounded-full text-[#8D96AA] hover:text-white bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all flex items-center justify-center"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#07090D]" />
            </button>

            <Link
              to="/settings"
              className="flex items-center gap-3 h-11 px-4 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.06] transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-[14px] font-semibold text-white hidden sm:inline">
                {firstName}
              </span>
              <ChevronDown className="w-4 h-4 text-[#8D96AA] hidden sm:inline" />
            </Link>
          </div>
        </header>

        {/* Dedicated Scrollable Dashboard Content Area (Perfect Horizontal Centering) */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 sm:p-10 custom-scrollbar select-text">
          <div className={cn("w-full mx-auto space-y-8 pb-12", widthStyles[maxWidth], contentClassName)}>
            {(title || subtitle || actions) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06] text-left">
                <div className="space-y-1">
                  {title && <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{title}</h1>}
                  {subtitle && <p className="text-xs sm:text-sm text-[#8D96AA]">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
              </div>
            )}
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};
