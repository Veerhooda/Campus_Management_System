import React, { useEffect, useState } from 'react';
import StatCard from '../../components/shared/StatCard';
import { useAuth } from '../../context/AuthContext';
import { timetableService, attendanceService, notificationService } from '../../services';
import { TimetableSlot, Notification } from '../../types';

const getTodayDay = (): string => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[new Date().getDay()];
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.firstName || 'Student';
  
  // State for API data
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<{ percentage: number; present: number; absent: number; total: number } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch in parallel
        const [timetableData, attendanceData, notifData] = await Promise.allSettled([
          timetableService.getStudentTimetable(),
          attendanceService.getMyAttendance(),
          notificationService.getNotifications(1, 5),
        ]);

        if (timetableData.status === 'fulfilled') {
          setTimetable(timetableData.value);
        }
        
        if (attendanceData.status === 'fulfilled') {
          setAttendanceStats(attendanceData.value.stats);
        }
        
        if (notifData.status === 'fulfilled') {
          setNotifications(notifData.value.data);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get today's classes
  const todayDay = getTodayDay();
  const safeTimeTable = Array.isArray(timetable) ? timetable : [];
  const todayClasses = safeTimeTable
    .filter(slot => slot.dayOfWeek === todayDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Get current time for class status
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const getClassStatus = (slot: TimetableSlot) => {
    if (slot.endTime <= currentTime) return 'Completed';
    if (slot.startTime <= currentTime && slot.endTime > currentTime) return 'Ongoing';
    return 'Upcoming';
  };

  // Get notification icon and colors
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'ACADEMIC':
        return { icon: 'grade', iconColor: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' };
      case 'EVENT':
        return { icon: 'celebration', iconColor: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20' };
      case 'ALERT':
        return { icon: 'warning', iconColor: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' };
      default:
        return { icon: 'info', iconColor: 'text-primary', bgColor: 'bg-blue-50 dark:bg-blue-900/20' };
    }
  };

  // Skeleton loader
  const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-5xl text-red-500">error</span>
        <p className="text-slate-600 dark:text-slate-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Here's what's happening on campus today.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Main Column */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </>
            ) : (
              <>
                <StatCard 
                  label="Overall Attendance"
                  value={attendanceStats ? `${Math.round(attendanceStats.percentage)}%` : 'N/A'}
                  icon="pie_chart"
                  colorClass="text-primary"
                  bgClass="bg-primary/10"
                  badge={attendanceStats && attendanceStats.percentage >= 75 ? 'Good Standing' : 'Low'}
                  showProgressRing={true}
                />
                <StatCard 
                  label="Classes Today"
                  value={todayClasses.length.toString()}
                  icon="class"
                  colorClass="text-orange-600 dark:text-orange-400"
                  bgClass="bg-orange-50 dark:bg-orange-900/20"
                  subtext={todayClasses.length > 0 ? `Next: ${todayClasses.find(c => getClassStatus(c) !== 'Completed')?.subject?.name || 'None'}` : 'No classes today'}
                />
                <StatCard 
                  label="Unread Notifications"
                  value={notifications.filter(n => !n.isRead).length.toString()}
                  icon="notifications"
                  colorClass="text-pink-600 dark:text-pink-400"
                  bgClass="bg-pink-50 dark:bg-pink-900/20"
                />
              </>
            )}
          </div>

          {/* Notifications / Feed Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Notifications</h3>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              {loading ? (
                <div className="p-4 space-y-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">notifications_off</span>
                  <p className="text-slate-500 dark:text-slate-400">No notifications yet</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map(item => {
                      const style = getNotificationStyle(item.type);
                      return (
                        <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                          <div className="flex gap-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${style.bgColor} flex items-center justify-center ${style.iconColor}`}>
                              <span className="material-symbols-outlined">{style.icon}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className={`text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors ${!item.isRead ? 'font-extrabold' : ''}`}>
                                  {item.title}
                                </h4>
                                <span className="text-xs text-slate-400 whitespace-nowrap">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{item.message}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">View All Notifications</button>
                  </div>
                </>
              )}
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

          {/* Today's Schedule */}
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Today's Schedule</h3>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : todayClasses.length === 0 ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">event_busy</span>
                <p className="text-slate-500 dark:text-slate-400">No classes today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((slot) => {
                  const status = getClassStatus(slot);
                  return (
                    <div key={slot.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                      status === 'Ongoing' ? 'bg-primary/5 border border-primary/20' : 'bg-slate-50 dark:bg-slate-800'
                    }`}>
                      <div className={`w-1 h-10 rounded-full ${
                        status === 'Completed' ? 'bg-green-500' : 
                        status === 'Ongoing' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {slot.subject?.name || 'Unknown Subject'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)} • {slot.room?.name || 'TBD'}
                        </p>
                      </div>
                      {status === 'Ongoing' && (
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">LIVE</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
