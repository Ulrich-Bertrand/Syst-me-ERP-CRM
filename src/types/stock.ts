// ========== Types Gestion Stock ==========

export type TypeMouvement = 
  | 'entree_achat'        // Entrée suite achat
  | 'entree_retour'       // Retour client
  | 'entree_transfert'    // Transfert entre agences
  | 'entree_ajustement'   // Ajustement inventaire (positif)
  | 'sortie_vente'        // Sortie pour vente
  | 'sortie_consommation' // Consommation interne
  | 'sortie_transfert'    // Transfert sortant
  | 'sortie_perte'        // Perte/casse
  | 'sortie_ajustement';  // Ajustement inventaire (négatif)

export type StatutMouvement = 
  | 'brouillon'           // En cours de saisie
  | 'valide'              // Validé et impacte stock
  | 'annule';             // Annulé

export type MethodeValorisationStock = 
  | 'PMP'                 // Prix Moyen Pondéré
  | 'FIFO'                // First In First Out
  | 'LIFO'                // Last In First Out
  | 'CMUP';               // Coût Moyen Unitaire Pondéré

export interface Article {
  id: string;
  code_article: string;           // ART-XXX
  designation: string;
  description?: string;
  
  // Catégories
  categorie: CategorieArticle;
  sous_categorie?: string;
  famille?: string;
  
  // Unités
  unite_stock: string;            // "Unité", "Kg", "Litre", "Carton"
  unite_achat?: string;
  unite_vente?: string;
  coefficient_conversion?: number; // Ex: 1 carton = 24 unités
  
  // Stock
  stock_actuel: number;
  stock_minimum: number;
  stock_maximum: number;
  stock_alerte: number;
  stock_reserve?: number;          // Stock réservé (commandes en cours)
  stock_disponible: number;        // stock_actuel - stock_reserve
  
  // Emplacements
  emplacement_principal?: string;
  emplacements_secondaires?: string[];
  
  // Valorisation
  methode_valorisation: MethodeValorisationStock;
  prix_achat_moyen: number;        // PMP
  prix_dernier_achat: number;
  cout_stockage?: number;
  devise: string;
  
  // Fournisseurs
  fournisseur_principal?: string;
  fournisseurs_alternatifs?: string[];
  delai_approvisionnement_jours?: number;
  
  // Caractéristiques
  code_barre?: string;
  reference_fournisseur?: string;
  numero_serie?: boolean;          // Article sérialisé ?
  numero_lot?: boolean;            // Article avec numéro de lot ?
  date_peremption?: boolean;       // Article périssable ?
  
  // Dimensions
  poids_unitaire?: number;
  poids_unite?: string;
  volume?: number;
  volume_unite?: string;
  
  // Gestion
  actif: boolean;
  stockable: boolean;
  achetable: boolean;
  vendable: boolean;
  
  // Comptabilité
  compte_stock?: string;
  compte_achat?: string;
  compte_vente?: string;
  
  // Images
  image_url?: string;
  
  // Métadonnées
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
}

export type CategorieArticle = 
  | 'matiere_premiere'
  | 'fourniture_bureau'
  | 'consommable'
  | 'equipement'
  | 'piece_detachee'
  | 'emballage'
  | 'autre';

export interface MouvementStock {
  id: string;
  numero_mouvement: string;        // MVT-GH-2025-XXX
  
  // Type et direction
  type_mouvement: TypeMouvement;
  sens: 'entree' | 'sortie';
  
  // Article
  article_id: string;
  article_code: string;
  article_designation: string;
  
  // Quantité
  quantite: number;
  unite: string;
  
  // Valorisation
  prix_unitaire: number;           // Prix au moment du mouvement
  montant_total: number;           // quantite × prix_unitaire
  devise: string;
  
  // Après mouvement
  stock_avant: number;
  stock_apres: number;
  valeur_stock_avant: number;
  valeur_stock_apres: number;
  nouveau_pmp?: number;            // Nouveau PMP après mouvement
  
  // Origine
  origine_type?: 'bon_commande' | 'facture' | 'vente' | 'transfert' | 'inventaire';
  origine_id?: string;
  origine_ref?: string;
  
  // Emplacement
  emplacement?: string;
  magasin?: string;
  
  // Détails selon type
  details_reception?: {
    bon_commande_id: string;
    bon_livraison_ref?: string;
    date_reception: string;
    receptionne_par: string;
  };
  
  details_sortie?: {
    demandeur: string;
    service: string;
    bon_sortie_ref?: string;
    motif: string;
  };
  
  details_transfert?: {
    agence_source: string;
    agence_destination: string;
    bon_transfert_ref?: string;
  };
  
  details_ajustement?: {
    inventaire_id?: string;
    ecart_quantite: number;
    motif: string;
    valideur: string;
  };
  
  // Numéros de série/lot (si applicable)
  numeros_serie?: string[];
  numero_lot?: string;
  date_fabrication?: string;
  date_peremption?: string;
  
  // Statut
  statut: StatutMouvement;
  
  // Pièce comptable
  piece_comptable_id?: string;
  impacte_comptabilite: boolean;
  
  // Métadonnées
  date_mouvement: string;
  effectue_par: string;
  valide_par?: string;
  valide_le?: string;
  commentaire?: string;
  
  created_at: string;
}

export interface Inventaire {
  id: string;
  numero_inventaire: string;       // INV-GH-2025-XXX
  
  // Périmètre
  type_inventaire: 'complet' | 'partiel' | 'tournant';
  magasin?: string;
  emplacement?: string;
  categorie_article?: CategorieArticle;
  articles_selectionnes?: string[]; // Si inventaire partiel
  
  // Dates
  date_debut: string;
  date_fin?: string;
  date_cloture?: string;
  
  // Statut
  statut: 'en_cours' | 'termine' | 'valide' | 'annule';
  
  // Lignes
  lignes: LigneInventaire[];
  
  // Résultats
  nombre_articles_comptes: number;
  nombre_ecarts: number;
  valeur_ecarts_positifs: number;
  valeur_ecarts_negatifs: number;
  valeur_ecart_total: number;
  taux_fiabilite: number;          // % articles sans écart
  
  // Validation
  valideur?: string;
  date_validation?: string;
  mouvements_ajustement_generes: string[]; // IDs des mouvements créés
  
  // Équipe
  responsable: string;
  compteurs: string[];             // Liste des personnes qui comptent
  
  // Métadonnées
  created_by: string;
  created_at: string;
  commentaire?: string;
}

export interface LigneInventaire {
  id: string;
  article_id: string;
  article_code: string;
  article_designation: string;
  
  // Quantités
  quantite_theorique: number;      // Stock système
  quantite_comptee?: number;       // Stock physique compté
  ecart_quantite?: number;         // Différence
  ecart_pourcent?: number;
  
  // Valorisation
  prix_unitaire: number;           // PMP au moment de l'inventaire
  valeur_theorique: number;
  valeur_comptee?: number;
  valeur_ecart?: number;
  
  // Détails comptage
  compte_par?: string;
  compte_le?: string;
  recompte_requis: boolean;
  recompte_par?: string;
  
  // Justification écart
  motif_ecart?: string;
  action_corrective?: string;
  
  // Statut
  statut: 'a_compter' | 'compte' | 'valide';
  
  // Emplacement
  emplacement?: string;
}

export interface ValorisationStock {
  article_id: string;
  date_valorisation: string;
  
  // Quantités
  quantite_stock: number;
  
  // Valeurs
  pmp_actuel: number;
  valeur_stock_pmp: number;        // quantite × PMP
  
  // Historique mouvements (pour calcul PMP)
  historique_achats: {
    date: string;
    quantite: number;
    prix_unitaire: number;
    montant: number;
  }[];
  
  // Statistiques
  rotation_stock?: number;          // Nombre de rotations/an
  duree_stock_moyen?: number;       // Jours
  stock_mort?: boolean;             // Pas de mouvement depuis X jours
}

export interface AlerteStock {
  id: string;
  article_id: string;
  article_code: string;
  article_designation: string;
  
  type_alerte: 'stock_minimum' | 'stock_maximum' | 'peremption_proche' | 'stock_negatif';
  gravite: 'info' | 'warning' | 'critical';
  
  message: string;
  
  stock_actuel: number;
  seuil: number;
  
  date_alerte: string;
  acquittee: boolean;
  acquittee_par?: string;
  acquittee_le?: string;
  
  action_recommandee?: string;
}

// ========== Séries de numérotation ==========

export interface SerieNumerotationMouvement {
  id: string;
  code_serie: string;
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

// ========== Labels et configurations ==========

export const TYPE_MOUVEMENT_LABELS: Record<TypeMouvement, {
  fr: string;
  en: string;
  icon: string;
  color: string;
  sens: 'entree' | 'sortie';
}> = {
  entree_achat: {
    fr: 'Entrée achat',
    en: 'Purchase receipt',
    icon: '📦',
    color: 'green',
    sens: 'entree'
  },
  entree_retour: {
    fr: 'Retour client',
    en: 'Customer return',
    icon: '↩️',
    color: 'blue',
    sens: 'entree'
  },
  entree_transfert: {
    fr: 'Transfert entrant',
    en: 'Incoming transfer',
    icon: '⬅️',
    color: 'indigo',
    sens: 'entree'
  },
  entree_ajustement: {
    fr: 'Ajustement +',
    en: 'Adjustment +',
    icon: '➕',
    color: 'cyan',
    sens: 'entree'
  },
  sortie_vente: {
    fr: 'Sortie vente',
    en: 'Sales delivery',
    icon: '🚚',
    color: 'purple',
    sens: 'sortie'
  },
  sortie_consommation: {
    fr: 'Consommation',
    en: 'Internal use',
    icon: '🔧',
    color: 'orange',
    sens: 'sortie'
  },
  sortie_transfert: {
    fr: 'Transfert sortant',
    en: 'Outgoing transfer',
    icon: '➡️',
    color: 'indigo',
    sens: 'sortie'
  },
  sortie_perte: {
    fr: 'Perte/Casse',
    en: 'Loss/Breakage',
    icon: '❌',
    color: 'red',
    sens: 'sortie'
  },
  sortie_ajustement: {
    fr: 'Ajustement -',
    en: 'Adjustment -',
    icon: '➖',
    color: 'yellow',
    sens: 'sortie'
  }
};

export const CATEGORIE_ARTICLE_LABELS: Record<CategorieArticle, string> = {
  matiere_premiere: 'Matière première',
  fourniture_bureau: 'Fourniture de bureau',
  consommable: 'Consommable',
  equipement: 'Équipement',
  piece_detachee: 'Pièce détachée',
  emballage: 'Emballage',
  autre: 'Autre'
};

export const UNITES_STOCK = [
  { value: 'unite', label: 'Unité' },
  { value: 'kg', label: 'Kilogramme (Kg)' },
  { value: 'litre', label: 'Litre (L)' },
  { value: 'metre', label: 'Mètre (m)' },
  { value: 'boite', label: 'Boîte' },
  { value: 'carton', label: 'Carton' },
  { value: 'palette', label: 'Palette' },
  { value: 'lot', label: 'Lot' },
  { value: 'piece', label: 'Pièce' },
  { value: 'rouleau', label: 'Rouleau' },
  { value: 'sachet', label: 'Sachet' }
] as const;

// ========== Fonctions utilitaires ==========

export function calculerPMP(
  pmpActuel: number,
  stockActuel: number,
  quantiteEntree: number,
  prixUnitaireEntree: number
): number {
  if (stockActuel + quantiteEntree === 0) return 0;
  
  const valeurStockActuel = pmpActuel * stockActuel;
  const valeurEntree = prixUnitaireEntree * quantiteEntree;
  const nouveauPMP = (valeurStockActuel + valeurEntree) / (stockActuel + quantiteEntree);
  
  return nouveauPMP;
}

export function calculerValeurStock(article: Article): number {
  return article.stock_actuel * article.prix_achat_moyen;
}

export function verifierAlertesStock(article: Article): AlerteStock[] {
  const alertes: AlerteStock[] = [];
  
  // Stock minimum
  if (article.stock_disponible <= article.stock_minimum) {
    alertes.push({
      id: `ALERT-${article.id}-MIN`,
      article_id: article.id,
      article_code: article.code_article,
      article_designation: article.designation,
      type_alerte: 'stock_minimum',
      gravite: article.stock_disponible === 0 ? 'critical' : 'warning',
      message: `Stock minimum atteint (${article.stock_disponible}/${article.stock_minimum})`,
      stock_actuel: article.stock_disponible,
      seuil: article.stock_minimum,
      date_alerte: new Date().toISOString(),
      acquittee: false,
      action_recommandee: 'Lancer commande d\'approvisionnement'
    });
  }
  
  // Stock maximum
  if (article.stock_actuel >= article.stock_maximum) {
    alertes.push({
      id: `ALERT-${article.id}-MAX`,
      article_id: article.id,
      article_code: article.code_article,
      article_designation: article.designation,
      type_alerte: 'stock_maximum',
      gravite: 'info',
      message: `Stock maximum dépassé (${article.stock_actuel}/${article.stock_maximum})`,
      stock_actuel: article.stock_actuel,
      seuil: article.stock_maximum,
      date_alerte: new Date().toISOString(),
      acquittee: false,
      action_recommandee: 'Vérifier surstockage'
    });
  }
  
  // Stock négatif (erreur)
  if (article.stock_actuel < 0) {
    alertes.push({
      id: `ALERT-${article.id}-NEG`,
      article_id: article.id,
      article_code: article.code_article,
      article_designation: article.designation,
      type_alerte: 'stock_negatif',
      gravite: 'critical',
      message: `Stock négatif détecté (${article.stock_actuel})`,
      stock_actuel: article.stock_actuel,
      seuil: 0,
      date_alerte: new Date().toISOString(),
      acquittee: false,
      action_recommandee: 'Correction urgente requise - Inventaire recommandé'
    });
  }
  
  return alertes;
}

export function calculerStockDisponible(article: Article): number {
  return article.stock_actuel - (article.stock_reserve || 0);
}

export function calculerRotationStock(
  quantiteVendue: number,
  stockMoyen: number
): number {
  if (stockMoyen === 0) return 0;
  return quantiteVendue / stockMoyen;
}

export function calculerDureeStockMoyen(rotationStock: number): number {
  if (rotationStock === 0) return 0;
  return 365 / rotationStock;
}

export function genererNumeroMouvement(serie: SerieNumerotationMouvement): string {
  const annee = new Date().getFullYear();
  const anneeFormat = serie.format_annee === 'YYYY' ? annee : annee.toString().slice(-2);
  const compteur = serie.compteur_actuel.toString().padStart(serie.nombre_chiffres, '0');
  
  let numero = serie.prefixe;
  if (serie.inclure_annee) {
    numero += serie.separateur + anneeFormat;
  }
  numero += serie.separateur + compteur;
  
  return numero;
}

export function determinerSensMouvement(type: TypeMouvement): 'entree' | 'sortie' {
  return TYPE_MOUVEMENT_LABELS[type].sens;
}

export function peutEffectuerSortie(article: Article, quantiteSortie: number): {
  possible: boolean;
  message?: string;
} {
  const stockDispo = calculerStockDisponible(article);
  
  if (quantiteSortie > stockDispo) {
    return {
      possible: false,
      message: `Stock disponible insuffisant (${stockDispo} ${article.unite_stock})`
    };
  }
  
  return { possible: true };
}

export function calculerEcartInventaire(
  quantiteTheorique: number,
  quantiteComptee: number
): {
  ecart: number;
  ecartPourcent: number;
} {
  const ecart = quantiteComptee - quantiteTheorique;
  const ecartPourcent = quantiteTheorique === 0 
    ? (quantiteComptee > 0 ? 100 : 0)
    : (ecart / quantiteTheorique) * 100;
  
  return { ecart, ecartPourcent };
}
