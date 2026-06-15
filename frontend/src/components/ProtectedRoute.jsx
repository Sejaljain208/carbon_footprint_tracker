import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/hooks';

export const ProtectedRoute = ({ children }) => {
  const { user, loading, token } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
