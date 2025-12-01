/**
 * HOOK: useValidationsAchats
 * 
 * Hook custom pour gérer toutes les opérations de validation de demandes d'achat
 * 
 * ENDPOINTS UTILISÉS:
 * - GET /api/validations/demandes → Demandes à valider
 * - POST /api/validations/:demandeId/valider → Valider demande
 * - POST /api/validations/:demandeId/rejeter → Rejeter demande
 * - GET /api/validations/:demandeId/historique → Historique validations
 * - GET /api/validations/stats → Stats validations
 */

import { useState, useCallback } from 'react';
import { validationsApi } from '../services/api';
import {
  DemandeAchatComplete,
  GetValidationsFilters,
  ValidationStats,
  HistoriqueValidationComplete,
  PaginatedResponse
} from '../types/achats-api.types';
import { toast } from 'sonner@2.0.3';

export function useValidationsAchats() {
  // ========== STATE ==========
  const [loading, setLoading] = useState(false);
  const [demandesAValider, setDemandesAValider] = useState<DemandeAchatComplete[]>([]);
  const [stats, setStats] = useState<ValidationStats | null>(null);
  const [historique, setHistorique] = useState<HistoriqueValidationComplete[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  // ========== FONCTIONS ==========

  /**
   * 📋 DEMANDES À VALIDER
   * 
   * ENDPOINT: GET /api/validations/demandes
   * HEADERS:
   *   - Authorization: Bearer {token}
   * 
   * QUERY PARAMS:
   *   - agence: string (GHANA | COTE_IVOIRE | BURKINA)
   *   - type: string (NORMALE | URGENTE | EXCEPTIONNELLE)
   *   - page: number
   *   - limit: number
   * 
   * LOGIQUE BACKEND:
   *   - Vérifie profils validateur user (niveau 1, 2 ou 3)
   *   - Retourne demandes selon statut:
   *     * profile_purchases_validate_level_1 → statut "en_validation_niveau_1"
   *     * profile_purchases_validate_level_2 → statut "en_validation_niveau_2"
   *     * profile_purchases_validate_level_3 → statut "en_validation_niveau_3"
   *   - Trie par priorité (URGENTE en premier)
   * 
   * RÉPONSE:
   * {
   *   data: DemandeAchatComplete[],
   *   total: number,
   *   page: number,
   *   limit: number
   * }
   * 
   * GESTION ERREURS:
   *   - 403: Pas de profil validateur → toast.error
   *   - 401: Token invalide → redirect login
   */
  const fetchDemandesAValider = useCallback(async (filters?: GetValidationsFilters) => {
    try {
      setLoading(true);
      
      console.log('[useValidationsAchats] Appel GET /api/validations/demandes avec filtres:', filters);
      
      const response: PaginatedResponse<DemandeAchatComplete> = await validationsApi.getDemandesAValider(filters);
      
      console.log('[useValidationsAchats] Demandes à valider:', {
        total: response.total,
        count: response.data.length,
        page: response.page
      });
      
      setDemandesAValider(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total
      });
      
      return response;
    } catch (error: any) {
      console.error('[useValidationsAchats] Erreur fetchDemandesAValider:', error);
      
      if (error.response?.status === 403) {
        toast.error('Vous n\'avez pas les permissions pour valider des demandes');
      } else {
        toast.error(error.response?.data?.error || 'Erreur lors du chargement des demandes à valider');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ VALIDER UNE DEMANDE
   * 
   * ENDPOINT: POST /api/validations/:demandeId/valider
   * PARAMS: demandeId (number)
   * HEADERS:
   *   - Authorization: Bearer {token}
   *   - Content-Type: application/json
   * 
   * BODY:
   * {
   *   commentaire: "Approuvé pour achat" // Optionnel
   * }
   * 
   * LOGIQUE BACKEND:
   *   1. Vérifie statut demande (doit être "en_validation_niveau_X")
   *   2. Vérifie profil validateur user pour le niveau actuel
   *   3. Enregistre validation dans historique_validations
   *   4. Met à jour demande:
   *      - Niveau 1 → statut passe à "en_validation_niveau_2"
   *      - Niveau 2 → statut passe à "en_validation_niveau_3"
   *      - Niveau 3 → statut passe à "validee"
   *      - Enregistre validateur_niveau_X_id et date_validation_niveau_X
   * 
   * RÉPONSE:
   * {
   *   message: "Demande validée avec succès",
   *   data: DemandeAchatComplete
   * }
   * 
   * GESTION ERREURS:
   *   - 400: Demande dans mauvais statut → toast.error
   *   - 403: Profil validateur manquant → toast.error
   *   - 404: Demande non trouvée → toast.error
   */
  const validerDemande = useCallback(async (demandeId: number, commentaire?: string) => {
    try {
      setLoading(true);
      
      console.log('[useValidationsAchats] Appel POST /api/validations/' + demandeId + '/valider', {
        commentaire
      });
      
      const response = await validationsApi.valider(demandeId, commentaire);
      
      console.log('[useValidationsAchats] Demande validée:', {
        reference: response.data.reference,
        nouveau_statut: response.data.statut
      });
      
      toast.success(response.message || 'Demande validée avec succès !');
      
      // Retirer de la liste des demandes à valider
      setDemandesAValider(prev => prev.filter(d => d.id !== demandeId));
      
      return response.data;
    } catch (error: any) {
      console.error('[useValidationsAchats] Erreur validerDemande:', error);
      
      if (error.response?.status === 403) {
        toast.error('Vous n\'avez pas les permissions pour valider cette demande');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Cette demande ne peut pas être validée');
      } else {
        toast.error(error.response?.data?.error || 'Erreur lors de la validation de la demande');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ❌ REJETER UNE DEMANDE
   * 
   * ENDPOINT: POST /api/validations/:demandeId/rejeter
   * PARAMS: demandeId (number)
   * BODY:
   * {
   *   commentaire: "Budget insuffisant" // REQUIS pour rejet
   * }
   * 
   * LOGIQUE BACKEND:
   *   1. Vérifie statut demande
   *   2. Vérifie profil validateur
   *   3. Enregistre rejet dans historique_validations
   *   4. Met à jour statut demande → "rejetee"
   *   5. Commentaire obligatoire pour rejet
   * 
   * RÉPONSE:
   * {
   *   message: "Demande rejetée",
   *   data: DemandeAchatComplete
   * }
   * 
   * GESTION ERREURS:
   *   - 400: Commentaire manquant → toast.error("Un commentaire est requis pour rejeter")
   *   - 403: Profil manquant → toast.error
   *   - 404: Demande non trouvée → toast.error
   */
  const rejeterDemande = useCallback(async (demandeId: number, commentaire: string) => {
    try {
      setLoading(true);
      
      // Validation frontend : commentaire requis
      if (!commentaire || commentaire.trim() === '') {
        toast.error('Un commentaire est requis pour rejeter une demande');
        throw new Error('Commentaire requis');
      }
      
      console.log('[useValidationsAchats] Appel POST /api/validations/' + demandeId + '/rejeter', {
        commentaire
      });
      
      const response = await validationsApi.rejeter(demandeId, commentaire);
      
      console.log('[useValidationsAchats] Demande rejetée:', {
        reference: response.data.reference,
        nouveau_statut: response.data.statut
      });
      
      toast.success(response.message || 'Demande rejetée');
      
      // Retirer de la liste des demandes à valider
      setDemandesAValider(prev => prev.filter(d => d.id !== demandeId));
      
      return response.data;
    } catch (error: any) {
      console.error('[useValidationsAchats] Erreur rejeterDemande:', error);
      
      // Erreur déjà gérée (commentaire manquant)
      if (error.message === 'Commentaire requis') {
        throw error;
      }
      
      toast.error(error.response?.data?.error || 'Erreur lors du rejet de la demande');
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📜 HISTORIQUE VALIDATIONS
   * 
   * ENDPOINT: GET /api/validations/:demandeId/historique
   * PARAMS: demandeId (number)
   * 
   * RÉPONSE:
   * [
   *   {
   *     id: number,
   *     niveau: 1 | 2 | 3,
   *     action: "VALIDER" | "REJETER",
   *     commentaire: string,
   *     date_validation: string,
   *     validateur_nom: string,
   *     validateur_prenom: string
   *   }
   * ]
   * 
   * USAGE:
   *   - Afficher historique dans modal détail demande
   *   - Montrer qui a validé/rejeté et quand
   */
  const fetchHistorique = useCallback(async (demandeId: number) => {
    try {
      setLoading(true);
      
      console.log('[useValidationsAchats] Appel GET /api/validations/' + demandeId + '/historique');
      
      const data: HistoriqueValidationComplete[] = await validationsApi.getHistorique(demandeId);
      
      console.log('[useValidationsAchats] Historique chargé:', {
        count: data.length
      });
      
      setHistorique(data);
      
      return data;
    } catch (error: any) {
      console.error('[useValidationsAchats] Erreur fetchHistorique:', error);
      
      toast.error(error.response?.data?.error || 'Erreur lors du chargement de l\'historique');
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📊 STATISTIQUES VALIDATIONS
   * 
   * ENDPOINT: GET /api/validations/stats
   * HEADERS:
   *   - Authorization: Bearer {token}
   * 
   * RÉPONSE:
   * {
   *   en_attente: number,      // Demandes à valider (pour user)
   *   validees_ce_mois: number, // Validées par user ce mois
   *   rejetees_ce_mois: number  // Rejetées par user ce mois
   * }
   * 
   * USAGE:
   *   - Afficher dans dashboard validations
   *   - KPIs personnels du validateur
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('[useValidationsAchats] Appel GET /api/validations/stats');
      
      const data: ValidationStats = await validationsApi.getStats();
      
      console.log('[useValidationsAchats] Stats chargées:', data);
      
      setStats(data);
      
      return data;
    } catch (error: any) {
      console.error('[useValidationsAchats] Erreur fetchStats:', error);
      
      // Si 403 = pas de profil validateur, ne pas afficher d'erreur
      if (error.response?.status !== 403) {
        toast.error(error.response?.data?.error || 'Erreur lors du chargement des statistiques');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔄 RAFRAÎCHIR
   */
  const refresh = useCallback(() => {
    return fetchDemandesAValider({
      page: pagination.page,
      limit: pagination.limit
    });
  }, [fetchDemandesAValider, pagination.page, pagination.limit]);

  // ========== RETURN ==========
  return {
    // State
    loading,
    demandesAValider,
    stats,
    historique,
    pagination,
    
    // Actions
    fetchDemandesAValider,
    validerDemande,
    rejeterDemande,
    fetchHistorique,
    fetchStats,
    refresh
  };
}
