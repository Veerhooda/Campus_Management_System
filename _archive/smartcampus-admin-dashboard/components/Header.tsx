
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-surface-light border-b border-border-light shrink-0 transition-colors sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-text-sub-light hover:bg-gray-100 p-2 rounded-lg">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-bold text-text-main-light">Dashboard Overview</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub-light material-symbols-outlined text-[20px]">search</span>
          <input 
            className="pl-10 pr-4 py-2 w-64 bg-background-light border-none rounded-lg text-sm text-text-main-light placeholder-text-sub-light focus:ring-1 focus:ring-primary transition-all"
            placeholder="Search students, staff..." 
            type="text"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-text-sub-light hover:bg-gray-100 rounded-lg transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-light"></span>
          </button>
          <button className="p-2 text-text-sub-light hover:bg-gray-100 rounded-lg transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
