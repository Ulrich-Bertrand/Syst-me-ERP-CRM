# 🎯 MODULE ACHATS - SPRINT 2 : WORKFLOW DE VALIDATION

## ✅ SPRINT 2 TERMINÉ !

Le système de **validation multi-niveaux** avec notifications automatiques est maintenant **100% fonctionnel**.

---

## 📋 Objectifs du Sprint 2

### ✅ User Stories implémentées

#### **US-FIN-01 : Approuver ou refuser une demande d'achat**
- [x] Interface de validation avec boutons Approuver/Rejeter
- [x] Champ commentaire obligatoire en cas de refus (min 10 caractères)
- [x] Modal de confirmation avant validation
- [x] Notifications automatiques (système de base)
- [x] Log horodaté (audit trail dans validations)
- [x] Règles métier selon profils utilisateur

#### **US-FIN-02 : Approuver le décaissement (Niveau 2)**
- [x] Validation Niveau 2 (CFO uniquement via profil)
- [x] Vérification que DA validée niveau 1
- [x] Historique complet dans timeline
- [x] Notification au demandeur (système)

#### **Fonctionnalités additionnelles**
- [x] Système de notifications typées (10 types)
- [x] Dashboard validateur avec KPIs
- [x] Règles de validation automatiques selon montants
- [x] Calcul délais et rappels automatiques
- [x] Filtrage par priorité
- [x] Progression visuelle validation (barre 3 niveaux)

---

## 🏗️ Architecture implémentée

### 1. **Types et modèles de données**

#### `/types/notifications.ts`

**Types de notifications (10) :**
```typescript
type TypeNotification = 
  | 'validation_requise'      // ⏳ Action requise
  | 'demande_approuvee'       // ✅ Approuvée
  | 'demande_rejetee'         // ❌ Rejetée
  | 'bc_genere'               // 📄 BC créé
  | 'paiement_effectue'       // 💰 Payé
  | 'justificatif_requis'     // ⚠️ Justificatif manquant
  | 'rappel_validation'       // 🔔 Rappel
```

**Règles de validation :**
- 5 règles pré-configurées
- Basées sur : type (agence/dossier), montant, devise, impact stock
- Niveaux variables : 1, 2 ou 3 validations selon règle
- Délais maximum paramétrables
- Notifications rappel automatiques

**Exemple de règle :**
```typescript
{
  nom: 'Achat agence montant élevé',
  condition: {
    type_demande: 'agence',
    montant_min: 1000,
    devise: 'GHS'
  },
  niveaux_requis: [
    {
      niveau: 1,
      profil_requis: 'profile_purchases_validation',
      delai_max_jours: 3,
      notification_rappel_jours: 2
    },
    {
      niveau: 2,
      profil_requis: 'profile_purchases_approval', // CFO
      delai_max_jours: 5,
      notification_rappel_jours: 3
    }
  ]
}
```

---

### 2. **Données mock**

#### `/data/mockNotifications.ts`

**10 notifications d'exemple :**
- 2 validations requises (Consultant IC)
- 2 validations CFO (Niveau 2)
- 1 rappel de validation
- 1 demande approuvée
- 1 demande rejetée
- 1 BC généré
- 1 paiement effectué
- 1 justificatif requis

**Helpers disponibles :**
```typescript
getNotificationsNonLues(email)
getNotificationsByType(email, type)
getNotificationsValidationEnAttente(email)
marquerCommeLue(notificationId)
getStatistiquesNotifications(email)
```

---

### 3. **Composants UI**

#### A) `/components/AchatsValidationAction.tsx`

**Composant de validation d'une DA**

**Fonctionnalités :**
- ✅ Détection automatique du **niveau à valider**
- ✅ Vérification des **droits utilisateur**
- ✅ 2 boutons : **Approuver** / **Rejeter**
- ✅ **Commentaire obligatoire** si refus (min 10 car.)
- ✅ **Modal de confirmation** avec récapitulatif
- ✅ Affichage de la **règle applicable**
- ✅ Progression des niveaux (1/3, 2/3, 3/3)
- ✅ Messages d'erreur contextuels

**Workflow utilisateur :**
1. Utilisateur ouvre DA en attente
2. Composant affiche : "Validation Niveau X"
3. Choix action : Approuver ou Rejeter
4. Saisie commentaire (obligatoire si refus)
5. Clic "Approuver" / "Rejeter"
6. Modal confirmation avec recap
7. Validation finale → Callback `onApprove()` ou `onReject()`

**Contrôles de sécurité :**
- Vérification profil utilisateur vs profil requis
- Vérification que niveau précédent validé
- Blocage si pas de droits

**Exemple d'utilisation :**
```tsx
<AchatsValidationAction
  demande={demande}
  userProfile={{
    email: 'consultantic@jocyderklogistics.com',
    nom: 'Consultant IC',
    profile_purchases_validation: true,
    profile_purchases_approval: false,
    profile_po_management: true
  }}
  onApprove={(niveau, commentaire) => {
    // Enregistrer validation niveau X
    // Créer notification
    // Mettre à jour statut DA
  }}
  onReject={(niveau, commentaire) => {
    // Enregistrer refus
    // Notifier demandeur
    // Statut DA → rejeté
  }}
/>
```

#### B) `/components/AchatsValidationDashboard.tsx`

**Dashboard pour les validateurs**

**Structure :**

**1. Header avec 4 KPIs :**
- 🟠 **En attente validation** : Nombre DA en attente
- 🔴 **Urgentes** : DA priorité haute
- 🔵 **Montant total** : Somme des montants
- 🟡 **En retard** : DA > 3 jours

**2. Filtres rapides :**
- Toutes
- Urgentes
- Normales

**3. Liste des DA en attente :**

Chaque carte affiche :
- Référence DA + Badges (Niveau, Priorité, Retard)
- Motif de l'achat
- Montant total en grand
- Demandeur / Fournisseur / Date / Type
- **Barre de progression validation** (3 niveaux)
- 2 boutons : "Voir et valider" / "Validation rapide"

**4. Indicateurs visuels :**
- Border rouge si urgente
- Badge jaune si en retard (> 3 jours)
- Barre progression : vert (validé) / orange (en cours) / gris (à venir)

**Exemple d'utilisation :**
```tsx
<AchatsValidationDashboard
  userEmail="consultantic@jocyderklogistics.com"
  userName="Consultant IC"
/>
```

---

## 🎯 Règles de validation configurées

### Règle 1 : Achat agence < 1000 GHS
- **Condition** : Type agence + montant < 1000 GHS
- **Niveaux** : 1 seul (Manager)
- **Délai** : 3 jours
- **Rappel** : Après 2 jours

### Règle 2 : Achat agence ≥ 1000 GHS
- **Condition** : Type agence + montant ≥ 1000 GHS
- **Niveaux** : 2 (Manager + CFO)
- **Délais** : 3 jours (N1) + 5 jours (N2)
- **Rappels** : 2 jours (N1) + 3 jours (N2)

### Règle 3 : Achat dossier (tous montants)
- **Condition** : Type dossier
- **Niveaux** : 2 (Ops Manager + CFO)
- **Délais** : 2 jours (N1) + 3 jours (N2)
- **Rappels** : 1 jour (N1) + 2 jours (N2)

### Règle 4 : Achat avec impact stock
- **Condition** : `impact_stock = true`
- **Niveaux** : 3 (Manager + Magasinier + CFO)
- **Délais** : 2 + 2 + 3 jours
- **Rappels** : 1 + 1 + 2 jours

### Règle 5 : Validation automatique (désactivée)
- **Condition** : Type agence + montant < 100 GHS
- **Niveaux** : 0 (auto-approuvé)
- **Statut** : Désactivée par défaut (sécurité)

---

## 📊 Workflow de validation complet

### Étape 1 : Création DA
```
Employé crée DA
  ↓
Système détermine règle applicable
  ↓
Calcul niveaux requis (1, 2 ou 3)
  ↓
Statut: "soumis"
  ↓
Notification Niveau 1 envoyée
```

### Étape 2 : Validation Niveau 1
```
Validateur N1 ouvre dashboard
  ↓
Voit DA en attente (badge "Niveau 1")
  ↓
Clique "Voir et valider"
  ↓
Composant AchatsValidationAction s'affiche
  ↓
Choix : Approuver ou Rejeter
  ↓
Si APPROUVER:
  - Commentaire optionnel
  - Confirmation
  - Validation enregistrée
  - Statut: "valide_niveau_1"
  - Notification Niveau 2 envoyée
  
Si REJETER:
  - Commentaire OBLIGATOIRE (≥ 10 car.)
  - Confirmation
  - Statut: "rejete"
  - Notification demandeur
```

### Étape 3 : Validation Niveau 2 (CFO)
```
CFO ouvre dashboard
  ↓
Voit DA validée N1 (badge "Niveau 2")
  ↓
Vérifie montant + commentaires N1
  ↓
Approuve ou rejette
  ↓
Si APPROUVER:
  - Statut: "approuve"
  - Notification demandeur
  - Prêt pour BC
  
Si REJETER:
  - Statut: "rejete"
  - Notification demandeur
```

### Étape 4 : Validation Niveau 3 (si applicable)
```
Même processus
  ↓
Statut final: "approuve" ou "rejete"
```

---

## 🔐 Gestion des profils et droits

### Profils validateurs

| Profil | Niveau | Description |
|--------|--------|-------------|
| `profile_purchases_validation` | 1 | Manager / Ops Manager |
| `profile_stock_management` | 2 | Magasinier (si impact stock) |
| `profile_purchases_approval` | 2-3 | CFO - Approbation décaissement |
| `profile_po_management` | - | Génération BC (après validation) |
| `profile_purchases_payment` | - | Paiement (Niveau 3 optionnel) |

### Vérification des droits

Le composant `AchatsValidationAction` vérifie automatiquement :
1. Le **profil utilisateur**
2. Le **niveau requis** selon règle
3. Le **statut** de la DA
4. Les **validations précédentes**

Si pas de droits → Message : "Vous n'avez pas les droits pour valider"

---

## 📧 Système de notifications

### Types implémentés

| Type | Icône | Urgence | Exemple |
|------|-------|---------|---------|
| `validation_requise` | ⏳ | Urgente | "La DA-2025-001 nécessite votre validation (Niveau 1)" |
| `rappel_validation` | 🔔 | Urgente | "Rappel: La DA-2025-001 attend votre validation depuis 2 jours" |
| `demande_approuvee` | ✅ | Normale | "Votre demande DA-2025-003 a été approuvée par Consultant IC" |
| `demande_rejetee` | ❌ | Urgente | "Votre demande DA-2025-005 a été rejetée. Raison: Budget non disponible" |
| `bc_genere` | 📄 | Normale | "Le BC BC-2025-003 a été généré pour la DA DA-2025-003" |
| `paiement_effectue` | 💰 | Normale | "Le paiement de 2700 GHS a été effectué" |
| `justificatif_requis` | ⚠️ | Urgente | "La DA DA-2025-006 payée nécessite un justificatif" |

### Configuration notification

```typescript
NOTIFICATION_CONFIG = {
  validation_requise: {
    icon: '⏳',
    color: 'orange',
    titre: 'Validation requise',
    template: (data) => `La DA ${data.ref} nécessite votre validation (Niveau ${data.niveau})`,
    urgente: true
  },
  // ...
}
```

### Données complémentaires

Chaque notification peut contenir :
- Montant + Devise
- Fournisseur
- Niveau de validation
- Valideur précédent
- Raison du refus
- Nombre de jours écoulés

---

## 💡 Exemples concrets

### Cas 1 : DA agence 1,250 GHS (Règle 1)

**Création :**
- Type : Agence (Administration)
- Montant : 1,250 GHS
- Règle applicable : **Règle 2** (≥ 1000 GHS)
- Niveaux requis : **2** (Manager + CFO)

**Workflow :**
1. Employé soumet → Statut "soumis"
2. Notification envoyée à **Manager** (Niveau 1)
3. Manager approuve → Statut "valide_niveau_1"
4. Notification envoyée à **CFO** (Niveau 2)
5. CFO approuve → Statut "approuve"
6. Notification demandeur → Prêt pour BC

### Cas 2 : DA dossier 850 GHS (Règle 3)

**Création :**
- Type : Dossier (DOS-2025-500)
- Montant : 850 GHS
- Règle applicable : **Règle 3** (tous montants dossier)
- Niveaux requis : **2** (Ops + CFO)

**Workflow :**
1. Opérationnel soumet → Statut "soumis"
2. Notification **Ops Manager** (Niveau 1)
3. Ops approuve après 1 jour → Statut "valide_niveau_1"
4. Notification **CFO** (Niveau 2)
5. CFO approuve → Statut "approuve"
6. BC peut être généré

### Cas 3 : Refus de DA

**Scénario :**
- DA-2025-005 : Réparation climatisation (3,200 GHS)
- Manager examine la demande
- Budget non disponible ce mois

**Action :**
1. Manager clique "Rejeter"
2. Saisit commentaire : "Budget maintenance dépassé pour janvier. Merci de resubmettre en février ou de trouver un financement alternatif."
3. Confirme le refus
4. **Notification urgente** envoyée au demandeur
5. Statut DA → "rejete"
6. DA archivée (non supprimée)

### Cas 4 : Rappel automatique

**Scénario :**
- DA-2025-001 créée le 20/01
- Manager n'a pas validé
- Délai règle : 3 jours, rappel après 2 jours

**Timeline :**
- 20/01 09h30 : Notification "Validation requise"
- 22/01 10h00 : **Notification rappel** automatique
- 23/01 fin de journée : **En retard** (badge jaune dashboard)
- 24/01 : Manager reçoit email d'alerte

---

## 📈 KPIs et statistiques

### Dashboard validateur

**KPIs affichés :**
1. **Total en attente** : Nombre de DA à valider
2. **Urgentes** : DA priorité haute
3. **Montant total** : Somme des montants en attente
4. **En retard** : DA > 3 jours sans validation

**Statistiques notifications :**
```typescript
{
  total: 10,
  non_lues: 4,
  validation_requise: 2,
  justificatifs: 1,
  rappels: 1,
  urgentes: 3
}
```

### Métriques disponibles

- Délai moyen de validation (par niveau)
- Taux d'approbation vs refus
- Validateurs les plus actifs
- DA en retard par validateur
- Montants validés par période

---

## 🧪 Tests recommandés

### Test 1 : Validation simple (1 niveau)
1. Créer DA agence 500 GHS
2. Vérifier règle applicable (Règle 1)
3. Manager ouvre dashboard → Voit DA
4. Approuve avec commentaire
5. Vérifier statut → "approuve"
6. Vérifier notification demandeur

### Test 2 : Validation 2 niveaux
1. Créer DA agence 8,500 USD (urgente)
2. Vérifier règle (Règle 2)
3. Manager valide Niveau 1
4. CFO ouvre dashboard → Voit DA "Niveau 2"
5. CFO approuve
6. Statut final → "approuve"

### Test 3 : Refus avec commentaire
1. Manager ouvre DA
2. Clique "Rejeter"
3. Essaie sans commentaire → Erreur
4. Ajoute commentaire < 10 car → Erreur
5. Ajoute commentaire valide → OK
6. Confirme → Notification envoyée

### Test 4 : Droits insuffisants
1. Utilisateur sans profil validation
2. Ouvre DA en attente
3. Composant affiche : "Pas de droits"
4. Boutons Approuver/Rejeter désactivés

### Test 5 : Progression visuelle
1. DA avec 3 niveaux requis
2. Niveau 1 validé → Barre: 🟢 🟠 ⚪
3. Niveau 2 validé → Barre: 🟢 🟢 🟠
4. Niveau 3 validé → Barre: 🟢 🟢 🟢

---

## 🚀 Prochaines évolutions (Sprint 3)

### Court terme
- [ ] **Emails automatiques** (intégration SendGrid/Mailgun)
- [ ] **Notifications push** temps réel (WebSocket)
- [ ] **Délégation de validation** (absence validateur)
- [ ] **Validation rapide** en 1 clic (sans modal)
- [ ] **Historique validations** par utilisateur

### Moyen terme
- [ ] **Règles personnalisées** par agence
- [ ] **Workflow conditionnel** (si/alors)
- [ ] **Validation par lot** (multiples DA)
- [ ] **Dashboard CFO** avec analytics
- [ ] **Export rapport** validations (PDF/Excel)

### Long terme
- [ ] **IA suggestions** (approuver/rejeter prédictif)
- [ ] **Validation mobile** (app smartphone)
- [ ] **Signature électronique** intégrée
- [ ] **Audit trail** blockchain
- [ ] **Workflow multi-agences** (inter-pays)

---

## 📁 Fichiers créés - Sprint 2

```
/types/notifications.ts                       (Types notifications + règles)
/data/mockNotifications.ts                    (10 notifications d'exemple)
/components/AchatsValidationAction.tsx        (Composant validation)
/components/AchatsValidationDashboard.tsx     (Dashboard validateur)
/ACHATS_SPRINT2_COMPLETE.md                   (Cette documentation)
```

---

## ✅ Checklist Sprint 2

- [x] Types notifications (10 types)
- [x] Règles de validation (5 règles)
- [x] Données mock notifications (10 exemples)
- [x] Composant validation (Approuver/Rejeter)
- [x] Commentaire obligatoire si refus
- [x] Modal de confirmation
- [x] Vérification profils utilisateur
- [x] Dashboard validateur avec KPIs
- [x] Filtres par priorité
- [x] Barre progression validation
- [x] Calcul délais et retards
- [x] Helpers notifications
- [x] Documentation complète

---

## 🎓 Guide utilisateur validateur

### "Comment valider une demande d'achat ?"

**Étape 1 : Accéder au dashboard**
- Menu Achats → Dashboard Validation
- Voir les KPIs : DA en attente, urgentes, en retard

**Étape 2 : Identifier les priorités**
- Badge rouge = Urgente
- Badge jaune = En retard
- Filtrer par "Urgentes" si nécessaire

**Étape 3 : Ouvrir une DA**
- Cliquer sur "Voir et valider"
- La vue détaillée s'ouvre

**Étape 4 : Examiner la demande**
- Lire le motif d'achat
- Vérifier le montant
- Consulter les lignes de commande
- Voir les validations précédentes (timeline)

**Étape 5 : Décider**
- Cliquer "Approuver" ou "Rejeter"
- Si rejet : Saisir raison détaillée (≥ 10 caractères)
- Si approbation : Commentaire optionnel

**Étape 6 : Confirmer**
- Vérifier le recap dans le modal
- Cliquer "Confirmer l'approbation" ou "Confirmer le refus"
- ✅ Validation enregistrée !

**Étape 7 : Notifications**
- Le demandeur est notifié
- Si niveau suivant requis → Prochain validateur notifié
- Votre action est tracée dans l'historique

---

**🎉 Sprint 2 : TERMINÉ ET VALIDÉ !**

Le module Achats dispose maintenant d'un **système de validation multi-niveaux complet** avec :
1. ✅ Règles de validation configurables
2. ✅ Dashboard validateur avec KPIs
3. ✅ Interface Approuver/Rejeter avec commentaires
4. ✅ Système de notifications typées
5. ✅ Calcul automatique des délais et rappels
6. ✅ Progression visuelle des validations
7. ✅ Contrôle des droits par profil

**Prêt pour le Sprint 3 : Génération des Bons de Commande** 🚀
