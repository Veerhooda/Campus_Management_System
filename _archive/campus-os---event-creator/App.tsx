
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { StepIndicator } from './components/EventForm/StepIndicator';
import { EventData, FormStep } from './types';
import { BUILDINGS } from './constants';
import { smartFillEvent } from './services/geminiService';

const initialEventData: EventData = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  isAllDay: false,
  building: 'Main Library',
  room: 'Grand Auditorium (Conflict)',
  audience: ['All Students', 'Faculty'],
  bannerUrl: null,
};

const App: React.FC = () => {
  const [step, setStep] = useState<FormStep>(FormStep.BASIC_DETAILS);
  const [formData, setFormData] = useState<EventData>(initialEventData);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const updateField = <K extends keyof EventData>(field: K, value: EventData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSmartFill = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const suggestedData = await smartFillEvent(aiPrompt);
      setFormData(prev => ({ ...prev, ...suggestedData }));
      setAiPrompt('');
    } finally {
      setIsAiLoading(false);
    }
  };

  const addAudienceTag = (tag: string) => {
    if (!tag.trim() || formData.audience.includes(tag)) return;
    updateField('audience', [...formData.audience, tag]);
  };

  const removeAudienceTag = (tag: string) => {
    updateField('audience', formData.audience.filter(t => t !== tag));
  };

  return (
    <Layout>
      <div className="layout-content-container flex flex-col max-w-[960px] w-full mx-auto flex-1 gap-6">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <a className="text-[#616f89] dark:text-[#9ca3af] hover:text-primary transition-colors font-medium" href="#">Dashboard</a>
          <span className="material-symbols-outlined text-[16px] text-[#9ca3af]">chevron_right</span>
          <a className="text-[#616f89] dark:text-[#9ca3af] hover:text-primary transition-colors font-medium" href="#">Events</a>
          <span className="material-symbols-outlined text-[16px] text-[#9ca3af]">chevron_right</span>
          <span className="text-[#111318] dark:text-white font-semibold">Create New Event</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Create New Event</h1>
            <p className="text-[#616f89] dark:text-[#9ca3af] text-base font-normal">Schedule activities and reserve venues for the campus community.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#dbdfe6] dark:border-[#2d3748] bg-white dark:bg-[#1a202c] text-[#111318] dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#2d3748] transition-colors">
              <span className="material-symbols-outlined text-[20px]">visibility</span>
              Preview
            </button>
          </div>
        </div>

        {/* AI Smart Fill Section */}
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-4 rounded-xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="text-sm font-bold uppercase tracking-wider">AI Smart Fill</span>
          </div>
          <div className="flex gap-2">
            <input 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSmartFill()}
              placeholder="Describe your event (e.g., 'Career fair next Friday from 2-5pm at the Library auditorium')"
              className="flex-1 rounded-lg border border-primary/20 bg-white dark:bg-[#1a202c] px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
            />
            <button 
              onClick={handleSmartFill}
              disabled={isAiLoading}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isAiLoading ? 'Analyzing...' : 'Auto-Fill'}
            </button>
          </div>
        </div>

        <StepIndicator currentStep={step} />

        {/* Main Form Content */}
        <div className="rounded-xl bg-white dark:bg-[#1a202c] shadow-md border border-[#f0f2f4] dark:border-[#2d3748] overflow-hidden">
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            {step === FormStep.BASIC_DETAILS && (
              <div className="p-6 md:p-8 flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-[#111318] dark:text-white">Event Information</h3>
                  <p className="text-sm text-[#616f89] dark:text-[#9ca3af]">Provide the core details about the event.</p>
                </div>

                <div className="grid gap-6">
                  {/* Event Title */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#111318] dark:text-white text-sm font-semibold">Event Title <span className="text-red-500">*</span></label>
                    <input 
                      className="w-full rounded-lg border border-[#dbdfe6] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] px-4 py-3 text-[#111318] dark:text-white placeholder-[#616f89] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                      placeholder="e.g., Spring Career Fair 2024"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#111318] dark:text-white text-sm font-semibold">Description</label>
                    <div className="rounded-lg border border-[#dbdfe6] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                      <div className="flex gap-2 border-b border-[#dbdfe6] dark:border-[#4a5568] px-3 py-2 bg-[#f9fafb] dark:bg-[#1a202c]">
                        <button type="button" className="p-1 text-[#616f89] hover:text-[#111318] dark:hover:text-white rounded"><span className="material-symbols-outlined text-[20px]">format_bold</span></button>
                        <button type="button" className="p-1 text-[#616f89] hover:text-[#111318] dark:hover:text-white rounded"><span className="material-symbols-outlined text-[20px]">format_italic</span></button>
                        <button type="button" className="p-1 text-[#616f89] hover:text-[#111318] dark:hover:text-white rounded"><span className="material-symbols-outlined text-[20px]">format_list_bulleted</span></button>
                        <button type="button" className="p-1 text-[#616f89] hover:text-[#111318] dark:hover:text-white rounded"><span className="material-symbols-outlined text-[20px]">link</span></button>
                      </div>
                      <textarea 
                        className="w-full h-32 p-4 text-[#111318] dark:text-white bg-transparent border-none outline-none resize-none" 
                        placeholder="Describe the event agenda, speakers, and key takeaways..."
                        value={formData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[#111318] dark:text-white text-sm font-semibold">Start Date & Time <span className="text-red-500">*</span></label>
                      <input 
                        className="w-full rounded-lg border border-[#dbdfe6] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] px-4 py-3 text-[#111318] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => updateField('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#111318] dark:text-white text-sm font-semibold">End Date & Time <span className="text-red-500">*</span></label>
                      <input 
                        className="w-full rounded-lg border border-[#dbdfe6] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] px-4 py-3 text-[#111318] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
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
                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={formData.isAllDay}
                      onChange={(e) => updateField('isAllDay', e.target.checked)}
                    />
                    <label htmlFor="all-day" className="text-sm text-[#111318] dark:text-white cursor-pointer select-none">All day event</label>
                  </div>
                </div>
              </div>
            )}

            {step === FormStep.VENUE_LOGISTICS && (
              <div className="p-6 md:p-8 flex flex-col gap-8 bg-[#fbfbfc] dark:bg-[#131823]">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-[#111318] dark:text-white">Venue & Audience</h3>
                  <p className="text-sm text-[#616f89] dark:text-[#9ca3af]">Select where the event will happen and who should attend.</p>
                </div>

                {/* Conflict Warning Banner (Static logic based on mock input) */}
                {formData.room.includes('Conflict') && (
                  <div className="flex gap-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 items-start">
                    <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 mt-0.5">warning</span>
                    <div className="flex flex-col gap-1">
                      <p className="text-orange-800 dark:text-orange-200 text-sm font-bold">Scheduling Conflict Detected</p>
                      <p className="text-orange-700 dark:text-orange-300 text-sm">The "Grand Auditorium" is currently booked by "Engineering Orientation" on the selected date.</p>
                      <a className="text-orange-800 dark:text-orange-200 text-sm font-medium underline mt-1" href="#">View Schedule</a>
                    </div>
                  </div>
                )}

                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[#111318] dark:text-white text-sm font-semibold">Building</label>
                      <div className="relative">
                        <select 
                          className="w-full appearance-none rounded-lg border border-[#dbdfe6] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] px-4 py-3 pr-10 text-[#111318] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          value={formData.building}
                          onChange={(e) => updateField('building', e.target.value)}
                        >
                          {BUILDINGS.map(b => <option key={b.id}>{b.name}</option>)}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-3 text-[#616f89] pointer-events-none">expand_more</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#111318] dark:text-white text-sm font-semibold">Room / Hall</label>
                      <div className="relative">
                        <select 
                          className={`w-full appearance-none rounded-lg border ${formData.room.includes('Conflict') ? 'border-red-300 dark:border-red-900' : 'border-[#dbdfe6] dark:border-[#4a5568]'} bg-white dark:bg-[#2d3748] px-4 py-3 pr-10 text-[#111318] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                          value={formData.room}
                          onChange={(e) => updateField('room', e.target.value)}
                        >
                          {BUILDINGS.find(b => b.name === formData.building)?.rooms.map(r => (
                            <option key={r.id} value={r.name}>{r.name}</option>
                          ))}
                        </select>
                        <span className={`material-symbols-outlined absolute right-3 top-3 ${formData.room.includes('Conflict') ? 'text-red-500' : 'text-[#616f89]'} pointer-events-none`}>expand_more</span>
                      </div>
                      {formData.room.includes('Conflict') && (
                        <p className="text-xs text-red-500 mt-1">Please select a different room to resolve conflict.</p>
                      )}
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#111318] dark:text-white text-sm font-semibold">Target Audience</label>
                    <div className="rounded-lg border border-[#dbdfe6] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] p-2 min-h-[56px] flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                      {formData.audience.map(tag => (
                        <div key={tag} className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded text-sm font-medium">
                          {tag}
                          <button type="button" onClick={() => removeAudienceTag(tag)} className="hover:text-primary/70"><span className="material-symbols-outlined text-[16px]">close</span></button>
                        </div>
                      ))}
                      <input 
                        className="bg-transparent border-none outline-none text-sm text-[#111318] dark:text-white flex-1 min-w-[100px] p-1" 
                        placeholder="Add tag..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAudienceTag((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Banner Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#111318] dark:text-white text-sm font-semibold">Event Banner</label>
                    <div className="border-2 border-dashed border-[#dbdfe6] dark:border-[#4a5568] rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#f9fafb] dark:hover:bg-[#2d3748]/50 transition-colors bg-white dark:bg-[#2d3748]">
                      <span className="material-symbols-outlined text-[#616f89] text-4xl mb-2">cloud_upload</span>
                      <p className="text-sm font-medium text-[#111318] dark:text-white">Click to upload or drag and drop</p>
                      <p className="text-xs text-[#616f89] dark:text-[#9ca3af] mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-6 md:p-8 border-t border-[#f0f2f4] dark:border-[#2d3748] flex flex-col-reverse md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1a202c]">
              <button 
                type="button" 
                className="text-[#616f89] dark:text-[#9ca3af] font-medium text-sm hover:text-[#111318] dark:hover:text-white transition-colors"
                onClick={() => setFormData(initialEventData)}
              >
                Cancel
              </button>
              <div className="flex w-full md:w-auto gap-4">
                <button 
                  type="button" 
                  disabled={step === FormStep.BASIC_DETAILS}
                  onClick={() => setStep(FormStep.BASIC_DETAILS)}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-[#dbdfe6] dark:border-[#4a5568] text-[#111318] dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-[#2d3748] transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (step === FormStep.BASIC_DETAILS) setStep(FormStep.VENUE_LOGISTICS);
                    else alert("Event Published Successfully!");
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
    </Layout>
  );
};

export default App;
