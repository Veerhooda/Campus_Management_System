
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onThemeToggle: () => void;
  isDark: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onThemeToggle, isDark }) => {
  return (
    <header className="flex shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111318] px-4 md:px-10 py-3 z-20">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-[#111318] dark:text-white">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">Campus OS</h2>
        </div>
        <nav className="hidden md:flex items-center gap-9">
          <a className="text-[#616f89] dark:text-gray-400 hover:text-primary text-sm font-medium transition-colors" href="#">Dashboard</a>
          <a className="text-[#616f89] dark:text-gray-400 hover:text-primary text-sm font-medium transition-colors" href="#">Courses</a>
          <a className="text-[#616f89] dark:text-gray-400 hover:text-primary text-sm font-medium transition-colors" href="#">Calendar</a>
          <a className="text-primary text-sm font-bold transition-colors" href="#">Notifications</a>
        </nav>
      </div>
      
      <div className="flex flex-1 justify-end gap-3 md:gap-6 items-center">
        <div className="hidden lg:flex items-stretch rounded-lg h-10 bg-[#f0f2f4] dark:bg-gray-800 max-w-64 w-full">
          <div className="text-[#616f89] dark:text-gray-400 flex items-center justify-center pl-4">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input 
            className="w-full bg-transparent border-none focus:ring-0 text-[#111318] dark:text-white placeholder:text-[#616f89] dark:placeholder:text-gray-500 text-sm" 
            placeholder="Search notifications..." 
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onThemeToggle}
            className="flex items-center justify-center rounded-lg size-10 bg-[#f0f2f4] dark:bg-gray-800 text-[#111318] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button className="relative flex items-center justify-center rounded-lg size-10 bg-[#f0f2f4] dark:bg-gray-800 text-[#111318] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <div className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></div>
          </button>
        </div>
        
        <div 
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200 dark:border-gray-700 cursor-pointer" 
          style={{ backgroundImage: `url("${user.avatar}")` }}
        />
      </div>
    </header>
  );
};

export default Header;
