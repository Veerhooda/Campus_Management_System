
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import EventsTable from './components/EventsTable';
import Calendar from './components/Calendar';
import Deadlines from './components/Deadlines';
import { CampusEvent, EventStatus, Metric, Deadline } from './types';
import { getEventIdeaSuggestions } from './services/gemini';

const MOCK_EVENTS: CampusEvent[] = [
  {
    id: '1',
    name: 'AI & Ethics Symposium',
    date: 'Oct 24, 2023',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    status: EventStatus.ACTIVE,
    imageUrl: 'https://picsum.photos/seed/ai/200/200'
  },
  {
    id: '2',
    name: 'Campus Jazz Night',
    date: 'Nov 02, 2023',
    time: '07:00 PM',
    venue: 'Student Center',
    status: EventStatus.UPCOMING,
    imageUrl: 'https://picsum.photos/seed/jazz/200/200'
  },
  {
    id: '3',
    name: 'Fall Startup Expo',
    date: 'Nov 15, 2023',
    time: '09:00 AM',
    venue: 'Innovation Hall',
    status: EventStatus.DRAFT,
    imageUrl: 'https://picsum.photos/seed/startup/200/200'
  },
  {
    id: '4',
    name: 'Chemistry Workshop',
    date: 'Nov 20, 2023',
    time: '02:00 PM',
    venue: 'Lab 304',
    status: EventStatus.UPCOMING,
    imageUrl: 'https://picsum.photos/seed/science/200/200'
  }
];

const MOCK_METRICS: Metric[] = [
  { label: 'Total Registrations', value: '1,240', trend: '+12%', icon: 'how_to_reg', colorClass: 'text-primary', bgClass: 'bg-blue-50 dark:bg-blue-900/20' },
  { label: 'Feedback Score', value: '4.8', icon: 'star', colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { label: 'Active Events', value: '8', trend: '+2', icon: 'event_available', colorClass: 'text-purple-600', bgClass: 'bg-purple-50 dark:bg-purple-900/20' },
];

const MOCK_DEADLINES: Deadline[] = [
  { id: '1', title: 'Submit Budget for Fall Fest', dueText: 'Due Today', dueColor: 'orange' },
  { id: '2', title: 'Finalize Guest List for Dean\'s Dinner', dueText: 'Due Tomorrow', dueColor: 'slate' },
  { id: '3', title: 'Confirm Catering for Jazz Night', dueText: 'Due Oct 30', dueColor: 'slate' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiSuggestions, setAiSuggestions] = useState<{title: string, description: string}[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleGenerateAiSuggestions = async () => {
    setIsLoadingAi(true);
    const eventNames = MOCK_EVENTS.map(e => e.name);
    const suggestions = await getEventIdeaSuggestions(eventNames);
    setAiSuggestions(suggestions);
    setIsLoadingAi(false);
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-[#1A202C] border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <button className="text-slate-500 hover:text-primary text-sm font-medium">Home</button>
            <span className="text-slate-400 text-sm">/</span>
            <span className="text-slate-900 dark:text-white text-sm font-semibold capitalize">{activeTab}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1A202C]"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <img 
                src="https://picsum.photos/seed/alex/32/32" 
                alt="Profile" 
                className="rounded-full size-8 border border-slate-200" 
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:block">Alex Morgan</span>
              <span className="material-symbols-outlined text-[20px] text-slate-400">expand_more</span>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
            
            {/* Hero / Page Intro */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                  Welcome back, Organizer
                </h2>
                <p className="text-slate-500 dark:text-slate-400">Here's what's happening on campus today.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleGenerateAiSuggestions}
                  disabled={isLoadingAi}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm border border-indigo-200 disabled:opacity-50"
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

            {/* AI Insights Section (Conditional) */}
            {aiSuggestions.length > 0 && (
              <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 text-indigo-700 dark:text-indigo-400">
                  <span className="material-symbols-outlined fill">auto_awesome</span>
                  <h3 className="font-bold text-lg">AI Event Suggestions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiSuggestions.map((s, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#1f2636] p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 shadow-sm">
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

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_METRICS.map((metric, idx) => (
                <StatCard key={idx} {...metric} />
              ))}
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <EventsTable events={MOCK_EVENTS} />
              
              <div className="flex flex-col gap-6">
                <Calendar />
                <Deadlines deadlines={MOCK_DEADLINES} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
