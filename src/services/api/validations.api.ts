import apiClient, { buildQueryParams, isUsingMockMode } from './config';
import { validationsMockService } from './validations.mock';
import {
  DemandeAchatComplete,
  HistoriqueValidation,
  ValidationStats,
  ValidationAction,
  ApiResponse
} from '../../types/achats-api.types';

export interface ValidationFilters {
  agence?: 'GHANA' | 'COTE_IVOIRE' | 'BURKINA';
  type?: 'NORMALE' | 'URGENTE' | 'EXCEPTIONNELLE';
  niveau?: number;
  page?: number;
  limit?: number;
}

/**
 * Service API Validations
 */
class ValidationsApiService {
  /**
   * Obtenir demandes à valider
   */
  async getDemandesAValider(filters?: ValidationFilters): Promise<DemandeAchatComplete[]> {
    if (isUsingMockMode()) {
      return validationsMockService.getDemandesAValider(filters?.niveau);
    }

    try {
      const queryParams = filters ? buildQueryParams(filters) : '';
      const response = await apiClient.get<DemandeAchatComplete[]>(`/validations/demandes${queryParams}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[validationsApi] Fallback vers mode MOCK suite à erreur réseau');
        return validationsMockService.getDemandesAValider(filters?.niveau);
      }
      throw error;
    }
  }

  /**
   * Valider une demande
   */
  async valider(demandeId: number, action: ValidationAction): Promise<ApiResponse<DemandeAchatComplete>> {
    if (isUsingMockMode()) {
      return validationsMockService.valider(demandeId, action);
    }

    try {
      const response = await apiClient.post<ApiResponse<DemandeAchatComplete>>(
        `/validations/${demandeId}/valider`,
        action
      );
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[validationsApi] Fallback vers mode MOCK suite à erreur réseau');
        return validationsMockService.valider(demandeId, action);
      }
      throw error;
    }
  }

  /**
   * Rejeter une demande
   */
  async rejeter(demandeId: number, action: ValidationAction): Promise<ApiResponse<DemandeAchatComplete>> {
    if (isUsingMockMode()) {
      return validationsMockService.rejeter(demandeId, action);
    }

    try {
      const response = await apiClient.post<ApiResponse<DemandeAchatComplete>>(
        `/validations/${demandeId}/rejeter`,
        action
      );
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[validationsApi] Fallback vers mode MOCK suite à erreur réseau');
        return validationsMockService.rejeter(demandeId, action);
      }
      throw error;
    }
  }

  /**
   * Obtenir historique validations
   */
  async getHistorique(demandeId: number): Promise<HistoriqueValidation[]> {
    if (isUsingMockMode()) {
      return validationsMockService.getHistorique(demandeId);
    }

    try {
      const response = await apiClient.get<HistoriqueValidation[]>(`/validations/${demandeId}/historique`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[validationsApi] Fallback vers mode MOCK suite à erreur réseau');
        return validationsMockService.getHistorique(demandeId);
      }
      throw error;
    }
  }

  /**
   * Obtenir statistiques validations
   */
  async getStats(): Promise<ValidationStats> {
    if (isUsingMockMode()) {
      return validationsMockService.getStats();
    }

    try {
      const response = await apiClient.get<ValidationStats>('/validations/stats');
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[validationsApi] Fallback vers mode MOCK suite à erreur réseau');
        return validationsMockService.getStats();
      }
      throw error;
    }
  }
}

export const validationsApi = new ValidationsApiService();