import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "/#features", isInternalRoute: false },
    { label: "How It Works", href: "/#how-it-works", isInternalRoute: false },
    { label: "Skill Analysis", href: isAuthenticated ? "/skills" : "/#skills", isInternalRoute: isAuthenticated },
    { label: "Roadmap", href: isAuthenticated ? "/career-path" : "/#roadmap", isInternalRoute: isAuthenticated },
    { label: "About", href: "/#about", isInternalRoute: false },
  ];

  return (
    <>
      <header
        className={cn(
          "w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#050608]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/80 py-3.5"
            : "bg-transparent py-6"
        )}
      >
        <div className="w-full px-6 sm:px-10 lg:px-16 flex items-center justify-between">
          
          {/* Left Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:border-blue-400/60 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] transition-all">
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-lg font-extrabold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                Career Engine
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full font-semibold">
                AI
              </span>
            </div>
          </Link>

          {/* Center Navigation Links Capsule */}
          <nav className="hidden md:flex items-center gap-8 bg-white/[0.03] border border-white/[0.08] px-7 py-2.5 rounded-full backdrop-blur-md shadow-inner">
            {navLinks.map((link) => {
              if (link.isInternalRoute) {
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-[13px] font-semibold text-[#8D96AA] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] font-semibold text-[#8D96AA] hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>{user.fullName.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-[#8D96AA] hover:text-rose-400 hover:bg-white/[0.04] transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-[13px] font-semibold text-[#8D96AA] hover:text-white transition-colors px-2 py-1"
                >
                  Login
                </Link>
                <Link
                  to="/onboarding"
                  className="px-6 py-2.5 rounded-full text-[13px] font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white md:hidden border border-white/[0.08] bg-white/[0.03]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050608]/95 backdrop-blur-2xl md:hidden pt-24 px-6 flex flex-col justify-between pb-8">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-white/[0.05]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="space-y-3 pt-6">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-center block text-sm shadow-lg shadow-blue-500/25"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-semibold text-center block text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-center block text-sm shadow-lg shadow-blue-500/30"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
