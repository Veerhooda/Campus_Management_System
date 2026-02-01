
import React, { useState } from 'react';
import StatCard from './StatCard';
import EngagementChart from './EngagementChart';
import RecentLogs from './RecentLogs';
import QuickActions from './QuickActions';
import { StatItem } from '../types';
import { GoogleGenAI } from '@google/genai';

const stats: StatItem[] = [
  { label: 'Active Users', value: '14,203', trend: '5.2%', trendUp: true, icon: 'groups', colorClass: 'bg-blue-50 text-primary' },
  { label: 'Open Grievances', value: '12', trend: '3 Urgent', trendUp: false, icon: 'report_problem', colorClass: 'bg-orange-50 text-orange-600' },
  { label: 'System Health', value: '99.9%', status: 'All systems operational', icon: 'dns', colorClass: 'bg-green-50 text-green-600' },
];

const Dashboard: React.FC = () => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAskAi = async () => {
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the SmartCampus Admin Assistant. Here is current dashboard data:
        - Active Users: 14,203 (Up 5.2%)
        - Open Grievances: 12 (3 Urgent)
        - System Health: 99.9%
        - Engagement: Peak on Fridays, low on weekends.
        - Recent logs show some Auth Timeouts at Library Gate 3.
        
        Provide a concise, professional 2-sentence executive summary and 1 actionable recommendation.`,
      });
      setAiAnalysis(response.text || "Unable to generate insights at this time.");
    } catch (err) {
      console.error(err);
      setAiAnalysis("Error connecting to Gemini API. Please ensure the environment is correctly configured.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* AI Insight Section (Bonus Integration) */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">auto_awesome</span>
                AI Dashboard Insights
              </h3>
              <p className="text-blue-100 text-sm mt-1">Get an instant analysis of your campus data using Gemini.</p>
            </div>
            <button 
              onClick={handleAskAi}
              disabled={loadingAi}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
            >
              {loadingAi ? 'Analyzing...' : 'Generate Summary'}
            </button>
          </div>
          {aiAnalysis && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20 animate-in fade-in duration-500">
              <p className="text-sm leading-relaxed">{aiAnalysis}</p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <EngagementChart />
          <RecentLogs />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
