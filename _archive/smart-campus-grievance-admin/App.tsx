
import React, { useState, useMemo, useEffect } from 'react';
import { StatsCard } from './components/StatsCard';
import { CreateTicketModal } from './components/CreateTicketModal';
import { MOCK_TICKETS, CATEGORIES } from './constants';
import { Ticket, TicketStatus, TicketPriority, Category } from './types';
import { analyzeTicketsWithAI } from './services/gemini';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'All'>('All');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Derived stats
  const stats = useMemo(() => ({
    totalOpen: tickets.filter(t => t.status !== TicketStatus.RESOLVED).length,
    highPriority: tickets.filter(t => t.priority === TicketPriority.HIGH || t.priority === TicketPriority.CRITICAL).length,
    unassigned: tickets.filter(t => !t.assignee).length,
    resolvedToday: tickets.filter(t => t.status === TicketStatus.RESOLVED).length,
  }), [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  const handleCreateTicket = (data: any) => {
    const newTicket: Ticket = {
      id: `#GRV-${1025 + tickets.length}`,
      category: data.category,
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      status: TicketStatus.NEW,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
  };

  const handleAIInsight = async () => {
    setIsAnalyzing(true);
    const result = await analyzeTicketsWithAI(tickets);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    const styles = {
      [TicketPriority.LOW]: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600',
      [TicketPriority.MEDIUM]: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/30',
      [TicketPriority.HIGH]: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30',
      [TicketPriority.CRITICAL]: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/30',
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status: TicketStatus) => {
    const styles = {
      [TicketStatus.NEW]: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-blue-700/10 dark:ring-blue-400/20',
      [TicketStatus.IN_PROGRESS]: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 ring-yellow-600/20 dark:ring-yellow-400/20',
      [TicketStatus.RESOLVED]: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-green-600/20 dark:ring-green-400/20',
    };
    const dotColors = {
      [TicketStatus.NEW]: 'bg-blue-600 dark:bg-blue-400',
      [TicketStatus.IN_PROGRESS]: 'bg-yellow-600 dark:bg-yellow-400',
      [TicketStatus.RESOLVED]: 'bg-green-600 dark:bg-green-400',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status]}`}></span>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e5e7eb] dark:border-b-gray-800 bg-white dark:bg-[#1e293b] px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
            <span className="material-symbols-outlined !text-[24px]">school</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Smart Campus Admin</h2>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <div className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg ring-1 ring-[#e5e7eb] dark:ring-gray-700 focus-within:ring-2 focus-within:ring-primary transition-all overflow-hidden bg-white dark:bg-gray-800">
              <div className="text-[#616f89] dark:text-gray-400 flex items-center justify-center pl-3">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input 
                className="flex-1 border-none focus:ring-0 text-sm bg-transparent placeholder:text-[#616f89]" 
                placeholder="Search tickets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#616f89] hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-px h-8 bg-[#e5e7eb] dark:bg-gray-700 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="size-9 rounded-full border border-gray-200 dark:border-gray-700 bg-[url('https://picsum.photos/seed/admin/100/100')] bg-cover"></div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold leading-none">Admin User</span>
                <span className="text-xs text-[#616f89] mt-1">Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-10 py-8 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.033em]">Grievance Management</h1>
            <p className="text-[#616f89] dark:text-gray-400">Monitor, assign, and resolve campus maintenance requests.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleAIInsight}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-sm font-bold hover:bg-emerald-100 transition-colors"
            >
              <span className="material-symbols-outlined !text-[20px]">{isAnalyzing ? 'sync' : 'smart_toy'}</span>
              <span>{isAnalyzing ? 'Analyzing...' : 'AI Insights'}</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined !text-[20px]">add</span>
              <span>Create Ticket</span>
            </button>
          </div>
        </div>

        {/* AI Insight Box */}
        {aiAnalysis && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl flex gap-4 items-start animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">auto_awesome</span>
             </div>
             <div className="flex-1">
               <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">AI Grievance Analysis</h4>
               <p className="text-sm text-blue-700 dark:text-blue-400">{aiAnalysis}</p>
             </div>
             <button onClick={() => setAiAnalysis(null)} className="text-blue-400 hover:text-blue-600">
               <span className="material-symbols-outlined">close</span>
             </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Open" value={stats.totalOpen} trend={2} icon="inbox" />
          <StatsCard label="High Priority" value={stats.highPriority} trend={5} icon="priority_high" />
          <StatsCard label="Unassigned" value={stats.unassigned} trend={-10} icon="person_off" />
          <StatsCard label="Resolved Today" value={stats.resolvedToday} trend={15} icon="check_circle" />
        </div>

        {/* Table & Filters */}
        <div className="flex flex-col rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-[#e5e7eb] dark:border-gray-700">
            <div className="flex gap-2 flex-wrap">
              <select 
                className="h-9 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none text-sm font-medium focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All">All Statuses</option>
                {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select 
                className="h-9 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none text-sm font-medium focus:ring-primary"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
              >
                <option value="All">All Priorities</option>
                {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex h-9 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] dark:border-gray-700 px-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
                <span>More Filters</span>
              </button>
              <button 
                onClick={() => setTickets(MOCK_TICKETS)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e7eb] dark:border-gray-700 text-[#616f89] hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-[#e5e7eb] dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-semibold text-[#616f89] uppercase tracking-wider w-32">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#616f89] uppercase tracking-wider w-40">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#616f89] uppercase tracking-wider min-w-[200px]">Subject</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#616f89] uppercase tracking-wider w-32">Priority</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#616f89] uppercase tracking-wider w-32">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#616f89] uppercase tracking-wider w-48">Assignee</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#616f89] uppercase tracking-wider w-32">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#616f89] uppercase tracking-wider text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] dark:divide-gray-700">
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-primary hover:underline text-sm font-medium cursor-pointer">{ticket.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">{ticket.category}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium truncate max-w-[250px]">{ticket.subject}</p>
                      <p className="text-[#616f89] text-xs truncate max-w-[250px]">{ticket.description}</p>
                    </td>
                    <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                    <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {ticket.assignee ? (
                          <>
                            <div className="size-8 rounded-full bg-cover" style={{backgroundImage: `url(${ticket.assignee.avatarUrl})`}}></div>
                            <span className="text-sm">{ticket.assignee.name}</span>
                          </>
                        ) : (
                          <>
                            <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[#616f89]">
                              <span className="material-symbols-outlined !text-[18px]">person</span>
                            </div>
                            <span className="text-[#616f89] text-sm italic">Unassigned</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#616f89]">{ticket.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#616f89] hover:text-primary transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#616f89]">
                      <span className="material-symbols-outlined !text-[48px] block mb-2">search_off</span>
                      No tickets match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] px-4 py-3 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="px-4 py-2 border rounded-md text-sm font-medium">Previous</button>
              <button className="px-4 py-2 border rounded-md text-sm font-medium">Next</button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-sm text-[#616f89]">
                Showing <span className="font-medium text-black dark:text-white">1</span> to <span className="font-medium text-black dark:text-white">{filteredTickets.length}</span> of <span className="font-medium text-black dark:text-white">{tickets.length}</span> results
              </p>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20">1</button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">2</button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">3</button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <CreateTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateTicket} 
      />
    </div>
  );
};

export default App;
