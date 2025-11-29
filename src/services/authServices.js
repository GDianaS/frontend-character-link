import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Login com Google
  googleLogin: (token) => authApi.post('/google', { token }),
  
  // Verificar sessão
  verifySession: () => authApi.get('/verify'),
  
  // Logout
  logout: () => authApi.post('/logout'),
};

// Interceptor para adicionar token automaticamente
authApi.interceptors.request.use(
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
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default authApi;