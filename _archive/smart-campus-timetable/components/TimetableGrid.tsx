
import React from 'react';
import { ScheduleEvent, EventType } from '../types';
import { DAYS, HOURS, TYPE_COLORS } from '../constants';

interface TimetableGridProps {
  events: ScheduleEvent[];
}

const TimetableGrid: React.FC<TimetableGridProps> = ({ events }) => {
  const SLOT_HEIGHT = 80; // pixels per hour
  const HEADER_HEIGHT = 60;
  const START_HOUR = 8;

  const calculatePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const decimalHours = hours + minutes / 60;
    return (decimalHours - START_HOUR) * SLOT_HEIGHT;
  };

  const calculateHeight = (start: string, end: string) => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const durationHours = (eH + eM / 60) - (sH + sM / 60);
    return durationHours * SLOT_HEIGHT;
  };

  const getEventStyles = (event: ScheduleEvent) => {
    const top = calculatePosition(event.startTime);
    const height = calculateHeight(event.startTime, event.endTime);
    const colorKey = TYPE_COLORS[event.type];
    
    // Default Tailwind colors for borders/bg
    const variants: Record<string, string> = {
      blue: 'border-blue-500 bg-blue-50 text-blue-700',
      indigo: 'border-indigo-500 bg-indigo-50 text-indigo-700',
      emerald: 'border-emerald-500 bg-emerald-50 text-emerald-700',
      rose: 'border-rose-500 bg-rose-50 text-rose-700',
      gray: 'border-gray-400 bg-gray-100 text-gray-600',
    };

    return {
      style: {
        top: `${top}px`,
        height: `${height}px`,
        left: '4px',
        right: '4px',
      },
      className: `absolute z-10 p-2 rounded-md border-l-4 ${variants[colorKey] || variants.blue} hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between overflow-hidden group`
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#f0f2f4] overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[850px] relative">
          
          {/* Header Row */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-[#f0f2f4]">
            <div className="bg-gray-50 border-r border-[#f0f2f4]"></div>
            {DAYS.map((day, idx) => (
              <div 
                key={day.shortName} 
                className={`p-3 text-center border-r border-[#f0f2f4] last:border-r-0 ${day.isToday ? 'bg-primary/5 relative' : ''}`}
              >
                {day.isToday && <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>}
                <p className={`text-xs font-bold uppercase tracking-wider ${day.isToday ? 'text-primary' : 'text-[#616f89]'}`}>
                  {day.shortName}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <p className={`text-lg font-bold ${day.isToday ? 'text-primary' : 'text-[#111318]'}`}>
                    {day.date}
                  </p>
                  {day.isToday && <div className="size-2 rounded-full bg-primary"></div>}
                </div>
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="relative grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr]">
            
            {/* Background Column Highlights */}
            <div className="absolute inset-0 grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] pointer-events-none z-0">
               <div className="bg-gray-50 border-r border-[#f0f2f4]"></div>
               {DAYS.map((day, i) => (
                 <div key={i} className={`border-r border-[#f0f2f4] last:border-r-0 ${day.isToday ? 'bg-primary/5' : ''}`}></div>
               ))}
            </div>

            {/* Time Indicator Line (Static Mockup for 11:20 AM) */}
            <div className="absolute left-[80px] right-0 top-[266px] border-t-2 border-red-500 z-20 flex items-center pointer-events-none">
              <div className="size-2 -ml-1 rounded-full bg-red-500"></div>
              <span className="text-[10px] font-bold text-red-500 bg-white px-1 ml-1 rounded border border-red-200">11:20 AM</span>
            </div>

            {/* Hours Column */}
            <div className="flex flex-col">
              {HOURS.map((hour) => (
                <div key={hour} className="h-20 border-b border-[#f0f2f4] border-r flex justify-center pt-2 text-[#616f89] text-xs font-medium">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Event Columns */}
            {DAYS.map((day, dayIdx) => (
              <div key={dayIdx} className="relative h-full border-r border-[#f0f2f4] last:border-r-0">
                {/* Horizontal grid lines */}
                {HOURS.map((hour) => (
                  <div key={hour} className="h-20 border-b border-[#f0f2f4]"></div>
                ))}
                
                {/* Events for this day */}
                {events.filter(e => e.dayIndex === dayIdx).map(event => {
                  const { style, className } = getEventStyles(event);
                  return (
                    <div key={event.id} style={style} className={className}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-[11px] leading-tight mb-0.5">{event.title}</p>
                          <p className="text-[10px] opacity-80">{event.type} {event.isLive && '• LIVE'}</p>
                        </div>
                        {event.isLive && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 mt-2">
                        <div className="flex items-center gap-1 text-[10px] opacity-90">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] opacity-90">
                          <span className="material-symbols-outlined text-[12px]">{event.instructor ? 'person' : 'location_on'}</span>
                          <span>{event.instructor || event.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableGrid;
