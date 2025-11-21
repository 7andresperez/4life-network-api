import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const affiliatesAPI = {
  getAll: () => api.get('/affiliates'),
  getById: (id) => api.get(`/affiliates/${id}`),
  search: (query) => api.get('/affiliates/search', { params: { q: query } }),
  getHierarchy: (id, maxLevel = 3) => 
    api.get(`/affiliates/${id}/hierarchy`, { params: { maxLevel } }),
  getDescendants: (id) => api.get(`/affiliates/${id}/descendants`),
  getReportByLevels: (id) => api.get(`/affiliates/${id}/report`),
  getRanks: () => api.get('/affiliates/ranks'),
  create: (data) => api.post('/affiliates', data),
  update: (id, data) => api.put(`/affiliates/${id}`, data),
  delete: (id) => api.delete(`/affiliates/${id}`),
};

export const csvAPI = {
  import: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/csv/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  export: (id) => {
    return api.get('/csv/export', {
      params: { id },
      responseType: 'blob',
    });
  },
};

export default api;

