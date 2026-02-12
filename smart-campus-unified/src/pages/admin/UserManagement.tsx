import React, { useState, useEffect } from 'react';
import { userService } from '../../services';
import { User, UserRole } from '../../types';

const ROLES: { label: string; value: UserRole | 'ALL' }[] = [
  { label: 'All Users', value: 'ALL' },
  { label: 'Students', value: 'STUDENT' },
  { label: 'Faculty', value: 'TEACHER' },
  { label: 'Admins', value: 'ADMIN' },
  { label: 'Organizers', value: 'ORGANIZER' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create user form state
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '', roles: ['STUDENT'] as string[],
    registrationNumber: '', departmentId: '', year: '1', section: 'A', employeeId: ''
  });

  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = roleFilter === 'ALL'
        ? await userService.getUsers(page, 15)
        : await userService.getUsersByRole(roleFilter, page, 15);
      setUsers(result.data);
      setTotalPages(result.meta.totalPages);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      // We use getClasses to extract unique departments since there isn't a direct public endpoint
      // This is a safe workaround to get valid department IDs
      const classes = await import('../../services').then(m => m.timetableService.getClasses());
      const uniqueDepts = new Map<string, { id: string; name: string }>();
      
      classes.forEach(c => {
        if (c.department) {
          uniqueDepts.set(c.department.id, { id: c.department.id, name: c.department.name });
        }
      });
      
      setDepartments(Array.from(uniqueDepts.values()));
    } catch (err) {
      console.error('Failed to fetch departments', err);
    }
  };

  useEffect(() => { setPage(1); }, [roleFilter]);
  useEffect(() => { 
    fetchUsers(); 
    fetchDepartments();
  }, [page, roleFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      // Prepare payload based on role
      const payload: any = { ...form };
      
      // Clean up fields based on role
      if (form.roles[0] === 'STUDENT') {
        payload.year = parseInt(form.year);
        // Ensure departmentId is set
        if (!payload.departmentId) throw new Error('Department is required');
      } else if (form.roles[0] === 'TEACHER') {
        if (!payload.departmentId) throw new Error('Department is required');
        delete payload.registrationNumber;
        delete payload.year;
        delete payload.section;
      } else {
        delete payload.registrationNumber;
        delete payload.departmentId;
        delete payload.year;
        delete payload.section;
        delete payload.employeeId;
      }

      await userService.createUser(payload);
      setShowCreateModal(false);
      setForm({ 
        email: '', password: '', firstName: '', lastName: '', phone: '', roles: ['STUDENT'],
        registrationNumber: '', departmentId: '', year: '1', section: 'A', employeeId: ''
      });
      setSuccessMsg('User created successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchUsers();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  // ... (handlers for deactivate/reactivate/delete remain same)
  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await userService.deactivateUser(id);
      setSuccessMsg('User deactivated');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchUsers();
    } catch (err) { console.error('Failed to deactivate:', err); }
  };

  const handleReactivate = async (id: string) => {
    try {
      await userService.reactivateUser(id);
      setSuccessMsg('User reactivated');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchUsers();
    } catch (err) { console.error('Failed to reactivate:', err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return;
    try {
      await userService.deleteUser(id);
      setSuccessMsg('User deleted');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchUsers();
    } catch (err) { console.error('Failed to delete:', err); }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'TEACHER': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'STUDENT': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'ORGANIZER': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">people</span>
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all campus users and roles</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add User
        </button>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2 text-green-700 dark:text-green-400">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* Role filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {ROLES.map((r) => (
          <button
            key={r.value}
            onClick={() => setRoleFilter(r.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              roleFilter === r.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full mx-auto" />
            <p className="text-slate-500 mt-3 text-sm">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">group_off</span>
            <p className="text-slate-500 dark:text-slate-400 mt-2">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Roles</th>
                  <th className="text-right p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</p>
                          {user.phone && <p className="text-xs text-slate-500">{user.phone}</p>}
                          {user.studentProfile?.registrationNumber && <p className="text-xs text-slate-500">Reg: {user.studentProfile.registrationNumber}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {user.roles?.map((role) => (
                          <span key={role} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getRoleBadgeColor(role)}`}>
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 font-medium transition-colors"
                          title="Deactivate"
                        >
                          Deactivate
                        </button>
                        <button
                          onClick={() => handleReactivate(user.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 font-medium transition-colors"
                          title="Reactivate"
                        >
                          Reactivate
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-medium transition-colors"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New User</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text" required value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text" required value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                <input
                  type="password" required minLength={6} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input
                  type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role *</label>
                <select
                  value={form.roles[0]}
                  onChange={(e) => setForm({ ...form, roles: [e.target.value] })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Faculty</option>
                  <option value="ADMIN">Admin</option>
                  <option value="ORGANIZER">Organizer</option>
                </select>
              </div>

              {/* Dynamic Fields */}
              {(form.roles[0] === 'STUDENT' || form.roles[0] === 'TEACHER') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Branch / Department *</label>
                  <select
                    required
                    value={form.departmentId}
                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="">Select Branch</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {form.roles[0] === 'STUDENT' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year *</label>
                      <select
                        required
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      >
                        <option value="1">Year 1 (FE)</option>
                        <option value="2">Year 2 (SE)</option>
                        <option value="3">Year 3 (TE)</option>
                        <option value="4">Year 4 (BE)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section *</label>
                      <select
                        required
                        value={form.section}
                        onChange={(e) => setForm({ ...form, section: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registration Number *</label>
                    <input
                      type="text" required
                      value={form.registrationNumber}
                      onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="e.g. IT2024001"
                    />
                  </div>
                </>
              )}

              {form.roles[0] === 'TEACHER' && (
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employee ID (Optional)</label>
                    <input
                      type="text"
                      value={form.employeeId}
                      onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="e.g. EMP001"
                    />
                  </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {creating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
