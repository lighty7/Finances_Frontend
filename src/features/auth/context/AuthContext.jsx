import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getToken, setUser, setToken, clearAuth } from '../../../shared/utils/helpers';
import * as authService from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken && storedUser) {
        setTokenState(storedToken);
        setUserState(storedUser);
        setIsAuthenticated(true);

        // Verify token is still valid
        try {
          await authService.getCurrentUser();
        } catch (error) {
          // Token is invalid, clear auth
          clearAuth();
          setUserState(null);
          setTokenState(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUserState(data.user);
      setTokenState(data.token);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: error.message },
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: error.message },
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUserState(null);
    setTokenState(null);
    setIsAuthenticated(false);
  };

  const verifyEmail = async (token) => {
    try {
      const data = await authService.verifyEmail(token);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: error.message },
      };
    }
  };

  const resendVerification = async (emailId) => {
    try {
      const data = await authService.resendVerification(emailId);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: error.message },
      };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

