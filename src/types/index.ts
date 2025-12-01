export type TransportMode = 'maritime' | 'aerien' | 'routier' | 'ferroviaire' | 'multimodal';
export type TrafficDirection = 'import' | 'export' | 'national' | 'transit';
export type ActivityType = 'transport' | 'douane' | 'stockage' | 'distribution' | 'conseil';

export interface NumerotationSchema {
  id: string;
  name: string;
  prefix: string;
  separator: string;
  yearFormat: 'YYYY' | 'YY';
  counter: number;
  counterLength: number;
  example: string;
}

export interface OperationStep {
  id: string;
  code: string;
  label: string;
  ordre: number;
  obligatoire: boolean;
  dureeEstimee?: number; // en heures
  responsable?: string;
  documentRequis?: string[];
}

export interface BusinessRule {
  id: string;
  code: string;
  label: string;
  type: 'obligatoire' | 'mensuel' | 'desactive' | 'validation' | 'alerte';
  condition?: string;
  action?: string;
}

export interface DossierType {
  id: string;
  code: string;
  name: string;
  description: string;
  transportMode: TransportMode;
  trafficDirection: TrafficDirection;
  activities: ActivityType[];
  numerotationSchema: string;
  planOperationnel: OperationStep[];
  businessRules: BusinessRule[];
  modeleOuverture: {
    champsObligatoires: string[];
    champsOptionnels: string[];
    validationCotation: boolean;
  };
  modulesActifs: {
    cotations: boolean;
    achats: boolean;
    documents: boolean;
    operations: boolean;
    factures: boolean;
    suiviDD: boolean;
    evenements: boolean;
    workflows: boolean;
    analytique: boolean;
    marges: boolean;
    tracking: boolean;
    piecesJointes: boolean;
  };
  color: string;
}

export interface Dossier {
  id: string;
  numero: string;
  typeId: string;
  titre: string;
  client: string;
  statut: 'brouillon' | 'ouvert' | 'en_cours' | 'termine' | 'facture' | 'cloture';
  dateOuverture: string;
  dateCloture?: string;
  responsable: string;
  reference?: string;
  description?: string;
  metadata: Record<string, any>;
}

export interface Cotation {
  id: string;
  dossierId: string;
  numero: string;
  date: string;
  client: string;
  montantHT: number;
  montantTTC: number;
  statut: 'brouillon' | 'envoyee' | 'acceptee' | 'refusee';
  validite: string;
  lignes: CotationLigne[];
}

export interface CotationLigne {
  id: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface Achat {
  id: string;
  dossierId: string;
  numero: string;
  date: string;
  fournisseur: string;
  montantHT: number;
  montantTTC: number;
  statut: 'commande' | 'recue' | 'payee';
  reference?: string;
}

export interface Document {
  id: string;
  dossierId: string;
  type: 'BL' | 'facture' | 'douane' | 'transport' | 'autre';
  numero: string;
  date: string;
  description: string;
  fichier?: string;
}

export interface Operation {
  id: string;
  dossierId: string;
  stepId: string;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'bloquee';
  dateDebut?: string;
  dateFin?: string;
  responsable: string;
  commentaire?: string;
}

export interface Facture {
  id: string;
  dossierId: string;
  numero: string;
  date: string;
  client: string;
  montantHT: number;
  montantTTC: number;
  statut: 'brouillon' | 'emise' | 'envoyee' | 'payee' | 'annulee';
  dateEcheance: string;
  lignes: FactureLigne[];
}

export interface FactureLigne {
  id: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  tva: number;
  total: number;
}

export interface Evenement {
  id: string;
  dossierId: string;
  type: string;
  titre: string;
  date: string;
  utilisateur: string;
  description?: string;
}

export interface CoutAnalytique {
  id: string;
  dossierId: string;
  categorie: string;
  montant: number;
  date: string;
  description: string;
}

export interface TrackingPoint {
  id: string;
  dossierId: string;
  date: string;
  localisation: string;
  statut: string;
  commentaire?: string;
}
