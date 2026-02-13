
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, counsellingService, studentService } from '../../services';
import LoadingScreen from '../../components/shared/LoadingScreen';
import { Search, UserMinus, ChevronRight } from 'lucide-react';
import { Student } from '../../types';

// Assignments are managed per student
const AdminMentorship = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);

  // Fetch Students
  const { data: studentsResponse, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students', page],
    queryFn: () => studentService.getStudents(page, 20),
  });

  // Fetch Counsellors (Teachers who are counsellors)
  const { data: counsellors, isLoading: isLoadingCounsellors } = useQuery({
    queryKey: ['counsellors'],
    queryFn: async () => {
      const allTeachers = await userService.getAllTeachers();
      return allTeachers.filter(t => t.isCounsellor);
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ studentId, counsellorId }: { studentId: string; counsellorId: string | null }) =>
      counsellingService.assignCounsellor(studentId, counsellorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setShowAssignModal(false);
      setSelectedStudent(null);
    },
  });

  if (isLoadingStudents || isLoadingCounsellors) return <LoadingScreen />;

  const students = studentsResponse?.data || [];

  const handleAssignClick = (student: Student) => {
    setSelectedStudent(student);
    setShowAssignModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Mentorship Assignments
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
           <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">Assigned Counsellor</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students
                .filter(s => 
                   s.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   s.rollNumber.includes(searchTerm)
                )
                .map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {student.user?.firstName} {student.user?.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{student.rollNumber}</td>
                  <td className="px-6 py-4 text-gray-500">Year {student.enrollmentYear}</td>
                  <td className="px-6 py-4">
                    {student.counsellor ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {student.counsellor.user?.firstName} {student.counsellor.user?.lastName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleAssignClick(student as unknown as Student)}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
                    >
                      {student.counsellor ? 'Change' : 'Assign'} <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Showing page {page}</span>
            <div className="flex gap-2">
                <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button 
                     onClick={() => setPage(p => p + 1)}
                     className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-scale-in">
            <h3 className="text-lg font-bold mb-4">
              Assign Counsellor to {selectedStudent.user?.firstName}
            </h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <button
                onClick={() => assignMutation.mutate({ studentId: selectedStudent.id, counsellorId: null })}
                className="w-full text-left px-4 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
              >
                <UserMinus className="w-5 h-5" />
                <span className="font-medium">Unassign Current Counsellor</span>
              </button>

              <div className="h-px bg-gray-100 my-2" />
              
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Available Counsellors</p>
              
              {counsellors?.map((counsellor) => (
                <button
                  key={counsellor.id}
                  onClick={() => assignMutation.mutate({ studentId: selectedStudent.id, counsellorId: counsellor.id })}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                    selectedStudent.counsellorId === counsellor.id
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {counsellor.user?.firstName[0]}
                  </div>
                  <div>
                    <span className="font-medium block">{counsellor.user?.firstName} {counsellor.user?.lastName}</span>
                    <span className="text-xs text-gray-500">{counsellor.employeeId}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMentorship;
