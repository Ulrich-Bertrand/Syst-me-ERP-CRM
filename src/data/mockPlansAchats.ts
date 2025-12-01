import { PlanAchat, LignePlanAchat } from '../types/achats';

// ========== Plans d'achat par type de dossier ==========

export const mockPlansAchats: PlanAchat[] = [
  // Plan pour TRANSIT MARITIME
  {
    id: 'PLAN-001',
    code_plan: 'TRANSIT-MARITIME',
    designation: 'Plan d\'achat standard - Transit Maritime',
    type_dossier: 'TRANSIT',
    mode_transport: 'MARITIME',
    lignes: [
      {
        id: 'LPA-001-1',
        code_ligne: 'THC',
        designation: 'Terminal Handling Charges (THC)',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 150.00,
        rubrique_achat: 'Transport',
        compte_comptable: '606100',
        fournisseur_suggere: 'FRN-004',
        obligatoire: true,
        ordre_affichage: 1,
        actif: true
      },
      {
        id: 'LPA-001-2',
        code_ligne: 'DOSSIER-DOUA',
        designation: 'Frais de dossier douanier',
        type_calcul: 'fixe',
        montant_fixe: 350.00,
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: true,
        ordre_affichage: 2,
        actif: true
      },
      {
        id: 'LPA-001-3',
        code_ligne: 'SCAN-CONT',
        designation: 'Scanning conteneur',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 120.00,
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: true,
        ordre_affichage: 3,
        actif: true
      },
      {
        id: 'LPA-001-4',
        code_ligne: 'EXAM-PHYSIQUE',
        designation: 'Examen physique (si requis)',
        type_calcul: 'fixe',
        montant_fixe: 250.00,
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: false,
        ordre_affichage: 4,
        actif: true
      },
      {
        id: 'LPA-001-5',
        code_ligne: 'SUREST-PORT',
        designation: 'Surestaries portuaires',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 80.00,
        rubrique_achat: 'Transport',
        compte_comptable: '606100',
        obligatoire: false,
        ordre_affichage: 5,
        actif: true
      },
      {
        id: 'LPA-001-6',
        code_ligne: 'MANUT-PORT',
        designation: 'Manutention portuaire',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 95.00,
        rubrique_achat: 'Transport',
        compte_comptable: '606100',
        obligatoire: true,
        ordre_affichage: 6,
        actif: true
      }
    ],
    created_by: 'Admin',
    created_at: '2025-01-15T10:00:00',
    actif: true
  },

  // Plan pour TRANSIT AERIEN
  {
    id: 'PLAN-002',
    code_plan: 'TRANSIT-AERIEN',
    designation: 'Plan d\'achat standard - Transit Aérien',
    type_dossier: 'TRANSIT',
    mode_transport: 'AERIEN',
    lignes: [
      {
        id: 'LPA-002-1',
        code_ligne: 'FRET-AERIEN',
        designation: 'Fret aérien (par kg)',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 3.50,
        rubrique_achat: 'Transport',
        compte_comptable: '606100',
        obligatoire: true,
        ordre_affichage: 1,
        actif: true
      },
      {
        id: 'LPA-002-2',
        code_ligne: 'DOSSIER-DOUA-AIR',
        designation: 'Frais de dossier douanier aérien',
        type_calcul: 'fixe',
        montant_fixe: 280.00,
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: true,
        ordre_affichage: 2,
        actif: true
      },
      {
        id: 'LPA-002-3',
        code_ligne: 'INSP-FRET',
        designation: 'Inspection fret aérien',
        type_calcul: 'fixe',
        montant_fixe: 150.00,
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: true,
        ordre_affichage: 3,
        actif: true
      },
      {
        id: 'LPA-002-4',
        code_ligne: 'ENTREPOSAGE',
        designation: 'Frais d\'entreposage temporaire',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 25.00,
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: false,
        ordre_affichage: 4,
        actif: true
      }
    ],
    created_by: 'Admin',
    created_at: '2025-01-15T10:30:00',
    actif: true
  },

  // Plan pour TRUCKING
  {
    id: 'PLAN-003',
    code_plan: 'TRUCKING-STANDARD',
    designation: 'Plan d\'achat standard - Trucking',
    type_dossier: 'TRUCKING',
    lignes: [
      {
        id: 'LPA-003-1',
        code_ligne: 'CARBURANT',
        designation: 'Carburant diesel (litres)',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 5.67,
        rubrique_achat: 'Carburant',
        compte_comptable: '606003',
        fournisseur_suggere: 'FRN-003',
        obligatoire: true,
        ordre_affichage: 1,
        actif: true
      },
      {
        id: 'LPA-003-2',
        code_ligne: 'PEAGE',
        designation: 'Frais de péage',
        type_calcul: 'fixe',
        montant_fixe: 45.00,
        rubrique_achat: 'Transport',
        compte_comptable: '606100',
        obligatoire: true,
        ordre_affichage: 2,
        actif: true
      },
      {
        id: 'LPA-003-3',
        code_ligne: 'PARKING',
        designation: 'Frais de parking/stationnement',
        type_calcul: 'fixe',
        montant_fixe: 20.00,
        rubrique_achat: 'Transport',
        compte_comptable: '606100',
        obligatoire: false,
        ordre_affichage: 3,
        actif: true
      },
      {
        id: 'LPA-003-4',
        code_ligne: 'MANUT-CHARG',
        designation: 'Manutention chargement/déchargement',
        type_calcul: 'fixe',
        montant_fixe: 180.00,
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: false,
        ordre_affichage: 4,
        actif: true
      }
    ],
    created_by: 'Admin',
    created_at: '2025-01-15T11:00:00',
    actif: true
  },

  // Plan pour SHIPPING
  {
    id: 'PLAN-004',
    code_plan: 'SHIPPING-STANDARD',
    designation: 'Plan d\'achat standard - Shipping',
    type_dossier: 'SHIPPING',
    lignes: [
      {
        id: 'LPA-004-1',
        code_ligne: 'FRET-MARITIME',
        designation: 'Fret maritime (par conteneur)',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 1850.00,
        rubrique_achat: 'Transport',
        compte_comptable: '606100',
        obligatoire: true,
        ordre_affichage: 1,
        actif: true
      },
      {
        id: 'LPA-004-2',
        code_ligne: 'BAF',
        designation: 'Bunker Adjustment Factor (BAF)',
        type_calcul: 'pourcentage',
        pourcentage: 15,
        base_calcul: 'FRET-MARITIME',
        rubrique_achat: 'Transport',
        compte_comptable: '606100',
        obligatoire: true,
        ordre_affichage: 2,
        actif: true
      },
      {
        id: 'LPA-004-3',
        code_ligne: 'CAF',
        designation: 'Currency Adjustment Factor (CAF)',
        type_calcul: 'pourcentage',
        pourcentage: 5,
        base_calcul: 'FRET-MARITIME',
        rubrique_achat: 'Transport',
        compte_comptable: '606100',
        obligatoire: true,
        ordre_affichage: 3,
        actif: true
      },
      {
        id: 'LPA-004-4',
        code_ligne: 'DOCUMENT-BL',
        designation: 'Frais de Bill of Lading (BL)',
        type_calcul: 'fixe',
        montant_fixe: 120.00,
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: true,
        ordre_affichage: 4,
        actif: true
      }
    ],
    created_by: 'Admin',
    created_at: '2025-01-15T11:30:00',
    actif: true
  },

  // Plan pour CONSIGNATION
  {
    id: 'PLAN-005',
    code_plan: 'CONSIGN-STANDARD',
    designation: 'Plan d\'achat standard - Consignation',
    type_dossier: 'CONSIGNATION',
    lignes: [
      {
        id: 'LPA-005-1',
        code_ligne: 'ENTREPOSAGE-MOIS',
        designation: 'Frais d\'entreposage (par mois)',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 450.00,
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: true,
        ordre_affichage: 1,
        actif: true
      },
      {
        id: 'LPA-005-2',
        code_ligne: 'MANUT-STOCK',
        designation: 'Manutention en stock',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 85.00,
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: true,
        ordre_affichage: 2,
        actif: true
      },
      {
        id: 'LPA-005-3',
        code_ligne: 'PALETTES',
        designation: 'Palettes de stockage',
        type_calcul: 'quantite_x_taux',
        taux_unitaire: 45.00,
        rubrique_achat: 'Consommables',
        compte_comptable: '606003',
        fournisseur_suggere: 'FRN-004',
        obligatoire: false,
        ordre_affichage: 3,
        actif: true
      },
      {
        id: 'LPA-005-4',
        code_ligne: 'ASSURANCE-STOCK',
        designation: 'Assurance stock mensuelle',
        type_calcul: 'pourcentage',
        pourcentage: 0.5,
        base_calcul: 'VALEUR_MARCHANDISE',
        rubrique_achat: 'Prestations de services',
        compte_comptable: '606200',
        obligatoire: true,
        ordre_affichage: 4,
        actif: true
      }
    ],
    created_by: 'Admin',
    created_at: '2025-01-15T12:00:00',
    actif: true
  }
];

// ========== Helper pour obtenir plan d'achat ==========

export function getPlanAchatByTypeDossier(typeDossier: string, modeTransport?: string): PlanAchat | undefined {
  if (modeTransport) {
    return mockPlansAchats.find(
      plan => plan.type_dossier === typeDossier && 
              plan.mode_transport === modeTransport && 
              plan.actif
    );
  }
  return mockPlansAchats.find(
    plan => plan.type_dossier === typeDossier && plan.actif
  );
}

export function getAllPlansAchats(): PlanAchat[] {
  return mockPlansAchats.filter(plan => plan.actif);
}

export function getPlanAchatById(id: string): PlanAchat | undefined {
  return mockPlansAchats.find(plan => plan.id === id);
}

// ========== Types de dossiers disponibles ==========

export const TYPES_DOSSIERS_DISPONIBLES = [
  { code: 'TRANSIT', label: 'Transit / Logistique' },
  { code: 'SHIPPING', label: 'Shipping' },
  { code: 'TRUCKING', label: 'Trucking' },
  { code: 'CONSIGNATION', label: 'Consignation' },
  { code: 'AUTRES', label: 'Autres activités' }
] as const;

export const MODES_TRANSPORT_DISPONIBLES = [
  { code: 'MARITIME', label: 'Maritime' },
  { code: 'AERIEN', label: 'Aérien' },
  { code: 'ROUTIER', label: 'Routier' }
] as const;
