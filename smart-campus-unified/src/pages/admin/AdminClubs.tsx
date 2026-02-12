
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { clubService, Club } from '../../services/clubService';
import LoadingScreen from '../../components/shared/LoadingScreen';

// Mocking User Fetch for now or using a simple input for email
// Ideally we should have a user search dropdown

const AdminClubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assigningClubId, setAssigningClubId] = useState<string | null>(null);
  
  const { register, handleSubmit, reset } = useForm<{ name: string; description: string }>();
  const [assignEmail, setAssignEmail] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const data = await clubService.getAllClubs();
      setClubs(data);
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const onCreateSubmit = async (data: { name: string; description: string }) => {
    try {
      await clubService.createClubAdmin(data);
      alert('Club created successfully');
      setShowCreateModal(false);
      reset();
      fetchClubs();
    } catch (error) {
      console.error('Failed to create club:', error);
      alert('Failed to create club');
    }
  };

  const onAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningClubId || !assignEmail) return;
    
    try {
      await clubService.assignOrganizer(assigningClubId, assignEmail);
      alert('Organizer assigned successfully');
      setAssigningClubId(null);
      setAssignEmail('');
      fetchClubs();
    } catch (error: any) {
      console.error('Failed to assign:', error);
      alert(error.response?.data?.message || 'Failed to assign organizer');
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Club Management</h1>
           <p className="text-slate-500 text-sm">Create clubs and assign organizers.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          New Club
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Club Name</th>
                <th className="px-6 py-4">Organizer</th>
                <th className="px-6 py-4">Theme</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {clubs.map((club) => (
                <tr key={club.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-white">{club.name}</div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">{club.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    {club.organizer ? (
                      <div>
                        <div className="font-medium text-slate-700 dark:text-slate-300">
                          {club.organizer.user.firstName} {club.organizer.user.lastName}
                        </div>
                        <div className="text-xs text-slate-500">{club.organizer.user.email}</div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: club.themeColor || '#ccc' }} />
                       <span className="text-xs text-slate-500">{club.themeColor || 'Default'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setAssigningClubId(club.id)}
                      className="text-primary hover:underline font-semibold text-xs"
                    >
                      {club.organizer ? 'Reassign' : 'Assign Organizer'}
                    </button>
                    {/* Could add delete button here later */}
                  </td>
                </tr>
              ))}
              {clubs.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No clubs found. Create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">Create New Club</h2>
              <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Club Name</label>
                    <input {...register('name', { required: true })} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" placeholder="e.g. Robotics Club" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea {...register('description')} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" placeholder="Club description..." rows={3} />
                 </div>
                 <div className="flex gap-3 justify-end mt-6">
                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold">Create</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Assign Modal */}
      {assigningClubId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">Assign Organizer</h2>
              <form onSubmit={onAssignSubmit} className="space-y-4">
                 <p className="text-sm text-slate-500">Enter the email of the organizer. They must have the 'ORGANIZER' role and not manage another club.</p>
                 <div>
                    <label className="block text-sm font-medium mb-1">Organizer Email</label>
                    <input 
                      type="email" 
                      value={assignEmail} 
                      onChange={e => setAssignEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" 
                      required 
                      placeholder="organizer@ait.edu" 
                    />
                 </div>
                 <div className="flex gap-3 justify-end mt-6">
                    <button type="button" onClick={() => setAssigningClubId(null)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold">Assign</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminClubs;
