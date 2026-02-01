
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Placeholder routes for other nav items */}
          <Route path="/users" element={<div className="p-10">Users Management Screen</div>} />
          <Route path="/faculty" element={<div className="p-10">Faculty Management Screen</div>} />
          <Route path="/facilities" element={<div className="p-10">Facilities Management Screen</div>} />
          <Route path="/events" element={<div className="p-10">Events Management Screen</div>} />
          <Route path="/logs" element={<div className="p-10">Full Audit Logs</div>} />
          <Route path="/settings" element={<div className="p-10">Settings Screen</div>} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
