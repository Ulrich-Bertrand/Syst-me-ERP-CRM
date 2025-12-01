import apiClient, { ApiResponse, ApiListResponse } from '../../lib/api-client';
import { FactureFournisseur } from '../../types/facture';

export const facturesApi = {
  /**
   * GET /api/factures
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
    const response = await apiClient.get<ApiListResponse<FactureFournisseur>>('/factures', { params });
    return response.data;
  },

  /**
   * GET /api/factures/stats
   */
  getStats: async (params?: {
    agence?: string;
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<any>>('/factures/stats', { params });
    return response.data;
  },

  /**
   * GET /api/factures/unpaid
   */
  getUnpaid: async (params?: { agence?: string }) => {
    const response = await apiClient.get<ApiResponse<FactureFournisseur[]>>('/factures/unpaid', { params });
    return response.data;
  },

  /**
   * GET /api/factures/overdue
   */
  getOverdue: async (params?: { agence?: string }) => {
    const response = await apiClient.get<ApiResponse<FactureFournisseur[]>>('/factures/overdue', { params });
    return response.data;
  },

  /**
   * GET /api/factures/:id
   */
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<FactureFournisseur>>(`/factures/${id}`);
    return response.data;
  },

  /**
   * POST /api/factures
   */
  create: async (data: any) => {
    const response = await apiClient.post<ApiResponse<FactureFournisseur>>('/factures', data);
    return response.data;
  },

  /**
   * PUT /api/factures/:id
   */
  update: async (id: string, data: Partial<FactureFournisseur>) => {
    const response = await apiClient.put<ApiResponse<FactureFournisseur>>(`/factures/${id}`, data);
    return response.data;
  },

  /**
   * POST /api/factures/:id/upload
   */
  uploadPDF: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<any>>(`/factures/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * POST /api/factures/:id/controle-3-voies
   */
  executeControle3Voies: async (id: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/factures/${id}/controle-3-voies`);
    return response.data;
  },

  /**
   * POST /api/factures/:id/validate
   */
  validate: async (id: string, data?: { commentaire?: string }) => {
    const response = await apiClient.post<ApiResponse<FactureFournisseur>>(`/factures/${id}/validate`, data);
    return response.data;
  },

  /**
   * POST /api/factures/:id/reject
   */
  reject: async (id: string, data: { motif: string }) => {
    const response = await apiClient.post<ApiResponse<FactureFournisseur>>(`/factures/${id}/reject`, data);
    return response.data;
  }
};
