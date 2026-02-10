import React, { useState } from 'react';
import { userService, notificationService } from '../../services';
import { User } from '../../types';

const AUDIENCE_OPTIONS = [
  { label: 'All Students', value: 'STUDENT' },
  { label: 'All Faculty', value: 'TEACHER' },
  { label: 'All Admins', value: 'ADMIN' },
  { label: 'Everyone', value: 'ALL' },
];

const NOTIFICATION_TYPES = [
  { label: 'Announcement', value: 'ANNOUNCEMENT' },
  { label: 'Event', value: 'EVENT' },
  { label: 'System', value: 'SYSTEM' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
];

const Broadcast: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('ANNOUNCEMENT');
  const [audience, setAudience] = useState('STUDENT');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<{ title: string; audience: string; time: string }[]>([]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess('');

    try {
      // Fetch user IDs for the target audience
      let userIds: string[] = [];
      if (audience === 'ALL') {
        // Fetch all roles
        const roles = ['STUDENT', 'TEACHER', 'ADMIN', 'ORGANIZER'];
        for (const role of roles) {
          try {
            const result = await userService.getUsersByRole(role, 1, 500);
            userIds.push(...result.data.map((u: User) => u.id));
          } catch { /* skip if role fetch fails */ }
        }
      } else {
        const result = await userService.getUsersByRole(audience, 1, 500);
        userIds = result.data.map((u: User) => u.id);
      }

      if (userIds.length === 0) {
        setError('No users found for the selected audience.');
        setSending(false);
        return;
      }

      await notificationService.createBulk({ title, message, type, userIds });
      setSuccess(`Broadcast sent to ${userIds.length} user(s) successfully!`);
      setHistory((prev) => [{ title, audience: AUDIENCE_OPTIONS.find(a => a.value === audience)?.label || audience, time: new Date().toLocaleTimeString() }, ...prev]);
      setTitle('');
      setMessage('');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">campaign</span>
          Broadcast Announcements
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Send notifications to groups of campus users</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Compose Broadcast</h3>
            </div>
            <form onSubmit={handleSend} className="p-6 space-y-5">
              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span className="text-sm font-medium">{success}</span>
                </div>
              )}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2 text-red-700 dark:text-red-400">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Audience *</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    {AUDIENCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notification Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    {NOTIFICATION_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
                <input
                  type="text" required value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter broadcast title..."
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message *</label>
                <textarea
                  required value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Write your announcement message here..."
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">{sending ? 'hourglass_top' : 'send'}</span>
                {sending ? 'Sending...' : 'Send Broadcast'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Broadcasts Sidebar */}
        <div>
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Broadcasts</h3>
            </div>
            {history.length === 0 ? (
              <div className="p-6 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">mail</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">No broadcasts sent yet this session</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((item, idx) => (
                  <div key={idx} className="p-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">To: {item.audience}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-5">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[18px]">tips_and_updates</span>
              Tips
            </h4>
            <ul className="space-y-2 text-xs text-blue-800 dark:text-blue-400">
              <li className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[14px] mt-0.5">chevron_right</span>
                Keep titles concise for better visibility
              </li>
              <li className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[14px] mt-0.5">chevron_right</span>
                Use "Everyone" for campus-wide announcements
              </li>
              <li className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[14px] mt-0.5">chevron_right</span>
                Choose appropriate notification type for filtering
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
