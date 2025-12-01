-- ========================================
-- SCHÉMA BASE DE DONNÉES - MODULE ACHATS
-- PostgreSQL 14+
-- ========================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- 1. UTILISATEURS ET AUTHENTIFICATION
-- ========================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  agence VARCHAR(50) NOT NULL CHECK (agence IN ('GHANA', 'COTE_IVOIRE', 'BURKINA')),
  
  -- Profils
  profile_purchases_create BOOLEAN DEFAULT false,
  profile_purchases_validate_level_1 BOOLEAN DEFAULT false,
  profile_purchases_validate_level_2 BOOLEAN DEFAULT false,
  profile_purchases_validate_level_3 BOOLEAN DEFAULT false,
  profile_purchases_payment BOOLEAN DEFAULT false,
  profile_stock_manage BOOLEAN DEFAULT false,
  profile_invoices_validate BOOLEAN DEFAULT false,
  profile_reporting_view BOOLEAN DEFAULT false,
  
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_agence ON users(agence);

-- ========================================
-- 2. FOURNISSEURS
-- ========================================

CREATE TABLE fournisseurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code_fournisseur VARCHAR(50) UNIQUE NOT NULL,
  nom VARCHAR(255) NOT NULL,
  compte_fournisseur VARCHAR(50),
  
  -- Contact
  adresse TEXT,
  ville VARCHAR(100),
  pays VARCHAR(100),
  telephone VARCHAR(50),
  email VARCHAR(255),
  contact_principal VARCHAR(255),
  
  -- Comptabilité
  conditions_paiement_defaut JSONB,
  devise_defaut VARCHAR(10) DEFAULT 'GHS',
  
  -- Metadata
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fournisseurs_code ON fournisseurs(code_fournisseur);
CREATE INDEX idx_fournisseurs_actif ON fournisseurs(actif);

-- ========================================
-- 3. DEMANDES D'ACHAT
-- ========================================

CREATE TABLE demandes_achat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_da VARCHAR(50) UNIQUE NOT NULL,
  
  -- Informations générales
  type_demande VARCHAR(50) NOT NULL CHECK (type_demande IN ('operationnel', 'interne', 'investissement', 'contrat_cadre')),
  objet TEXT NOT NULL,
  justification TEXT,
  urgence VARCHAR(20) DEFAULT 'normale' CHECK (urgence IN ('normale', 'urgent', 'tres_urgent')),
  
  -- Dossier (si applicable)
  dossier_id VARCHAR(50),
  dossier_ref VARCHAR(100),
  
  -- Demandeur
  demandeur_id UUID REFERENCES users(id),
  demandeur_nom VARCHAR(255) NOT NULL,
  demandeur_email VARCHAR(255),
  agence VARCHAR(50) NOT NULL,
  
  -- Montants
  montant_ht DECIMAL(15, 2) NOT NULL DEFAULT 0,
  montant_tva DECIMAL(15, 2) NOT NULL DEFAULT 0,
  montant_total DECIMAL(15, 2) NOT NULL DEFAULT 0,
  devise VARCHAR(10) NOT NULL DEFAULT 'GHS',
  
  -- Statut
  statut VARCHAR(50) NOT NULL DEFAULT 'brouillon',
  
  -- Workflow validation
  workflow_validation JSONB,
  
  -- Bon de commande généré
  bon_commande_id UUID,
  bon_commande_ref VARCHAR(50),
  
  -- Dates
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_soumission TIMESTAMP,
  date_validation_finale TIMESTAMP,
  
  -- Audit
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id)
);

-- Index
CREATE INDEX idx_da_numero ON demandes_achat(numero_da);
CREATE INDEX idx_da_statut ON demandes_achat(statut);
CREATE INDEX idx_da_agence ON demandes_achat(agence);
CREATE INDEX idx_da_demandeur ON demandes_achat(demandeur_id);
CREATE INDEX idx_da_date_creation ON demandes_achat(date_creation DESC);

-- ========================================
-- 4. LIGNES DEMANDES D'ACHAT
-- ========================================

CREATE TABLE lignes_demande_achat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  demande_achat_id UUID REFERENCES demandes_achat(id) ON DELETE CASCADE,
  numero_ligne INTEGER NOT NULL,
  
  -- Article
  designation TEXT NOT NULL,
  description TEXT,
  reference_article VARCHAR(100),
  categorie VARCHAR(100),
  
  -- Quantité
  quantite DECIMAL(15, 3) NOT NULL,
  unite VARCHAR(50) NOT NULL,
  
  -- Prix
  prix_unitaire_estime DECIMAL(15, 2),
  montant_ht DECIMAL(15, 2) NOT NULL,
  taux_tva DECIMAL(5, 2) DEFAULT 0,
  montant_tva DECIMAL(15, 2) DEFAULT 0,
  montant_ttc DECIMAL(15, 2) NOT NULL,
  
  -- Fournisseur suggéré
  fournisseur_id UUID REFERENCES fournisseurs(id),
  code_fournisseur VARCHAR(50),
  nom_fournisseur VARCHAR(255),
  compte_fournisseur VARCHAR(50),
  
  -- Dates
  date_besoin DATE,
  
  -- Metadata
  notes TEXT,
  
  UNIQUE(demande_achat_id, numero_ligne)
);

CREATE INDEX idx_lignes_da_demande ON lignes_demande_achat(demande_achat_id);

-- ========================================
-- 5. SÉRIES DE NUMÉROTATION
-- ========================================

CREATE TABLE series_numerotation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_serie VARCHAR(20) NOT NULL CHECK (type_serie IN ('DA', 'BC', 'FACTURE', 'PAIEMENT', 'MOUVEMENT')),
  agence VARCHAR(50) NOT NULL,
  annee INTEGER NOT NULL,
  compteur INTEGER NOT NULL DEFAULT 1,
  
  -- Contrainte unicité
  UNIQUE(type_serie, agence, annee)
);

CREATE INDEX idx_series_type_agence ON series_numerotation(type_serie, agence, annee);

-- ========================================
-- 6. BONS DE COMMANDE
-- ========================================

CREATE TABLE bons_commande (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_bc VARCHAR(50) UNIQUE NOT NULL,
  
  -- Références
  demande_achat_id UUID REFERENCES demandes_achat(id),
  demande_achat_ref VARCHAR(50),
  
  -- Fournisseur
  fournisseur_id UUID REFERENCES fournisseurs(id),
  code_fournisseur VARCHAR(50) NOT NULL,
  nom_fournisseur VARCHAR(255) NOT NULL,
  compte_fournisseur VARCHAR(50),
  
  -- Montants
  montant_ht DECIMAL(15, 2) NOT NULL,
  montant_total_tva DECIMAL(15, 2) NOT NULL DEFAULT 0,
  montant_ttc DECIMAL(15, 2) NOT NULL,
  devise VARCHAR(10) NOT NULL,
  
  -- Conditions
  conditions_paiement JSONB NOT NULL,
  delai_livraison_jours INTEGER,
  lieu_livraison TEXT,
  
  -- Statut
  statut VARCHAR(50) NOT NULL DEFAULT 'brouillon',
  
  -- Dates
  date_emission DATE NOT NULL,
  date_envoi TIMESTAMP,
  date_confirmation TIMESTAMP,
  confirme_par VARCHAR(255),
  date_annulation TIMESTAMP,
  motif_annulation TEXT,
  
  -- Agence
  agence VARCHAR(50) NOT NULL,
  
  -- Émetteur
  emis_par UUID REFERENCES users(id),
  emis_par_nom VARCHAR(255),
  
  -- Notes
  notes TEXT,
  notes_confirmation TEXT,
  
  -- PDF
  pdf_url TEXT,
  
  -- Audit
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_bc_numero ON bons_commande(numero_bc);
CREATE INDEX idx_bc_statut ON bons_commande(statut);
CREATE INDEX idx_bc_fournisseur ON bons_commande(fournisseur_id);
CREATE INDEX idx_bc_da ON bons_commande(demande_achat_id);
CREATE INDEX idx_bc_date_emission ON bons_commande(date_emission DESC);

-- ========================================
-- 7. LIGNES BONS DE COMMANDE
-- ========================================

CREATE TABLE lignes_bon_commande (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bon_commande_id UUID REFERENCES bons_commande(id) ON DELETE CASCADE,
  numero_ligne INTEGER NOT NULL,
  
  -- Article
  article_id UUID,
  designation TEXT NOT NULL,
  reference VARCHAR(100),
  categorie VARCHAR(100),
  
  -- Quantités
  quantite_commandee DECIMAL(15, 3) NOT NULL,
  quantite_recue DECIMAL(15, 3) DEFAULT 0,
  unite VARCHAR(50) NOT NULL,
  
  -- Prix
  prix_unitaire DECIMAL(15, 2) NOT NULL,
  montant_ht DECIMAL(15, 2) NOT NULL,
  taux_tva DECIMAL(5, 2) DEFAULT 0,
  montant_tva DECIMAL(15, 2) DEFAULT 0,
  montant_ttc DECIMAL(15, 2) NOT NULL,
  
  -- Notes
  notes TEXT,
  
  UNIQUE(bon_commande_id, numero_ligne)
);

CREATE INDEX idx_lignes_bc_bc ON lignes_bon_commande(bon_commande_id);

-- ========================================
-- 8. RÉCEPTIONS
-- ========================================

CREATE TABLE receptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_reception VARCHAR(50) UNIQUE NOT NULL,
  
  -- Références
  bon_commande_id UUID REFERENCES bons_commande(id),
  numero_bc VARCHAR(50) NOT NULL,
  bon_livraison_ref VARCHAR(100),
  
  -- Dates
  date_reception TIMESTAMP NOT NULL,
  
  -- Réceptionnaire
  receptionne_par UUID REFERENCES users(id),
  receptionne_par_nom VARCHAR(255) NOT NULL,
  
  -- Statut
  statut VARCHAR(50) DEFAULT 'validee',
  
  -- Observations
  observations_generales TEXT,
  anomalies BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_receptions_bc ON receptions(bon_commande_id);
CREATE INDEX idx_receptions_date ON receptions(date_reception DESC);

-- ========================================
-- 9. LIGNES RÉCEPTIONS
-- ========================================

CREATE TABLE lignes_reception (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reception_id UUID REFERENCES receptions(id) ON DELETE CASCADE,
  ligne_bc_id UUID REFERENCES lignes_bon_commande(id),
  
  -- Quantités
  quantite_recue DECIMAL(15, 3) NOT NULL,
  quantite_conforme DECIMAL(15, 3) NOT NULL,
  quantite_non_conforme DECIMAL(15, 3) DEFAULT 0,
  
  -- Prix
  prix_unitaire DECIMAL(15, 2) NOT NULL,
  
  -- Observations
  observations TEXT,
  conforme BOOLEAN DEFAULT true
);

CREATE INDEX idx_lignes_reception_reception ON lignes_reception(reception_id);

-- ========================================
-- 10. ARTICLES (STOCK)
-- ========================================

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code_article VARCHAR(50) UNIQUE NOT NULL,
  designation VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Catégorie
  categorie VARCHAR(100) NOT NULL,
  famille VARCHAR(100),
  
  -- Stock
  stock_actuel DECIMAL(15, 3) DEFAULT 0,
  stock_disponible DECIMAL(15, 3) DEFAULT 0,
  stock_reserve DECIMAL(15, 3) DEFAULT 0,
  stock_minimum DECIMAL(15, 3) DEFAULT 0,
  stock_maximum DECIMAL(15, 3),
  unite VARCHAR(50) NOT NULL,
  
  -- Valorisation
  pmp_actuel DECIMAL(15, 2) DEFAULT 0,
  valeur_stock DECIMAL(15, 2) DEFAULT 0,
  
  -- Gestion
  gestion_stock BOOLEAN DEFAULT true,
  actif BOOLEAN DEFAULT true,
  
  -- Localisation
  entrepot_principal VARCHAR(100),
  emplacement VARCHAR(100),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_code ON articles(code_article);
CREATE INDEX idx_articles_categorie ON articles(categorie);
CREATE INDEX idx_articles_actif ON articles(actif);

-- ========================================
-- 11. MOUVEMENTS STOCK
-- ========================================

CREATE TABLE mouvements_stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_mouvement VARCHAR(50) UNIQUE NOT NULL,
  
  -- Type
  type_mouvement VARCHAR(50) NOT NULL CHECK (type_mouvement IN (
    'entree_achat', 'entree_ajustement', 'entree_retour', 'entree_inventaire',
    'sortie_vente', 'sortie_consommation', 'sortie_ajustement', 'sortie_inventaire',
    'transfert_entree', 'transfert_sortie'
  )),
  
  -- Article
  article_id UUID REFERENCES articles(id),
  code_article VARCHAR(50) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  
  -- Quantité
  quantite DECIMAL(15, 3) NOT NULL,
  unite VARCHAR(50) NOT NULL,
  
  -- Valorisation
  prix_unitaire DECIMAL(15, 2),
  montant_total DECIMAL(15, 2),
  pmp_avant DECIMAL(15, 2),
  pmp_apres DECIMAL(15, 2),
  
  -- Stock
  stock_avant DECIMAL(15, 3),
  stock_apres DECIMAL(15, 3),
  
  -- Références
  bon_commande_id UUID REFERENCES bons_commande(id),
  bon_commande_ref VARCHAR(50),
  reception_id UUID REFERENCES receptions(id),
  bon_livraison_ref VARCHAR(100),
  inventaire_id UUID,
  dossier_ref VARCHAR(50),
  
  -- Agence
  agence VARCHAR(50) NOT NULL,
  
  -- Statut
  statut VARCHAR(50) DEFAULT 'valide',
  
  -- Utilisateur
  effectue_par UUID REFERENCES users(id),
  effectue_par_nom VARCHAR(255),
  
  -- Comptabilité
  piece_comptable_ref VARCHAR(100),
  
  -- Notes
  notes TEXT,
  
  -- Date
  date_mouvement TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mouvements_numero ON mouvements_stock(numero_mouvement);
CREATE INDEX idx_mouvements_article ON mouvements_stock(article_id);
CREATE INDEX idx_mouvements_type ON mouvements_stock(type_mouvement);
CREATE INDEX idx_mouvements_date ON mouvements_stock(date_mouvement DESC);
CREATE INDEX idx_mouvements_bc ON mouvements_stock(bon_commande_id);

-- ========================================
-- 12. FACTURES FOURNISSEURS
-- ========================================

CREATE TABLE factures_fournisseurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_facture VARCHAR(100) NOT NULL,
  numero_interne VARCHAR(50) UNIQUE NOT NULL,
  
  -- Références
  demande_achat_id UUID REFERENCES demandes_achat(id),
  demande_achat_ref VARCHAR(50),
  bon_commande_id UUID REFERENCES bons_commande(id),
  bon_commande_ref VARCHAR(50),
  
  -- Fournisseur
  fournisseur_id UUID REFERENCES fournisseurs(id),
  code_fournisseur VARCHAR(50) NOT NULL,
  nom_fournisseur VARCHAR(255) NOT NULL,
  compte_fournisseur VARCHAR(50),
  
  -- Dates
  date_facture DATE NOT NULL,
  date_echeance DATE NOT NULL,
  date_reception_facture DATE,
  date_saisie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Montants
  montant_ht DECIMAL(15, 2) NOT NULL,
  montant_total_tva DECIMAL(15, 2) NOT NULL DEFAULT 0,
  montant_ttc DECIMAL(15, 2) NOT NULL,
  devise VARCHAR(10) NOT NULL,
  
  -- Paiement
  montant_paye DECIMAL(15, 2) DEFAULT 0,
  montant_restant DECIMAL(15, 2) NOT NULL,
  
  -- Statut
  statut VARCHAR(50) NOT NULL DEFAULT 'saisie',
  
  -- Contrôle 3 voies
  controle_3_voies JSONB,
  
  -- Litige
  en_litige BOOLEAN DEFAULT false,
  motif_litige TEXT,
  date_litige TIMESTAMP,
  
  -- Validation
  validee_par VARCHAR(255),
  validee_le TIMESTAMP,
  
  -- Fichiers
  fichier_facture_url TEXT,
  
  -- Notes
  notes TEXT,
  
  -- Saisie
  saisie_par VARCHAR(255),
  saisie_le TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_factures_numero ON factures_fournisseurs(numero_facture);
CREATE INDEX idx_factures_numero_interne ON factures_fournisseurs(numero_interne);
CREATE INDEX idx_factures_fournisseur ON factures_fournisseurs(fournisseur_id);
CREATE INDEX idx_factures_bc ON factures_fournisseurs(bon_commande_id);
CREATE INDEX idx_factures_statut ON factures_fournisseurs(statut);
CREATE INDEX idx_factures_date ON factures_fournisseurs(date_facture DESC);

-- ========================================
-- 13. LIGNES FACTURES
-- ========================================

CREATE TABLE lignes_facture (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facture_id UUID REFERENCES factures_fournisseurs(id) ON DELETE CASCADE,
  numero_ligne INTEGER NOT NULL,
  
  -- Article
  designation TEXT NOT NULL,
  reference VARCHAR(100),
  
  -- Quantité
  quantite DECIMAL(15, 3) NOT NULL,
  unite VARCHAR(50) NOT NULL,
  
  -- Prix
  prix_unitaire DECIMAL(15, 2) NOT NULL,
  montant_ht DECIMAL(15, 2) NOT NULL,
  taux_tva DECIMAL(5, 2) DEFAULT 0,
  montant_tva DECIMAL(15, 2) DEFAULT 0,
  montant_ttc DECIMAL(15, 2) NOT NULL,
  
  UNIQUE(facture_id, numero_ligne)
);

CREATE INDEX idx_lignes_facture_facture ON lignes_facture(facture_id);

-- ========================================
-- 14. PAIEMENTS
-- ========================================

CREATE TABLE paiements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_paiement VARCHAR(50) UNIQUE NOT NULL,
  
  -- Facture
  facture_id UUID REFERENCES factures_fournisseurs(id),
  numero_facture VARCHAR(100) NOT NULL,
  
  -- Fournisseur
  fournisseur_id UUID REFERENCES fournisseurs(id),
  nom_fournisseur VARCHAR(255) NOT NULL,
  
  -- Montant
  montant DECIMAL(15, 2) NOT NULL,
  devise VARCHAR(10) NOT NULL,
  
  -- Méthode
  methode_paiement VARCHAR(50) NOT NULL CHECK (methode_paiement IN (
    'virement_bancaire', 'mobile_money', 'especes', 'cheque', 'compensation'
  )),
  
  -- Détails méthode
  details_methode JSONB,
  
  -- Dates
  date_paiement DATE NOT NULL,
  date_valeur DATE,
  
  -- Statut
  statut VARCHAR(50) DEFAULT 'en_attente',
  
  -- Justificatif
  fichier_justificatif_url TEXT,
  
  -- Validation
  valide_par VARCHAR(255),
  valide_le TIMESTAMP,
  
  -- Comptabilité
  piece_comptable_ref VARCHAR(100),
  
  -- Notes
  notes TEXT,
  
  -- Utilisateur
  effectue_par UUID REFERENCES users(id),
  effectue_par_nom VARCHAR(255),
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paiements_numero ON paiements(numero_paiement);
CREATE INDEX idx_paiements_facture ON paiements(facture_id);
CREATE INDEX idx_paiements_fournisseur ON paiements(fournisseur_id);
CREATE INDEX idx_paiements_statut ON paiements(statut);
CREATE INDEX idx_paiements_date ON paiements(date_paiement DESC);

-- ========================================
-- 15. TRIGGERS
-- ========================================

-- Trigger mise à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demandes_achat_updated_at BEFORE UPDATE ON demandes_achat
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bons_commande_updated_at BEFORE UPDATE ON bons_commande
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON factures_fournisseurs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paiements_updated_at BEFORE UPDATE ON paiements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 16. VUES UTILES
-- ========================================

-- Vue DA avec montant total lignes
CREATE VIEW v_demandes_achat_resume AS
SELECT 
  da.id,
  da.numero_da,
  da.type_demande,
  da.objet,
  da.demandeur_nom,
  da.agence,
  da.statut,
  da.montant_total,
  da.devise,
  da.date_creation,
  da.date_soumission,
  COUNT(l.id) as nombre_lignes,
  da.bon_commande_ref
FROM demandes_achat da
LEFT JOIN lignes_demande_achat l ON l.demande_achat_id = da.id
GROUP BY da.id;

-- Vue stock valorisé
CREATE VIEW v_stock_valorise AS
SELECT 
  a.id,
  a.code_article,
  a.designation,
  a.categorie,
  a.stock_actuel,
  a.stock_disponible,
  a.unite,
  a.pmp_actuel,
  a.valeur_stock,
  CASE 
    WHEN a.stock_actuel <= a.stock_minimum THEN 'alerte_min'
    WHEN a.stock_maximum IS NOT NULL AND a.stock_actuel >= a.stock_maximum THEN 'alerte_max'
    WHEN a.stock_actuel < 0 THEN 'negatif'
    ELSE 'normal'
  END as etat_stock
FROM articles a
WHERE a.actif = true;

-- Vue factures impayées
CREATE VIEW v_factures_impayees AS
SELECT 
  f.id,
  f.numero_facture,
  f.numero_interne,
  f.nom_fournisseur,
  f.date_facture,
  f.date_echeance,
  f.montant_ttc,
  f.montant_paye,
  f.montant_restant,
  f.devise,
  f.statut,
  CASE 
    WHEN f.date_echeance < CURRENT_DATE THEN CURRENT_DATE - f.date_echeance
    ELSE 0
  END as jours_retard
FROM factures_fournisseurs f
WHERE f.montant_restant > 0
  AND f.statut != 'litige';

-- ========================================
-- FIN DU SCHÉMA
-- ========================================
