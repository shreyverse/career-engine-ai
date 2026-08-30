import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../ui/Spinner";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowIncomplete?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowIncomplete = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <p className="text-xs font-mono text-text-muted">Authenticating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user has not completed onboarding and trying to access main app pages
  if (!allowIncomplete && !user?.hasCompletedOnboarding) {
    // If they already chose careerType, direct them to that flow
    if (user?.careerType === "FRESHER") {
      return <Navigate to="/onboarding/fresher" replace />;
    }
    if (user?.careerType === "PROFESSIONAL") {
      return <Navigate to="/onboarding/professional" replace />;
    }
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
