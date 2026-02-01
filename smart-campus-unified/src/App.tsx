import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/shared/Layout';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';

// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard';
import AttendanceMarking from './pages/faculty/Attendance';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import GrievanceManagement from './pages/admin/Grievances';
import OrganizerDashboard from './pages/admin/OrganizerDashboard';

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
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role-based redirect after login
const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'Student':
      return <Navigate to="/student/dashboard" replace />;
    case 'Faculty':
      return <Navigate to="/faculty/dashboard" replace />;
    case 'Admin':
      return <Navigate to="/admin/dashboard" replace />;
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
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/schedule" element={<Schedule />} />
        <Route path="/student/notifications" element={<Notifications />} />

        {/* Faculty Routes */}
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/attendance" element={<AttendanceMarking />} />
        <Route path="/faculty/schedule" element={<Schedule />} />
        <Route path="/faculty/notifications" element={<Notifications />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/grievances" element={<GrievanceManagement />} />
        <Route path="/admin/events" element={<EventCreator />} />
        <Route path="/admin/organizer" element={<OrganizerDashboard />} />
        <Route path="/admin/notifications" element={<Notifications />} />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
