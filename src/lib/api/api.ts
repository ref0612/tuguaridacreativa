import axios from 'axios';
import store from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';

// Obtener la URL base del backend desde las variables de entorno o usar localhost:3000 por defecto
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Configuración base de axios
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Importante para manejar cookies de autenticación
});

// Interceptor para agregar el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    // Puedes hacer algún procesamiento de respuesta global aquí si es necesario
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 (No autorizado) y no es una solicitud de renovación de token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si es la ruta de login, simplemente rechazamos el error
      if (originalRequest.url.includes('/auth/login') || 
          originalRequest.url.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      // Intentar renovar el token
      try {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          // Hacer una petición para renovar el token
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Actualizar los tokens
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Actualizar el encabezado de autorización
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          // Reintentar la petición original
          return api(originalRequest);
        } else {
          // No hay refresh token, hacer logout
          store.dispatch(logoutUser());
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Error al renovar el token, hacer logout
        store.dispatch(logoutUser());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Manejar otros códigos de error
    if (error.response?.status === 403) {
      // Acceso denegado
      // Podrías redirigir a una página de acceso denegado
      console.error('Acceso denegado: No tienes permisos para acceder a este recurso');
    }
    
    // Para otros errores, simplemente los rechazamos
    return Promise.reject(error);
  }
);

// Exportar métodos HTTP comunes para facilitar su uso
const get = (url: string, config = {}) => api.get(url, config);
const post = (url: string, data: any, config = {}) => api.post(url, data, config);
const put = (url: string, data: any, config = {}) => api.put(url, data, config);
const del = (url: string, config = {}) => api.delete(url, config);

export { get, post, put, del };
export default api;
