import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { TermsOfServicePage } from '../pages/TermsOfServicePage';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { FresherAssessmentPage } from '../pages/FresherAssessmentPage';
import { ProfessionalAssessmentPage } from '../pages/ProfessionalAssessmentPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CareerPathPage } from '../pages/CareerPathPage';
import { SkillsPage } from '../pages/SkillsPage';
import { ResumeWorkspacePage } from '../pages/ResumeWorkspacePage';
import { ResumeUploadReviewPage } from '../pages/ResumeUploadReviewPage';
import { ResumeBuilderPage } from '../pages/ResumeBuilderPage';
import { ATSAnalyzerPage } from '../pages/ATSAnalyzerPage';
import { ProgressPage } from '../pages/ProgressPage';
import { CoachPage } from '../pages/CoachPage';
import { WeeklyPlanPage } from '../pages/WeeklyPlanPage';
import { JobDiscoveryPage } from '../pages/JobDiscoveryPage';
import { JobDetailPage } from '../pages/JobDetailPage';
import { SavedJobsPage } from '../pages/SavedJobsPage';
import { ApplicationTrackerPage } from '../pages/ApplicationTrackerPage';
import { SettingsPage } from '../pages/SettingsPage';
import { CareerAnalysisPage } from '../pages/CareerAnalysisPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';


export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/privacy' element={<PrivacyPolicyPage />} />
      <Route path='/terms' element={<TermsOfServicePage />} />

      {/* Onboarding & Guided Assessments (Allow Incomplete) */}
      <Route
        path='/onboarding'
        element={
          <ProtectedRoute allowIncomplete>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/onboarding/fresher'
        element={
          <ProtectedRoute allowIncomplete>
            <FresherAssessmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/onboarding/professional'
        element={
          <ProtectedRoute allowIncomplete>
            <ProfessionalAssessmentPage />
          </ProtectedRoute>
        }
      />

      {/* Authenticated Workspace Routes (Require Completed Onboarding) */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/career-analysis'
        element={
          <ProtectedRoute>
            <CareerAnalysisPage />
          </ProtectedRoute>
        }
      />

      <Route
        path='/career-path'
        element={
          <ProtectedRoute>
            <CareerPathPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/skills'
        element={
          <ProtectedRoute>
            <SkillsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/resume'
        element={
          <ProtectedRoute>
            <ResumeWorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/resume/upload'
        element={
          <ProtectedRoute>
            <ResumeUploadReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/resume/builder'
        element={
          <ProtectedRoute>
            <ResumeBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/resume/builder/:resumeId'
        element={
          <ProtectedRoute>
            <ResumeBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/resume/ats'
        element={
          <ProtectedRoute>
            <ATSAnalyzerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/progress'
        element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/coach'
        element={
          <ProtectedRoute>
            <CoachPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/weekly-plan'
        element={
          <ProtectedRoute>
            <WeeklyPlanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/jobs'
        element={
          <ProtectedRoute>
            <JobDiscoveryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/jobs/saved'
        element={
          <ProtectedRoute>
            <SavedJobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/jobs/:jobId'
        element={
          <ProtectedRoute>
            <JobDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/applications'
        element={
          <ProtectedRoute>
            <ApplicationTrackerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/settings'
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};
