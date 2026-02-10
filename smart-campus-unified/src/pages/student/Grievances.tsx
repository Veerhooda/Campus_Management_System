import React, { useState, useEffect } from 'react';
import { grievanceService } from '../../services';
import { Grievance } from '../../types';

const CATEGORIES = ['Academic', 'Infrastructure', 'Hostel', 'Transport', 'Faculty', 'Administrative', 'Other'];

const STATUS_COLORS: Record<string, string> = {
  'OPEN': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'IN_PROGRESS': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'RESOLVED': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'CLOSED': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const STATUS_ICONS: Record<string, string> = {
  'OPEN': 'radio_button_unchecked',
  'IN_PROGRESS': 'pending',
  'RESOLVED': 'check_circle',
  'CLOSED': 'cancel',
};

const StudentGrievances: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const result = await grievanceService.getMyGrievances(1, 50);
      setGrievances(result.data || []);
    } catch (err) {
      console.error('Failed to fetch grievances:', err);
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGrievances(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await grievanceService.createGrievance({ title, description, category });
      setSuccess('Grievance submitted successfully!');
      setShowForm(false);
      setTitle('');
      setDescription('');
      setCategory('Academic');
      setTimeout(() => setSuccess(''), 4000);
      fetchGrievances();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit grievance');
    } finally {
      setSubmitting(false);
    }
  };

  const statusCounts = {
    total: grievances.length,
    open: grievances.filter(g => g.status === 'OPEN').length,
    inProgress: grievances.filter(g => g.status === 'IN_PROGRESS').length,
    resolved: grievances.filter(g => g.status === 'RESOLVED' || g.status === 'CLOSED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">support_agent</span>
            My Grievances
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Submit and track your complaints & feedback</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Cancel' : 'New Grievance'}
        </button>
      </div>

      {/* Success / Error */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2 text-green-700 dark:text-green-400">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: statusCounts.total, icon: 'assignment', color: 'text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400' },
          { label: 'Open', value: statusCounts.open, icon: 'radio_button_unchecked', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
          { label: 'In Progress', value: statusCounts.inProgress, icon: 'pending', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400' },
          { label: 'Resolved', value: statusCounts.resolved, icon: 'check_circle', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4 border border-slate-100 dark:border-slate-800`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Submit Form */}
      {showForm && (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit New Grievance</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">{error}</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your concern"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description *</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                placeholder="Explain the issue in detail..."
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              />
            </div>
            <button type="submit" disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">{submitting ? 'hourglass_top' : 'send'}</span>
              {submitting ? 'Submitting...' : 'Submit Grievance'}
            </button>
          </form>
        </div>
      )}

      {/* Grievance List */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Tickets</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full mx-auto" />
            <p className="text-slate-500 mt-3 text-sm">Loading grievances...</p>
          </div>
        ) : grievances.length === 0 ? (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">inbox</span>
            <p className="text-slate-500 dark:text-slate-400 mt-2">No grievances submitted yet</p>
            <p className="text-xs text-slate-400 mt-1">Click "New Grievance" to submit your first one</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {grievances.map((g) => (
              <div key={g.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`material-symbols-outlined text-[18px] ${STATUS_COLORS[g.status]?.split(' ')[1] || 'text-slate-500'}`}>
                        {STATUS_ICONS[g.status] || 'help'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{g.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{g.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400">
                        {new Date(g.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium">{g.category}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[g.status] || ''}`}>
                    {g.status.replace('_', ' ')}
                  </span>
                </div>
                {g.resolution && (
                  <div className="mt-3 pl-6 border-l-2 border-green-300 dark:border-green-700">
                    <p className="text-xs font-medium text-green-700 dark:text-green-400">Resolution:</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{g.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentGrievances;
