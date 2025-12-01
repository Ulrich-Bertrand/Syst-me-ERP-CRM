import apiClient, { buildQueryParams, isUsingMockMode } from './config';
import { dashboardMockService } from './dashboard.mock';

export interface DashboardStats {
  demandes_en_attente: number;
  demandes_validees: number;
  bons_commande_en_cours: number;
  montant_total: number;
  alertes_stock: number;
  fournisseurs_actifs: number;
}

export interface DemandeRecente {
  id: number;
  reference: string;
  objet: string;
  statut: string;
  montant_total_estime: number;
  date_demande: string;
  demandeur_nom: string;
  demandeur_prenom: string;
}

export interface DashboardFilters {
  agence?: 'GHANA' | 'COTE_IVOIRE' | 'BURKINA';
  limit?: number;
}

/**
 * Service API Dashboard
 */
class DashboardApiService {
  /**
   * Obtenir statistiques dashboard
   */
  async getStats(filters?: DashboardFilters): Promise<DashboardStats> {
    if (isUsingMockMode()) {
      return dashboardMockService.getStats(filters);
    }

    try {
      const queryParams = filters ? buildQueryParams(filters) : '';
      const response = await apiClient.get<DashboardStats>(`/dashboard/stats${queryParams}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.response?.status === 401) {
        console.warn('[dashboardApi] Fallback vers mode MOCK suite à erreur');
        return dashboardMockService.getStats(filters);
      }
      throw error;
    }
  }

  /**
   * Obtenir demandes récentes
   */
  async getDemandesRecentes(filters?: DashboardFilters): Promise<DemandeRecente[]> {
    if (isUsingMockMode()) {
      // Retourner données mockées
      return [];
    }

    try {
      const queryParams = filters ? buildQueryParams(filters) : '';
      const response = await apiClient.get<DemandeRecente[]>(`/dashboard/demandes-recentes${queryParams}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.response?.status === 401) {
        console.warn('[dashboardApi] Fallback vers mode MOCK suite à erreur');
        return [];
      }
      throw error;
    }
  }

  /**
   * Obtenir activités récentes
   */
  async getActivitesRecentes(filters?: DashboardFilters): Promise<any[]> {
    if (isUsingMockMode()) {
      // Retourner données mockées
      return [];
    }

    try {
      const queryParams = filters ? buildQueryParams(filters) : '';
      const response = await apiClient.get<any[]>(`/dashboard/activites-recentes${queryParams}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.response?.status === 401) {
        console.warn('[dashboardApi] Fallback vers mode MOCK suite à erreur');
        return [];
      }
      throw error;
    }
  }
}

export const dashboardApi = new DashboardApiService();