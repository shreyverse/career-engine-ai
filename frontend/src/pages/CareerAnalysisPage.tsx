import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { careerAnalysisApi } from '../services/careerAnalysisApi';
import {
  CareerAnalysisData,
  CareerAnalysisMetadata,
} from '../types/careerAnalysis.types';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  ShieldAlert,
  Layers,
  BookOpen,
  FolderGit2,
  Calendar,
  CheckCircle,
  Clock,
  Brain,
} from 'lucide-react';

export const CareerAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [analysis, setAnalysis] = useState<CareerAnalysisData | null>(null);
  const [metadata, setMetadata] = useState<CareerAnalysisMetadata | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadingStages = [
    'Understanding your career profile & background...',
    'Comparing your skills with your target role...',
    'Identifying your biggest technical & architectural gaps...',
    'Synthesizing prioritized recommendations & projects...',
  ];

  useEffect(() => {
    let isMounted = true;
    careerAnalysisApi
      .getLatestAnalysis()
      .then((res) => {
        if (!isMounted) return;
        if (res.analysis) {
          setAnalysis(res.analysis);
          setMetadata(res.metadata);
        }
      })
      .catch((err) => {
        console.error('Failed to load career analysis:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerateAnalysis = async (isRegenerate = false) => {
    setIsGenerating(true);
    setError(null);
    setLoadingStage(0);

    const stageInterval = setInterval(() => {
      setLoadingStage((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const res = isRegenerate
        ? await careerAnalysisApi.regenerateAnalysis()
        : await careerAnalysisApi.generateAnalysis();

      if (res.analysis) {
        setAnalysis(res.analysis);
        setMetadata(res.metadata);
        setSuccessMessage(
          isRegenerate
            ? 'Career analysis successfully regenerated.'
            : 'Personalized career intelligence analysis generated.'
        );
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate career analysis. Please try again.');
    } finally {
      clearInterval(stageInterval);
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout title='Career Intelligence Engine' subtitle='Loading analysis report...'>
        <div className='min-h-[400px] flex flex-col items-center justify-center space-y-4'>
          <Spinner size='lg' />
          <p className='text-xs font-mono text-text-muted'>Loading your career analysis report...</p>
        </div>
      </AppLayout>
    );
  }

  if (isGenerating) {
    return (
      <AppLayout
        title='Synthesizing Career Intelligence'
        subtitle='Analyzing your background against your target role with Gemini AI'
      >
        <div className='max-w-xl mx-auto py-16 text-center space-y-8 animate-in fade-in'>
          <div className='w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto text-primary shadow-subtle-glow animate-pulse'>
            <Brain className='w-10 h-10 text-primary' />
          </div>

          <div className='space-y-3'>
            <Badge variant='primary' size='md'>
              Gemini AI Diagnostic
            </Badge>
            <h2 className='text-2xl font-display font-extrabold text-text'>
              {loadingStages[loadingStage]}
            </h2>
            <p className='text-xs text-text-muted max-w-sm mx-auto'>
              Evaluating technical skills, experience, project portfolio, and target industry expectations.
            </p>
          </div>

          <div className='space-y-2 max-w-md mx-auto'>
            <ProgressBar value={((loadingStage + 1) / loadingStages.length) * 100} variant='primary' size='md' />
            <span className='text-[11px] font-mono text-text-dim block'>
              Stage {loadingStage + 1} of {loadingStages.length}
            </span>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!analysis) {
    return (
      <AppLayout
        title='Career Intelligence Analysis'
        subtitle='AI-powered diagnostic of your strengths, skill gaps, and prioritized growth path.'
      >
        <div className='max-w-xl mx-auto py-12 text-center space-y-6'>
          <div className='w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mx-auto text-primary'>
            <Sparkles className='w-8 h-8 text-primary' />
          </div>

          <div className='space-y-2'>
            <h2 className='text-2xl font-display font-bold text-text'>
              Your career analysis isn't ready yet.
            </h2>
            <p className='text-sm text-text-muted leading-relaxed max-w-md mx-auto'>
              Generate your personalized career intelligence report to uncover your skill gaps and actionable next steps.
            </p>
          </div>

          {error && <Alert variant='error'>{error}</Alert>}

          <div>
            <Button
              variant='primary'
              size='lg'
              onClick={() => handleGenerateAnalysis(false)}
              leftIcon={<Sparkles className='w-4 h-4' />}
            >
              Generate Career Analysis
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const readiness = analysis.careerReadiness;

  return (
    <AppLayout
      title='AI Career Intelligence Report'
      subtitle='Comprehensive gap analysis, prioritized technology recommendations, and immediate next actions.'
      breadcrumbItems={[{ label: 'Workspace', href: '/dashboard' }, { label: 'Career Analysis' }]}
      actions={
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleGenerateAnalysis(true)}
          leftIcon={<RefreshCw className='w-3.5 h-3.5' />}
        >
          Regenerate Analysis
        </Button>
      }
    >
      <div className="w-full space-y-8 text-left">
        {error && <Alert variant='error'>{error}</Alert>}
        {successMessage && <Alert variant='success'>{successMessage}</Alert>}

        {/* 1. CAREER SNAPSHOT & READINESS */}
        <Card variant='elevated' padding='lg' className='relative overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-center'>
            <div className='lg:col-span-2 space-y-3'>
              <div className='flex items-center gap-2.5'>
                <Badge variant='primary' size='md'>
                  {analysis.currentLevel} LEVEL
                </Badge>
                <span className='text-xs font-mono text-text-dim'>Targeting</span>
                <Badge variant='secondary' size='md'>
                  {analysis.targetRole}
                </Badge>
              </div>

              <h2 className='text-2xl sm:text-3xl font-display font-extrabold text-text'>
                Career Trajectory Diagnostic
              </h2>
              <p className='text-sm text-text-muted leading-relaxed'>
                {analysis.careerSummary}
              </p>
            </div>

            {/* Career Readiness Score Card */}
            <div className='p-5 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-mono uppercase tracking-wider text-text-muted font-semibold'>
                  Career Readiness
                </span>
                <Badge variant='emerald' size='sm'>
                  {readiness.confidence} Confidence
                </Badge>
              </div>

              <div className='flex items-baseline gap-2'>
                <span className='text-4xl font-display font-black text-text'>
                  {readiness.overall ?? '--'}%
                </span>
                <span className='text-xs text-text-dim'>Estimated alignment</span>
              </div>

              <ProgressBar value={readiness.overall || 0} variant='primary' size='md' />

              <div className='grid grid-cols-2 gap-2 pt-2 border-t border-border/80 text-[11px] font-mono text-text-dim'>
                <div>Skills: <strong className='text-text'>{readiness.skills ?? '--'}%</strong></div>
                <div>Projects: <strong className='text-text'>{readiness.projects ?? '--'}%</strong></div>
                <div>Experience: <strong className='text-text'>{readiness.experience ?? '--'}%</strong></div>
                <div>Alignment: <strong className='text-text'>{readiness.careerAlignment ?? '--'}%</strong></div>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. STRENGTHS & WEAKNESSES */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card variant='elevated' padding='lg' className='space-y-4 border-l-4 border-l-accent-emerald'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-lg bg-accent-emerald/10 text-accent-emerald flex items-center justify-center'>
                <CheckCircle2 className='w-4 h-4' />
              </div>
              <div>
                <h3 className='text-base font-bold text-text'>Your Key Strengths</h3>
                <p className='text-xs text-text-muted'>Identified advantages from your background</p>
              </div>
            </div>
            <ul className='space-y-2.5 pt-1'>
              {analysis.strengths.map((str, idx) => (
                <li key={idx} className='text-xs text-text flex items-start gap-2 leading-relaxed'>
                  <span className='w-1.5 h-1.5 rounded-full bg-accent-emerald mt-1.5 flex-shrink-0' />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card variant='elevated' padding='lg' className='space-y-4 border-l-4 border-l-accent-amber'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-lg bg-accent-amber/10 text-accent-amber flex items-center justify-center'>
                <AlertTriangle className='w-4 h-4' />
              </div>
              <div>
                <h3 className='text-base font-bold text-text'>What Is Holding You Back</h3>
                <p className='text-xs text-text-muted'>Current gaps requiring deliberate practice</p>
              </div>
            </div>
            <ul className='space-y-2.5 pt-1'>
              {analysis.weaknesses.map((weak, idx) => (
                <li key={idx} className='text-xs text-text flex items-start gap-2 leading-relaxed'>
                  <span className='w-1.5 h-1.5 rounded-full bg-accent-amber mt-1.5 flex-shrink-0' />
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* 3. SKILL GAP MATRIX TABLE */}
        <Card variant='elevated' padding='lg' className='space-y-5'>
          <div className='flex items-center justify-between pb-3 border-b border-border'>
            <div className='flex items-center gap-2.5'>
              <div className='w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center'>
                <TrendingUp className='w-4 h-4' />
              </div>
              <div>
                <h3 className='text-base font-bold text-text'>Prioritized Skill Gap Matrix</h3>
                <p className='text-xs text-text-muted'>
                  Direct comparison between your current proficiency and {analysis.targetRole} expectations.
                </p>
              </div>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs border-collapse'>
              <thead>
                <tr className='border-b border-border text-text-dim uppercase font-mono text-[10px] tracking-wider'>
                  <th className='py-3 px-3'>Skill Domain</th>
                  <th className='py-3 px-3'>Current Level</th>
                  <th className='py-3 px-3'>Target Required</th>
                  <th className='py-3 px-3'>Gap Severity</th>
                  <th className='py-3 px-3'>Priority</th>
                  <th className='py-3 px-3'>Impact & Rationale</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/60'>
                {analysis.skillGaps.map((item, idx) => (
                  <tr key={idx} className='hover:bg-surface-elevated/60 transition-colors'>
                    <td className='py-3.5 px-3 font-semibold text-text whitespace-nowrap'>
                      {item.skill}
                    </td>
                    <td className='py-3.5 px-3 font-mono text-text-muted'>
                      {item.currentLevel}
                    </td>
                    <td className='py-3.5 px-3 font-mono font-semibold text-primary-light'>
                      {item.requiredLevel}
                    </td>
                    <td className='py-3.5 px-3 whitespace-nowrap'>
                      <Badge variant={item.gap === 'HIGH' ? 'rose' : item.gap === 'MEDIUM' ? 'amber' : 'muted'} size='sm'>
                        {item.gap} GAP
                      </Badge>
                    </td>
                    <td className='py-3.5 px-3 whitespace-nowrap'>
                      <Badge variant={item.priority === 'HIGH' ? 'primary' : 'secondary'} size='sm'>
                        {item.priority}
                      </Badge>
                    </td>
                    <td className='py-3.5 px-3 text-text-muted leading-relaxed min-w-[240px]'>
                      {item.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 4. RECOMMENDED TECHNOLOGIES & KNOWLEDGE AREAS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card variant='elevated' padding='lg' className='space-y-4'>
            <div className='flex items-center gap-2 pb-2 border-b border-border'>
              <Layers className='w-4 h-4 text-primary' />
              <h3 className='text-base font-bold text-text'>Recommended Technologies</h3>
            </div>
            <div className='space-y-3'>
              {analysis.recommendedTechnologies.map((tech, idx) => (
                <div key={idx} className='p-3.5 rounded-xl bg-surface border border-border space-y-2'>
                  <div className='flex items-center justify-between'>
                    <h4 className='text-sm font-bold text-text'>{tech.technology}</h4>
                    <Badge variant={tech.priority === 'HIGH' ? 'primary' : 'secondary'} size='sm'>
                      {tech.priority} Priority
                    </Badge>
                  </div>
                  <p className='text-xs text-text-muted leading-relaxed'>{tech.reason}</p>
                  {tech.prerequisites && tech.prerequisites.length > 0 && (
                    <div className='flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono text-text-dim'>
                      <span>Prerequisites:</span>
                      {tech.prerequisites.map((p, pIdx) => (
                        <span key={pIdx} className='px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-muted'>
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card variant='elevated' padding='lg' className='space-y-4'>
            <div className='flex items-center gap-2 pb-2 border-b border-border'>
              <BookOpen className='w-4 h-4 text-secondary' />
              <h3 className='text-base font-bold text-text'>Core Knowledge & Architecture</h3>
            </div>
            <div className='space-y-3'>
              {analysis.knowledgeAreas.map((area, idx) => (
                <div key={idx} className='p-3.5 rounded-xl bg-surface border border-border space-y-1.5'>
                  <div className='flex items-center justify-between'>
                    <h4 className='text-sm font-bold text-text'>{area.topic}</h4>
                    <Badge variant={area.priority === 'HIGH' ? 'secondary' : 'muted'} size='sm'>
                      {area.priority} Priority
                    </Badge>
                  </div>
                  <p className='text-xs text-text-muted leading-relaxed'>{area.reason}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 5. RECOMMENDED PROJECTS */}
        <Card variant='elevated' padding='lg' className='space-y-4'>
          <div className='flex items-center justify-between pb-2 border-b border-border'>
            <div className='flex items-center gap-2'>
              <FolderGit2 className='w-4 h-4 text-accent-emerald' />
              <h3 className='text-base font-bold text-text'>Tailored Projects to Close Gaps</h3>
            </div>
            <span className='text-xs text-text-dim font-mono'>
              Targeted at identified weaknesses
            </span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {analysis.recommendedProjects.map((proj, idx) => (
              <div key={idx} className='p-4 rounded-xl bg-surface border border-border space-y-3 flex flex-col justify-between'>
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-[11px] font-mono text-text-dim uppercase'>Project #{idx + 1}</span>
                    <Badge variant='primary' size='sm'>
                      {proj.difficulty}
                    </Badge>
                  </div>
                  <h4 className='text-sm font-bold text-text mb-1'>{proj.title}</h4>
                  <p className='text-xs text-text-muted leading-relaxed'>{proj.purpose}</p>
                </div>
                <div className='pt-2 border-t border-border flex flex-wrap gap-1.5'>
                  {proj.skills.map((s, sIdx) => (
                    <span key={sIdx} className='px-2 py-0.5 rounded bg-surface-elevated text-primary text-[11px] font-mono border border-border'>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 6. YOUR NEXT ACTIONS */}
        <Card variant='elevated' padding='lg' className='space-y-4'>
          <div className='flex items-center justify-between pb-2 border-b border-border'>
            <div className='flex items-center gap-2'>
              <Zap className='w-4 h-4 text-accent-amber' />
              <h3 className='text-base font-bold text-text'>Your Immediate Next Actions</h3>
            </div>
            <Badge variant='amber' size='sm'>High ROI</Badge>
          </div>

          <div className='space-y-3'>
            {analysis.nextActions.map((action, idx) => (
              <div
                key={idx}
                className='p-4 rounded-xl bg-surface border border-border hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3'
              >
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs font-mono font-bold text-primary'>#{idx + 1}</span>
                    <h4 className='text-sm font-bold text-text'>{action.title}</h4>
                    <Badge variant={action.priority === 'HIGH' ? 'primary' : 'muted'} size='sm'>
                      {action.priority}
                    </Badge>
                  </div>
                  <p className='text-xs text-text-muted leading-relaxed'>{action.description}</p>
                </div>
                <div className='flex items-center gap-2 flex-shrink-0'>
                  <span className='text-xs font-mono text-text-dim flex items-center gap-1 bg-surface-elevated px-2.5 py-1 rounded border border-border'>
                    <Clock className='w-3 h-3' /> {action.estimatedEffort}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Disclaimer footer */}
        <div className='pt-2 text-center text-xs text-text-dim'>
          <p>Career Engine diagnostic recommendations are powered by Gemini AI and calibrate continuously as you complete roadmaps and assessments.</p>
        </div>
      </div>
    </AppLayout>
  );
};