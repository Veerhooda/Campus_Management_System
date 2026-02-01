
import React from 'react';

interface ToolbarProps {
  view: 'grid' | 'list';
  setView: (view: 'grid' | 'list') => void;
  onAiAssistant: () => void;
  isAiLoading: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ view, setView, onAiAssistant, isAiLoading }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-2 rounded-xl shadow-sm border border-[#f0f2f4]">
      <div className="flex items-center gap-2">
        <button className="p-2 text-[#111318] hover:bg-gray-100 rounded-lg transition-colors">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 text-[#111318] hover:bg-gray-100 rounded-lg transition-colors font-medium">
          <span className="material-symbols-outlined">calendar_month</span>
          <span>October 2023</span>
        </button>
        <button className="p-2 text-[#111318] hover:bg-gray-100 rounded-lg transition-colors">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
        <button className="ml-2 flex items-center justify-center rounded-lg h-9 bg-gray-100 text-[#111318] hover:bg-gray-200 px-3 text-sm font-semibold transition-colors">
          Today
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onAiAssistant}
          disabled={isAiLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm font-bold transition-all border border-indigo-200 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">{isAiLoading ? 'sync' : 'smart_toy'}</span>
          {isAiLoading ? 'Analyzing...' : 'AI Insights'}
        </button>

        <div className="flex bg-[#f0f2f4] p-1 rounded-lg">
          <button 
            onClick={() => setView('grid')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
              view === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-[#616f89] hover:text-[#111318]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            Grid
          </button>
          <button 
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${
              view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-[#616f89] hover:text-[#111318]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">view_list</span>
            List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
