import { BonCommande, SerieNumerotationBC, TemplateBC, CONDITIONS_GENERALES_DEFAUT } from '../types/bonCommande';

// ========== Séries de numérotation ==========

export const mockSeriesBC: SerieNumerotationBC[] = [
  {
    id: 'SERIE-BC-001',
    code_serie: 'BC-GH',
    nom: 'Bons de commande Ghana',
    agence: 'GHANA',
    prefixe: 'BC-GH',
    separateur: '-',
    inclure_annee: true,
    format_annee: 'YYYY',
    nombre_chiffres: 3,
    compteur_actuel: 8,
    reinitialiser_annuel: true,
    derniere_reinit: '2025-01-01',
    exemple: 'BC-GH-2025-008',
    actif: true,
    created_at: '2024-01-01T00:00:00'
  },
  {
    id: 'SERIE-BC-002',
    code_serie: 'BC-CI',
    nom: 'Bons de commande Côte d\'Ivoire',
    agence: 'COTE_IVOIRE',
    prefixe: 'BC-CI',
    separateur: '-',
    inclure_annee: true,
    format_annee: 'YYYY',
    nombre_chiffres: 3,
    compteur_actuel: 5,
    reinitialiser_annuel: true,
    derniere_reinit: '2025-01-01',
    exemple: 'BC-CI-2025-005',
    actif: true,
    created_at: '2024-01-01T00:00:00'
  },
  {
    id: 'SERIE-BC-003',
    code_serie: 'BC-BF',
    nom: 'Bons de commande Burkina Faso',
    agence: 'BURKINA',
    prefixe: 'BC-BF',
    separateur: '-',
    inclure_annee: true,
    format_annee: 'YYYY',
    nombre_chiffres: 3,
    compteur_actuel: 3,
    reinitialiser_annuel: true,
    derniere_reinit: '2025-01-01',
    exemple: 'BC-BF-2025-003',
    actif: true,
    created_at: '2024-01-01T00:00:00'
  }
];

// ========== Templates BC ==========

export const mockTemplatesBC: TemplateBC[] = [
  {
    id: 'TPL-BC-001',
    nom: 'Template Standard Jocyderk',
    description: 'Template par défaut avec logo et conditions générales',
    couleur_principale: '#2563eb',
    afficher_logo: true,
    afficher_conditions: true,
    afficher_signatures: true,
    sections_incluses: {
      informations_generales: true,
      tableau_lignes: true,
      totaux: true,
      conditions_paiement: true,
      lieu_livraison: true,
      conditions_generales: true,
      signatures: true
    },
    texte_entete: 'Merci de nous fournir les articles suivants dans les meilleures conditions.',
    texte_pied_page: 'JOCYDERK LOGISTICS LTD - Your trusted logistics partner in West Africa',
    conditions_generales_texte: CONDITIONS_GENERALES_DEFAUT,
    langue_defaut: 'fr',
    par_defaut: true,
    created_at: '2024-01-01T00:00:00'
  },
  {
    id: 'TPL-BC-002',
    nom: 'Template Simplifié',
    description: 'Version simplifiée sans conditions générales',
    couleur_principale: '#059669',
    afficher_logo: true,
    afficher_conditions: false,
    afficher_signatures: false,
    sections_incluses: {
      informations_generales: true,
      tableau_lignes: true,
      totaux: true,
      conditions_paiement: true,
      lieu_livraison: true,
      conditions_generales: false,
      signatures: false
    },
    langue_defaut: 'fr',
    par_defaut: false,
    created_at: '2024-06-01T00:00:00'
  }
];

// ========== Bons de commande ==========

export const mockBonsCommande: BonCommande[] = [
  // BC-001 : Généré pour DA-2025-003 (Carburant)
  {
    id: 'BC-001',
    numero_bc: 'BC-GH-2025-003',
    demande_achat_id: 'DA-003',
    demande_achat_ref: 'DA-2025-003',
    
    date_emission: '2025-01-19T09:15:00',
    date_livraison_prevue: '2025-01-24',
    validite_jours: 30,
    
    agence_emettrice: {
      code_agence: 'GH-001',
      nom: 'JOCYDERK LOGISTICS LTD GHANA',
      adresse: 'P.O. Box 1234, Tema, Greater Accra Region, Ghana',
      telephone: '+233 24 123 4567',
      email: 'procurement@jocyderklogistics.com',
      logo_url: '/assets/logo-jocyderk.png'
    },
    
    fournisseur: {
      code_fournisseur: 'FRN-003',
      nom: 'Total Ghana',
      adresse: 'High Street, Accra Central, Ghana',
      telephone: '+233 30 276 5432',
      email: 'sales@totalghana.com',
      contact_principal: 'Mr. Kwame Mensah'
    },
    
    lignes: [
      {
        id: 'LBC-001-1',
        numero_ligne: 1,
        designation: 'Carburant Diesel',
        reference_article: 'DSL-50',
        quantite_commandee: 150,
        quantite_recue: 150,
        unite: 'litre',
        prix_unitaire: 5.67,
        montant_ligne: 850.50,
        description_technique: 'Diesel 50 PPM, qualité premium',
        code_comptable: '606003'
      }
    ],
    
    montant_ht: 850.50,
    tva: {
      applicable: false,
      taux_pourcent: 0,
      montant_tva: 0
    },
    montant_ttc: 850.50,
    devise: 'GHS',
    
    conditions_paiement: '30 jours fin de mois',
    mode_paiement: 'Virement bancaire',
    lieu_livraison: 'Dépôt Jocyderk Logistics, Tema Port Area',
    delai_livraison: '5 jours ouvrés',
    conditions_generales: CONDITIONS_GENERALES_DEFAUT,
    
    statut: 'reception_complete',
    envoye_le: '2025-01-19T10:00:00',
    envoye_par: 'Consultant IC',
    envoye_a: 'sales@totalghana.com',
    confirme_le: '2025-01-19T15:30:00',
    confirme_par: 'Kwame Mensah',
    
    receptions: [
      {
        id: 'REC-001',
        bc_id: 'BC-001',
        date_reception: '2025-01-22T14:00:00',
        receptionne_par: 'Warehouse Manager',
        lignes_recues: [
          {
            ligne_bc_id: 'LBC-001-1',
            quantite_recue: 150,
            quantite_conforme: 150,
            quantite_non_conforme: 0
          }
        ],
        bon_livraison_ref: 'BL-TOTAL-2025-0098',
        conforme: true,
        created_at: '2025-01-22T14:30:00'
      }
    ],
    
    piece_comptable_id: 'PC-2025-0125',
    compte_fournisseur: '401003',
    
    created_by: 'Consultant IC',
    created_at: '2025-01-19T09:15:00',
    
    fichier_pdf_url: '/documents/bc/BC-GH-2025-003.pdf',
    fichiers_joints: []
  },

  // BC-002 : Généré pour DA-2025-004 (Palettes)
  {
    id: 'BC-002',
    numero_bc: 'BC-GH-2025-004',
    demande_achat_id: 'DA-004',
    demande_achat_ref: 'DA-2025-004',
    
    date_emission: '2025-01-20T08:30:00',
    date_livraison_prevue: '2025-01-27',
    validite_jours: 30,
    
    agence_emettrice: {
      code_agence: 'GH-001',
      nom: 'JOCYDERK LOGISTICS LTD GHANA',
      adresse: 'P.O. Box 1234, Tema, Greater Accra Region, Ghana',
      telephone: '+233 24 123 4567',
      email: 'procurement@jocyderklogistics.com'
    },
    
    fournisseur: {
      code_fournisseur: 'FRN-004',
      nom: 'Warehouse Equipment Ltd',
      adresse: 'Industrial Area, Tema, Ghana',
      telephone: '+233 24 987 6543',
      email: 'orders@warehousegh.com',
      contact_principal: 'Mrs. Akosua Sarpong'
    },
    
    lignes: [
      {
        id: 'LBC-002-1',
        numero_ligne: 1,
        designation: 'Palettes de stockage EUR (120x80cm)',
        reference_article: 'PAL-EUR-120',
        quantite_commandee: 60,
        quantite_recue: 60,
        unite: 'unite',
        prix_unitaire: 45.00,
        montant_ligne: 2700.00,
        description_technique: 'Palettes Europe standard, bois traité NIMP15',
        code_comptable: '606005'
      }
    ],
    
    montant_ht: 2700.00,
    tva: {
      applicable: false,
      taux_pourcent: 0,
      montant_tva: 0
    },
    montant_ttc: 2700.00,
    devise: 'GHS',
    
    conditions_paiement: 'Comptant à la livraison',
    mode_paiement: 'Espèces',
    lieu_livraison: 'Entrepôt Jocyderk, Zone Industrielle Tema',
    delai_livraison: '7 jours ouvrés',
    conditions_generales: CONDITIONS_GENERALES_DEFAUT,
    
    statut: 'reception_complete',
    envoye_le: '2025-01-20T09:00:00',
    envoye_par: 'Operations Manager',
    envoye_a: 'orders@warehousegh.com',
    confirme_le: '2025-01-20T11:45:00',
    confirme_par: 'Akosua Sarpong',
    
    receptions: [
      {
        id: 'REC-002',
        bc_id: 'BC-002',
        date_reception: '2025-01-25T10:00:00',
        receptionne_par: 'Warehouse Supervisor',
        lignes_recues: [
          {
            ligne_bc_id: 'LBC-002-1',
            quantite_recue: 60,
            quantite_conforme: 60,
            quantite_non_conforme: 0,
            commentaire: 'Palettes conformes, bon état'
          }
        ],
        bon_livraison_ref: 'BL-WEL-0234',
        conforme: true,
        commentaire_general: 'Livraison conforme, palettes en excellent état',
        created_at: '2025-01-25T10:45:00'
      }
    ],
    
    piece_comptable_id: 'PC-2025-0132',
    compte_fournisseur: '401004',
    
    created_by: 'Operations Manager',
    created_at: '2025-01-20T08:30:00',
    
    fichier_pdf_url: '/documents/bc/BC-GH-2025-004.pdf',
    fichiers_joints: []
  },

  // BC-003 : Envoyé, en attente réception (DA-2025-001)
  {
    id: 'BC-003',
    numero_bc: 'BC-GH-2025-005',
    demande_achat_id: 'DA-001',
    demande_achat_ref: 'DA-2025-001',
    
    date_emission: '2025-01-23T14:00:00',
    date_livraison_prevue: '2025-01-30',
    validite_jours: 30,
    
    agence_emettrice: {
      code_agence: 'GH-001',
      nom: 'JOCYDERK LOGISTICS LTD GHANA',
      adresse: 'P.O. Box 1234, Tema, Greater Accra Region, Ghana',
      telephone: '+233 24 123 4567',
      email: 'procurement@jocyderklogistics.com'
    },
    
    fournisseur: {
      code_fournisseur: 'FRN-001',
      nom: 'Office Supplies Ghana',
      adresse: '15 Liberation Road, Accra, Ghana',
      telephone: '+233 30 222 3344',
      email: 'sales@officesupplies.gh',
      contact_principal: 'Mr. Emmanuel Boateng'
    },
    
    lignes: [
      {
        id: 'LBC-003-1',
        numero_ligne: 1,
        designation: 'Ramettes papier A4 80g',
        reference_article: 'PAP-A4-80',
        quantite_commandee: 50,
        quantite_recue: 0,
        unite: 'boite',
        prix_unitaire: 25.00,
        montant_ligne: 1250.00,
        description_technique: 'Papier blanc A4, 80g/m², 500 feuilles par ramette',
        code_comptable: '606001'
      }
    ],
    
    montant_ht: 1250.00,
    tva: {
      applicable: false,
      taux_pourcent: 0,
      montant_tva: 0
    },
    montant_ttc: 1250.00,
    devise: 'GHS',
    
    conditions_paiement: '30 jours fin de mois',
    mode_paiement: 'Virement bancaire',
    lieu_livraison: 'Bureaux Jocyderk Logistics, Accra',
    delai_livraison: '5 jours ouvrés',
    conditions_generales: CONDITIONS_GENERALES_DEFAUT,
    
    statut: 'confirme',
    envoye_le: '2025-01-23T14:30:00',
    envoye_par: 'Consultant IC',
    envoye_a: 'sales@officesupplies.gh',
    confirme_le: '2025-01-23T16:20:00',
    confirme_par: 'Emmanuel Boateng',
    
    receptions: [],
    
    compte_fournisseur: '401001',
    
    created_by: 'Consultant IC',
    created_at: '2025-01-23T14:00:00',
    
    fichier_pdf_url: '/documents/bc/BC-GH-2025-005.pdf',
    fichiers_joints: []
  },

  // BC-004 : Juste généré (DA-2025-002)
  {
    id: 'BC-004',
    numero_bc: 'BC-GH-2025-007',
    demande_achat_id: 'DA-002',
    demande_achat_ref: 'DA-2025-002',
    
    date_emission: '2025-01-24T10:00:00',
    date_livraison_prevue: '2025-02-03',
    validite_jours: 30,
    
    agence_emettrice: {
      code_agence: 'GH-001',
      nom: 'JOCYDERK LOGISTICS LTD GHANA',
      adresse: 'P.O. Box 1234, Tema, Greater Accra Region, Ghana',
      telephone: '+233 24 123 4567',
      email: 'procurement@jocyderklogistics.com'
    },
    
    fournisseur: {
      code_fournisseur: 'FRN-002',
      nom: 'Tech Solutions Ghana',
      adresse: 'Tech Park, Airport City, Accra',
      telephone: '+233 24 555 7890',
      email: 'sales@techsolutions.gh',
      contact_principal: 'Ms. Abena Osei'
    },
    
    lignes: [
      {
        id: 'LBC-004-1',
        numero_ligne: 1,
        designation: 'Laptop Dell Latitude 5540',
        reference_article: 'DELL-LAT-5540',
        quantite_commandee: 5,
        quantite_recue: 0,
        unite: 'unite',
        prix_unitaire: 1700.00,
        montant_ligne: 8500.00,
        description_technique: 'Intel Core i7, 16GB RAM, 512GB SSD, Windows 11 Pro',
        code_comptable: '218400'
      }
    ],
    
    montant_ht: 8500.00,
    tva: {
      applicable: false,
      taux_pourcent: 0,
      montant_tva: 0
    },
    montant_ttc: 8500.00,
    devise: 'USD',
    
    conditions_paiement: '50% acompte, solde à la livraison',
    mode_paiement: 'Virement bancaire',
    lieu_livraison: 'Bureaux IT Jocyderk Logistics, Accra',
    delai_livraison: '10 jours ouvrés',
    conditions_generales: CONDITIONS_GENERALES_DEFAUT,
    
    statut: 'genere',
    
    receptions: [],
    
    compte_fournisseur: '401002',
    
    created_by: 'Consultant IC',
    created_at: '2025-01-24T10:00:00',
    
    fichiers_joints: []
  }
];

// ========== Helpers ==========

export function getBCByDemandeAchat(daId: string): BonCommande | undefined {
  return mockBonsCommande.find(bc => bc.demande_achat_id === daId);
}

export function getBCsByStatut(statut: string): BonCommande[] {
  return mockBonsCommande.filter(bc => bc.statut === statut);
}

export function getSerieByAgence(agence: string): SerieNumerotationBC | undefined {
  return mockSeriesBC.find(s => s.agence === agence && s.actif);
}

export function getTemplateDefaut(): TemplateBC {
  return mockTemplatesBC.find(t => t.par_defaut) || mockTemplatesBC[0];
}

export function calculerStatistiquesBC() {
  return {
    total: mockBonsCommande.length,
    generes: mockBonsCommande.filter(bc => bc.statut === 'genere').length,
    envoyes: mockBonsCommande.filter(bc => bc.statut === 'envoye').length,
    confirmes: mockBonsCommande.filter(bc => bc.statut === 'confirme').length,
    receptions_completes: mockBonsCommande.filter(bc => bc.statut === 'reception_complete').length,
    montant_total: mockBonsCommande.reduce((sum, bc) => sum + bc.montant_ttc, 0)
  };
}
