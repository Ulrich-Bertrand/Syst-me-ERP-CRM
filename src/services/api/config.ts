import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../../config/api.config';

// Flag pour mode mock (quand API backend n'est pas disponible)
let useMockMode = false;

// Tester la connexion au serveur API
async function testApiConnection(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 2000 });
    return response.status === 200;
  } catch {
    return false;
  }
}

// Initialiser le mode au démarrage
(async () => {
  const isApiAvailable = await testApiConnection();
  if (!isApiAvailable) {
    useMockMode = true;
    console.warn('[API Config] ⚠️ Serveur backend non disponible - Mode MOCK activé');
    console.warn('[API Config] 💡 Pour utiliser l\'API réelle, démarrez le serveur: cd api && npm run dev');
  } else {
    console.log('[API Config] ✅ Serveur backend connecté');
  }
})();

// Getter pour le mode mock
export const isUsingMockMode = () => useMockMode;

// Setter pour basculer manuellement
export const setMockMode = (enabled: boolean) => {
  useMockMode = enabled;
  console.log(`[API Config] Mode ${enabled ? 'MOCK' : 'API'} activé`);
};

// Créer instance axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur request : ajouter token automatiquement
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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

// Intercepteur response : gérer erreurs globalement
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expiré ou invalide
    if (error.response?.status === 401) {
      // Nettoyer storage et rediriger vers login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('user_agence');
      localStorage.removeItem('user_langue');
      
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper pour construire query params
export const buildQueryParams = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, String(params[key]));
    }
  });
  
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

// Helper pour gérer erreurs API
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Une erreur est survenue';
};

export default apiClient;