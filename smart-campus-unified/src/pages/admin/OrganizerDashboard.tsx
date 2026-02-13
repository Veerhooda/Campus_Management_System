import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/shared/StatCard';
import { eventService, clubService } from '../../services';
import { CampusEvent } from '../../types';

interface Deadline {
  id: string;
  title: string;
  dueText: string;
  dueColor: string;
}

const MOCK_DEADLINES: Deadline[] = [
  { id: '1', title: 'Submit Budget for Fall Fest', dueText: 'Due Today', dueColor: 'orange' },
  { id: '2', title: 'Finalize Guest List for Dean\'s Dinner', dueText: 'Due Tomorrow', dueColor: 'slate' },
  { id: '3', title: 'Confirm Catering for Jazz Night', dueText: 'Due Oct 30', dueColor: 'slate' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'DRAFT': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'COMPLETED': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'Active';
    case 'DRAFT': return 'Draft';
    case 'CANCELLED': return 'Cancelled';
    case 'COMPLETED': return 'Completed';
    default: return status;
  }
};

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [club, setClub] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // AI Suggestions State
  const [aiSuggestions, setAiSuggestions] = useState<{title: string; description: string}[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Feedback State
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{ averageRating: number; reviews: any[] } | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard data...');
        const [eventsData, clubData] = await Promise.all([
          eventService.getEvents(1, 20),
          clubService.getMyClub(),
        ]);
        
        console.log('Dashboard Data:', { eventsData, clubData });

        if (eventsData && eventsData.data) {
             setEvents(eventsData.data);
        }
        
        if (clubData) {
            setClub(clubData);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewFeedback = async (eventId: string) => {
    try {
      setFeedbackLoading(true);
      setShowFeedbackModal(true);
      const data = await eventService.getFeedback(eventId);
      setFeedbackData(data);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      alert('Failed to load feedback');
      setShowFeedbackModal(false);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleGenerateAiSuggestions = async () => {
    setIsLoadingAi(true);
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAiSuggestions([
      { title: 'Wellness Week', description: 'A week-long series of activities focusing on mental and physical health awareness for students.' },
      { title: 'International Food Festival', description: 'Celebrate diversity with cuisines from around the world, featuring student clubs and local vendors.' },
      { title: 'Tech Innovation Day', description: 'Showcase student projects and invite industry speakers to share insights on emerging technologies.' },
    ]);
    setIsLoadingAi(false);
  };

  // Mini Calendar Component Helper
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const eventDays = events.map(e => new Date(e.startDateTime).getDate());

  // Stats
  const activeEvents = events.filter(e => e.status === 'PUBLISHED').length;
  // Calculate total registrations from events if available, else mock
  const totalRegistrations = events.reduce((acc, curr) => acc + (curr._count?.registrations || 0), 0); 

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Organizer Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage events and registrations.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateAiSuggestions}
            disabled={isLoadingAi}
            className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 transition-all px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm border border-indigo-200 dark:border-indigo-800 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[20px] ${isLoadingAi ? 'animate-spin' : ''}`}>
              {isLoadingAi ? 'autorenew' : 'psychology'}
            </span>
            {isLoadingAi ? 'Thinking...' : 'AI Suggestions'}
          </button>
          <button 
            onClick={() => navigate('/organizer/events')}
            className="bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create New Event
          </button>
        </div>
      </div>

       {/* Club Profile Card */}
       {club && (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative group">
           <div className="h-32 w-full bg-slate-200 relative">
              {club.bgUrl && <img src={club.bgUrl} alt="Cover" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
           </div>
           
           <div className="px-6 pb-6 relative flex justify-between items-end -mt-12">
              <div className="flex items-end gap-5">
                 <div className="w-24 h-24 rounded-full border-4 border-white dark:border-surface-dark bg-white shadow-md overflow-hidden flex items-center justify-center">
                    {club.logoUrl ? (
                       <img src={club.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                       <span className="text-3xl font-bold text-primary">{club.name ? club.name[0] : '?'}</span>
                    )}
                 </div>
                 <div className="mb-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white drop-shadow-sm shadow-black/50 sm:text-slate-900 sm:drop-shadow-none">{club.name || 'Your Club'}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">@{club.instagram || 'ait_club'}</p>
                 </div>
              </div>
              
              <button 
                onClick={() => navigate('/organizer/club')}
                className="mb-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                 <span className="material-symbols-outlined text-[18px]">edit</span>
                 Edit Profile
              </button>
           </div>
           
           <div className="px-6 pb-6 pt-2">
              <p className="text-slate-600 dark:text-slate-300 max-w-3xl">{club.description || 'Welcome to your club dashboard. Complete your profile to attract more members.'}</p>
           </div>
        </div>
       )}

      {/* AI Suggestions Section */}
      {aiSuggestions.length > 0 && (
        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-indigo-700 dark:text-indigo-400">
            <span className="material-symbols-outlined filled">auto_awesome</span>
            <h3 className="font-bold text-lg">AI Event Suggestions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiSuggestions.map((s, idx) => (
              <div key={idx} className="bg-white dark:bg-surface-dark p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{s.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{s.description}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setAiSuggestions([])}
            className="mt-4 text-xs text-indigo-600 font-medium hover:underline"
          >
            Dismiss Suggestions
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Registrations" value={loading ? '...' : totalRegistrations.toString()} trend="+12%" icon="how_to_reg" colorClass="text-primary" bgClass="bg-primary/10" />
        <StatCard label="Feedback Score" value="4.8" icon="star" colorClass="text-yellow-600" bgClass="bg-yellow-50 dark:bg-yellow-900/20" />
        <StatCard label="Active Events" value={loading ? '...' : activeEvents.toString()} trend="+2" icon="event_available" colorClass="text-purple-600" bgClass="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Events Table */}
        <div className="xl:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Events</h3>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">event</span>
              <p className="text-slate-500 dark:text-slate-400">No events yet. Create your first event!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3 text-left">Event</th>
                    <th className="px-5 py-3 text-left">Date & Time</th>
                    <th className="px-5 py-3 text-left">Venue</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {events.slice(0, 5).map(event => (
                    <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{event.title}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {new Date(event.startDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(event.startDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{event.venue || 'TBD'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                        {(event.status === 'COMPLETED' || event.isFeedbackEnabled) && (
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleViewFeedback(event.id); }} 
                             className="ml-2 text-xs text-primary hover:text-blue-700 font-semibold hover:underline"
                           >
                             View Feedback
                           </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Calendar */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
              {days.map(day => (
                <div 
                  key={day} 
                  className={`py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                    day === currentDate.getDate() 
                      ? 'bg-primary text-white font-bold' 
                      : eventDays.includes(day) 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Deadlines */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_DEADLINES.map(deadline => (
                <div key={deadline.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{deadline.title}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    deadline.dueColor === 'orange' 
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {deadline.dueText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
             {/* Modal Header */}
             <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Event Feedback</h2>
                <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-600">
                   <span className="material-symbols-outlined">close</span>
                </button>
             </div>
             
             {/* Modal Body */}
             <div className="p-6 overflow-y-auto">
                {feedbackLoading ? (
                   <div className="flex flex-col items-center py-12">
                       <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-2">autorenew</span>
                       <p className="text-slate-500">Loading feedback...</p>
                   </div>
                ) : !feedbackData || feedbackData.reviews.length === 0 ? (
                   <div className="text-center py-12">
                       <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">reviews</span>
                       <p className="text-slate-500">No feedback received for this event yet.</p>
                   </div>
                ) : (
                   <div className="space-y-6">
                      {/* Score Summary */}
                      <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                         <div className="text-4xl font-black text-yellow-600 dark:text-yellow-500">
                            {feedbackData.averageRating.toFixed(1)}
                         </div>
                         <div>
                            <div className="flex text-yellow-500 text-lg">
                               {'★'.repeat(Math.round(feedbackData.averageRating))}{'☆'.repeat(5 - Math.round(feedbackData.averageRating))}
                            </div>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">Average Rating from {feedbackData.reviews.length} students</p>
                         </div>
                      </div>

                      {/* Review List */}
                      <div className="space-y-4">
                         <h3 className="font-bold text-slate-900 dark:text-white">Recent Reviews</h3>
                         {feedbackData.reviews.map((review: any) => (
                            <div key={review.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                               <div className="flex justify-between mb-2">
                                  <span className="font-bold text-sm text-slate-900 dark:text-white">Student</span>
                                  <div className="flex text-yellow-500 text-xs">
                                     {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                  </div>
                               </div>
                               {review.comment ? (
                                   <p className="text-sm text-slate-600 dark:text-slate-300">"{review.comment}"</p>
                               ) : (
                                  <p className="text-xs italic text-slate-400">No comment provided.</p>
                               )}
                               <p className="text-xs text-slate-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
