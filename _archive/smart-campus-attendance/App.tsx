
import React, { useState, useMemo } from 'react';
import { Student, AttendanceStatus, FilterOptions } from './types';
import { MOCK_STUDENTS, COURSES, SECTIONS, SESSIONS } from './constants';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import AttendanceToggle from './components/AttendanceToggle';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    course: COURSES[0],
    section: SECTIONS[0],
    session: SESSIONS[0],
  });
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
    const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, presentPercentage };
  }, [students]);

  const handleResetChanges = () => {
    setHasUnsavedChanges(0);
    // In a real app, this would perform a mutation
    alert('Attendance submitted successfully!');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRowBgColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.LATE: return 'bg-amber-50/30 dark:bg-amber-900/10';
      case AttendanceStatus.ABSENT: return 'bg-rose-50/30 dark:bg-rose-900/10';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Attendance Marking</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage daily attendance for your assigned courses.</p>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1a2230] px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Course Filter */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Course</label>
              <div className="relative">
                <select 
                  value={filters.course}
                  onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full appearance-none bg-white dark:bg-[#1a2230] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm font-medium transition-all"
                >
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
                </div>
              </div>
            </div>
            {/* Class & Section Filter */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Class & Section</label>
              <div className="relative">
                <select 
                  value={filters.section}
                  onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
                  className="w-full appearance-none bg-white dark:bg-[#1a2230] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm font-medium transition-all"
                >
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
                </div>
              </div>
            </div>
            {/* Session Filter */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Session</label>
              <div className="relative">
                <select 
                  value={filters.session}
                  onChange={(e) => setFilters(prev => ({ ...prev, session: e.target.value }))}
                  className="w-full appearance-none bg-white dark:bg-[#1a2230] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm font-medium transition-all"
                >
                  {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="md:col-span-4 flex items-end">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-[#1a2230] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-all" 
                placeholder="Search student by name or roll no..." 
              />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            label="Total Strength" 
            value={stats.total} 
            icon="groups" 
            colorClass="text-slate-900 dark:text-white" 
            bgGlowColor="bg-slate-500/5"
          />
          <StatsCard 
            label="Present" 
            value={stats.present} 
            icon="person_check" 
            colorClass="text-emerald-600 dark:text-emerald-400" 
            subValue={`${stats.presentPercentage}%`}
            bgGlowColor="bg-emerald-500/5"
          />
          <StatsCard 
            label="Absent" 
            value={stats.absent} 
            icon="person_off" 
            colorClass="text-rose-600 dark:text-rose-400" 
            bgGlowColor="bg-rose-500/5"
          />
          <StatsCard 
            label="Late" 
            value={stats.late} 
            icon="schedule" 
            colorClass="text-amber-600 dark:text-amber-400" 
            bgGlowColor="bg-amber-500/5"
          />
        </div>

        {/* Roster Table */}
        <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0 z-10">
            <div className="col-span-1 flex items-center">Roll No</div>
            <div className="col-span-5 md:col-span-4 flex items-center">Student Name</div>
            <div className="col-span-2 hidden md:flex items-center">Attendance %</div>
            <div className="col-span-6 md:col-span-5 flex items-center justify-end pr-2">Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 custom-scrollbar overflow-y-auto max-h-[600px]">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div 
                  key={student.id} 
                  className={`grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${getRowBgColor(student.status)}`}
                >
                  <div className="col-span-1 text-slate-500 dark:text-slate-400 font-mono text-sm">{student.rollNo}</div>
                  <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                    {student.avatarUrl ? (
                      <div 
                        className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center flex-shrink-0 border border-slate-100 dark:border-slate-600" 
                        style={{ backgroundImage: `url("${student.avatarUrl}")` }} 
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                        {getInitials(student.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{student.name}</p>
                      <p className="text-xs text-slate-500 truncate hidden sm:block">ID: {student.id}</p>
                    </div>
                  </div>
                  <div className="col-span-2 hidden md:flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.attendancePercentage < 75 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' 
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {student.attendancePercentage}%
                    </span>
                    {student.attendancePercentage < 75 && (
                      <div className="group/tooltip relative">
                        <span className="material-symbols-outlined text-[16px] text-rose-500 cursor-help">warning</span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                          Below 75%
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-6 md:col-span-5 flex justify-end">
                    <AttendanceToggle 
                      status={student.status} 
                      onChange={(newStatus) => handleStatusChange(student.id, newStatus)} 
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-[48px] mb-2">person_search</span>
                <p>No students found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Action Bar */}
      <div className={`fixed bottom-0 right-0 p-6 z-40 transition-all duration-300 transform ${hasUnsavedChanges > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-white dark:bg-[#1a2230] shadow-[0_4px_24px_rgba(0,0,0,0.1)] rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
            <span className="font-medium text-slate-900 dark:text-white">{hasUnsavedChanges}</span> updates pending
          </div>
          <button 
            onClick={handleResetChanges}
            className="bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-[#101622]"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
