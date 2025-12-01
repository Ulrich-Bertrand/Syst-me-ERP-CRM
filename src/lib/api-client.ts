import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuration de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Créer instance axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur de requêtes (ajouter token JWT)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Récupérer token du localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses (gestion erreurs globales)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Gestion erreurs globales
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Permissions insuffisantes
      console.error('Accès refusé:', error.response.data);
    }
    
    if (error.response?.status === 500) {
      // Erreur serveur
      console.error('Erreur serveur:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// Types de réponses API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any[];
  };
}

// Helper pour gérer les erreurs
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Une erreur est survenue';
};
