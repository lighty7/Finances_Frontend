import api from '../../../shared/services/api';
import { setToken, setUser, removeToken, removeUser } from '../../../shared/utils/helpers';

/**
 * Register a new user
 */
export const register = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

/**
 * Login user
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { token, user } = response.data;
  
  // Store token and user
  setToken(token);
  setUser(user);
  
  return response.data;
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    removeToken();
    removeUser();
  }
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token) => {
  const response = await api.post('/users/verify-email', { token });
  return response.data;
};

/**
 * Resend verification email
 */
export const resendVerification = async (emailId) => {
  const response = await api.post('/users/resend-verification', { emailId });
  return response.data;
};

/**
 * Get current user info
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/verify');
  return response.data;
};

