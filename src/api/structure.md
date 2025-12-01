# 🔌 API MODULE ACHATS - ARCHITECTURE

## 📋 Vue d'ensemble

API REST complète pour le module Achats avec authentification, validation, et gestion des fichiers.

**Stack technique** :
- Node.js + Express
- TypeScript
- Validation (Zod)
- Authentification JWT
- Upload fichiers (Multer)
- Base de données (PostgreSQL/MongoDB)

---

## 🏗️ Structure du projet

```
/api/
├── /src/
│   ├── /routes/              # Routes endpoints
│   │   ├── demandes.routes.ts
│   │   ├── validations.routes.ts
│   │   ├── bons-commande.routes.ts
│   │   ├── factures.routes.ts
│   │   ├── paiements.routes.ts
│   │   ├── stock.routes.ts
│   │   └── reporting.routes.ts
│   │
│   ├── /controllers/         # Logique des routes
│   │   ├── demandes.controller.ts
│   │   ├── validations.controller.ts
│   │   ├── bons-commande.controller.ts
│   │   ├── factures.controller.ts
│   │   ├── paiements.controller.ts
│   │   ├── stock.controller.ts
│   │   └── reporting.controller.ts
│   │
│   ├── /services/            # Logique métier
│   │   ├── demandes.service.ts
│   │   ├── validations.service.ts
│   │   ├── bons-commande.service.ts
│   │   ├── factures.service.ts
│   │   ├── paiements.service.ts
│   │   ├── stock.service.ts
│   │   ├── controle-3-voies.service.ts
│   │   ├── pmp.service.ts
│   │   └── reporting.service.ts
│   │
│   ├── /models/              # Schémas base de données
│   │   ├── demande-achat.model.ts
│   │   ├── bon-commande.model.ts
│   │   ├── facture.model.ts
│   │   ├── paiement.model.ts
│   │   ├── article.model.ts
│   │   └── mouvement-stock.model.ts
│   │
│   ├── /validators/          # Validation requêtes
│   │   ├── demandes.validator.ts
│   │   ├── factures.validator.ts
│   │   └── paiements.validator.ts
│   │
│   ├── /middlewares/         # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── /utils/               # Utilitaires
│   │   ├── series.util.ts
│   │   ├── pmp.util.ts
│   │   ├── notifications.util.ts
│   │   └── exports.util.ts
│   │
│   ├── /config/              # Configuration
│   │   ├── database.ts
│   │   ├── auth.ts
│   │   └── upload.ts
│   │
│   └── app.ts                # Point d'entrée
│
├── /uploads/                 # Fichiers uploadés
├── /exports/                 # Rapports générés
├── package.json
└── tsconfig.json
```

---

## 🔗 Liste des endpoints

### 1. Demandes d'achat

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/demandes` | Liste des DA | ✓ |
| GET | `/api/demandes/:id` | Détail DA | ✓ |
| POST | `/api/demandes` | Créer DA | ✓ |
| PUT | `/api/demandes/:id` | Modifier DA | ✓ |
| DELETE | `/api/demandes/:id` | Supprimer DA | ✓ |
| POST | `/api/demandes/:id/submit` | Soumettre à validation | ✓ |
| GET | `/api/demandes/stats` | Statistiques DA | ✓ |

### 2. Validations

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/validations/pending` | DA en attente validation | ✓ |
| POST | `/api/validations/:daId/approve` | Approuver DA | ✓ |
| POST | `/api/validations/:daId/reject` | Rejeter DA | ✓ |
| GET | `/api/validations/history/:daId` | Historique validations | ✓ |
| GET | `/api/validations/stats` | Stats validations | ✓ |

### 3. Bons de commande

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/bons-commande` | Liste BC | ✓ |
| GET | `/api/bons-commande/:id` | Détail BC | ✓ |
| POST | `/api/bons-commande/generate/:daId` | Générer BC depuis DA | ✓ |
| PUT | `/api/bons-commande/:id` | Modifier BC | ✓ |
| POST | `/api/bons-commande/:id/send` | Envoyer au fournisseur | ✓ |
| POST | `/api/bons-commande/:id/confirm` | Confirmer par fournisseur | ✓ |
| POST | `/api/bons-commande/:id/receive` | Enregistrer réception | ✓ |
| GET | `/api/bons-commande/:id/pdf` | Télécharger PDF | ✓ |

### 4. Factures fournisseurs

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/factures` | Liste factures | ✓ |
| GET | `/api/factures/:id` | Détail facture | ✓ |
| POST | `/api/factures` | Créer facture | ✓ |
| POST | `/api/factures/:id/upload` | Upload PDF facture | ✓ |
| POST | `/api/factures/:id/controle-3-voies` | Contrôle 3 voies | ✓ |
| POST | `/api/factures/:id/validate` | Valider pour paiement | ✓ |
| GET | `/api/factures/unpaid` | Factures impayées | ✓ |

### 5. Paiements

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/paiements` | Liste paiements | ✓ |
| GET | `/api/paiements/:id` | Détail paiement | ✓ |
| POST | `/api/paiements` | Créer paiement | ✓ |
| POST | `/api/paiements/:id/upload-justificatif` | Upload justificatif | ✓ |
| POST | `/api/paiements/:id/validate` | Valider paiement | ✓ |
| GET | `/api/paiements/pending` | Paiements en attente | ✓ |

### 6. Stock

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/articles` | Liste articles | ✓ |
| GET | `/api/articles/:id` | Détail article | ✓ |
| POST | `/api/articles` | Créer article | ✓ |
| PUT | `/api/articles/:id` | Modifier article | ✓ |
| GET | `/api/articles/:id/mouvements` | Mouvements article | ✓ |
| GET | `/api/articles/alerts` | Alertes stock | ✓ |
| POST | `/api/mouvements` | Créer mouvement | ✓ |
| GET | `/api/mouvements` | Liste mouvements | ✓ |
| POST | `/api/inventaires` | Créer inventaire | ✓ |
| POST | `/api/inventaires/:id/validate` | Valider inventaire | ✓ |

### 7. Reporting

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/reporting/dashboard` | Dashboard complet | ✓ |
| GET | `/api/reporting/kpis` | KPIs globaux | ✓ |
| GET | `/api/reporting/fournisseur/:id` | Rapport fournisseur | ✓ |
| GET | `/api/reporting/budget` | Rapport budget | ✓ |
| GET | `/api/reporting/delais` | Rapport délais | ✓ |
| POST | `/api/reporting/export` | Générer export | ✓ |

### 8. Utilitaires

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/fournisseurs` | Liste fournisseurs | ✓ |
| GET | `/api/series` | Séries numérotation | ✓ |
| POST | `/api/upload` | Upload fichier | ✓ |
| GET | `/api/notifications` | Notifications user | ✓ |

---

## 🔐 Authentification

Utilisation JWT (JSON Web Token) :

```typescript
// Headers requis
Authorization: Bearer <token>

// Payload token
{
  userId: string;
  email: string;
  name: string;
  agence: string;
  profiles: {
    profile_purchases_create: boolean;
    profile_purchases_validate_level_1: boolean;
    profile_purchases_validate_level_2: boolean;
    profile_purchases_validate_level_3: boolean;
    profile_purchases_payment: boolean;
    profile_stock_manage: boolean;
  };
}
```

---

## 📝 Format des réponses

### Succès
```json
{
  "success": true,
  "data": {...},
  "message": "Opération réussie"
}
```

### Erreur
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données invalides",
    "details": [
      {
        "field": "montant",
        "message": "Montant requis"
      }
    ]
  }
}
```

### Liste paginée
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 🔄 Codes HTTP

| Code | Description |
|------|-------------|
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 204 | No Content - Suppression réussie |
| 400 | Bad Request - Validation échouée |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Pas les droits |
| 404 | Not Found - Ressource inexistante |
| 409 | Conflict - Conflit (ex: numéro existe) |
| 500 | Internal Server Error - Erreur serveur |

---

## 📤 Upload de fichiers

Endpoints supportant upload :
- `/api/factures/:id/upload` (PDF facture)
- `/api/paiements/:id/upload-justificatif` (Justificatif)
- `/api/upload` (Fichier générique)

Format multipart/form-data :
```typescript
Content-Type: multipart/form-data

file: <binary>
metadata: {
  type: 'facture' | 'justificatif' | 'autre',
  description?: string
}
```

---

## 🔔 Webhooks & Events

Events émis par le système :

```typescript
// DA soumise
{
  event: 'demande.submitted',
  data: { daId, demandeur, montant }
}

// DA validée
{
  event: 'demande.validated',
  data: { daId, valideur, niveau }
}

// BC généré
{
  event: 'bon-commande.generated',
  data: { bcId, daId, montant }
}

// Facture avec écart
{
  event: 'facture.ecart-detecte',
  data: { factureId, ecarts, gravite }
}

// Paiement effectué
{
  event: 'paiement.effectue',
  data: { paiementId, factureId, montant }
}

// Alerte stock
{
  event: 'stock.alerte',
  data: { articleId, type, gravite }
}
```

---

## 📊 Paramètres de requête courants

### Filtres
```
?agence=GHANA
?statut=validee
?fournisseur=FRN-001
?date_debut=2025-01-01
?date_fin=2025-12-31
?type=operationnel
```

### Tri
```
?sort=date_creation
?order=desc
```

### Pagination
```
?page=1
?limit=20
```

### Recherche
```
?search=laptop
?search_fields=designation,reference
```

---

## 🛡️ Sécurité

### Rate limiting
- 100 requêtes/minute par utilisateur
- 1000 requêtes/heure par IP

### CORS
- Domaines autorisés configurables
- Credentials autorisés

### Validation
- Tous les inputs validés avec Zod
- Sanitization des données
- Protection XSS/SQL injection

### Fichiers
- Types autorisés : PDF, JPG, PNG
- Taille max : 10 MB
- Scan antivirus (optionnel)

---

## 📈 Monitoring & Logs

### Logs
```typescript
{
  timestamp: '2025-02-08T10:30:00Z',
  level: 'info' | 'warn' | 'error',
  method: 'POST',
  endpoint: '/api/demandes',
  userId: 'USER-001',
  duration: 125, // ms
  status: 201,
  message: 'DA créée avec succès'
}
```

### Métriques
- Temps de réponse moyen
- Taux d'erreur
- Endpoints les plus utilisés
- Utilisateurs actifs

---

Cette architecture API est prête à être implémentée. Voulez-vous que je code les fichiers principaux ?
