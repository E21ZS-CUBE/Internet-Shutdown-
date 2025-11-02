// frontend/src/utils/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Shutdowns API
export const shutdownsAPI = {
  getAll: (params) => api.get('/shutdowns', { params }),
  getById: (id) => api.get(`/shutdowns/${id}`),
  getByState: (stateName) => api.get(`/shutdowns/state/${stateName}`),
  create: (data) => api.post('/shutdowns', data)
};

// States API
export const statesAPI = {
  getAll: () => api.get('/states'),
  getDetails: (stateName) => api.get(`/states/details/${stateName}`),
  getCounts: (type = 'ALL') => api.get('/states/counts/all', { params: { type } })
};

// Statistics API
export const statisticsAPI = {
  getOverall: (type = 'ALL') => api.get('/statistics', { params: { type } }),
  getReasons: (type = 'ALL') => api.get('/statistics/reasons', { params: { type } }),
  getTimeline: (type = 'ALL') => api.get('/statistics/timeline', { params: { type } })
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;