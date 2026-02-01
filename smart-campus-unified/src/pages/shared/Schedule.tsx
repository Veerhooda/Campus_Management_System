import React, { useState } from 'react';

interface TimetableEvent {
  id: string;
  title: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
}

const MOCK_EVENTS: TimetableEvent[] = [
  { id: '1', title: 'Data Structures', type: 'Lecture', day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Room 301', instructor: 'Prof. Smith' },
  { id: '2', title: 'Database Systems Lab', type: 'Lab', day: 'Monday', startTime: '14:00', endTime: '16:00', room: 'Lab 201', instructor: 'Dr. Johnson' },
  { id: '3', title: 'Computer Networks', type: 'Lecture', day: 'Tuesday', startTime: '10:00', endTime: '11:30', room: 'Room 405', instructor: 'Prof. Williams' },
  { id: '4', title: 'Machine Learning', type: 'Lecture', day: 'Tuesday', startTime: '14:00', endTime: '15:30', room: 'Room 302', instructor: 'Dr. Chen' },
  { id: '5', title: 'Data Structures Lab', type: 'Lab', day: 'Wednesday', startTime: '09:00', endTime: '12:00', room: 'Lab 102', instructor: 'Prof. Smith' },
  { id: '6', title: 'Operating Systems', type: 'Lecture', day: 'Thursday', startTime: '11:00', endTime: '12:30', room: 'Room 201', instructor: 'Prof. Brown' },
  { id: '7', title: 'Software Engineering', type: 'Lecture', day: 'Friday', startTime: '09:00', endTime: '10:30', room: 'Room 401', instructor: 'Dr. Davis' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Lecture': return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300';
    case 'Lab': return 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300';
    case 'Tutorial': return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300';
    default: return 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300';
  }
};

const Schedule: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const getEventsForSlot = (day: string, time: string) => {
    return MOCK_EVENTS.filter(e => e.day === day && e.startTime === time);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Weekly Schedule</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Oct 23 – Oct 29, 2023</p>
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

      {/* Timetable Grid */}
      {view === 'grid' ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="w-20 px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 dark:border-slate-700">Time</th>
                  {DAYS.map(day => (
                    <th key={day} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                      {day}
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
                          {events.map(event => (
                            <div 
                              key={event.id}
                              className={`p-2 rounded-lg border text-xs mb-1 last:mb-0 cursor-pointer hover:scale-[1.02] transition-transform ${getTypeColor(event.type)}`}
                            >
                              <p className="font-bold truncate">{event.title}</p>
                              <p className="opacity-80 mt-0.5">{event.room}</p>
                              <p className="opacity-60">{event.startTime} - {event.endTime}</p>
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
            const dayEvents = MOCK_EVENTS.filter(e => e.day === day);
            if (dayEvents.length === 0) return null;
            return (
              <div key={day} className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white">{day}</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {dayEvents.map(event => (
                    <div key={event.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className={`w-1 h-12 rounded-full ${event.type === 'Lecture' ? 'bg-blue-500' : event.type === 'Lab' ? 'bg-purple-500' : 'bg-green-500'}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
                        <p className="text-sm text-slate-500">{event.startTime} - {event.endTime} • {event.room} • {event.instructor}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor(event.type)}`}>{event.type}</span>
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
