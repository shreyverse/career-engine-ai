import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coachApi } from '../services/coachApi';
import { roadmapApi } from '../services/roadmapApi';
import { WeeklyPlan, WeeklyPlanTask } from '../types/coach.types';
import {
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  Calendar,
  Layers,
  Route,
  AlertCircle,
  Check,
} from 'lucide-react';

export const WeeklyPlanPage: React.FC = () => {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await coachApi.getWeeklyPlan();
      setPlan(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load weekly plan.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (task: WeeklyPlanTask) => {
    if (updatingTaskId) return;
    setUpdatingTaskId(task.taskId);
    try {
      await roadmapApi.updateTask(task.taskId, !task.completed);
      await loadPlan();
    } catch (err: any) {
      setError(err.message || 'Failed to update task.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Extracting weekly sprint tasks from roadmap...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>Personalized Learning Sprint</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            This Week Focus Plan
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Actionable sprint milestones derived directly from your active career roadmap phase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/coach"
            className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
          >
            Ask Career Coach
          </Link>
          <Link
            to="/career-path"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-colors"
          >
            View Full Roadmap
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {plan && plan.tasks.length > 0 ? (
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  Active Phase: {plan.activePhaseTitle}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {plan.completedTasks} of {plan.totalTasks} Sprint Tasks Completed
                </h3>
              </div>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {plan.progressPercentage}%
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: plan.progressPercentage + '%' }}
              />
            </div>
          </div>

          {/* Task Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Active Weekly Tasks
            </h4>

            {plan.tasks.map((task) => (
              <div
                key={task.taskId}
                onClick={() => toggleTaskCompletion(task)}
                className={
                  'p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ' +
                  (task.completed
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-80'
                    : 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/50 shadow-md')
                }
              >
                <button
                  className={
                    'w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 shrink-0 transition-all ' +
                    (task.completed
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-600 hover:border-emerald-400')
                  }
                >
                  {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h5
                      className={
                        'text-sm font-bold ' +
                        (task.completed ? 'line-through text-slate-400' : 'text-white')
                      }
                    >
                      {task.title}
                    </h5>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          'text-[9px] px-2 py-0.5 rounded font-bold uppercase ' +
                          (task.priority === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30')
                        }
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{task.estimatedTime}</span>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>
                  )}

                  {task.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {task.skills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <Clock className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Active Roadmap Tasks</h3>
          <p className="text-xs text-slate-400">
            Generate your personalized career roadmap to automatically derive a weekly learning plan.
          </p>
          <Link
            to="/career-path"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors"
          >
            <span>Generate Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
