# 🚀 DÉMARRAGE API - GUIDE COMPLET

Guide complet pour lancer l'API backend JOCYDERK ERP/CRM

---

## 📋 PRÉREQUIS

### 1. **Node.js**
- Version : **18.0.0 ou supérieur**
- Vérifier : `node --version`

### 2. **PostgreSQL**
- Version : **15 ou supérieur**
- Vérifier : `psql --version`

### 3. **npm**
- Version : **9.0.0 ou supérieur**
- Vérifier : `npm --version`

---

## ⚙️ INSTALLATION

### **Étape 1 : Installation dépendances**

```bash
cd api
npm install
```

**Dépendances installées** :
- `express` - Framework web
- `pg` - Client PostgreSQL
- `cors` - Gestion CORS
- `dotenv` - Variables environnement
- `bcryptjs` - Hash passwords
- `jsonwebtoken` - Tokens JWT
- `zod` - Validation
- `multer` - Upload fichiers
- `morgan` - Logging HTTP
- `helmet` - Sécurité headers
- `express-rate-limit` - Rate limiting
- `compression` - Compression gzip

---

## 🗄️ CONFIGURATION BASE DE DONNÉES

### **Étape 2 : Créer base de données PostgreSQL**

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer base de données
CREATE DATABASE jocyderk_erp;

# Se connecter à la base
\c jocyderk_erp

# Quitter
\q
```

### **Étape 3 : Initialiser schéma**

```bash
# Exécuter script init
psql -U postgres -d jocyderk_erp -f database/init-db.sql
```

### **Étape 4 : Insérer données test**

```bash
# Exécuter script seed
psql -U postgres -d jocyderk_erp -f database/seed-data.sql
```

---

## 🔧 CONFIGURATION ENVIRONNEMENT

### **Étape 5 : Créer fichier .env**

```bash
# Copier exemple
cp .env.example .env
```

### **Étape 6 : Configurer .env**

Ouvrir `.env` et modifier :

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jocyderk_erp
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_POSTGRESQL

# JWT Secret (IMPORTANT : Changer en production)
JWT_SECRET=super_secret_jwt_key_change_this_12345678901234567890
JWT_EXPIRES_IN=24h

# Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/jpg,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANT** :
- Remplacer `DB_PASSWORD` par votre mot de passe PostgreSQL
- Changer `JWT_SECRET` (doit être unique et sécurisé)

---

## 🚀 LANCEMENT

### **Mode développement (avec nodemon)**

```bash
npm run dev
```

### **Mode production**

```bash
npm start
```

### **Sortie attendue** :

```
🚀 ========================================
🚀 JOCYDERK ERP API Server
🚀 Environment: development
🚀 Port: 4000
🚀 URL: http://localhost:4000
🚀 Health: http://localhost:4000/health
🚀 ========================================

✅ Connected to PostgreSQL database
```

---

## ✅ VÉRIFICATION

### **1. Health check**

```bash
curl http://localhost:4000/health
```

**Réponse attendue** :
```json
{
  "status": "OK",
  "timestamp": "2025-11-30T12:34:56.789Z",
  "environment": "development"
}
```

### **2. Test login**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "consultantic@jocyderklogistics.com",
    "password": "password123"
  }'
```

**Réponse attendue** :
```json
{
  "user": {
    "id": 1,
    "email": "consultantic@jocyderklogistics.com",
    "nom": "DOE",
    "prenom": "John",
    "agence": "GHANA",
    "is_admin": true,
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

✅ **Si vous recevez cette réponse, l'API fonctionne parfaitement !**

---

## 📊 COMPTES TEST

### **Administrateur**
```
Email: consultantic@jocyderklogistics.com
Password: password123
Profils: Tous les profils
```

### **Demandeur simple**
```
Email: demandeur@jocyderklogistics.com
Password: password123
Profils: Créer demandes d'achat uniquement
```

### **Validateur niveau 1**
```
Email: validator1@jocyderklogistics.com
Password: password123
Profils: Validation niveau 1
```

### **Validateur niveau 2**
```
Email: validator2@jocyderklogistics.com
Password: password123
Profils: Validation niveau 2
```

### **Validateur niveau 3**
```
Email: validator3@jocyderklogistics.com
Password: password123
Profils: Validation niveau 3
```

---

## 🔗 ENDPOINTS DISPONIBLES

### **Authentification** (`/api/auth`)
- ✅ `POST /login` - Connexion
- ✅ `GET /profile` - Profil user (Auth requis)
- ✅ `PUT /profile` - Mise à jour profil (Auth requis)
- ✅ `POST /change-password` - Changer mot de passe (Auth requis)

### **Demandes d'achat** (`/api/demandes`)
- ✅ `GET /` - Liste demandes (Auth requis)
- ✅ `GET /mes-demandes` - Mes demandes (Auth requis)
- ✅ `GET /:id` - Détail demande (Auth requis)
- ✅ `POST /` - Créer demande (Profil requis)
- ✅ `PUT /:id` - Modifier demande (Profil requis)
- ✅ `DELETE /:id` - Supprimer demande (Profil requis)
- ✅ `POST /:id/submit` - Soumettre validation (Profil requis)

### **Validations** (`/api/validations`)
- ✅ `GET /demandes` - Demandes à valider (Profil validateur)
- ✅ `GET /stats` - Stats validations (Profil validateur)
- ✅ `POST /:demandeId/valider` - Valider (Profil validateur)
- ✅ `POST /:demandeId/rejeter` - Rejeter (Profil validateur)
- ✅ `GET /:demandeId/historique` - Historique (Auth requis)

### **Dashboard** (`/api/dashboard`)
- ✅ `GET /stats` - Statistiques (Auth requis)
- ✅ `GET /demandes-recentes` - Demandes récentes (Auth requis)
- ✅ `GET /activites-recentes` - Activités (Auth requis)

### **Autres modules** (stubs)
- ⏳ `GET /api/bons-commande` - Bons de commande (À implémenter)
- ⏳ `GET /api/receptions` - Réceptions (À implémenter)
- ⏳ `GET /api/factures` - Factures (À implémenter)
- ⏳ `GET /api/paiements` - Paiements (À implémenter)
- ⏳ `GET /api/fournisseurs` - Fournisseurs (À implémenter)
- ⏳ `GET /api/articles` - Articles (À implémenter)
- ⏳ `GET /api/stock` - Stock (À implémenter)

---

## 🧪 TESTS POSTMAN

### **Collection Postman**

Créer collection "JOCYDERK API" avec ces requêtes :

#### **1. Login**
```
POST http://localhost:4000/api/auth/login
Body (JSON):
{
  "email": "consultantic@jocyderklogistics.com",
  "password": "password123"
}
```

**→ Copier le token de la réponse**

#### **2. Get Profile**
```
GET http://localhost:4000/api/auth/profile
Headers:
  Authorization: Bearer {TOKEN}
```

#### **3. Create Demande**
```
POST http://localhost:4000/api/demandes
Headers:
  Authorization: Bearer {TOKEN}
Body (JSON):
{
  "agence": "GHANA",
  "type": "NORMALE",
  "objet": "Test API",
  "justification": "Test création demande via API",
  "date_besoin": "2025-12-31",
  "lignes": [
    {
      "designation": "Article test",
      "quantite": 10,
      "unite": "Pièce",
      "prix_unitaire_estime": 5.50
    }
  ]
}
```

#### **4. Get Demandes**
```
GET http://localhost:4000/api/demandes?agence=GHANA&limit=20
Headers:
  Authorization: Bearer {TOKEN}
```

---

## 🐛 DÉPANNAGE

### **Erreur : "Cannot connect to database"**

**Cause** : PostgreSQL pas démarré ou mauvaise config

**Solution** :
```bash
# Démarrer PostgreSQL (Linux/Mac)
sudo service postgresql start

# Vérifier connexion
psql -U postgres -d jocyderk_erp -c "SELECT 1;"
```

### **Erreur : "Port 4000 already in use"**

**Cause** : Port déjà utilisé

**Solution** :
```bash
# Trouver process
lsof -i :4000

# Tuer process
kill -9 <PID>

# OU changer port dans .env
PORT=4001
```

### **Erreur : "JWT Secret not defined"**

**Cause** : Variable JWT_SECRET manquante

**Solution** :
```bash
# Vérifier .env existe et contient JWT_SECRET
cat .env | grep JWT_SECRET
```

### **Erreur 401 : "Token invalide"**

**Cause** : Token expiré ou invalide

**Solution** :
- Se reconnecter via `/api/auth/login`
- Copier nouveau token
- Utiliser nouveau token dans header Authorization

---

## 📝 LOGS

### **Logs développement**

Les logs HTTP sont affichés dans la console :

```
POST /api/auth/login 200 123ms
GET /api/demandes 200 45ms
POST /api/demandes 201 234ms
```

### **Logs base de données**

Les requêtes SQL sont loggées en mode développement :

```
Executed query { 
  text: 'SELECT * FROM utilisateurs WHERE email = $1',
  duration: 12,
  rows: 1 
}
```

---

## 🔒 SÉCURITÉ

### **Configuration sécurité**

✅ **Helmet.js** : Headers sécurité HTTP
✅ **CORS** : Limité à `http://localhost:3000`
✅ **Rate limiting** : 100 requêtes / 15 minutes
✅ **JWT** : Tokens expiration 24h
✅ **Bcrypt** : Hash passwords (10 rounds)
✅ **Validation Zod** : Toutes entrées validées
✅ **SQL injection** : Requêtes paramétrées

### **⚠️ PRODUCTION**

Avant déploiement production :

1. Changer `JWT_SECRET` (minimum 32 caractères)
2. Configurer `NODE_ENV=production`
3. Mettre à jour `CORS_ORIGIN`
4. Utiliser HTTPS
5. Configurer firewall
6. Limiter accès base de données

---

## 📈 PERFORMANCE

### **Optimisations**

- ✅ Connection pooling PostgreSQL (20 connexions max)
- ✅ Compression gzip
- ✅ Timeout requests 30s
- ✅ Indexes base de données
- ✅ Requêtes optimisées

### **Monitoring**

```bash
# Statistiques connexions DB
SELECT * FROM pg_stat_activity WHERE datname = 'jocyderk_erp';

# Taille base de données
SELECT pg_size_pretty(pg_database_size('jocyderk_erp'));
```

---

## 🆘 SUPPORT

**Problème non résolu ?**

1. Vérifier logs console API
2. Vérifier logs PostgreSQL
3. Tester health check : `http://localhost:4000/health`
4. Vérifier `.env` configuration
5. Consulter README.md

**Contact** : consultantic@jocyderklogistics.com

---

## 🎉 FÉLICITATIONS !

Votre API JOCYDERK ERP/CRM est maintenant opérationnelle ! 🚀

**Prochaines étapes** :

1. Tester tous les endpoints avec Postman
2. Lancer le frontend (`cd .. && npm run dev`)
3. Créer premières demandes d'achat
4. Tester workflow validations
5. Implémenter modules suivants (Bons commande, Factures, etc.)

---

**API prête pour développement ! 💪**
