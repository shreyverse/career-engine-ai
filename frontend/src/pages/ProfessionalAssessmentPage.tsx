import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Briefcase,
  Layers,
  FileText,
  BookOpen,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { Container } from '../components/layout/Container';
import { assessmentApi } from '../services/assessmentApi';
import { resumeApi } from '../services/resumeApi';
import { Upload } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  ProfessionalAssessmentData,
  SkillLevel,
  TechSkillItem,
  ResumeOption,
} from '../types';

export const ProfessionalAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 1: Current Career
  const [currentRole, setCurrentRole] = useState('Software Engineer');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(3);
  const [industry, setIndustry] = useState('Technology');
  const [company, setCompany] = useState('');
  const [responsibilities, setResponsibilities] = useState('');

  // Step 2: Current Skills
  const [technicalSkills, setTechnicalSkills] = useState<TechSkillItem[]>([
    { name: 'TypeScript', level: 'ADVANCED' },
    { name: 'Node.js', level: 'INTERMEDIATE' },
    { name: 'PostgreSQL', level: 'INTERMEDIATE' },
  ]);
  const [frameworks, setFrameworks] = useState<TechSkillItem[]>([
    { name: 'React', level: 'ADVANCED' },
    { name: 'Express', level: 'INTERMEDIATE' },
  ]);
  const [tools, setTools] = useState<TechSkillItem[]>([
    { name: 'Git', level: 'ADVANCED' },
    { name: 'Docker', level: 'BASIC' },
  ]);
  const [domainSkills, setDomainSkills] = useState<TechSkillItem[]>([
    { name: 'REST APIs', level: 'ADVANCED' },
    { name: 'System Design', level: 'BASIC' },
  ]);

  // Step 3: Career Goal
  const [lookingFor, setLookingFor] = useState<string[]>(['PROMOTION', 'BETTER_SALARY']);
  const [primaryMotivation, setPrimaryMotivation] = useState('Promotion & Senior IC Track');

  // Step 4: Target Role
  const [targetRole, setTargetRole] = useState('Senior Fullstack Engineer');
  const [customTargetRole, setCustomTargetRole] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('Technology / SaaS');
  const [preferredCompanyType, setPreferredCompanyType] = useState<string[]>(['PRODUCT_COMPANY', 'STARTUP']);

  // Step 5: Challenges
  const [careerChallenges, setCareerChallenges] = useState<string[]>(['SYSTEM_DESIGN', 'CI_CD']);
  const [challengeDetails, setChallengeDetails] = useState('Need to master high-scale architecture and distributed systems.');

  // Step 6: Resume
  const [resumeOption, setResumeOption] = useState<ResumeOption>('UPLOAD');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState<boolean>(false);
  const [uploadedResumeSummary, setUploadedResumeSummary] = useState<string | null>(null);

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setResumeFile(selected);
      setIsUploadingResume(true);
      setError(null);
      try {
        const uploadRes = await resumeApi.uploadResumeFile(selected, targetRole);
        await resumeApi.createResume({
          name: selected.name.replace(/\.[^/.]+$/, '') + ' (Assessment Upload)',
          targetRole: targetRole || 'Senior Fullstack Engineer',
          status: 'READY',
          data: uploadRes.parsedData,
        });
        setUploadedResumeSummary(
          `Successfully parsed ${selected.name}! Extracted skills and career history into your profile.`
        );
      } catch (err: any) {
        setError(err.message || 'Failed to parse resume document.');
      } finally {
        setIsUploadingResume(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    assessmentApi
      .getProfessionalAssessment()
      .then((res) => {
        if (!isMounted) return;
        const d = res.assessment;
        if (d) {
          if (d.currentCareer?.currentRole) setCurrentRole(d.currentCareer.currentRole);
          if (d.currentCareer?.yearsOfExperience) setYearsOfExperience(d.currentCareer.yearsOfExperience);
          if (d.currentCareer?.industry) setIndustry(d.currentCareer.industry);
          if (d.currentCareer?.company) setCompany(d.currentCareer.company);
          if (d.currentCareer?.responsibilities) setResponsibilities(d.currentCareer.responsibilities);

          if (d.skills?.technicalSkills) setTechnicalSkills(d.skills.technicalSkills);
          if (d.skills?.frameworks) setFrameworks(d.skills.frameworks);
          if (d.skills?.tools) setTools(d.skills.tools);
          if (d.skills?.domainSkills) setDomainSkills(d.skills.domainSkills);

          if (d.careerGoal?.lookingFor) setLookingFor(d.careerGoal.lookingFor);
          if (d.careerGoal?.primaryMotivation) setPrimaryMotivation(d.careerGoal.primaryMotivation);

          if (d.targetRole?.targetRole) setTargetRole(d.targetRole.targetRole);
          if (d.targetRole?.targetIndustry) setTargetIndustry(d.targetRole.targetIndustry);
          if (d.targetRole?.preferredCompanyType) setPreferredCompanyType(d.targetRole.preferredCompanyType);

          if (d.challenges?.careerChallenges) setCareerChallenges(d.challenges.careerChallenges);
          if (d.challenges?.challengeDetails) setChallengeDetails(d.challenges.challengeDetails);

          if (d.resume?.resumeOption) setResumeOption(d.resume.resumeOption);

          if (d.currentStep && d.currentStep >= 1 && d.currentStep <= 6) {
            setStep(d.currentStep);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load professional assessment:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const buildCurrentPayload = (): ProfessionalAssessmentData => ({
    currentCareer: {
      currentRole: currentRole.trim(),
      yearsOfExperience: Number(yearsOfExperience),
      industry,
      company: company.trim() || undefined,
      responsibilities: responsibilities.trim() || undefined,
    },
    skills: {
      technicalSkills,
      frameworks,
      tools,
      domainSkills,
    },
    careerGoal: {
      lookingFor,
      primaryMotivation,
    },
    targetRole: {
      targetRole: targetRole === 'Other' ? customTargetRole : targetRole,
      targetIndustry,
      preferredCompanyType,
    },
    challenges: {
      careerChallenges,
      challengeDetails,
    },
    resume: {
      resumeOption,
    },
    currentStep: step,
  });

  const autoSaveCurrentStep = async (nextStepNumber: number) => {
    setSaveStatus('saving');
    try {
      const payload = buildCurrentPayload();
      await assessmentApi.saveProfessionalStep(nextStepNumber, payload);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err: any) {
      setSaveStatus('error');
      setError(err.message || 'Failed to auto-save progress.');
    }
  };

  const updateSkillLevel = (
    list: TechSkillItem[],
    setList: React.Dispatch<React.SetStateAction<TechSkillItem[]>>,
    name: string,
    level: SkillLevel
  ) => {
    const existing = list.find((item) => item.name === name);
    if (existing) {
      setList(list.map((item) => (item.name === name ? { ...item, level } : item)));
    } else {
      setList([...list, { name, level }]);
    }
  };

  const removeSkill = (
    list: TechSkillItem[],
    setList: React.Dispatch<React.SetStateAction<TechSkillItem[]>>,
    name: string
  ) => {
    setList(list.filter((item) => item.name !== name));
  };

  const addCustomSkill = (
    list: TechSkillItem[],
    setList: React.Dispatch<React.SetStateAction<TechSkillItem[]>>,
    name: string
  ) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!list.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setList([...list, { name: trimmed, level: 'INTERMEDIATE' }]);
    }
  };

  const handleContinue = async () => {
    setError(null);
    if (step === 1 && !currentRole.trim()) {
      setError('Please specify your current professional role.');
      return;
    }
    if (step === 4 && !(targetRole === 'Other' ? customTargetRole.trim() : targetRole)) {
      setError('Please specify your target role.');
      return;
    }

    if (step < totalSteps) {
      const nextStep = step + 1;
      setStep(nextStep);
      await autoSaveCurrentStep(nextStep);
    } else {
      await handleComplete();
    }
  };

  const handleBack = async () => {
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      await autoSaveCurrentStep(prevStep);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await assessmentApi.saveProfessionalStep(6, buildCurrentPayload());
      await assessmentApi.completeProfessionalAssessment();
      await refreshUser();
      setIsCompleted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to complete assessment.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex flex-col items-center justify-center space-y-4'>
        <Spinner size='lg' />
        <p className='text-xs font-mono text-text-muted'>Loading professional assessment...</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className='min-h-screen bg-background text-text py-16 px-4 relative subtle-radial-glow flex flex-col justify-center items-center'>
        <div className='absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none' />
        <Card variant='elevated' padding='lg' className='w-full max-w-xl text-center space-y-6 z-10'>
          <div className='w-16 h-16 rounded-2xl bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/30 flex items-center justify-center mx-auto shadow-subtle-glow'>
            <CheckCircle2 className='w-8 h-8' />
          </div>
          <div className='space-y-2'>
            <Badge variant='emerald' size='md'>Intake Complete</Badge>
            <h1 className='text-3xl font-display font-extrabold text-text'>Your career profile is ready.</h1>
            <p className='text-sm text-text-muted leading-relaxed max-w-md mx-auto'>
              We've mapped your professional trajectory baseline. You're ready to explore your personalized dashboard.
            </p>
          </div>
          <div className='pt-4'>
            <Button variant='primary' size='lg' className='w-full' onClick={() => navigate('/dashboard')} rightIcon={<ArrowRight className='w-4 h-4' />}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const lookingForOptions = [
    { id: 'PROMOTION', label: 'Promotion / Senior IC Elevation' },
    { id: 'COMPANY_SWITCH', label: 'Company Switch (Tier-1 Tech)' },
    { id: 'ROLE_SWITCH', label: 'Role Switch (e.g. Frontend to Fullstack)' },
    { id: 'DOMAIN_SWITCH', label: 'Domain Pivot (AI / Cloud Architecture)' },
    { id: 'BETTER_SALARY', label: 'Significant Salary Acceleration' },
    { id: 'REMOTE', label: 'High-Impact Remote Position' },
    { id: 'LEADERSHIP', label: 'Tech Lead / Engineering Management' },
  ];

  const challengeOptions = [
    { id: 'SYSTEM_DESIGN', label: 'System Design & High Scale' },
    { id: 'TECHNICAL_SKILLS', label: 'Modern Technical Frameworks' },
    { id: 'LEADERSHIP', label: 'Tech Leadership & Mentorship' },
    { id: 'DSA', label: 'Data Structures & Algorithmic Interviews' },
    { id: 'CI_CD', label: 'Cloud, Kubernetes & DevOps Automation' },
    { id: 'RESUME', label: 'Executive Resume & Portfolio Impact' },
  ];

  const skillLevelOrder: SkillLevel[] = ['BEGINNER', 'BASIC', 'INTERMEDIATE', 'ADVANCED'];

  return (
    <div className='min-h-screen bg-background text-text py-10 px-4 sm:px-8 lg:px-12 relative subtle-radial-glow flex flex-col justify-between'>
      {/* Ambient background glow */}
      <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[500px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none rounded-full' />
      <div className='absolute inset-0 subtle-grid-bg opacity-30 pointer-events-none' />

      <div className='w-full max-w-[1400px] mx-auto space-y-8 relative z-10'>
        {/* Header */}
        <div className='flex items-center justify-between pb-3 border-b border-border/80'>
          <Link to='/' className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-secondary'>
              <Compass className='w-4 h-4 text-secondary' />
            </div>
            <span className='font-display font-bold text-sm text-text'>Career Engine</span>
          </Link>
          <div className='flex items-center gap-3'>
            {saveStatus === 'saving' && (
              <span className='text-[11px] font-mono text-secondary flex items-center gap-1'>
                <Spinner size='sm' /> Auto-saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className='text-[11px] font-mono text-accent-emerald flex items-center gap-1'>
                <CheckCircle2 className='w-3 h-3' /> Saved
              </span>
            )}
            <Badge variant='secondary' size='sm'>Professional Track</Badge>
          </div>
        </div>

        {/* Stepper */}
        <div className='space-y-2 text-left'>
          <div className='flex justify-between items-baseline'>
            <span className='text-xs font-mono text-secondary-light font-semibold uppercase tracking-wider'>
              Step {step} of {totalSteps}
            </span>
            <span className='text-xs font-mono text-text-dim font-medium'>
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <ProgressBar value={(step / totalSteps) * 100} size='sm' variant='secondary' />
        </div>

        {error && <Alert variant='error'>{error}</Alert>}

        {/* Step 1: Current Career */}
        {step === 1 && (
          <Card variant='elevated' padding='lg' className='space-y-6 text-left'>
            <div className='space-y-1 pb-4 border-b border-border'>
              <span className='text-xs font-mono uppercase tracking-wider text-secondary font-semibold'>Section 1 • Current Position</span>
              <h2 className='text-2xl font-display font-bold text-text'>Tell us about your current role.</h2>
              <p className='text-xs text-text-muted'>Your baseline seniority helps us detect gaps for your target position.</p>
            </div>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Input label='Current Title / Role' value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} placeholder='e.g. Software Engineer II' required />
                <Input label='Current Company (Optional)' value={company} onChange={(e) => setCompany(e.target.value)} placeholder='e.g. Tech Corp' />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Select
                  label='Years of Experience'
                  value={yearsOfExperience.toString()}
                  onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                  options={[
                    { value: '1', label: '1 Year' },
                    { value: '2', label: '2 Years' },
                    { value: '3', label: '3 Years' },
                    { value: '5', label: '4 - 5 Years' },
                    { value: '7', label: '6 - 8 Years' },
                    { value: '10', label: '9+ Years (Staff / Principal)' },
                  ]}
                />
                <Select
                  label='Industry Domain'
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  options={[
                    { value: 'Technology', label: 'Technology / SaaS' },
                    { value: 'FinTech', label: 'FinTech & Banking' },
                    { value: 'Healthcare', label: 'Healthcare & Life Sciences' },
                    { value: 'E-commerce', label: 'E-commerce & Retail' },
                    { value: 'Consulting', label: 'Consulting & Services' },
                    { value: 'Other', label: 'Other Industry...' },
                  ]}
                />
              </div>
              <Textarea label='Key Responsibilities & Deliverables' value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} placeholder='Describe your primary technical focus, architecture involvement, or team contributions...' rows={2} />
            </div>
          </Card>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <Card variant='elevated' padding='lg' className='space-y-6 text-left'>
            <div className='space-y-1 pb-4 border-b border-border'>
              <span className='text-xs font-mono uppercase tracking-wider text-secondary font-semibold'>Section 2 • Skills & Stack</span>
              <h2 className='text-2xl font-display font-bold text-text'>What is your current technical stack?</h2>
              <p className='text-xs text-text-muted'>Rate your proficiency across languages, frameworks, and architecture tools.</p>
            </div>
            <div className='space-y-3'>
              <label className='block text-xs font-mono uppercase tracking-wider text-text-muted font-semibold'>Core Technologies</label>
              <div className='space-y-2'>
                {technicalSkills.map((skill) => (
                  <div key={skill.name} className='p-3 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                    <span className='text-sm font-semibold text-text'>{skill.name}</span>
                    <div className='flex items-center gap-1.5'>
                      {skillLevelOrder.map((lvl) => (
                        <button
                          key={lvl}
                          type='button'
                          onClick={() => updateSkillLevel(technicalSkills, setTechnicalSkills, skill.name, lvl)}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-all ${skill.level === lvl ? 'bg-secondary text-white border-secondary font-semibold' : 'bg-surface-elevated text-text-dim border-border'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                      <button type='button' onClick={() => removeSkill(technicalSkills, setTechnicalSkills, skill.name)} className='p-1 text-text-dim hover:text-accent-rose ml-1'>
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex flex-wrap gap-1.5 pt-1'>
                {['TypeScript', 'Go', 'Python', 'Java', 'Rust', 'PostgreSQL', 'Redis', 'GraphQL', 'Kafka', 'Docker', 'Kubernetes', 'AWS'].map((tech) => (
                  <button key={tech} type='button' onClick={() => addCustomSkill(technicalSkills, setTechnicalSkills, tech)} className='px-2.5 py-1 text-xs rounded-md bg-surface-elevated border border-border text-text-muted hover:border-secondary/50 hover:text-text flex items-center gap-1'>
                    <Plus className='w-3 h-3' /> {tech}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Career Goal */}
        {step === 3 && (
          <Card variant='elevated' padding='lg' className='space-y-6 text-left'>
            <div className='space-y-1 pb-4 border-b border-border'>
              <span className='text-xs font-mono uppercase tracking-wider text-secondary font-semibold'>Section 3 • Career Goal</span>
              <h2 className='text-2xl font-display font-bold text-text'>What are you looking for?</h2>
              <p className='text-xs text-text-muted'>Select your primary motivations for career advancement.</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {lookingForOptions.map((opt) => {
                const isSelected = lookingFor.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (isSelected) setLookingFor(lookingFor.filter((i) => i !== opt.id));
                      else setLookingFor([...lookingFor, opt.id]);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected ? 'bg-secondary/10 border-secondary' : 'bg-surface hover:bg-surface-elevated border-border'}`}
                  >
                    <span className='text-xs font-semibold text-text'>{opt.label}</span>
                    {isSelected && <CheckCircle2 className='w-4 h-4 text-secondary' />}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Step 4: Target Role */}
        {step === 4 && (
          <Card variant='elevated' padding='lg' className='space-y-6 text-left'>
            <div className='space-y-1 pb-4 border-b border-border'>
              <span className='text-xs font-mono uppercase tracking-wider text-secondary font-semibold'>Section 4 • Target Next Role</span>
              <h2 className='text-2xl font-display font-bold text-text'>Where do you want to elevate to?</h2>
              <p className='text-xs text-text-muted'>Define the target title and industry environment you are aiming for.</p>
            </div>
            <div className='space-y-4'>
              <Select
                label='Target Role'
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                options={[
                  { value: 'Senior Fullstack Engineer', label: 'Senior Fullstack Engineer' },
                  { value: 'Lead Backend Engineer', label: 'Lead Backend Engineer' },
                  { value: 'Principal Software Architect', label: 'Principal Software Architect' },
                  { value: 'Staff Platform & DevOps Engineer', label: 'Staff Platform & DevOps Engineer' },
                  { value: 'AI / ML Systems Engineer', label: 'AI / ML Systems Engineer' },
                  { value: 'Engineering Manager', label: 'Engineering Manager' },
                  { value: 'Other', label: 'Other Role...' },
                ]}
              />
              {targetRole === 'Other' && (
                <Input placeholder='e.g. VP of Engineering' value={customTargetRole} onChange={(e) => setCustomTargetRole(e.target.value)} required />
              )}
              <Select
                label='Target Industry'
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                options={[
                  { value: 'Technology / SaaS', label: 'Technology / SaaS' },
                  { value: 'FinTech', label: 'FinTech & High Frequency' },
                  { value: 'AI & Robotics', label: 'AI & Robotics' },
                  { value: 'E-commerce', label: 'E-commerce Scale' },
                  { value: 'Other', label: 'Other...' },
                ]}
              />
            </div>
          </Card>
        )}

        {/* Step 5: Challenges */}
        {step === 5 && (
          <Card variant='elevated' padding='lg' className='space-y-6 text-left'>
            <div className='space-y-1 pb-4 border-b border-border'>
              <span className='text-xs font-mono uppercase tracking-wider text-secondary font-semibold'>Section 5 • Career Challenges</span>
              <h2 className='text-2xl font-display font-bold text-text'>What is currently blocking your growth?</h2>
              <p className='text-xs text-text-muted'>Select areas where you need structured guidance and practice.</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {challengeOptions.map((opt) => {
                const isSelected = careerChallenges.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (isSelected) setCareerChallenges(careerChallenges.filter((i) => i !== opt.id));
                      else setCareerChallenges([...careerChallenges, opt.id]);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected ? 'bg-secondary/10 border-secondary' : 'bg-surface hover:bg-surface-elevated border-border'}`}
                  >
                    <span className='text-xs font-semibold text-text'>{opt.label}</span>
                    {isSelected && <CheckCircle2 className='w-4 h-4 text-secondary' />}
                  </div>
                );
              })}
            </div>
            <Textarea label='Additional Details (Optional)' value={challengeDetails} onChange={(e) => setChallengeDetails(e.target.value)} placeholder='Explain any specific roadblocks or goals in detail...' rows={2} />
          </Card>
        )}

        {/* Step 6: Resume */}
        {step === 6 && (
          <div className='w-full rounded-3xl bg-[#0B1020] border border-white/[0.08] p-8 sm:p-12 shadow-2xl space-y-8 text-left relative overflow-hidden'>
            <div className='space-y-2 pb-6 border-b border-white/[0.06]'>
              <span className='text-xs font-mono uppercase tracking-widest text-blue-400 font-bold'>
                SECTION 6 • RESUME
              </span>
              <h2 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight'>
                Do you already have a resume?
              </h2>
              <p className='text-sm text-[#8D96AA]'>
                Choose your preferred starting method for resume creation and structured intelligence extraction.
              </p>
            </div>

            {/* 3 Full-Width Resume Choice Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
              
              {/* Option 1: Upload */}
              <div
                onClick={() => setResumeOption('UPLOAD')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  resumeOption === 'UPLOAD'
                    ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04]'
                }`}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className={`p-3 rounded-xl ${resumeOption === 'UPLOAD' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.05] text-[#8D96AA]'}`}>
                    <FileText className='w-6 h-6' />
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    resumeOption === 'UPLOAD' ? 'border-blue-400 bg-blue-500' : 'border-white/[0.2]'
                  }`}>
                    {resumeOption === 'UPLOAD' && <div className='w-2 h-2 rounded-full bg-white' />}
                  </div>
                </div>
                <div>
                  <h4 className='text-base font-bold text-white mb-1.5'>Upload Resume</h4>
                  <p className='text-xs text-[#8D96AA] leading-relaxed'>
                    Upload existing PDF or Doc for automated parsing.
                  </p>
                </div>
              </div>

              {/* Option 2: Build */}
              <div
                onClick={() => setResumeOption('BUILD')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  resumeOption === 'BUILD'
                    ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04]'
                }`}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className={`p-3 rounded-xl ${resumeOption === 'BUILD' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.05] text-[#8D96AA]'}`}>
                    <Sparkles className='w-6 h-6' />
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    resumeOption === 'BUILD' ? 'border-blue-400 bg-blue-500' : 'border-white/[0.2]'
                  }`}>
                    {resumeOption === 'BUILD' && <div className='w-2 h-2 rounded-full bg-white' />}
                  </div>
                </div>
                <div>
                  <h4 className='text-base font-bold text-white mb-1.5'>Build My Resume</h4>
                  <p className='text-xs text-[#8D96AA] leading-relaxed'>
                    Create a structured resume with Career Engine from scratch.
                  </p>
                </div>
              </div>

              {/* Option 3: Skip */}
              <div
                onClick={() => setResumeOption('SKIP')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  resumeOption === 'SKIP'
                    ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04]'
                }`}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className={`p-3 rounded-xl ${resumeOption === 'SKIP' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.05] text-[#8D96AA]'}`}>
                    <BookOpen className='w-6 h-6' />
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    resumeOption === 'SKIP' ? 'border-blue-400 bg-blue-500' : 'border-white/[0.2]'
                  }`}>
                    {resumeOption === 'SKIP' && <div className='w-2 h-2 rounded-full bg-white' />}
                  </div>
                </div>
                <div>
                  <h4 className='text-base font-bold text-white mb-1.5'>Skip for Now</h4>
                  <p className='text-xs text-[#8D96AA] leading-relaxed'>
                    Configure and upload your resume later from your dashboard.
                  </p>
                </div>
              </div>

            </div>

            {/* Expansive Full-Width Dropzone Area */}
            {resumeOption === 'UPLOAD' && (
              <div className='space-y-4 pt-2'>
                <label className='flex flex-col items-center justify-center min-h-[220px] w-full border-2 border-dashed border-white/[0.15] hover:border-blue-500/60 rounded-3xl cursor-pointer bg-white/[0.015] hover:bg-white/[0.035] transition-all p-8 text-center group'>
                  <div className='p-4 bg-blue-500/10 text-blue-400 rounded-2xl mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all'>
                    <Upload className='w-8 h-8' />
                  </div>
                  <span className='text-sm sm:text-base font-bold text-white mb-1'>
                    {resumeFile ? resumeFile.name : 'Click to select your PDF or DOCX resume (Max 10MB)'}
                  </span>
                  <span className='text-xs text-[#8D96AA]'>
                    {isUploadingResume ? 'Analyzing document structure with Gemini AI...' : 'Supports PDF and Word formats • Instant skill extraction'}
                  </span>
                  <input
                    type='file'
                    accept='.pdf,.docx,.doc'
                    onChange={handleResumeFileUpload}
                    className='hidden'
                    disabled={isUploadingResume}
                  />
                </label>

                {isUploadingResume && (
                  <div className='flex items-center justify-center space-x-2 text-xs font-mono text-blue-400 pt-2'>
                    <Spinner size='sm' />
                    <span>Extracting skills & experience data...</span>
                  </div>
                )}

                {uploadedResumeSummary && (
                  <div className='p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2'>
                    <CheckCircle2 className='w-4 h-4 shrink-0' />
                    <span>{uploadedResumeSummary}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className='flex items-center justify-between pt-6 w-full'>
          <button
            type='button'
            onClick={handleBack}
            disabled={step === 1 || isSaving}
            className='h-12 px-6 rounded-2xl border border-white/[0.1] hover:bg-white/[0.05] text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-40'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Back</span>
          </button>
          
          <button
            type='button'
            onClick={handleContinue}
            disabled={isSaving}
            className='h-12 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_30px_rgba(59,130,246,0.55)] transition-all flex items-center gap-2'
          >
            <span>{step === totalSteps ? 'Complete Assessment' : 'Continue'}</span>
            {step === totalSteps ? <CheckCircle2 className='w-4 h-4' /> : <ArrowRight className='w-4 h-4' />}
          </button>
        </div>
      </div>
    </div>
  );
};