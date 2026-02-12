import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services';

enum FormStep {
  BASIC_DETAILS = 1,
  VENUE_LOGISTICS = 2,
}

interface EventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  maxParticipants: number | undefined;
  audience: string[];
  posterUrl: string;
  themeColor: string;
  isFeedbackEnabled: boolean;
}

const EventCreator: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<FormStep>(FormStep.BASIC_DETAILS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    maxParticipants: undefined,
    audience: ['All Students'],
    posterUrl: '',
    themeColor: '#6366f1',
    isFeedbackEnabled: false,
  });

  const updateField = <K extends keyof EventData>(field: K, value: EventData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep1 = () => {
    if (!formData.title.trim()) {
      setError('Event title is required');
      return false;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!formData.endDate) {
      setError('End date is required');
      return false;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date must be after start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (publish: boolean = false) => {
    if (!validateStep1()) return;

    try {
      setSubmitting(true);
      setError(null);

      // Create the event
        const event = await eventService.createEvent({
        title: formData.title,
        description: formData.description || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        venue: formData.venue || undefined,
        maxParticipants: formData.maxParticipants,
        posterUrl: formData.posterUrl || undefined,
        themeColor: formData.themeColor || undefined,
        isFeedbackEnabled: formData.isFeedbackEnabled,
      });

      // Publish if requested
      if (publish) {
        await eventService.publishEvent(event.id);
      }

      // Navigate back to dashboard
      navigate(-1);
    } catch (err: unknown) {
      console.error('Failed to create event:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
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
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300 flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center gap-4">
        {[
          { step: FormStep.BASIC_DETAILS, label: 'Basic Details' },
          { step: FormStep.VENUE_LOGISTICS, label: 'Venue & Options' },
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
            </div>
          )}

          {step === FormStep.VENUE_LOGISTICS && (
            <div className="p-6 md:p-8 flex flex-col gap-6 bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Venue & Options</h3>
                <p className="text-sm text-slate-500">Configure additional event settings.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Venue</label>
                <input 
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  placeholder="e.g., Main Auditorium, Room 101, etc."
                  value={formData.venue}
                  onChange={(e) => updateField('venue', e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Max Participants</label>
                <input 
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  type="number"
                  min="1"
                  placeholder="Leave empty for unlimited"
                  value={formData.maxParticipants || ''}
                  onChange={(e) => updateField('maxParticipants', e.target.value ? parseInt(e.target.value) : undefined)}
                />
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

              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-md font-bold mb-4 text-slate-900 dark:text-white">Visuals & Feedback</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-white">Poster URL</label>
                    <input 
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      placeholder="https://..."
                      value={formData.posterUrl || ''}
                      onChange={(e) => updateField('posterUrl', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-white">Theme Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color"
                        value={formData.themeColor || '#6366f1'}
                        onChange={(e) => updateField('themeColor', e.target.value)}
                        className="h-12 w-12 p-0 border-0 rounded cursor-pointer"
                      />
                      <input 
                        className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                        value={formData.themeColor || '#6366f1'}
                        onChange={(e) => updateField('themeColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-surface-dark">
                  <input 
                    type="checkbox"
                    id="feedback-toggle"
                    checked={formData.isFeedbackEnabled}
                    onChange={(e) => updateField('isFeedbackEnabled', e.target.checked)}
                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                  />
                  <div>
                    <label htmlFor="feedback-toggle" className="font-semibold text-slate-900 dark:text-white block cursor-pointer">Enable Feedback Collection</label>
                    <p className="text-xs text-slate-500">Allow students to rate and review this event after it ends.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 md:p-8 border-t border-slate-200 dark:border-slate-700 flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-white dark:bg-surface-dark">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="text-slate-500 font-medium text-sm hover:text-slate-700 transition-colors"
            >
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
              {step === FormStep.BASIC_DETAILS ? (
                <button 
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(FormStep.VENUE_LOGISTICS);
                  }}
                  className="flex-1 md:flex-none px-8 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary/90 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <>
                  <button 
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit(false)}
                    className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                  <button 
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit(true)}
                    className="flex-1 md:flex-none px-8 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting && <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>}
                    {submitting ? 'Publishing...' : 'Publish Event'}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreator;
