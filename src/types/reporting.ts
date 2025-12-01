// ========== Types Reporting et Analytics ==========

export type PeriodeRapport = 
  | 'jour'
  | 'semaine'
  | 'mois'
  | 'trimestre'
  | 'annee'
  | 'personnalise';

export type TypeRapport = 
  | 'achats_global'
  | 'fournisseurs'
  | 'budget'
  | 'delais'
  | 'stock'
  | 'paiements'
  | 'validations';

export interface DashboardAchats {
  periode: {
    debut: string;
    fin: string;
    type: PeriodeRapport;
  };
  
  // KPIs principaux
  kpis_globaux: KPIsGlobaux;
  
  // Graphiques
  graphiques: {
    evolution_achats: EvolutionAchats;
    repartition_categories: RepartitionCategories;
    top_fournisseurs: TopFournisseurs;
    delais_moyens: DelaisMoyens;
    taux_validation: TauxValidation;
  };
  
  // Tableaux détaillés
  tableaux: {
    da_en_cours: DemandeAchatResume[];
    bc_en_attente: BonCommandeResume[];
    factures_impayees: FactureResume[];
    alertes_stock: AlerteStockResume[];
  };
  
  // Comparaisons
  comparaisons: {
    vs_periode_precedente: ComparaisonPeriode;
    vs_budget: ComparaisonBudget;
  };
}

export interface KPIsGlobaux {
  // Demandes d'achat
  nombre_da_total: number;
  nombre_da_validees: number;
  nombre_da_rejetees: number;
  nombre_da_en_attente: number;
  taux_validation_da: number;
  
  // Bons de commande
  nombre_bc_total: number;
  nombre_bc_confirmes: number;
  nombre_bc_livres: number;
  montant_total_bc: number;
  devise_reference: string;
  
  // Factures et paiements
  nombre_factures_total: number;
  nombre_factures_payees: number;
  montant_factures_total: number;
  montant_paye: number;
  montant_restant: number;
  taux_paiement: number;
  
  // Délais
  delai_moyen_validation_da: number;      // Jours
  delai_moyen_emission_bc: number;        // Jours
  delai_moyen_livraison: number;          // Jours
  delai_moyen_paiement: number;           // Jours
  delai_moyen_cycle_complet: number;      // Jours (DA → Paiement)
  
  // Stock
  valeur_stock_total: number;
  nombre_articles_en_alerte: number;
  nombre_mouvements_periode: number;
  taux_rotation_moyen: number;
  
  // Budget
  budget_alloue?: number;
  budget_consomme: number;
  budget_restant?: number;
  taux_consommation_budget?: number;
}

export interface EvolutionAchats {
  periodes: string[];                     // Labels axes X
  series: {
    demandes_achat: number[];
    bons_commande: number[];
    factures: number[];
    montants: number[];                   // Montants en devise ref
  };
}

export interface RepartitionCategories {
  categories: {
    nom: string;
    montant: number;
    pourcentage: number;
    nombre_achats: number;
    couleur: string;
  }[];
}

export interface TopFournisseurs {
  fournisseurs: {
    code: string;
    nom: string;
    nombre_commandes: number;
    montant_total: number;
    montant_moyen: number;
    delai_moyen_livraison: number;
    taux_conformite: number;              // % livraisons conformes
    note_performance: number;             // 0-10
  }[];
  limite: number;                         // Top X
}

export interface DelaisMoyens {
  etapes: {
    nom: string;
    delai_moyen: number;                  // Jours
    delai_min: number;
    delai_max: number;
    objectif?: number;                    // Délai cible
    conforme: boolean;                    // Respecte objectif ?
  }[];
}

export interface TauxValidation {
  par_niveau: {
    niveau: string;
    total_validations: number;
    validations_approuvees: number;
    validations_rejetees: number;
    taux_approbation: number;
    delai_moyen: number;
  }[];
  
  par_valideur: {
    valideur: string;
    nombre_validations: number;
    taux_approbation: number;
    delai_moyen: number;
  }[];
}

export interface DemandeAchatResume {
  numero_da: string;
  date_creation: string;
  demandeur: string;
  montant_total: number;
  devise: string;
  statut: string;
  delai_validation: number;
  en_retard: boolean;
}

export interface BonCommandeResume {
  numero_bc: string;
  date_emission: string;
  fournisseur: string;
  montant_total: number;
  devise: string;
  statut: string;
  delai_livraison_prevu: number;
  en_retard: boolean;
}

export interface FactureResume {
  numero_facture: string;
  numero_interne: string;
  fournisseur: string;
  date_facture: string;
  date_echeance: string;
  montant_ttc: number;
  montant_restant: number;
  devise: string;
  jours_retard: number;
}

export interface AlerteStockResume {
  article_code: string;
  article_nom: string;
  stock_actuel: number;
  stock_minimum: number;
  unite: string;
  gravite: string;
  action_recommandee: string;
}

export interface ComparaisonPeriode {
  periode_actuelle: {
    debut: string;
    fin: string;
  };
  periode_precedente: {
    debut: string;
    fin: string;
  };
  
  variations: {
    nombre_da: {
      actuel: number;
      precedent: number;
      variation: number;
      variation_pourcent: number;
    };
    montant_achats: {
      actuel: number;
      precedent: number;
      variation: number;
      variation_pourcent: number;
    };
    delai_moyen: {
      actuel: number;
      precedent: number;
      variation: number;
      variation_pourcent: number;
    };
  };
}

export interface ComparaisonBudget {
  budget_total: number;
  consomme: number;
  restant: number;
  taux_consommation: number;
  
  par_categorie: {
    categorie: string;
    budget: number;
    consomme: number;
    restant: number;
    taux_consommation: number;
    depassement: boolean;
  }[];
  
  tendance: 'sous_budget' | 'conforme' | 'risque_depassement' | 'depassement';
  projection_fin_periode: number;
}

// ========== Rapports spécifiques ==========

export interface RapportFournisseur {
  fournisseur: {
    code: string;
    nom: string;
    contact: string;
    email: string;
  };
  
  periode: {
    debut: string;
    fin: string;
  };
  
  statistiques: {
    nombre_commandes: number;
    montant_total: number;
    montant_moyen: number;
    montant_minimum: number;
    montant_maximum: number;
    
    delai_moyen_livraison: number;
    delai_min_livraison: number;
    delai_max_livraison: number;
    
    taux_livraison_temps: number;         // % livrées à temps
    taux_conformite: number;              // % conformes
    nombre_litiges: number;
    nombre_retours: number;
  };
  
  historique_commandes: {
    numero_bc: string;
    date: string;
    montant: number;
    delai_livraison: number;
    conforme: boolean;
  }[];
  
  note_performance: {
    note_globale: number;                 // 0-10
    criteres: {
      prix: number;
      delais: number;
      qualite: number;
      service: number;
      fiabilite: number;
    };
  };
  
  recommandation: 'excellent' | 'bon' | 'moyen' | 'a_surveiller' | 'a_eviter';
}

export interface RapportBudget {
  periode: {
    debut: string;
    fin: string;
    type: 'mensuel' | 'trimestriel' | 'annuel';
  };
  
  budget_global: {
    alloue: number;
    consomme: number;
    restant: number;
    taux_consommation: number;
  };
  
  par_categorie: {
    categorie: string;
    budget_alloue: number;
    consomme: number;
    restant: number;
    taux_consommation: number;
    depassement: boolean;
    montant_depassement?: number;
  }[];
  
  par_agence: {
    agence: string;
    budget_alloue: number;
    consomme: number;
    restant: number;
    taux_consommation: number;
  }[];
  
  tendances: {
    mois: string;
    budget: number;
    consomme: number;
    cumul_consomme: number;
  }[];
  
  alertes: {
    type: 'depassement' | 'risque_depassement' | 'sous_consommation';
    categorie: string;
    message: string;
    gravite: 'info' | 'warning' | 'critical';
  }[];
}

export interface RapportDelais {
  periode: {
    debut: string;
    fin: string;
  };
  
  cycle_complet: {
    delai_moyen: number;
    delai_min: number;
    delai_max: number;
    objectif: number;
    taux_respect_objectif: number;
  };
  
  par_etape: {
    etape: string;
    delai_moyen: number;
    delai_min: number;
    delai_max: number;
    objectif?: number;
    nombre_transactions: number;
  }[];
  
  par_fournisseur: {
    fournisseur: string;
    delai_moyen_livraison: number;
    nombre_livraisons: number;
    livraisons_temps: number;
    livraisons_retard: number;
  }[];
  
  distribution: {
    tranche: string;                      // "0-5j", "5-10j", etc.
    nombre: number;
    pourcentage: number;
  }[];
}

// ========== Export et impression ==========

export interface ConfigExport {
  format: 'excel' | 'pdf' | 'csv';
  type_rapport: TypeRapport;
  periode: {
    debut: string;
    fin: string;
  };
  filtres?: {
    agence?: string;
    fournisseur?: string;
    categorie?: string;
    statut?: string;
  };
  options: {
    inclure_graphiques: boolean;
    inclure_details: boolean;
    inclure_logos: boolean;
    orientation?: 'portrait' | 'paysage';
  };
}

export interface RapportGenere {
  id: string;
  type: TypeRapport;
  titre: string;
  date_generation: string;
  genere_par: string;
  periode: {
    debut: string;
    fin: string;
  };
  format: string;
  taille: number;
  url: string;
}

// ========== Labels et configurations ==========

export const PERIODES_RAPPORTS = [
  { value: 'jour', label: 'Aujourd\'hui' },
  { value: 'semaine', label: 'Cette semaine' },
  { value: 'mois', label: 'Ce mois' },
  { value: 'trimestre', label: 'Ce trimestre' },
  { value: 'annee', label: 'Cette année' },
  { value: 'personnalise', label: 'Personnalisé' }
] as const;

export const TYPES_RAPPORTS = [
  { value: 'achats_global', label: 'Achats global', icon: '📊' },
  { value: 'fournisseurs', label: 'Fournisseurs', icon: '🏢' },
  { value: 'budget', label: 'Budget', icon: '💰' },
  { value: 'delais', label: 'Délais', icon: '⏱️' },
  { value: 'stock', label: 'Stock', icon: '📦' },
  { value: 'paiements', label: 'Paiements', icon: '💳' },
  { value: 'validations', label: 'Validations', icon: '✓' }
] as const;

export const COULEURS_GRAPHIQUES = [
  '#3b82f6', // Bleu
  '#10b981', // Vert
  '#f59e0b', // Orange
  '#ef4444', // Rouge
  '#8b5cf6', // Violet
  '#ec4899', // Rose
  '#06b6d4', // Cyan
  '#f97316', // Orange foncé
  '#14b8a6', // Teal
  '#6366f1'  // Indigo
] as const;

// ========== Fonctions utilitaires ==========

export function calculerVariation(actuel: number, precedent: number): {
  variation: number;
  variation_pourcent: number;
  tendance: 'hausse' | 'baisse' | 'stable';
} {
  const variation = actuel - precedent;
  const variation_pourcent = precedent === 0 ? 0 : (variation / precedent) * 100;
  
  let tendance: 'hausse' | 'baisse' | 'stable' = 'stable';
  if (Math.abs(variation_pourcent) > 5) {
    tendance = variation > 0 ? 'hausse' : 'baisse';
  }
  
  return { variation, variation_pourcent, tendance };
}

export function determinerTendanceBudget(taux_consommation: number, pourcentage_periode: number): 
  'sous_budget' | 'conforme' | 'risque_depassement' | 'depassement' {
  
  if (taux_consommation > 100) return 'depassement';
  
  const ecart = taux_consommation - pourcentage_periode;
  
  if (ecart > 10) return 'risque_depassement';
  if (ecart < -10) return 'sous_budget';
  return 'conforme';
}

export function calculerNotePerformance(criteres: {
  prix: number;
  delais: number;
  qualite: number;
  service: number;
  fiabilite: number;
}): number {
  const poids = {
    prix: 0.20,
    delais: 0.25,
    qualite: 0.30,
    service: 0.15,
    fiabilite: 0.10
  };
  
  return (
    criteres.prix * poids.prix +
    criteres.delais * poids.delais +
    criteres.qualite * poids.qualite +
    criteres.service * poids.service +
    criteres.fiabilite * poids.fiabilite
  );
}

export function determinerRecommandationFournisseur(note: number): 
  'excellent' | 'bon' | 'moyen' | 'a_surveiller' | 'a_eviter' {
  
  if (note >= 8.5) return 'excellent';
  if (note >= 7.0) return 'bon';
  if (note >= 5.5) return 'moyen';
  if (note >= 4.0) return 'a_surveiller';
  return 'a_eviter';
}

export function genererPeriodesComparaison(periode: { debut: string; fin: string }): {
  actuelle: { debut: string; fin: string };
  precedente: { debut: string; fin: string };
} {
  const debut = new Date(periode.debut);
  const fin = new Date(periode.fin);
  const duree = fin.getTime() - debut.getTime();
  
  const debutPrecedente = new Date(debut.getTime() - duree);
  const finPrecedente = new Date(debut.getTime() - 1);
  
  return {
    actuelle: periode,
    precedente: {
      debut: debutPrecedente.toISOString().split('T')[0],
      fin: finPrecedente.toISOString().split('T')[0]
    }
  };
}

export function calculerProjectionBudget(
  consomme: number,
  joursEcoules: number,
  joursTotal: number
): number {
  if (joursEcoules === 0) return consomme;
  
  const tauxConsommationJournalier = consomme / joursEcoules;
  return tauxConsommationJournalier * joursTotal;
}

export function determinerCouleurKPI(valeur: number, objectif: number, inverse: boolean = false): string {
  const ratio = valeur / objectif;
  
  if (inverse) {
    // Pour les KPIs où moins c'est mieux (ex: délais)
    if (ratio <= 0.8) return 'green';
    if (ratio <= 1.0) return 'yellow';
    return 'red';
  } else {
    // Pour les KPIs où plus c'est mieux (ex: taux validation)
    if (ratio >= 0.9) return 'green';
    if (ratio >= 0.7) return 'yellow';
    return 'red';
  }
}

export function formaterMontant(montant: number, devise: string, decimales: number = 2): string {
  return `${montant.toFixed(decimales)} ${devise}`;
}

export function formaterDuree(jours: number): string {
  if (jours === 0) return '0 jour';
  if (jours === 1) return '1 jour';
  if (jours < 7) return `${jours} jours`;
  
  const semaines = Math.floor(jours / 7);
  const joursRestants = jours % 7;
  
  if (joursRestants === 0) {
    return semaines === 1 ? '1 semaine' : `${semaines} semaines`;
  }
  
  return `${semaines}s ${joursRestants}j`;
}

export function formaterPourcentage(valeur: number, decimales: number = 1): string {
  return `${valeur.toFixed(decimales)}%`;
}

export function obtenirIconeTendance(tendance: 'hausse' | 'baisse' | 'stable'): string {
  switch (tendance) {
    case 'hausse': return '📈';
    case 'baisse': return '📉';
    case 'stable': return '➡️';
  }
}

export function obtenirCouleurTendance(
  tendance: 'hausse' | 'baisse' | 'stable',
  positif_si_hausse: boolean = true
): string {
  if (tendance === 'stable') return 'gray';
  
  if (positif_si_hausse) {
    return tendance === 'hausse' ? 'green' : 'red';
  } else {
    return tendance === 'hausse' ? 'red' : 'green';
  }
}
