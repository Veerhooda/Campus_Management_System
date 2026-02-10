import React, { useState, useEffect, useMemo } from 'react';
import { timetableService, studentService, attendanceService } from '../../services';
import { TimetableSlot, Student } from '../../types';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'NOT_MARKED';

interface StudentAttendance {
  student: Student;
  status: AttendanceStatus;
  attendancePercentage?: number;
}

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

const AttendanceToggle: React.FC<{ status: AttendanceStatus; onChange: (status: AttendanceStatus) => void }> = ({ status, onChange }) => {
  const options = [
    { value: 'PRESENT' as AttendanceStatus, label: 'P', color: 'bg-green-500' },
    { value: 'ABSENT' as AttendanceStatus, label: 'A', color: 'bg-red-500' },
    { value: 'LATE' as AttendanceStatus, label: 'L', color: 'bg-yellow-500' },
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
  // State
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // Load teacher's timetable on mount
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const data = await timetableService.getTeacherTimetable();
        setTimetable(data);
        
        // Auto-select first slot for today
        const todayDay = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][new Date().getDay()];
        const todaySlots = data.filter(slot => slot.dayOfWeek === todayDay);
        if (todaySlots.length > 0) {
          setSelectedSlot(todaySlots[0]);
        }
      } catch (err) {
        console.error('Failed to load timetable:', err);
        setError('Could not load your timetable. Please make sure your teacher profile is set up.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  // Load students when slot is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedSlot) return;
      
      try {
        setLoadingStudents(true);
        const data = await studentService.getStudentsByClass(selectedSlot.classId);
        setStudents(data.map(student => ({
          student,
          status: 'NOT_MARKED' as AttendanceStatus,
        })));
        setHasUnsavedChanges(0);
      } catch (err) {
        console.error('Failed to load students:', err);
        setStudents([]);
        setError('Could not load student list for this class.');
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedSlot]);

  // Handle status change
  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    setStudents(prev => prev.map(s => 
      s.student.id === studentId ? { ...s, status: newStatus } : s
    ));
    setHasUnsavedChanges(prev => prev + 1);
  };

  // Filter students by search
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const name = `${s.student.user?.firstName || ''} ${s.student.user?.lastName || ''}`.toLowerCase();
      return name.includes(searchQuery.toLowerCase()) || 
             s.student.rollNumber?.includes(searchQuery);
    });
  }, [students, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = students.length;
    const present = students.filter(s => s.status === 'PRESENT').length;
    const absent = students.filter(s => s.status === 'ABSENT').length;
    const late = students.filter(s => s.status === 'LATE').length;
    return { total, present, absent, late };
  }, [students]);

  // Submit attendance
  const handleSubmit = async () => {
    if (!selectedSlot) return;
    
    const markedStudents = students.filter(s => s.status !== 'NOT_MARKED');
    if (markedStudents.length === 0) {
      alert('Please mark attendance for at least one student.');
      return;
    }

    try {
      setSubmitting(true);
      await attendanceService.markBulkAttendance(
        markedStudents.map(s => ({
          studentId: s.student.id,
          timetableSlotId: selectedSlot.id,
          date: today,
          status: s.status === 'PRESENT' || s.status === 'LATE' ? 'PRESENT' : 'ABSENT',
        }))
      );
      setSuccessMessage('Attendance submitted successfully!');
      setHasUnsavedChanges(0);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to submit attendance:', err);
      alert('Failed to submit attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get today's slots
  const todayDay = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][new Date().getDay()];
  const todaySlots = timetable.filter(slot => slot.dayOfWeek === todayDay);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error && timetable.length === 0) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Attendance Marking</h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-4 block">error_outline</span>
          <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Unable to Load Attendance</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-20">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
          <span className="material-symbols-outlined">check_circle</span>
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Attendance Marking</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {selectedSlot 
              ? `${selectedSlot.subject?.name || 'Class'} - ${selectedSlot.class?.name || ''}`
              : 'Select a class to mark attendance'
            }
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-white dark:bg-surface-dark px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          <span className="font-medium text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Slot Selection */}
      {todaySlots.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {todaySlots.map(slot => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedSlot?.id === slot.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="font-bold">{slot.subject?.name || 'Class'}</span>
              <span className="ml-2 opacity-75">{slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            <span>No classes scheduled for today.</span>
          </div>
        </div>
      )}

      {selectedSlot && (
        <>
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
              <div className="col-span-2 hidden md:block">Email</div>
              <div className="col-span-4 md:col-span-4 text-right">Status</div>
            </div>
            
            {loadingStudents ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">groups</span>
                <p className="text-slate-500 dark:text-slate-400">No students found in this class.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((item) => (
                  <div key={item.student.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    item.status === 'ABSENT' ? 'bg-red-50/30 dark:bg-red-900/10' : 
                    item.status === 'LATE' ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : ''
                  }`}>
                    <div className="col-span-2 text-sm font-mono text-slate-500">{item.student.rollNumber || '-'}</div>
                    <div className="col-span-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.student.user?.firstName || ''} {item.student.user?.lastName || ''}
                      </p>
                    </div>
                    <div className="col-span-2 hidden md:block text-sm text-slate-500 truncate">
                      {item.student.user?.email || '-'}
                    </div>
                    <div className="col-span-4 md:col-span-4 flex justify-end">
                      <AttendanceToggle 
                        status={item.status} 
                        onChange={(newStatus) => handleStatusChange(item.student.id, newStatus)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Submit Bar */}
      {hasUnsavedChanges > 0 && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-surface-dark shadow-xl rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-4 animate-slide-in">
          <div className="text-sm text-slate-500">
            <span className="font-bold text-slate-900 dark:text-white">{hasUnsavedChanges}</span> updates pending
          </div>
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[20px] ${submitting ? 'animate-spin' : ''}`}>
              {submitting ? 'autorenew' : 'check_circle'}
            </span>
            {submitting ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceMarking;
