import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login/recruiter" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default ProtectedRoute;
