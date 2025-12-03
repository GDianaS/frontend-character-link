import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login se não autenticado
      const isGuest = localStorage.getItem('isGuest') === 'true';
      if (!isGuest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// WORKS
export const workService = {
  getAll: () => api.get('/works'),
  getById: (id) => api.get(`/works/${id}`),

   // Estatísticas e obras recentes
  getStats: () => api.get('/works/user/stats'),
  getRecent: (limit = 5) => api.get(`/works/user/recent?limit=${limit}`),
  
  // ATUALIZADO: Aceitar FormData
  create: (data) => {
    // Se for FormData, não definir Content-Type (axios define automaticamente)
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    
    return api.post('/works', data, config);
  },
  
  update: (id, data) => {
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    
    return api.patch(`/works/${id}`, data, config);
  },
  
  delete: (id) => api.delete(`/works/${id}`),
  getCharacters: (id) => api.get(`/works/${id}/characters`),
  
  // Favoritos
  addFavorite: (id) => api.post(`/works/${id}/favorite`),
  removeFavorite: (id) => api.delete(`/works/${id}/favorite`),
  getFavorites: () => api.get('/works/favorites'),
};


// CHARACTERS
export const characterService = {
  getAll: () => api.get('/characters'),
  getById: (id) => api.get(`/characters/${id}`),
  create: (data) => api.post('/characters', data),
  createForWork: (workId, data) => api.post(`/characters/work/${workId}`, data),
  update: (id, data) => api.patch(`/characters/${id}`, data),
  delete: (id) => api.delete(`/characters/${id}`),
  
  // Relacionamentos
  addRelationship: (characterId, data) => 
    api.post(`/characters/${characterId}/relationships`, data),
  removeRelationship: (characterId, relationshipId) => 
    api.delete(`/characters/${characterId}/relationships/${relationshipId}`),
  
  // Grafos
  getNetwork: (characterId, maxDepth = 2) => 
    api.get(`/characters/${characterId}/network?maxDepth=${maxDepth}`),
  getByRelationshipType: (characterId, type) => 
    api.get(`/characters/${characterId}/relationships/type?type=${type}`),
  getStats: (characterId) => 
    api.get(`/characters/${characterId}/stats`),
  findShortestPath: (sourceId, targetId) => 
    api.get(`/characters/${sourceId}/path/${targetId}`),
};

// CHARTS
export const chartService = {
  // Públicos
  getAll: () => api.get('/charts'),
  getById: (id) => api.get(`/charts/${id}`),
  getByWork: (workId) => api.get(`/charts/work/${workId}`),
  
  // Requer autenticação
  getMyCharts: () => api.get('/charts/my/charts'),
  getRecent: (limit = 5) => api.get(`/charts/user/recent?limit=${limit}`),
  create: (data) => api.post('/charts', data),
  update: (id, data) => api.patch(`/charts/${id}`, data),
  delete: (id) => api.delete(`/charts/${id}`),
  saveSnapshot: (id, data) => api.post(`/charts/${id}/snapshot`, data),
};

export default api;