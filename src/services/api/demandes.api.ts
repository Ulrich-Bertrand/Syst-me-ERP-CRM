import apiClient, { buildQueryParams, isUsingMockMode } from './config';
import { demandesMockService } from './demandes.mock';
import {
  DemandeAchatComplete,
  DemandeAchatListe,
  CreateDemandeRequest,
  UpdateDemandeRequest,
  GetDemandesFilters,
  PaginatedResponse,
  ApiResponse
} from '../../types/achats-api.types';

/**
 * Service API Demandes d'achat
 */
class DemandesApiService {
  /**
   * Obtenir toutes les demandes avec filtres
   */
  async getAll(filters?: GetDemandesFilters): Promise<PaginatedResponse<DemandeAchatListe>> {
    // Mode MOCK : utiliser les données simulées
    if (isUsingMockMode()) {
      return demandesMockService.getAll(filters);
    }

    // Mode API : appel backend réel
    try {
      const queryParams = filters ? buildQueryParams(filters) : '';
      const response = await apiClient.get<PaginatedResponse<DemandeAchatListe>>(`/demandes${queryParams}`);
      return response.data;
    } catch (error: any) {
      // Fallback vers mock en cas d'erreur réseau
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[demandesApi] Fallback vers mode MOCK suite à erreur réseau');
        return demandesMockService.getAll(filters);
      }
      throw error;
    }
  }

  /**
   * Obtenir mes demandes
   */
  async getMesDemandes(filters?: Omit<GetDemandesFilters, 'demandeur_id'>): Promise<PaginatedResponse<DemandeAchatListe>> {
    if (isUsingMockMode()) {
      // En mode mock, utiliser demandeur_id = 1 (Consultant IC)
      return demandesMockService.getAll({ ...filters, demandeur_id: 1 });
    }

    try {
      const queryParams = filters ? buildQueryParams(filters) : '';
      const response = await apiClient.get<PaginatedResponse<DemandeAchatListe>>(`/demandes/mes-demandes${queryParams}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[demandesApi] Fallback vers mode MOCK suite à erreur réseau');
        return demandesMockService.getAll({ ...filters, demandeur_id: 1 });
      }
      throw error;
    }
  }

  /**
   * Obtenir une demande par ID
   */
  async getById(id: number): Promise<DemandeAchatComplete> {
    if (isUsingMockMode()) {
      return demandesMockService.getById(id);
    }

    try {
      const response = await apiClient.get<DemandeAchatComplete>(`/demandes/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[demandesApi] Fallback vers mode MOCK suite à erreur réseau');
        return demandesMockService.getById(id);
      }
      throw error;
    }
  }

  /**
   * Créer une demande
   */
  async create(data: CreateDemandeRequest): Promise<ApiResponse<DemandeAchatComplete>> {
    if (isUsingMockMode()) {
      return demandesMockService.create(data);
    }

    try {
      const response = await apiClient.post<ApiResponse<DemandeAchatComplete>>('/demandes', data);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[demandesApi] Fallback vers mode MOCK suite à erreur réseau');
        return demandesMockService.create(data);
      }
      throw error;
    }
  }

  /**
   * Mettre à jour une demande
   */
  async update(id: number, data: UpdateDemandeRequest): Promise<ApiResponse<DemandeAchatComplete>> {
    if (isUsingMockMode()) {
      return demandesMockService.update(id, data);
    }

    try {
      const response = await apiClient.put<ApiResponse<DemandeAchatComplete>>(`/demandes/${id}`, data);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[demandesApi] Fallback vers mode MOCK suite à erreur réseau');
        return demandesMockService.update(id, data);
      }
      throw error;
    }
  }

  /**
   * Supprimer une demande (brouillon uniquement)
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    if (isUsingMockMode()) {
      return demandesMockService.delete(id);
    }

    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/demandes/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[demandesApi] Fallback vers mode MOCK suite à erreur réseau');
        return demandesMockService.delete(id);
      }
      throw error;
    }
  }

  /**
   * Soumettre une demande pour validation
   */
  async submit(id: number): Promise<ApiResponse<DemandeAchatComplete>> {
    if (isUsingMockMode()) {
      return demandesMockService.submit(id);
    }

    try {
      const response = await apiClient.post<ApiResponse<DemandeAchatComplete>>(`/demandes/${id}/submit`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.warn('[demandesApi] Fallback vers mode MOCK suite à erreur réseau');
        return demandesMockService.submit(id);
      }
      throw error;
    }
  }
}

export const demandesApi = new DemandesApiService();