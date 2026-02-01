
import React from 'react';
import { CampusEvent, EventStatus } from '../types';

interface EventsTableProps {
  events: CampusEvent[];
}

const getStatusStyles = (status: EventStatus) => {
  switch (status) {
    case EventStatus.ACTIVE:
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case EventStatus.UPCOMING:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case EventStatus.DRAFT:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
  }
};

const EventsTable: React.FC<EventsTableProps> = ({ events }) => {
  return (
    <div className="xl:col-span-2 bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Active & Upcoming Events</h3>
        <button className="text-primary text-sm font-semibold hover:text-blue-700">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Event Name</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Venue</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={event.imageUrl} 
                      alt={event.name} 
                      className="w-10 h-10 rounded-lg bg-cover object-cover shrink-0" 
                    />
                    <div className="font-semibold text-slate-900 dark:text-white">{event.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {event.date} <br />
                  <span className="text-xs text-slate-400">{event.time}</span>
                </td>
                <td className="px-6 py-4 text-slate-500">{event.venue}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(event.status)}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTable;
