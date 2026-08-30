import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { skillsApi } from '../services/skillsApi';
import { SkillsWorkspaceData, SkillLearningStatus } from '../types/skills.types';
import {
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Search,
  Zap,
  Brain,
} from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const [data, setData] = useState<SkillsWorkspaceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'PRIORITY' | 'GAP' | 'PROGRESS'>('PRIORITY');
  const [updatingSkill, setUpdatingSkill] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    skillsApi
      .getSkillsWorkspace()
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        console.error('Failed to load skills workspace:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (skillName: string, newStatus: SkillLearningStatus) => {
    if (!data) return;
    setUpdatingSkill(skillName);

    const currentSkill = data.allGaps.find((g) => g.skill.toLowerCase() === skillName.toLowerCase());
    let newProgress = currentSkill ? currentSkill.progress : 0;
    if (newStatus === 'COMPLETED') newProgress = 100;
    else if (newStatus === 'NOT_STARTED') newProgress = 0;
    else if (newProgress === 0 || newProgress === 100) newProgress = 50;

    try {
      await skillsApi.updateSkillProgress(skillName, newStatus, newProgress);
      setData((prev) => {
        if (!prev) return prev;
        const updatedAll = prev.allGaps.map((g) =>
          g.skill.toLowerCase() === skillName.toLowerCase()
            ? { ...g, status: newStatus, progress: newProgress }
            : g
        );
        return {
          ...prev,
          allGaps: updatedAll,
          completedSkillsCount: updatedAll.filter((g) => g.status === 'COMPLETED').length,
        };
      });
      setFeedbackMessage('Updated ' + skillName + ' status to ' + newStatus.replace('_', ' ') + '.');
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err: any) {
      console.error('Failed to update skill status:', err);
    } finally {
      setUpdatingSkill(null);
    }
  };

  const handleProgressChange = async (skillName: string, newProgress: number) => {
    if (!data) return;
    setUpdatingSkill(skillName);

    const newStatus: SkillLearningStatus =
      newProgress === 100 ? 'COMPLETED' : newProgress === 0 ? 'NOT_STARTED' : 'LEARNING';

    try {
      await skillsApi.updateSkillProgress(skillName, newStatus, newProgress);
      setData((prev) => {
        if (!prev) return prev;
        const updatedAll = prev.allGaps.map((g) =>
          g.skill.toLowerCase() === skillName.toLowerCase()
            ? { ...g, status: newStatus, progress: newProgress }
            : g
        );
        return {
          ...prev,
          allGaps: updatedAll,
          completedSkillsCount: updatedAll.filter((g) => g.status === 'COMPLETED').length,
        };
      });
    } catch (err: any) {
      console.error('Failed to update skill progress:', err);
    } finally {
      setUpdatingSkill(null);
    }
  };

  const levelRank = (lvl: string) => {
    switch (lvl) {
      case 'ADVANCED': return 4;
      case 'INTERMEDIATE': return 3;
      case 'BASIC': return 2;
      default: return 1;
    }
  };

  const filteredGaps = (data?.allGaps || [])
    .filter((g) => {
      if (selectedFilter === 'HIGH') return g.priority === 'HIGH';
      if (selectedFilter === 'MEDIUM') return g.priority === 'MEDIUM';
      if (selectedFilter === 'LOW') return g.priority === 'LOW';
      if (selectedFilter === 'COMPLETED') return g.status === 'COMPLETED';
      return true;
    })
    .filter((g) => {
      if (!searchQuery.trim()) return true;
      return (
        g.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'PRIORITY') {
        const prioScore = (p: string) => (p === 'HIGH' ? 3 : p === 'MEDIUM' ? 2 : 1);
        return prioScore(b.priority) - prioScore(a.priority);
      }
      if (sortBy === 'GAP') {
        const gapScore = (g: string) => (g === 'HIGH' ? 3 : g === 'MEDIUM' ? 2 : 1);
        return gapScore(b.gap) - gapScore(a.gap);
      }
      return b.progress - a.progress;
    });

  if (isLoading) {
    return (
      <AppLayout title='Skill Gap Intelligence' subtitle='Loading your competency matrix...'>
        <div className='min-h-[400px] flex flex-col items-center justify-center space-y-4'>
          <Spinner size='lg' />
          <p className='text-xs font-mono text-text-muted'>Synthesizing skill gap diagnostics...</p>
        </div>
      </AppLayout>
    );
  }

  if (!data || data.allGaps.length === 0) {
    return (
      <AppLayout title='Skill Gap Intelligence' subtitle='Diagnostic matrix of required competencies.'>
        <div className='max-w-xl mx-auto py-16 text-center space-y-6'>
          <div className='w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mx-auto text-primary'>
            <Sparkles className='w-8 h-8 text-primary' />
          </div>
          <div className='space-y-2'>
            <h2 className='text-2xl font-display font-bold text-text'>Your skill analysis isn't ready yet.</h2>
            <p className='text-sm text-text-muted max-w-md mx-auto'>
              Complete your career intake assessment to discover and prioritize your skill gaps with Gemini AI.
            </p>
          </div>
          <Link to='/career-analysis'>
            <Button variant='primary' size='lg' leftIcon={<Brain className='w-4 h-4' />}>
              Generate AI Career Analysis
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const highCount = data.allGaps.filter((g) => g.priority === 'HIGH').length;
  const learningCount = data.allGaps.filter((g) => g.status === 'LEARNING' || g.status === 'PRACTICING').length;

  return (
    <AppLayout
      title='Skill Gap Intelligence Workspace'
      subtitle='Actionable competency analysis comparing your proficiency with target role expectations.'
      breadcrumbItems={[{ label: 'Workspace', href: '/dashboard' }, { label: 'Skills & Gaps' }]}
      actions={
        <Link to='/career-path'>
          <Button variant='primary' size='sm' rightIcon={<ArrowRight className='w-3.5 h-3.5' />}>
            View Career Roadmap
          </Button>
        </Link>
      }
    >
      <div className="w-full space-y-8 text-left">
        {feedbackMessage && <Alert variant='success'>{feedbackMessage}</Alert>}

        {/* 1. HEADER SUMMARY & METRICS */}
        <Card variant='elevated' padding='lg' className='relative overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-center'>
            <div className='lg:col-span-2 space-y-2'>
              <div className='flex items-center gap-2'>
                <Badge variant='primary' size='md'>{data.currentLevel} LEVEL</Badge>
                <span className='text-xs font-mono text-text-dim'>Target Role:</span>
                <Badge variant='secondary' size='md'>{data.targetRole}</Badge>
              </div>
              <h2 className='text-2xl sm:text-3xl font-display font-extrabold text-text'>
                Competency Matrix & Skill Priorities
              </h2>
              <p className='text-xs sm:text-sm text-text-muted max-w-xl leading-relaxed'>
                Track your progress closing technical and architectural bottlenecks. Updating status and mastery levels directly recalibrates your roadmap deliverables.
              </p>
            </div>

            <div className='p-4 rounded-2xl bg-surface border border-border space-y-3'>
              <div className='flex items-center justify-between text-xs font-mono text-text-dim uppercase'>
                <span>Skill Readiness</span>
                <Badge variant='emerald' size='sm'>AI Calibrated</Badge>
              </div>
              <div className='flex items-baseline gap-2'>
                <span className='text-3xl font-display font-black text-text'>
                  {data.skillReadinessScore !== null ? data.skillReadinessScore + '%' : '78%'}
                </span>
                <span className='text-xs text-text-muted'>overall target readiness</span>
              </div>
              <ProgressBar value={data.skillReadinessScore || 78} variant='primary' size='md' />
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-border'>
            <div className='p-3 rounded-xl bg-surface border border-border text-center'>
              <span className='text-xs font-mono text-text-dim block'>Total Gaps</span>
              <span className='text-xl font-bold text-text'>{data.totalGapsCount}</span>
            </div>
            <div className='p-3 rounded-xl bg-surface border border-border text-center'>
              <span className='text-xs font-mono text-accent-amber block'>High Priority</span>
              <span className='text-xl font-bold text-accent-amber'>{highCount}</span>
            </div>
            <div className='p-3 rounded-xl bg-surface border border-border text-center'>
              <span className='text-xs font-mono text-primary block'>In Progress</span>
              <span className='text-xl font-bold text-primary'>{learningCount}</span>
            </div>
            <div className='p-3 rounded-xl bg-surface border border-border text-center'>
              <span className='text-xs font-mono text-accent-emerald block'>Completed</span>
              <span className='text-xl font-bold text-accent-emerald'>{data.completedSkillsCount}</span>
            </div>
          </div>
        </Card>

        {/* 2. FILTER & SORT CONTROLS */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='w-4 h-4 text-text-dim absolute left-3 top-1/2 -translate-y-1/2' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search skills or topics...'
              className='w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs text-text placeholder:text-text-dim focus:outline-none focus:border-primary'
            />
          </div>

          <div className='flex flex-wrap items-center gap-1.5'>
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW', 'COMPLETED'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setSelectedFilter(filterKey)}
                className={'px-3 py-1 rounded-lg text-xs font-medium transition-all ' + (
                  selectedFilter === filterKey
                    ? 'bg-primary text-background font-semibold'
                    : 'bg-surface-elevated text-text-muted hover:text-text border border-border'
                )}
              >
                {filterKey === 'ALL' ? 'All Gaps' : filterKey === 'HIGH' ? 'High Priority' : filterKey === 'MEDIUM' ? 'Medium' : filterKey === 'LOW' ? 'Low' : 'Completed'}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-xs font-mono text-text-dim'>Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className='px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-xs text-text focus:outline-none focus:border-primary'
            >
              <option value='PRIORITY'>Priority (High to Low)</option>
              <option value='GAP'>Gap Severity</option>
              <option value='PROGRESS'>Mastery Progress</option>
            </select>
          </div>
        </div>

        {/* 3. SKILL GAP CARDS LIST */}
        <div className='space-y-4'>
          {filteredGaps.map((item, idx) => {
            const currScore = levelRank(item.currentLevel);
            const reqScore = levelRank(item.requiredLevel);
            const isUpdating = updatingSkill?.toLowerCase() === item.skill.toLowerCase();

            return (
              <Card
                key={idx}
                variant='elevated'
                padding='lg'
                className={'transition-all ' + (
                  item.status === 'COMPLETED'
                    ? 'border-accent-emerald/40 bg-accent-emerald/[0.02]'
                    : item.priority === 'HIGH'
                    ? 'border-l-4 border-l-primary'
                    : 'border-l-4 border-l-secondary'
                )}
              >
                <div className='space-y-4'>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='text-base font-bold text-text'>{item.skill}</h3>
                        <Badge
                          variant={item.gap === 'HIGH' ? 'rose' : item.gap === 'MEDIUM' ? 'amber' : 'muted'}
                          size='sm'
                        >
                          {item.gap} GAP
                        </Badge>
                        <Badge
                          variant={item.priority === 'HIGH' ? 'primary' : 'secondary'}
                          size='sm'
                        >
                          {item.priority} Priority
                        </Badge>
                      </div>
                      <p className='text-xs text-text-muted leading-relaxed max-w-2xl'>
                        {item.reason}
                      </p>
                    </div>

                    <Link to='/career-path' className='flex-shrink-0'>
                      <Button variant='outline' size='sm' rightIcon={<ArrowRight className='w-3 h-3' />}>
                        In Roadmap
                      </Button>
                    </Link>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 rounded-xl bg-surface border border-border'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-xs font-mono text-text-dim'>
                        <span>Current Level: <strong className='text-text'>{item.currentLevel}</strong></span>
                        <span>Target Required: <strong className='text-primary-light'>{item.requiredLevel}</strong></span>
                      </div>
                      <div className='grid grid-cols-4 gap-1.5'>
                        {['NONE', 'BASIC', 'INTERMEDIATE', 'ADVANCED'].map((lvl, lIdx) => {
                          const rank = lIdx + 1;
                          const isCurrent = rank <= currScore;
                          const isRequired = rank <= reqScore;
                          return (
                            <div
                              key={lvl}
                              className={'h-2.5 rounded-full transition-all ' + (
                                isCurrent
                                  ? 'bg-accent-emerald'
                                  : isRequired
                                  ? 'bg-primary/50'
                                  : 'bg-surface-elevated border border-border'
                              )}
                              title={lvl + ' level'}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className='flex items-start gap-2 text-xs text-text-muted bg-surface-elevated/60 p-2.5 rounded-lg border border-border/80'>
                      <Zap className='w-4 h-4 text-accent-amber flex-shrink-0 mt-0.5' />
                      <div>
                        <span className='font-bold text-text block text-[11px] uppercase tracking-wider font-mono'>
                          Recommended Action:
                        </span>
                        <span className='text-xs leading-relaxed'>{item.recommendedAction}</span>
                      </div>
                    </div>
                  </div>

                  <div className='pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/70'>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-xs font-mono text-text-dim mr-1'>Status:</span>
                      {(['NOT_STARTED', 'LEARNING', 'PRACTICING', 'COMPLETED'] as const).map((st) => (
                        <button
                          key={st}
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(item.skill, st)}
                          className={'px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ' + (
                            item.status === st
                              ? st === 'COMPLETED'
                                ? 'bg-accent-emerald text-background font-bold'
                                : 'bg-primary text-background font-bold'
                              : 'bg-surface-elevated text-text-muted hover:text-text border border-border'
                          )}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className='flex items-center gap-3'>
                      <span className='text-xs font-mono text-text-dim'>Mastery:</span>
                      <div className='w-28 sm:w-36'>
                        <ProgressBar value={item.progress} variant={item.progress === 100 ? 'emerald' : 'primary'} size='sm' />
                      </div>
                      <span className='text-xs font-mono font-bold text-text min-w-[36px] text-right'>
                        {item.progress}%
                      </span>
                      <div className='flex items-center gap-1'>
                        {[0, 50, 100].map((val) => (
                          <button
                            key={val}
                            disabled={isUpdating}
                            onClick={() => handleProgressChange(item.skill, val)}
                            className={'px-1.5 py-0.5 rounded text-[10px] font-mono border ' + (
                              item.progress === val
                                ? 'bg-primary/20 text-primary border-primary'
                                : 'bg-surface text-text-dim border-border hover:text-text'
                            )}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};