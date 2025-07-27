// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/check', {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setUser(response.data.user);
        setIsAdminAuthenticated(response.data.user.isAdmin || false);
      } catch (err) {
        console.error('Auth check error:', err);
        setIsAuthenticated(false);
        setIsAdminAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password, isAdmin = false) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/auth/login${isAdmin ? '/admin' : ''}`,
        { email, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      setUser(response.data.user);
      setIsAdminAuthenticated(response.data.user.isAdmin);
      return response.data;
    } catch (err) {
      throw err.response?.data?.error || 'Login failed';
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setIsAdminAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdminAuthenticated,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};