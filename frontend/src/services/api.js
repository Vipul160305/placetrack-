import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('placement_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto-logout on 401 responses (expired / invalid token)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('placement_token');
            localStorage.removeItem('placement_user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

// Users
export const userAPI = {
    getMe: () => api.get('/users/me'),
    updateMe: (data) => api.put('/users/me', data),
    uploadResume: (formData) =>
        api.post('/users/me/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    delete: (id) => api.delete(`/users/${id}`),
};

// Companies
export const companyAPI = {
    getAll: () => api.get('/companies'),
    create: (data) => api.post('/companies', data),
    getById: (id) => api.get(`/companies/${id}`),
    update: (id, data) => api.put(`/companies/${id}`, data),
    delete: (id) => api.delete(`/companies/${id}`),
    getEligibleStudents: (id) => api.get(`/companies/${id}/eligible-students`),
};

// Applications
export const applicationAPI = {
    apply: (companyId) => api.post('/applications', { companyId }),
    getMine: () => api.get('/applications/me'),
    getAll: () => api.get('/applications'),
    getByCompany: (companyId) => api.get(`/applications/company/${companyId}`),
    updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
};

// Analytics
export const analyticsAPI = {
    get: () => api.get('/analytics'),
};

export default api;
