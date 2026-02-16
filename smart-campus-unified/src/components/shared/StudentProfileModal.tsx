import React, { useEffect, useState } from 'react';
import { userService } from '../../services';

interface StudentProfileModalProps {
  userId: string;
  onClose: () => void;
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ userId, onClose }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserProfile(userId);
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const student = profile.studentProfile;
  const teacher = profile.teacherProfile;
  const organizer = profile.organizerProfile;
  const roles = profile.roles?.map((r: any) => r.role) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-indigo-200 text-sm mt-1">{profile.email}</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl font-bold">×</button>
          </div>
          <div className="flex gap-2 mt-3">
            {roles.map((role: string) => (
              <span key={role} className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold uppercase">
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Contact Info</h3>
            <div className="grid grid-cols-2 gap-3">
              <InfoCard label="Email" value={profile.email} />
              <InfoCard label="Phone" value={profile.phone || 'Not provided'} />
            </div>
          </section>

          {/* Student Profile */}
          {student && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Academic Info</h3>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="Roll Number" value={student.rollNumber} />
                <InfoCard label="Registration No." value={student.registrationNumber} />
                <InfoCard label="Class" value={student.class?.name || '-'} />
                <InfoCard label="Department" value={student.class?.department?.name || '-'} />
                <InfoCard label="Year" value={`Year ${student.class?.year || '-'}`} />
                <InfoCard label="Section" value={student.class?.section || '-'} />
              </div>

              {/* Club Memberships */}
              {student.clubMemberships && student.clubMemberships.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Club Memberships</h4>
                  <div className="flex flex-wrap gap-2">
                    {student.clubMemberships.map((m: any) => (
                      <span
                        key={m.club.id}
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: m.club.themeColor || '#6366f1' }}
                      >
                        {m.club.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Teacher Profile */}
          {teacher && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Faculty Info</h3>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="Employee ID" value={teacher.employeeId} />
                <InfoCard label="Department" value={teacher.department?.name || '-'} />
              </div>
            </section>
          )}

          {/* Organizer Profile */}
          {organizer?.club && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Organizer Info</h3>
              <InfoCard label="Manages Club" value={organizer.club.name} />
            </section>
          )}

          <div className="text-xs text-gray-400 text-center pt-2 border-t dark:border-gray-700">
            Account created: {new Date(profile.createdAt).toLocaleDateString()}
            {' · '}
            Status: <span className={profile.isActive ? 'text-green-500' : 'text-red-500'}>
              {profile.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    <div className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{value}</div>
  </div>
);

export default StudentProfileModal;
