// Helper functions

/**
 * Get token from localStorage
 */
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Set token in localStorage
 */
export const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

/**
 * Get user from localStorage
 */
export const getUser = () => {
  const user = localStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
};

/**
 * Set user in localStorage
 */
export const setUser = (user) => {
  localStorage.setItem('auth_user', JSON.stringify(user));
};

/**
 * Remove user from localStorage
 */
export const removeUser = () => {
  localStorage.removeItem('auth_user');
};

/**
 * Clear all auth data
 */
export const clearAuth = () => {
  removeToken();
  removeUser();
};

/**
 * Format error message from API response
 */
export const formatErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An error occurred. Please try again.';
};

/**
 * Format validation errors from API response
 */
export const formatValidationErrors = (error) => {
  if (error.response?.data?.details) {
    const details = error.response.data.details;
    if (Array.isArray(details)) {
      const errors = {};
      details.forEach((detail) => {
        if (detail.path) {
          errors[detail.path] = detail.msg || detail.message;
        }
      });
      return errors;
    }
  }
  return {};
};

