import React, { useState, useMemo, useEffect } from 'react';
import { grievanceService } from '../../services';
import { Grievance } from '../../types';

type TicketStatus = 'All' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

const GrievanceManagement: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus>('All');

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        setLoading(true);
        const data = await grievanceService.getGrievances(1, 100);
        setGrievances(data.data);
      } catch (err) {
        console.error('Failed to load grievances:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  const stats = useMemo(() => ({
    totalOpen: grievances.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length,
    highPriority: grievances.filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL').length,
    unassigned: grievances.filter(t => !t.assignedToId).length,
    resolved: grievances.filter(t => t.status === 'RESOLVED').length,
  }), [grievances]);

  const filteredGrievances = useMemo(() => {
    return grievances.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [grievances, searchQuery, statusFilter]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'HIGH': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'RESOLVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'CLOSED': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN': return 'New';
      case 'IN_PROGRESS': return 'In Progress';
      case 'RESOLVED': return 'Resolved';
      case 'CLOSED': return 'Closed';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Grievance Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor, assign, and resolve campus maintenance requests.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Open', value: stats.totalOpen, icon: 'inbox', color: 'text-primary' },
          { label: 'High Priority', value: stats.highPriority, icon: 'priority_high', color: 'text-red-600' },
          { label: 'Unassigned', value: stats.unassigned, icon: 'person_off', color: 'text-orange-600' },
          { label: 'Resolved', value: stats.resolved, icon: 'check_circle', color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{loading ? '...' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Search tickets..."
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TicketStatus)}
          className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="All">All Statuses</option>
          <option value="OPEN">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">inbox</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Grievances Found</h3>
            <p className="text-slate-500 dark:text-slate-400">No tickets match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted By</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredGrievances.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-primary font-medium text-sm cursor-pointer hover:underline">
                        #{ticket.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{ticket.title}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">{ticket.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(ticket.priority || 'LOW')}`}>
                        {ticket.priority || 'LOW'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.submittedBy ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {ticket.submittedBy.firstName?.[0]}{ticket.submittedBy.lastName?.[0]}
                          </div>
                          <span className="text-sm text-slate-700 dark:text-slate-200">
                            {ticket.submittedBy.firstName} {ticket.submittedBy.lastName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrievanceManagement;
