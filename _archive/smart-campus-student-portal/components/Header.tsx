
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-1 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block">{title}</h2>
      </div>
      
      <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
        <div className="hidden md:flex relative w-full max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
          <input 
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary text-slate-800 dark:text-slate-200 placeholder-slate-400" 
            placeholder="Search courses, assignments..." 
            type="text"
          />
        </div>
        
        <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">Alex Morgan</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Computer Science</p>
          </div>
          <div 
            className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden bg-cover bg-center" 
            style={{ backgroundImage: `url('https://picsum.photos/seed/alex/200/200')` }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
