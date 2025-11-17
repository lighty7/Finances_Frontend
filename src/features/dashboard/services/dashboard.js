import api from '../../../shared/services/api';

export const fetchTransactions = async (params = {}) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const createTransaction = async (payload) => {
  const response = await api.post('/transactions', payload);
  return response.data;
};

export const updateTransaction = async (id, payload) => {
  const response = await api.put(`/transactions/${id}`, payload);
  return response.data;
};

export const fetchLoanSummary = async () => {
  const response = await api.get('/config/summary');
  return response.data;
};


