import React, { useState, useEffect } from 'react';
import { eventService, notificationService } from '../../services';
import { CampusEvent } from '../../types';
import LoadingScreen from '../../components/shared/LoadingScreen';
import { useAuth } from '../../context/AuthContext';

type Tab = 'upcomming' | 'my-events';

const StudentEvents: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('upcomming');
  const [upcomingEvents, setUpcomingEvents] = useState<CampusEvent[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<(CampusEvent & { attended: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      if (activeTab === 'upcomming') {
        const data = await eventService.getUpcoming(1, 100);
        setUpcomingEvents(data.data);
      } else {
        const data = await eventService.getMyRegistrations();
        setMyRegistrations(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      setActionLoading(eventId);
      await eventService.register(eventId);
      await notificationService.create({
        title: 'Event Registration',
        message: 'You have successfully registered for the event.',
        type: 'EVENT',
        userId: user?.id || '',
      });
      alert('Registered successfully!');
      fetchEvents(); // Refresh
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return;
    try {
      setActionLoading(eventId);
      await eventService.unregister(eventId);
      alert('Registration cancelled.');
      fetchEvents();
    } catch (error) {
      console.error('Unregistration failed:', error);
      alert('Failed to cancel registration.');
    } finally {
      setActionLoading(null);
    }
  };

  const openFeedbackModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setRating(5);
    setComment('');
    setFeedbackModalOpen(true);
  };

  const submitFeedback = async () => {
    if (!selectedEventId) return;
    try {
      // We need to call the API endpoint.
      // Since eventService in data.ts might not have submitFeedback, we will use api directly or add it.
      // Ideally update data.ts, but for now I'll assume we updated it or use fetch.
      // Wait, I SHOULD update data.ts to include submitFeedback.
      // For now, let's assume I'll add it in next step or use a direct call if needed.
      // I'll add it to data.ts in the next step.
      
      // Temporary direct fetch for robustnes in this file content
      const token = localStorage.getItem('ait_access_token');
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/events/${selectedEventId}/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ rating, comment })
        }).then(async res => {
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed');
            }
        });

      alert('Feedback submitted! Thank you.');
      setFeedbackModalOpen(false);
    } catch (error: any) {
      console.error('Feedback failed:', error);
      alert(error.message || 'Failed to submit feedback. Ensure you attended the event.');
    }
  };

  if (loading && !upcomingEvents.length && !myRegistrations.length) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campus Events</h1>
          <p className="text-slate-500 dark:text-slate-400">Discover and participate in college activities.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'upcomming' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          onClick={() => setActiveTab('upcomming')}
        >
          Upcoming Events
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'my-events' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          onClick={() => setActiveTab('my-events')}
        >
          My Registrations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeTab === 'upcomming' && upcomingEvents.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            actionLabel="Register"
            onAction={() => handleRegister(event.id)}
            loading={actionLoading === event.id}
          />
        ))}

        {activeTab === 'my-events' && myRegistrations.map(event => (
          <EventCard 
            key={event.id} 
            event={event}
            isRegistered
            registration={event}
            actionLabel={event.attended ? (event.isFeedbackEnabled ? "Give Feedback" : "Attended") : "Cancel Registration"}
            onAction={() => {
                if (event.attended && event.isFeedbackEnabled) {
                    openFeedbackModal(event.id);
                } else if(!event.attended) {
                    handleUnregister(event.id);
                }
            }}
            loading={actionLoading === event.id}
            disabled={event.attended && !event.isFeedbackEnabled}
          />
        ))}
        
        {!loading && ((activeTab === 'upcomming' && upcomingEvents.length === 0) || (activeTab === 'my-events' && myRegistrations.length === 0)) && (
             <div className="col-span-full py-12 text-center text-slate-500">
                 <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                 <p>No events found.</p>
             </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in relative">
            <button 
                onClick={() => setFeedbackModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
                <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="text-xl font-bold mb-4">Event Feedback</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
                How was your experience? Your feedback helps us improve future events.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-slate-300'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Comments (Optional)</label>
                    <textarea 
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-slate-800"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts..."
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={() => setFeedbackModalOpen(false)}
                        className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={submitFeedback}
                        className="flex-1 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-primary/20"
                    >
                        Submit Feedback
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for Event Card
const EventCard: React.FC<{ 
    event: CampusEvent & { attended?: boolean; isFeedbackEnabled?: boolean; posterUrl?: string; themeColor?: string }; 
    actionLabel: string; 
    onAction: () => void; 
    loading?: boolean; 
    isRegistered?: boolean;
    registration?: any;
    disabled?: boolean;
}> = ({ event, actionLabel, onAction, loading, isRegistered, disabled }) => {
    const isPast = new Date(event.endDateTime) < new Date();

    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full group">
            {/* Poster / Header */}
            <div className="h-40 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {event.posterUrl ? (
                    <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400">
                        <span className="material-symbols-outlined text-4xl">event</span>
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {new Date(event.startDateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                {/* Theme Stripe */}
                {event.themeColor && <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: event.themeColor }} />}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white line-clamp-1">{event.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{event.description || 'No description provided.'}</p>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span>{event.venue || 'TBA'}</span>
                </div>

                <button 
                    onClick={onAction}
                    disabled={loading || disabled || (isPast && !isRegistered)}
                    className={`w-full py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                        disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                        isRegistered ? 
                            (event.attended ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-50 text-red-600 hover:bg-red-100') 
                            : 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20'
                    }`}
                >
                    {loading && <span className="material-symbols-outlined animate-spin text-[16px]">autorenew</span>}
                    {actionLabel}
                </button>
            </div>
        </div>
    );
};

export default StudentEvents;
