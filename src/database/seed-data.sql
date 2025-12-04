-- ========================================
-- INSERTION DONNÉES MOCK - MODULE ACHATS
-- À exécuter après schema.sql
-- ========================================

-- Désactiver les triggers temporairement
SET session_replication_role = 'replica';

-- ========================================
-- 1. UTILISATEURS
-- ========================================

INSERT INTO users (
  id, email, password, nom, prenom, telephone, agence,

  profile_purchases_create,
  profile_purchases_validate_level_1,
  profile_purchases_validate_level_2,
  profile_purchases_validate_level_3,
  profile_purchases_payment,
  profile_stock_manage,
  profile_invoices_validate,
  profile_reporting_view,

  -- champs manquants
  profile_purchases_manage_po,
  profile_purchases_manage_invoices,
  profile_purchases_manage_payments,
  profile_stock_view,
  profile_dossiers_manage,
  profile_cotations_manage,
  profile_finance_view,
  is_admin,
  active,
  last_login,
  created_at,
  updated_at
) VALUES

('550e8400-e29b-41d4-a716-446655440001',
 'consultantic@jocyderklogistics.com',
 crypt('password123', gen_salt('bf')),
 'Consultant', 'IC', '237 695842355', 'GHANA',
 true, true, true, true, true, true, true, true,
 -- missing fields (tous droits sauf admin)
 true, true, true, true, true, true, true,
 true, true, NULL, NOW(), NOW()
),

-----------------------------------------------------------------------------------
-- Transport Manager (Créateur DA)
('550e8400-e29b-41d4-a716-446655440002',
 'transport.manager@jocyderklogistics.com',
 crypt('password123', gen_salt('bf')),
 'Transport', 'Manager', '237 695842655', 'GHANA',
 true, false, false, false, false, false, false, true,
 false, false, false, false, false, false, false,
 false, true, NULL, NOW(), NOW()
),

-----------------------------------------------------------------------------------
-- Purchasing Manager (Validation N1)
('550e8400-e29b-41d4-a716-446655440003',
 'purchasing@jocyderklogistics.com',
 crypt('password123', gen_salt('bf')),
 'Purchasing', 'Manager', '237 695842365', 'GHANA',
 true, true, false, false, false, false, false, true,
 false, false, false, false, false, false, false,
 false, true, NULL, NOW(), NOW()
),

-----------------------------------------------------------------------------------
-- CFO Ghana (Validation N2)
('550e8400-e29b-41d4-a716-446655440004',
 'cfo.ghana@jocyderklogistics.com',
 crypt('password123', gen_salt('bf')),
 'CFO', 'Ghana', '237 695842995', 'GHANA',
 false, false, true, false, false, false, true, true,
 false, false, false, false, false, false, true,
 false, true, NULL, NOW(), NOW()
),

-----------------------------------------------------------------------------------
-- General Manager (Validation N3)
('550e8400-e29b-41d4-a716-446655440005',
 'gm@jocyderklogistics.com',
 crypt('password123', gen_salt('bf')),
 'General', 'Manager', '237 695872355', 'GHANA',
 false, false, false, true, false, false, true, true,
 false, false, false, false, false, false, true,
 false, true, NULL, NOW(), NOW()
),

-----------------------------------------------------------------------------------
-- Warehouse Manager (Stock)
('550e8400-e29b-41d4-a716-446655440006',
 'warehouse@jocyderklogistics.com',
 crypt('password123', gen_salt('bf')),
 'Warehouse', 'Manager', '237 678842341', 'GHANA',
 false, false, false, false, false, true, false, true,
 false, false, false, true, false, false, false,
 false, true, NULL, NOW(), NOW()
),

-----------------------------------------------------------------------------------
-- Accountant (Factures)
('550e8400-e29b-41d4-a716-446655440007',
 'accountant@jocyderklogistics.com',
 crypt('password123', gen_salt('bf')),
 'Accountant', 'Finance', '237 695842775', 'GHANA',
 false, false, false, false, false, false, true, true,
 false, true, false, false, false, false, true,
 false, true, NULL, NOW(), NOW()
),

-----------------------------------------------------------------------------------
-- Treasury Manager (Paiements)
('550e8400-e29b-41d4-a716-446655440008',
 'treasury@jocyderklogistics.com',
 crypt('password123', gen_salt('bf')),
 'Treasury', 'Manager', '237 695896355', 'GHANA',
 false, false, false, false, true, false, false, true,
 false, false, true, false, false, false, true,
 false, true, NULL, NOW(), NOW()
);


-- Consultant IC (Tous droits)
(
  '550e8400-e29b-41d4-a716-446655440001',
  'consultantic@jocyderklogistics.com',
  crypt('password123', gen_salt('bf')),
  'Consultant IC', 'Consultant IC', '237 695842355', 'GHANA',

  true, false, false, false, false, false, false, true,
 false, false, false, false, false, false, false,
 false, true, NULL, NOW(), NOW()
),

-- Transport Manager (Créateur DA)
(
  '550e8400-e29b-41d4-a716-446655440002',
  'transport.manager@jocyderklogistics.com',
  crypt('password123', gen_salt('bf')),
  'Transport Manager', 'Transport Manager', '237 695842655', 'GHANA',

 true, false, false, false, false, false, false, true,
 false, false, false, false, false, false, false,
 false, true, NULL, NOW(), NOW()
),

-- Purchasing Manager (Validation N1)
(
  '550e8400-e29b-41d4-a716-446655440003',
  'purchasing@jocyderklogistics.com',
  crypt('password123', gen_salt('bf')),
  'Purchasing Manager', 'Purchasing Manager', '237 695842365', 'GHANA',

 true, false, false, false, false, false, false, true,
 false, false, false, false, false, false, false,
 false, true, NULL, NOW(), NOW()
),

-- CFO Ghana (Validation N2)
(
  '550e8400-e29b-41d4-a716-446655440004',
  'cfo.ghana@jocyderklogistics.com',
  crypt('password123', gen_salt('bf')),
  'CFO Ghana', 'CFO Ghana', '237 695842995', 'GHANA',

 true, false, false, false, false, false, false, true,
 false, false, false, false, false, false, false,
 false, true, NULL, NOW(), NOW()
),

-- General Manager (Validation N3)
(
  '550e8400-e29b-41d4-a716-446655440005',
  'gm@jocyderklogistics.com',
  crypt('password123', gen_salt('bf')),
  'General Manager', 'General Manager', '237 695872355', 'GHANA',

 true, false, false, false, false, false, false, true,
 false, false, false, false, false, false, false,
 false, true, NULL, NOW(), NOW()
),

-- Warehouse Manager (Stock)
(
  '550e8400-e29b-41d4-a716-446655440006',
  'warehouse@jocyderklogistics.com',
  crypt('password123', gen_salt('bf')),
  'Warehouse Manager', 'Warehouse Manager', '237 678842341', 'GHANA',

 true, false, false, false, false, false, false, true,
 false, false, false, false, false, false, false,
 false, true, NULL, NOW(), NOW()
),

-- Accountant (Factures)
(
  '550e8400-e29b-41d4-a716-446655440007',
  'accountant@jocyderklogistics.com',
  crypt('password123', gen_salt('bf')),
  'Accountant', 'Accountant', '237 695842775', 'GHANA',

true, false, false, false, false, false, false, true,
 false, false, false, false, false, false, false,
 false, true, NULL, NOW(), NOW()
),

-- Treasury Manager (Paiements)
(
  '550e8400-e29b-41d4-a716-446655440008',
  'treasury@jocyderklogistics.com',
  crypt('password123', gen_salt('bf')),
  'Treasury Manager', 'Treasury Manager', '237 695896355', 'GHANA',

 true, false, false, false, false, false, false, true,
 false, false, false, false, false, false, false,
 false, true, NULL, NOW(), NOW()
);


-- ========================================
-- 2. FOURNISSEURS
-- ========================================

INSERT INTO fournisseurs (id, code_fournisseur, nom, compte_fournisseur, 
  adresse, ville, pays, telephone, email, contact_principal, 
  conditions_paiement_defaut, devise_defaut) VALUES

('660e8400-e29b-41d4-a716-446655440001', 'FRN-001', 'Office Supplies Ghana', '401001',
  'Plot 12, Industrial Area', 'Accra', 'Ghana', '+233 30 123 4567', 
  'sales@officesupplies.gh', 'John Mensah',
  '{"mode": "credit", "delai_jours": 30}'::jsonb, 'GHS'),

('660e8400-e29b-41d4-a716-446655440002', 'FRN-002', 'Tech Solutions Ghana', '401002',
  'Labone Rd', 'Accra', 'Ghana', '+233 30 234 5678',
  'contact@techsolutions.gh', 'Sarah Osei',
  '{"mode": "credit", "delai_jours": 30}'::jsonb, 'USD'),

('660e8400-e29b-41d4-a716-446655440003', 'FRN-003', 'Total Ghana', '401003',
  'Ring Road Central', 'Accra', 'Ghana', '+233 30 345 6789',
  'commercial@total.gh', 'Kwame Appiah',
  '{"mode": "credit", "delai_jours": 15}'::jsonb, 'GHS'),

('660e8400-e29b-41d4-a716-446655440004', 'FRN-004', 'Warehouse Equipment Ltd', '401004',
  'Spintex Road', 'Accra', 'Ghana', '+233 30 456 7890',
  'samuel@warehouse-equipment.gh', 'Samuel Mensah',
  '{"mode": "credit", "delai_jours": 45}'::jsonb, 'GHS'),

('660e8400-e29b-41d4-a716-446655440005', 'FRN-005', 'Maxam Ghana (Client)', '401005',
  'Industrial Zone', 'Tema', 'Ghana', '+233 30 567 8901',
  'procurement@maxam.gh', 'Michael Addo',
  '{"mode": "credit", "delai_jours": 30}'::jsonb, 'GHS');

-- ========================================
-- 3. SÉRIES DE NUMÉROTATION
-- ========================================

INSERT INTO series_numerotation (type_serie, agence, annee, compteur) VALUES
('DA', 'GHANA', 2025, 7),
('BC', 'GHANA', 2025, 8),
('FACTURE', 'GHANA', 2025, 16),
('PAIEMENT', 'GHANA', 2025, 5),
('MOUVEMENT', 'GHANA', 2025, 21);

-- ========================================
-- 4. ARTICLES (STOCK)
-- ========================================

INSERT INTO articles (id, code_article, designation, description, categorie, famille,
  stock_actuel, stock_disponible, stock_minimum, stock_maximum, unite,
  pmp_actuel, valeur_stock, gestion_stock, entrepot_principal) VALUES

('770e8400-e29b-41d4-a716-446655440001', 'ART-FRN-001', 
  'Papier A4 80g - Ramette 500 feuilles', 'Papier blanc standard', 
  'Fournitures', 'Bureau', 45, 45, 20, 100, 'boite', 12.50, 562.50, true, 'Warehouse Ghana'),

('770e8400-e29b-41d4-a716-446655440002', 'ART-CNS-001',
  'Diesel 50 PPM', 'Gasoil pour véhicules', 
  'Consommables', 'Carburant', 580, 580, 200, 1000, 'litre', 5.67, 3288.60, true, 'Tank Ghana'),

('770e8400-e29b-41d4-a716-446655440003', 'ART-EMB-001',
  'Palette EUR 120x80cm', 'Palette bois standard européenne',
  'Emballages', 'Palettes', 105, 105, 50, 200, 'unite', 25.71, 2699.55, true, 'Warehouse Ghana'),

('770e8400-e29b-41d4-a716-446655440004', 'ART-EQP-001',
  'Laptop Dell Latitude 5540', 'Ordinateur portable professionnel i7/16GB/512GB',
  'Équipements', 'IT', 2, 2, 3, 10, 'unite', 4375.00, 8750.00, true, 'IT Room'),

('770e8400-e29b-41d4-a716-446655440005', 'ART-PDT-001',
  'Filtre à huile moteur - Réf: LF3000', 'Filtre huile pour camions',
  'Pièces détachées', 'Maintenance', 8, 8, 10, 50, 'unite', 15.00, 120.00, true, 'Workshop');

-- ========================================
-- 5. DEMANDES D'ACHAT
-- ========================================

-- DA-2025-001 : Fournitures bureau (Validée)
INSERT INTO demandes_achat (id, numero_da, type_demande, objet, justification, urgence,
  dossier_id, dossier_ref, demandeur_id, demandeur_nom, demandeur_email, agence,
  montant_ht, montant_tva, montant_total, devise, statut,
  workflow_validation, bon_commande_id, bon_commande_ref,
  date_creation, date_soumission, date_validation_finale,
  created_by) VALUES

('880e8400-e29b-41d4-a716-446655440001', 'DA-2025-001', 'interne', 
  'Fournitures de bureau - Trimestre 1', 'Réappro stock fournitures bureau agence', 'normale',
  NULL, NULL, 
  '550e8400-e29b-41d4-a716-446655440002', 'Transport Manager', 'transport.manager@jocyderklogistics.com', 'GHANA',
  1250.00, 0, 1250.00, 'GHS', 'validee',
  '{"niveau_actuel": 3, "statut_final": "validee", "niveaux_requis": [1, 2],
    "historique": [
      {"niveau": 1, "decision": "approuvee", "valideur": "Purchasing Manager", "date": "2025-01-16T09:30:00Z", "commentaire": "OK"},
      {"niveau": 2, "decision": "approuvee", "valideur": "CFO Ghana", "date": "2025-01-17T14:00:00Z", "commentaire": "Approuvé"}
    ]}'::jsonb,
  '990e8400-e29b-41d4-a716-446655440005', 'BC-GH-2025-005',
  '2025-01-15 08:00:00', '2025-01-15 09:00:00', '2025-01-17 14:00:00',
  '550e8400-e29b-41d4-a716-446655440002');

-- Lignes DA-2025-001
INSERT INTO lignes_demande_achat (demande_achat_id, numero_ligne, designation, reference_article, categorie,
  quantite, unite, prix_unitaire_estime, montant_ht, taux_tva, montant_tva, montant_ttc,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur) VALUES

('880e8400-e29b-41d4-a716-446655440001', 1, 'Papier A4 80g - Ramette 500 feuilles', 'ART-FRN-001', 'Fournitures',
  100, 'boite', 12.50, 1250.00, 0, 0, 1250.00,
  '660e8400-e29b-41d4-a716-446655440001', 'FRN-001', 'Office Supplies Ghana', '401001');

-- DA-2025-002 : Équipements IT (Validée)
INSERT INTO demandes_achat (id, numero_da, type_demande, objet, justification, urgence,
  demandeur_id, demandeur_nom, demandeur_email, agence,
  montant_ht, montant_tva, montant_total, devise, statut,
  workflow_validation, bon_commande_id, bon_commande_ref,
  date_creation, date_soumission, date_validation_finale,
  created_by) VALUES

('880e8400-e29b-41d4-a716-446655440002', 'DA-2025-002', 'investissement',
  'Achat laptops pour équipe commerciale', 'Renouvellement parc informatique', 'normale',
  '550e8400-e29b-41d4-a716-446655440001', 'Consultant IC', 'consultantic@jocyderklogistics.com', 'GHANA',
  8500.00, 0, 8500.00, 'USD', 'validee',
  '{"niveau_actuel": 3, "statut_final": "validee", "niveaux_requis": [1, 2, 3],
    "historique": [
      {"niveau": 1, "decision": "approuvee", "valideur": "Purchasing Manager", "date": "2025-01-20T10:00:00Z"},
      {"niveau": 2, "decision": "approuvee", "valideur": "CFO Ghana", "date": "2025-01-21T11:00:00Z"},
      {"niveau": 3, "decision": "approuvee", "valideur": "General Manager", "date": "2025-01-22T15:30:00Z"}
    ]}'::jsonb,
  '990e8400-e29b-41d4-a716-446655440007', 'BC-GH-2025-007',
  '2025-01-19 14:00:00', '2025-01-19 15:00:00', '2025-01-22 15:30:00',
  '550e8400-e29b-41d4-a716-446655440001');

-- Lignes DA-2025-002
INSERT INTO lignes_demande_achat (demande_achat_id, numero_ligne, designation, reference_article, categorie,
  quantite, unite, prix_unitaire_estime, montant_ht, taux_tva, montant_tva, montant_ttc,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur) VALUES

('880e8400-e29b-41d4-a716-446655440002', 1, 'Laptop Dell Latitude 5540 - i7/16GB/512GB', 'ART-EQP-001', 'Équipements IT',
  5, 'unite', 1700.00, 8500.00, 0, 0, 8500.00,
  '660e8400-e29b-41d4-a716-446655440002', 'FRN-002', 'Tech Solutions Ghana', '401002');

-- DA-2025-003 : Carburant (Validée)
INSERT INTO demandes_achat (id, numero_da, type_demande, objet, justification, urgence,
  dossier_id, dossier_ref, demandeur_id, demandeur_nom, demandeur_email, agence,
  montant_ht, montant_tva, montant_total, devise, statut,
  workflow_validation, bon_commande_id, bon_commande_ref,
  date_creation, date_soumission, date_validation_finale,
  created_by) VALUES

('880e8400-e29b-41d4-a716-446655440003', 'DA-2025-003', 'operationnel',
  'Carburant Diesel - Janvier 2025', 'Ravitaillement flotte transport', 'normale',
  'DOS-2025-GH-001', 'Maxam Ghana - Transport',
  '550e8400-e29b-41d4-a716-446655440002', 'Transport Manager', 'transport.manager@jocyderklogistics.com', 'GHANA',
  850.50, 0, 850.50, 'GHS', 'validee',
  '{"niveau_actuel": 2, "statut_final": "validee", "niveaux_requis": [1, 2],
    "historique": [
      {"niveau": 1, "decision": "approuvee", "valideur": "Purchasing Manager", "date": "2025-01-21T08:00:00Z"},
      {"niveau": 2, "decision": "approuvee", "valideur": "CFO Ghana", "date": "2025-01-21T10:00:00Z"}
    ]}'::jsonb,
  '990e8400-e29b-41d4-a716-446655440003', 'BC-GH-2025-003',
  '2025-01-20 16:00:00', '2025-01-20 17:00:00', '2025-01-21 10:00:00',
  '550e8400-e29b-41d4-a716-446655440002');

-- Lignes DA-2025-003
INSERT INTO lignes_demande_achat (demande_achat_id, numero_ligne, designation, reference_article, categorie,
  quantite, unite, prix_unitaire_estime, montant_ht, taux_tva, montant_tva, montant_ttc,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur) VALUES

('880e8400-e29b-41d4-a716-446655440003', 1, 'Diesel 50 PPM', 'ART-CNS-001', 'Consommables',
  150, 'litre', 5.67, 850.50, 0, 0, 850.50,
  '660e8400-e29b-41d4-a716-446655440003', 'FRN-003', 'Total Ghana', '401003');

-- DA-2025-004 : Palettes (Validée)
INSERT INTO demandes_achat (id, numero_da, type_demande, objet, justification, urgence,
  dossier_id, dossier_ref, demandeur_id, demandeur_nom, demandeur_email, agence,
  montant_ht, montant_tva, montant_total, devise, statut,
  workflow_validation, bon_commande_id, bon_commande_ref,
  date_creation, date_soumission, date_validation_finale,
  created_by) VALUES

('880e8400-e29b-41d4-a716-446655440004', 'DA-2025-004', 'operationnel',
  'Palettes EUR 120x80cm', 'Stock palettes entrepôt', 'normale',
  'DOS-2025-GH-002', 'Maxam Ghana - Stockage',
  '550e8400-e29b-41d4-a716-446655440006', 'Warehouse Manager', 'warehouse@jocyderklogistics.com', 'GHANA',
  2700.00, 0, 2700.00, 'GHS', 'validee',
  '{"niveau_actuel": 2, "statut_final": "validee", "niveaux_requis": [1, 2],
    "historique": [
      {"niveau": 1, "decision": "approuvee", "valideur": "Purchasing Manager", "date": "2025-01-23T09:00:00Z"},
      {"niveau": 2, "decision": "approuvee", "valideur": "CFO Ghana", "date": "2025-01-23T14:30:00Z"}
    ]}'::jsonb,
  '990e8400-e29b-41d4-a716-446655440004', 'BC-GH-2025-004',
  '2025-01-22 11:00:00', '2025-01-22 12:00:00', '2025-01-23 14:30:00',
  '550e8400-e29b-41d4-a716-446655440006');

-- Lignes DA-2025-004
INSERT INTO lignes_demande_achat (demande_achat_id, numero_ligne, designation, reference_article, categorie,
  quantite, unite, prix_unitaire_estime, montant_ht, taux_tva, montant_tva, montant_ttc,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur) VALUES

('880e8400-e29b-41d4-a716-446655440004', 1, 'Palette EUR 120x80cm', 'ART-EMB-001', 'Emballages',
  60, 'unite', 45.00, 2700.00, 0, 0, 2700.00,
  '660e8400-e29b-41d4-a716-446655440004', 'FRN-004', 'Warehouse Equipment Ltd', '401004');

-- DA-2025-005 : Formation (Rejetée)
INSERT INTO demandes_achat (id, numero_da, type_demande, objet, justification, urgence,
  demandeur_id, demandeur_nom, demandeur_email, agence,
  montant_ht, montant_tva, montant_total, devise, statut,
  workflow_validation,
  date_creation, date_soumission,
  created_by) VALUES

('880e8400-e29b-41d4-a716-446655440005', 'DA-2025-005', 'interne',
  'Formation logiciel ERP', 'Formation équipe', 'normale',
  '550e8400-e29b-41d4-a716-446655440007', 'Accountant', 'accountant@jocyderklogistics.com', 'GHANA',
  5000.00, 0, 5000.00, 'GHS', 'rejetee',
  '{"niveau_actuel": 1, "statut_final": "rejetee", "niveaux_requis": [1, 2],
    "historique": [
      {"niveau": 1, "decision": "rejetee", "valideur": "Purchasing Manager", "date": "2025-01-28T10:00:00Z",
       "motif": "Budget formation déjà épuisé", "commentaire": "Reporter au Q2"}
    ]}'::jsonb,
  '2025-01-27 09:00:00', '2025-01-27 10:00:00',
  '550e8400-e29b-41d4-a716-446655440007');

-- Lignes DA-2025-005
INSERT INTO lignes_demande_achat (demande_achat_id, numero_ligne, designation, categorie,
  quantite, unite, prix_unitaire_estime, montant_ht, taux_tva, montant_tva, montant_ttc,
  code_fournisseur, nom_fournisseur) VALUES

('880e8400-e29b-41d4-a716-446655440005', 1, 'Formation ERP - 2 jours - 5 personnes', 'Formation',
  1, 'forfait', 5000.00, 5000.00, 0, 0, 5000.00,
  'FRN-999', 'Training Center Ghana');

-- DA-2025-006 : Recrutement (En validation)
INSERT INTO demandes_achat (id, numero_da, type_demande, objet, justification, urgence,
  demandeur_id, demandeur_nom, demandeur_email, agence,
  montant_ht, montant_tva, montant_total, devise, statut,
  workflow_validation,
  date_creation, date_soumission,
  created_by) VALUES

('880e8400-e29b-41d4-a716-446655440006', 'DA-2025-006', 'interne',
  'Frais recrutement Chauffeur', 'Recrutement nouveau chauffeur', 'normale',
  '550e8400-e29b-41d4-a716-446655440002', 'Transport Manager', 'transport.manager@jocyderklogistics.com', 'GHANA',
  3500.00, 0, 3500.00, 'GHS', 'en_validation_niveau_1',
  '{"niveau_actuel": 1, "niveaux_requis": [1, 2],
    "validateurs_niveau_1": ["Purchasing Manager"],
    "historique": []}'::jsonb,
  '2025-02-05 14:00:00', '2025-02-05 15:00:00',
  '550e8400-e29b-41d4-a716-446655440002');

-- Lignes DA-2025-006
INSERT INTO lignes_demande_achat (demande_achat_id, numero_ligne, designation, categorie,
  quantite, unite, prix_unitaire_estime, montant_ht, taux_tva, montant_tva, montant_ttc) VALUES

('880e8400-e29b-41d4-a716-446655440006', 1, 'Frais agence recrutement + tests', 'Services RH',
  1, 'forfait', 3500.00, 3500.00, 0, 0, 3500.00);

-- ========================================
-- 6. BONS DE COMMANDE
-- ========================================

-- BC-GH-2025-003 : Total Ghana (Livré et payé)
INSERT INTO bons_commande (id, numero_bc, demande_achat_id, demande_achat_ref,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur,
  montant_ht, montant_total_tva, montant_ttc, devise,
  conditions_paiement, delai_livraison_jours, lieu_livraison,
  statut, date_emission, date_envoi, date_confirmation, confirme_par,
  agence, emis_par, emis_par_nom, created_by) VALUES

('990e8400-e29b-41d4-a716-446655440003', 'BC-GH-2025-003',
  '880e8400-e29b-41d4-a716-446655440003', 'DA-2025-003',
  '660e8400-e29b-41d4-a716-446655440003', 'FRN-003', 'Total Ghana', '401003',
  850.50, 0, 850.50, 'GHS',
  '{"mode": "credit", "delai_jours": 15}'::jsonb, 3, 'Warehouse Ghana',
  'reception_complete', '2025-01-22', '2025-01-22 09:00:00', '2025-01-22 10:30:00', 'Total Ghana Commercial',
  'GHANA', '550e8400-e29b-41d4-a716-446655440003', 'Purchasing Manager',
  '550e8400-e29b-41d4-a716-446655440003');

-- Lignes BC-GH-2025-003
INSERT INTO lignes_bon_commande (bon_commande_id, numero_ligne, article_id, designation, reference, categorie,
  quantite_commandee, quantite_recue, unite, prix_unitaire, montant_ht, taux_tva, montant_tva, montant_ttc) VALUES

('990e8400-e29b-41d4-a716-446655440003', 1, '770e8400-e29b-41d4-a716-446655440002',
  'Diesel 50 PPM', 'ART-CNS-001', 'Consommables',
  150, 150, 'litre', 5.67, 850.50, 0, 0, 850.50);

-- BC-GH-2025-004 : Warehouse Equipment (Livré)
INSERT INTO bons_commande (id, numero_bc, demande_achat_id, demande_achat_ref,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur,
  montant_ht, montant_total_tva, montant_ttc, devise,
  conditions_paiement, delai_livraison_jours, lieu_livraison,
  statut, date_emission, date_envoi, date_confirmation, confirme_par,
  agence, emis_par, emis_par_nom, created_by) VALUES

('990e8400-e29b-41d4-a716-446655440004', 'BC-GH-2025-004',
  '880e8400-e29b-41d4-a716-446655440004', 'DA-2025-004',
  '660e8400-e29b-41d4-a716-446655440004', 'FRN-004', 'Warehouse Equipment Ltd', '401004',
  2700.00, 0, 2700.00, 'GHS',
  '{"mode": "credit", "delai_jours": 45}'::jsonb, 5, 'Warehouse Ghana',
  'reception_complete', '2025-01-24', '2025-01-24 10:00:00', '2025-01-24 14:00:00', 'Samuel Mensah',
  'GHANA', '550e8400-e29b-41d4-a716-446655440003', 'Purchasing Manager',
  '550e8400-e29b-41d4-a716-446655440003');

-- Lignes BC-GH-2025-004
INSERT INTO lignes_bon_commande (bon_commande_id, numero_ligne, article_id, designation, reference, categorie,
  quantite_commandee, quantite_recue, unite, prix_unitaire, montant_ht, taux_tva, montant_tva, montant_ttc) VALUES

('990e8400-e29b-41d4-a716-446655440004', 1, '770e8400-e29b-41d4-a716-446655440003',
  'Palette EUR 120x80cm', 'ART-EMB-001', 'Emballages',
  60, 60, 'unite', 45.00, 2700.00, 0, 0, 2700.00);

-- BC-GH-2025-005 : Office Supplies (Confirmé, pas encore livré)
INSERT INTO bons_commande (id, numero_bc, demande_achat_id, demande_achat_ref,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur,
  montant_ht, montant_total_tva, montant_ttc, devise,
  conditions_paiement, delai_livraison_jours, lieu_livraison,
  statut, date_emission, date_envoi, date_confirmation, confirme_par,
  agence, emis_par, emis_par_nom, created_by) VALUES

('990e8400-e29b-41d4-a716-446655440005', 'BC-GH-2025-005',
  '880e8400-e29b-41d4-a716-446655440001', 'DA-2025-001',
  '660e8400-e29b-41d4-a716-446655440001', 'FRN-001', 'Office Supplies Ghana', '401001',
  1250.00, 0, 1250.00, 'GHS',
  '{"mode": "credit", "delai_jours": 30}'::jsonb, 7, 'Main Office Ghana',
  'confirme', '2025-01-18', '2025-01-18 11:00:00', '2025-01-19 09:00:00', 'John Mensah',
  'GHANA', '550e8400-e29b-41d4-a716-446655440003', 'Purchasing Manager',
  '550e8400-e29b-41d4-a716-446655440003');

-- Lignes BC-GH-2025-005
INSERT INTO lignes_bon_commande (bon_commande_id, numero_ligne, article_id, designation, reference, categorie,
  quantite_commandee, quantite_recue, unite, prix_unitaire, montant_ht, taux_tva, montant_tva, montant_ttc) VALUES

('990e8400-e29b-41d4-a716-446655440005', 1, '770e8400-e29b-41d4-a716-446655440001',
  'Papier A4 80g - Ramette 500 feuilles', 'ART-FRN-001', 'Fournitures',
  100, 0, 'boite', 12.50, 1250.00, 0, 0, 1250.00);

-- BC-GH-2025-007 : Tech Solutions (Envoyé, pas encore confirmé)
INSERT INTO bons_commande (id, numero_bc, demande_achat_id, demande_achat_ref,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur,
  montant_ht, montant_total_tva, montant_ttc, devise,
  conditions_paiement, delai_livraison_jours, lieu_livraison,
  statut, date_emission, date_envoi,
  agence, emis_par, emis_par_nom, created_by) VALUES

('990e8400-e29b-41d4-a716-446655440007', 'BC-GH-2025-007',
  '880e8400-e29b-41d4-a716-446655440002', 'DA-2025-002',
  '660e8400-e29b-41d4-a716-446655440002', 'FRN-002', 'Tech Solutions Ghana', '401002',
  8500.00, 0, 8500.00, 'USD',
  '{"mode": "acompte", "acompte_pourcent": 30, "delai_jours": 30}'::jsonb, 10, 'Main Office Ghana',
  'envoye', '2025-02-03', '2025-02-03 10:00:00',
  'GHANA', '550e8400-e29b-41d4-a716-446655440003', 'Purchasing Manager',
  '550e8400-e29b-41d4-a716-446655440003');

-- Lignes BC-GH-2025-007
INSERT INTO lignes_bon_commande (bon_commande_id, numero_ligne, article_id, designation, reference, categorie,
  quantite_commandee, quantite_recue, unite, prix_unitaire, montant_ht, taux_tva, montant_tva, montant_ttc) VALUES

('990e8400-e29b-41d4-a716-446655440007', 1, '770e8400-e29b-41d4-a716-446655440004',
  'Laptop Dell Latitude 5540 - i7/16GB/512GB', 'ART-EQP-001', 'Équipements IT',
  5, 0, 'unite', 1700.00, 8500.00, 0, 0, 8500.00);

-- ========================================
-- 7. RÉCEPTIONS
-- ========================================

-- Réception BC-GH-2025-003 (Total)
INSERT INTO receptions (id, numero_reception, bon_commande_id, numero_bc, bon_livraison_ref,
  date_reception, receptionne_par, receptionne_par_nom, statut, observations_generales) VALUES

('aa0e8400-e29b-41d4-a716-446655440001', 'REC-GH-2025-0015',
  '990e8400-e29b-41d4-a716-446655440003', 'BC-GH-2025-003', 'BL-TOTAL-2025-0098',
  '2025-01-25 08:30:00',
  '550e8400-e29b-41d4-a716-446655440006', 'Warehouse Manager', 'validee',
  'Livraison conforme, quantité OK');

-- Lignes réception
INSERT INTO lignes_reception (reception_id, ligne_bc_id, quantite_recue, quantite_conforme, prix_unitaire, conforme) VALUES
((SELECT id FROM lignes_bon_commande WHERE bon_commande_id = '990e8400-e29b-41d4-a716-446655440003' AND numero_ligne = 1),
 (SELECT id FROM lignes_bon_commande WHERE bon_commande_id = '990e8400-e29b-41d4-a716-446655440003' AND numero_ligne = 1),
 150, 150, 5.67, true);

-- Réception BC-GH-2025-004 (Warehouse Equipment)
INSERT INTO receptions (id, numero_reception, bon_commande_id, numero_bc, bon_livraison_ref,
  date_reception, receptionne_par, receptionne_par_nom, statut, observations_generales) VALUES

('aa0e8400-e29b-41d4-a716-446655440002', 'REC-GH-2025-0016',
  '990e8400-e29b-41d4-a716-446655440004', 'BC-GH-2025-004', 'BL-WEL-2025-0234',
  '2025-01-25 14:00:00',
  '550e8400-e29b-41d4-a716-446655440006', 'Warehouse Manager', 'validee',
  'Palettes en bon état');

-- Lignes réception
INSERT INTO lignes_reception (reception_id, ligne_bc_id, quantite_recue, quantite_conforme, prix_unitaire, conforme) VALUES
((SELECT id FROM lignes_bon_commande WHERE bon_commande_id = '990e8400-e29b-41d4-a716-446655440004' AND numero_ligne = 1),
 (SELECT id FROM lignes_bon_commande WHERE bon_commande_id = '990e8400-e29b-41d4-a716-446655440004' AND numero_ligne = 1),
 60, 60, 45.00, true);

-- ========================================
-- 8. MOUVEMENTS STOCK
-- ========================================

-- MVT-GH-2025-0015 : Entrée Diesel
INSERT INTO mouvements_stock (id, numero_mouvement, type_mouvement,
  article_id, code_article, designation, quantite, unite,
  prix_unitaire, montant_total, pmp_avant, pmp_apres, stock_avant, stock_apres,
  bon_commande_id, bon_commande_ref, reception_id, bon_livraison_ref,
  agence, effectue_par, effectue_par_nom, statut, date_mouvement, notes) VALUES

('bb0e8400-e29b-41d4-a716-446655440015', 'MVT-GH-2025-0015', 'entree_achat',
  '770e8400-e29b-41d4-a716-446655440002', 'ART-CNS-001', 'Diesel 50 PPM', 150, 'litre',
  5.67, 850.50, 5.65, 5.67, 430, 580,
  '990e8400-e29b-41d4-a716-446655440003', 'BC-GH-2025-003',
  'aa0e8400-e29b-41d4-a716-446655440001', 'BL-TOTAL-2025-0098',
  'GHANA', '550e8400-e29b-41d4-a716-446655440006', 'Warehouse Manager', 'valide',
  '2025-01-25 08:30:00', 'Entrée stock automatique depuis réception');

-- MVT-GH-2025-0016 : Entrée Palettes
INSERT INTO mouvements_stock (id, numero_mouvement, type_mouvement,
  article_id, code_article, designation, quantite, unite,
  prix_unitaire, montant_total, pmp_avant, pmp_apres, stock_avant, stock_apres,
  bon_commande_id, bon_commande_ref, reception_id, bon_livraison_ref,
  agence, effectue_par, effectue_par_nom, statut, date_mouvement, notes) VALUES

('bb0e8400-e29b-41d4-a716-446655440016', 'MVT-GH-2025-0016', 'entree_achat',
  '770e8400-e29b-41d4-a716-446655440003', 'ART-EMB-001', 'Palette EUR 120x80cm', 60, 'unite',
  45.00, 2700.00, 15.00, 25.71, 45, 105,
  '990e8400-e29b-41d4-a716-446655440004', 'BC-GH-2025-004',
  'aa0e8400-e29b-41d4-a716-446655440002', 'BL-WEL-2025-0234',
  'GHANA', '550e8400-e29b-41d4-a716-446655440006', 'Warehouse Manager', 'valide',
  '2025-01-25 14:00:00', 'Entrée stock automatique depuis réception');

-- MVT-GH-2025-0017 : Sortie Diesel (consommation)
INSERT INTO mouvements_stock (id, numero_mouvement, type_mouvement,
  article_id, code_article, designation, quantite, unite,
  prix_unitaire, montant_total, pmp_avant, pmp_apres, stock_avant, stock_apres,
  dossier_ref, agence, effectue_par, effectue_par_nom, statut, date_mouvement, notes) VALUES

('bb0e8400-e29b-41d4-a716-446655440017', 'MVT-GH-2025-0017', 'sortie_consommation',
  '770e8400-e29b-41d4-a716-446655440002', 'ART-CNS-001', 'Diesel 50 PPM', -50, 'litre',
  5.67, -283.50, 5.67, 5.67, 580, 530,
  'DOS-2025-GH-001', 'GHANA',
  '550e8400-e29b-41d4-a716-446655440002', 'Transport Manager', 'valide',
  '2025-01-28 09:00:00', 'Consommation dossier Maxam Ghana');

-- MVT-GH-2025-0018 : Sortie Palettes
INSERT INTO mouvements_stock (id, numero_mouvement, type_mouvement,
  article_id, code_article, designation, quantite, unite,
  prix_unitaire, montant_total, pmp_avant, pmp_apres, stock_avant, stock_apres,
  dossier_ref, agence, effectue_par, effectue_par_nom, statut, date_mouvement, notes) VALUES

('bb0e8400-e29b-41d4-a716-446655440018', 'MVT-GH-2025-0018', 'sortie_consommation',
  '770e8400-e29b-41d4-a716-446655440003', 'ART-EMB-001', 'Palette EUR 120x80cm', -20, 'unite',
  25.71, -514.20, 25.71, 25.71, 105, 85,
  'DOS-2025-GH-002', 'GHANA',
  '550e8400-e29b-41d4-a716-446655440006', 'Warehouse Manager', 'valide',
  '2025-01-30 11:00:00', 'Sortie palettes dossier stockage');

-- MVT-GH-2025-0020 : Ajustement inventaire Papier
INSERT INTO mouvements_stock (id, numero_mouvement, type_mouvement,
  article_id, code_article, designation, quantite, unite,
  prix_unitaire, montant_total, pmp_avant, pmp_apres, stock_avant, stock_apres,
  agence, effectue_par, effectue_par_nom, statut, date_mouvement, notes) VALUES

('bb0e8400-e29b-41d4-a716-446655440020', 'MVT-GH-2025-0020', 'entree_ajustement',
  '770e8400-e29b-41d4-a716-446655440001', 'ART-FRN-001', 'Papier A4 80g - Ramette 500 feuilles', 3, 'boite',
  12.50, 37.50, 12.50, 12.50, 42, 45,
  'GHANA', '550e8400-e29b-41d4-a716-446655440006', 'Warehouse Manager', 'valide',
  '2025-02-01 16:00:00', 'Ajustement après inventaire physique');

-- ========================================
-- 9. FACTURES FOURNISSEURS
-- ========================================

-- Facture Total Ghana (Payée)
INSERT INTO factures_fournisseurs (id, numero_facture, numero_interne,
  demande_achat_id, demande_achat_ref, bon_commande_id, bon_commande_ref,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur,
  date_facture, date_echeance, date_reception_facture, date_saisie,
  montant_ht, montant_total_tva, montant_ttc, devise,
  montant_paye, montant_restant, statut,
  controle_3_voies, validee_par, validee_le, saisie_par, saisie_le) VALUES

('cc0e8400-e29b-41d4-a716-446655440001', 'TOTAL-2025-0098', 'FRN-2025-0012',
  '880e8400-e29b-41d4-a716-446655440003', 'DA-2025-003',
  '990e8400-e29b-41d4-a716-446655440003', 'BC-GH-2025-003',
  '660e8400-e29b-41d4-a716-446655440003', 'FRN-003', 'Total Ghana', '401003',
  '2025-01-26', '2025-02-10', '2025-01-27', '2025-01-27 10:00:00',
  850.50, 0, 850.50, 'GHS',
  850.50, 0, 'payee',
  '{"effectue_le": "2025-01-27T11:00:00Z", "effectue_par": "Accountant", "conforme": true, "taux_conformite": 100,
    "ecarts_detectes": []}'::jsonb,
  'CFO Ghana', '2025-01-27 14:00:00',
  'Accountant', '2025-01-27 10:00:00');

-- Lignes facture Total
INSERT INTO lignes_facture (facture_id, numero_ligne, designation, reference, quantite, unite,
  prix_unitaire, montant_ht, taux_tva, montant_tva, montant_ttc) VALUES

('cc0e8400-e29b-41d4-a716-446655440001', 1, 'Diesel 50 PPM', 'ART-CNS-001',
  150, 'litre', 5.67, 850.50, 0, 0, 850.50);

-- Facture Warehouse Equipment (Payée)
INSERT INTO factures_fournisseurs (id, numero_facture, numero_interne,
  demande_achat_id, demande_achat_ref, bon_commande_id, bon_commande_ref,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur,
  date_facture, date_echeance, date_reception_facture, date_saisie,
  montant_ht, montant_total_tva, montant_ttc, devise,
  montant_paye, montant_restant, statut,
  controle_3_voies, validee_par, validee_le, saisie_par, saisie_le) VALUES

('cc0e8400-e29b-41d4-a716-446655440002', 'WEL-INV-0234', 'FRN-2025-0013',
  '880e8400-e29b-41d4-a716-446655440004', 'DA-2025-004',
  '990e8400-e29b-41d4-a716-446655440004', 'BC-GH-2025-004',
  '660e8400-e29b-41d4-a716-446655440004', 'FRN-004', 'Warehouse Equipment Ltd', '401004',
  '2025-01-26', '2025-03-12', '2025-01-27', '2025-01-27 11:00:00',
  2700.00, 0, 2700.00, 'GHS',
  2700.00, 0, 'payee',
  '{"effectue_le": "2025-01-27T12:00:00Z", "effectue_par": "Accountant", "conforme": true, "taux_conformite": 100,
    "ecarts_detectes": []}'::jsonb,
  'CFO Ghana', '2025-01-27 15:00:00',
  'Accountant', '2025-01-27 11:00:00');

-- Lignes facture Warehouse
INSERT INTO lignes_facture (facture_id, numero_ligne, designation, reference, quantite, unite,
  prix_unitaire, montant_ht, taux_tva, montant_tva, montant_ttc) VALUES

('cc0e8400-e29b-41d4-a716-446655440002', 1, 'Palette EUR 120x80cm', 'ART-EMB-001',
  60, 'unite', 45.00, 2700.00, 0, 0, 2700.00);

-- Facture Office Supplies (Validée paiement, pas encore payée)
INSERT INTO factures_fournisseurs (id, numero_facture, numero_interne,
  demande_achat_id, demande_achat_ref, bon_commande_id, bon_commande_ref,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur,
  date_facture, date_echeance, date_reception_facture, date_saisie,
  montant_ht, montant_total_tva, montant_ttc, devise,
  montant_paye, montant_restant, statut,
  validee_par, validee_le, saisie_par, saisie_le) VALUES

('cc0e8400-e29b-41d4-a716-446655440003', 'OSG-2025-156', 'FRN-2025-0014',
  '880e8400-e29b-41d4-a716-446655440001', 'DA-2025-001',
  '990e8400-e29b-41d4-a716-446655440005', 'BC-GH-2025-005',
  '660e8400-e29b-41d4-a716-446655440001', 'FRN-001', 'Office Supplies Ghana', '401001',
  '2025-01-28', '2025-02-27', '2025-01-29', '2025-01-29 09:00:00',
  1250.00, 0, 1250.00, 'GHS',
  0, 1250.00, 'validee_paiement',
  'CFO Ghana', '2025-01-29 14:00:00',
  'Accountant', '2025-01-29 09:00:00');

-- Lignes facture Office Supplies
INSERT INTO lignes_facture (facture_id, numero_ligne, designation, reference, quantite, unite,
  prix_unitaire, montant_ht, taux_tva, montant_tva, montant_ttc) VALUES

('cc0e8400-e29b-41d4-a716-446655440003', 1, 'Papier A4 80g - Ramette 500 feuilles', 'ART-FRN-001',
  100, 'boite', 12.50, 1250.00, 0, 0, 1250.00);

-- Facture Tech Solutions (Écart détecté - Prix différent)
INSERT INTO factures_fournisseurs (id, numero_facture, numero_interne,
  demande_achat_id, demande_achat_ref, bon_commande_id, bon_commande_ref,
  fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur,
  date_facture, date_echeance, date_reception_facture, date_saisie,
  montant_ht, montant_total_tva, montant_ttc, devise,
  montant_paye, montant_restant, statut,
  controle_3_voies, saisie_par, saisie_le) VALUES

('cc0e8400-e29b-41d4-a716-446655440004', 'TSG-2025-0089', 'FRN-2025-0015',
  '880e8400-e29b-41d4-a716-446655440002', 'DA-2025-002',
  '990e8400-e29b-41d4-a716-446655440007', 'BC-GH-2025-007',
  '660e8400-e29b-41d4-a716-446655440002', 'FRN-002', 'Tech Solutions Ghana', '401002',
  '2025-02-03', '2025-02-10', '2025-02-04', '2025-02-04 10:00:00',
  8750.00, 0, 8750.00, 'USD',
  0, 8750.00, 'ecart_detecte',
  '{"effectue_le": "2025-02-04T11:00:00Z", "effectue_par": "Accountant", "conforme": false, "taux_conformite": 97.06,
    "ecarts_detectes": [
      {"type": "prix_unitaire", "ligne_numero": 1, "description": "Prix unitaire facturé supérieur au BC",
       "valeur_attendue": 1700.00, "valeur_facturee": 1750.00, "ecart": 50.00, "ecart_pourcent": 2.94,
       "gravite": "moyenne", "action_requise": "Vérifier justification prix avec fournisseur"}
    ],
    "decision": "investigation"}'::jsonb,
  'Accountant', '2025-02-04 10:00:00');

-- Lignes facture Tech Solutions
INSERT INTO lignes_facture (facture_id, numero_ligne, designation, reference, quantite, unite,
  prix_unitaire, montant_ht, taux_tva, montant_tva, montant_ttc) VALUES

('cc0e8400-e29b-41d4-a716-446655440004', 1, 'Laptop Dell Latitude 5540 - i7/16GB/512GB', 'ART-EQP-001',
  5, 'unite', 1750.00, 8750.00, 0, 0, 8750.00);

-- ========================================
-- 10. PAIEMENTS
-- ========================================

-- Paiement Total Ghana
INSERT INTO paiements (id, numero_paiement, facture_id, numero_facture,
  fournisseur_id, nom_fournisseur, montant, devise, methode_paiement,
  details_methode, date_paiement, date_valeur, statut,
  valide_par, valide_le, effectue_par, effectue_par_nom, notes) VALUES

('dd0e8400-e29b-41d4-a716-446655440001', 'PAY-GH-2025-003',
  'cc0e8400-e29b-41d4-a716-446655440001', 'TOTAL-2025-0098',
  '660e8400-e29b-41d4-a716-446655440003', 'Total Ghana', 850.50, 'GHS', 'virement_bancaire',
  '{"banque": "GCB Bank", "numero_compte": "10220345678", "reference": "VIR-2025-0056"}'::jsonb,
  '2025-01-29', '2025-01-30', 'valide',
  'CFO Ghana', '2025-01-30 10:00:00',
  '550e8400-e29b-41d4-a716-446655440008', 'Treasury Manager',
  'Paiement virement - 15 jours crédit respectés');

-- Paiement Warehouse Equipment
INSERT INTO paiements (id, numero_paiement, facture_id, numero_facture,
  fournisseur_id, nom_fournisseur, montant, devise, methode_paiement,
  details_methode, date_paiement, date_valeur, statut,
  valide_par, valide_le, effectue_par, effectue_par_nom, notes) VALUES

('dd0e8400-e29b-41d4-a716-446655440002', 'PAY-GH-2025-004',
  'cc0e8400-e29b-41d4-a716-446655440002', 'WEL-INV-0234',
  '660e8400-e29b-41d4-a716-446655440004', 'Warehouse Equipment Ltd', 2700.00, 'GHS', 'virement_bancaire',
  '{"banque": "Ecobank Ghana", "numero_compte": "05512345678", "reference": "VIR-2025-0057"}'::jsonb,
  '2025-01-30', '2025-01-31', 'valide',
  'CFO Ghana', '2025-01-31 09:00:00',
  '550e8400-e29b-41d4-a716-446655440008', 'Treasury Manager',
  'Paiement anticipé - Bonne relation fournisseur');

-- ========================================
-- Réactiver triggers
-- ========================================

SET session_replication_role = 'origin';

-- ========================================
-- COMMIT
-- ========================================

COMMIT;

-- ========================================
-- Vérifications
-- ========================================

-- Nombre d'enregistrements
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'fournisseurs', COUNT(*) FROM fournisseurs
UNION ALL SELECT 'demandes_achat', COUNT(*) FROM demandes_achat
UNION ALL SELECT 'bons_commande', COUNT(*) FROM bons_commande
UNION ALL SELECT 'articles', COUNT(*) FROM articles
UNION ALL SELECT 'mouvements_stock', COUNT(*) FROM mouvements_stock
UNION ALL SELECT 'factures_fournisseurs', COUNT(*) FROM factures_fournisseurs
UNION ALL SELECT 'paiements', COUNT(*) FROM paiements;

-- Vérifier valeurs stock articles
SELECT code_article, designation, stock_actuel, pmp_actuel, valeur_stock 
FROM articles 
ORDER BY code_article;

-- Vérifier alertes stock
SELECT * FROM v_stock_valorise WHERE etat_stock != 'normal';

-- Vérifier factures impayées
SELECT * FROM v_factures_impayees;

-- ========================================
-- FIN DU SCRIPT
-- ========================================
