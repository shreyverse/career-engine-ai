import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService, User } from "../services/authService";
import { assessmentApi } from "../services/assessmentApi";
import { CareerStage } from "../types";

export interface AuthContextType {
  user: User | null;
  profile: any | null;
  assessment: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; careerStage?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setCareerType: (careerType: CareerStage) => Promise<{ nextRoute: string }>;
  resetOnboarding: (newCareerType?: CareerStage) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TOKEN_STORAGE_KEY = "career_engine_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [assessment, setAssessment] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const activeToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!activeToken) {
      setUser(null);
      setProfile(null);
      setAssessment(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      setUser(data.user);
      setProfile(data.profile);
      setAssessment(data.assessment);
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
      setProfile(null);
      setAssessment(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; fullName: string; careerStage?: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const setCareerType = async (careerType: CareerStage) => {
    const res = await assessmentApi.setCareerType(careerType);
    await refreshUser();
    return { nextRoute: res.nextRoute };
  };

  const resetOnboarding = async (newCareerType?: CareerStage) => {
    await assessmentApi.resetOnboarding(newCareerType);
    await refreshUser();
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setProfile(null);
    setAssessment(null);
  };

  const value: AuthContextType = {
    user,
    profile,
    assessment,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    setCareerType,
    resetOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
