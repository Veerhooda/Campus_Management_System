import React, { useState, useEffect } from 'react';
import { notificationService, studentService, teacherService } from '../../services';
import { Student, Teacher } from '../../types';

const AUDIENCE_OPTIONS = [
  { label: 'My Department Students', value: 'DEPT_STUDENT' },
  { label: 'My Department Faculty', value: 'DEPT_TEACHER' },
];

const NOTIFICATION_TYPES = [
  { label: 'Announcement', value: 'ANNOUNCEMENT' },
  { label: 'Event', value: 'EVENT' },
];

const FacultyBroadcast: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('ANNOUNCEMENT');
  const [audience, setAudience] = useState('DEPT_STUDENT');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<{ title: string; audience: string; time: string }[]>([]);

  const [departmentId, setDepartmentId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await teacherService.getProfile();
      if (profile && profile.departmentId) {
        setDepartmentId(profile.departmentId);
      } else {
        setError('Could not fetch department information.');
      }
    } catch (err) {
      console.error('Failed to load profile', err);
      setError('Failed to load profile.');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentId) {
      setError('Department information is missing.');
      return;
    }

    setSending(true);
    setError('');
    setSuccess('');

    try {
      let userIds: string[] = [];

      if (audience === 'DEPT_STUDENT') {
        const result = await studentService.getStudents(
          1, 
          1000, 
          undefined, 
          departmentId, 
          selectedYear ? parseInt(selectedYear) : undefined
        );
        userIds = result.data.map((s: Student) => s.userId);
      } else if (audience === 'DEPT_TEACHER') {
        const teachers = await teacherService.getTeachersByDepartment(departmentId);
        userIds = teachers.filter((t: Teacher) => t.userId).map((t: Teacher) => t.userId);
      }

      if (userIds.length === 0) {
        setError('No users found for the selected criteria.');
        setSending(false);
        return;
      }

      await notificationService.createBulk({ title, message, type, userIds });
      setSuccess(`Broadcast sent to ${userIds.length} user(s) successfully!`);
      
      const audienceLabel = AUDIENCE_OPTIONS.find(a => a.value === audience)?.label || audience;
      const filterLabel = selectedYear ? ` (Year ${selectedYear})` : '';
      
      setHistory((prev) => [{ 
        title, 
        audience: `${audienceLabel}${filterLabel}`, 
        time: new Date().toLocaleTimeString() 
      }, ...prev]);
      
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
          Department Broadcast
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Send notifications to your department's students and faculty</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Compose Message</h3>
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
                    onChange={(e) => {
                      setAudience(e.target.value);
                      setSelectedYear('');
                    }}
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

              {/* Filters */}
              {audience === 'DEPT_STUDENT' && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Filter by Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option value="">All Years</option>
                      <option value="1">First Year (FE)</option>
                      <option value="2">Second Year (SE)</option>
                      <option value="3">Third Year (TE)</option>
                      <option value="4">Fourth Year (BE)</option>
                    </select>
                  </div>
                </div>
              )}

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
                disabled={sending || !departmentId}
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
                Use "My Dept Students" for official announcements
              </li>
              <li className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[14px] mt-0.5">chevron_right</span>
                Filter by year to reach specific batches
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyBroadcast;
