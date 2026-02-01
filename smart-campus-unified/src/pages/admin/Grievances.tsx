import React, { useState, useMemo } from 'react';

enum TicketStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

interface Ticket {
  id: string;
  category: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  date: string;
  assignee?: { name: string; avatarUrl: string };
}

const MOCK_TICKETS: Ticket[] = [
  { id: '#GRV-1024', category: 'Infrastructure', subject: 'Water leakage in Science Block', description: 'Persistent water leak from ceiling near Room 204', priority: TicketPriority.HIGH, status: TicketStatus.IN_PROGRESS, date: 'Oct 25, 2023', assignee: { name: 'Mike R.', avatarUrl: 'https://picsum.photos/seed/mike/100' } },
  { id: '#GRV-1023', category: 'IT Services', subject: 'Wi-Fi connectivity issues in Library', description: 'Students unable to connect to campus network in library wing B', priority: TicketPriority.CRITICAL, status: TicketStatus.NEW, date: 'Oct 24, 2023' },
  { id: '#GRV-1022', category: 'Housekeeping', subject: 'AC not working in Admin Office', description: 'Air conditioning unit stopped working completely', priority: TicketPriority.MEDIUM, status: TicketStatus.RESOLVED, date: 'Oct 23, 2023', assignee: { name: 'Sarah K.', avatarUrl: 'https://picsum.photos/seed/sarah/100' } },
  { id: '#GRV-1021', category: 'Security', subject: 'Broken lock on Main Gate', description: 'Electronic lock mechanism is malfunctioning', priority: TicketPriority.HIGH, status: TicketStatus.NEW, date: 'Oct 23, 2023' },
];

const GrievanceManagement: React.FC = () => {
  const [tickets, _setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');

  const stats = useMemo(() => ({
    totalOpen: tickets.filter(t => t.status !== TicketStatus.RESOLVED).length,
    highPriority: tickets.filter(t => t.priority === TicketPriority.HIGH || t.priority === TicketPriority.CRITICAL).length,
    unassigned: tickets.filter(t => !t.assignee).length,
    resolvedToday: tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
  }), [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.CRITICAL: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case TicketPriority.HIGH: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case TicketPriority.MEDIUM: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.NEW: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case TicketStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case TicketStatus.RESOLVED: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
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
          { label: 'Resolved Today', value: stats.resolvedToday, icon: 'check_circle', color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
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
          onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'All')}
          className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="All">All Statuses</option>
          {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-primary font-medium text-sm cursor-pointer hover:underline">{ticket.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{ticket.subject}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{ticket.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {ticket.assignee ? (
                      <div className="flex items-center gap-2">
                        <img src={ticket.assignee.avatarUrl} className="w-6 h-6 rounded-full" alt={ticket.assignee.name} />
                        <span className="text-sm text-slate-700 dark:text-slate-200">{ticket.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{ticket.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GrievanceManagement;
