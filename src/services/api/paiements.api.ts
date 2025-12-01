import apiClient, { ApiResponse, ApiListResponse } from '../../lib/api-client';

export const paiementsApi = {
  /**
   * GET /api/paiements
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    statut?: string;
    agence?: string;
    fournisseur?: string;
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await apiClient.get<ApiListResponse<any>>('/paiements', { params });
    return response.data;
  },

  /**
   * GET /api/paiements/pending
   */
  getPending: async (params?: { agence?: string }) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/paiements/pending', { params });
    return response.data;
  },

  /**
   * GET /api/paiements/stats
   */
  getStats: async (params?: {
    agence?: string;
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<any>>('/paiements/stats', { params });
    return response.data;
  },

  /**
   * GET /api/paiements/:id
   */
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/paiements/${id}`);
    return response.data;
  },

  /**
   * POST /api/paiements
   */
  create: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/paiements', data);
    return response.data;
  },

  /**
   * POST /api/paiements/:id/upload-justificatif
   */
  uploadJustificatif: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<any>>(`/paiements/${id}/upload-justificatif`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * POST /api/paiements/:id/validate
   */
  validate: async (id: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/paiements/${id}/validate`);
    return response.data;
  },

  /**
   * POST /api/paiements/:id/cancel
   */
  cancel: async (id: string, data: { motif?: string }) => {
    const response = await apiClient.post<ApiResponse<any>>(`/paiements/${id}/cancel`, data);
    return response.data;
  }
};
