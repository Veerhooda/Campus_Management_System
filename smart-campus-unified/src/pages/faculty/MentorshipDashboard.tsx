
import { useQuery } from '@tanstack/react-query';
import { counsellingService } from '../../services';
import LoadingScreen from '../../components/shared/LoadingScreen';
import { Users, Mail, Phone, Calendar, BookOpen } from 'lucide-react';

const MentorshipDashboard = () => {
  const { data: mentees, isLoading, error } = useQuery({
    queryKey: ['my-mentees'],
    queryFn: () => counsellingService.getMyMentees(),
    retry: false,
  });

  if (isLoading) return <LoadingScreen />;

  // Handle case where teacher is not a counsellor
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Not a Counsellor</h2>
        <p className="text-gray-500 max-w-sm">
          You are not currently registered as a counsellor. Please contact the administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            My Mentorship Batch
          </h1>
          <p className="text-gray-500 mt-1">
            Managing {mentees?.length || 0} assigned students
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentees?.map((mentee: any) => (
          <div key={mentee.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {mentee.user?.firstName?.[0] || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{mentee.user?.firstName} {mentee.user?.lastName}</h3>
                  <p className="text-xs text-gray-500 font-mono">{mentee.rollNumber}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                   Year {mentee.enrollmentYear}
                 </span>
                 {mentee.attendanceStats && (
                    <span className={`px-2 py-1 text-xs rounded-lg font-bold border ${
                        mentee.attendanceStats.percentage >= 75 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : mentee.attendanceStats.percentage >= 60
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                        {Math.round(mentee.attendanceStats.percentage)}% Attendance
                    </span>
                 )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{mentee.user?.email || 'No email'}</span>
              </div>
              {mentee.user?.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{mentee.user.phone}</span>
                </div>
              )}
              {mentee.class && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span>{mentee.class.department?.code} - {mentee.class.year}{mentee.class.section}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors">
                    <Calendar className="w-4 h-4" />
                    Log Session
                </button>
                <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                    View Profile
                </button>
            </div>
          </div>
        ))}

        {mentees?.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed">
                No students assigned to you yet.
            </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipDashboard;
