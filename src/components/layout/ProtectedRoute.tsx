import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/platform';
import { AIOrb } from '../ai/AIOrb';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, role, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A192F] text-white flex flex-col items-center justify-center space-y-4">
        <AIOrb state="thinking" size={60} />
        <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Verifying Role Authorization...
        </p>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  // Role check if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // Redirect based on user's actual role to their own dashboard
      if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
      if (role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
