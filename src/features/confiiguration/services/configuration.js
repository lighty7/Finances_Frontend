import api from '../../../shared/services/api';

/**
 * Get user's configuration
 */
export const getConfiguration = async () => {
  const response = await api.get('/config');
  return response.data;
};

/**
 * Check if user has configured
 */
export const checkConfigurationStatus = async () => {
  const response = await api.get('/config/status');
  return response.data;
};

/**
 * Create or update user configuration
 * @param {Object} configData - Configuration data
 * @param {number} [configData.totalEmi] - Total EMI amount
 * @param {number} [configData.numberOfLoans] - Number of loans
 * @param {Array} [configData.emiSchedule] - EMI schedule array
 * @param {number} [configData.income] - Monthly income
 */
export const createOrUpdateConfiguration = async (configData) => {
  const response = await api.post('/config', configData);
  return response.data;
};

/**
 * Update user configuration
 * @param {Object} configData - Configuration data
 */
export const updateConfiguration = async (configData) => {
  const response = await api.put('/config', configData);
  return response.data;
};

