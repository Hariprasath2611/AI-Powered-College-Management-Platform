import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultDash = user.role === 'ADMIN' 
      ? '/admin' 
      : user.role === 'FACULTY' 
        ? '/faculty' 
        : '/student';
    return <Navigate to={defaultDash} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
