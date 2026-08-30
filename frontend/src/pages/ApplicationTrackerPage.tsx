import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsApi } from '../services/jobsApi';
import { JobApplicationRecord, ApplicationStatus } from '../types/jobs.types';
import {
  TrendingUp,
  Plus,
  Trash2,
  Building2,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

const COLUMNS: { id: ApplicationStatus; label: string; color: string }[] = [
  { id: 'SAVED', label: 'Saved', color: 'border-slate-700 bg-slate-900/40' },
  { id: 'INTERESTED', label: 'Interested', color: 'border-blue-500/30 bg-blue-950/10' },
  { id: 'APPLIED', label: 'Applied', color: 'border-amber-500/30 bg-amber-950/10' },
  { id: 'INTERVIEW', label: 'Interview', color: 'border-purple-500/30 bg-purple-950/10' },
  { id: 'OFFER', label: 'Offer', color: 'border-emerald-500/30 bg-emerald-950/10' },
  { id: 'REJECTED', label: 'Archived', color: 'border-slate-800 bg-slate-950/40' },
];

export const ApplicationTrackerPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCompany, setNewCompany] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('Remote');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await jobsApi.getApplications();
      setApplications(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      await jobsApi.updateApplication(appId, { status: newStatus });
      setApplications((curr) =>
        curr.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update application status.');
    }
  };

  const handleDelete = async (appId: string) => {
    if (!window.confirm('Remove this application?')) return;
    try {
      await jobsApi.deleteApplication(appId);
      setApplications((curr) => curr.filter((a) => a.id !== appId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete application.');
    }
  };

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;
    try {
      const created = await jobsApi.createApplication({
        jobId: 'manual-' + Date.now(),
        jobTitle: newTitle.trim(),
        company: newCompany.trim(),
        location: newLocation.trim(),
        status: 'APPLIED',
      });
      setApplications((curr) => [created, ...curr]);
      setShowAddModal(false);
      setNewTitle('');
      setNewCompany('');
    } catch (err: any) {
      alert(err.message || 'Failed to create application.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Opportunity Pipeline</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Job Application Tracker
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Organize your job search pipeline manually across application, interview, and offer milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-6">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);
          return (
            <div
              key={col.id}
              className={`p-4 rounded-2xl border ${col.color} space-y-3 min-h-[450px] flex flex-col`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  {col.label}
                </span>
                <span className="text-[11px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900">
                  {colApps.length}
                </span>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2 text-xs shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white leading-tight">{app.jobTitle}</h4>
                        <span className="text-[11px] text-emerald-400 font-medium block mt-0.5">
                          {app.company}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {app.location}
                    </div>

                    {/* Status Mover Dropdown */}
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className="w-full bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded-lg p-1.5 focus:outline-none"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>
                          Move to: {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add Application Record</h3>
            <form onSubmit={handleAddApplication} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Remote / New York"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
