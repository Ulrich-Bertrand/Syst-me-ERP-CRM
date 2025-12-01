import { 
  DemandeAchatComplete, 
  TN_Fournisseurs, 
  TN_Articles,
  BOPX_Achats_Demandes,
  TN_Pieces,
  TN_Pieces_Achats,
  TN_Details_Pieces,
  BOPX_Achats_Validations,
  BOPX_Achats_Fichiers
} from '../types/achats';

// ========== Fournisseurs ==========
export const mockFournisseurs: TN_Fournisseurs[] = [
  {
    Code_Fournisseur: 'FRN-001',
    Nom_Fournisseur: 'Office Supplies Ghana',
    Email: 'contact@officesupplies.gh',
    Telephone: '+233 30 276 5000',
    Adresse: 'Osu, Accra',
    Compte_Comptable: '401001',
    Devise_Defaut: 'GHS',
    Conditions_Paiement: '30 jours',
    Actif: true
  },
  {
    Code_Fournisseur: 'FRN-002',
    Nom_Fournisseur: 'Tech Solutions Ghana',
    Email: 'sales@techsolutions.gh',
    Telephone: '+233 30 277 8000',
    Adresse: 'Airport Residential Area, Accra',
    Compte_Comptable: '401002',
    Devise_Defaut: 'USD',
    Conditions_Paiement: '45 jours',
    Actif: true
  },
  {
    Code_Fournisseur: 'FRN-003',
    Nom_Fournisseur: 'Total Ghana',
    Email: 'commercial@total.gh',
    Telephone: '+233 30 266 4000',
    Adresse: 'High Street, Accra',
    Compte_Comptable: '401003',
    Devise_Defaut: 'GHS',
    Conditions_Paiement: 'Comptant',
    Actif: true
  },
  {
    Code_Fournisseur: 'FRN-004',
    Nom_Fournisseur: 'Warehouse Equipment Ltd',
    Email: 'info@warehouse-eq.com',
    Telephone: '+233 30 255 3000',
    Adresse: 'Industrial Area, Tema',
    Compte_Comptable: '401004',
    Devise_Defaut: 'USD',
    Conditions_Paiement: '60 jours',
    Actif: true
  },
  {
    Code_Fournisseur: 'FRN-005',
    Nom_Fournisseur: 'Maintenance Pro Services',
    Email: 'contact@maintenancepro.gh',
    Telephone: '+233 24 555 7000',
    Adresse: 'Spintex Road, Accra',
    Compte_Comptable: '401005',
    Devise_Defaut: 'GHS',
    Conditions_Paiement: '30 jours',
    Actif: true
  }
];

// ========== Articles (pour gestion stock) ==========
export const mockArticles: TN_Articles[] = [
  {
    Code_Article: 'ART-001',
    Designation: 'Papier A4 - Ramette 500 feuilles',
    Categorie: 'Fournitures bureau',
    Unite: 'Ramette',
    Prix_Achat_Moyen: 15.50,
    Stock_Actuel: 120,
    Stock_Min: 50,
    Compte_Comptable: '606001'
  },
  {
    Code_Article: 'ART-002',
    Designation: 'Ordinateur portable Dell Latitude',
    Categorie: 'Informatique',
    Unite: 'Unité',
    Prix_Achat_Moyen: 4250.00,
    Stock_Actuel: 5,
    Stock_Min: 2,
    Compte_Comptable: '606002'
  },
  {
    Code_Article: 'ART-003',
    Designation: 'Palette en bois standard',
    Categorie: 'Logistique',
    Unite: 'Unité',
    Prix_Achat_Moyen: 45.00,
    Stock_Actuel: 85,
    Stock_Min: 30,
    Compte_Comptable: '606003'
  }
];

// ========== Demandes d'achat complètes ==========
export const mockDemandesAchats: DemandeAchatComplete[] = [
  // DA-001: Fournitures de bureau (achat agence)
  {
    demande: {
      id: 'DA-WEB-001',
      piece_id: 'DA-2025-001',
      type_demande: 'agence',
      service_demandeur: 'Administration',
      priorite: 'normale',
      impact_stock: true,
      statut_workflow: 'soumis',
      motif_achat: 'Réapprovisionnement stock fournitures de bureau pour Q1 2025',
      observation: 'Commander avant fin novembre pour livraison début décembre',
      date_besoin: '2025-12-05',
      created_by: 'Consultant IC',
      created_at: '2025-11-15T08:30:00',
      soumis_at: '2025-11-15T09:00:00',
      soumis_by: 'Consultant IC'
    },
    piece: {
      Num_Piece: 'DA-2025-001',
      Type_Piece: 'DA',
      Agence: 'JOCYDERK LOGISTICS LTD GHANA',
      Fournisseur: 'FRN-001',
      Devise: 'GHS',
      Montant: 1250.00,
      Statut: 'En attente validation',
      Date_Piece: '2025-11-15',
      Provisoire: true,
      Definitif: false
    },
    piece_achats: {
      Num_Piece: 'DA-2025-001',
      Fournisseur: 'FRN-001',
      Mode_Reglement: 'banque',
      Centre_Cout: 'ADM-GH',
      Priorite: 'normale',
      Reference_Interne: 'REQ-ADM-2025-015',
      Delai_Souhaite: '2025-12-05'
    },
    lignes: [
      {
        id: 'DL-001-1',
        Num_Piece: 'DA-2025-001',
        Ligne: 1,
        Quantite: 50,
        Designation: 'Papier A4 - Ramette 500 feuilles',
        Prix_Unitaire: 15.50,
        Montant_Ligne: 775.00,
        Compte_Comptable: '606001',
        Rubrique_Achat: 'Fournitures de bureau',
        Article_Code: 'ART-001'
      },
      {
        id: 'DL-001-2',
        Num_Piece: 'DA-2025-001',
        Ligne: 2,
        Quantite: 25,
        Designation: 'Stylos bille bleu - Boîte 50 pièces',
        Prix_Unitaire: 8.50,
        Montant_Ligne: 212.50,
        Compte_Comptable: '606001',
        Rubrique_Achat: 'Fournitures de bureau'
      },
      {
        id: 'DL-001-3',
        Num_Piece: 'DA-2025-001',
        Ligne: 3,
        Quantite: 15,
        Designation: 'Classeurs à levier A4',
        Prix_Unitaire: 17.50,
        Montant_Ligne: 262.50,
        Compte_Comptable: '606001',
        Rubrique_Achat: 'Fournitures de bureau'
      }
    ],
    fournisseur: mockFournisseurs[0],
    validations: [
      {
        id: 'VAL-001-1',
        piece_id: 'DA-2025-001',
        niveau: 1,
        statut: 'en_attente',
        notification_envoyee: true,
        notification_lue: false
      }
    ],
    fichiers: [],
    montant_total: 1250.00,
    devise: 'GHS',
    nb_lignes: 3,
    delai_traitement_jours: 15
  },

  // DA-002: Équipement informatique (achat agence - URGENT)
  {
    demande: {
      id: 'DA-WEB-002',
      piece_id: 'DA-2025-002',
      type_demande: 'agence',
      service_demandeur: 'IT',
      priorite: 'urgente',
      impact_stock: true,
      statut_workflow: 'valide_niveau_1',
      motif_achat: 'Remplacement ordinateurs défectueux - Production bloquée',
      observation: 'URGENT - Besoin immédiat pour équipe opérations',
      date_besoin: '2025-11-28',
      created_by: 'Kwame Mensah',
      created_at: '2025-11-10T14:20:00',
      soumis_at: '2025-11-10T14:30:00',
      soumis_by: 'Kwame Mensah',
      updated_at: '2025-11-12T10:15:00',
      updated_by: 'Finance Manager'
    },
    piece: {
      Num_Piece: 'DA-2025-002',
      Type_Piece: 'DA',
      Agence: 'JOCYDERK LOGISTICS LTD GHANA',
      Fournisseur: 'FRN-002',
      Devise: 'USD',
      Montant: 8500.00,
      Statut: 'Validé niveau 1',
      Date_Piece: '2025-11-10',
      Provisoire: true,
      Definitif: false
    },
    piece_achats: {
      Num_Piece: 'DA-2025-002',
      Fournisseur: 'FRN-002',
      Mode_Reglement: 'banque',
      Centre_Cout: 'IT-GH',
      Priorite: 'urgente',
      Reference_Interne: 'REQ-IT-2025-008',
      Delai_Souhaite: '2025-11-28',
      Validation_Niveau_1: true,
      Validation_1_By: 'Finance Manager',
      Validation_1_Date: '2025-11-12T10:15:00'
    },
    lignes: [
      {
        id: 'DL-002-1',
        Num_Piece: 'DA-2025-002',
        Ligne: 1,
        Quantite: 2,
        Designation: 'Dell Latitude 5540 - i7, 16GB RAM, 512GB SSD',
        Prix_Unitaire: 3800.00,
        Montant_Ligne: 7600.00,
        Compte_Comptable: '606002',
        Rubrique_Achat: 'Équipement informatique',
        Article_Code: 'ART-002'
      },
      {
        id: 'DL-002-2',
        Num_Piece: 'DA-2025-002',
        Ligne: 2,
        Quantite: 2,
        Designation: 'Souris sans fil Logitech',
        Prix_Unitaire: 45.00,
        Montant_Ligne: 90.00,
        Compte_Comptable: '606002',
        Rubrique_Achat: 'Équipement informatique'
      },
      {
        id: 'DL-002-3',
        Num_Piece: 'DA-2025-002',
        Ligne: 3,
        Quantite: 2,
        Designation: 'Sacoche ordinateur portable',
        Prix_Unitaire: 65.00,
        Montant_Ligne: 130.00,
        Compte_Comptable: '606002',
        Rubrique_Achat: 'Équipement informatique'
      },
      {
        id: 'DL-002-4',
        Num_Piece: 'DA-2025-002',
        Ligne: 4,
        Quantite: 2,
        Designation: 'Licence Microsoft Office Pro 2024',
        Prix_Unitaire: 340.00,
        Montant_Ligne: 680.00,
        Compte_Comptable: '606002',
        Rubrique_Achat: 'Équipement informatique'
      }
    ],
    fournisseur: mockFournisseurs[1],
    validations: [
      {
        id: 'VAL-002-1',
        piece_id: 'DA-2025-002',
        niveau: 1,
        valide_par: 'Finance Manager',
        valide_a: '2025-11-12T10:15:00',
        commentaire: 'Validé - Achat justifié pour maintenir la production',
        statut: 'approuve',
        notification_envoyee: true,
        notification_lue: true
      },
      {
        id: 'VAL-002-2',
        piece_id: 'DA-2025-002',
        niveau: 2,
        statut: 'en_attente',
        notification_envoyee: true,
        notification_lue: false
      }
    ],
    fichiers: [
      {
        id: 'FILE-002-1',
        piece_id: 'DA-2025-002',
        type_fichier: 'Demande',
        nom_fichier: 'Devis_TechSolutions_Nov2025.pdf',
        path: '/uploads/achats/DA-2025-002/devis.pdf',
        taille: 245680,
        uploaded_by: 'Kwame Mensah',
        uploaded_at: '2025-11-10T14:25:00'
      }
    ],
    montant_total: 8500.00,
    devise: 'USD',
    nb_lignes: 4,
    delai_traitement_jours: 18
  },

  // DA-003: Carburant (achat dossier opérationnel)
  {
    demande: {
      id: 'DA-WEB-003',
      piece_id: 'DA-2025-003',
      type_demande: 'dossier',
      dossier_id: 'DOS-2025-456',
      dossier_reference: 'DOS-2025-456 - Maxam Ghana Import',
      priorite: 'normale',
      impact_stock: false,
      statut_workflow: 'approuve',
      motif_achat: 'Carburant pour transport conteneur Tema Port → Warehouse',
      observation: 'Dossier Maxam Ghana - Container MSCU4567890',
      date_besoin: '2025-11-27',
      created_by: 'Ama Serwaa',
      created_at: '2025-11-20T09:45:00',
      soumis_at: '2025-11-20T10:00:00',
      soumis_by: 'Ama Serwaa',
      updated_at: '2025-11-22T15:30:00',
      updated_by: 'CFO'
    },
    piece: {
      Num_Piece: 'DA-2025-003',
      Type_Piece: 'DA',
      Agence: 'JOCYDERK LOGISTICS LTD GHANA',
      Fournisseur: 'FRN-003',
      Devise: 'GHS',
      Montant: 850.00,
      Statut: 'Approuvé',
      Date_Piece: '2025-11-20',
      Provisoire: false,
      Definitif: true
    },
    piece_achats: {
      Num_Piece: 'DA-2025-003',
      Fournisseur: 'FRN-003',
      Mode_Reglement: 'cash',
      Centre_Cout: 'OPS-GH',
      Projet_Dossier: 'DOS-2025-456',
      Priorite: 'normale',
      Reference_Interne: 'REQ-OPS-2025-132',
      Delai_Souhaite: '2025-11-27',
      Validation_Niveau_1: true,
      Validation_1_By: 'Operations Manager',
      Validation_1_Date: '2025-11-21T08:30:00',
      Validation_Niveau_2: true,
      Validation_2_By: 'CFO',
      Validation_2_Date: '2025-11-22T15:30:00'
    },
    lignes: [
      {
        id: 'DL-003-1',
        Num_Piece: 'DA-2025-003',
        Ligne: 1,
        Quantite: 150,
        Designation: 'Gasoil - Litres',
        Prix_Unitaire: 5.67,
        Montant_Ligne: 850.50,
        Compte_Comptable: '606003',
        Code_Analytique: 'DOS-2025-456',
        Rubrique_Achat: 'Carburant'
      }
    ],
    fournisseur: mockFournisseurs[2],
    validations: [
      {
        id: 'VAL-003-1',
        piece_id: 'DA-2025-003',
        niveau: 1,
        valide_par: 'Operations Manager',
        valide_a: '2025-11-21T08:30:00',
        commentaire: 'OK - Achat nécessaire pour livraison client',
        statut: 'approuve',
        notification_envoyee: true,
        notification_lue: true
      },
      {
        id: 'VAL-003-2',
        piece_id: 'DA-2025-003',
        niveau: 2,
        valide_par: 'CFO',
        valide_a: '2025-11-22T15:30:00',
        commentaire: 'Approuvé pour décaissement',
        statut: 'approuve',
        notification_envoyee: true,
        notification_lue: true
      },
      {
        id: 'VAL-003-3',
        piece_id: 'DA-2025-003',
        niveau: 3,
        statut: 'en_attente',
        notification_envoyee: true,
        notification_lue: false
      }
    ],
    fichiers: [],
    montant_total: 850.50,
    devise: 'GHS',
    nb_lignes: 1,
    delai_traitement_jours: 7
  },

  // DA-004: Palettes (achat dossier - payé et justifié)
  {
    demande: {
      id: 'DA-WEB-004',
      piece_id: 'DA-2025-004',
      type_demande: 'dossier',
      dossier_id: 'DOS-2025-458',
      dossier_reference: 'DOS-2025-458 - Goldfields Import',
      priorite: 'normale',
      impact_stock: true,
      statut_workflow: 'clos',
      motif_achat: 'Palettes pour entreposage équipement mining',
      observation: 'Dossier Goldfields - Heavy machinery',
      date_besoin: '2025-11-15',
      created_by: 'Logistics Coordinator',
      created_at: '2025-11-08T11:20:00',
      soumis_at: '2025-11-08T11:30:00',
      soumis_by: 'Logistics Coordinator',
      updated_at: '2025-11-18T16:45:00',
      updated_by: 'Finance Controller'
    },
    piece: {
      Num_Piece: 'DA-2025-004',
      Type_Piece: 'DA',
      Agence: 'JOCYDERK LOGISTICS LTD GHANA',
      Fournisseur: 'FRN-004',
      Devise: 'GHS',
      Montant: 2700.00,
      Statut: 'Clos',
      Date_Piece: '2025-11-08',
      Provisoire: false,
      Definitif: true
    },
    piece_achats: {
      Num_Piece: 'DA-2025-004',
      Fournisseur: 'FRN-004',
      Mode_Reglement: 'banque',
      Centre_Cout: 'OPS-GH',
      Projet_Dossier: 'DOS-2025-458',
      Priorite: 'normale',
      Reference_Interne: 'REQ-OPS-2025-128',
      Delai_Souhaite: '2025-11-15',
      Validation_Niveau_1: true,
      Validation_1_By: 'Operations Manager',
      Validation_1_Date: '2025-11-09T09:00:00',
      Validation_Niveau_2: true,
      Validation_2_By: 'CFO',
      Validation_2_Date: '2025-11-10T14:20:00',
      Validation_Niveau_3: true,
      Validation_3_By: 'Cashier',
      Validation_3_Date: '2025-11-12T10:00:00'
    },
    lignes: [
      {
        id: 'DL-004-1',
        Num_Piece: 'DA-2025-004',
        Ligne: 1,
        Quantite: 60,
        Designation: 'Palette bois standard 120x80cm',
        Prix_Unitaire: 45.00,
        Montant_Ligne: 2700.00,
        Compte_Comptable: '606003',
        Code_Analytique: 'DOS-2025-458',
        Rubrique_Achat: 'Consommables',
        Article_Code: 'ART-003'
      }
    ],
    fournisseur: mockFournisseurs[3],
    validations: [
      {
        id: 'VAL-004-1',
        piece_id: 'DA-2025-004',
        niveau: 1,
        valide_par: 'Operations Manager',
        valide_a: '2025-11-09T09:00:00',
        commentaire: 'Validé',
        statut: 'approuve',
        notification_envoyee: true,
        notification_lue: true
      },
      {
        id: 'VAL-004-2',
        piece_id: 'DA-2025-004',
        niveau: 2,
        valide_par: 'CFO',
        valide_a: '2025-11-10T14:20:00',
        commentaire: 'Approuvé pour décaissement',
        statut: 'approuve',
        notification_envoyee: true,
        notification_lue: true
      },
      {
        id: 'VAL-004-3',
        piece_id: 'DA-2025-004',
        niveau: 3,
        valide_par: 'Cashier',
        valide_a: '2025-11-12T10:00:00',
        commentaire: 'Paiement effectué - Virement bancaire',
        statut: 'approuve',
        notification_envoyee: true,
        notification_lue: true
      }
    ],
    fichiers: [
      {
        id: 'FILE-004-1',
        piece_id: 'DA-2025-004',
        type_fichier: 'BC',
        nom_fichier: 'BC-2025-045.pdf',
        path: '/uploads/achats/DA-2025-004/bc.pdf',
        taille: 128450,
        uploaded_by: 'Operations Manager',
        uploaded_at: '2025-11-09T09:30:00'
      },
      {
        id: 'FILE-004-2',
        piece_id: 'DA-2025-004',
        type_fichier: 'Facture',
        nom_fichier: 'Facture_Warehouse_Equipment_2025-004.pdf',
        path: '/uploads/achats/DA-2025-004/facture.pdf',
        taille: 195320,
        uploaded_by: 'Accountant',
        uploaded_at: '2025-11-13T14:00:00'
      },
      {
        id: 'FILE-004-3',
        piece_id: 'DA-2025-004',
        type_fichier: 'Justificatif',
        nom_fichier: 'Preuve_paiement_virement.pdf',
        path: '/uploads/achats/DA-2025-004/justificatif.pdf',
        taille: 87540,
        uploaded_by: 'Finance Controller',
        uploaded_at: '2025-11-18T16:45:00'
      }
    ],
    montant_total: 2700.00,
    devise: 'GHS',
    nb_lignes: 1,
    delai_traitement_jours: 10
  },

  // DA-005: Maintenance (achat agence - rejeté)
  {
    demande: {
      id: 'DA-WEB-005',
      piece_id: 'DA-2025-005',
      type_demande: 'agence',
      service_demandeur: 'Maintenance',
      priorite: 'basse',
      impact_stock: false,
      statut_workflow: 'rejete',
      motif_achat: 'Réparation climatisation bureau étage 2',
      observation: 'Devis trop élevé - chercher alternative',
      date_besoin: '2025-12-10',
      created_by: 'Maintenance Tech',
      created_at: '2025-11-18T15:00:00',
      soumis_at: '2025-11-18T15:30:00',
      soumis_by: 'Maintenance Tech',
      updated_at: '2025-11-20T11:00:00',
      updated_by: 'Finance Manager'
    },
    piece: {
      Num_Piece: 'DA-2025-005',
      Type_Piece: 'DA',
      Agence: 'JOCYDERK LOGISTICS LTD GHANA',
      Fournisseur: 'FRN-005',
      Devise: 'GHS',
      Montant: 3200.00,
      Statut: 'Rejeté',
      Date_Piece: '2025-11-18',
      Provisoire: true,
      Definitif: false
    },
    piece_achats: {
      Num_Piece: 'DA-2025-005',
      Fournisseur: 'FRN-005',
      Mode_Reglement: 'banque',
      Centre_Cout: 'ADM-GH',
      Priorite: 'basse',
      Reference_Interne: 'REQ-MNT-2025-003',
      Delai_Souhaite: '2025-12-10'
    },
    lignes: [
      {
        id: 'DL-005-1',
        Num_Piece: 'DA-2025-005',
        Ligne: 1,
        Quantite: 1,
        Designation: 'Réparation système climatisation - Main d\'œuvre',
        Prix_Unitaire: 1800.00,
        Montant_Ligne: 1800.00,
        Compte_Comptable: '606004',
        Rubrique_Achat: 'Entretien & Maintenance'
      },
      {
        id: 'DL-005-2',
        Num_Piece: 'DA-2025-005',
        Ligne: 2,
        Quantite: 1,
        Designation: 'Pièces de rechange compresseur',
        Prix_Unitaire: 1400.00,
        Montant_Ligne: 1400.00,
        Compte_Comptable: '606004',
        Rubrique_Achat: 'Entretien & Maintenance'
      }
    ],
    fournisseur: mockFournisseurs[4],
    validations: [
      {
        id: 'VAL-005-1',
        piece_id: 'DA-2025-005',
        niveau: 1,
        valide_par: 'Finance Manager',
        valide_a: '2025-11-20T11:00:00',
        commentaire: 'Rejeté - Devis trop élevé. Demander 2 autres devis comparatifs avant validation.',
        statut: 'rejete',
        notification_envoyee: true,
        notification_lue: true
      }
    ],
    fichiers: [
      {
        id: 'FILE-005-1',
        piece_id: 'DA-2025-005',
        type_fichier: 'Demande',
        nom_fichier: 'Devis_MaintenancePro.pdf',
        path: '/uploads/achats/DA-2025-005/devis.pdf',
        taille: 145890,
        uploaded_by: 'Maintenance Tech',
        uploaded_at: '2025-11-18T15:20:00'
      }
    ],
    montant_total: 3200.00,
    devise: 'GHS',
    nb_lignes: 2
  },

  // DA-006: Transport (achat dossier - en attente justificatif - EN RETARD)
  {
    demande: {
      id: 'DA-WEB-006',
      piece_id: 'DA-2025-006',
      type_demande: 'dossier',
      dossier_id: 'DOS-2025-460',
      dossier_reference: 'DOS-2025-460 - Nestle Import',
      priorite: 'urgente',
      impact_stock: false,
      statut_workflow: 'paye',
      motif_achat: 'Transport exceptionnel conteneur surdimensionné',
      observation: 'URGENT - Justificatif manquant depuis 8 jours',
      date_besoin: '2025-11-10',
      created_by: 'Operations Coordinator',
      created_at: '2025-11-05T08:00:00',
      soumis_at: '2025-11-05T08:15:00',
      soumis_by: 'Operations Coordinator',
      updated_at: '2025-11-10T16:00:00',
      updated_by: 'Cashier'
    },
    piece: {
      Num_Piece: 'DA-2025-006',
      Type_Piece: 'DA',
      Agence: 'JOCYDERK LOGISTICS LTD GHANA',
      Fournisseur: 'FRN-004',
      Devise: 'USD',
      Montant: 1850.00,
      Statut: 'Payé - Justificatif manquant',
      Date_Piece: '2025-11-05',
      Provisoire: false,
      Definitif: true
    },
    piece_achats: {
      Num_Piece: 'DA-2025-006',
      Fournisseur: 'FRN-004',
      Mode_Reglement: 'mobile_money',
      Centre_Cout: 'OPS-GH',
      Projet_Dossier: 'DOS-2025-460',
      Priorite: 'urgente',
      Reference_Interne: 'REQ-OPS-2025-125',
      Delai_Souhaite: '2025-11-10',
      Validation_Niveau_1: true,
      Validation_1_By: 'Operations Manager',
      Validation_1_Date: '2025-11-06T09:00:00',
      Validation_Niveau_2: true,
      Validation_2_By: 'CFO',
      Validation_2_Date: '2025-11-07T10:30:00',
      Validation_Niveau_3: true,
      Validation_3_By: 'Cashier',
      Validation_3_Date: '2025-11-10T16:00:00'
    },
    lignes: [
      {
        id: 'DL-006-1',
        Num_Piece: 'DA-2025-006',
        Ligne: 1,
        Quantite: 1,
        Designation: 'Transport spécial conteneur 40HC - Tema Port to Factory',
        Prix_Unitaire: 1850.00,
        Montant_Ligne: 1850.00,
        Compte_Comptable: '606005',
        Code_Analytique: 'DOS-2025-460',
        Rubrique_Achat: 'Transport'
      }
    ],
    fournisseur: mockFournisseurs[3],
    validations: [
      {
        id: 'VAL-006-1',
        piece_id: 'DA-2025-006',
        niveau: 1,
        valide_par: 'Operations Manager',
        valide_a: '2025-11-06T09:00:00',
        commentaire: 'Urgent - Validé',
        statut: 'approuve',
        notification_envoyee: true,
        notification_lue: true
      },
      {
        id: 'VAL-006-2',
        piece_id: 'DA-2025-006',
        niveau: 2,
        valide_par: 'CFO',
        valide_a: '2025-11-07T10:30:00',
        commentaire: 'Approuvé pour paiement urgent',
        statut: 'approuve',
        notification_envoyee: true,
        notification_lue: true
      },
      {
        id: 'VAL-006-3',
        piece_id: 'DA-2025-006',
        niveau: 3,
        valide_par: 'Cashier',
        valide_a: '2025-11-10T16:00:00',
        commentaire: 'Payé via Mobile Money - En attente justificatif',
        statut: 'approuve',
        notification_envoyee: true,
        notification_lue: true
      }
    ],
    fichiers: [
      {
        id: 'FILE-006-1',
        piece_id: 'DA-2025-006',
        type_fichier: 'BC',
        nom_fichier: 'BC-2025-042.pdf',
        path: '/uploads/achats/DA-2025-006/bc.pdf',
        taille: 118230,
        uploaded_by: 'Operations Manager',
        uploaded_at: '2025-11-06T09:15:00'
      }
    ],
    montant_total: 1850.00,
    devise: 'USD',
    nb_lignes: 1,
    delai_traitement_jours: 5
  }
];

// ========== Helper pour obtenir une demande par ID ==========
export function getDemandeById(id: string): DemandeAchatComplete | undefined {
  return mockDemandesAchats.find(d => d.demande.id === id || d.piece.Num_Piece === id);
}

// ========== Helper pour obtenir fournisseur par code ==========
export function getFournisseurByCode(code: string): TN_Fournisseurs | undefined {
  return mockFournisseurs.find(f => f.Code_Fournisseur === code);
}

// ========== Helper pour calculer les KPIs ==========
export function calculateAchatsKPIs() {
  const demandes = mockDemandesAchats;
  
  return {
    total_demandes: demandes.length,
    montant_total: demandes.reduce((sum, d) => {
      // Convertir en GHS pour affichage unifié (approximation)
      const montant = d.devise === 'USD' ? d.montant_total * 15 : d.montant_total;
      return sum + montant;
    }, 0),
    devise_reference: 'GHS',
    
    // Par statut
    brouillon: demandes.filter(d => d.demande.statut_workflow === 'brouillon').length,
    en_attente_validation: demandes.filter(d => 
      d.demande.statut_workflow === 'soumis' || 
      d.demande.statut_workflow === 'valide_niveau_1'
    ).length,
    validees: demandes.filter(d => 
      d.demande.statut_workflow === 'approuve' || 
      d.demande.statut_workflow === 'bc_genere'
    ).length,
    payees: demandes.filter(d => 
      d.demande.statut_workflow === 'paye' ||
      d.demande.statut_workflow === 'justifie' ||
      d.demande.statut_workflow === 'clos'
    ).length,
    closes: demandes.filter(d => d.demande.statut_workflow === 'clos').length,
    rejetees: demandes.filter(d => d.demande.statut_workflow === 'rejete').length,
    
    // Délais moyens
    delai_moyen_validation_jours: demandes
      .filter(d => d.delai_traitement_jours)
      .reduce((sum, d) => sum + (d.delai_traitement_jours || 0), 0) / 
      demandes.filter(d => d.delai_traitement_jours).length || 0,
    
    delai_moyen_paiement_jours: 12,
    
    // Conformité
    taux_justificatifs: (demandes.filter(d => 
      d.fichiers.some(f => f.type_fichier === 'Justificatif')
    ).length / demandes.filter(d => d.demande.statut_workflow === 'paye' || d.demande.statut_workflow === 'clos').length) * 100 || 0,
    
    demandes_en_retard: demandes.filter(d => {
      // Demandes payées sans justificatif depuis plus de 3 jours
      if (d.demande.statut_workflow === 'paye') {
        const hasJustificatif = d.fichiers.some(f => f.type_fichier === 'Justificatif');
        return !hasJustificatif;
      }
      return false;
    }).length,
    
    // Par type
    achats_dossier: demandes.filter(d => d.demande.type_demande === 'dossier').length,
    achats_agence: demandes.filter(d => d.demande.type_demande === 'agence').length,
    
    // Impact stock
    achats_avec_stock: demandes.filter(d => d.demande.impact_stock).length,
    achats_sans_stock: demandes.filter(d => !d.demande.impact_stock).length
  };
}
