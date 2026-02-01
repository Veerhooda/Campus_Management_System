
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import TimetableGrid from './components/TimetableGrid';
import { MOCK_EVENTS, TYPE_COLORS } from './constants';
import { EventType } from './types';
import { getScheduleSummary } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiAssistant = useCallback(async () => {
    setIsAiLoading(true);
    setAiSummary(null);
    try {
      const summary = await getScheduleSummary(MOCK_EVENTS);
      setAiSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex flex-col font-display">
      <Header />

      <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20">
        <div className="w-full max-w-[1200px] flex flex-col gap-6">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <a href="#" className="text-[#616f89] hover:underline">Dashboard</a>
            <span className="text-[#616f89]">/</span>
            <span className="text-[#111318]">Weekly Schedule</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#111318] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Weekly Schedule</h1>
              <p className="text-[#616f89] text-base font-normal">Oct 23 – Oct 29, 2023</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111318] hover:bg-gray-200 transition-colors text-sm font-bold gap-2">
                <span className="material-symbols-outlined text-[20px]">print</span>
                <span className="hidden sm:inline">Print</span>
              </button>
              <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white hover:bg-blue-700 transition-colors text-sm font-bold gap-2 shadow-sm shadow-blue-500/30">
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            </div>
          </div>

          {/* AI Summary Notification */}
          {aiSummary && (
            <div className="bg-white border-l-4 border-indigo-500 p-4 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-indigo-600 mt-1">smart_toy</span>
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm mb-1">AI Schedule Insights</h4>
                  <p className="text-indigo-800 text-sm leading-relaxed">{aiSummary}</p>
                </div>
                <button 
                  onClick={() => setAiSummary(null)}
                  className="ml-auto text-indigo-400 hover:text-indigo-600"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          )}

          <Toolbar 
            view={view} 
            setView={setView} 
            onAiAssistant={handleAiAssistant}
            isAiLoading={isAiLoading}
          />

          {view === 'grid' ? (
            <TimetableGrid events={MOCK_EVENTS} />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-[#f0f2f4] p-8 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">view_list</span>
              <p className="text-gray-500 font-medium">List View is under development.</p>
              <p className="text-gray-400 text-sm">Use Grid View to see your classes for the week.</p>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start mt-2">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2 text-xs font-semibold text-[#616f89]">
                <div className={`size-3 rounded-sm bg-${color}-500`}></div>
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-[#616f89] text-xs">
        <p>© 2023 Smart Campus Education Systems. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
