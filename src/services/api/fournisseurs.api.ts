import apiClient, { ApiResponse, ApiListResponse } from '../../lib/api-client';

export const fournisseursApi = {
  /**
   * GET /api/fournisseurs
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    actif?: boolean;
  }) => {
    const response = await apiClient.get<ApiListResponse<any>>('/fournisseurs', { params });
    return response.data;
  },

  /**
   * GET /api/fournisseurs/:id
   */
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/fournisseurs/${id}`);
    return response.data;
  },

  /**
   * POST /api/fournisseurs
   */
  create: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/fournisseurs', data);
    return response.data;
  },

  /**
   * PUT /api/fournisseurs/:id
   */
  update: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(`/fournisseurs/${id}`, data);
    return response.data;
  }
};
