# 🚀 LANCEMENT COMPLET - GUIDE EXPRESS

Guide ultra-rapide pour lancer le système ERP/CRM JOCYDERK complet (Frontend + Backend)

---

## ⚡ PRÉREQUIS

- ✅ Node.js 18+
- ✅ PostgreSQL 15+
- ✅ npm 9+

---

## 🎬 DÉMARRAGE EN 5 MINUTES

### **Étape 1 : Cloner et installer** (1 min)

```bash
# Se positionner dans le projet
cd jocyderk-erp-crm

# Installer dépendances frontend
npm install

# Installer dépendances backend
cd api
npm install
cd ..
```

---

### **Étape 2 : Configurer PostgreSQL** (2 min)

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer base de données
CREATE DATABASE jocyderk_erp;

# Quitter
\q

# Initialiser schéma
psql -U postgres -d jocyderk_erp -f api/database/init-db.sql

# Insérer données test
psql -U postgres -d jocyderk_erp -f api/database/seed-data.sql
```

---

### **Étape 3 : Configurer environnement** (1 min)

#### **Backend (.env)**

```bash
cd api
cp .env.example .env
```

Éditer `api/.env` :

```env
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=jocyderk_erp
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE_ICI    # ← MODIFIER ICI

JWT_SECRET=super_secret_jwt_key_12345  # ← MODIFIER EN PRODUCTION
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:3000
```

#### **Frontend (.env.local)** 

Déjà configuré ✅ :

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NODE_ENV=development
```

---

### **Étape 4 : Lancer backend** (30 sec)

**Terminal 1 :**

```bash
cd api
npm run dev
```

**✅ Vérifier** : 

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

**Test** : http://localhost:4000/health

---

### **Étape 5 : Lancer frontend** (30 sec)

**Terminal 2 :**

```bash
# Depuis la racine du projet
npm run dev
```

**✅ Vérifier** :

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## 🎉 ACCÈS APPLICATION

### **URL** : http://localhost:3000

**Redirection automatique vers** : http://localhost:3000/login

---

## 🔐 COMPTES TEST

### **Administrateur complet**

```
Email: consultantic@jocyderklogistics.com
Password: password123
Agence: GHANA 🇬🇭
Langue: Français 🇫🇷
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

## ✅ WORKFLOW TEST COMPLET

### **1. Login**

1. Accéder http://localhost:3000
2. Email : `consultantic@jocyderklogistics.com`
3. Password : `password123`
4. Agence : `GHANA`
5. Langue : `Français`
6. Cliquer "Se connecter"

**→ Redirection dashboard ✅**

---

### **2. Dashboard**

**Vérifier que le dashboard affiche** :

- ✅ 6 stats cards avec données réelles API
- ✅ Tableau "Demandes d'achat récentes"
- ✅ 3 boutons actions rapides
- ✅ Header avec switcher agence/langue
- ✅ Sidebar avec menus

**Test switcher agence** :

1. Cliquer switcher agence (header droite)
2. Sélectionner "Côte d'Ivoire"
3. Dashboard recharge avec données Côte d'Ivoire ✅

---

### **3. Test API direct**

#### **Health check**

```bash
curl http://localhost:4000/health
```

**Réponse attendue** :

```json
{
  "status": "OK",
  "timestamp": "2025-11-30T...",
  "environment": "development"
}
```

#### **Login API**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "consultantic@jocyderklogistics.com",
    "password": "password123"
  }'
```

**Copier le token de la réponse**

#### **Get demandes**

```bash
curl http://localhost:4000/api/demandes \
  -H "Authorization: Bearer <VOTRE_TOKEN>"
```

**Réponse** : Liste des demandes ✅

---

## 🐛 DÉPANNAGE EXPRESS

### **Problème 1 : "Cannot connect to database"**

**Solution** :

```bash
# Démarrer PostgreSQL
sudo service postgresql start

# Vérifier
psql -U postgres -d jocyderk_erp -c "SELECT 1;"
```

---

### **Problème 2 : "Port 4000 already in use"**

**Solution** :

```bash
# Trouver process
lsof -i :4000

# Tuer process
kill -9 <PID>

# OU changer port dans api/.env
PORT=4001
```

---

### **Problème 3 : "Port 3000 already in use"**

**Solution** :

```bash
# Tuer process Next.js
killall node

# OU lancer sur autre port
PORT=3001 npm run dev
```

---

### **Problème 4 : Page blanche frontend**

**Solution** :

1. Ouvrir DevTools (F12) → Console
2. Vérifier erreurs
3. Vérifier que backend est démarré : http://localhost:4000/health
4. Nettoyer localStorage :

```javascript
// Console navigateur
localStorage.clear()
location.reload()
```

---

### **Problème 5 : "Token invalide"**

**Solution** :

Se reconnecter :
1. Cliquer menu user (header droite)
2. Cliquer "Déconnexion"
3. Se reconnecter avec identifiants

---

## 📊 VÉRIFICATION COMPLÈTE

### **✅ Backend opérationnel**

```bash
# Health check
curl http://localhost:4000/health
# ✅ Doit retourner {"status":"OK",...}

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"consultantic@jocyderklogistics.com","password":"password123"}'
# ✅ Doit retourner {"user":{...},"token":"..."}

# Stats dashboard (avec token)
curl http://localhost:4000/api/dashboard/stats \
  -H "Authorization: Bearer <TOKEN>"
# ✅ Doit retourner stats
```

---

### **✅ Frontend opérationnel**

1. ✅ http://localhost:3000 → Redirection /login
2. ✅ Login fonctionne
3. ✅ Dashboard affiche stats réelles
4. ✅ Switcher agence fonctionne
5. ✅ Header affiche user
6. ✅ Sidebar affiche menus

---

### **✅ Intégration frontend-backend**

1. ✅ Login envoie requête API
2. ✅ Token sauvegardé localStorage
3. ✅ Dashboard charge données via API
4. ✅ Stats affichent données réelles DB
5. ✅ Changement agence recharge données
6. ✅ Déconnexion nettoie token

---

## 🎯 COMMANDES UTILES

### **Backend**

```bash
cd api

npm run dev          # Développement
npm start            # Production
npm run db:init      # Réinitialiser DB
npm run db:seed      # Réinsérer données test
```

### **Frontend**

```bash
npm run dev          # Développement
npm run build        # Build production
npm start            # Production (après build)
npm run lint         # Linter
```

### **Base de données**

```bash
# Connexion
psql -U postgres -d jocyderk_erp

# Lister tables
\dt

# Voir utilisateurs
SELECT id, email, nom, prenom, agence FROM utilisateurs;

# Voir demandes
SELECT id, reference, objet, statut FROM demandes_achat;

# Quitter
\q
```

---

## 📝 LOGS

### **Backend logs**

Dans le terminal backend, vous verrez :

```
POST /api/auth/login 200 123ms
GET /api/dashboard/stats 200 45ms
GET /api/demandes 200 67ms
```

### **Frontend logs**

Dans la console navigateur (F12) :

```
Chargement dashboard...
✅ Stats chargées
✅ Demandes chargées
```

---

## 🔄 REDÉMARRAGE COMPLET

Si besoin de tout redémarrer :

```bash
# 1. Tuer tous les process
killall node

# 2. Redémarrer PostgreSQL
sudo service postgresql restart

# 3. Redémarrer backend
cd api
npm run dev

# 4. Redémarrer frontend (nouveau terminal)
cd ..
npm run dev
```

---

## 📚 DOCUMENTATION

### **Guides disponibles**

- 📘 `/README.md` - Vue d'ensemble projet
- 📗 `/DEMARRAGE_RAPIDE.md` - Guide démarrage frontend
- 📙 `/api/README.md` - Documentation API
- 📕 `/api/DEMARRAGE_API.md` - Guide démarrage API
- 📓 `/INTEGRATION_FRONTEND_BACKEND.md` - Intégration
- 📔 `/API_COMPLETE_RECAP.md` - Récapitulatif API
- 📖 `/LANCEMENT_COMPLET.md` - Ce guide

---

## 🆘 BESOIN D'AIDE ?

1. Consulter guides documentation
2. Vérifier logs backend (terminal 1)
3. Vérifier console frontend (F12)
4. Tester health check : http://localhost:4000/health
5. Nettoyer et redémarrer

**Contact** : consultantic@jocyderklogistics.com

---

## 🎉 FÉLICITATIONS !

**Votre système ERP/CRM JOCYDERK est opérationnel ! 🚀**

### **Ce qui fonctionne** :

✅ Login avec JWT  
✅ Dashboard temps réel  
✅ Multi-agences (Ghana, Côte d'Ivoire, Burkina)  
✅ Multi-langues (FR, EN)  
✅ Permissions granulaires  
✅ API complète (76 endpoints)  
✅ Base de données PostgreSQL (15 tables)  
✅ Documentation complète  

### **Prochaines étapes** :

1. Créer pages demandes d'achat
2. Créer pages validations
3. Implémenter bons de commande
4. Implémenter factures + contrôle 3 voies
5. Implémenter module stock

---

**BON DÉVELOPPEMENT ! 💪**
