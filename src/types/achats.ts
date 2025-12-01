// Types basés sur la structure de base de données du Module Achats

// ========== Tables principales (existantes) ==========

export interface TN_Pieces {
  Num_Piece: string;
  Type_Piece: string; // Catégorie F pour achats
  Agence: string;
  Fournisseur: string;
  Devise: string;
  Montant: number;
  Statut: string;
  Date_Piece: string;
  Provisoire: boolean;
  Definitif: boolean;
}

export interface TN_Pieces_Achats {
  Num_Piece: string;
  Fournisseur: string;
  Mode_Reglement: 'cash' | 'banque' | 'mobile_money';
  Centre_Cout: string;
  Projet_Dossier?: string;
  Priorite: 'basse' | 'normale' | 'urgente';
  Reference_Interne: string;
  Delai_Souhaite?: string;
  Validation_Niveau_1?: boolean;
  Validation_Niveau_2?: boolean;
  Validation_Niveau_3?: boolean;
  Validation_1_By?: string;
  Validation_1_Date?: string;
  Validation_2_By?: string;
  Validation_2_Date?: string;
  Validation_3_By?: string;
  Validation_3_Date?: string;
}

export interface TN_Details_Pieces {
  id: string;
  Num_Piece: string;
  Ligne: number;
  Quantite: number;
  Designation: string;
  Prix_Unitaire: number;
  Montant_Ligne: number;
  Compte_Comptable?: string;
  Code_Analytique?: string;
  Rubrique_Achat?: string;
  Article_Code?: string;
}

export interface TN_Fournisseurs {
  Code_Fournisseur: string;
  Nom_Fournisseur: string;
  Email?: string;
  Telephone?: string;
  Adresse?: string;
  Compte_Comptable: string;
  Devise_Defaut: string;
  Conditions_Paiement?: string;
  Actif: boolean;
}

export interface TN_Articles {
  Code_Article: string;
  Designation: string;
  Categorie: string;
  Unite: string;
  Prix_Achat_Moyen: number;
  Stock_Actuel: number;
  Stock_Min: number;
  Compte_Comptable: string;
}

export interface TN_Mouvements_Stock {
  id: string;
  Code_Article: string;
  Type_Mouvement: 'IN' | 'OUT' | 'AJUST';
  Quantite: number;
  Date_Mouvement: string;
  Entrepot: string;
  Num_Piece?: string;
  Reference: string;
  User_Created: string;
}

// ========== Nouvelles tables spécifiques web ==========

export type TypeDemande = 'dossier' | 'agence';
export type StatutWorkflow = 'brouillon' | 'soumis' | 'valide_niveau_1' | 'valide_niveau_2' | 'approuve' | 'bc_genere' | 'facture_recue' | 'paye' | 'justifie' | 'clos' | 'rejete';
export type TypeFichier = 'Demande' | 'BC' | 'Facture' | 'Justificatif' | 'Autre';
export type StatutValidation = 'approuve' | 'rejete' | 'en_attente';

export interface BOPX_Achats_Demandes {
  id: string;
  piece_id: string; // Référence tn_Pieces
  type_demande: TypeDemande;
  dossier_id?: string; // tn_Dossiers, nullable
  dossier_reference?: string; // Pour affichage
  service_demandeur?: string; // IT, Admin, HR, Finance, Logistics...
  priorite: 'basse' | 'normale' | 'urgente';
  impact_stock: boolean;
  statut_workflow: StatutWorkflow;
  motif_achat: string;
  observation?: string;
  date_besoin?: string;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  soumis_at?: string;
  soumis_by?: string;
}

export interface BOPX_Achats_Validations {
  id: string;
  piece_id: string;
  niveau: 1 | 2 | 3; // Niveau de validation
  valide_par?: string; // utilisateur
  valide_a?: string; // datetime
  commentaire?: string;
  statut: StatutValidation;
  notification_envoyee: boolean;
  notification_lue: boolean;
}

export interface BOPX_Achats_Fichiers {
  id: string;
  piece_id: string;
  type_fichier: TypeFichier;
  nom_fichier: string;
  path: string;
  taille: number; // en bytes
  uploaded_by: string;
  uploaded_at: string;
}

// ========== Interfaces combinées pour l'affichage ==========

export interface DemandeAchatComplete {
  // Données de base
  demande: BOPX_Achats_Demandes;
  piece: TN_Pieces;
  piece_achats: TN_Pieces_Achats;
  
  // Lignes de commande
  lignes: TN_Details_Pieces[];
  
  // Fournisseur
  fournisseur?: TN_Fournisseurs;
  
  // Validations
  validations: BOPX_Achats_Validations[];
  
  // Fichiers joints
  fichiers: BOPX_Achats_Fichiers[];
  
  // Données calculées
  montant_total: number;
  devise: string;
  nb_lignes: number;
  delai_traitement_jours?: number;
}

// ========== Types pour formulaires ==========

export interface LigneAchatForm {
  id: string; // temporaire pour React
  designation: string;
  quantite: number;
  prix_unitaire: number;
  montant_ligne: number;
  compte_comptable?: string;
  code_analytique?: string;
  rubrique_achat?: string;
  article_code?: string;
}

export interface DemandeAchatForm {
  // Type et rattachement
  type_demande: TypeDemande;
  dossier_id?: string;
  service_demandeur?: string;
  
  // Fournisseur et paiement
  fournisseur: string;
  mode_reglement: 'cash' | 'banque' | 'mobile_money';
  devise: string;
  
  // Détails demande
  priorite: 'basse' | 'normale' | 'urgente';
  motif_achat: string;
  observation?: string;
  date_besoin?: string;
  
  // Impact stock
  impact_stock: boolean;
  
  // Lignes
  lignes: LigneAchatForm[];
}

// ========== Enums et constantes ==========

export const SERVICES_DEMANDEURS = [
  'Administration',
  'IT',
  'HR',
  'Finance',
  'Logistics',
  'Operations',
  'Commercial',
  'Maintenance'
] as const;

export const RUBRIQUES_ACHAT = [
  'Fournitures de bureau',
  'Équipement informatique',
  'Mobilier',
  'Carburant',
  'Entretien & Maintenance',
  'Prestations de services',
  'Transport',
  'Télécommunications',
  'Consommables',
  'Autres'
] as const;

export const MODES_REGLEMENT = [
  { value: 'cash', label: 'Espèces (Cash)' },
  { value: 'banque', label: 'Virement bancaire' },
  { value: 'mobile_money', label: 'Mobile Money' }
] as const;

export const DEVISES = [
  { code: 'GHS', symbol: '₵', label: 'Ghana Cedi (GHS)' },
  { code: 'XOF', symbol: 'CFA', label: 'Franc CFA (XOF)' },
  { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)' }
] as const;

// ========== Plans d'achat ==========

export type TypeCalcul = 'fixe' | 'pourcentage' | 'quantite_x_taux' | 'formule_personnalisee';

export interface LignePlanAchat {
  id: string;
  code_ligne: string;
  designation: string;
  type_calcul: TypeCalcul;
  taux_unitaire?: number; // Pour quantite_x_taux
  montant_fixe?: number; // Pour fixe
  pourcentage?: number; // Pour pourcentage (appliqué sur quoi ?)
  base_calcul?: string; // Pour pourcentage - sur quel montant
  formule?: string; // Pour formule_personnalisee
  rubrique_achat?: string;
  compte_comptable?: string;
  fournisseur_suggere?: string;
  obligatoire: boolean;
  ordre_affichage: number;
  actif: boolean;
}

export interface PlanAchat {
  id: string;
  code_plan: string;
  designation: string;
  type_dossier: string; // "TRANSIT", "SHIPPING", "TRUCKING", etc.
  mode_transport?: string; // "MARITIME", "AERIEN", "ROUTIER"
  lignes: LignePlanAchat[];
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  actif: boolean;
}

// ========== Helpers pour plans d'achat ==========

export interface LigneAchatFromPlan extends LigneAchatForm {
  code_ligne_plan?: string;
  type_calcul?: TypeCalcul;
  base_calcul?: string;
  formule?: string;
  calculee_automatiquement: boolean;
}

// ========== Helpers pour statuts ==========

export const STATUT_LABELS: Record<StatutWorkflow, { fr: string; en: string; color: string }> = {
  brouillon: { fr: 'Brouillon', en: 'Draft', color: 'gray' },
  soumis: { fr: 'Soumis', en: 'Submitted', color: 'blue' },
  valide_niveau_1: { fr: 'Validé N1', en: 'Validated L1', color: 'indigo' },
  valide_niveau_2: { fr: 'Validé N2', en: 'Validated L2', color: 'purple' },
  approuve: { fr: 'Approuvé', en: 'Approved', color: 'green' },
  bc_genere: { fr: 'BC Généré', en: 'PO Generated', color: 'teal' },
  facture_recue: { fr: 'Facture reçue', en: 'Invoice received', color: 'cyan' },
  paye: { fr: 'Payé', en: 'Paid', color: 'emerald' },
  justifie: { fr: 'Justifié', en: 'Justified', color: 'lime' },
  clos: { fr: 'Clos', en: 'Closed', color: 'green' },
  rejete: { fr: 'Rejeté', en: 'Rejected', color: 'red' }
};

export const PRIORITE_LABELS: Record<'basse' | 'normale' | 'urgente', { fr: string; en: string; color: string }> = {
  basse: { fr: 'Basse', en: 'Low', color: 'gray' },
  normale: { fr: 'Normale', en: 'Normal', color: 'blue' },
  urgente: { fr: 'Urgente', en: 'Urgent', color: 'red' }
};

// ========== Droits utilisateurs (basé sur profils) ==========

export interface UserProfile {
  user_id: string;
  profile_purchases_validation: boolean; // Validation niveau 1
  profile_po_management: boolean; // Génération BC
  profile_purchases_payment: boolean; // Paiement
  profile_purchases_approval: boolean; // Validation niveau 2 (décaissement)
  user_approved: boolean;
  agences_autorisees: string[];
}

// ========== KPIs et reporting ==========

export interface AchatsKPI {
  total_demandes: number;
  montant_total: number;
  devise_reference: string;
  
  // Par statut
  brouillon: number;
  en_attente_validation: number;
  validees: number;
  payees: number;
  closes: number;
  rejetees: number;
  
  // Délais
  delai_moyen_validation_jours: number;
  delai_moyen_paiement_jours: number;
  
  // Conformité
  taux_justificatifs: number; // %
  demandes_en_retard: number;
  
  // Par type
  achats_dossier: number;
  achats_agence: number;
  
  // Impact stock
  achats_avec_stock: number;
  achats_sans_stock: number;
}