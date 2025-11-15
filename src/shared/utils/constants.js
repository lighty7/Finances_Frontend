// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Budget Tracker';

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
};

// Currency Configuration
export const CURRENCY = {
  SYMBOL: '₹',
  CODE: 'INR',
  LOCALE: 'en-IN',
};

/**
 * Format amount as Indian Rupees
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "₹1,234.56")
 */
export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

