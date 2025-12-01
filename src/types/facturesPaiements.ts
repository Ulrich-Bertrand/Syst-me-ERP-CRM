// ========== Types Factures Fournisseurs et Paiements ==========

export type StatutFacture = 
  | 'saisie'              // Facture saisie, en attente contrôle
  | 'controlee'           // Contrôle 3 voies OK
  | 'ecart_detecte'       // Écarts détectés (montant, quantité...)
  | 'validee_paiement'    // Validée pour paiement
  | 'paiement_partiel'    // Partiellement payée
  | 'payee'               // Totalement payée
  | 'litige'              // En litige avec fournisseur
  | 'annulee';            // Facture annulée

export type TypePaiement = 
  | 'especes'             // Cash
  | 'virement'            // Virement bancaire
  | 'cheque'              // Chèque
  | 'mobile_money'        // Mobile Money (MTN, Vodafone, etc.)
  | 'compensation';       // Compensation (avoir)

export type StatutPaiement = 
  | 'programme'           // Programmé (date future)
  | 'en_cours'            // En cours de traitement
  | 'effectue'            // Effectué avec succès
  | 'rejete'              // Rejeté (fonds insuffisants, etc.)
  | 'annule';             // Annulé

export interface FactureFournisseur {
  id: string;
  numero_facture: string;        // Numéro facture fournisseur
  numero_interne?: string;       // Numéro interne comptabilité
  
  // Liens
  demande_achat_id: string;
  demande_achat_ref: string;
  bon_commande_id?: string;
  bon_commande_ref?: string;
  
  // Fournisseur
  fournisseur: {
    code_fournisseur: string;
    nom: string;
    compte_comptable: string;
  };
  
  // Dates
  date_facture: string;          // Date sur la facture
  date_echeance: string;         // Date d'échéance paiement
  date_reception_facture: string; // Date réception physique/email
  date_saisie: string;           // Date de saisie dans système
  
  // Montants
  lignes: LigneFacture[];
  montant_ht: number;
  tva_details?: {
    taux_pourcent: number;
    montant_tva: number;
    numero_tva_fournisseur?: string;
  }[];
  montant_total_tva: number;
  montant_ttc: number;
  devise: string;
  
  // Paiement
  montant_paye: number;
  montant_restant: number;
  paiements: Paiement[];
  
  // Contrôle 3 voies
  controle_3_voies?: Controle3Voies;
  
  // Statut
  statut: StatutFacture;
  
  // Justificatifs
  fichier_facture_url?: string;   // PDF/image facture
  fichiers_annexes: FichierFacture[];
  
  // Comptabilité
  piece_comptable_id?: string;
  imputation_analytique?: ImputationAnalytique[];
  
  // Litige
  en_litige: boolean;
  motif_litige?: string;
  date_litige?: string;
  
  // Métadonnées
  saisie_par: string;
  saisie_le: string;
  validee_par?: string;
  validee_le?: string;
  notes?: string;
}

export interface LigneFacture {
  id: string;
  numero_ligne: number;
  designation: string;
  quantite_facturee: number;
  unite: string;
  prix_unitaire: number;
  montant_ht: number;
  taux_tva?: number;
  montant_tva?: number;
  montant_ttc: number;
  
  // Contrôle
  ligne_bc_id?: string;          // Lien avec ligne BC
  ecart_quantite?: number;       // Écart vs BC
  ecart_prix?: number;           // Écart vs BC
  ecart_montant?: number;        // Écart vs BC
  
  // Comptabilité
  compte_comptable?: string;
  code_analytique?: string;
}

export interface Controle3Voies {
  effectue_le: string;
  effectue_par: string;
  
  // Résultat global
  conforme: boolean;
  ecarts_detectes: EcartControle[];
  taux_conformite: number;       // Pourcentage
  
  // Détails
  comparaison_da_bc: {
    conforme: boolean;
    ecarts: string[];
  };
  comparaison_bc_facture: {
    conforme: boolean;
    ecarts: string[];
  };
  comparaison_reception: {
    conforme: boolean;
    ecarts: string[];
  };
  
  // Décision
  decision: 'approuver' | 'rejeter' | 'investigation';
  commentaire?: string;
  
  // Validation
  valideur_niveau_1?: string;
  validation_niveau_1_le?: string;
  valideur_niveau_2?: string;
  validation_niveau_2_le?: string;
}

export interface EcartControle {
  type: 'quantite' | 'prix' | 'montant' | 'tva' | 'autre';
  description: string;
  ligne_numero?: number;
  valeur_attendue: number | string;
  valeur_facturee: number | string;
  ecart: number;
  ecart_pourcent: number;
  gravite: 'faible' | 'moyenne' | 'haute';
  action_requise?: string;
}

export interface Paiement {
  id: string;
  numero_paiement: string;       // PAY-GH-2025-XXX
  facture_id: string;
  
  // Montant
  montant: number;
  devise: string;
  
  // Type et méthode
  type_paiement: TypePaiement;
  statut: StatutPaiement;
  
  // Dates
  date_programmation?: string;   // Si programmé
  date_execution: string;        // Date effective
  date_valeur?: string;          // Date valeur bancaire
  
  // Détails selon type
  details_virement?: {
    banque_emettrice: string;
    compte_debit: string;
    banque_receptrice: string;
    compte_credit: string;
    reference_virement: string;
    frais_bancaires?: number;
  };
  
  details_cheque?: {
    numero_cheque: string;
    banque_emettrice: string;
    date_emission: string;
    beneficiaire: string;
  };
  
  details_especes?: {
    caisse: string;
    recu_par: string;
    recu_numero?: string;
  };
  
  details_mobile_money?: {
    operateur: 'MTN' | 'Vodafone' | 'AirtelTigo' | 'Autre';
    numero_telephone: string;
    reference_transaction: string;
    frais_transaction?: number;
  };
  
  // Justificatifs
  justificatifs: JustificatifPaiement[];
  justificatif_valide: boolean;
  
  // Comptabilité
  piece_comptable_id?: string;
  compte_tresorerie: string;
  
  // Métadonnées
  effectue_par: string;
  effectue_le: string;
  validee_par?: string;
  validee_le?: string;
  notes?: string;
}

export interface JustificatifPaiement {
  id: string;
  type: 'releve_bancaire' | 'recu_caisse' | 'confirmation_mobile' | 'autre';
  nom_fichier: string;
  url: string;
  taille: number;
  uploaded_le: string;
  uploaded_par: string;
  valide: boolean;
  valideur?: string;
  date_validation?: string;
}

export interface FichierFacture {
  id: string;
  type: 'facture' | 'bon_livraison' | 'bordereau' | 'autre';
  nom: string;
  url: string;
  taille: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface ImputationAnalytique {
  compte_analytique: string;
  libelle: string;
  montant: number;
  pourcentage: number;
}

// ========== Séries de numérotation ==========

export interface SerieNumerotationPaiement {
  id: string;
  code_serie: string;        // "PAY-GH", "PAY-CI", "PAY-BF"
  agence: string;
  prefixe: string;
  separateur: string;
  inclure_annee: boolean;
  format_annee: 'YYYY' | 'YY';
  nombre_chiffres: number;
  compteur_actuel: number;
  reinitialiser_annuel: boolean;
  actif: boolean;
}

// ========== Configuration paiements ==========

export interface MethodePaiementConfig {
  type: TypePaiement;
  nom: string;
  icon: string;
  actif: boolean;
  limite_montant?: number;
  delai_traitement_jours: number;
  frais_fixe?: number;
  frais_pourcentage?: number;
  necessite_validation: boolean;
  necessite_justificatif: boolean;
}

// ========== Labels et configurations ==========

export const STATUT_FACTURE_LABELS: Record<StatutFacture, { 
  fr: string; 
  en: string; 
  color: string; 
  icon: string;
}> = {
  saisie: {
    fr: 'Saisie',
    en: 'Entered',
    color: 'blue',
    icon: '📝'
  },
  controlee: {
    fr: 'Contrôlée',
    en: 'Checked',
    color: 'indigo',
    icon: '✓'
  },
  ecart_detecte: {
    fr: 'Écart détecté',
    en: 'Discrepancy',
    color: 'orange',
    icon: '⚠️'
  },
  validee_paiement: {
    fr: 'Validée paiement',
    en: 'Approved for payment',
    color: 'purple',
    icon: '✓✓'
  },
  paiement_partiel: {
    fr: 'Paiement partiel',
    en: 'Partial payment',
    color: 'yellow',
    icon: '💰'
  },
  payee: {
    fr: 'Payée',
    en: 'Paid',
    color: 'green',
    icon: '✅'
  },
  litige: {
    fr: 'Litige',
    en: 'Dispute',
    color: 'red',
    icon: '⚡'
  },
  annulee: {
    fr: 'Annulée',
    en: 'Cancelled',
    color: 'gray',
    icon: '❌'
  }
};

export const STATUT_PAIEMENT_LABELS: Record<StatutPaiement, {
  fr: string;
  en: string;
  color: string;
  icon: string;
}> = {
  programme: {
    fr: 'Programmé',
    en: 'Scheduled',
    color: 'blue',
    icon: '📅'
  },
  en_cours: {
    fr: 'En cours',
    en: 'Processing',
    color: 'orange',
    icon: '⏳'
  },
  effectue: {
    fr: 'Effectué',
    en: 'Completed',
    color: 'green',
    icon: '✅'
  },
  rejete: {
    fr: 'Rejeté',
    en: 'Rejected',
    color: 'red',
    icon: '❌'
  },
  annule: {
    fr: 'Annulé',
    en: 'Cancelled',
    color: 'gray',
    icon: '⊘'
  }
};

export const METHODES_PAIEMENT_CONFIG: MethodePaiementConfig[] = [
  {
    type: 'virement',
    nom: 'Virement bancaire',
    icon: '🏦',
    actif: true,
    delai_traitement_jours: 1,
    frais_fixe: 5.00,
    necessite_validation: true,
    necessite_justificatif: true
  },
  {
    type: 'mobile_money',
    nom: 'Mobile Money',
    icon: '📱',
    actif: true,
    limite_montant: 10000,
    delai_traitement_jours: 0,
    frais_pourcentage: 1,
    necessite_validation: true,
    necessite_justificatif: true
  },
  {
    type: 'especes',
    nom: 'Espèces',
    icon: '💵',
    actif: true,
    limite_montant: 5000,
    delai_traitement_jours: 0,
    necessite_validation: true,
    necessite_justificatif: true
  },
  {
    type: 'cheque',
    nom: 'Chèque',
    icon: '📝',
    actif: true,
    delai_traitement_jours: 2,
    necessite_validation: true,
    necessite_justificatif: false
  },
  {
    type: 'compensation',
    nom: 'Compensation',
    icon: '↔️',
    actif: false,
    delai_traitement_jours: 0,
    necessite_validation: true,
    necessite_justificatif: false
  }
];

// ========== Fonctions utilitaires ==========

export function calculerEcartPourcentage(valeurAttendue: number, valeurReelle: number): number {
  if (valeurAttendue === 0) return 0;
  return ((valeurReelle - valeurAttendue) / valeurAttendue) * 100;
}

export function determinerGraviteEcart(ecartPourcent: number): 'faible' | 'moyenne' | 'haute' {
  const abs = Math.abs(ecartPourcent);
  if (abs < 2) return 'faible';      // < 2%
  if (abs < 5) return 'moyenne';     // 2-5%
  return 'haute';                    // > 5%
}

export function calculerMontantRestant(facture: FactureFournisseur): number {
  return facture.montant_ttc - facture.montant_paye;
}

export function verifierEcheanceDepassee(dateEcheance: string): boolean {
  return new Date(dateEcheance) < new Date();
}

export function calculerJoursRetard(dateEcheance: string): number {
  const now = new Date();
  const echeance = new Date(dateEcheance);
  if (echeance >= now) return 0;
  
  const diff = now.getTime() - echeance.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function determinerStatutFacture(facture: FactureFournisseur): StatutFacture {
  if (facture.en_litige) return 'litige';
  if (facture.montant_paye === 0 && facture.statut === 'validee_paiement') return 'validee_paiement';
  if (facture.montant_paye === facture.montant_ttc) return 'payee';
  if (facture.montant_paye > 0) return 'paiement_partiel';
  if (facture.controle_3_voies && !facture.controle_3_voies.conforme) return 'ecart_detecte';
  if (facture.controle_3_voies && facture.controle_3_voies.conforme) return 'controlee';
  return 'saisie';
}

export function genererNumeroFactureInterne(compteur: number): string {
  const annee = new Date().getFullYear();
  return `FRN-${annee}-${compteur.toString().padStart(4, '0')}`;
}

export function calculerFraisPaiement(montant: number, methode: MethodePaiementConfig): number {
  let frais = 0;
  if (methode.frais_fixe) frais += methode.frais_fixe;
  if (methode.frais_pourcentage) frais += (montant * methode.frais_pourcentage) / 100;
  return frais;
}

export function verifierLimiteMontant(montant: number, methode: MethodePaiementConfig): {
  autorise: boolean;
  message?: string;
} {
  if (methode.limite_montant && montant > methode.limite_montant) {
    return {
      autorise: false,
      message: `Montant supérieur à la limite de ${methode.limite_montant} ${methode.nom}`
    };
  }
  return { autorise: true };
}

// ========== Workflow helpers ==========

export function peutSaisirFacture(bc_statut: string): boolean {
  return ['confirme', 'reception_partielle', 'reception_complete'].includes(bc_statut);
}

export function peutValiderPaiement(
  facture: FactureFournisseur,
  userProfile: { profile_purchases_payment: boolean }
): boolean {
  return userProfile.profile_purchases_payment && 
         facture.statut === 'validee_paiement' &&
         facture.montant_restant > 0;
}

export function necessiteControle3Voies(montant: number, devise: string): boolean {
  // Tous les montants nécessitent contrôle 3 voies
  return true;
}
