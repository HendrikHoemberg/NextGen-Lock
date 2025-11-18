import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
}

// RFID Cards API
export const cardsAPI = {
  getAll: () => api.get('/cards'),
  getById: (cardId) => api.get(`/cards/${cardId}`),
  getByUserId: (userId) => api.get(`/users/${userId}/cards`),
  create: (cardData) => api.post('/cards', cardData),
  update: (cardId, cardData) => api.put(`/cards/${cardId}`, cardData),
  delete: (cardId) => api.delete(`/cards/${cardId}`),
  authorize: (cardId) => api.patch(`/cards/${cardId}/authorize`),
  revoke: (cardId) => api.patch(`/cards/${cardId}/revoke`),
  verify: (cardId) => api.get(`/cards/${cardId}/verify`),
}

// Access Logs API
export const logsAPI = {
  getAll: (params) => api.get('/logs', { params }),
  getById: (id) => api.get(`/logs/${id}`),
  getRecent: (limit = 10) => api.get(`/logs/recent?limit=${limit}`),
}

export default api
