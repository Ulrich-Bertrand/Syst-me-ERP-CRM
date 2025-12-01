import apiClient, { ApiResponse, ApiListResponse } from '../../lib/api-client';

export const stockApi = {
  // ========== ARTICLES ==========

  /**
   * GET /api/articles
   */
  getAllArticles: async (params?: {
    page?: number;
    limit?: number;
    categorie?: string;
    search?: string;
  }) => {
    const response = await apiClient.get<ApiListResponse<any>>('/articles', { params });
    return response.data;
  },

  /**
   * GET /api/articles/alerts
   */
  getAlerts: async (params?: { agence?: string }) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/articles/alerts', { params });
    return response.data;
  },

  /**
   * GET /api/articles/stats
   */
  getStockStats: async (params?: { agence?: string }) => {
    const response = await apiClient.get<ApiResponse<any>>('/articles/stats', { params });
    return response.data;
  },

  /**
   * GET /api/articles/:id
   */
  getArticleById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/articles/${id}`);
    return response.data;
  },

  /**
   * POST /api/articles
   */
  createArticle: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/articles', data);
    return response.data;
  },

  /**
   * PUT /api/articles/:id
   */
  updateArticle: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(`/articles/${id}`, data);
    return response.data;
  },

  /**
   * GET /api/articles/:id/mouvements
   */
  getArticleMouvements: async (id: string, params?: {
    page?: number;
    limit?: number;
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await apiClient.get<ApiListResponse<any>>(`/articles/${id}/mouvements`, { params });
    return response.data;
  },

  /**
   * GET /api/articles/:id/valorisation
   */
  getValorisation: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/articles/${id}/valorisation`);
    return response.data;
  },

  // ========== MOUVEMENTS ==========

  /**
   * GET /api/mouvements
   */
  getAllMouvements: async (params?: {
    page?: number;
    limit?: number;
    type_mouvement?: string;
    article_id?: string;
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await apiClient.get<ApiListResponse<any>>('/mouvements', { params });
    return response.data;
  },

  /**
   * POST /api/mouvements
   */
  createMouvement: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/mouvements', data);
    return response.data;
  },

  /**
   * GET /api/mouvements/:id
   */
  getMouvementById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/mouvements/${id}`);
    return response.data;
  },

  /**
   * POST /api/mouvements/:id/validate
   */
  validateMouvement: async (id: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/mouvements/${id}/validate`);
    return response.data;
  },

  // ========== INVENTAIRES ==========

  /**
   * GET /api/inventaires
   */
  getAllInventaires: async (params?: {
    page?: number;
    limit?: number;
    statut?: string;
  }) => {
    const response = await apiClient.get<ApiListResponse<any>>('/inventaires', { params });
    return response.data;
  },

  /**
   * POST /api/inventaires
   */
  createInventaire: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/inventaires', data);
    return response.data;
  },

  /**
   * GET /api/inventaires/:id
   */
  getInventaireById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/inventaires/${id}`);
    return response.data;
  },

  /**
   * PUT /api/inventaires/:id/ligne/:ligneId
   */
  updateLigneInventaire: async (id: string, ligneId: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(`/inventaires/${id}/ligne/${ligneId}`, data);
    return response.data;
  },

  /**
   * POST /api/inventaires/:id/validate
   */
  validateInventaire: async (id: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/inventaires/${id}/validate`);
    return response.data;
  }
};
