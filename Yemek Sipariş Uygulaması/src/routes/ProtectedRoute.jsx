import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Route protection guard checks authentication state and handles role-based routing access.
 * 
 * @param {object} props
 * @param {string[]} props.allowedRoles - Array of roles allowed (e.g. ['admin', 'business'])
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isLogin, user } = useSelector((state) => state.auth);

  if (!isLogin || !user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Authenticated but unauthorized role, redirect to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized, render nested child route components
  return <Outlet />;
}
