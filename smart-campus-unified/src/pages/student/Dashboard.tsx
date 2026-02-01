import React from 'react';
import StatCard from '../../components/shared/StatCard';
import { useAuth } from '../../context/AuthContext';

// Mock notification data
const notifications = [
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

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] || 'Student';

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Good Morning, {firstName} 👋
        </h1>
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

            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
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
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: 'payments', label: 'Pay Fees' },
                { icon: 'event_busy', label: 'Req. Leave' },
                { icon: 'description', label: 'Transcript' },
                { icon: 'meeting_room', label: 'Book Room' },
              ].map((action) => (
                <button 
                  key={action.label}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                >
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">{action.icon}</span>
                  <span className="text-xs font-semibold">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {[
                { time: '9:00 AM', subject: 'Data Structures', room: 'Room 301', status: 'Completed' },
                { time: '11:00 AM', subject: 'Database Systems', room: 'Lab 201', status: 'Ongoing' },
                { time: '2:00 PM', subject: 'Computer Networks', room: 'Room 405', status: 'Upcoming' },
              ].map((cls, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${
                  cls.status === 'Ongoing' ? 'bg-primary/5 border border-primary/20' : 'bg-slate-50 dark:bg-slate-800'
                }`}>
                  <div className={`w-1 h-10 rounded-full ${
                    cls.status === 'Completed' ? 'bg-green-500' : 
                    cls.status === 'Ongoing' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{cls.subject}</p>
                    <p className="text-xs text-slate-500">{cls.time} • {cls.room}</p>
                  </div>
                  {cls.status === 'Ongoing' && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">LIVE</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Library Banner */}
          <div className="relative overflow-hidden rounded-xl shadow-sm group cursor-pointer bg-gradient-to-br from-primary to-blue-700">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600')` }}
            />
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
  );
};

export default StudentDashboard;
