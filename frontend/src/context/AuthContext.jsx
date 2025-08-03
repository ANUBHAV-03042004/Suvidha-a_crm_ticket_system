import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { debounce } from 'lodash';
import {Loader} from '../home/Loader';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const lastAuthCheck = useRef({ isAdmin: null, timestamp: 0 });

  // Debounce checkAuth to prevent rapid API calls
  const checkAuth = useCallback(
    debounce(async (isAdmin) => {
      const now = Date.now();
      if (
        lastAuthCheck.current.isAdmin === isAdmin &&
        now - lastAuthCheck.current.timestamp < 5000
      ) {
        console.log('Skipping auth check due to recent call:', { isAdmin, timeSinceLast: now - lastAuthCheck.current.timestamp });
        setIsLoading(false);
        return;
      }

      try {
        const endpoint = isAdmin ? '/api/admin/check' : '/api/auth/check';
        console.log('Checking auth at:', `${API_URL}${endpoint}`);
        const response = await axios.get(`${API_URL}${endpoint}`, { withCredentials: true });
        console.log('Auth check response:', response.data);
        setUser(response.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('authState', JSON.stringify({ user: response.data.user, isAuthenticated: true }));
        lastAuthCheck.current = { isAdmin, timestamp: now };
      } catch (err) {
        console.error('Auth check error:', err.response?.data || err.message);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authState');
        const publicRoutes = [
          '/',
          '/login',
          '/login/admin',
          '/register',
          '/register/admin',
          '/otp-verify',
          '/forgot',
          '/reset',
        ];
        const currentPath = location.pathname;
        const isPublicRoute = publicRoutes.some((route) => {
          if (route === '/reset' || route === '/reset/admin') {
            return currentPath.startsWith(route);
          }
          return currentPath === route;
        });
        if (!isPublicRoute) {
          console.log('No authenticated user/admin, redirecting to:', isAdmin ? '/login/admin' : '/login');
          navigate(isAdmin ? '/login/admin' : '/login', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [navigate, location.pathname, API_URL]
  );

  // Load cached auth state on mount
  useEffect(() => {
    const cachedAuth = localStorage.getItem('authState');
    if (cachedAuth) {
      const { user, isAuthenticated } = JSON.parse(cachedAuth);
      console.log('Loaded cached auth state:', { user, isAuthenticated });
      setUser(user);
      setIsAuthenticated(isAuthenticated);
      setIsLoading(false);
    }
  }, []);

  // Check auth on pathname change
  useEffect(() => {
    const isAdminPage = location.pathname.includes('/admin');
    checkAuth(isAdminPage);
  }, [location.pathname, checkAuth]);

  const setAuthAfterLogin = useCallback(
    async (redirect, userData, isAdmin = false) => {
      try {
        console.log('Setting auth after login:', { redirect, user: userData, isAdmin });
        setUser({ ...userData, isAdmin });
        setIsAuthenticated(true);
        localStorage.setItem('authState', JSON.stringify({ user: { ...userData, isAdmin }, isAuthenticated: true }));
        // navigate(redirect, { replace: true }); 
       navigate(redirect || (isAdmin ? '/admin-dashboard' : '/user-dashboard'), { replace: true });
      } catch (err) {
        console.error('Set auth error:', err);
        throw new Error('Failed to set authentication state');
      }
    },
    [navigate]
  );

const logout = useCallback(async () => {
    try {
      // Use a single logout endpoint for all users
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authState');
      // Navigate based on user type (if user exists)
      navigate(user?.isAdmin ? '/login/admin' : '/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.error || 'Logout failed');
    }
  }, [navigate, API_URL, user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setAuthAfterLogin, logout, checkAuth }}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"><Loader/></div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);