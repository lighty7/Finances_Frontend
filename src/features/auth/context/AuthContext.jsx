import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUser, getToken, setUser, setToken, clearAuth } from '../../../shared/utils/helpers';
import * as authService from '../services/auth';
import * as configurationService from '../../confiiguration/services/configuration';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);

  // Check configuration status
  const checkConfiguration = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsConfigured(false);
      return false;
    }

    try {
      setConfigLoading(true);
      const response = await configurationService.checkConfigurationStatus();
      setIsConfigured(response.isConfigured || false);
      return response.isConfigured || false;
    } catch (error) {
      console.error('Error checking configuration:', error);
      setIsConfigured(false);
      return false;
    } finally {
      setConfigLoading(false);
    }
  }, []);

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
          // Check configuration status after verifying token
          await checkConfiguration();
        } catch (error) {
          // Token is invalid, clear auth
          clearAuth();
          setUserState(null);
          setTokenState(null);
          setIsAuthenticated(false);
          setIsConfigured(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [checkConfiguration]);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUserState(data.user);
      setTokenState(data.token);
      setIsAuthenticated(true);
      
      // Check configuration status after login
      await checkConfiguration();
      
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
    setIsConfigured(false);
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
    isConfigured,
    configLoading,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    checkConfiguration,
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

