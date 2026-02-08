import React, { useState, useEffect } from 'react';
import { timetableService } from '../../services';
import { TimetableSlot } from '../../types';
import { useAuth, getPrimaryRole } from '../../context/AuthContext';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
};
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const getTypeColor = (type: string) => {
  switch (type?.toUpperCase()) {
    case 'LECTURE': return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300';
    case 'LAB': return 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300';
    case 'TUTORIAL': return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300';
    default: return 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300';
  }
};

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

const Schedule: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = user ? getPrimaryRole(user.roles) : 'STUDENT';

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = role === 'TEACHER' 
          ? await timetableService.getTeacherTimetable()
          : await timetableService.getStudentTimetable();
        setTimetable(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load schedule:', err);
        setError('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [role]);

  // Get week range display
  const getWeekRange = () => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    
    return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${friday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const getEventsForSlot = (day: string, time: string) => {
    const safeTimetable = Array.isArray(timetable) ? timetable : [];
    return safeTimetable.filter(slot => 
      slot.dayOfWeek === day && 
      slot.startTime.startsWith(time.split(':')[0])
    );
  };

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
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Weekly Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{getWeekRange()}</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button 
              onClick={() => setView('grid')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button 
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">view_list</span>
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download PDF
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : timetable.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">event_busy</span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Classes Scheduled</h3>
          <p className="text-slate-500 dark:text-slate-400">Your timetable is empty for this week.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="w-20 px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 dark:border-slate-700">Time</th>
                  {DAYS.map(day => (
                    <th key={day} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                      {DAY_LABELS[day]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((time) => (
                  <tr key={time} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                    <td className="px-4 py-4 text-xs font-medium text-slate-500 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">
                      {time}
                    </td>
                    {DAYS.map(day => {
                      const events = getEventsForSlot(day, time);
                      return (
                        <td key={`${day}-${time}`} className="px-2 py-2 border-r border-slate-100 dark:border-slate-800 last:border-r-0 align-top min-w-[140px]">
                          {events.map(slot => (
                            <div 
                              key={slot.id}
                              className={`p-2 rounded-lg border text-xs mb-1 last:mb-0 cursor-pointer hover:scale-[1.02] transition-transform ${getTypeColor(slot.type || 'LECTURE')}`}
                            >
                              <p className="font-bold truncate">{slot.subject?.name || 'Class'}</p>
                              <p className="opacity-80 mt-0.5">{slot.room?.name || 'Room TBD'}</p>
                              <p className="opacity-60">{slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}</p>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {DAYS.map(day => {
            const safeTimetable = Array.isArray(timetable) ? timetable : [];
            const dayEvents = safeTimetable.filter(slot => slot.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
            if (dayEvents.length === 0) return null;
            return (
              <div key={day} className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white">{DAY_LABELS[day]}</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {dayEvents.map(slot => (
                    <div key={slot.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className={`w-1 h-12 rounded-full ${(slot.type || 'LECTURE') === 'LECTURE' ? 'bg-blue-500' : (slot.type || '') === 'LAB' ? 'bg-purple-500' : 'bg-green-500'}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">{slot.subject?.name || 'Class'}</p>
                        <p className="text-sm text-slate-500">
                          {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)} • {slot.room?.name || 'Room TBD'} 
                          {slot.teacher && ` • ${slot.teacher.firstName || slot.teacher.user?.firstName || ''} ${slot.teacher.lastName || slot.teacher.user?.lastName || ''}`}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor(slot.type || 'LECTURE')}`}>
                        {slot.type || 'Lecture'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-6 justify-center text-xs font-semibold text-slate-500">
        {['Lecture', 'Lab', 'Tutorial'].map(type => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${type === 'Lecture' ? 'bg-blue-500' : type === 'Lab' ? 'bg-purple-500' : 'bg-green-500'}`} />
            <span>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
