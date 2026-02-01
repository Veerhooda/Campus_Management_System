import React from 'react';
import StatCard from '../../components/shared/StatCard';

// Mock data
const recentLogs = [
  { id: '1', action: 'User Created', user: 'John Smith', type: 'Student', time: '2 mins ago', icon: 'person_add' },
  { id: '2', action: 'Event Published', user: 'Admin', type: 'System', time: '15 mins ago', icon: 'event' },
  { id: '3', action: 'Grievance Resolved', user: 'Sarah K.', type: 'Support', time: '1 hr ago', icon: 'check_circle' },
  { id: '4', action: 'Permission Updated', user: 'Prof. Anderson', type: 'Faculty', time: '2 hrs ago', icon: 'admin_panel_settings' },
];

const quickStats = [
  { label: 'Total Users', value: '2,847', icon: 'group', trend: '+124', color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Active Faculty', value: '186', icon: 'school', trend: '+8', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  { label: 'Open Grievances', value: '23', icon: 'support_agent', trend: '-5', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { label: 'Events This Week', value: '12', icon: 'event', trend: '+3', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">System overview and management controls.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            System Settings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <StatCard 
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            colorClass={stat.color}
            bgClass={stat.bg}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'person_add', label: 'Add User', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' },
              { icon: 'event', label: 'Create Event', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' },
              { icon: 'campaign', label: 'Broadcast', color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' },
              { icon: 'support_agent', label: 'Grievances', color: 'bg-red-50 text-red-600 dark:bg-red-900/20' },
              { icon: 'analytics', label: 'Analytics', color: 'bg-green-50 text-green-600 dark:bg-green-900/20' },
              { icon: 'settings', label: 'Settings', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800' },
            ].map((action) => (
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

        {/* System Status */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">System Status</h3>
          <div className="space-y-4">
            {[
              { name: 'API Server', status: 'Operational', uptime: '99.9%', color: 'bg-green-500' },
              { name: 'Database', status: 'Operational', uptime: '99.8%', color: 'bg-green-500' },
              { name: 'Auth Service', status: 'Operational', uptime: '100%', color: 'bg-green-500' },
              { name: 'Notification Service', status: 'Degraded', uptime: '95.2%', color: 'bg-yellow-500' },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${service.color}`} />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{service.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{service.uptime}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    service.status === 'Operational' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <button className="text-xs font-semibold text-primary hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined text-[18px]">{log.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{log.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5">by {log.user}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Chart Placeholder */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Engagement</h3>
          <select className="text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-center text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-2">bar_chart</span>
            <p className="text-sm">Chart visualization would appear here</p>
            <p className="text-xs mt-1">Integration with charting library pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
