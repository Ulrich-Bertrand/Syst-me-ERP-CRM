import { DossierType, NumerotationSchema, Dossier, Cotation, Achat, Document, Operation, Facture, Evenement, CoutAnalytique, TrackingPoint } from '../types';

export const numerotationSchemas: NumerotationSchema[] = [
  {
    id: '1',
    name: 'Maritime Import',
    prefix: 'MI',
    separator: '-',
    yearFormat: 'YYYY',
    counter: 1,
    counterLength: 5,
    example: 'MI-2025-00001'
  },
  {
    id: '2',
    name: 'Aérien Export',
    prefix: 'AE',
    separator: '/',
    yearFormat: 'YY',
    counter: 1,
    counterLength: 4,
    example: 'AE/25/0001'
  },
  {
    id: '3',
    name: 'Routier National',
    prefix: 'RN',
    separator: '-',
    yearFormat: 'YYYY',
    counter: 1,
    counterLength: 5,
    example: 'RN-2025-00001'
  }
];

export const dossierTypes: DossierType[] = [
  {
    id: '1',
    code: 'MAR_IMP',
    name: 'Maritime Import',
    description: 'Dossier d\'import maritime FCL/LCL',
    transportMode: 'maritime',
    trafficDirection: 'import',
    activities: ['transport', 'douane', 'stockage'],
    numerotationSchema: '1',
    planOperationnel: [
      { id: '1', code: 'REG_DOC', label: 'Réception documents', ordre: 1, obligatoire: true, dureeEstimee: 24, documentRequis: ['BL', 'facture'] },
      { id: '2', code: 'DECL_DOUANE', label: 'Déclaration en douane', ordre: 2, obligatoire: true, dureeEstimee: 48 },
      { id: '3', code: 'PAIEMENT_DROITS', label: 'Paiement droits et taxes', ordre: 3, obligatoire: true, dureeEstimee: 24 },
      { id: '4', code: 'SORTIE_PORT', label: 'Sortie du port', ordre: 4, obligatoire: true, dureeEstimee: 12 },
      { id: '5', code: 'LIVRAISON', label: 'Livraison finale', ordre: 5, obligatoire: true, dureeEstimee: 24 }
    ],
    businessRules: [
      { id: '1', code: 'COTATION_OBLIG', label: 'Cotation obligatoire avant ouverture', type: 'obligatoire' },
      { id: '2', code: 'FACT_MENSUEL', label: 'Facturation mensuelle', type: 'mensuel' },
      { id: '3', code: 'VALID_DOUANE', label: 'Validation chef service douane', type: 'validation' }
    ],
    modeleOuverture: {
      champsObligatoires: ['client', 'reference', 'incoterm', 'origine', 'destination'],
      champsOptionnels: ['assurance', 'valeurMarchandise', 'nombreColis'],
      validationCotation: true
    },
    modulesActifs: {
      cotations: true,
      achats: true,
      documents: true,
      operations: true,
      factures: true,
      suiviDD: true,
      evenements: true,
      workflows: true,
      analytique: true,
      marges: true,
      tracking: true,
      piecesJointes: true
    },
    color: '#3b82f6'
  },
  {
    id: '2',
    code: 'AER_EXP',
    name: 'Aérien Export',
    description: 'Dossier d\'export aérien',
    transportMode: 'aerien',
    trafficDirection: 'export',
    activities: ['transport', 'douane'],
    numerotationSchema: '2',
    planOperationnel: [
      { id: '1', code: 'PREP_DOC', label: 'Préparation documents export', ordre: 1, obligatoire: true, dureeEstimee: 12 },
      { id: '2', code: 'DECL_EXP', label: 'Déclaration d\'export', ordre: 2, obligatoire: true, dureeEstimee: 6 },
      { id: '3', code: 'ENLEVEMENT', label: 'Enlèvement marchandise', ordre: 3, obligatoire: true, dureeEstimee: 12 },
      { id: '4', code: 'DEDOUANE', label: 'Dédouanement export', ordre: 4, obligatoire: true, dureeEstimee: 6 },
      { id: '5', code: 'EMBARQUEMENT', label: 'Embarquement vol', ordre: 5, obligatoire: true, dureeEstimee: 4 }
    ],
    businessRules: [
      { id: '1', code: 'COTATION_OBLIG', label: 'Cotation obligatoire', type: 'obligatoire' },
      { id: '2', code: 'ALERTE_48H', label: 'Alerte si documents incomplets sous 48h', type: 'alerte' }
    ],
    modeleOuverture: {
      champsObligatoires: ['client', 'destinataire', 'aeroport', 'typeMarc', 'poids'],
      champsOptionnels: ['valeur', 'dangereux', 'temperature'],
      validationCotation: true
    },
    modulesActifs: {
      cotations: true,
      achats: true,
      documents: true,
      operations: true,
      factures: true,
      suiviDD: true,
      evenements: true,
      workflows: true,
      analytique: true,
      marges: true,
      tracking: true,
      piecesJointes: true
    },
    color: '#10b981'
  },
  {
    id: '3',
    code: 'ROUT_NAT',
    name: 'Routier National',
    description: 'Transport routier national',
    transportMode: 'routier',
    trafficDirection: 'national',
    activities: ['transport'],
    numerotationSchema: '3',
    planOperationnel: [
      { id: '1', code: 'RECEPTION_CMD', label: 'Réception commande', ordre: 1, obligatoire: true, dureeEstimee: 2 },
      { id: '2', code: 'AFFECTATION', label: 'Affectation véhicule', ordre: 2, obligatoire: true, dureeEstimee: 4 },
      { id: '3', code: 'CHARGEMENT', label: 'Chargement', ordre: 3, obligatoire: true, dureeEstimee: 2 },
      { id: '4', code: 'TRANSPORT', label: 'Transport', ordre: 4, obligatoire: true, dureeEstimee: 24 },
      { id: '5', code: 'LIVRAISON', label: 'Livraison', ordre: 5, obligatoire: true, dureeEstimee: 2 }
    ],
    businessRules: [
      { id: '1', code: 'FACT_IMMEDIAT', label: 'Facturation immédiate après livraison', type: 'obligatoire' }
    ],
    modeleOuverture: {
      champsObligatoires: ['client', 'adresseChargement', 'adresseLivraison', 'poids'],
      champsOptionnels: ['palettes', 'valeur', 'instructionsSpeciales'],
      validationCotation: false
    },
    modulesActifs: {
      cotations: true,
      achats: false,
      documents: true,
      operations: true,
      factures: true,
      suiviDD: false,
      evenements: true,
      workflows: false,
      analytique: true,
      marges: true,
      tracking: true,
      piecesJointes: true
    },
    color: '#f59e0b'
  }
];

export const dossiers: Dossier[] = [
  {
    id: '1',
    numero: 'MI-2025-00001',
    typeId: '1',
    titre: 'Import conteneur 40\' - Machinery Parts',
    client: 'ACME Industries',
    statut: 'en_cours',
    dateOuverture: '2025-11-15',
    responsable: 'Marie Dupont',
    reference: 'PO-2025-450',
    description: 'Import de pièces mécaniques depuis Shanghai',
    metadata: {
      incoterm: 'CIF',
      origine: 'Shanghai, Chine',
      destination: 'Le Havre, France',
      nombreColis: 1,
      poids: 22000,
      valeur: 85000
    }
  },
  {
    id: '2',
    numero: 'AE/25/0001',
    typeId: '2',
    titre: 'Export aérien - Composants électroniques',
    client: 'TechParts SAS',
    statut: 'ouvert',
    dateOuverture: '2025-11-20',
    responsable: 'Jean Martin',
    reference: 'EXP-2025-123',
    metadata: {
      destinataire: 'Electronics Corp USA',
      aeroport: 'CDG',
      typeMarc: 'Composants électroniques',
      poids: 250,
      valeur: 45000
    }
  },
  {
    id: '3',
    numero: 'RN-2025-00001',
    typeId: '3',
    titre: 'Livraison palettes - Paris > Lyon',
    client: 'Distribution Plus',
    statut: 'termine',
    dateOuverture: '2025-11-22',
    dateCloture: '2025-11-24',
    responsable: 'Pierre Leroy',
    metadata: {
      adresseChargement: 'Paris 75015',
      adresseLivraison: 'Lyon 69003',
      poids: 1200,
      palettes: 8
    }
  }
];

export const cotations: Cotation[] = [
  {
    id: '1',
    dossierId: '1',
    numero: 'COT-2025-001',
    date: '2025-11-10',
    client: 'ACME Industries',
    montantHT: 3500,
    montantTTC: 4200,
    statut: 'acceptee',
    validite: '2025-12-10',
    lignes: [
      { id: '1', description: 'Fret maritime Shanghai-Le Havre', quantite: 1, prixUnitaire: 2000, total: 2000 },
      { id: '2', description: 'Dédouanement import', quantite: 1, prixUnitaire: 800, total: 800 },
      { id: '3', description: 'Transport port-entrepôt', quantite: 1, prixUnitaire: 700, total: 700 }
    ]
  }
];

export const achats: Achat[] = [
  {
    id: '1',
    dossierId: '1',
    numero: 'ACH-2025-001',
    date: '2025-11-16',
    fournisseur: 'TransOcean Shipping',
    montantHT: 2000,
    montantTTC: 2400,
    statut: 'commande',
    reference: 'INV-TO-5432'
  }
];

export const documents: Document[] = [
  {
    id: '1',
    dossierId: '1',
    type: 'BL',
    numero: 'BL-SHA-2025-8765',
    date: '2025-11-12',
    description: 'Bill of Lading original'
  },
  {
    id: '2',
    dossierId: '1',
    type: 'douane',
    numero: 'DAU-2025-FR-12345',
    date: '2025-11-16',
    description: 'Déclaration en douane import'
  }
];

export const operations: Operation[] = [
  {
    id: '1',
    dossierId: '1',
    stepId: '1',
    statut: 'terminee',
    dateDebut: '2025-11-15T09:00:00',
    dateFin: '2025-11-15T14:00:00',
    responsable: 'Marie Dupont',
    commentaire: 'Documents reçus par email'
  },
  {
    id: '2',
    dossierId: '1',
    stepId: '2',
    statut: 'en_cours',
    dateDebut: '2025-11-16T10:00:00',
    responsable: 'Service Douane'
  }
];

export const factures: Facture[] = [
  {
    id: '1',
    dossierId: '3',
    numero: 'FACT-2025-001',
    date: '2025-11-24',
    client: 'Distribution Plus',
    montantHT: 450,
    montantTTC: 540,
    statut: 'emise',
    dateEcheance: '2025-12-24',
    lignes: [
      { id: '1', description: 'Transport routier Paris-Lyon', quantite: 1, prixUnitaire: 450, tva: 20, total: 540 }
    ]
  }
];

export const evenements: Evenement[] = [
  {
    id: '1',
    dossierId: '1',
    type: 'ouverture',
    titre: 'Dossier ouvert',
    date: '2025-11-15T08:30:00',
    utilisateur: 'Marie Dupont'
  },
  {
    id: '2',
    dossierId: '1',
    type: 'document',
    titre: 'Documents reçus',
    date: '2025-11-15T14:00:00',
    utilisateur: 'Marie Dupont',
    description: 'BL et facture commerciale'
  }
];

export const coutsAnalytiques: CoutAnalytique[] = [
  {
    id: '1',
    dossierId: '1',
    categorie: 'Fret',
    montant: 2000,
    date: '2025-11-16',
    description: 'Fret maritime'
  },
  {
    id: '2',
    dossierId: '1',
    categorie: 'Douane',
    montant: 150,
    date: '2025-11-16',
    description: 'Frais de dédouanement'
  }
];

export const trackingPoints: TrackingPoint[] = [
  {
    id: '1',
    dossierId: '1',
    date: '2025-11-01T10:00:00',
    localisation: 'Shanghai Port',
    statut: 'Chargement',
    commentaire: 'Conteneur chargé sur navire'
  },
  {
    id: '2',
    dossierId: '1',
    date: '2025-11-15T08:00:00',
    localisation: 'Le Havre Port',
    statut: 'Arrivé',
    commentaire: 'Navire à quai'
  }
];
