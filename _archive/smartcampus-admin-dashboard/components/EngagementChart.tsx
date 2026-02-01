
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '../types';

const data: ChartDataPoint[] = [
  { day: 'Mon', students: 4000, faculty: 2400 },
  { day: 'Tue', students: 3000, faculty: 1398 },
  { day: 'Wed', students: 2000, faculty: 9800 },
  { day: 'Thu', students: 2780, faculty: 3908 },
  { day: 'Fri', students: 1890, faculty: 4800 },
  { day: 'Sat', students: 2390, faculty: 3800 },
  { day: 'Sun', students: 3490, faculty: 4300 },
];

const EngagementChart: React.FC = () => {
  return (
    <div className="lg:col-span-2 bg-surface-light rounded-xl border border-border-light shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-base font-bold text-text-main-light">Weekly Event Engagement</h3>
          <p className="text-sm text-text-sub-light">Student vs Faculty attendance</p>
        </div>
        <select className="bg-background-light border-none text-sm rounded-lg py-1.5 px-3 text-text-main-light focus:ring-1 focus:ring-primary cursor-pointer outline-none transition-all">
          <option>Week 42</option>
          <option>Week 41</option>
          <option>Week 40</option>
        </select>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#616f89', fontSize: 12 }} 
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }} 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              iconType="circle" 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="faculty" 
              name="Faculty" 
              fill="#135bec4D" 
              radius={[4, 4, 0, 0]} 
              barSize={12}
            />
            <Bar 
              dataKey="students" 
              name="Students" 
              fill="#135bec" 
              radius={[4, 4, 0, 0]} 
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EngagementChart;
