import React, { useState } from 'react';

enum FormStep {
  BASIC_DETAILS = 1,
  VENUE_LOGISTICS = 2,
}

interface EventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isAllDay: boolean;
  building: string;
  room: string;
  audience: string[];
}

const BUILDINGS = [
  { id: 'lib', name: 'Main Library', rooms: ['Grand Auditorium', 'Conference Room A', 'Study Hall 1'] },
  { id: 'sci', name: 'Science Block', rooms: ['Lab 101', 'Lab 102', 'Lecture Hall 1'] },
  { id: 'admin', name: 'Admin Building', rooms: ['Board Room', 'Meeting Room 1', 'Meeting Room 2'] },
];

const EventCreator: React.FC = () => {
  const [step, setStep] = useState<FormStep>(FormStep.BASIC_DETAILS);
  const [formData, setFormData] = useState<EventData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isAllDay: false,
    building: 'Main Library',
    room: '',
    audience: ['All Students'],
  });

  const updateField = <K extends keyof EventData>(field: K, value: EventData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedBuilding = BUILDINGS.find(b => b.name === formData.building);

  const handleSubmit = () => {
    alert('Event Published Successfully!');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">Dashboard</span>
        <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
        <span className="text-slate-400">Events</span>
        <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
        <span className="text-slate-900 dark:text-white font-semibold">Create New Event</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Create New Event</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Schedule activities and reserve venues for the campus community.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          Preview
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-4">
        {[
          { step: FormStep.BASIC_DETAILS, label: 'Basic Details' },
          { step: FormStep.VENUE_LOGISTICS, label: 'Venue & Audience' },
        ].map((item, idx) => (
          <React.Fragment key={item.step}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= item.step 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {step > item.step ? <span className="material-symbols-outlined text-[18px]">check</span> : idx + 1}
              </div>
              <span className={`text-sm font-medium ${step >= item.step ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </div>
            {idx < 1 && <div className={`flex-1 h-0.5 ${step > FormStep.BASIC_DETAILS ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <form onSubmit={(e) => e.preventDefault()}>
          {step === FormStep.BASIC_DETAILS && (
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Event Information</h3>
                <p className="text-sm text-slate-500">Provide the core details about the event.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Event Title <span className="text-red-500">*</span></label>
                <input 
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  placeholder="e.g., Spring Career Fair 2024"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Description</label>
                <textarea 
                  className="w-full h-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" 
                  placeholder="Describe the event agenda, speakers, and key takeaways..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">Start Date & Time <span className="text-red-500">*</span></label>
                  <input 
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">End Date & Time <span className="text-red-500">*</span></label>
                  <input 
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  id="all-day" 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  checked={formData.isAllDay}
                  onChange={(e) => updateField('isAllDay', e.target.checked)}
                />
                <label htmlFor="all-day" className="text-sm text-slate-900 dark:text-white cursor-pointer">All day event</label>
              </div>
            </div>
          )}

          {step === FormStep.VENUE_LOGISTICS && (
            <div className="p-6 md:p-8 flex flex-col gap-6 bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Venue & Audience</h3>
                <p className="text-sm text-slate-500">Select where the event will happen and who should attend.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">Building</label>
                  <select 
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.building}
                    onChange={(e) => updateField('building', e.target.value)}
                  >
                    {BUILDINGS.map(b => <option key={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-900 dark:text-white">Room / Hall</label>
                  <select 
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.room}
                    onChange={(e) => updateField('room', e.target.value)}
                  >
                    <option value="">Select a room</option>
                    {selectedBuilding?.rooms.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Target Audience</label>
                <div className="flex flex-wrap gap-2">
                  {formData.audience.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => updateField('audience', formData.audience.filter(t => t !== tag))}
                        className="hover:text-primary/70"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                  <input 
                    className="bg-transparent border-none outline-none text-sm flex-1 min-w-[100px]" 
                    placeholder="Add tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = (e.target as HTMLInputElement).value.trim();
                        if (value && !formData.audience.includes(value)) {
                          updateField('audience', [...formData.audience, value]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 md:p-8 border-t border-slate-200 dark:border-slate-700 flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-white dark:bg-surface-dark">
            <button type="button" className="text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors">
              Cancel
            </button>
            <div className="flex w-full md:w-auto gap-4">
              <button 
                type="button" 
                disabled={step === FormStep.BASIC_DETAILS}
                onClick={() => setStep(FormStep.BASIC_DETAILS)}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (step === FormStep.BASIC_DETAILS) setStep(FormStep.VENUE_LOGISTICS);
                  else handleSubmit();
                }}
                className="flex-1 md:flex-none px-8 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary/90 transition-colors"
              >
                {step === FormStep.BASIC_DETAILS ? 'Next Step' : 'Publish Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreator;
