import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/shared/StatCard';
import { useAuth, getDisplayName } from '../../context/AuthContext';
import { timetableService } from '../../services';
import { TimetableSlot } from '../../types';

// Mock data for pending submissions (would come from assignments API)
const needsGrading = [
  { id: '1', title: 'CS101 Quiz 3', submissions: 42, due: 'Due Today', urgent: true },
  { id: '2', title: 'CS305 Assignment 2', submissions: 28, due: 'Due Tomorrow', urgent: false },
  { id: '3', title: 'CS401 Midterm', submissions: 26, due: 'Due Oct 28', urgent: false },
];

const immediateActions = [
  { icon: 'post_add', label: 'Create Assignment', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
  { icon: 'checklist', label: 'Mark Attendance', color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400', path: '/faculty/attendance' },
  { icon: 'event', label: 'Office Hours', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
  { icon: 'forum', label: 'Announcements', color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
];

const getTodayDay = (): string => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[new Date().getDay()];
};

const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user ? getDisplayName(user) : 'Professor';
  
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await timetableService.getTeacherTimetable();
        setTimetable(data);
      } catch (err) {
        console.error('Failed to load schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get today's classes
  const todayDay = getTodayDay();
  const safeTimeTable = Array.isArray(timetable) ? timetable : [];
  const todaySchedule = safeTimeTable
    .filter(slot => slot.dayOfWeek === todayDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Get current time for class status
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const getClassIdx = (slot: TimetableSlot) => {
    if (slot.endTime <= currentTime) return 0; // Completed
    if (slot.startTime <= currentTime && slot.endTime > currentTime) return 1; // Ongoing
    return 2; // Upcoming
  };

  // Skeleton loader
  const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
  );

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
          <button 
            onClick={() => navigate('/faculty/schedule')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            View Full Schedule
          </button>
          <button 
            onClick={() => alert('Assignment creation coming soon!')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Assignment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <StatCard 
              label="Today's Classes"
              value={todaySchedule.length.toString()}
              icon="class"
              colorClass="text-primary"
              bgClass="bg-primary/10"
              subtext={todaySchedule.length > 0 ? `Next: ${todaySchedule.find(s => getClassIdx(s) > 0)?.subject?.name || 'Done for today'}` : 'No classes today'}
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
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="xl:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Schedule</h3>
            <span className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          {loading ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : todaySchedule.length === 0 ? (
            <div className="p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">event_busy</span>
              <p className="text-slate-500 dark:text-slate-400">No classes scheduled for today</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {todaySchedule.map((item) => {
                const classIdx = getClassIdx(item);
                return (
                  <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-4">
                    <div className={`w-1 h-12 rounded-full ${classIdx === 1 ? 'bg-primary' : classIdx === 0 ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.subject?.code || ''} - {item.subject?.name || 'Unknown'}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Lecture
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)} • {item.room?.name || 'TBD'} • {item.class?.name || 'Class'}
                      </p>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[16px]">checklist</span>
                      Attendance
                    </button>
                  </div>
                );
              })}
            </div>
          )}
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
                  onClick={() => action.path ? navigate(action.path) : alert(`${action.label} feature coming soon!`)}
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
