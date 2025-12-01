/**
 * TYPES API - MODULE ACHATS
 * 
 * Types exacts correspondant à la structure de la base de données PostgreSQL
 * et aux réponses de l'API backend.
 * 
 * ⚠️ SIMILITUDE STRICTE ENTRE BDD ET FRONTEND
 */

// ========== TYPES BASE DE DONNÉES (Tables PostgreSQL) ==========

/**
 * Table: demandes_achat
 * Correspondance exacte avec la BDD
 */
export interface DemandeAchatDB {
  // Champs principaux
  id: number;
  reference: string;                    // Ex: "DA-2025-001"
  agence: 'GHANA' | 'COTE_IVOIRE' | 'BURKINA';
  demandeur_id: number;
  
  // Type et détails
  type: 'NORMALE' | 'URGENTE' | 'EXCEPTIONNELLE';
  objet: string;
  justification: string;
  
  // Dates
  date_demande: string;                 // ISO 8601
  date_besoin: string;                  // ISO 8601
  date_soumission: string | null;       // ISO 8601
  
  // Statut workflow
  statut: 'brouillon' 
        | 'en_validation_niveau_1' 
        | 'en_validation_niveau_2' 
        | 'en_validation_niveau_3' 
        | 'validee' 
        | 'rejetee' 
        | 'annulee';
  
  // Rattachements optionnels
  budget_id: number | null;
  centre_cout_id: number | null;
  
  // Montant
  montant_total_estime: number;
  
  // Validations (3 niveaux)
  validateur_niveau_1_id: number | null;
  validateur_niveau_2_id: number | null;
  validateur_niveau_3_id: number | null;
  date_validation_niveau_1: string | null;
  date_validation_niveau_2: string | null;
  date_validation_niveau_3: string | null;
  
  // Métadonnées
  created_at: string;                   // ISO 8601
  updated_at: string;                   // ISO 8601
}

/**
 * Table: lignes_demande_achat
 */
export interface LigneDemandeAchatDB {
  id: number;
  demande_achat_id: number;
  article_id: number | null;
  designation: string;
  quantite: number;
  unite: string;
  prix_unitaire_estime: number;
  montant_estime: number;
  description: string | null;
  created_at: string;
}

/**
 * Table: historique_validations
 */
export interface HistoriqueValidationDB {
  id: number;
  demande_achat_id: number;
  validateur_id: number;
  niveau: 1 | 2 | 3;
  action: 'VALIDER' | 'REJETER';
  commentaire: string | null;
  date_validation: string;              // ISO 8601
}

/**
 * Table: bons_commande
 */
export interface BonCommandeDB {
  id: number;
  reference: string;                    // Ex: "BC-2025-001"
  demande_achat_id: number;
  fournisseur_id: number;
  agence: 'GHANA' | 'COTE_IVOIRE' | 'BURKINA';
  date_emission: string;
  date_livraison_prevue: string | null;
  montant_total: number;
  statut: 'brouillon' | 'envoye' | 'confirme' | 'recu' | 'annule';
  conditions_paiement: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

/**
 * Table: fournisseurs
 */
export interface FournisseurDB {
  id: number;
  code_fournisseur: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  ville: string | null;
  pays: string | null;
  compte_comptable: string | null;
  conditions_paiement: string | null;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Table: articles
 */
export interface ArticleDB {
  id: number;
  code_article: string;
  designation: string;
  categorie: string | null;
  unite: string;
  prix_achat_moyen: number;
  quantite_stock: number;
  seuil_reappro: number;
  compte_comptable: string | null;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

// ========== TYPES API (Réponses enrichies) ==========

/**
 * Ligne de demande d'achat complète
 */
export interface LigneDemandeAchat {
  id: number;
  demande_id: number;
  designation: string;
  quantite: number;
  unite: string;
  prix_unitaire_estime: number;
  montant_total_estime: number;
  categorie_article?: string;
  commentaire?: string;
}

/**
 * Historique de validation
 */
export interface HistoriqueValidation {
  id: number;
  demande_id: number;
  niveau: number;
  valideur_id: number;
  valideur_nom: string;
  decision: 'approuve' | 'rejete';
  commentaire?: string;
  date_decision: string;
}

/**
 * Demande complète avec relations (retour API GET /demandes/:id)
 */
export interface DemandeAchatComplete {
  // Demande principale
  id: number;
  reference: string;
  agence: string;
  demandeur_id: number;
  demandeur_nom: string;
  demandeur_prenom?: string | null;
  demandeur_email?: string | null;
  
  type: string;
  objet: string;
  justification: string;
  
  date_creation?: string;
  date_besoin: string;
  date_soumission?: string | null;
  
  statut: string;
  
  budget_id?: number | null;
  centre_cout_id?: number | null;
  
  montant_total_estime: number;
  
  validateur_niveau_1_id?: number | null;
  validateur_niveau_2_id?: number | null;
  validateur_niveau_3_id?: number | null;
  date_validation_niveau_1?: string | null;
  date_validation_niveau_2?: string | null;
  date_validation_niveau_3?: string | null;
  
  created_at?: string;
  updated_at?: string;
  
  // Relations
  lignes: LigneDemandeAchat[];
  historique_validations?: HistoriqueValidation[];
  
  // Données calculées
  nombre_lignes?: number;
}

/**
 * Demande dans liste (GET /api/demandes)
 */
export interface DemandeAchatListe {
  id: number;
  reference: string;
  agence: string;
  type: string;
  objet: string;
  statut: string;
  montant_total_estime: number;
  date_creation?: string;
  date_demande?: string;
  date_besoin: string;
  date_soumission?: string | null;
  demandeur_id: number;
  demandeur_nom: string;
  demandeur_prenom?: string | null;
  demandeur_email?: string | null;
  nb_lignes?: number;
  nombre_lignes?: number;
  niveau_validation_actuel?: number;
}

// ========== TYPES FORMULAIRES ==========

/**
 * Ligne de demande (formulaire création/modification)
 */
export interface LigneDemandeForm {
  // Pas d'ID pour nouvelle ligne
  id?: number;
  article_id?: number;
  designation: string;
  quantite: number;
  unite: string;
  prix_unitaire_estime?: number;
  description?: string;
}

/**
 * Demande d'achat (formulaire création)
 * 
 * ⚠️ MAPPING EXACT BDD:
 * - agence → demandes_achat.agence
 * - type → demandes_achat.type
 * - objet → demandes_achat.objet
 * - justification → demandes_achat.justification
 * - date_besoin → demandes_achat.date_besoin
 * - lignes → lignes_demande_achat (array)
 */
export interface CreateDemandeRequest {
  agence: 'GHANA' | 'COTE_IVOIRE' | 'BURKINA';
  type: 'NORMALE' | 'URGENTE' | 'EXCEPTIONNELLE';
  objet: string;
  justification: string;
  date_besoin: string;
  budget_id?: number;
  centre_cout_id?: number;
  lignes: LigneDemandeForm[];
}

/**
 * Demande d'achat (formulaire modification)
 */
export interface UpdateDemandeRequest {
  type?: 'NORMALE' | 'URGENTE' | 'EXCEPTIONNELLE';
  objet?: string;
  justification?: string;
  date_besoin?: string;
  budget_id?: number | null;
  centre_cout_id?: number | null;
  lignes?: LigneDemandeForm[];
}

// ========== TYPES FILTRES ==========

/**
 * Filtres liste demandes
 * 
 * MAPPING URL Query Params → Filtres SQL:
 * - ?agence=GHANA → WHERE da.agence = 'GHANA'
 * - ?statut=validee → WHERE da.statut = 'validee'
 * - ?type=URGENTE → WHERE da.type = 'URGENTE'
 * - ?demandeur_id=5 → WHERE da.demandeur_id = 5
 * - ?date_debut=2025-01-01 → WHERE da.date_demande >= '2025-01-01'
 * - ?date_fin=2025-12-31 → WHERE da.date_demande <= '2025-12-31'
 * - ?page=2 → OFFSET 50 (si limit=50)
 * - ?limit=20 → LIMIT 20
 */
export interface GetDemandesFilters {
  agence?: 'GHANA' | 'COTE_IVOIRE' | 'BURKINA';
  statut?: DemandeAchatDB['statut'];
  type?: 'NORMALE' | 'URGENTE' | 'EXCEPTIONNELLE';
  demandeur_id?: number;
  date_debut?: string;      // Format: YYYY-MM-DD
  date_fin?: string;        // Format: YYYY-MM-DD
  page?: number;            // Numéro de page (commence à 1)
  limit?: number;           // Nombre d'items par page
}

// ========== TYPES VALIDATIONS ==========

/**
 * Filtres liste validations
 */
export interface GetValidationsFilters {
  agence?: 'GHANA' | 'COTE_IVOIRE' | 'BURKINA';
  type?: 'NORMALE' | 'URGENTE' | 'EXCEPTIONNELLE';
  page?: number;
  limit?: number;
}

/**
 * Action validation (valider/rejeter)
 */
export interface ValidationAction {
  niveau: number;
  commentaire?: string;
}

/**
 * Stats validations
 */
export interface ValidationStats {
  en_attente_niveau_1: number;
  en_attente_niveau_2: number;
  en_attente_niveau_3: number;
  validees_aujourd_hui: number;
  rejetees_aujourd_hui: number;
  montant_en_attente: number;
  montant_valide_mois: number;
}

// ========== TYPES RÉPONSES API ==========

/**
 * Réponse API paginée
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Réponse API succès avec message
 */
export interface ApiSuccessResponse<T = any> {
  message: string;
  data: T;
}

/**
 * Alias pour ApiSuccessResponse (utilisé dans certains services)
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T>;

/**
 * Réponse API erreur
 */
export interface ApiErrorResponse {
  error: string;
  details?: any;
}

// ========== TYPES DASHBOARD ==========

/**
 * Stats dashboard achats
 */
export interface DashboardStatsAchats {
  demandes_en_attente: number;
  demandes_validees: number;
  bons_commande_en_cours: number;
  montant_total: number;
  alertes_stock: number;
  fournisseurs_actifs: number;
}

/**
 * Demande récente (dashboard)
 */
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

// ========== CONSTANTES ==========

/**
 * Statuts possibles
 */
export const STATUTS_DEMANDE = [
  'brouillon',
  'en_validation_niveau_1',
  'en_validation_niveau_2',
  'en_validation_niveau_3',
  'validee',
  'rejetee',
  'annulee'
] as const;

/**
 * Types demandes
 */
export const TYPES_DEMANDE = [
  'NORMALE',
  'URGENTE',
  'EXCEPTIONNELLE'
] as const;

/**
 * Agences
 */
export const AGENCES = [
  'GHANA',
  'COTE_IVOIRE',
  'BURKINA'
] as const;

/**
 * Labels statuts (i18n)
 */
export const STATUT_LABELS: Record<DemandeAchatDB['statut'], { fr: string; en: string; color: string; icon: string }> = {
  brouillon: { 
    fr: 'Brouillon', 
    en: 'Draft', 
    color: 'gray',
    icon: 'file-text'
  },
  en_validation_niveau_1: { 
    fr: 'Validation N1', 
    en: 'Validation L1', 
    color: 'orange',
    icon: 'clock'
  },
  en_validation_niveau_2: { 
    fr: 'Validation N2', 
    en: 'Validation L2', 
    color: 'blue',
    icon: 'clock'
  },
  en_validation_niveau_3: { 
    fr: 'Validation N3', 
    en: 'Validation L3', 
    color: 'purple',
    icon: 'clock'
  },
  validee: { 
    fr: 'Validée', 
    en: 'Validated', 
    color: 'green',
    icon: 'check-circle'
  },
  rejetee: { 
    fr: 'Rejetée', 
    en: 'Rejected', 
    color: 'red',
    icon: 'x-circle'
  },
  annulee: { 
    fr: 'Annulée', 
    en: 'Cancelled', 
    color: 'gray',
    icon: 'ban'
  }
};

/**
 * Labels types (i18n)
 */
export const TYPE_LABELS: Record<DemandeAchatDB['type'], { fr: string; en: string; color: string; icon: string }> = {
  NORMALE: {
    fr: 'Normale',
    en: 'Normal',
    color: 'blue',
    icon: 'file-text'
  },
  URGENTE: {
    fr: 'Urgente',
    en: 'Urgent',
    color: 'red',
    icon: 'alert-circle'
  },
  EXCEPTIONNELLE: {
    fr: 'Exceptionnelle',
    en: 'Exceptional',
    color: 'purple',
    icon: 'star'
  }
};

/**
 * Unités communes
 */
export const UNITES = [
  'Pièce',
  'Boîte',
  'Paquet',
  'Carton',
  'Litre',
  'Kilogramme',
  'Mètre',
  'Heure',
  'Jour',
  'Mois',
  'Forfait'
] as const;