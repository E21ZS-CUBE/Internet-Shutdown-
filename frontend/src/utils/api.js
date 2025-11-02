import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const shutdownsAPI = {
  getAll: (params) => api.get('/shutdowns', { params }),
  getById: (id) => api.get(`/shutdowns/${id}`),
  getByState: (stateName) => api.get(`/shutdowns/state/${stateName}`),
  create: (data) => api.post('/shutdowns', data)
};

export const statesAPI = {
  getAll: () => api.get('/states'),
  getDetails: (stateName) => api.get(`/states/details/${stateName}`),
  getCounts: (type = 'ALL') => api.get('/states/counts/all', { params: { type } })
};

export const statisticsAPI = {
  getOverall: (type = 'ALL') => api.get('/statistics', { params: { type } }),
  getReasons: (type = 'ALL') => api.get('/statistics/reasons', { params: { type } }),
  getTimeline: (type = 'ALL') => api.get('/statistics/timeline', { params: { type } })
};

export const ooniAPI = {
  getMeasurements: (params) => api.get('/ooni/measurements', { params }),
  getAggregation: (params) => api.get('/ooni/aggregation', { params }),
  getDetectedShutdowns: (days = 7) => api.get('/ooni/detected-shutdowns', { params: { days } }),
  getFormattedShutdowns: (days = 7) => api.get('/ooni/shutdowns-formatted', { params: { days } })
};

export const sflcAPI = {
  getShutdowns: () => api.get('/sflc/shutdowns')
};

export const cloudflareAPI = {
  getOutages: (params) => api.get('/cloudflare/outages', { params }),
  getAnalytics: () => api.get('/cloudflare/analytics'),
  getFormattedOutages: () => api.get('/cloudflare/outages-formatted')
};

export const healthCheck = () => api.get('/health');

export default api;
