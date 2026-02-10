import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services';
import { MaintenanceTicket } from '../../types';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

const STATUS_COLORS: Record<string, string> = {
  'OPEN': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'IN_PROGRESS': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'RESOLVED': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'CLOSED': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const PRIORITY_COLORS: Record<string, string> = {
  'Low': 'text-green-600',
  'Medium': 'text-amber-600',
  'High': 'text-orange-600',
  'Critical': 'text-red-600',
};

const MaintenanceRequests: React.FC = () => {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const result = await maintenanceService.getMyTickets(1, 50);
      setTickets(result.data || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await maintenanceService.create({ title, description, location: location || undefined, priority });
      setSuccess('Maintenance request submitted successfully!');
      setShowForm(false);
      setTitle('');
      setDescription('');
      setLocation('');
      setPriority('Medium');
      setTimeout(() => setSuccess(''), 4000);
      fetchTickets();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">build</span>
            Maintenance & Room Requests
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Report facility issues or request room maintenance</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Cancel' : 'New Request'}
        </button>
      </div>

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2 text-green-700 dark:text-green-400">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {/* Submit Form */}
      {showForm && (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit Maintenance Request</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">{error}</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken chair in room 301"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Building A, Room 301"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description *</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
              <div className="flex gap-3">
                {PRIORITY_OPTIONS.map((p) => (
                  <button type="button" key={p}
                    onClick={() => setPriority(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      priority === p
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">{submitting ? 'hourglass_top' : 'send'}</span>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Requests</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full mx-auto" />
            <p className="text-slate-500 mt-3 text-sm">Loading requests...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">handyman</span>
            <p className="text-slate-500 dark:text-slate-400 mt-2">No maintenance requests yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ticket.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {ticket.location && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {ticket.location}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {ticket.priority && (
                        <span className={`text-xs font-medium ${PRIORITY_COLORS[ticket.priority] || 'text-slate-500'}`}>
                          {ticket.priority} priority
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[ticket.status] || ''}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                {ticket.resolution && (
                  <div className="mt-3 pl-4 border-l-2 border-green-300 dark:border-green-700">
                    <p className="text-xs font-medium text-green-700 dark:text-green-400">Resolution:</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{ticket.resolution}</p>
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

export default MaintenanceRequests;
