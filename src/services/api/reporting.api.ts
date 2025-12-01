import apiClient, { ApiResponse } from '../../lib/api-client';
import { DashboardAchats } from '../../types/reporting';

export const reportingApi = {
  /**
   * GET /api/reporting/dashboard
   * Dashboard complet
   */
  getDashboard: async (params?: {
    periode_debut?: string;
    periode_fin?: string;
    agence?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<DashboardAchats>>('/reporting/dashboard', { params });
    return response.data;
  },

  /**
   * GET /api/reporting/kpis
   * KPIs globaux
   */
  getKPIs: async (params?: {
    periode_debut?: string;
    periode_fin?: string;
    agence?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<any>>('/reporting/kpis', { params });
    return response.data;
  },

  /**
   * GET /api/reporting/fournisseur/:id
   * Rapport fournisseur
   */
  getRapportFournisseur: async (id: string, params?: {
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<any>>(`/reporting/fournisseur/${id}`, { params });
    return response.data;
  },

  /**
   * GET /api/reporting/budget
   * Rapport budget
   */
  getRapportBudget: async (params?: {
    annee?: number;
    agence?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<any>>('/reporting/budget', { params });
    return response.data;
  },

  /**
   * GET /api/reporting/delais
   * Rapport délais
   */
  getRapportDelais: async (params?: {
    date_debut?: string;
    date_fin?: string;
    agence?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<any>>('/reporting/delais', { params });
    return response.data;
  },

  /**
   * POST /api/reporting/export
   * Générer export
   */
  generateExport: async (data: {
    format: 'excel' | 'pdf' | 'csv';
    type_rapport: string;
    periode: { debut: string; fin: string };
    filtres?: any;
    options?: any;
  }) => {
    const response = await apiClient.post<ApiResponse<any>>('/reporting/export', data);
    return response.data;
  }
};
