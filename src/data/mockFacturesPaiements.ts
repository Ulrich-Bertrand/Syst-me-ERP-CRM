import { 
  FactureFournisseur, 
  Paiement, 
  SerieNumerotationPaiement 
} from '../types/facturesPaiements';

// ========== Séries de numérotation paiements ==========

export const mockSeriesPaiement: SerieNumerotationPaiement[] = [
  {
    id: 'SERIE-PAY-001',
    code_serie: 'PAY-GH',
    agence: 'GHANA',
    prefixe: 'PAY-GH',
    separateur: '-',
    inclure_annee: true,
    format_annee: 'YYYY',
    nombre_chiffres: 4,
    compteur_actuel: 15,
    reinitialiser_annuel: true,
    actif: true
  },
  {
    id: 'SERIE-PAY-002',
    code_serie: 'PAY-CI',
    agence: 'COTE_IVOIRE',
    prefixe: 'PAY-CI',
    separateur: '-',
    inclure_annee: true,
    format_annee: 'YYYY',
    nombre_chiffres: 4,
    compteur_actuel: 8,
    reinitialiser_annuel: true,
    actif: true
  }
];

// ========== Factures fournisseurs ==========

export const mockFacturesFournisseurs: FactureFournisseur[] = [
  // FACTURE-001 : Total Ghana (Carburant) - PAYÉE
  {
    id: 'FACT-001',
    numero_facture: 'TOTAL-2025-0098',
    numero_interne: 'FRN-2025-0012',
    
    demande_achat_id: 'DA-003',
    demande_achat_ref: 'DA-2025-003',
    bon_commande_id: 'BC-001',
    bon_commande_ref: 'BC-GH-2025-003',
    
    fournisseur: {
      code_fournisseur: 'FRN-003',
      nom: 'Total Ghana',
      compte_comptable: '401003'
    },
    
    date_facture: '2025-01-22',
    date_echeance: '2025-02-21',
    date_reception_facture: '2025-01-23T09:00:00',
    date_saisie: '2025-01-23T10:30:00',
    
    lignes: [
      {
        id: 'LFACT-001-1',
        numero_ligne: 1,
        designation: 'Carburant Diesel',
        quantite_facturee: 150,
        unite: 'litre',
        prix_unitaire: 5.67,
        montant_ht: 850.50,
        montant_ttc: 850.50,
        ligne_bc_id: 'LBC-001-1',
        ecart_quantite: 0,
        ecart_prix: 0,
        ecart_montant: 0,
        compte_comptable: '606003'
      }
    ],
    
    montant_ht: 850.50,
    tva_details: [],
    montant_total_tva: 0,
    montant_ttc: 850.50,
    devise: 'GHS',
    
    montant_paye: 850.50,
    montant_restant: 0,
    paiements: [
      {
        id: 'PAY-001',
        numero_paiement: 'PAY-GH-2025-0008',
        facture_id: 'FACT-001',
        montant: 850.50,
        devise: 'GHS',
        type_paiement: 'virement',
        statut: 'effectue',
        date_execution: '2025-01-25T14:00:00',
        date_valeur: '2025-01-25',
        details_virement: {
          banque_emettrice: 'Ecobank Ghana',
          compte_debit: '0012345678',
          banque_receptrice: 'Total Ghana - GCB Bank',
          compte_credit: '9876543210',
          reference_virement: 'VIR-2025-0098',
          frais_bancaires: 5.00
        },
        justificatifs: [
          {
            id: 'JUST-001',
            type: 'releve_bancaire',
            nom_fichier: 'releve_ecobank_25012025.pdf',
            url: '/justificatifs/releve_ecobank_25012025.pdf',
            taille: 245678,
            uploaded_le: '2025-01-25T16:00:00',
            uploaded_par: 'Finance Manager',
            valide: true,
            valideur: 'CFO Ghana',
            date_validation: '2025-01-25T17:00:00'
          }
        ],
        justificatif_valide: true,
        piece_comptable_id: 'PC-2025-0135',
        compte_tresorerie: '512001',
        effectue_par: 'Finance Manager',
        effectue_le: '2025-01-25T14:00:00',
        validee_par: 'CFO Ghana',
        validee_le: '2025-01-25T13:45:00'
      }
    ],
    
    controle_3_voies: {
      effectue_le: '2025-01-23T11:00:00',
      effectue_par: 'Accountant',
      conforme: true,
      ecarts_detectes: [],
      taux_conformite: 100,
      comparaison_da_bc: {
        conforme: true,
        ecarts: []
      },
      comparaison_bc_facture: {
        conforme: true,
        ecarts: []
      },
      comparaison_reception: {
        conforme: true,
        ecarts: []
      },
      decision: 'approuver',
      commentaire: 'Facture conforme, quantités et prix identiques au BC',
      valideur_niveau_1: 'Finance Manager',
      validation_niveau_1_le: '2025-01-23T14:00:00',
      valideur_niveau_2: 'CFO Ghana',
      validation_niveau_2_le: '2025-01-24T09:00:00'
    },
    
    statut: 'payee',
    
    fichier_facture_url: '/factures/TOTAL-2025-0098.pdf',
    fichiers_annexes: [
      {
        id: 'FILE-001',
        type: 'bon_livraison',
        nom: 'BL-TOTAL-2025-0098.pdf',
        url: '/factures/annexes/BL-TOTAL-2025-0098.pdf',
        taille: 156789,
        uploaded_at: '2025-01-23T10:45:00',
        uploaded_by: 'Accountant'
      }
    ],
    
    piece_comptable_id: 'PC-2025-0130',
    
    en_litige: false,
    
    saisie_par: 'Accountant',
    saisie_le: '2025-01-23T10:30:00',
    validee_par: 'CFO Ghana',
    validee_le: '2025-01-24T09:00:00'
  },

  // FACTURE-002 : Warehouse Equipment (Palettes) - PAYÉE
  {
    id: 'FACT-002',
    numero_facture: 'WEL-INV-0234',
    numero_interne: 'FRN-2025-0013',
    
    demande_achat_id: 'DA-004',
    demande_achat_ref: 'DA-2025-004',
    bon_commande_id: 'BC-002',
    bon_commande_ref: 'BC-GH-2025-004',
    
    fournisseur: {
      code_fournisseur: 'FRN-004',
      nom: 'Warehouse Equipment Ltd',
      compte_comptable: '401004'
    },
    
    date_facture: '2025-01-25',
    date_echeance: '2025-01-25', // Comptant
    date_reception_facture: '2025-01-25T10:30:00',
    date_saisie: '2025-01-25T11:00:00',
    
    lignes: [
      {
        id: 'LFACT-002-1',
        numero_ligne: 1,
        designation: 'Palettes de stockage EUR (120x80cm)',
        quantite_facturee: 60,
        unite: 'unite',
        prix_unitaire: 45.00,
        montant_ht: 2700.00,
        montant_ttc: 2700.00,
        ligne_bc_id: 'LBC-002-1',
        ecart_quantite: 0,
        ecart_prix: 0,
        ecart_montant: 0,
        compte_comptable: '606005'
      }
    ],
    
    montant_ht: 2700.00,
    tva_details: [],
    montant_total_tva: 0,
    montant_ttc: 2700.00,
    devise: 'GHS',
    
    montant_paye: 2700.00,
    montant_restant: 0,
    paiements: [
      {
        id: 'PAY-002',
        numero_paiement: 'PAY-GH-2025-0009',
        facture_id: 'FACT-002',
        montant: 2700.00,
        devise: 'GHS',
        type_paiement: 'especes',
        statut: 'effectue',
        date_execution: '2025-01-25T15:00:00',
        details_especes: {
          caisse: 'Caisse principale Ghana',
          recu_par: 'Akosua Sarpong',
          recu_numero: 'REC-2025-0045'
        },
        justificatifs: [
          {
            id: 'JUST-002',
            type: 'recu_caisse',
            nom_fichier: 'recu_caisse_0045.pdf',
            url: '/justificatifs/recu_caisse_0045.pdf',
            taille: 89456,
            uploaded_le: '2025-01-25T15:30:00',
            uploaded_par: 'Cashier',
            valide: true,
            valideur: 'Finance Manager',
            date_validation: '2025-01-25T16:00:00'
          }
        ],
        justificatif_valide: true,
        piece_comptable_id: 'PC-2025-0138',
        compte_tresorerie: '570001',
        effectue_par: 'Cashier',
        effectue_le: '2025-01-25T15:00:00',
        validee_par: 'Finance Manager',
        validee_le: '2025-01-25T14:45:00'
      }
    ],
    
    controle_3_voies: {
      effectue_le: '2025-01-25T11:30:00',
      effectue_par: 'Accountant',
      conforme: true,
      ecarts_detectes: [],
      taux_conformite: 100,
      comparaison_da_bc: {
        conforme: true,
        ecarts: []
      },
      comparaison_bc_facture: {
        conforme: true,
        ecarts: []
      },
      comparaison_reception: {
        conforme: true,
        ecarts: []
      },
      decision: 'approuver',
      valideur_niveau_1: 'Finance Manager',
      validation_niveau_1_le: '2025-01-25T13:00:00'
    },
    
    statut: 'payee',
    
    fichier_facture_url: '/factures/WEL-INV-0234.pdf',
    fichiers_annexes: [],
    
    piece_comptable_id: 'PC-2025-0137',
    
    en_litige: false,
    
    saisie_par: 'Accountant',
    saisie_le: '2025-01-25T11:00:00',
    validee_par: 'Finance Manager',
    validee_le: '2025-01-25T13:00:00'
  },

  // FACTURE-003 : Office Supplies - VALIDÉE PAIEMENT (en attente)
  {
    id: 'FACT-003',
    numero_facture: 'OSG-2025-156',
    numero_interne: 'FRN-2025-0014',
    
    demande_achat_id: 'DA-001',
    demande_achat_ref: 'DA-2025-001',
    bon_commande_id: 'BC-003',
    bon_commande_ref: 'BC-GH-2025-005',
    
    fournisseur: {
      code_fournisseur: 'FRN-001',
      nom: 'Office Supplies Ghana',
      compte_comptable: '401001'
    },
    
    date_facture: '2025-01-28',
    date_echeance: '2025-02-27',
    date_reception_facture: '2025-01-29T08:00:00',
    date_saisie: '2025-01-29T09:30:00',
    
    lignes: [
      {
        id: 'LFACT-003-1',
        numero_ligne: 1,
        designation: 'Ramettes papier A4 80g',
        quantite_facturee: 50,
        unite: 'boite',
        prix_unitaire: 25.00,
        montant_ht: 1250.00,
        montant_ttc: 1250.00,
        ligne_bc_id: 'LBC-003-1',
        ecart_quantite: 0,
        ecart_prix: 0,
        ecart_montant: 0,
        compte_comptable: '606001'
      }
    ],
    
    montant_ht: 1250.00,
    tva_details: [],
    montant_total_tva: 0,
    montant_ttc: 1250.00,
    devise: 'GHS',
    
    montant_paye: 0,
    montant_restant: 1250.00,
    paiements: [],
    
    controle_3_voies: {
      effectue_le: '2025-01-29T10:00:00',
      effectue_par: 'Accountant',
      conforme: true,
      ecarts_detectes: [],
      taux_conformite: 100,
      comparaison_da_bc: {
        conforme: true,
        ecarts: []
      },
      comparaison_bc_facture: {
        conforme: true,
        ecarts: []
      },
      comparaison_reception: {
        conforme: true,
        ecarts: []
      },
      decision: 'approuver',
      commentaire: 'Facture conforme, prête pour paiement',
      valideur_niveau_1: 'Finance Manager',
      validation_niveau_1_le: '2025-01-29T11:00:00',
      valideur_niveau_2: 'CFO Ghana',
      validation_niveau_2_le: '2025-01-29T14:00:00'
    },
    
    statut: 'validee_paiement',
    
    fichier_facture_url: '/factures/OSG-2025-156.pdf',
    fichiers_annexes: [
      {
        id: 'FILE-003',
        type: 'bon_livraison',
        nom: 'BL-OSG-2025-156.pdf',
        url: '/factures/annexes/BL-OSG-2025-156.pdf',
        taille: 123456,
        uploaded_at: '2025-01-29T09:45:00',
        uploaded_by: 'Accountant'
      }
    ],
    
    piece_comptable_id: 'PC-2025-0140',
    
    en_litige: false,
    
    saisie_par: 'Accountant',
    saisie_le: '2025-01-29T09:30:00',
    validee_par: 'CFO Ghana',
    validee_le: '2025-01-29T14:00:00',
    notes: 'Paiement prévu fin février selon conditions'
  },

  // FACTURE-004 : Tech Solutions - ÉCART DÉTECTÉ
  {
    id: 'FACT-004',
    numero_facture: 'TSG-2025-0089',
    numero_interne: 'FRN-2025-0015',
    
    demande_achat_id: 'DA-002',
    demande_achat_ref: 'DA-2025-002',
    bon_commande_id: 'BC-004',
    bon_commande_ref: 'BC-GH-2025-007',
    
    fournisseur: {
      code_fournisseur: 'FRN-002',
      nom: 'Tech Solutions Ghana',
      compte_comptable: '401002'
    },
    
    date_facture: '2025-02-03',
    date_echeance: '2025-02-10', // 50% acompte
    date_reception_facture: '2025-02-04T10:00:00',
    date_saisie: '2025-02-04T11:00:00',
    
    lignes: [
      {
        id: 'LFACT-004-1',
        numero_ligne: 1,
        designation: 'Laptop Dell Latitude 5540',
        quantite_facturee: 5,
        unite: 'unite',
        prix_unitaire: 1750.00,
        montant_ht: 8750.00,
        montant_ttc: 8750.00,
        ligne_bc_id: 'LBC-004-1',
        ecart_quantite: 0,
        ecart_prix: 50.00,        // Écart prix : +50 USD par unité
        ecart_montant: 250.00,    // Écart total : +250 USD
        compte_comptable: '218400'
      }
    ],
    
    montant_ht: 8750.00,
    tva_details: [],
    montant_total_tva: 0,
    montant_ttc: 8750.00,
    devise: 'USD',
    
    montant_paye: 0,
    montant_restant: 8750.00,
    paiements: [],
    
    controle_3_voies: {
      effectue_le: '2025-02-04T11:30:00',
      effectue_par: 'Accountant',
      conforme: false,
      ecarts_detectes: [
        {
          type: 'prix',
          description: 'Prix unitaire facturé supérieur au BC',
          ligne_numero: 1,
          valeur_attendue: 1700.00,
          valeur_facturee: 1750.00,
          ecart: 50.00,
          ecart_pourcent: 2.94,
          gravite: 'moyenne',
          action_requise: 'Contacter fournisseur pour justification'
        },
        {
          type: 'montant',
          description: 'Montant total facture supérieur au BC',
          valeur_attendue: 8500.00,
          valeur_facturee: 8750.00,
          ecart: 250.00,
          ecart_pourcent: 2.94,
          gravite: 'moyenne',
          action_requise: 'Validation CFO requise'
        }
      ],
      taux_conformite: 97.06,
      comparaison_da_bc: {
        conforme: true,
        ecarts: []
      },
      comparaison_bc_facture: {
        conforme: false,
        ecarts: [
          'Prix unitaire : BC 1,700 USD vs Facture 1,750 USD (+50 USD)',
          'Montant total : BC 8,500 USD vs Facture 8,750 USD (+250 USD)'
        ]
      },
      comparaison_reception: {
        conforme: true,
        ecarts: []
      },
      decision: 'investigation',
      commentaire: 'Écart de prix détecté. Fournisseur contacté pour justification. En attente réponse.',
      valideur_niveau_1: 'Finance Manager',
      validation_niveau_1_le: '2025-02-04T14:00:00'
    },
    
    statut: 'ecart_detecte',
    
    fichier_facture_url: '/factures/TSG-2025-0089.pdf',
    fichiers_annexes: [],
    
    en_litige: false,
    
    saisie_par: 'Accountant',
    saisie_le: '2025-02-04T11:00:00',
    notes: 'Fournisseur indique augmentation prix depuis émission BC (taux de change). En attente validation CFO.'
  }
];

// ========== Helpers ==========

export function getFactureByBC(bcId: string): FactureFournisseur | undefined {
  return mockFacturesFournisseurs.find(f => f.bon_commande_id === bcId);
}

export function getFacturesByStatut(statut: string): FactureFournisseur[] {
  return mockFacturesFournisseurs.filter(f => f.statut === statut);
}

export function getFacturesEnAttenteJustificatif(): FactureFournisseur[] {
  return mockFacturesFournisseurs.filter(f => 
    f.statut === 'payee' && 
    f.paiements.some(p => !p.justificatif_valide)
  );
}

export function getFacturesEnRetard(): FactureFournisseur[] {
  const now = new Date();
  return mockFacturesFournisseurs.filter(f => 
    f.statut !== 'payee' && 
    f.statut !== 'annulee' &&
    new Date(f.date_echeance) < now
  );
}

export function getPaiementsByStatut(statut: string): Paiement[] {
  const allPaiements = mockFacturesFournisseurs.flatMap(f => f.paiements);
  return allPaiements.filter(p => p.statut === statut);
}

export function calculerStatistiquesFactures() {
  const total = mockFacturesFournisseurs.length;
  const montantTotal = mockFacturesFournisseurs.reduce((s, f) => s + f.montant_ttc, 0);
  const montantPaye = mockFacturesFournisseurs.reduce((s, f) => s + f.montant_paye, 0);
  const montantRestant = mockFacturesFournisseurs.reduce((s, f) => s + f.montant_restant, 0);
  
  return {
    total,
    payees: mockFacturesFournisseurs.filter(f => f.statut === 'payee').length,
    en_attente_paiement: mockFacturesFournisseurs.filter(f => f.statut === 'validee_paiement').length,
    avec_ecarts: mockFacturesFournisseurs.filter(f => f.statut === 'ecart_detecte').length,
    en_litige: mockFacturesFournisseurs.filter(f => f.en_litige).length,
    montant_total: montantTotal,
    montant_paye: montantPaye,
    montant_restant: montantRestant,
    taux_paiement: (montantPaye / montantTotal) * 100
  };
}

export function calculerStatistiquesPaiements() {
  const allPaiements = mockFacturesFournisseurs.flatMap(f => f.paiements);
  
  return {
    total: allPaiements.length,
    effectues: allPaiements.filter(p => p.statut === 'effectue').length,
    programmes: allPaiements.filter(p => p.statut === 'programme').length,
    en_cours: allPaiements.filter(p => p.statut === 'en_cours').length,
    montant_total: allPaiements.reduce((s, p) => s + p.montant, 0),
    par_type: {
      virement: allPaiements.filter(p => p.type_paiement === 'virement').length,
      especes: allPaiements.filter(p => p.type_paiement === 'especes').length,
      mobile_money: allPaiements.filter(p => p.type_paiement === 'mobile_money').length,
      cheque: allPaiements.filter(p => p.type_paiement === 'cheque').length
    }
  };
}
