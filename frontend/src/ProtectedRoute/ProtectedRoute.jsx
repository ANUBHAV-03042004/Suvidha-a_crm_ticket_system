// src/components/ProtectedRoute.jsx
import React, { useContext , useEffect} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../home/Loader';

export const ProtectedRoute = ({ isAdminRoute }) => {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth(isAdminRoute);
  }, [checkAuth, isAdminRoute]);

  if (isLoading) {
    return <Loader/>;
  }

  if (!isAuthenticated) {
    return <Navigate to={isAdminRoute ? '/login/admin' : '/login'} replace />;
  }

  if (isAdminRoute && !user?.isAdmin) {
    return <Navigate to="/login/admin" replace />;
  }

  return <Outlet />;
};