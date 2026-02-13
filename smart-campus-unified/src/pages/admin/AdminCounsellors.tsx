
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, counsellingService } from '../../services';
import LoadingScreen from '../../components/shared/LoadingScreen';
import { UserCheck, UserX, Search, Plus, X } from 'lucide-react';

const AdminCounsellors = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearchTerm, setAddSearchTerm] = useState('');

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => userService.getAllTeachers(),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      counsellingService.toggleCounsellor(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setShowAddModal(false);
    },
    onError: (error: any) => {
      console.error('Failed to toggle counsellor status:', error);
      alert('Failed to update counsellor status. Please try again.');
    }
  });

  if (isLoading) return <LoadingScreen />;

  const filteredTeachers = teachers?.filter((teacher) => {
    const matchesSearch =
      teacher.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Default view: Show only counsellors or those matching search if search is active?
    // User request implies managing counsellors. Let's show all for now, but emphasize counsellors.
    return matchesSearch;
  });

  // For Add Modal: Show only NON-counsellors
  const potentialCounsellors = teachers?.filter(t => !t.isCounsellor && (
      t.user?.firstName.toLowerCase().includes(addSearchTerm.toLowerCase()) ||
      t.user?.lastName.toLowerCase().includes(addSearchTerm.toLowerCase()) ||
      t.employeeId.includes(addSearchTerm)
  ));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
             Counsellor Management
           </h1>
           <p className="text-gray-500 text-sm mt-1">Manage faculty members assigned as student counsellors</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
            <Plus className="w-5 h-5" />
            Add Counsellor
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search counsellors..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers?.filter(t => t.isCounsellor || searchTerm).map((teacher) => (
          <div
            key={teacher.id}
            className={`relative group bg-white p-6 rounded-2xl border transition-all duration-300 ${
              teacher.isCounsellor
                ? 'border-green-200 shadow-md shadow-green-500/5'
                : 'border-gray-200 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    teacher.isCounsellor ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {teacher.user?.firstName[0]}
                  {teacher.user?.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {teacher.user?.firstName} {teacher.user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{teacher.employeeId}</p>
                </div>
              </div>
              
               <button
                  onClick={() => toggleStatusMutation.mutate({ id: teacher.id, status: !teacher.isCounsellor })}
                  disabled={toggleStatusMutation.isPending}
                  className={`p-2 rounded-lg transition-colors ${
                    teacher.isCounsellor
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                  title={teacher.isCounsellor ? "Remove Counsellor" : "Make Counsellor"}
                >
                  {teacher.isCounsellor ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                </button>
            </div>

            <div className="space-y-2">
                 {teacher.departmentId && (
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Department:</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{teacher.departmentId.split('-')[0]}...</span> 
                     </div>
                 )}
                 <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        teacher.isCounsellor 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                        {teacher.isCounsellor ? 'Active Counsellor' : 'Standard Faculty'}
                    </span>
                 </div>
            </div>
          </div>
        ))}

        {filteredTeachers?.filter(t => t.isCounsellor || searchTerm).length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            No counsellors found. Click "Add Counsellor" to assign one.
          </div>
        )}
      </div>

      {/* Add Counsellor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl animate-scale-in flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Counsellor</h2>
                    <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search faculty..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={addSearchTerm}
                        onChange={(e) => setAddSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                    {potentialCounsellors?.map(teacher => (
                        <div key={teacher.id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                    {teacher.user?.firstName[0]}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{teacher.user?.firstName} {teacher.user?.lastName}</h4>
                                    <p className="text-xs text-gray-500">{teacher.employeeId}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleStatusMutation.mutate({ id: teacher.id, status: true })}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                    ))}
                    
                    {potentialCounsellors?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No eligible faculty members found.
                        </div>
                    )}
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default AdminCounsellors;
