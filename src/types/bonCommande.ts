// ========== Types Bon de Commande (BC) ==========

export type StatutBC = 
  | 'genere'           // BC généré, pas encore envoyé
  | 'envoye'           // Envoyé au fournisseur
  | 'confirme'         // Confirmé par le fournisseur
  | 'reception_partielle' // Marchandise partiellement reçue
  | 'reception_complete'  // Marchandise totalement reçue
  | 'annule';          // BC annulé

export interface BonCommande {
  id: string;
  numero_bc: string;         // Généré par série (ex: BC-GH-2025-001)
  demande_achat_id: string;  // Lié à la DA
  demande_achat_ref: string; // DA-2025-XXX
  
  // Informations générales
  date_emission: string;
  date_livraison_prevue?: string;
  validite_jours: number;    // Validité du BC (ex: 30 jours)
  
  // Parties
  agence_emettrice: {
    code_agence: string;
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
    logo_url?: string;
  };
  
  fournisseur: {
    code_fournisseur: string;
    nom: string;
    adresse: string;
    telephone?: string;
    email?: string;
    contact_principal?: string;
  };
  
  // Lignes du BC
  lignes: LigneBC[];
  
  // Montants
  montant_ht: number;
  tva?: {
    applicable: boolean;
    taux_pourcent: number;
    montant_tva: number;
  };
  montant_ttc: number;
  devise: string;
  
  // Conditions
  conditions_paiement: string;  // Ex: "30 jours fin de mois"
  mode_paiement: string;         // Virement, Espèces, Mobile Money
  lieu_livraison: string;
  delai_livraison: string;       // Ex: "5 jours ouvrés"
  conditions_generales?: string;
  
  // Statut et suivi
  statut: StatutBC;
  envoye_le?: string;
  envoye_par?: string;
  envoye_a?: string; // Email du fournisseur
  confirme_le?: string;
  confirme_par?: string; // Nom du contact fournisseur
  
  // Réception
  receptions: ReceptionBC[];
  
  // Pièce comptable liée
  piece_comptable_id?: string;
  compte_fournisseur: string;
  
  // Métadonnées
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  
  // Documents
  fichier_pdf_url?: string;
  fichiers_joints: FichierBC[];
}

export interface LigneBC {
  id: string;
  numero_ligne: number;
  designation: string;
  reference_article?: string;
  quantite_commandee: number;
  quantite_recue: number;
  unite: string; // "Unité", "Kg", "Litre", "Boîte", etc.
  prix_unitaire: number;
  montant_ligne: number;
  
  // Détails additionnels
  description_technique?: string;
  code_comptable?: string;
  
  // Traçabilité
  ligne_da_id?: string; // Lien avec ligne DA
}

export interface ReceptionBC {
  id: string;
  bc_id: string;
  date_reception: string;
  receptionne_par: string;
  
  lignes_recues: {
    ligne_bc_id: string;
    quantite_recue: number;
    quantite_conforme: number;
    quantite_non_conforme: number;
    commentaire?: string;
  }[];
  
  // Documents
  bon_livraison_ref?: string;
  bon_livraison_fichier?: string;
  photos?: string[];
  
  commentaire_general?: string;
  conforme: boolean;
  
  created_at: string;
}

export interface FichierBC {
  id: string;
  nom: string;
  type: string;
  url: string;
  taille: number;
  uploaded_at: string;
  uploaded_by: string;
}

// ========== Séries de numérotation BC ==========

export interface SerieNumerotationBC {
  id: string;
  code_serie: string;        // Ex: "BC-GH", "BC-CI", "BC-BF"
  nom: string;
  agence: string;            // "GHANA", "COTE_IVOIRE", "BURKINA"
  
  // Format
  prefixe: string;           // "BC-GH"
  separateur: string;        // "-"
  inclure_annee: boolean;
  format_annee: 'YYYY' | 'YY';
  nombre_chiffres: number;   // 3 = 001, 4 = 0001
  
  // Compteur
  compteur_actuel: number;
  reinitialiser_annuel: boolean;
  derniere_reinit?: string;
  
  // Exemple généré
  exemple: string; // "BC-GH-2025-001"
  
  actif: boolean;
  created_at: string;
}

// ========== Templates BC ==========

export interface TemplateBC {
  id: string;
  nom: string;
  description: string;
  agence?: string;
  
  // Styles
  couleur_principale: string;
  afficher_logo: boolean;
  afficher_conditions: boolean;
  afficher_signatures: boolean;
  
  // Sections
  sections_incluses: {
    informations_generales: boolean;
    tableau_lignes: boolean;
    totaux: boolean;
    conditions_paiement: boolean;
    lieu_livraison: boolean;
    conditions_generales: boolean;
    signatures: boolean;
  };
  
  // Textes personnalisés
  texte_entete?: string;
  texte_pied_page?: string;
  conditions_generales_texte?: string;
  
  // Langue
  langue_defaut: 'fr' | 'en';
  
  par_defaut: boolean;
  created_at: string;
}

// ========== Helpers ==========

export const STATUT_BC_LABELS: Record<StatutBC, { fr: string; en: string; color: string; icon: string }> = {
  genere: {
    fr: 'Généré',
    en: 'Generated',
    color: 'blue',
    icon: '📄'
  },
  envoye: {
    fr: 'Envoyé',
    en: 'Sent',
    color: 'indigo',
    icon: '📧'
  },
  confirme: {
    fr: 'Confirmé',
    en: 'Confirmed',
    color: 'purple',
    icon: '✅'
  },
  reception_partielle: {
    fr: 'Réception partielle',
    en: 'Partial receipt',
    color: 'yellow',
    icon: '📦'
  },
  reception_complete: {
    fr: 'Réception complète',
    en: 'Complete receipt',
    color: 'green',
    icon: '✓'
  },
  annule: {
    fr: 'Annulé',
    en: 'Cancelled',
    color: 'red',
    icon: '❌'
  }
};

export const UNITES_MESURE = [
  { value: 'unite', label: 'Unité' },
  { value: 'kg', label: 'Kilogramme (Kg)' },
  { value: 'litre', label: 'Litre (L)' },
  { value: 'metre', label: 'Mètre (m)' },
  { value: 'boite', label: 'Boîte' },
  { value: 'carton', label: 'Carton' },
  { value: 'palette', label: 'Palette' },
  { value: 'lot', label: 'Lot' },
  { value: 'conteneur', label: 'Conteneur' },
  { value: 'heure', label: 'Heure' },
  { value: 'jour', label: 'Jour' },
  { value: 'forfait', label: 'Forfait' }
] as const;

// ========== Fonctions utilitaires ==========

export function genererNumeroBC(serie: SerieNumerotationBC): string {
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

export function calculerDateLimiteValidite(dateEmission: string, validiteJours: number): string {
  const date = new Date(dateEmission);
  date.setDate(date.getDate() + validiteJours);
  return date.toISOString().split('T')[0];
}

export function calculerTauxReception(bc: BonCommande): number {
  const totalCommande = bc.lignes.reduce((sum, l) => sum + l.quantite_commandee, 0);
  const totalRecu = bc.lignes.reduce((sum, l) => sum + l.quantite_recue, 0);
  
  if (totalCommande === 0) return 0;
  return (totalRecu / totalCommande) * 100;
}

export function determinerStatutReception(bc: BonCommande): StatutBC {
  const tauxReception = calculerTauxReception(bc);
  
  if (tauxReception === 0) return bc.statut; // Pas de réception
  if (tauxReception === 100) return 'reception_complete';
  return 'reception_partielle';
}

export function verifierBCComplet(bc: BonCommande): {
  complet: boolean;
  erreurs: string[];
} {
  const erreurs: string[] = [];
  
  if (!bc.numero_bc) erreurs.push('Numéro BC manquant');
  if (!bc.fournisseur.nom) erreurs.push('Fournisseur manquant');
  if (bc.lignes.length === 0) erreurs.push('Aucune ligne de commande');
  if (bc.montant_ttc <= 0) erreurs.push('Montant invalide');
  if (!bc.conditions_paiement) erreurs.push('Conditions de paiement manquantes');
  if (!bc.lieu_livraison) erreurs.push('Lieu de livraison manquant');
  
  return {
    complet: erreurs.length === 0,
    erreurs
  };
}

// ========== Configuration par défaut ==========

export const CONDITIONS_GENERALES_DEFAUT = `
CONDITIONS GÉNÉRALES DE VENTE ET DE LIVRAISON

1. OBJET
Le présent bon de commande définit les conditions dans lesquelles le Fournisseur s'engage à livrer les produits/services commandés.

2. PRIX
Les prix sont fermes et définitifs, exprimés dans la devise indiquée. Ils s'entendent hors taxes sauf mention contraire.

3. LIVRAISON
La livraison devra être effectuée à l'adresse indiquée, dans les délais convenus. Tout retard devra être signalé immédiatement.

4. RÉCEPTION
La marchandise sera vérifiée à la réception. Toute anomalie devra être signalée dans les 48 heures.

5. PAIEMENT
Le règlement interviendra selon les conditions de paiement mentionnées sur le bon de commande.

6. GARANTIE
Le Fournisseur garantit la conformité des produits livrés pendant la période légale de garantie.

7. LITIGES
En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux compétents seront saisis.
`.trim();

export const DELAIS_LIVRAISON_STANDARDS = [
  { value: 'immediat', label: 'Immédiat (24h)' },
  { value: '2_jours', label: '2 jours ouvrés' },
  { value: '5_jours', label: '5 jours ouvrés' },
  { value: '7_jours', label: '1 semaine' },
  { value: '14_jours', label: '2 semaines' },
  { value: '30_jours', label: '1 mois' },
  { value: 'sur_mesure', label: 'Sur mesure' }
] as const;
