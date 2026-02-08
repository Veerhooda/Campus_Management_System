import React, { useState, useEffect } from 'react';
import StatCard from '../../components/shared/StatCard';
import { eventService } from '../../services';
import { CampusEvent } from '../../types';

interface Deadline {
  id: string;
  title: string;
  dueText: string;
  dueColor: string;
}

const MOCK_DEADLINES: Deadline[] = [
  { id: '1', title: 'Submit Budget for Fall Fest', dueText: 'Due Today', dueColor: 'orange' },
  { id: '2', title: 'Finalize Guest List for Dean\'s Dinner', dueText: 'Due Tomorrow', dueColor: 'slate' },
  { id: '3', title: 'Confirm Catering for Jazz Night', dueText: 'Due Oct 30', dueColor: 'slate' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'DRAFT': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'COMPLETED': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'Active';
    case 'DRAFT': return 'Draft';
    case 'CANCELLED': return 'Cancelled';
    case 'COMPLETED': return 'Completed';
    default: return status;
  }
};

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<{title: string; description: string}[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEvents(1, 20);
        setEvents(data.data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleGenerateAiSuggestions = async () => {
    setIsLoadingAi(true);
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAiSuggestions([
      { title: 'Wellness Week', description: 'A week-long series of activities focusing on mental and physical health awareness for students.' },
      { title: 'International Food Festival', description: 'Celebrate diversity with cuisines from around the world, featuring student clubs and local vendors.' },
      { title: 'Tech Innovation Day', description: 'Showcase student projects and invite industry speakers to share insights on emerging technologies.' },
    ]);
    setIsLoadingAi(false);
  };

  // Mini Calendar Component
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const eventDays = events.map(e => new Date(e.startDateTime).getDate());

  // Stats
  const activeEvents = events.filter(e => e.status === 'PUBLISHED').length;
  const totalRegistrations = events.reduce((acc) => acc + (Math.floor(Math.random() * 100) + 50), 0); // Placeholder

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Organizer Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage events and registrations.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateAiSuggestions}
            disabled={isLoadingAi}
            className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 transition-all px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm border border-indigo-200 dark:border-indigo-800 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[20px] ${isLoadingAi ? 'animate-spin' : ''}`}>
              {isLoadingAi ? 'autorenew' : 'psychology'}
            </span>
            {isLoadingAi ? 'Thinking...' : 'AI Suggestions'}
          </button>
          <button className="bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create New Event
          </button>
        </div>
      </div>

      {/* AI Suggestions Section */}
      {aiSuggestions.length > 0 && (
        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-indigo-700 dark:text-indigo-400">
            <span className="material-symbols-outlined filled">auto_awesome</span>
            <h3 className="font-bold text-lg">AI Event Suggestions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiSuggestions.map((s, idx) => (
              <div key={idx} className="bg-white dark:bg-surface-dark p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{s.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{s.description}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setAiSuggestions([])}
            className="mt-4 text-xs text-indigo-600 font-medium hover:underline"
          >
            Dismiss Suggestions
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Registrations" value={loading ? '...' : totalRegistrations.toString()} trend="+12%" icon="how_to_reg" colorClass="text-primary" bgClass="bg-primary/10" />
        <StatCard label="Feedback Score" value="4.8" icon="star" colorClass="text-yellow-600" bgClass="bg-yellow-50 dark:bg-yellow-900/20" />
        <StatCard label="Active Events" value={loading ? '...' : activeEvents.toString()} trend="+2" icon="event_available" colorClass="text-purple-600" bgClass="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Events Table */}
        <div className="xl:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Events</h3>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">event</span>
              <p className="text-slate-500 dark:text-slate-400">No events yet. Create your first event!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3 text-left">Event</th>
                    <th className="px-5 py-3 text-left">Date & Time</th>
                    <th className="px-5 py-3 text-left">Venue</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {events.slice(0, 5).map(event => (
                    <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{event.title}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {new Date(event.startDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(event.startDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{event.venue || 'TBD'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Calendar */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
              {days.map(day => (
                <div 
                  key={day} 
                  className={`py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                    day === currentDate.getDate() 
                      ? 'bg-primary text-white font-bold' 
                      : eventDays.includes(day) 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Deadlines */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_DEADLINES.map(deadline => (
                <div key={deadline.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{deadline.title}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    deadline.dueColor === 'orange' 
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {deadline.dueText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
