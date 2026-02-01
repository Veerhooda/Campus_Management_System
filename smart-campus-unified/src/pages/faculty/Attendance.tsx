import React, { useState, useMemo } from 'react';

enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  NOT_MARKED = 'Not Marked',
}

interface Student {
  id: string;
  rollNo: string;
  name: string;
  status: AttendanceStatus;
  attendancePercentage: number;
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', rollNo: '2021CS001', name: 'Aarav Sharma', status: AttendanceStatus.NOT_MARKED, attendancePercentage: 92 },
  { id: '2', rollNo: '2021CS002', name: 'Priya Patel', status: AttendanceStatus.NOT_MARKED, attendancePercentage: 88 },
  { id: '3', rollNo: '2021CS003', name: 'Rahul Kumar', status: AttendanceStatus.NOT_MARKED, attendancePercentage: 72 },
  { id: '4', rollNo: '2021CS004', name: 'Sneha Reddy', status: AttendanceStatus.NOT_MARKED, attendancePercentage: 95 },
  { id: '5', rollNo: '2021CS005', name: 'Vikram Singh', status: AttendanceStatus.NOT_MARKED, attendancePercentage: 67 },
  { id: '6', rollNo: '2021CS006', name: 'Ananya Gupta', status: AttendanceStatus.NOT_MARKED, attendancePercentage: 91 },
];

const AttendanceToggle: React.FC<{ status: AttendanceStatus; onChange: (status: AttendanceStatus) => void }> = ({ status, onChange }) => {
  const options = [
    { value: AttendanceStatus.PRESENT, label: 'P', color: 'bg-green-500' },
    { value: AttendanceStatus.ABSENT, label: 'A', color: 'bg-red-500' },
    { value: AttendanceStatus.LATE, label: 'L', color: 'bg-yellow-500' },
  ];

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
            status === opt.value
              ? `${opt.color} text-white shadow-md`
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

const AttendanceMarking: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(0);

  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, status: newStatus } : s
    ));
    setHasUnsavedChanges(prev => prev + 1);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.rollNo.includes(searchQuery)
    );
  }, [students, searchQuery]);

  const stats = useMemo(() => {
    const total = students.length;
    const present = students.filter(s => s.status === AttendanceStatus.PRESENT).length;
    const absent = students.filter(s => s.status === AttendanceStatus.ABSENT).length;
    const late = students.filter(s => s.status === AttendanceStatus.LATE).length;
    return { total, present, absent, late };
  }, [students]);

  const handleSubmit = () => {
    setHasUnsavedChanges(0);
    alert('Attendance submitted successfully!');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Attendance Marking</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Mark attendance for CS305 - Data Structures</p>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-white dark:bg-surface-dark px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          <span className="font-medium text-sm">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: 'groups', color: 'text-slate-900 dark:text-white' },
          { label: 'Present', value: stats.present, icon: 'person_check', color: 'text-green-600' },
          { label: 'Absent', value: stats.absent, icon: 'person_off', color: 'text-red-600' },
          { label: 'Late', value: stats.late, icon: 'schedule', color: 'text-yellow-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Search by name or roll number..."
        />
      </div>

      {/* Student List */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Roll No</div>
          <div className="col-span-4">Student Name</div>
          <div className="col-span-2 hidden md:block">Attendance %</div>
          <div className="col-span-4 md:col-span-4 text-right">Status</div>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredStudents.map((student) => (
            <div key={student.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
              student.status === AttendanceStatus.ABSENT ? 'bg-red-50/30 dark:bg-red-900/10' : 
              student.status === AttendanceStatus.LATE ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : ''
            }`}>
              <div className="col-span-2 text-sm font-mono text-slate-500">{student.rollNo}</div>
              <div className="col-span-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.name}</p>
              </div>
              <div className="col-span-2 hidden md:block">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  student.attendancePercentage < 75 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {student.attendancePercentage}%
                </span>
              </div>
              <div className="col-span-4 md:col-span-4 flex justify-end">
                <AttendanceToggle 
                  status={student.status} 
                  onChange={(newStatus) => handleStatusChange(student.id, newStatus)} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Bar */}
      {hasUnsavedChanges > 0 && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-surface-dark shadow-xl rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-4 animate-slide-in">
          <div className="text-sm text-slate-500">
            <span className="font-bold text-slate-900 dark:text-white">{hasUnsavedChanges}</span> updates pending
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceMarking;
