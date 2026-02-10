import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, getPrimaryRole } from './context/AuthContext';
import { UserRole } from './types';

// Pages
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/shared/Layout';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';

// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard';
import AttendanceMarking from './pages/faculty/Attendance';
import NotesUpload from './pages/faculty/NotesUpload';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import GrievanceManagement from './pages/admin/Grievances';
import OrganizerDashboard from './pages/admin/OrganizerDashboard';
import UserManagement from './pages/admin/UserManagement';
import Broadcast from './pages/admin/Broadcast';

// Student Feature Pages
import StudentGrievances from './pages/student/Grievances';
import MaintenanceRequests from './pages/student/MaintenanceRequests';
import StudentNotes from './pages/student/Notes';

// Shared Pages
import Notifications from './pages/shared/Notifications';
import Schedule from './pages/shared/Schedule';
import EventCreator from './pages/shared/EventCreator';

// Loading spinner component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-500 dark:text-slate-400 font-medium">Loading...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role access if roles are specified
  if (allowedRoles && user) {
    const hasAccess = user.roles.some(role => allowedRoles.includes(role));
    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Role-based redirect after login
const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  const primaryRole = getPrimaryRole(user.roles);
  
  switch (primaryRole) {
    case 'STUDENT':
      return <Navigate to="/student/dashboard" replace />;
    case 'TEACHER':
      return <Navigate to="/faculty/dashboard" replace />;
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'ORGANIZER':
      return <Navigate to="/organizer/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <RoleBasedRedirect /> : <LoginPage />} 
      />

      {/* Protected routes with shared layout */}
      <Route 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/schedule" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Schedule />
          </ProtectedRoute>
        } />
        <Route path="/student/notifications" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/student/grievances" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentGrievances />
          </ProtectedRoute>
        } />
        <Route path="/student/maintenance" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <MaintenanceRequests />
          </ProtectedRoute>
        } />
        <Route path="/student/notes" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentNotes />
          </ProtectedRoute>
        } />

        {/* Faculty/Teacher Routes */}
        <Route path="/faculty/dashboard" element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <FacultyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/faculty/attendance" element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <AttendanceMarking />
          </ProtectedRoute>
        } />
        <Route path="/faculty/schedule" element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <Schedule />
          </ProtectedRoute>
        } />
        <Route path="/faculty/notifications" element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/faculty/notes" element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <NotesUpload />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/grievances" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <GrievanceManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'ORGANIZER']}>
            <EventCreator />
          </ProtectedRoute>
        } />
        <Route path="/admin/organizer" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/broadcast" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Broadcast />
          </ProtectedRoute>
        } />

        {/* Organizer Routes */}
        <Route path="/organizer/dashboard" element={
          <ProtectedRoute allowedRoles={['ORGANIZER']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/organizer/events" element={
          <ProtectedRoute allowedRoles={['ORGANIZER']}>
            <EventCreator />
          </ProtectedRoute>
        } />
        <Route path="/organizer/notifications" element={
          <ProtectedRoute allowedRoles={['ORGANIZER']}>
            <Notifications />
          </ProtectedRoute>
        } />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
