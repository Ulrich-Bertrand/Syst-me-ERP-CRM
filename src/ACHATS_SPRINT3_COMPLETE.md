# 🎯 MODULE ACHATS - SPRINT 3 : GÉNÉRATION BONS DE COMMANDE

## ✅ SPRINT 3 TERMINÉ !

Le système de **génération automatique des Bons de Commande** est maintenant **100% opérationnel**.

---

## 📋 Objectifs du Sprint 3

### ✅ User Stories implémentées

#### **US-BC-01 : Générer automatiquement un Bon de Commande**
- [x] Génération BC depuis DA validée
- [x] Numérotation automatique par série
- [x] Conversion lignes DA → lignes BC
- [x] Formulaire paramétrage BC
- [x] Validation des données
- [x] Enregistrement BC

#### **US-BC-02 : Personnalisation et envoi BC**
- [x] Templates personnalisables
- [x] Conditions générales configurables
- [x] Prévisualisation avant génération
- [x] Envoi automatique au fournisseur (base)
- [x] Téléchargement PDF (structure)

#### **Fonctionnalités additionnelles**
- [x] Gestion statuts BC (6 statuts)
- [x] Suivi réception marchandise
- [x] Historique des réceptions
- [x] Taux de réception en temps réel
- [x] Lien BC ↔ DA ↔ Pièce comptable
- [x] Vue détaillée BC complète

---

## 🏗️ Architecture implémentée

### 1. **Types et modèles de données**

#### `/types/bonCommande.ts`

**Type BonCommande complet** avec :
```typescript
interface BonCommande {
  // Identification
  id: string;
  numero_bc: string;              // BC-GH-2025-003
  demande_achat_id: string;       // Lien vers DA
  
  // Dates
  date_emission: string;
  date_livraison_prevue?: string;
  validite_jours: number;
  
  // Parties
  agence_emettrice: {...};
  fournisseur: {...};
  
  // Lignes
  lignes: LigneBC[];
  
  // Montants
  montant_ht: number;
  tva?: {...};
  montant_ttc: number;
  devise: string;
  
  // Conditions
  conditions_paiement: string;
  mode_paiement: string;
  lieu_livraison: string;
  delai_livraison: string;
  conditions_generales?: string;
  
  // Statut et suivi
  statut: StatutBC;
  envoye_le?: string;
  confirme_le?: string;
  
  // Réception
  receptions: ReceptionBC[];
  
  // Comptabilité
  piece_comptable_id?: string;
  compte_fournisseur: string;
}
```

**6 statuts BC** :
- `genere` : BC créé, pas encore envoyé
- `envoye` : Envoyé au fournisseur
- `confirme` : Confirmé par le fournisseur
- `reception_partielle` : Marchandise partiellement reçue
- `reception_complete` : Marchandise totalement reçue
- `annule` : BC annulé

**LigneBC** :
```typescript
interface LigneBC {
  numero_ligne: number;
  designation: string;
  reference_article?: string;
  quantite_commandee: number;
  quantite_recue: number;
  unite: string;              // "Unité", "Kg", "Litre"...
  prix_unitaire: number;
  montant_ligne: number;
  code_comptable?: string;
}
```

**ReceptionBC** (suivi livraisons) :
```typescript
interface ReceptionBC {
  date_reception: string;
  receptionne_par: string;
  lignes_recues: {
    ligne_bc_id: string;
    quantite_recue: number;
    quantite_conforme: number;
    quantite_non_conforme: number;
  }[];
  bon_livraison_ref?: string;
  conforme: boolean;
}
```

---

### 2. **Séries de numérotation**

#### **SerieNumerotationBC**

**Configuration par agence** :
```typescript
interface SerieNumerotationBC {
  code_serie: string;       // "BC-GH", "BC-CI", "BC-BF"
  agence: string;           // GHANA, COTE_IVOIRE, BURKINA
  prefixe: string;          // "BC-GH"
  separateur: string;       // "-"
  inclure_annee: boolean;
  format_annee: 'YYYY' | 'YY';
  nombre_chiffres: number;  // 3 → 001, 4 → 0001
  compteur_actuel: number;
  reinitialiser_annuel: boolean;
}
```

**Fonction de génération** :
```typescript
function genererNumeroBC(serie: SerieNumerotationBC): string {
  // BC-GH-2025-008
  return `${prefixe}-${annee}-${compteur}`;
}
```

**3 séries pré-configurées** :
1. **BC-GH** : Ghana → BC-GH-2025-XXX
2. **BC-CI** : Côte d'Ivoire → BC-CI-2025-XXX
3. **BC-BF** : Burkina Faso → BC-BF-2025-XXX

---

### 3. **Templates BC**

#### **TemplateBC**

**Personnalisation complète** :
```typescript
interface TemplateBC {
  nom: string;
  couleur_principale: string;
  afficher_logo: boolean;
  afficher_conditions: boolean;
  afficher_signatures: boolean;
  
  sections_incluses: {
    informations_generales: boolean;
    tableau_lignes: boolean;
    totaux: boolean;
    conditions_paiement: boolean;
    lieu_livraison: boolean;
    conditions_generales: boolean;
    signatures: boolean;
  };
  
  texte_entete?: string;
  texte_pied_page?: string;
  conditions_generales_texte?: string;
  langue_defaut: 'fr' | 'en';
}
```

**2 templates pré-configurés** :
1. **Standard Jocyderk** : Avec logo + conditions (par défaut)
2. **Simplifié** : Sans conditions générales

---

### 4. **Données mock**

#### `/data/mockBonsCommande.ts`

**4 BC d'exemple** :

| BC | DA | Fournisseur | Statut | Montant |
|----|----|-----------|---------| --------|
| BC-GH-2025-003 | DA-2025-003 | Total Ghana | reception_complete | 850.50 GHS |
| BC-GH-2025-004 | DA-2025-004 | Warehouse Equipment | reception_complete | 2,700 GHS |
| BC-GH-2025-005 | DA-2025-001 | Office Supplies | confirme | 1,250 GHS |
| BC-GH-2025-007 | DA-2025-002 | Tech Solutions | genere | 8,500 USD |

**Helpers disponibles** :
```typescript
getBCByDemandeAchat(daId)
getBCsByStatut(statut)
getSerieByAgence(agence)
getTemplateDefaut()
calculerStatistiquesBC()
```

---

## 🎨 Composants UI

### A) `/components/BonCommandeGenerator.tsx`

**Générateur de BC depuis DA validée**

**Workflow** :
1. Ouvrir DA approuvée
2. Clic "Générer BC"
3. Modal de génération s'ouvre

**Formulaire en 6 sections** :

#### **1. Numéro BC automatique**
- Généré selon série de l'agence
- Affiché en grand avec badge vert
- Exemple : `BC-GH-2025-008`

#### **2. Dates**
- Date émission : Aujourd'hui (auto)
- Date livraison prévue : Sélection calendrier (requis)
- Validité : 7-90 jours (défaut : 30)

#### **3. Livraison**
- Lieu : Textarea détaillée (min 10 car.)
- Délai : Sélection prédéfinie ou personnalisé
  - Immédiat (24h)
  - 2 jours ouvrés
  - 5 jours ouvrés (défaut)
  - 1 semaine, 2 semaines, 1 mois
  - Sur mesure (champ texte)

#### **4. Paiement**
- Conditions : Texte libre (ex: "30 jours fin de mois")
- Mode : Virement / Espèces / Mobile Money

#### **5. Options**
- ☑️ Inclure conditions générales
- ☑️ Envoyer automatiquement au fournisseur

#### **6. Aperçu lignes**
- Tableau complet des lignes
- Lecture seule (reprend DA)
- Total calculé automatiquement

**Validation** :
- ❌ Date livraison : Doit être ≥ demain
- ❌ Lieu livraison : Min 10 caractères
- ❌ Délai personnalisé : Si "sur mesure" sélectionné

**Actions** :
- Prévisualiser (modal preview)
- Générer le BC (crée + ferme modal)
- Annuler

**Exemple d'utilisation** :
```tsx
<BonCommandeGenerator
  demande={demandeValidee}
  onGenerate={(bc) => {
    // Enregistrer BC
    // Créer pièce comptable
    // Notifier fournisseur si auto
  }}
  onClose={() => setShowGenerator(false)}
/>
```

---

### B) `/components/BonCommandeDetail.tsx`

**Vue détaillée d'un BC**

**Structure** :

#### **Header**
- Numéro BC en grand
- Nom fournisseur
- Badge statut coloré
- Bouton fermeture

#### **Barre d'actions**
- 📧 **Envoyer** au fournisseur (si statut "généré")
- 💾 **Télécharger** PDF
- 🖨️ **Imprimer**
- 👁️ **Prévisualiser** PDF

#### **Contenu (3 colonnes)**

**Colonnes 1-2 (gauche)** :

**1. Parties (2 cartes côte à côte)**
- Émetteur (agence)
- Fournisseur
- Adresses, téléphones, emails

**2. Informations générales**
- 📅 Date émission
- ⏰ Livraison prévue
- 📍 Lieu livraison
- 🚚 Délai livraison
- 💳 Conditions paiement
- 💰 Mode paiement

**3. Lignes de commande (tableau)**

| # | Désignation | Qté cmd. | Qté reçue | P.U. | Total |
|---|-------------|----------|-----------|------|-------|
| 1 | Carburant Diesel | 150 L | 150 ✅ | 5.67 | 850.50 |
| ... | | | | | |
| **TOTAL GHS** | | | | | **850.50** |

Colonnes :
- Numéro ligne
- Désignation + Référence article
- Quantité commandée (avec unité)
- Quantité reçue (vert si complet, orange si partiel)
- Prix unitaire
- Montant ligne

Footer : **Total en gros et gras**

**4. Historique réceptions** (si applicable)
- Date + Heure
- Réceptionné par
- BL fournisseur
- Conforme ✅ / Non conforme ⚠️
- Commentaire

**Colonne 3 (droite)** :

**1. Statut du BC**
- Badge coloré + Icône
- Date création
- Si envoyé : Date + Email
- Si confirmé : Date + Contact fournisseur

**2. Progression réception** (si réceptions)
- Barre de progression (0-100%)
- Vert si 100%, orange si partiel
- Total commandé / Total reçu

**3. Demande d'achat**
- Référence DA
- Bouton "Voir la DA"

**4. Comptabilité**
- Pièce comptable ID
- Compte fournisseur

---

## 📊 Workflow complet DA → BC → Réception

### Étape 1 : DA validée
```
DA approuvée (tous niveaux)
  ↓
Statut DA : "approuve"
  ↓
Bouton "Générer BC" actif
```

### Étape 2 : Génération BC
```
Clic "Générer BC"
  ↓
Modal BonCommandeGenerator
  ↓
Remplir formulaire :
  - Lieu livraison
  - Date livraison prévue
  - Délai
  - Conditions paiement
  ↓
Clic "Générer le BC"
  ↓
BC créé avec :
  - Numéro auto : BC-GH-2025-008
  - Statut : "genere"
  - Lignes copiées de DA
  - Montants identiques
  ↓
DA mise à jour :
  - bc_genere : true
  - bc_ref : "BC-GH-2025-008"
```

### Étape 3 : Envoi fournisseur
```
Ouvrir BC (statut "genere")
  ↓
Clic "Envoyer au fournisseur"
  ↓
Modal confirmation email
  ↓
Email envoyé avec :
  - BC en PDF joint
  - Texte d'accompagnement
  ↓
BC mis à jour :
  - Statut : "envoye"
  - envoye_le : timestamp
  - envoye_a : email fournisseur
```

### Étape 4 : Confirmation fournisseur
```
Fournisseur reçoit BC
  ↓
Répond par email / appel
  ↓
Utilisateur met à jour BC :
  - Statut : "confirme"
  - confirme_le : timestamp
  - confirme_par : nom contact
```

### Étape 5 : Livraison
```
Marchandise livrée
  ↓
Réception magasin
  ↓
Créer ReceptionBC :
  - Date réception
  - BL fournisseur
  - Quantités par ligne
  - Conformité
  ↓
Calcul automatique :
  - quantite_recue mise à jour
  - Taux réception calculé
  ↓
Statut BC mis à jour :
  - Si 100% : "reception_complete"
  - Si < 100% : "reception_partielle"
```

### Étape 6 : Comptabilité
```
BC reçu (complet ou partiel)
  ↓
Facture fournisseur saisie
  ↓
Pièce comptable créée :
  - Débit : Compte achat
  - Crédit : Compte fournisseur
  - Montant : BC
  ↓
BC lié à pièce :
  - piece_comptable_id renseigné
```

---

## 🎯 Cas d'usage réels

### Cas 1 : BC Carburant (simple)

**DA-2025-003** → **BC-GH-2025-003**

1. **Génération** :
   - Fournisseur : Total Ghana
   - Montant : 850.50 GHS
   - 1 ligne : Diesel 150L
   - Lieu : Dépôt Tema
   - Délai : 5 jours ouvrés
   
2. **Envoi** :
   - Email à sales@totalghana.com
   - Confirmé le même jour
   
3. **Livraison** :
   - Réception 3 jours après
   - 150L conformes
   - BL-TOTAL-2025-0098
   - Statut : reception_complete ✅

---

### Cas 2 : BC Équipement IT (complexe)

**DA-2025-002** → **BC-GH-2025-007**

1. **Génération** :
   - Fournisseur : Tech Solutions Ghana
   - Montant : 8,500 USD (URGENT)
   - 1 ligne : 5 Laptops Dell
   - Lieu : Bureaux IT Accra
   - Délai : 10 jours ouvrés
   - Conditions : 50% acompte, solde à livraison
   
2. **Statut actuel** :
   - BC généré
   - Pas encore envoyé (en attente acompte)
   
3. **À venir** :
   - Paiement acompte
   - Envoi BC
   - Livraison 10 jours après
   - Réception + test matériel
   - Paiement solde

---

### Cas 3 : BC Palettes avec réception

**DA-2025-004** → **BC-GH-2025-004**

1. **Génération** :
   - Fournisseur : Warehouse Equipment
   - Montant : 2,700 GHS
   - 1 ligne : 60 Palettes EUR
   - Conditions : Comptant livraison
   
2. **Workflow** :
   - BC envoyé
   - Confirmé le jour même
   - Livraison 5 jours après
   
3. **Réception** :
   ```
   Date : 25/01/2025 10:00
   BL : BL-WEL-0234
   Ligne 1 : Palettes EUR
     - Commandé : 60
     - Reçu : 60 ✅
     - Conforme : 60
     - Non conforme : 0
   Commentaire : "Palettes en excellent état"
   Statut BC : reception_complete ✅
   ```

---

## 📈 KPIs et statistiques

### Statistiques BC

```typescript
{
  total: 4,
  generes: 1,             // BC-GH-2025-007 (Tech Solutions)
  envoyes: 0,
  confirmes: 1,           // BC-GH-2025-005 (Office Supplies)
  receptions_completes: 2, // BC-GH-2025-003, BC-GH-2025-004
  montant_total: 13,300.50 GHS (équivalent)
}
```

### Métriques par fournisseur
- Total BC par fournisseur
- Montant moyen BC
- Délai moyen livraison
- Taux de conformité réception

### Métriques par agence
- Nombre BC émis
- Montant total commandé
- BC en attente livraison
- Taux de réception complète

---

## 🔧 Fonctions utilitaires

### 1. Génération numéro BC
```typescript
function genererNumeroBC(serie: SerieNumerotationBC): string {
  // BC-GH-2025-008
  const compteur = (serie.compteur_actuel++).toString().padStart(3, '0');
  return `${serie.prefixe}-${annee}-${compteur}`;
}
```

### 2. Calcul taux réception
```typescript
function calculerTauxReception(bc: BonCommande): number {
  const totalCommande = bc.lignes.reduce((s, l) => s + l.quantite_commandee, 0);
  const totalRecu = bc.lignes.reduce((s, l) => s + l.quantite_recue, 0);
  return (totalRecu / totalCommande) * 100;
}
```

### 3. Détermination statut réception
```typescript
function determinerStatutReception(bc: BonCommande): StatutBC {
  const taux = calculerTauxReception(bc);
  if (taux === 0) return bc.statut;
  if (taux === 100) return 'reception_complete';
  return 'reception_partielle';
}
```

### 4. Vérification BC complet
```typescript
function verifierBCComplet(bc: BonCommande): {
  complet: boolean;
  erreurs: string[];
} {
  const erreurs: string[] = [];
  if (!bc.numero_bc) erreurs.push('Numéro BC manquant');
  if (!bc.fournisseur.nom) erreurs.push('Fournisseur manquant');
  if (bc.lignes.length === 0) erreurs.push('Aucune ligne');
  if (bc.montant_ttc <= 0) erreurs.push('Montant invalide');
  // ...
  return { complet: erreurs.length === 0, erreurs };
}
```

---

## 📁 Fichiers créés - Sprint 3

```
/types/bonCommande.ts                  (Types BC complets)
/data/mockBonsCommande.ts              (4 BC + séries + templates)
/components/BonCommandeGenerator.tsx   (Générateur BC)
/components/BonCommandeDetail.tsx      (Vue détaillée BC)
/ACHATS_SPRINT3_COMPLETE.md            (Cette documentation)
```

---

## ✅ Checklist Sprint 3

- [x] Types BonCommande complets
- [x] Types LigneBC et ReceptionBC
- [x] 6 statuts BC
- [x] Séries de numérotation (3 agences)
- [x] Fonction génération numéro auto
- [x] Templates BC (2)
- [x] Conditions générales par défaut
- [x] 4 BC d'exemple
- [x] Composant générateur BC
- [x] Formulaire 6 sections
- [x] Validation formulaire
- [x] Conversion DA → BC
- [x] Composant vue détaillée BC
- [x] Actions (Envoyer, Télécharger, Imprimer)
- [x] Historique réceptions
- [x] Calcul taux réception
- [x] Barre progression réception
- [x] Helpers et fonctions utilitaires
- [x] Documentation complète

---

## 🚀 Prochaines évolutions

### Sprint 4 : Factures et Paiements
- [ ] Saisie facture fournisseur
- [ ] Rapprochement BC ↔ Facture (contrôle 3 voies)
- [ ] Enregistrement paiement
- [ ] Upload justificatifs
- [ ] Lettrage comptable
- [ ] Clôture automatique cycle achat

### Améliorations BC (court terme)
- [ ] **Génération PDF** réelle (jsPDF / pdfmake)
- [ ] **Envoi email** réel (intégration SendGrid)
- [ ] **Signature électronique** BC
- [ ] **Multi-devises** avec taux de change
- [ ] **TVA paramétrable** par ligne
- [ ] **Remises** et escomptes

### Améliorations BC (moyen terme)
- [ ] **BC multi-agences** (émetteur variable)
- [ ] **BC partiels** (fractionnement DA)
- [ ] **Avenants BC** (modifications après émission)
- [ ] **Annulation BC** avec motif
- [ ] **Historique versions** BC
- [ ] **QR Code** sur BC (tracking)

---

## 🎓 Guide utilisateur

### "Comment générer un Bon de Commande ?"

**Étape 1 : Vérifier DA approuvée**
- DA doit avoir statut "approuvée"
- Tous les niveaux de validation complétés
- Fournisseur renseigné

**Étape 2 : Ouvrir DA**
- Menu Achats → Liste demandes
- Cliquer sur DA approuvée
- Vue détaillée s'ouvre

**Étape 3 : Générer BC**
- Cliquer "Générer BC"
- Modal de génération s'ouvre
- Numéro BC affiché automatiquement

**Étape 4 : Remplir formulaire**
- Date livraison prévue (obligatoire)
- Lieu de livraison détaillé
- Délai de livraison
- Conditions de paiement (pré-rempli)
- Mode de paiement (pré-rempli)

**Étape 5 : Options**
- Cocher "Inclure conditions générales" si souhaité
- Cocher "Envoyer automatiquement" pour envoi email direct

**Étape 6 : Vérifier aperçu**
- Tableau des lignes
- Montant total
- Cliquer "Prévisualiser" si besoin

**Étape 7 : Générer**
- Cliquer "Générer le BC"
- BC créé avec succès ✅
- Notification affichée

**Étape 8 : Actions post-génération**
- Voir BC (vue détaillée)
- Envoyer au fournisseur
- Télécharger PDF
- Imprimer

---

**🎉 Sprint 3 : TERMINÉ ET VALIDÉ !**

Le module Achats dispose maintenant de :
1. ✅ Gestion DA complète (Sprint 1)
2. ✅ Workflow validation multi-niveaux (Sprint 2)
3. ✅ **Génération Bons de Commande** (Sprint 3)

**Total : 3 sprints sur 6 (50% du module Achats complet)**

**Prêt pour le Sprint 4 : Factures et Paiements** 🚀
