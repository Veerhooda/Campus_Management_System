
import React from 'react';
import { LogEntry } from '../types';

const logs: LogEntry[] = [
  { id: '1', time: '10:42 AM', type: 'WARNING', title: 'Auth Timeout', location: 'Library Gate 3' },
  { id: '2', time: '10:40 AM', type: 'INFO', title: 'Backup Complete', location: 'System Database' },
  { id: '3', time: '10:35 AM', type: 'ERROR', title: 'Transaction Failed', location: 'Gateway (#9921)' },
  { id: '4', time: '10:28 AM', type: 'INFO', title: 'New User Reg', location: 'Student Portal' },
  { id: '5', time: '10:15 AM', type: 'SUCCESS', title: 'Sync Completed', location: 'Cloud Storage' },
];

const RecentLogs: React.FC = () => {
  const getBadgeClass = (type: LogEntry['type']) => {
    switch (type) {
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'INFO': return 'bg-blue-100 text-blue-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'SUCCESS': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="lg:col-span-1 bg-surface-light rounded-xl border border-border-light shadow-sm flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border-light flex items-center justify-between bg-gray-50">
        <h3 className="text-base font-bold text-text-main-light">Recent System Logs</h3>
        <button className="text-xs font-medium text-primary hover:text-blue-700 transition-colors">View All</button>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[300px] lg:max-h-full">
        <table className="w-full text-left border-collapse">
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border-light last:border-0 hover:bg-background-light transition-colors">
                <td className="p-4 align-top w-24">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono text-text-sub-light">{log.time}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold w-fit ${getBadgeClass(log.type)}`}>
                      {log.type}
                    </span>
                  </div>
                </td>
                <td className="p-4 align-top">
                  <p className="text-sm font-medium text-text-main-light">{log.title}</p>
                  <p className="text-xs text-text-sub-light mt-0.5">{log.location}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLogs;
