
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-[#1a2230] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <h1 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">Smart Campus</h1>
            <nav className="hidden md:flex ml-8 gap-1">
              <a className="px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="#">Dashboard</a>
              <a className="px-3 py-2 text-sm font-medium text-primary bg-primary/5 rounded-md" href="#">Attendance</a>
              <a className="px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="#">Students</a>
              <a className="px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="#">Reports</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div 
              className="h-8 w-8 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-slate-700 cursor-pointer shadow-sm hover:ring-primary transition-all" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDEy7PbLC3ymGtk0mVRnuZk1QXWe6cvrv_NCc2T4aSPk8Kpy1DkXVuPtLRN2zOMcQyPRGOquNUWiE2Ynrl8t-ZovIIR71uf1vygeffAvixcFkuK9vLSzraQkQiLor0ypOcexeyOEOwWClL02GTe_gGYPksS4SrUzHHA5HKWZj_fvmD0zTcBAfw-2MjaajXTiIstCJT9sLvzc2dbRBmA4u4l7d2nfoCLFh4o0nRkqBlTiJ938n_R_rSDimqxgihN4qzXe0c1p3sN8sEF")' }}
              title="Teacher profile"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
