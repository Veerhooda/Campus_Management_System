
import React, { useState } from 'react';
import { User, Course } from '../types';
import Sidebar from './Sidebar';
import CampusAssistant from './CampusAssistant';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const mockCourses: Course[] = [
    { id: '1', name: 'Advanced AI & ML', code: 'CS402', time: '10:00 AM - 11:30 AM', room: 'Lab 4A', instructor: 'Dr. Sarah Chen' },
    { id: '2', name: 'Cloud Computing', code: 'CS405', time: '01:00 PM - 02:30 PM', room: 'Hall 12', instructor: 'Prof. James Miller' },
    { id: '3', name: 'Human-Computer Interaction', code: 'CS308', time: '03:00 PM - 04:30 PM', room: 'Room 202', instructor: 'Dr. Emily Wong' },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-display overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={user} isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} onLogout={onLogout} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors md:hidden"
             >
               <span className="material-symbols-outlined">menu</span>
             </button>
             <h2 className="text-xl font-bold text-slate-800 dark:text-white">Good Morning, {user.name.split(' ')[0]}!</h2>
          </div>
          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-500 hover:text-primary transition-colors relative">
               <span className="material-symbols-outlined">notifications</span>
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1e293b]"></span>
             </button>
             <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden">
               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon="calendar_today" title="Upcoming Classes" value="3 Today" color="blue" />
            <StatCard icon="assignment" title="Assignments Due" value="2 Pending" color="orange" />
            <StatCard icon="library_books" title="Library Books" value="1 Due Soon" color="green" />
            <StatCard icon="account_balance_wallet" title="Campus Wallet" value="$42.50" color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Schedule & News */}
            <div className="lg:col-span-2 space-y-8">
              {/* Today's Schedule */}
              <section className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white">Today's Schedule</h3>
                  <button className="text-sm text-primary font-medium hover:underline">View All</button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mockCourses.map((course) => (
                    <div key={course.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {course.code}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">{course.name}</p>
                          <p className="text-sm text-slate-500">{course.instructor} • {course.room}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{course.time}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Campus News */}
              <section className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white">Campus News</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NewsItem 
                    image="https://picsum.photos/seed/tech/400/250" 
                    title="New Innovation Hub Opens in Sector 4"
                    date="2 hours ago"
                  />
                  <NewsItem 
                    image="https://picsum.photos/seed/sports/400/250" 
                    title="Inter-University Sports Meet Starts Monday"
                    date="5 hours ago"
                  />
                </div>
              </section>
            </div>

            {/* Right Column: AI Assistant */}
            <div className="lg:col-span-1">
              <CampusAssistant user={user} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard: React.FC<{ icon: string; title: string; value: string; color: string }> = ({ icon, title, value, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <p className="text-xl font-bold text-slate-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

const NewsItem: React.FC<{ image: string; title: string; date: string }> = ({ image, title, date }) => (
  <div className="group cursor-pointer">
    <div className="relative h-40 rounded-xl overflow-hidden mb-3">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-bold uppercase tracking-wider text-primary">Announcement</div>
    </div>
    <h4 className="font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">{title}</h4>
    <p className="text-xs text-slate-500 mt-1">{date}</p>
  </div>
);

export default Dashboard;
