import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { Checkbox } from '../components/ui/Checkbox';
import { useAuth } from '../hooks/useAuth';
import {
  RotateCcw,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, resetOnboarding } = useAuth();

  const [name, setName] = useState(user?.fullName || 'Alex Rivera');
  const [targetRole, setTargetRole] = useState(profile?.targetRole || 'Senior Fullstack Engineer');
  const [workType, setWorkType] = useState(profile?.preferredWorkType || 'Remote');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Confirmation Modal state
  const [showConfirmModal, setShowConfirmModal] = useState<false | 'RETAKE' | 'CHANGE_STAGE'>(false);
  const [targetNewStage, setTargetNewStage] = useState<'FRESHER' | 'PROFESSIONAL'>('FRESHER');
  const [isProcessing, setIsProcessing] = useState(false);

  const isFresher = (user?.careerType || user?.careerStage) === 'FRESHER';
  const hasCompleted = user?.hasCompletedOnboarding;

  const handleRetakeAssessment = async () => {
    setIsProcessing(true);
    try {
      await resetOnboarding();
      setShowConfirmModal(false);
      navigate(isFresher ? '/onboarding/fresher' : '/onboarding/professional');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangeCareerStage = async () => {
    setIsProcessing(true);
    try {
      await resetOnboarding(targetNewStage);
      setShowConfirmModal(false);
      navigate(targetNewStage === 'FRESHER' ? '/onboarding/fresher' : '/onboarding/professional');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppLayout
      title='Settings & Profile Management'
      subtitle='Manage your career profile, assessment status, and personalization preferences.'
      breadcrumbItems={[{ label: 'Workspace', href: '/dashboard' }, { label: 'Settings' }]}
    >
      {savedSuccess && (
        <Alert variant='success' onClose={() => setSavedSuccess(false)}>
          Preferences saved successfully.
        </Alert>
      )}

      <div className="w-full space-y-8 text-left">
        {/* Section: Career Intelligence Profile */}
        <Card variant='elevated' padding='lg' className='space-y-6'>
          <div className='flex items-center justify-between pb-3 border-b border-border'>
            <div>
              <h3 className='text-base font-bold text-text'>Career Profile</h3>
              <p className='text-xs text-text-muted'>Active trajectory and assessment baseline status.</p>
            </div>
            <Badge variant={hasCompleted ? 'emerald' : 'amber'}>
              {hasCompleted ? 'Assessment Completed' : 'In Progress'}
            </Badge>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-surface border border-border'>
            <div>
              <span className='text-[11px] font-mono uppercase tracking-wider text-text-dim block mb-1'>
                Career Stage
              </span>
              <div className='flex items-center gap-2'>
                <Badge variant={isFresher ? 'primary' : 'secondary'} size='md'>
                  {isFresher ? 'Fresher / Early Career' : 'Working Professional'}
                </Badge>
              </div>
            </div>

            <div>
              <span className='text-[11px] font-mono uppercase tracking-wider text-text-dim block mb-1'>
                Target Role
              </span>
              <span className='text-sm font-semibold text-text'>
                {targetRole || 'Not Specified'}
              </span>
            </div>

            <div>
              <span className='text-[11px] font-mono uppercase tracking-wider text-text-dim block mb-1'>
                Onboarding State
              </span>
              <span className='text-xs font-mono text-text'>
                {hasCompleted ? 'Step 6 of 6 (Verified)' : `Step ${user?.onboardingStep || 1} of 6`}
              </span>
            </div>
          </div>

          {/* Action Buttons for Retake & Switch Stage */}
          <div className='flex flex-wrap items-center gap-3 pt-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setShowConfirmModal('RETAKE')}
              leftIcon={<RotateCcw className='w-3.5 h-3.5' />}
            >
              Retake Assessment
            </Button>

            <Button
              type='button'
              variant='secondary'
              size='sm'
              onClick={() => {
                setTargetNewStage(isFresher ? 'PROFESSIONAL' : 'FRESHER');
                setShowConfirmModal('CHANGE_STAGE');
              }}
              leftIcon={<RefreshCw className='w-3.5 h-3.5' />}
            >
              Change Career Stage ({isFresher ? 'Switch to Professional' : 'Switch to Fresher'})
            </Button>
          </div>
        </Card>

        {/* Section: Account & Profile Info */}
        <Card variant='elevated' padding='lg' className='space-y-6'>
          <div className='flex items-center justify-between pb-3 border-b border-border'>
            <h3 className='text-base font-bold text-text'>Profile Information</h3>
            <span className='text-xs text-text-dim font-mono'>{user?.email}</span>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Input
              label='Full Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label='Target Role Title'
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          <Select
            label='Preferred Work Arrangement'
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            options={[
              { value: 'Remote', label: 'Fully Remote' },
              { value: 'Hybrid', label: 'Hybrid (1-3 days onsite)' },
              { value: 'Onsite', label: 'Onsite Office' },
            ]}
          />

          <div className='pt-2 border-t border-border space-y-3'>
            <h4 className='text-xs font-mono uppercase tracking-wider text-text-muted font-semibold'>
              Digests & Insights
            </h4>
            <Checkbox
              id='weekly-velocity'
              label='Weekly Career Velocity Summary'
              description='Receive curated progress reports on your target roadmap milestones.'
              defaultChecked
            />
            <Checkbox
              id='market-shifts'
              label='Market Skill Shifts & Alerts'
              description='Get notified when hiring requirements for your target role evolve.'
              defaultChecked
            />
          </div>

          <div className='pt-4 flex justify-end'>
            <Button
              variant='primary'
              size='md'
              onClick={() => {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 3000);
              }}
            >
              Save Preferences
            </Button>
          </div>
        </Card>
      </div>

      {/* Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200'>
          <Card variant='elevated' padding='lg' className='w-full max-w-md space-y-5 border-border shadow-2xl'>
            <div className='flex items-center gap-3 text-accent-amber'>
              <AlertTriangle className='w-6 h-6 flex-shrink-0' />
              <h4 className='text-lg font-bold text-text'>
                {showConfirmModal === 'RETAKE' ? 'Retake Career Assessment?' : 'Change Career Stage?'}
              </h4>
            </div>

            <p className='text-xs text-text-muted leading-relaxed'>
              {showConfirmModal === 'RETAKE'
                ? 'Retaking your assessment will start a fresh guided intake. Your previous assessment will be safely updated once you submit the new answers.'
                : `Changing your career stage to ${targetNewStage === 'FRESHER' ? 'Fresher' : 'Professional'} will start the corresponding assessment track. Your previous assessment will be preserved unless you choose to replace it.`}
            </p>

            <div className='flex items-center justify-end gap-3 pt-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowConfirmModal(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant='primary'
                size='sm'
                isLoading={isProcessing}
                onClick={showConfirmModal === 'RETAKE' ? handleRetakeAssessment : handleChangeCareerStage}
              >
                Proceed & Start Assessment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  );
};
