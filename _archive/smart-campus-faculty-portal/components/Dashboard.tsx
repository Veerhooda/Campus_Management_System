
import React from 'react';
import { User, ClassSession, Submission, ActionItem } from '../types';
import { MetricCard } from './MetricCard';
import { TodaySchedule } from './TodaySchedule';
import { ImmediateActions } from './ImmediateActions';
import { NeedsGrading } from './NeedsGrading';

const MOCK_CLASSES: ClassSession[] = [
  { id: '1', title: 'Advanced Physics - 10A', startTime: '08:00 AM', endTime: '09:30 AM', location: 'Lab 304', status: 'Completed' },
  { id: '2', title: 'Introduction to Mechanics - 11B', startTime: '10:00 AM', endTime: '11:30 AM', location: 'Lecture Hall A', status: 'Now' },
  { id: '3', title: 'Applied Math - 12C', startTime: '01:00 PM', endTime: '02:30 PM', location: 'Room 202', status: 'Upcoming' },
  { id: '4', title: 'Office Hours', startTime: '03:00 PM', endTime: '04:30 PM', location: 'Staff Room', status: 'Upcoming' },
];

const MOCK_SUBMISSIONS: Submission[] = [
  { id: 's1', studentName: 'Sarah Jenkins', studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjMhw5DBDtXn1c3iH9LXbX7YgKXhqjf7kXm3gzdcFTMEAMJfVigt0t9ylojIAT1PJ3Axc6GzNFr40vBz6xVQOPt7VPY9CcOREp8e1epuSA1vqZoUSbKYPOaYztBGMBpY0YQBkuJL27I8oVTwaP-H6QpTAg3-8Vo1UCBDAPoMxh-IS8izoyjjMYSFF8BNriuQzmg9HoYY10BS6iOMrDLmI4I_7kSJKdFGDTXcJfG13b3aBksgN7UZCh7dod6KstiyA5w8GJRWSoF2vF', assignmentTitle: 'Physics Lab Report: Pendulum', timeAgo: '2m ago', verified: true },
  { id: 's2', studentName: 'Michael Chen', studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy0LgrTOZtLj57bhSnU8JHfhMXBPlqhg1lFAISig-OLIRnsN6nV6v-5rK-u2Z2ATJUndD5pGhZUkyHBCk09jFVWXyzyUkQF6kt6gY-boUzUOoraNouT979WVB2bub5djRzObWtv5-Fit-xdeAumTLJPfDJei4CmmOyrGHSsUUrLGjbfJWeTIqg97ypKFu6T_OpWg2GJNt_LWqPs7HJcJpG7dwnKJJaGWCptssalJvW0FYEFGJO964WpWTbpVjjo8MMr_zmr8kpAKIZ', assignmentTitle: 'Essay: The Great Gatsby', timeAgo: '15m ago' },
  { id: 's3', studentName: 'Emily Davis', studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF21dnhw0zwUM04C6RZmlugvBJ48Q3monTA1c389Q0TJKg2gAyTs8CEFSunUwu_MLEnpAraQS2KTVIlbfy3gJnaX7d1Q0lVzx8EoYsFxryJgA-5Lgm7mBTZO5H0G3qp_jj_i8aGxCjAPs9o6ZJ8pwCqQJSE75uRUO_uYgJV1Vlv_dSC55zOwLepMUNATPIiwfLrwodApYx2PIgrAVWxT96911oVlVWFLrfnenZrWRYA5xy8Mx12BiGQN3YtSB89wSXUZXrc8EbMqF2', assignmentTitle: 'Math Quiz: Module 4', timeAgo: '1h ago' },
  { id: 's4', studentName: 'James Doe', initials: 'JD', assignmentTitle: 'History Project Outline', timeAgo: '3h ago' },
];

const MOCK_ACTIONS: ActionItem[] = [
  { id: 'a1', title: 'Mark Attendance', subtitle: 'Advanced Physics - 10A', icon: 'edit_document', color: 'orange', actionLabel: 'Start' },
  { id: 'a2', title: 'Post Announcement', subtitle: 'Notify Grade 12 about exam', icon: 'campaign', color: 'slate' },
  { id: 'a3', title: 'Upload Material', subtitle: 'Lecture notes for Mechanics', icon: 'upload_file', color: 'slate' },
];

export const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const today = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Heading */}
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Good Morning, {user.name.split(' ')[1] ? user.name : user.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold text-lg">{today}</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create Assignment
          </button>
          <button className="bg-primary hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-xl shadow-blue-200 dark:shadow-none hover:-translate-y-0.5">
            <span className="material-symbols-outlined text-[20px]">videocam</span>
            Start Virtual Class
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Classes Today"
          value="4"
          trend="On Schedule"
          trendType="positive"
          icon="school"
          iconColorClass="text-primary"
          bgColorClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <MetricCard 
          title="Pending Attendance"
          value="1"
          unit="Class"
          trend="Action Required"
          trendType="warning"
          icon="fact_check"
          iconColorClass="text-orange-500"
          bgColorClass="bg-orange-50 dark:bg-orange-900/20"
        />
        <MetricCard 
          title="Recent Submissions"
          value="12"
          trend="From 3 courses"
          trendType="neutral"
          icon="assignment"
          iconColorClass="text-purple-600"
          bgColorClass="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Schedule */}
        <div className="lg:col-span-8 space-y-8">
          <TodaySchedule sessions={MOCK_CLASSES} />
        </div>

        {/* Right Column - Actions & Submissions */}
        <div className="lg:col-span-4 space-y-8">
          <ImmediateActions actions={MOCK_ACTIONS} />
          <NeedsGrading submissions={MOCK_SUBMISSIONS} />
        </div>
      </div>
    </div>
  );
};
