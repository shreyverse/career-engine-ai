import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Spinner } from '../components/ui/Spinner';
import { roadmapApi } from '../services/roadmapApi';
import {
  FullRoadmapResponse,
  ItemStatus,
} from '../types/roadmap.types';
import {
  Route,
  Sparkles,
  Target,
  CheckCircle2,
  Clock,
  Zap,
  RefreshCw,
  FolderGit2,
  Layers,
  CheckSquare,
  Square,
} from 'lucide-react';

export const CareerPathPage: React.FC = () => {
  const [roadmapRes, setRoadmapRes] = useState<FullRoadmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    roadmapApi
      .getRoadmap()
      .then((res) => {
        if (!isMounted) return;
        setRoadmapRes(res);
        if (res && res.progress && res.progress.currentPhase) {
          const curNum = res.progress.currentPhase.phaseNumber;
          const curIdx = res.roadmap.phases.findIndex((p) => p.phaseNumber === curNum);
          if (curIdx >= 0) setActivePhaseIndex(curIdx);
        }
      })
      .catch((err) => {
        console.error('Failed to load roadmap:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerateRoadmap = async (isRegenerate = false) => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = isRegenerate
        ? await roadmapApi.regenerateRoadmap()
        : await roadmapApi.generateRoadmap();
      setRoadmapRes(res);
      setFeedbackMessage(
        isRegenerate
          ? 'Roadmap successfully regenerated with updated version ' + res.metadata.version + '.'
          : 'Your personalized career roadmap has been synthesized.'
      );
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to generate roadmap. Please check your career analysis.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    if (!roadmapRes) return;
    setUpdatingTaskId(taskId);

    try {
      const res = await roadmapApi.updateTask(taskId, !currentCompleted);
      setRoadmapRes(res);
      setFeedbackMessage(!currentCompleted ? 'Task marked as completed! 🎯' : 'Task reopened.');
      setTimeout(() => setFeedbackMessage(null), 2500);
    } catch (err: any) {
      console.error('Failed to toggle task:', err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleProjectStatusChange = async (projectId: string, newStatus: ItemStatus) => {
    if (!roadmapRes) return;
    try {
      const res = await roadmapApi.updateProject(projectId, newStatus);
      setRoadmapRes(res);
      setFeedbackMessage('Project status updated to ' + newStatus.replace('_', ' ') + '.');
      setTimeout(() => setFeedbackMessage(null), 2500);
    } catch (err: any) {
      console.error('Failed to update project status:', err);
    }
  };

  if (isLoading) {
    return (
      <AppLayout title='Personalized Career Roadmap' subtitle='Loading your learning path...'>
        <div className='min-h-[400px] flex flex-col items-center justify-center space-y-4'>
          <Spinner size='lg' />
          <p className='text-xs font-mono text-text-muted'>Calculating roadmap velocity and deliverables...</p>
        </div>
      </AppLayout>
    );
  }

  if (isGenerating) {
    return (
      <AppLayout title='Personalized Career Roadmap' subtitle='Synthesizing roadmap with Gemini AI...'>
        <div className='max-w-xl mx-auto py-16 text-center space-y-6 animate-in fade-in'>
          <div className='w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto text-primary shadow-subtle-glow animate-pulse'>
            <Route className='w-10 h-10 text-primary' />
          </div>
          <div className='space-y-2'>
            <Badge variant='primary' size='md'>Gemini Roadmap Engine</Badge>
            <h2 className='text-2xl font-display font-bold text-text'>Synthesizing Your Career Path...</h2>
            <p className='text-xs text-text-muted max-w-sm mx-auto'>
              Organizing prerequisites, practical tasks, milestone projects, and interview preparation rounds.
            </p>
          </div>
          <ProgressBar value={75} variant='primary' size='md' />
        </div>
      </AppLayout>
    );
  }

  if (!roadmapRes || !roadmapRes.roadmap) {
    return (
      <AppLayout title='Personalized Career Roadmap' subtitle='Prerequisite-aware development journey.'>
        <div className='max-w-xl mx-auto py-16 text-center space-y-6'>
          <div className='w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mx-auto text-primary'>
            <Route className='w-8 h-8 text-primary' />
          </div>
          <div className='space-y-2'>
            <h2 className='text-2xl font-display font-bold text-text'>Your career path is ready to build.</h2>
            <p className='text-sm text-text-muted max-w-md mx-auto'>
              Generate an ordered, step-by-step roadmap grounded in your verified skills and target role expectations.
            </p>
          </div>
          {error && <Alert variant='error'>{error}</Alert>}
          <Button
            variant='primary'
            size='lg'
            onClick={() => handleGenerateRoadmap(false)}
            leftIcon={<Sparkles className='w-4 h-4' />}
          >
            Build My Career Roadmap
          </Button>
        </div>
      </AppLayout>
    );
  }

  const { roadmap, progress, nextMove, isStale } = roadmapRes;
  const currentPhase = roadmap.phases[activePhaseIndex] || roadmap.phases[0];

  return (
    <AppLayout
      title='Personalized Career Roadmap'
      subtitle={'Prerequisite-aware milestones and practical deliverables targeting ' + roadmap.targetRole + '.'}
      breadcrumbItems={[{ label: 'Workspace', href: '/dashboard' }, { label: 'Career Path' }]}
      actions={
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleGenerateRoadmap(true)}
          leftIcon={<RefreshCw className='w-3.5 h-3.5' />}
        >
          Regenerate Roadmap
        </Button>
      }
    >
      <div className="w-full space-y-8 text-left">
        {feedbackMessage && <Alert variant='success'>{feedbackMessage}</Alert>}
        {error && <Alert variant='error'>{error}</Alert>}

        {/* Stale Analysis Alert */}
        {isStale && (
          <Alert variant='warning' title='Career Analysis Updated'>
            <div className='flex items-center justify-between gap-4'>
              <span>Your career profile has changed since this roadmap was generated.</span>
              <Button variant='secondary' size='sm' onClick={() => handleGenerateRoadmap(true)}>
                Sync & Regenerate
              </Button>
            </div>
          </Alert>
        )}

        {/* 1. HEADER OVERVIEW & OVERALL PROGRESS */}
        <Card variant='elevated' padding='lg' className='relative overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-center'>
            <div className='lg:col-span-2 space-y-2'>
              <div className='flex items-center gap-2'>
                <Badge variant='primary' size='md'>{roadmap.currentLevel} LEVEL</Badge>
                <span className='text-xs font-mono text-text-dim'>Target Trajectory:</span>
                <Badge variant='secondary' size='md'>{roadmap.targetRole}</Badge>
                <span className='text-xs font-mono text-text-dim ml-2 flex items-center gap-1'>
                  <Clock className='w-3.5 h-3.5' /> {roadmap.estimatedDuration}
                </span>
              </div>
              <h2 className='text-2xl sm:text-3xl font-display font-extrabold text-text'>
                Roadmap Execution Tracker
              </h2>
              <p className='text-xs sm:text-sm text-text-muted leading-relaxed max-w-xl'>
                Ordered sequence of technical milestones. Complete action items and milestone projects to advance your readiness score and update your dashboard velocity.
              </p>
            </div>

            <div className='p-4 rounded-2xl bg-surface border border-border flex items-center gap-4'>
              <ProgressRing
                value={progress.overallProgress}
                size={88}
                strokeWidth={7}
                label='Completion'
                colorClass='text-primary'
              />
              <div className='space-y-1 text-xs font-mono'>
                <div className='text-text font-bold text-sm'>{progress.overallProgress}% Complete</div>
                <div className='text-text-muted'>
                  {progress.completedTasksCount} of {progress.totalTasksCount} tasks done
                </div>
                <div className='text-text-dim'>
                  {progress.completedProjectsCount} of {progress.totalProjectsCount} projects finished
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. YOUR NEXT MOVE ENGINE SPOTLIGHT */}
        {nextMove && (
          <Card variant='elevated' padding='lg' className='border-l-4 border-l-accent-amber space-y-3 bg-accent-amber/[0.02]'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-7 h-7 rounded-lg bg-accent-amber/10 text-accent-amber flex items-center justify-center font-bold'>
                  <Zap className='w-4 h-4' />
                </div>
                <div>
                  <span className='text-xs font-mono font-bold text-accent-amber uppercase tracking-wider block'>
                    Your Next Move
                  </span>
                  <h3 className='text-sm font-bold text-text'>{nextMove.title}</h3>
                </div>
              </div>
              <Badge variant='amber' size='sm'>Highest ROI</Badge>
            </div>
            <p className='text-xs text-text-muted leading-relaxed pl-9'>
              {nextMove.description}
            </p>
            <div className='pl-9 flex flex-wrap items-center justify-between gap-3 pt-1'>
              <div className='flex items-center gap-2 text-[11px] font-mono text-text-dim'>
                <span>Phase: <strong>{nextMove.phaseTitle}</strong></span>
                <span>•</span>
                <span>Estimated: <strong>{nextMove.estimatedTime}</strong></span>
              </div>
              <Button
                variant='primary'
                size='sm'
                onClick={() => handleToggleTask(nextMove.taskId, false)}
                leftIcon={<CheckCircle2 className='w-3.5 h-3.5' />}
              >
                Mark Step Complete
              </Button>
            </div>
          </Card>
        )}

        {/* 3. PHASE SELECTOR TABS */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
          {roadmap.phases.map((phase, pIdx) => {
            const isSelected = activePhaseIndex === pIdx;
            const isPhaseDone = (phase.progress || 0) === 100;

            return (
              <button
                key={phase.id}
                onClick={() => setActivePhaseIndex(pIdx)}
                className={'p-3.5 rounded-xl border text-left transition-all space-y-2 ' + (
                  isSelected
                    ? 'bg-surface-elevated border-primary shadow-subtle-glow'
                    : 'bg-surface border-border hover:border-border/80 hover:bg-surface-elevated/40'
                )}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-[10px] font-mono uppercase text-text-dim'>
                    Phase {phase.phaseNumber}
                  </span>
                  {isPhaseDone ? (
                    <Badge variant='emerald' size='sm'>Done</Badge>
                  ) : (
                    <span className='text-[10px] font-mono text-primary font-bold'>
                      {phase.progress || 0}%
                    </span>
                  )}
                </div>
                <h4 className='text-xs font-bold text-text line-clamp-1'>{phase.title}</h4>
                <ProgressBar value={phase.progress || 0} variant={isPhaseDone ? 'emerald' : 'primary'} size='sm' />
              </button>
            );
          })}
        </div>

        {/* 4. ACTIVE PHASE DETAIL CARD */}
        <Card variant='elevated' padding='lg' className='space-y-6'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <Badge variant='primary' size='sm'>Phase {currentPhase.phaseNumber}</Badge>
                <Badge variant='secondary' size='sm'>{currentPhase.phaseType}</Badge>
                <span className='text-xs font-mono text-text-dim flex items-center gap-1'>
                  <Clock className='w-3 h-3' /> {currentPhase.estimatedDuration}
                </span>
              </div>
              <h3 className='text-xl font-bold text-text'>{currentPhase.title}</h3>
              <p className='text-xs text-text-muted leading-relaxed max-w-2xl'>
                {currentPhase.description}
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <div className='text-right'>
                <span className='text-xs font-mono text-text-dim block'>Phase Progress</span>
                <span className='text-base font-bold font-mono text-text'>{currentPhase.progress || 0}%</span>
              </div>
            </div>
          </div>

          {/* Objectives & Skills */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-4 rounded-xl bg-surface border border-border space-y-2'>
              <h4 className='text-xs font-mono uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1.5'>
                <Target className='w-3.5 h-3.5 text-primary' /> Core Objectives
              </h4>
              <ul className='space-y-1.5 pt-1'>
                {currentPhase.objectives.map((obj, oIdx) => (
                  <li key={oIdx} className='text-xs text-text flex items-start gap-2'>
                    <span className='w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0' />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='p-4 rounded-xl bg-surface border border-border space-y-2'>
              <h4 className='text-xs font-mono uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1.5'>
                <Layers className='w-3.5 h-3.5 text-secondary' /> Skills Targeted
              </h4>
              <div className='space-y-2 pt-1'>
                {currentPhase.skills.map((sk, sIdx) => (
                  <div key={sIdx} className='text-xs'>
                    <strong className='text-text'>{sk.name}:</strong>{' '}
                    <span className='text-text-muted'>{sk.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Checklist */}
          <div className='space-y-3 pt-2'>
            <div className='flex items-center justify-between'>
              <h4 className='text-xs font-mono uppercase tracking-wider text-text-muted font-semibold'>
                Actionable Deliverables & Tasks
              </h4>
              <span className='text-xs font-mono text-text-dim'>
                {currentPhase.tasks.filter((t) => t.completed).length} of {currentPhase.tasks.length} complete
              </span>
            </div>

            <div className='space-y-2.5'>
              {currentPhase.tasks.map((task) => {
                const isUpdating = updatingTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    className={'p-3.5 rounded-xl border transition-all flex items-start gap-3 ' + (
                      task.completed
                        ? 'bg-surface-elevated/40 border-accent-emerald/30 opacity-80'
                        : 'bg-surface border-border hover:border-primary/40'
                    )}
                  >
                    <button
                      disabled={isUpdating}
                      onClick={() => handleToggleTask(task.id, Boolean(task.completed))}
                      className='mt-0.5 text-primary hover:text-primary-light transition-colors flex-shrink-0'
                    >
                      {task.completed ? (
                        <CheckSquare className='w-4 h-4 text-accent-emerald' />
                      ) : (
                        <Square className='w-4 h-4 text-text-dim' />
                      )}
                    </button>

                    <div className='flex-1 space-y-1 text-left'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <span className={'text-xs font-bold ' + (task.completed ? 'line-through text-text-muted' : 'text-text')}>
                          {task.title}
                        </span>
                        <Badge variant='muted' size='sm'>{task.type}</Badge>
                        <Badge variant={task.priority === 'HIGH' ? 'primary' : 'muted'} size='sm'>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className='text-xs text-text-muted leading-relaxed'>{task.description}</p>
                      <div className='flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-text-dim'>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-3 h-3' /> {task.estimatedTime}
                        </span>
                        {task.skills && task.skills.length > 0 && (
                          <span>Skills: {task.skills.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase Capstone Project */}
          {currentPhase.project && (
            <div className='p-4 rounded-xl bg-surface border border-border space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <FolderGit2 className='w-4 h-4 text-accent-emerald' />
                  <h4 className='text-sm font-bold text-text'>Phase Capstone: {currentPhase.project.title}</h4>
                </div>
                <Badge
                  variant={currentPhase.project.status === 'COMPLETED' ? 'emerald' : currentPhase.project.status === 'IN_PROGRESS' ? 'primary' : 'muted'}
                  size='sm'
                >
                  {currentPhase.project.status ? currentPhase.project.status.replace('_', ' ') : 'NOT STARTED'}
                </Badge>
              </div>
              <p className='text-xs text-text-muted leading-relaxed'>{currentPhase.project.description}</p>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1'>
                <div className='flex flex-wrap gap-1.5'>
                  {currentPhase.project.skills.map((sk, sIdx) => (
                    <span key={sIdx} className='px-2 py-0.5 rounded bg-surface-elevated text-primary text-[11px] font-mono border border-border'>
                      {sk}
                    </span>
                  ))}
                </div>
                <div className='flex items-center gap-1.5'>
                  {(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleProjectStatusChange(currentPhase.project!.id, st)}
                      className={'px-2.5 py-1 rounded text-[10px] font-mono border transition-all ' + (
                        currentPhase.project!.status === st
                          ? 'bg-primary text-background font-bold border-primary'
                          : 'bg-surface-elevated text-text-muted hover:text-text border-border'
                      )}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase Completion Criteria */}
          <div className='pt-2 border-t border-border/60'>
            <span className='text-[11px] font-mono uppercase tracking-wider text-text-dim block mb-2'>
              Phase Completion Criteria
            </span>
            <div className='flex flex-wrap gap-2'>
              {currentPhase.completionCriteria.map((crit, cIdx) => (
                <div key={cIdx} className='text-xs text-text-muted flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded border border-border'>
                  <CheckCircle2 className='w-3 h-3 text-accent-emerald' />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};