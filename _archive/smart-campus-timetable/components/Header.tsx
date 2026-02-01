
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#f0f2f4] bg-white px-4 md:px-10 py-3 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-[#111318]">
          <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
            <span className="material-symbols-outlined">school</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Smart Campus</h2>
        </div>
        
        <div className="hidden md:flex items-center relative w-64">
          <span className="material-symbols-outlined absolute left-3 text-[20px] text-[#616f89]">search</span>
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full bg-[#f0f2f4] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-[#616f89]"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 lg:gap-10">
        <nav className="hidden lg:flex items-center gap-9">
          <a href="#" className="text-[#616f89] hover:text-primary text-sm font-medium transition-colors">Dashboard</a>
          <a href="#" className="text-primary text-sm font-bold border-b-2 border-primary pb-1 mt-1">Schedule</a>
          <a href="#" className="text-[#616f89] hover:text-primary text-sm font-medium transition-colors">Courses</a>
          <a href="#" className="text-[#616f89] hover:text-primary text-sm font-medium transition-colors">Grades</a>
          <a href="#" className="text-[#616f89] hover:text-primary text-sm font-medium transition-colors">Library</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="p-2 bg-[#f0f2f4] rounded-lg text-[#111318] hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="p-2 bg-[#f0f2f4] rounded-lg text-[#111318] hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div 
            className="size-10 rounded-full border-2 border-white shadow-sm bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: 'url("https://picsum.photos/seed/student/200")' }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
