import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Main App Component
 * Handles routing and authentication
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Default route - redirect to recruiter login */}
          <Route path="/" element={<Navigate to="/login/recruiter" replace />} />
          
          {/* Login routes */}
          <Route path="/login/:role" element={<Login />} />
          
          {/* Protected dashboard routes */}
          <Route 
            path="/dashboard/recruiter" 
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard/candidate" 
            element={
              <ProtectedRoute requiredRole="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login/recruiter" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
