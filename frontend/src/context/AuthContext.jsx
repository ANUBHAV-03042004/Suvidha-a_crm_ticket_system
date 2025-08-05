import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { debounce } from 'lodash';
import { Loader } from '../home/Loader';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const lastAuthCheck = useRef({ isAdmin: null, timestamp: 0 });

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://suvidha-backend-app.azurewebsites.net';
  console.log('API_URL initialized:', API_URL);

  // Create axios instance for consistent configuration
  const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const checkAuth = useCallback(
    debounce(async (isAdmin) => {
      const now = Date.now();
      if (
        lastAuthCheck.current.isAdmin === isAdmin &&
        now - lastAuthCheck.current.timestamp < 5000
      ) {
        console.log('Skipping auth check due to recent call:', {
          isAdmin,
          timeSinceLast: now - lastAuthCheck.current.timestamp,
        });
        setIsLoading(false);
        return;
      }

      try {
        const endpoint = isAdmin ? '/api/admin/check' : '/api/auth/check';
        console.log('Checking auth at:', `${API_URL}${endpoint}`);
        const response = await axiosInstance.get(endpoint);
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

  useEffect(() => {
    const cachedAuth = localStorage.getItem('authState');
    if (cachedAuth) {
      try {
        const { user, isAuthenticated } = JSON.parse(cachedAuth);
        console.log('Loaded cached auth state:', { user, isAuthenticated });
        if (!user || user === null || typeof user !== 'object') {
          console.warn('Invalid cached auth state, clearing localStorage');
          localStorage.removeItem('authState');
          setIsAuthenticated(false);
          setUser(null);
        } else {
          setUser(user);
          setIsAuthenticated(isAuthenticated);
        }
      } catch (err) {
        console.error('Error parsing cached auth state:', err);
        localStorage.removeItem('authState');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    // Always verify with server on mount
    const isAdminPage = location.pathname.includes('/admin');
    checkAuth(isAdminPage);
  }, [checkAuth, location.pathname]);

  const setAuthAfterLogin = useCallback(
    async (redirect, userData, isAdmin = false) => {
      try {
        console.log('Setting auth after login:', { redirect, user: userData, isAdmin });
        setUser({ ...userData, isAdmin });
        setIsAuthenticated(true);
        localStorage.setItem('authState', JSON.stringify({ user: { ...userData, isAdmin }, isAuthenticated: true }));
        navigate(redirect || (isAdmin ? '/admin-dashboard' : '/user-dashboard'), { replace: true });
      } catch (err) {
        console.error('Set auth error:', err);
        throw new Error('Failed to set authentication state');
      }
    },
    [navigate]
  );

  const login = useCallback(
    async (email, password, secretCode, redirect) => {
      try {
        console.log('Login attempt:', { email, endpoint: secretCode ? '/api/auth/login/admin' : '/api/auth/login' });
        const endpoint = secretCode ? '/api/auth/login/admin' : '/api/auth/login';
        const payload = secretCode ? { email, password, secretCode } : { email, password };
        const response = await axiosInstance.post(endpoint, payload);
        console.log('Login response:', response.data);
        await setAuthAfterLogin(redirect, response.data.user, !!secretCode);
        return response.data;
      } catch (err) {
        console.error('Login error:', err.response?.data || err.message);
        throw new Error(err.response?.data?.error || 'Login failed');
      }
    },
    [setAuthAfterLogin]
  );

  const logout = useCallback(async () => {
    try {
      console.log('Logging out, using API_URL:', API_URL);
      await axiosInstance.post('/api/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authState');
      navigate(user?.isAdmin ? '/login/admin' : '/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.error || 'Logout failed');
    }
  }, [user, navigate]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setAuthAfterLogin, login, logout, checkAuth }}>
      {isLoading && (
          <div><Loader/></div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);