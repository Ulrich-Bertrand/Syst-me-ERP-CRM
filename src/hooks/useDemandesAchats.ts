/**
 * HOOK: useDemandesAchats
 * 
 * Hook custom pour gérer toutes les opérations sur les demandes d'achat
 * 
 * ENDPOINTS UTILISÉS:
 * - GET /api/demandes → Liste des demandes
 * - GET /api/demandes/:id → Détail demande
 * - POST /api/demandes → Créer demande
 * - PUT /api/demandes/:id → Modifier demande
 * - DELETE /api/demandes/:id → Supprimer demande
 * - POST /api/demandes/:id/submit → Soumettre demande
 */

import { useState, useCallback } from 'react';
import { demandesApi } from '../services/api';
import {
  DemandeAchatComplete,
  DemandeAchatListe,
  CreateDemandeRequest,
  UpdateDemandeRequest,
  GetDemandesFilters,
  PaginatedResponse
} from '../types/achats-api.types';
import { toast } from 'sonner';

export function useDemandesAchats() {
  // ========== STATE ==========
  const [loading, setLoading] = useState(false);
  const [demandes, setDemandes] = useState<DemandeAchatListe[]>([]);
  const [demandeDetail, setDemandeDetail] = useState<DemandeAchatComplete | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  // ========== FONCTIONS ==========

  /**
   * 📋 LISTE DES DEMANDES
   * 
   * ENDPOINT: GET /api/demandes
   * QUERY PARAMS:
   *   - agence: string (GHANA | COTE_IVOIRE | BURKINA)
   *   - statut: string (brouillon | en_validation_niveau_1 | ...)
   *   - type: string (NORMALE | URGENTE | EXCEPTIONNELLE)
   *   - demandeur_id: number
   *   - date_debut: string (YYYY-MM-DD)
   *   - date_fin: string (YYYY-MM-DD)
   *   - page: number
   *   - limit: number
   * 
   * RÉPONSE:
   * {
   *   data: DemandeAchatListe[],
   *   total: number,
   *   page: number,
   *   limit: number
   * }
   * 
   * GESTION ERREURS:
   *   - 401: Token invalide → toast.error + redirect login
   *   - 403: Permissions insuffisantes → toast.error
   *   - 500: Erreur serveur → toast.error
   */
  const fetchDemandes = useCallback(async (filters?: GetDemandesFilters) => {
    try {
      setLoading(true);
      
      // console.log('[useDemandesAchats] Appel GET /api/demandes avec filtres:', filters);
      
      const response: PaginatedResponse<DemandeAchatListe> = await demandesApi.getAll(filters);
      
      // console.log('[useDemandesAchats] Réponse API:', {
      //   total: response.total,
      //   count: response.data.length,
      //   page: response.page
      // });

      console.log(response, "........ demandes achats");
      
      
      // Mettre à jour state
      setDemandes(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total
      });
      
      return response;
    } catch (error: any) {
      console.error('[useDemandesAchats] Erreur fetchDemandes:', error);
      
      const errorMessage = error.response?.data?.error || 'Erreur lors du chargement des demandes';
      toast.error(errorMessage);
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📄 DÉTAIL D'UNE DEMANDE
   * 
   * ENDPOINT: GET /api/demandes/:id
   * PARAMS: id (number)
   * 
   * RÉPONSE:
   * {
   *   id: number,
   *   reference: string,
   *   agence: string,
   *   ...
   *   lignes: [...],
   *   historique_validations: [...]
   * }
   * 
   * GESTION ERREURS:
   *   - 404: Demande non trouvée → toast.error
   *   - 401: Non authentifié → redirect login
   *   - 403: Permissions insuffisantes → toast.error
   */
  const fetchDemandeById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      
      console.log('[useDemandesAchats] Appel GET /api/demandes/' + id);
      
      const demande: DemandeAchatComplete = await demandesApi.getById(id);
      
      console.log('[useDemandesAchats] Demande chargée:', {
        reference: demande.reference,
        statut: demande.statut,
        montant: demande.montant_total_estime,
        nb_lignes: demande.lignes?.length
      });
      
      setDemandeDetail(demande);
      
      return demande;
    } catch (error: any) {
      console.error('[useDemandesAchats] Erreur fetchDemandeById:', error);
      
      if (error.response?.status === 404) {
        toast.error('Demande non trouvée');
      } else {
        toast.error(error.response?.data?.error || 'Erreur lors du chargement de la demande');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ➕ CRÉER UNE DEMANDE
   * 
   * ENDPOINT: POST /api/demandes
   * HEADERS: 
   *   - Authorization: Bearer {token}
   *   - Content-Type: application/json
   * 
   * BODY:
   * {
   *   agence: "GHANA",
   *   type: "NORMALE",
   *   objet: "Achat fournitures",
   *   justification: "Renouvellement stock",
   *   date_besoin: "2025-12-31",
   *   lignes: [
   *     {
   *       designation: "Ramettes papier A4",
   *       quantite: 50,
   *       unite: "Ramette",
   *       prix_unitaire_estime: 5.50
   *     }
   *   ]
   * }
   * 
   * RÉPONSE:
   * {
   *   message: "Demande créée avec succès",
   *   data: DemandeAchatComplete
   * }
   * 
   * GESTION ERREURS:
   *   - 400: Validation échouée → toast.error (détails champs)
   *   - 401: Non authentifié → redirect login
   *   - 403: Profil requis (profile_purchases_create) → toast.error
   */
  const createDemande = useCallback(async (data: CreateDemandeRequest) => {
    try {
      setLoading(true);
      
      // console.log('[useDemandesAchats] Appel POST /api/demandes avec data:', {
      //   agence: data.agence,
      //   type: data.type,
      //   objet: data.objet,
      //   nb_lignes: data.lignes.length
      // });
      
      const response = await demandesApi.create(data);
      
      // console.log('[useDemandesAchats] Demande créée:', {
      //   id: response.data.id,
      //   reference: response.data.reference
      // });
      
      toast.success(response.message || 'Demande créée avec succès !');
      
      return response.data;
    } catch (error: any) {
      console.error('[useDemandesAchats] Erreur createDemande:', error);
      
      // Gestion erreurs validation Zod
      if (error.response?.status === 400 && error.response?.data?.details) {
        const details = error.response.data.details;
        const firstError = details[0];
        toast.error(`Erreur de validation: ${firstError.field} - ${firstError.message}`);
      } else {
        toast.error(error.response?.data?.error || 'Erreur lors de la création de la demande');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✏️ MODIFIER UNE DEMANDE (brouillon uniquement)
   * 
   * ENDPOINT: PUT /api/demandes/:id
   * PARAMS: id (number)
   * BODY: UpdateDemandeRequest (champs partiels)
   * 
   * RÉPONSE:
   * {
   *   message: "Demande mise à jour avec succès",
   *   data: DemandeAchatComplete
   * }
   * 
   * GESTION ERREURS:
   *   - 400: Demande pas en brouillon → toast.error
   *   - 404: Demande non trouvée → toast.error
   *   - 401: Non authentifié → redirect login
   *   - 403: Pas le demandeur → toast.error
   */
  const updateDemande = useCallback(async (id: number, data: UpdateDemandeRequest) => {
    try {
      setLoading(true);
      
      console.log('[useDemandesAchats] Appel PUT /api/demandes/' + id, data);
      
      const response = await demandesApi.update(id, data);
      
      console.log('[useDemandesAchats] Demande mise à jour:', response.data.reference);
      
      toast.success(response.message || 'Demande mise à jour avec succès !');
      
      return response.data;
    } catch (error: any) {
      console.error('[useDemandesAchats] Erreur updateDemande:', error);
      
      toast.error(error.response?.data?.error || 'Erreur lors de la modification de la demande');
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🗑️ SUPPRIMER UNE DEMANDE (brouillon uniquement)
   * 
   * ENDPOINT: DELETE /api/demandes/:id
   * PARAMS: id (number)
   * 
   * RÉPONSE:
   * {
   *   message: "Demande supprimée avec succès"
   * }
   * 
   * GESTION ERREURS:
   *   - 400: Demande pas en brouillon → toast.error
   *   - 404: Demande non trouvée → toast.error
   */
  const deleteDemande = useCallback(async (id: number) => {
    try {
      setLoading(true);
      
      console.log('[useDemandesAchats] Appel DELETE /api/demandes/' + id);
      
      await demandesApi.delete(id);
      
      console.log('[useDemandesAchats] Demande supprimée');
      
      toast.success('Demande supprimée avec succès !');
      
      // Retirer de la liste locale
      setDemandes(prev => prev.filter(d => d.id !== id));
      
    } catch (error: any) {
      console.error('[useDemandesAchats] Erreur deleteDemande:', error);
      
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression de la demande');
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📤 SOUMETTRE UNE DEMANDE POUR VALIDATION
   * 
   * ENDPOINT: POST /api/demandes/:id/submit
   * PARAMS: id (number)
   * 
   * RÉPONSE:
   * {
   *   message: "Demande soumise pour validation",
   *   data: DemandeAchatComplete
   * }
   * 
   * EFFET:
   *   - Statut passe de "brouillon" à "en_validation_niveau_1"
   *   - Date soumission enregistrée
   * 
   * GESTION ERREURS:
   *   - 400: Demande déjà soumise → toast.error
   *   - 404: Demande non trouvée → toast.error
   */
  const submitDemande = useCallback(async (id: number) => {
    try {
      setLoading(true);
      
      console.log('[useDemandesAchats] Appel POST /api/demandes/' + id + '/submit');
      
      const response = await demandesApi.submit(id);
      
      console.log('[useDemandesAchats] Demande soumise:', {
        reference: response.data.reference,
        nouveau_statut: response.data.statut
      });
      
      toast.success(response.message || 'Demande soumise pour validation !');
      
      // Mettre à jour le détail si c'est la demande en cours
      if (demandeDetail?.id === id) {
        setDemandeDetail(response.data);
      }
      
      // Mettre à jour dans la liste
      setDemandes(prev => prev.map(d => 
        d.id === id 
          ? { ...d, statut: response.data.statut } 
          : d
      ));
      
      return response.data;
    } catch (error: any) {
      console.error('[useDemandesAchats] Erreur submitDemande:', error);
      
      toast.error(error.response?.data?.error || 'Erreur lors de la soumission de la demande');
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [demandeDetail]);

  /**
   * 🔄 RAFRAÎCHIR LA LISTE
   * 
   * Recharge la liste avec les mêmes filtres
   */
  const refresh = useCallback(() => {
    return fetchDemandes({
      page: pagination.page,
      limit: pagination.limit
    });
  }, [fetchDemandes, pagination.page, pagination.limit]);

  // ========== RETURN ==========
  return {
    // State
    loading,
    demandes,
    demandeDetail,
    pagination,
    
    // Actions
    fetchDemandes,
    fetchDemandeById,
    createDemande,
    updateDemande,
    deleteDemande,
    submitDemande,
    refresh
  };
}
