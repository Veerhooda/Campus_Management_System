
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { clubService, Club, ClubMember, fileService } from '../../services';
import LoadingScreen from '../../components/shared/LoadingScreen';

interface ClubForm {
  name: string;
  description: string;
  instagram: string;
  themeColor: string;
  logoUrl: string;
  bgUrl: string;
}

const ClubSettings: React.FC = () => {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'members'>('details');
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [addingMember, setAddingMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<ClubForm>();
  
  const watchedLogoUrl = watch('logoUrl');
  const watchedBgUrl = watch('bgUrl');
  const watchedName = watch('name');
  const watchedThemeColor = watch('themeColor');

  useEffect(() => {
    fetchClubData();
  }, []);

  const fetchClubData = async () => {
    try {
      setLoading(true);
      const data = await clubService.getMyClub();
      setClub(data);
      if (data) {
        setValue('name', data.name);
        setValue('description', data.description || '');
        setValue('instagram', data.instagram || '');
        setValue('themeColor', data.themeColor || '#6366f1');
        setValue('logoUrl', data.logoUrl || '');
        setValue('bgUrl', data.bgUrl || '');
        
        if (data.members) {
           setMembers(data.members);
        } else {
           const membersData = await clubService.getMembers();
           setMembers(membersData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch club data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ClubForm) => {
    try {
      await clubService.updateClub(data);
      alert('Club settings updated successfully!');
      fetchClubData(); // Refresh
    } catch (error) {
      console.error('Failed to update club:', error);
      alert('Failed to update club settings');
    }
  };

  const handleFileUpload = async (file: File, type: 'logo' | 'bg') => {
    try {
      if (type === 'logo') setUploadingLogo(true);
      else setUploadingBg(true);

      const record = await fileService.upload(file);
      const url = fileService.getDownloadUrl(record.id);

      if (type === 'logo') setValue('logoUrl', url);
      else setValue('bgUrl', url);
    } catch (e) {
      console.error(e);
      alert('Failed to upload image. Please try again.');
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingBg(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail) return;

    try {
      setAddingMember(true);
      await clubService.addMember(newMemberEmail);
      alert('Member added successfully!');
      setNewMemberEmail('');
      const membersData = await clubService.getMembers();
      setMembers(membersData);
    } catch (error: any) {
      console.error('Failed to add member:', error);
      alert(error.response?.data?.message || 'Failed to add member. Ensure email is correct and user is a student.');
    } finally {
      setAddingMember(false);
    }
  };

  if (loading) return <LoadingScreen />;

  // Initial State if no club exists (Create Mode)
  const clubData = club || {
    name: '',
    description: '',
    instagram: '',
    themeColor: '#6366f1',
    logoUrl: watchedLogoUrl || '',
    bgUrl: watchedBgUrl || '',
    members: [],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {club ? 'Club Settings' : 'Create Your Club'}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          onClick={() => setActiveTab('details')}
        >
          Details & Theme
        </button>
        <button
          disabled={!club}
          className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'members' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'} ${!club ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => club && setActiveTab('members')}
        >
          Members ({members.length})
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit</span>
              {club ? 'Edit Details' : 'Setup Club Profile'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Club Name</label>
                <input {...register('name', { required: true })} placeholder="e.g. Coding Club" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea {...register('description')} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instagram Handle</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">@</span>
                    <input {...register('instagram')} className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" {...register('themeColor')} className="h-10 w-10 p-0 rounded border-0 cursor-pointer" />
                    <input {...register('themeColor')} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold mb-3 text-slate-500">Club Assets</h3>
                <div className="space-y-4">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">Club Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                        {watchedLogoUrl ? (
                          <img src={watchedLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-300">image</span>
                        )}
                      </div>
                      <div>
                        <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${uploadingLogo ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                          {uploadingLogo ? (
                            <>
                              <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[18px]">upload</span>
                              Change Logo
                            </>
                          )}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            disabled={uploadingLogo}
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                          />
                        </label>
                        <p className="text-[10px] text-slate-400 mt-1">Recommended: 200x200px (PNG/JPG)</p>
                      </div>
                    </div>
                    {/* Hidden input to register the field */}
                    <input type="hidden" {...register('logoUrl')} />
                  </div>

                  {/* Background Upload */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">Cover Image</label>
                    <div className="relative h-32 w-full rounded-lg border border-slate-200 bg-slate-50 overflow-hidden group">
                       {watchedBgUrl ? (
                          <img src={watchedBgUrl} alt="Cover" className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl">image</span>
                          </div>
                       )}
                       
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2">
                            {uploadingBg ? (
                              'Uploading...'
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[18px]">upload</span>
                                Change Cover
                              </>
                            )}
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              disabled={uploadingBg}
                              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'bg')}
                            />
                          </label>
                       </div>
                    </div>
                    <input type="hidden" {...register('bgUrl')} />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                {club ? 'Save Changes' : 'Create Club'}
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">visibility</span>
              Card Preview
            </h2>
            
            {/* Club Card Component Simulation */}
            <div className="relative h-48 rounded-xl overflow-hidden shadow-lg group">
               {/* Background */}
               <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
                 {watchedBgUrl && <img src={watchedBgUrl} alt="Club BG" className="w-full h-full object-cover" />}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
               </div>
               
               {/* Content */}
               <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                 <div className="flex items-center gap-4 mb-2">
                   <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white shadow-md">
                     {watchedLogoUrl ? (
                       <img src={watchedLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-primary font-bold bg-slate-100">
                         {(watchedName && watchedName[0]) || '?'}
                       </div>
                     )}
                   </div>
                   <div>
                     <h3 className="font-bold text-xl leading-tight">{watchedName || 'Your Club Name'}</h3>
                     <p className="text-xs text-white/80">{members.length} Members</p>
                   </div>
                 </div>
                 <p className="text-sm text-white/90 line-clamp-2">{clubData.description || 'Club description will appear here.'}</p>
                 
                 {/* Theme Stripe */}
                 <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: watchedThemeColor || '#6366f1' }} />
               </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
              <p className="flex gap-2">
                <span className="material-symbols-outlined text-blue-500">info</span>
                This is how your club will appear to students on the events and clubs page.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-6">
           <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
             <h3 className="font-bold text-lg mb-4">Add Member</h3>
             <form onSubmit={handleAddMember} className="flex gap-4 items-end">
               <div className="flex-1">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student Email</label>
                 <input 
                    type="email" 
                    placeholder="student@ait.edu" 
                    required
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  />
               </div>
               <button 
                type="submit" 
                disabled={addingMember}
                className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
               >
                 {addingMember ? 'Adding...' : 'Add Student'}
               </button>
             </form>
           </div>

           <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
             <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
               <h3 className="font-bold">Club Members</h3>
               <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-400">
                 Total: {members.length}
               </span>
             </div>
             
             {members.length === 0 ? (
               <div className="p-8 text-center text-slate-500">No members found. Add students above.</div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 dark:bg-slate-800/50">
                     <tr>
                       <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Name</th>
                       <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Email</th>
                       <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Joined Date</th>
                       <th className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                     {members.map((member) => (
                       <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                         <td className="px-6 py-3 font-medium text-slate-800 dark:text-white">
                           {member.student?.user?.firstName} {member.student?.user?.lastName}
                         </td>
                         <td className="px-6 py-3 text-slate-600 dark:text-slate-400">{member.student?.user?.email}</td>
                         <td className="px-6 py-3 text-slate-500">{new Date(member.joinedAt).toLocaleDateString()}</td>
                         <td className="px-6 py-3 text-right">
                           <button className="text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

export default ClubSettings;
