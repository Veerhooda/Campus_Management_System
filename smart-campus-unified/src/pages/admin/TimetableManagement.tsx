import React, { useState, useEffect, useCallback } from 'react';
import { timetableService } from '../../services';
import { TimetableSlot, DayOfWeek, Room, Department } from '../../types';
import type { Class as ClassInfo, Subject as SubjectInfo, Teacher as TeacherInfo } from '../../types';

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed',
  THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat',
};
const TIME_SLOTS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

const TYPE_COLORS: Record<string, string> = {
  LECTURE: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
  LAB: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300',
  TUTORIAL: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300',
  DEFAULT: 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300',
};

interface SlotFormData {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
}

const emptyForm: SlotFormData = {
  dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00',
  classId: '', subjectId: '', teacherId: '', roomId: '',
};

const TimetableManagement: React.FC = () => {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [classes, setClasses] = useState<(ClassInfo & { department?: Department })[]>([]);
  const [subjects, setSubjects] = useState<(SubjectInfo & { department?: Department })[]>([]);
  const [teachers, setTeachers] = useState<TeacherInfo[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [form, setForm] = useState<SlotFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load lookups on mount
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [cls, sub, rm, tch] = await Promise.all([
          timetableService.getClasses(),
          timetableService.getSubjects(),
          timetableService.getRooms(),
          timetableService.getTeachers(),
        ]);
        setClasses(cls);
        setSubjects(sub);
        setRooms(rm);
        setTeachers(tch.data || []);
        if (cls.length > 0) setSelectedClassId(cls[0].id);
      } catch (err) {
        console.error('Failed to load lookups:', err);
        setError('Failed to load reference data');
      }
    };
    loadLookups();
  }, []);

  // Load slots when selected class changes
  const loadSlots = useCallback(async () => {
    if (!selectedClassId) { setSlots([]); setLoading(false); return; }
    try {
      setLoading(true);
      const data = await timetableService.getTimetableByClass(selectedClassId);
      setSlots(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to load slots:', err);
      setError('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  }, [selectedClassId]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  const getEventsForSlot = (day: string, time: string) =>
    slots.filter(s => s.dayOfWeek === day && s.startTime.startsWith(time.split(':')[0]));

  // Open add modal
  const openAdd = () => {
    setEditingSlot(null);
    setForm({ ...emptyForm, classId: selectedClassId });
    setFormError(null);
    setShowModal(true);
  };

  // Open edit modal
  const openEdit = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setForm({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime.slice(0, 5),
      endTime: slot.endTime.slice(0, 5),
      classId: slot.classId,
      subjectId: slot.subjectId,
      teacherId: slot.teacherId,
      roomId: slot.roomId || '',
    });
    setFormError(null);
    setShowModal(true);
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!form.classId || !form.subjectId || !form.teacherId || !form.roomId) {
      setFormError('Please fill in all fields.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editingSlot) {
        await timetableService.updateSlot(editingSlot.id, form);
      } else {
        await timetableService.createSlot(form);
      }
      setShowModal(false);
      await loadSlots();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.conflicts?.join(', ') || 'Failed to save';
      setFormError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await timetableService.deleteSlot(id);
      setDeletingId(null);
      await loadSlots();
    } catch (err) {
      console.error('Failed to delete slot:', err);
    }
  };

  const getTeacherName = (slot: TimetableSlot) => {
    if (slot.teacher?.user) return `${slot.teacher.user.firstName} ${slot.teacher.user.lastName}`;
    if (slot.teacher) return `${slot.teacher.firstName || ''} ${slot.teacher.lastName || ''}`.trim();
    return 'Unassigned';
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Timetable Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Create, edit, and manage class schedules</p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Class selector */}
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} — {c.department?.name || ''}</option>
            ))}
          </select>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Slot
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Slots', value: slots.length, icon: 'event', color: 'text-blue-500' },
          { label: 'Class', value: selectedClass?.name || '—', icon: 'school', color: 'text-indigo-500' },
          { label: 'Days Active', value: new Set(slots.map(s => s.dayOfWeek)).size, icon: 'calendar_month', color: 'text-emerald-500' },
          { label: 'Subjects', value: new Set(slots.map(s => s.subjectId)).size, icon: 'menu_book', color: 'text-amber-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
            <span className={`material-symbols-outlined text-2xl ${stat.color}`}>{stat.icon}</span>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500">error</span>
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          <button onClick={loadSlots} className="ml-auto px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800">Retry</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-16 w-full" />)}</div>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="w-20 px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 dark:border-slate-700">Time</th>
                  {DAYS.map(day => (
                    <th key={day} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                      {DAY_LABELS[day]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map(time => (
                  <tr key={time} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                    <td className="px-3 py-3 text-xs font-medium text-slate-500 border-r border-slate-200 dark:border-slate-700 whitespace-nowrap">{time}</td>
                    {DAYS.map(day => {
                      const events = getEventsForSlot(day, time);
                      return (
                        <td key={`${day}-${time}`} className="px-1.5 py-1.5 border-r border-slate-100 dark:border-slate-800 last:border-r-0 align-top min-w-[130px]">
                          {events.map(slot => (
                            <div
                              key={slot.id}
                              className={`p-2 rounded-lg border text-xs mb-1 last:mb-0 cursor-pointer hover:scale-[1.02] transition-transform group relative ${TYPE_COLORS[slot.type || 'DEFAULT'] || TYPE_COLORS.DEFAULT}`}
                              onClick={() => openEdit(slot)}
                            >
                              <p className="font-bold truncate">{slot.subject?.name || 'Class'}</p>
                              <p className="opacity-80 mt-0.5 truncate">{getTeacherName(slot)}</p>
                              <p className="opacity-60">{slot.room?.name || 'Room TBD'}</p>
                              <p className="opacity-60">{slot.startTime.slice(0,5)} – {slot.endTime.slice(0,5)}</p>
                              {/* Delete button on hover */}
                              <button
                                onClick={(e) => { e.stopPropagation(); setDeletingId(slot.id); }}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-200 dark:hover:bg-red-800"
                              >
                                <span className="material-symbols-outlined text-[14px] text-red-500">close</span>
                              </button>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {slots.length === 0 && (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">event_busy</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">No Slots Scheduled</h3>
              <p className="text-slate-500 text-sm mt-1">Click "Add Slot" to create the first timetable entry for this class.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingSlot ? 'Edit Timetable Slot' : 'Add New Slot'}
              </h2>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {formError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                  {formError}
                </div>
              )}

              {/* Day */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Day of Week</label>
                <select value={form.dayOfWeek} onChange={e => setForm(f => ({ ...f, dayOfWeek: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
                  {DAYS.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                </select>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                  <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm" />
                </div>
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class</label>
                <select value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
                  <option value="">Select class…</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} — {c.department?.name || ''}</option>)}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
                  <option value="">Select subject…</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
                </select>
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teacher</label>
                <select value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
                  <option value="">Select teacher…</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.user ? `${t.user.firstName} ${t.user.lastName}` : t.employeeId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room</label>
                <select value={form.roomId} onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
                  <option value="">Select room…</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} — {r.building} (capacity: {r.capacity})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2">
                {saving && <span className="animate-spin material-symbols-outlined text-[16px]">progress_activity</span>}
                {editingSlot ? 'Update Slot' : 'Create Slot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeletingId(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
            <span className="material-symbols-outlined text-5xl text-red-500 mb-3">warning</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Slot?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This action cannot be undone. The slot will be permanently removed from the timetable.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeletingId(null)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900">Cancel</button>
              <button onClick={() => handleDelete(deletingId)} className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableManagement;
