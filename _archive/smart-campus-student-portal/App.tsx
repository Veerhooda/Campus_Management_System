
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import MiniCalendar from './components/MiniCalendar';
import { NavItem, Notification } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItem>(NavItem.Dashboard);

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Campus Wi-Fi Maintenance',
      description: 'Regular maintenance scheduled for Saturday, 10:00 PM to 2:00 AM. Connectivity in dorms might be intermittent.',
      category: 'System',
      timeAgo: '2 hrs ago',
      icon: 'wifi',
      iconColor: 'text-primary',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: '2',
      title: 'Mid-term Results Released',
      description: 'Results for Physics 101 and Calculus II are now available on the portal. Check your grades tab.',
      category: 'Academic',
      timeAgo: '5 hrs ago',
      icon: 'grade',
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: '3',
      title: 'Annual Tech Fest Registration',
      description: 'Registration is open for Hackathons and Coding challenges. Early bird closes this Friday.',
      category: 'Events',
      timeAgo: '1 day ago',
      icon: 'celebration',
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="flex h-screen w-full">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex flex-col flex-1 h-full min-w-0">
        <Header title={activeTab} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
            
            {/* Welcome Section */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Good Morning, Alex 👋</h1>
              <p className="text-slate-500 dark:text-slate-400">Here's what's happening on campus today.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Left Main Column */}
              <div className="xl:col-span-8 flex flex-col gap-8">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard 
                    label="Overall Attendance"
                    value="87%"
                    icon="pie_chart"
                    colorClass="text-primary"
                    bgClass="bg-primary/10"
                    badge="Good Standing"
                    showProgressRing={true}
                  />
                  <StatCard 
                    label="Classes Remaining"
                    value="3"
                    icon="class"
                    colorClass="text-orange-600 dark:text-orange-400"
                    bgClass="bg-orange-50 dark:bg-orange-900/20"
                    status="Today"
                    subtext="Next: Data Structures (2:00 PM)"
                  />
                  <StatCard 
                    label="Deadlines This Week"
                    value="2"
                    icon="assignment_late"
                    colorClass="text-pink-600 dark:text-pink-400"
                    bgClass="bg-pink-50 dark:bg-pink-900/20"
                    badge="Urgent"
                    status="Urgent"
                    subtext="Physics Lab Report due tomorrow"
                  />
                </div>

                {/* Notifications / Feed Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Notifications</h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-md shadow-sm">All</button>
                      <button className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors">Academic</button>
                      <button className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors">Events</button>
                    </div>
                  </div>

                  <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.map(item => (
                        <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                          <div className="flex gap-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center ${item.iconColor}`}>
                              <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.title}</h4>
                                <span className="text-xs text-slate-400 whitespace-nowrap">{item.timeAgo}</span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{item.description}</p>
                              <div className="mt-2 flex gap-2">
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                  {item.category === 'System' ? 'System Admin' : item.category === 'Academic' ? 'Faculty' : 'Event'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                      <button className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">View All Notifications</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Column */}
              <div className="xl:col-span-4 flex flex-col gap-6">
                
                {/* Quick Actions */}
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                      <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">payments</span>
                      <span className="text-xs font-semibold">Pay Fees</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                      <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">event_busy</span>
                      <span className="text-xs font-semibold">Req. Leave</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                      <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">description</span>
                      <span className="text-xs font-semibold">Transcript</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                      <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">meeting_room</span>
                      <span className="text-xs font-semibold">Book Room</span>
                    </button>
                  </div>
                </div>

                {/* Mini Calendar */}
                <MiniCalendar />

                {/* Library Banner */}
                <div className="relative overflow-hidden rounded-xl shadow-sm group cursor-pointer bg-gradient-to-br from-primary to-blue-700">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" 
                    style={{ backgroundImage: `url('https://picsum.photos/seed/library/600/400')` }}
                  ></div>
                  <div className="relative p-6 flex flex-col items-start gap-4">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                      <span className="material-symbols-outlined">auto_stories</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Digital Library</h3>
                      <p className="text-blue-100 text-sm mt-1">Access over 50,000 resources.</p>
                    </div>
                    <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors">Browse Now</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
