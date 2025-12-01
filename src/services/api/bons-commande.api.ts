import apiClient, { ApiResponse, ApiListResponse } from '../../lib/api-client';
import { BonCommande } from '../../types/bonCommande';

export const bonsCommandeApi = {
  /**
   * GET /api/bons-commande
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
    const response = await apiClient.get<ApiListResponse<BonCommande>>('/bons-commande', { params });
    return response.data;
  },

  /**
   * GET /api/bons-commande/stats
   */
  getStats: async (params?: {
    agence?: string;
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<any>>('/bons-commande/stats', { params });
    return response.data;
  },

  /**
   * GET /api/bons-commande/:id
   */
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<BonCommande>>(`/bons-commande/${id}`);
    return response.data;
  },

  /**
   * POST /api/bons-commande/generate/:daId
   */
  generateFromDA: async (daId: string, data: {
    conditions_paiement?: any;
    delai_livraison_jours?: number;
    notes?: string;
  }) => {
    const response = await apiClient.post<ApiResponse<BonCommande>>(`/bons-commande/generate/${daId}`, data);
    return response.data;
  },

  /**
   * PUT /api/bons-commande/:id
   */
  update: async (id: string, data: Partial<BonCommande>) => {
    const response = await apiClient.put<ApiResponse<BonCommande>>(`/bons-commande/${id}`, data);
    return response.data;
  },

  /**
   * POST /api/bons-commande/:id/send
   */
  send: async (id: string, data?: {
    email_destinataire?: string;
    message?: string;
  }) => {
    const response = await apiClient.post<ApiResponse<BonCommande>>(`/bons-commande/${id}/send`, data);
    return response.data;
  },

  /**
   * POST /api/bons-commande/:id/confirm
   */
  confirm: async (id: string, data: {
    date_confirmation?: string;
    confirme_par?: string;
    notes?: string;
  }) => {
    const response = await apiClient.post<ApiResponse<BonCommande>>(`/bons-commande/${id}/confirm`, data);
    return response.data;
  },

  /**
   * POST /api/bons-commande/:id/receive
   */
  receive: async (id: string, data: any) => {
    const response = await apiClient.post<ApiResponse<any>>(`/bons-commande/${id}/receive`, data);
    return response.data;
  },

  /**
   * POST /api/bons-commande/:id/cancel
   */
  cancel: async (id: string, data: { motif_annulation: string }) => {
    const response = await apiClient.post<ApiResponse<BonCommande>>(`/bons-commande/${id}/cancel`, data);
    return response.data;
  },

  /**
   * GET /api/bons-commande/:id/pdf
   */
  downloadPDF: async (id: string) => {
    const response = await apiClient.get(`/bons-commande/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * GET /api/bons-commande/:id/receptions
   */
  getReceptions: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/bons-commande/${id}/receptions`);
    return response.data;
  }
};
