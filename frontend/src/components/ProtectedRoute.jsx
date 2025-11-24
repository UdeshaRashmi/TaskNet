import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  console.log('ProtectedRoute check:', { isAuthenticated });
  
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('Authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;

