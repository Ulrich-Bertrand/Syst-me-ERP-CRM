import { 
  DashboardAchats,
  KPIsGlobaux,
  RapportFournisseur,
  RapportBudget,
  RapportDelais,
  TopFournisseurs,
  calculerNotePerformance,
  determinerRecommandationFournisseur
} from '../types/reporting';

// ========== Dashboard Achats Global ==========

export const mockDashboardAchats: DashboardAchats = {
  periode: {
    debut: '2025-01-01',
    fin: '2025-02-28',
    type: 'personnalise'
  },
  
  kpis_globaux: {
    // Demandes d'achat
    nombre_da_total: 6,
    nombre_da_validees: 4,
    nombre_da_rejetees: 1,
    nombre_da_en_attente: 1,
    taux_validation_da: 80.0,
    
    // Bons de commande
    nombre_bc_total: 4,
    nombre_bc_confirmes: 4,
    nombre_bc_livres: 2,
    montant_total_bc: 13550.50,
    devise_reference: 'GHS',
    
    // Factures et paiements
    nombre_factures_total: 4,
    nombre_factures_payees: 2,
    montant_factures_total: 13550.50,
    montant_paye: 3550.50,
    montant_restant: 10000.00,
    taux_paiement: 26.2,
    
    // Délais moyens
    delai_moyen_validation_da: 2.5,
    delai_moyen_emission_bc: 1.0,
    delai_moyen_livraison: 3.5,
    delai_moyen_paiement: 2.0,
    delai_moyen_cycle_complet: 9.0,
    
    // Stock
    valeur_stock_total: 12619.00,
    nombre_articles_en_alerte: 2,
    nombre_mouvements_periode: 5,
    taux_rotation_moyen: 8.5,
    
    // Budget
    budget_alloue: 50000.00,
    budget_consomme: 13550.50,
    budget_restant: 36449.50,
    taux_consommation_budget: 27.1
  },
  
  graphiques: {
    evolution_achats: {
      periodes: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4', 'Semaine 5', 'Semaine 6', 'Semaine 7', 'Semaine 8'],
      series: {
        demandes_achat: [1, 2, 1, 1, 0, 1, 0, 0],
        bons_commande: [0, 1, 1, 1, 1, 0, 0, 0],
        factures: [0, 0, 1, 1, 1, 0, 1, 0],
        montants: [0, 850, 2700, 1250, 0, 0, 8750, 0]
      }
    },
    
    repartition_categories: {
      categories: [
        {
          nom: 'Fournitures bureau',
          montant: 1250.00,
          pourcentage: 9.2,
          nombre_achats: 1,
          couleur: '#3b82f6'
        },
        {
          nom: 'Carburant',
          montant: 850.50,
          pourcentage: 6.3,
          nombre_achats: 1,
          couleur: '#10b981'
        },
        {
          nom: 'Emballages',
          montant: 2700.00,
          pourcentage: 19.9,
          nombre_achats: 1,
          couleur: '#f59e0b'
        },
        {
          nom: 'Équipements IT',
          montant: 8750.00,
          pourcentage: 64.6,
          nombre_achats: 1,
          couleur: '#ef4444'
        }
      ]
    },
    
    top_fournisseurs: {
      fournisseurs: [
        {
          code: 'FRN-002',
          nom: 'Tech Solutions Ghana',
          nombre_commandes: 1,
          montant_total: 8750.00,
          montant_moyen: 8750.00,
          delai_moyen_livraison: 0,
          taux_conformite: 0,
          note_performance: 7.5
        },
        {
          code: 'FRN-004',
          nom: 'Warehouse Equipment Ltd',
          nombre_commandes: 1,
          montant_total: 2700.00,
          montant_moyen: 2700.00,
          delai_moyen_livraison: 0,
          taux_conformite: 100,
          note_performance: 9.2
        },
        {
          code: 'FRN-001',
          nom: 'Office Supplies Ghana',
          nombre_commandes: 1,
          montant_total: 1250.00,
          montant_moyen: 1250.00,
          delai_moyen_livraison: 4,
          taux_conformite: 100,
          note_performance: 8.5
        },
        {
          code: 'FRN-003',
          nom: 'Total Ghana',
          nombre_commandes: 1,
          montant_total: 850.50,
          montant_moyen: 850.50,
          delai_moyen_livraison: 0,
          taux_conformite: 100,
          note_performance: 9.0
        }
      ],
      limite: 10
    },
    
    delais_moyens: {
      etapes: [
        {
          nom: 'Validation DA',
          delai_moyen: 2.5,
          delai_min: 1,
          delai_max: 4,
          objectif: 3,
          conforme: true
        },
        {
          nom: 'Émission BC',
          delai_moyen: 1.0,
          delai_min: 0,
          delai_max: 2,
          objectif: 2,
          conforme: true
        },
        {
          nom: 'Confirmation BC',
          delai_moyen: 1.5,
          delai_min: 0,
          delai_max: 3,
          objectif: 3,
          conforme: true
        },
        {
          nom: 'Livraison',
          delai_moyen: 3.5,
          delai_min: 0,
          delai_max: 7,
          objectif: 7,
          conforme: true
        },
        {
          nom: 'Paiement',
          delai_moyen: 2.0,
          delai_min: 0,
          delai_max: 4,
          objectif: 30,
          conforme: true
        }
      ]
    },
    
    taux_validation: {
      par_niveau: [
        {
          niveau: 'Niveau 1 - Manager',
          total_validations: 6,
          validations_approuvees: 5,
          validations_rejetees: 1,
          taux_approbation: 83.3,
          delai_moyen: 1.5
        },
        {
          niveau: 'Niveau 2 - CFO',
          total_validations: 5,
          validations_approuvees: 4,
          validations_rejetees: 0,
          taux_approbation: 100.0,
          delai_moyen: 1.0
        },
        {
          niveau: 'Niveau 3 - Direction',
          total_validations: 1,
          validations_approuvees: 1,
          validations_rejetees: 0,
          taux_approbation: 100.0,
          delai_moyen: 0.5
        }
      ],
      
      par_valideur: [
        {
          valideur: 'CFO Ghana',
          nombre_validations: 4,
          taux_approbation: 100.0,
          delai_moyen: 1.0
        },
        {
          valideur: 'Purchasing Manager',
          nombre_validations: 3,
          taux_approbation: 66.7,
          delai_moyen: 2.0
        },
        {
          valideur: 'General Manager',
          nombre_validations: 1,
          taux_approbation: 100.0,
          delai_moyen: 0.5
        }
      ]
    }
  },
  
  tableaux: {
    da_en_cours: [
      {
        numero_da: 'DA-2025-006',
        date_creation: '2025-02-05',
        demandeur: 'HR Manager',
        montant_total: 3500.00,
        devise: 'GHS',
        statut: 'en_validation_niveau_1',
        delai_validation: 2,
        en_retard: false
      }
    ],
    
    bc_en_attente: [
      {
        numero_bc: 'BC-GH-2025-007',
        date_emission: '2025-02-03',
        fournisseur: 'Tech Solutions Ghana',
        montant_total: 8750.00,
        devise: 'USD',
        statut: 'envoye',
        delai_livraison_prevu: 10,
        en_retard: false
      }
    ],
    
    factures_impayees: [
      {
        numero_facture: 'OSG-2025-156',
        numero_interne: 'FRN-2025-0014',
        fournisseur: 'Office Supplies Ghana',
        date_facture: '2025-01-28',
        date_echeance: '2025-02-27',
        montant_ttc: 1250.00,
        montant_restant: 1250.00,
        devise: 'GHS',
        jours_retard: 0
      },
      {
        numero_facture: 'TSG-2025-0089',
        numero_interne: 'FRN-2025-0015',
        fournisseur: 'Tech Solutions Ghana',
        date_facture: '2025-02-03',
        date_echeance: '2025-02-10',
        montant_ttc: 8750.00,
        montant_restant: 8750.00,
        devise: 'USD',
        jours_retard: 0
      }
    ],
    
    alertes_stock: [
      {
        article_code: 'ART-EQP-001',
        article_nom: 'Laptop Dell Latitude 5540',
        stock_actuel: 2,
        stock_minimum: 3,
        unite: 'unite',
        gravite: 'warning',
        action_recommandee: 'Lancer commande d\'approvisionnement'
      },
      {
        article_code: 'ART-PDT-001',
        article_nom: 'Filtre à huile moteur',
        stock_actuel: 5,
        stock_minimum: 10,
        unite: 'unite',
        gravite: 'warning',
        action_recommandee: 'Lancer commande d\'approvisionnement'
      }
    ]
  },
  
  comparaisons: {
    vs_periode_precedente: {
      periode_actuelle: {
        debut: '2025-01-01',
        fin: '2025-02-28'
      },
      periode_precedente: {
        debut: '2024-11-01',
        fin: '2024-12-31'
      },
      variations: {
        nombre_da: {
          actuel: 6,
          precedent: 4,
          variation: 2,
          variation_pourcent: 50.0
        },
        montant_achats: {
          actuel: 13550.50,
          precedent: 10200.00,
          variation: 3350.50,
          variation_pourcent: 32.8
        },
        delai_moyen: {
          actuel: 9.0,
          precedent: 11.5,
          variation: -2.5,
          variation_pourcent: -21.7
        }
      }
    },
    
    vs_budget: {
      budget_total: 50000.00,
      consomme: 13550.50,
      restant: 36449.50,
      taux_consommation: 27.1,
      
      par_categorie: [
        {
          categorie: 'Fournitures bureau',
          budget: 10000.00,
          consomme: 1250.00,
          restant: 8750.00,
          taux_consommation: 12.5,
          depassement: false
        },
        {
          categorie: 'Carburant',
          budget: 5000.00,
          consomme: 850.50,
          restant: 4149.50,
          taux_consommation: 17.0,
          depassement: false
        },
        {
          categorie: 'Emballages',
          budget: 8000.00,
          consomme: 2700.00,
          restant: 5300.00,
          taux_consommation: 33.8,
          depassement: false
        },
        {
          categorie: 'Équipements IT',
          budget: 20000.00,
          consomme: 8750.00,
          restant: 11250.00,
          taux_consommation: 43.8,
          depassement: false
        },
        {
          categorie: 'Autres',
          budget: 7000.00,
          consomme: 0,
          restant: 7000.00,
          taux_consommation: 0,
          depassement: false
        }
      ],
      
      tendance: 'conforme',
      projection_fin_periode: 48900.00
    }
  }
};

// ========== Rapport Fournisseur détaillé ==========

export const mockRapportFournisseur: RapportFournisseur = {
  fournisseur: {
    code: 'FRN-004',
    nom: 'Warehouse Equipment Ltd',
    contact: 'Samuel Mensah',
    email: 'samuel@warehouse-equipment.gh'
  },
  
  periode: {
    debut: '2024-01-01',
    fin: '2025-02-28'
  },
  
  statistiques: {
    nombre_commandes: 8,
    montant_total: 18500.00,
    montant_moyen: 2312.50,
    montant_minimum: 450.00,
    montant_maximum: 5200.00,
    
    delai_moyen_livraison: 4,
    delai_min_livraison: 2,
    delai_max_livraison: 7,
    
    taux_livraison_temps: 87.5,
    taux_conformite: 100.0,
    nombre_litiges: 0,
    nombre_retours: 0
  },
  
  historique_commandes: [
    {
      numero_bc: 'BC-GH-2025-004',
      date: '2025-01-24',
      montant: 2700.00,
      delai_livraison: 1,
      conforme: true
    },
    {
      numero_bc: 'BC-GH-2024-045',
      date: '2024-12-15',
      montant: 5200.00,
      delai_livraison: 5,
      conforme: true
    },
    {
      numero_bc: 'BC-GH-2024-032',
      date: '2024-10-20',
      montant: 1800.00,
      delai_livraison: 3,
      conforme: true
    },
    {
      numero_bc: 'BC-GH-2024-018',
      date: '2024-08-12',
      montant: 2200.00,
      delai_livraison: 4,
      conforme: true
    },
    {
      numero_bc: 'BC-GH-2024-009',
      date: '2024-05-22',
      montant: 3400.00,
      delai_livraison: 6,
      conforme: true
    }
  ],
  
  note_performance: {
    note_globale: 9.2,
    criteres: {
      prix: 8.5,        // Prix compétitifs
      delais: 9.5,      // Livraisons rapides
      qualite: 9.5,     // Produits conformes
      service: 9.0,     // Bon service client
      fiabilite: 10.0   // 100% conforme
    }
  },
  
  recommandation: 'excellent'
};

// ========== Rapport Budget ==========

export const mockRapportBudget: RapportBudget = {
  periode: {
    debut: '2025-01-01',
    fin: '2025-12-31',
    type: 'annuel'
  },
  
  budget_global: {
    alloue: 300000.00,
    consomme: 13550.50,
    restant: 286449.50,
    taux_consommation: 4.5
  },
  
  par_categorie: [
    {
      categorie: 'Fournitures bureau',
      budget_alloue: 60000.00,
      consomme: 1250.00,
      restant: 58750.00,
      taux_consommation: 2.1,
      depassement: false
    },
    {
      categorie: 'Carburant',
      budget_alloue: 80000.00,
      consomme: 850.50,
      restant: 79149.50,
      taux_consommation: 1.1,
      depassement: false
    },
    {
      categorie: 'Emballages',
      budget_alloue: 50000.00,
      consomme: 2700.00,
      restant: 47300.00,
      taux_consommation: 5.4,
      depassement: false
    },
    {
      categorie: 'Équipements IT',
      budget_alloue: 80000.00,
      consomme: 8750.00,
      restant: 71250.00,
      taux_consommation: 10.9,
      depassement: false
    },
    {
      categorie: 'Maintenance',
      budget_alloue: 30000.00,
      consomme: 0,
      restant: 30000.00,
      taux_consommation: 0,
      depassement: false
    }
  ],
  
  par_agence: [
    {
      agence: 'Ghana',
      budget_alloue: 150000.00,
      consomme: 13550.50,
      restant: 136449.50,
      taux_consommation: 9.0
    },
    {
      agence: 'Côte d\'Ivoire',
      budget_alloue: 100000.00,
      consomme: 0,
      restant: 100000.00,
      taux_consommation: 0
    },
    {
      agence: 'Burkina Faso',
      budget_alloue: 50000.00,
      consomme: 0,
      restant: 50000.00,
      taux_consommation: 0
    }
  ],
  
  tendances: [
    { mois: 'Janvier', budget: 25000, consomme: 4800, cumul_consomme: 4800 },
    { mois: 'Février', budget: 25000, consomme: 8750, cumul_consomme: 13550 },
    { mois: 'Mars', budget: 25000, consomme: 0, cumul_consomme: 13550 },
    { mois: 'Avril', budget: 25000, consomme: 0, cumul_consomme: 13550 },
    { mois: 'Mai', budget: 25000, consomme: 0, cumul_consomme: 13550 },
    { mois: 'Juin', budget: 25000, consomme: 0, cumul_consomme: 13550 }
  ],
  
  alertes: [
    {
      type: 'risque_depassement',
      categorie: 'Équipements IT',
      message: 'Consommation de 10.9% en 2 mois (projection annuelle: 65%)',
      gravite: 'info'
    }
  ]
};

// ========== Rapport Délais ==========

export const mockRapportDelais: RapportDelais = {
  periode: {
    debut: '2025-01-01',
    fin: '2025-02-28'
  },
  
  cycle_complet: {
    delai_moyen: 9.0,
    delai_min: 5,
    delai_max: 14,
    objectif: 15,
    taux_respect_objectif: 100.0
  },
  
  par_etape: [
    {
      etape: 'Création DA → Validation finale',
      delai_moyen: 2.5,
      delai_min: 1,
      delai_max: 4,
      objectif: 3,
      nombre_transactions: 6
    },
    {
      etape: 'Validation DA → Émission BC',
      delai_moyen: 1.0,
      delai_min: 0,
      delai_max: 2,
      objectif: 2,
      nombre_transactions: 4
    },
    {
      etape: 'Émission BC → Confirmation fournisseur',
      delai_moyen: 1.5,
      delai_min: 0,
      delai_max: 3,
      nombre_transactions: 4
    },
    {
      etape: 'Confirmation BC → Livraison',
      delai_moyen: 3.5,
      delai_min: 0,
      delai_max: 7,
      objectif: 7,
      nombre_transactions: 2
    },
    {
      etape: 'Livraison → Paiement',
      delai_moyen: 2.0,
      delai_min: 0,
      delai_max: 4,
      objectif: 30,
      nombre_transactions: 2
    }
  ],
  
  par_fournisseur: [
    {
      fournisseur: 'Warehouse Equipment Ltd',
      delai_moyen_livraison: 1,
      nombre_livraisons: 1,
      livraisons_temps: 1,
      livraisons_retard: 0
    },
    {
      fournisseur: 'Total Ghana',
      delai_moyen_livraison: 0,
      nombre_livraisons: 1,
      livraisons_temps: 1,
      livraisons_retard: 0
    },
    {
      fournisseur: 'Office Supplies Ghana',
      delai_moyen_livraison: 4,
      nombre_livraisons: 0,
      livraisons_temps: 0,
      livraisons_retard: 0
    }
  ],
  
  distribution: [
    { tranche: '0-3 jours', nombre: 8, pourcentage: 40 },
    { tranche: '4-7 jours', nombre: 6, pourcentage: 30 },
    { tranche: '8-14 jours', nombre: 4, pourcentage: 20 },
    { tranche: '15-30 jours', nombre: 2, pourcentage: 10 },
    { tranche: '> 30 jours', nombre: 0, pourcentage: 0 }
  ]
};

// ========== Helpers ==========

export function calculerStatistiquesGlobales() {
  return mockDashboardAchats.kpis_globaux;
}

export function getTopFournisseurs(limite: number = 5) {
  return mockDashboardAchats.graphiques.top_fournisseurs.fournisseurs.slice(0, limite);
}

export function getRapportFournisseur(codeFournisseur: string) {
  // Retourner rapport mock ou générer dynamiquement
  return mockRapportFournisseur;
}

export function calculerPerformanceGlobale() {
  const kpis = mockDashboardAchats.kpis_globaux;
  
  return {
    score_validation: kpis.taux_validation_da,
    score_delais: 100 - ((kpis.delai_moyen_cycle_complet / 15) * 100),
    score_paiement: kpis.taux_paiement,
    score_budget: 100 - (kpis.taux_consommation_budget || 0),
    score_global: (
      (kpis.taux_validation_da +
      (100 - ((kpis.delai_moyen_cycle_complet / 15) * 100)) +
      kpis.taux_paiement +
      (100 - (kpis.taux_consommation_budget || 0))) / 4
    )
  };
}
