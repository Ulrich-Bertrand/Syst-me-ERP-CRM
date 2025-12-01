import { 
  Article, 
  MouvementStock, 
  Inventaire,
  SerieNumerotationMouvement,
  AlerteStock,
  verifierAlertesStock,
  calculerValeurStock
} from '../types/stock';

// ========== Séries de numérotation ==========

export const mockSeriesMouvement: SerieNumerotationMouvement[] = [
  {
    id: 'SERIE-MVT-001',
    code_serie: 'MVT-GH',
    agence: 'GHANA',
    prefixe: 'MVT-GH',
    separateur: '-',
    inclure_annee: true,
    format_annee: 'YYYY',
    nombre_chiffres: 4,
    compteur_actuel: 25,
    reinitialiser_annuel: true,
    actif: true
  }
];

// ========== Articles ==========

export const mockArticles: Article[] = [
  // ARTICLE-001 : Papier A4 (Fourniture bureau)
  {
    id: 'ART-001',
    code_article: 'ART-FRN-001',
    designation: 'Papier A4 80g blanc',
    description: 'Ramette de 500 feuilles, papier blanc 80g/m²',
    
    categorie: 'fourniture_bureau',
    sous_categorie: 'Papeterie',
    famille: 'Papier',
    
    unite_stock: 'boite',
    unite_achat: 'boite',
    unite_vente: 'boite',
    
    stock_actuel: 45,
    stock_minimum: 20,
    stock_maximum: 100,
    stock_alerte: 30,
    stock_reserve: 5,
    stock_disponible: 40,
    
    emplacement_principal: 'RAY-A-01',
    emplacements_secondaires: ['RAY-A-02'],
    
    methode_valorisation: 'PMP',
    prix_achat_moyen: 25.00,
    prix_dernier_achat: 25.00,
    devise: 'GHS',
    
    fournisseur_principal: 'FRN-001',
    delai_approvisionnement_jours: 5,
    
    code_barre: '3256780123456',
    reference_fournisseur: 'PAP-A4-80-WHT',
    numero_serie: false,
    numero_lot: false,
    date_peremption: false,
    
    actif: true,
    stockable: true,
    achetable: true,
    vendable: false,
    
    compte_stock: '310001',
    compte_achat: '606001',
    
    created_at: '2024-01-15T00:00:00',
    created_by: 'Admin'
  },

  // ARTICLE-002 : Diesel (Consommable)
  {
    id: 'ART-002',
    code_article: 'ART-CNS-001',
    designation: 'Carburant Diesel',
    description: 'Diesel 50 PPM pour véhicules',
    
    categorie: 'consommable',
    sous_categorie: 'Carburant',
    famille: 'Diesel',
    
    unite_stock: 'litre',
    unite_achat: 'litre',
    
    stock_actuel: 580,
    stock_minimum: 200,
    stock_maximum: 1000,
    stock_alerte: 300,
    stock_reserve: 80,
    stock_disponible: 500,
    
    emplacement_principal: 'CITERNE-01',
    
    methode_valorisation: 'PMP',
    prix_achat_moyen: 5.67,
    prix_dernier_achat: 5.67,
    devise: 'GHS',
    
    fournisseur_principal: 'FRN-003',
    delai_approvisionnement_jours: 2,
    
    reference_fournisseur: 'DSL-50',
    numero_serie: false,
    numero_lot: true,
    date_peremption: false,
    
    actif: true,
    stockable: true,
    achetable: true,
    vendable: false,
    
    compte_stock: '310003',
    compte_achat: '606003',
    
    created_at: '2024-01-15T00:00:00',
    created_by: 'Admin'
  },

  // ARTICLE-003 : Palettes EUR (Emballage)
  {
    id: 'ART-003',
    code_article: 'ART-EMB-001',
    designation: 'Palette EUR 120x80cm',
    description: 'Palette Europe standard, bois traité NIMP15',
    
    categorie: 'emballage',
    sous_categorie: 'Palettes',
    famille: 'Palettes EUR',
    
    unite_stock: 'unite',
    unite_achat: 'unite',
    unite_vente: 'unite',
    
    stock_actuel: 125,
    stock_minimum: 50,
    stock_maximum: 300,
    stock_alerte: 75,
    stock_reserve: 25,
    stock_disponible: 100,
    
    emplacement_principal: 'ZONE-PAL-01',
    
    methode_valorisation: 'PMP',
    prix_achat_moyen: 45.00,
    prix_dernier_achat: 45.00,
    devise: 'GHS',
    
    fournisseur_principal: 'FRN-004',
    delai_approvisionnement_jours: 7,
    
    reference_fournisseur: 'PAL-EUR-120',
    numero_serie: false,
    numero_lot: false,
    date_peremption: false,
    
    poids_unitaire: 25,
    poids_unite: 'kg',
    
    actif: true,
    stockable: true,
    achetable: true,
    vendable: true,
    
    compte_stock: '310005',
    compte_achat: '606005',
    compte_vente: '707001',
    
    created_at: '2024-02-01T00:00:00',
    created_by: 'Admin'
  },

  // ARTICLE-004 : Laptop Dell (Équipement) - ALERTE STOCK MINIMUM
  {
    id: 'ART-004',
    code_article: 'ART-EQP-001',
    designation: 'Laptop Dell Latitude 5540',
    description: 'Intel Core i7, 16GB RAM, 512GB SSD, Windows 11 Pro',
    
    categorie: 'equipement',
    sous_categorie: 'Informatique',
    famille: 'Ordinateurs',
    
    unite_stock: 'unite',
    unite_achat: 'unite',
    
    stock_actuel: 2,
    stock_minimum: 3,
    stock_maximum: 10,
    stock_alerte: 5,
    stock_reserve: 0,
    stock_disponible: 2,
    
    emplacement_principal: 'SALLE-IT',
    
    methode_valorisation: 'FIFO',
    prix_achat_moyen: 1700.00,
    prix_dernier_achat: 1750.00,
    devise: 'USD',
    
    fournisseur_principal: 'FRN-002',
    delai_approvisionnement_jours: 10,
    
    code_barre: '884116308123',
    reference_fournisseur: 'DELL-LAT-5540',
    numero_serie: true,
    numero_lot: false,
    date_peremption: false,
    
    actif: true,
    stockable: true,
    achetable: true,
    vendable: false,
    
    compte_stock: '218400',
    compte_achat: '218400',
    
    created_at: '2024-03-01T00:00:00',
    created_by: 'Admin'
  },

  // ARTICLE-005 : Pièce détachée - STOCK BAS
  {
    id: 'ART-005',
    code_article: 'ART-PDT-001',
    designation: 'Filtre à huile moteur',
    description: 'Filtre à huile compatible camions Mercedes',
    
    categorie: 'piece_detachee',
    sous_categorie: 'Filtres',
    famille: 'Filtres huile',
    
    unite_stock: 'unite',
    unite_achat: 'unite',
    
    stock_actuel: 8,
    stock_minimum: 10,
    stock_maximum: 50,
    stock_alerte: 15,
    stock_reserve: 3,
    stock_disponible: 5,
    
    emplacement_principal: 'RAY-PDT-03',
    
    methode_valorisation: 'PMP',
    prix_achat_moyen: 45.50,
    prix_dernier_achat: 47.00,
    devise: 'GHS',
    
    fournisseur_principal: 'FRN-005',
    delai_approvisionnement_jours: 14,
    
    reference_fournisseur: 'FILT-OIL-MB-001',
    numero_serie: false,
    numero_lot: true,
    date_peremption: false,
    
    actif: true,
    stockable: true,
    achetable: true,
    vendable: false,
    
    compte_stock: '310007',
    compte_achat: '606007',
    
    created_at: '2024-04-01T00:00:00',
    created_by: 'Admin'
  }
];

// ========== Mouvements de stock ==========

export const mockMouvementsStock: MouvementStock[] = [
  // MVT-001 : Entrée achat Diesel (BC-GH-2025-003)
  {
    id: 'MVT-001',
    numero_mouvement: 'MVT-GH-2025-0015',
    
    type_mouvement: 'entree_achat',
    sens: 'entree',
    
    article_id: 'ART-002',
    article_code: 'ART-CNS-001',
    article_designation: 'Carburant Diesel',
    
    quantite: 150,
    unite: 'litre',
    
    prix_unitaire: 5.67,
    montant_total: 850.50,
    devise: 'GHS',
    
    stock_avant: 430,
    stock_apres: 580,
    valeur_stock_avant: 2438.10,
    valeur_stock_apres: 3288.60,
    nouveau_pmp: 5.67,
    
    origine_type: 'bon_commande',
    origine_id: 'BC-001',
    origine_ref: 'BC-GH-2025-003',
    
    emplacement: 'CITERNE-01',
    magasin: 'Magasin principal Ghana',
    
    details_reception: {
      bon_commande_id: 'BC-001',
      bon_livraison_ref: 'BL-TOTAL-2025-0098',
      date_reception: '2025-01-22T14:00:00',
      receptionne_par: 'Warehouse Manager'
    },
    
    numero_lot: 'LOT-TOTAL-012025',
    
    statut: 'valide',
    
    piece_comptable_id: 'PC-2025-0126',
    impacte_comptabilite: true,
    
    date_mouvement: '2025-01-22T14:00:00',
    effectue_par: 'Warehouse Manager',
    valide_par: 'Warehouse Supervisor',
    valide_le: '2025-01-22T14:30:00',
    
    created_at: '2025-01-22T14:00:00'
  },

  // MVT-002 : Entrée achat Palettes (BC-GH-2025-004)
  {
    id: 'MVT-002',
    numero_mouvement: 'MVT-GH-2025-0016',
    
    type_mouvement: 'entree_achat',
    sens: 'entree',
    
    article_id: 'ART-003',
    article_code: 'ART-EMB-001',
    article_designation: 'Palette EUR 120x80cm',
    
    quantite: 60,
    unite: 'unite',
    
    prix_unitaire: 45.00,
    montant_total: 2700.00,
    devise: 'GHS',
    
    stock_avant: 65,
    stock_apres: 125,
    valeur_stock_avant: 2925.00,
    valeur_stock_apres: 5625.00,
    nouveau_pmp: 45.00,
    
    origine_type: 'bon_commande',
    origine_id: 'BC-002',
    origine_ref: 'BC-GH-2025-004',
    
    emplacement: 'ZONE-PAL-01',
    magasin: 'Magasin principal Ghana',
    
    details_reception: {
      bon_commande_id: 'BC-002',
      bon_livraison_ref: 'BL-WEL-0234',
      date_reception: '2025-01-25T10:00:00',
      receptionne_par: 'Warehouse Supervisor'
    },
    
    statut: 'valide',
    
    piece_comptable_id: 'PC-2025-0133',
    impacte_comptabilite: true,
    
    date_mouvement: '2025-01-25T10:00:00',
    effectue_par: 'Warehouse Supervisor',
    valide_par: 'Warehouse Manager',
    valide_le: '2025-01-25T11:00:00',
    commentaire: 'Palettes conformes, bon état',
    
    created_at: '2025-01-25T10:00:00'
  },

  // MVT-003 : Sortie consommation Diesel
  {
    id: 'MVT-003',
    numero_mouvement: 'MVT-GH-2025-0017',
    
    type_mouvement: 'sortie_consommation',
    sens: 'sortie',
    
    article_id: 'ART-002',
    article_code: 'ART-CNS-001',
    article_designation: 'Carburant Diesel',
    
    quantite: 50,
    unite: 'litre',
    
    prix_unitaire: 5.67,
    montant_total: 283.50,
    devise: 'GHS',
    
    stock_avant: 580,
    stock_apres: 530,
    valeur_stock_avant: 3288.60,
    valeur_stock_apres: 3005.10,
    
    emplacement: 'CITERNE-01',
    magasin: 'Magasin principal Ghana',
    
    details_sortie: {
      demandeur: 'Transport Manager',
      service: 'Transport',
      bon_sortie_ref: 'BS-2025-0012',
      motif: 'Ravitaillement camion GH-1234-25 pour livraison Maxam Ghana'
    },
    
    statut: 'valide',
    
    piece_comptable_id: 'PC-2025-0145',
    impacte_comptabilite: true,
    
    date_mouvement: '2025-01-28T08:00:00',
    effectue_par: 'Warehouse Assistant',
    valide_par: 'Warehouse Manager',
    valide_le: '2025-01-28T08:15:00',
    
    created_at: '2025-01-28T08:00:00'
  },

  // MVT-004 : Sortie vente Palettes
  {
    id: 'MVT-004',
    numero_mouvement: 'MVT-GH-2025-0018',
    
    type_mouvement: 'sortie_vente',
    sens: 'sortie',
    
    article_id: 'ART-003',
    article_code: 'ART-EMB-001',
    article_designation: 'Palette EUR 120x80cm',
    
    quantite: 20,
    unite: 'unite',
    
    prix_unitaire: 45.00,
    montant_total: 900.00,
    devise: 'GHS',
    
    stock_avant: 125,
    stock_apres: 105,
    valeur_stock_avant: 5625.00,
    valeur_stock_apres: 4725.00,
    
    origine_type: 'vente',
    origine_ref: 'FAC-CLI-2025-0045',
    
    emplacement: 'ZONE-PAL-01',
    magasin: 'Magasin principal Ghana',
    
    details_sortie: {
      demandeur: 'Sales Manager',
      service: 'Commercial',
      bon_sortie_ref: 'BL-CLI-2025-0045',
      motif: 'Vente palettes à client Goldfields Mining'
    },
    
    statut: 'valide',
    
    piece_comptable_id: 'PC-2025-0148',
    impacte_comptabilite: true,
    
    date_mouvement: '2025-01-29T14:00:00',
    effectue_par: 'Warehouse Assistant',
    valide_par: 'Sales Manager',
    valide_le: '2025-01-29T14:30:00',
    
    created_at: '2025-01-29T14:00:00'
  },

  // MVT-005 : Ajustement inventaire Papier A4
  {
    id: 'MVT-005',
    numero_mouvement: 'MVT-GH-2025-0020',
    
    type_mouvement: 'entree_ajustement',
    sens: 'entree',
    
    article_id: 'ART-001',
    article_code: 'ART-FRN-001',
    article_designation: 'Papier A4 80g blanc',
    
    quantite: 3,
    unite: 'boite',
    
    prix_unitaire: 25.00,
    montant_total: 75.00,
    devise: 'GHS',
    
    stock_avant: 42,
    stock_apres: 45,
    valeur_stock_avant: 1050.00,
    valeur_stock_apres: 1125.00,
    
    origine_type: 'inventaire',
    origine_id: 'INV-001',
    origine_ref: 'INV-GH-2025-001',
    
    emplacement: 'RAY-A-01',
    magasin: 'Magasin principal Ghana',
    
    details_ajustement: {
      inventaire_id: 'INV-001',
      ecart_quantite: 3,
      motif: 'Écart inventaire - 3 boîtes non enregistrées trouvées en réserve',
      valideur: 'Warehouse Manager'
    },
    
    statut: 'valide',
    
    impacte_comptabilite: true,
    
    date_mouvement: '2025-02-01T16:00:00',
    effectue_par: 'Inventory Team',
    valide_par: 'Warehouse Manager',
    valide_le: '2025-02-01T17:00:00',
    commentaire: 'Ajustement suite inventaire tournant',
    
    created_at: '2025-02-01T16:00:00'
  }
];

// ========== Inventaires ==========

export const mockInventaires: Inventaire[] = [
  {
    id: 'INV-001',
    numero_inventaire: 'INV-GH-2025-001',
    
    type_inventaire: 'tournant',
    magasin: 'Magasin principal Ghana',
    categorie_article: 'fourniture_bureau',
    
    date_debut: '2025-02-01T08:00:00',
    date_fin: '2025-02-01T17:00:00',
    date_cloture: '2025-02-01T17:30:00',
    
    statut: 'valide',
    
    lignes: [
      {
        id: 'LINV-001-1',
        article_id: 'ART-001',
        article_code: 'ART-FRN-001',
        article_designation: 'Papier A4 80g blanc',
        
        quantite_theorique: 42,
        quantite_comptee: 45,
        ecart_quantite: 3,
        ecart_pourcent: 7.14,
        
        prix_unitaire: 25.00,
        valeur_theorique: 1050.00,
        valeur_comptee: 1125.00,
        valeur_ecart: 75.00,
        
        compte_par: 'Inventory Team',
        compte_le: '2025-02-01T10:00:00',
        recompte_requis: false,
        
        motif_ecart: '3 boîtes trouvées en réserve non enregistrées',
        action_corrective: 'Ajustement stock + Formation équipe sur procédure saisie',
        
        statut: 'valide',
        
        emplacement: 'RAY-A-01'
      }
    ],
    
    nombre_articles_comptes: 1,
    nombre_ecarts: 1,
    valeur_ecarts_positifs: 75.00,
    valeur_ecarts_negatifs: 0,
    valeur_ecart_total: 75.00,
    taux_fiabilite: 0,
    
    valideur: 'Warehouse Manager',
    date_validation: '2025-02-01T17:30:00',
    mouvements_ajustement_generes: ['MVT-005'],
    
    responsable: 'Warehouse Manager',
    compteurs: ['Inventory Team'],
    
    created_by: 'Warehouse Manager',
    created_at: '2025-02-01T08:00:00',
    commentaire: 'Inventaire tournant mensuel - Fournitures de bureau'
  }
];

// ========== Helpers ==========

export function getArticleByCode(code: string): Article | undefined {
  return mockArticles.find(a => a.code_article === code);
}

export function getArticlesByCategorie(categorie: string): Article[] {
  return mockArticles.filter(a => a.categorie === categorie);
}

export function getArticlesStockFaible(): Article[] {
  return mockArticles.filter(a => a.stock_disponible <= a.stock_minimum);
}

export function getMouvementsByArticle(articleId: string): MouvementStock[] {
  return mockMouvementsStock.filter(m => m.article_id === articleId);
}

export function getMouvementsByType(type: string): MouvementStock[] {
  return mockMouvementsStock.filter(m => m.type_mouvement === type);
}

export function getToutesAlertesStock(): AlerteStock[] {
  return mockArticles.flatMap(article => verifierAlertesStock(article));
}

export function getAlertesParGravite(gravite: 'info' | 'warning' | 'critical'): AlerteStock[] {
  return getToutesAlertesStock().filter(a => a.gravite === gravite);
}

export function calculerStatistiquesStock() {
  const totalArticles = mockArticles.filter(a => a.actif).length;
  const articlesEnAlerte = getArticlesStockFaible().length;
  const valeurTotaleStock = mockArticles.reduce((sum, a) => sum + calculerValeurStock(a), 0);
  const totalMouvements = mockMouvementsStock.filter(m => m.statut === 'valide').length;
  
  return {
    total_articles: totalArticles,
    articles_actifs: mockArticles.filter(a => a.actif).length,
    articles_en_alerte: articlesEnAlerte,
    valeur_totale_stock: valeurTotaleStock,
    total_mouvements: totalMouvements,
    mouvements_entree: mockMouvementsStock.filter(m => m.sens === 'entree').length,
    mouvements_sortie: mockMouvementsStock.filter(m => m.sens === 'sortie').length,
    alertes_critiques: getAlertesParGravite('critical').length,
    alertes_warning: getAlertesParGravite('warning').length
  };
}

export function calculerValeurStockParCategorie() {
  const categories = [...new Set(mockArticles.map(a => a.categorie))];
  
  return categories.map(categorie => {
    const articles = getArticlesByCategorie(categorie);
    const valeurTotale = articles.reduce((sum, a) => sum + calculerValeurStock(a), 0);
    
    return {
      categorie,
      nombre_articles: articles.length,
      valeur_totale: valeurTotale
    };
  });
}
