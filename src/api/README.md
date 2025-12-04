# 🚀 JOCYDERK ERP/CRM - API Backend

API REST complète pour le système ERP/CRM JOCYDERK

## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Structure](#structure)
- [Endpoints](#endpoints)
- [Authentification](#authentification)
- [Permissions](#permissions)

---

## 🔧 Installation

```bash
cd api
npm install
```

## ⚙️ Configuration

1. Copier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

2. Modifier `.env` avec vos paramètres :

```env
# Server
PORT=4000
NODE_ENV=development

# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jocyderk_erp
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=votre_secret_jwt_unique
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000
```

3. Initialiser la base de données :

```bash
npm run db:init
npm run db:seed
```

---

## 🚀 Lancement

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

L'API sera accessible sur **http://localhost:4000**

---

## 📁 Structure

```
/api
├── server.js                 # Point d'entrée
├── package.json              # Dépendances
├── .env.example              # Configuration exemple
│
├── /src
│   ├── /config
│   │   └── database.js       # Configuration PostgreSQL
│   │
│   ├── /middlewares
│   │   ├── auth.js           # Authentification JWT
│   │   ├── permissions.js    # Vérification permissions
│   │   ├── validation.js     # Validation Zod
│   │   ├── upload.js         # Upload fichiers
│   │   └── errorHandler.js   # Gestion erreurs
│   │
│   ├── /validators
│   │   ├── auth.validator.js
│   │   └── demandes.validator.js
│   │
│   ├── /services
│   │   ├── auth.service.js
│   │   ├── demandes.service.js
│   │   └── validations.service.js
│   │
│   ├── /controllers
│   │   ├── auth.controller.js
│   │   ├── demandes.controller.js
│   │   └── validations.controller.js
│   │
│   └── /routes
│       ├── auth.routes.js
│       ├── demandes.routes.js
│       ├── validations.routes.js
│       ├── bons-commande.routes.js
│       ├── factures.routes.js
│       ├── paiements.routes.js
│       ├── fournisseurs.routes.js
│       ├── articles.routes.js
│       ├── stock.routes.js
│       ├── dashboard.routes.js
│       └── utilisateurs.routes.js
│
└── /database
    ├── init-db.sql           # Schema database
    └── seed-data.sql         # Données test
```

---

## 🔗 Endpoints

### **Authentification** (`/api/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/login` | Connexion | ❌ |
| GET | `/profile` | Profil user | ✅ |
| PUT | `/profile` | Mise à jour profil | ✅ |
| POST | `/change-password` | Changer mot de passe | ✅ |

### **Demandes d'achat** (`/api/demandes`)

| Méthode | Endpoint | Description | Profil requis |
|---------|----------|-------------|---------------|
| GET | `/` | Liste demandes | ✅ Auth |
| GET | `/mes-demandes` | Mes demandes | ✅ Auth |
| GET | `/:id` | Détail demande | ✅ Auth |
| POST | `/` | Créer demande | `profile_purchases_create` |
| PUT | `/:id` | Modifier demande | `profile_purchases_create` |
| DELETE | `/:id` | Supprimer demande | `profile_purchases_create` |
| POST | `/:id/submit` | Soumettre validation | `profile_purchases_create` |

### **Validations** (`/api/validations`)

| Méthode | Endpoint | Description | Profil requis |
|---------|----------|-------------|---------------|
| GET | `/demandes` | Demandes à valider | Profil validateur |
| GET | `/stats` | Statistiques validations | Profil validateur |
| POST | `/:demandeId/valider` | Valider demande | Profil validateur |
| POST | `/:demandeId/rejeter` | Rejeter demande | Profil validateur |
| GET | `/:demandeId/historique` | Historique validations | ✅ Auth |

### **Dashboard** (`/api/dashboard`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/stats` | Statistiques dashboard | ✅ |
| GET | `/demandes-recentes` | Demandes récentes | ✅ |
| GET | `/activites-recentes` | Activités récentes | ✅ |

### **Autres modules**

- **Bons de commande** : `/api/bons-commande` (À implémenter)
- **Réceptions** : `/api/receptions` (À implémenter)
- **Factures** : `/api/factures` (À implémenter)
- **Paiements** : `/api/paiements` (À implémenter)
- **Fournisseurs** : `/api/fournisseurs` (À implémenter)
- **Articles** : `/api/articles` (À implémenter)
- **Stock** : `/api/stock` (À implémenter)
- **Utilisateurs** : `/api/utilisateurs` (Admin uniquement)

---

## 🔐 Authentification

### **1. Login**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "consultantic@jocyderklogistics.com",
  "password": "password123"
}
```

**Réponse** :
```json
{
  "user": {
    "id": 1,
    "email": "consultantic@jocyderklogistics.com",
    "nom": "DOE",
    "prenom": "John",
    "agence": "GHANA",
    "is_admin": true,
    "profile_purchases_create": true,
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **2. Utiliser le token**

```http
GET /api/demandes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🛡️ Permissions

### **Profils disponibles**

| Profil | Description |
|--------|-------------|
| `is_admin` | Administrateur (tous accès) |
| `profile_purchases_create` | Créer demandes d'achat |
| `profile_purchases_validate_level_1` | Valider niveau 1 |
| `profile_purchases_validate_level_2` | Valider niveau 2 |
| `profile_purchases_validate_level_3` | Valider niveau 3 |
| `profile_purchases_manage_po` | Gérer bons de commande |
| `profile_purchases_manage_invoices` | Gérer factures |
| `profile_purchases_manage_payments` | Gérer paiements |
| `profile_stock_manage` | Gérer stock |
| `profile_stock_view` | Voir stock |

### **Middlewares**

```javascript
// Authentification requise
authenticateJWT

// Admin requis
requireAdmin

// Profil spécifique requis
requireProfile('profile_purchases_create')

// Au moins un profil requis
requireAnyProfile(['profile_purchases_validate_level_1', 'profile_purchases_validate_level_2'])

// Tous les profils requis
requireAllProfiles(['profile_stock_manage', 'profile_finance_view'])
```

---

## 📝 Exemples d'utilisation

### **Créer une demande d'achat**

```http
POST /api/demandes
Authorization: Bearer <token>
Content-Type: application/json

{
  "agence": "GHANA",
  "type": "NORMALE",
  "objet": "Fournitures bureau",
  "justification": "Renouvellement stock bureau Accra",
  "date_besoin": "2025-12-15",
  "lignes": [
    {
      "designation": "Ramettes papier A4",
      "quantite": 50,
      "unite": "Ramette",
      "prix_unitaire_estime": 5.50,
      "description": "Papier blanc 80g"
    },
    {
      "designation": "Stylos bille bleu",
      "quantite": 100,
      "unite": "Pièce",
      "prix_unitaire_estime": 0.50
    }
  ]
}
```

**Réponse** :
```json
{
  "message": "Demande créée avec succès",
  "data": {
    "id": 123,
    "reference": "DA-2025-001",
    "agence": "GHANA",
    "statut": "brouillon",
    "montant_total_estime": 325.00,
    ...
  }
}
```

### **Valider une demande**

```http
POST /api/validations/123/valider
Authorization: Bearer <token>
Content-Type: application/json

{
  "commentaire": "Approuvé pour achat"
}
```

### **Obtenir demandes à valider**

```http
GET /api/validations/demandes?agence=GHANA&limit=20
Authorization: Bearer <token>
```

---

## 🐛 Gestion des erreurs

### **Format réponse erreur**

```json
{
  "error": "Message d'erreur",
  "details": { ... }
}
```

### **Codes HTTP**

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation)
- `401` - Unauthorized (token manquant/invalide)
- `403` - Forbidden (permissions insuffisantes)
- `404` - Not Found
- `409` - Conflict (ressource existe déjà)
- `500` - Internal Server Error

---

## 🧪 Tests

```bash
# TODO: Ajouter tests
npm test
```

---

## 📊 Performance

- **Connection pooling** : 20 connexions PostgreSQL max
- **Rate limiting** : 100 requêtes / 15 minutes par IP
- **Compression** : gzip activée
- **CORS** : Configuré pour frontend

---

## 🔒 Sécurité

- ✅ Helmet.js (headers sécurité)
- ✅ JWT tokens (expire 24h)
- ✅ Bcrypt (hash passwords)
- ✅ Validation Zod (toutes entrées)
- ✅ SQL injection protection (requêtes paramétrées)
- ✅ Rate limiting
- ✅ CORS restrictif

---

## 📞 Support

**Contact** : consultantic@jocyderklogistics.com

---

## 📄 License

© 2025 JOCYDERK Group. Tous droits réservés.
