import React from 'react';
import StatCard from '../../components/shared/StatCard';
import { useAuth } from '../../context/AuthContext';

// Mock data for faculty schedule
const todaySchedule = [
  { id: '1', time: '9:00 AM', course: 'CS101 - Intro to Programming', room: 'Room 201', type: 'Lecture', students: 45 },
  { id: '2', time: '11:00 AM', course: 'CS305 - Data Structures', room: 'Lab 102', type: 'Lab', students: 30 },
  { id: '3', time: '2:00 PM', course: 'CS401 - Machine Learning', room: 'Room 305', type: 'Lecture', students: 28 },
];

const needsGrading = [
  { id: '1', title: 'CS101 Quiz 3', submissions: 42, due: 'Due Today', urgent: true },
  { id: '2', title: 'CS305 Assignment 2', submissions: 28, due: 'Due Tomorrow', urgent: false },
  { id: '3', title: 'CS401 Midterm', submissions: 26, due: 'Due Oct 28', urgent: false },
];

const immediateActions = [
  { icon: 'post_add', label: 'Create Assignment', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
  { icon: 'checklist', label: 'Mark Attendance', color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
  { icon: 'event', label: 'Office Hours', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
  { icon: 'forum', label: 'Announcements', color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
];

const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.name || 'Professor';

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome, {userName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your teaching schedule and pending tasks.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            View Full Schedule
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Assignment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Today's Classes"
          value="3"
          icon="class"
          colorClass="text-primary"
          bgClass="bg-primary/10"
          subtext="Next: CS305 at 11:00 AM"
        />
        <StatCard 
          label="Pending Submissions"
          value="96"
          icon="assignment"
          colorClass="text-orange-600 dark:text-orange-400"
          bgClass="bg-orange-50 dark:bg-orange-900/20"
          trend="+12 new"
        />
        <StatCard 
          label="Avg. Attendance"
          value="91%"
          icon="groups"
          colorClass="text-green-600 dark:text-green-400"
          bgClass="bg-green-50 dark:bg-green-900/20"
          showProgressRing={true}
        />
        <StatCard 
          label="Office Hours"
          value="2 hrs"
          icon="schedule"
          colorClass="text-purple-600 dark:text-purple-400"
          bgClass="bg-purple-50 dark:bg-purple-900/20"
          subtext="Today: 4:00 PM - 6:00 PM"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="xl:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Schedule</h3>
            <span className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {todaySchedule.map((item, idx) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-4">
                <div className={`w-1 h-12 rounded-full ${idx === 1 ? 'bg-primary' : idx === 0 ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.course}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.type === 'Lab' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>{item.type}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{item.time} • {item.room} • {item.students} students</p>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[16px]">checklist</span>
                  Attendance
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {immediateActions.map((action) => (
                <button 
                  key={action.label}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl ${action.color} hover:scale-[1.02] transition-transform cursor-pointer`}
                >
                  <span className="material-symbols-outlined">{action.icon}</span>
                  <span className="text-xs font-semibold">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Needs Grading */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Needs Grading</h3>
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded-full">
                {needsGrading.reduce((acc, item) => acc + item.submissions, 0)} pending
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {needsGrading.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.submissions} submissions</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.urgent 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {item.due}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
