// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import { Loader } from '../home/Loader';

export const ProtectedRoute = ({ isAdminRoute = false }) => {
  const { isAuthenticated, isAdminAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    // return <div>Loading...</div>;
    return <Loader/>;
  }

  if (!isAuthenticated) {
    return <Navigate to={isAdminRoute ? '/login/admin' : '/login'} replace />;
  }

  if (isAdminRoute && !isAdminAuthenticated) {
    return <Navigate to="/login/admin" replace />;
  }
  if(!isAdminRoute && !isAuthenticated){
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};