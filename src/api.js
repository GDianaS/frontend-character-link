import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// WORKS
export const workService = {
  getAll: () => api.get('/works'),
  getById: (id) => api.get(`/works/${id}`),
  create: (data) => api.post('/works', data),
  update: (id, data) => api.patch(`/works/${id}`, data),
  delete: (id) => api.delete(`/works/${id}`),
  getCharacters: (id) => api.get(`/works/${id}/characters`),
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

export default api;