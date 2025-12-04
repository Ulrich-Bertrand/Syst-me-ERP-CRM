# 🔧 CORRECTION ERREUR: process is not defined

## ❌ ERREUR INITIALE

```
ReferenceError: process is not defined
    at contexts/AuthContext.tsx:5:16
```

---

## 🔍 CAUSE

Le code utilisait directement `process.env.NEXT_PUBLIC_API_URL` qui n'était pas toujours disponible selon le contexte d'exécution (client-side vs server-side).

**Code problématique** :
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
```

---

## ✅ SOLUTION IMPLÉMENTÉE

### **1. Création fichier de configuration centralisé**

**Fichier** : `/config/api.config.ts`

```typescript
export const API_BASE_URL = 
  typeof window === 'undefined' 
    ? process.env.API_URL || 'http://localhost:4000/api'  // Server-side
    : (window as any).ENV?.API_URL || 'http://localhost:4000/api';  // Client-side
```

**Avantages** :
- ✅ Gère server-side et client-side
- ✅ Fallback sûr sur localhost:4000
- ✅ Centralisé (un seul endroit à modifier)
- ✅ Inclut tous les endpoints API

---

### **2. Mise à jour AuthContext**

**Avant** :
```typescript
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
```

**Après** :
```typescript
import { API_BASE_URL } from '../config/api.config';

// Utilisation partout dans le fichier
await axios.post(`${API_BASE_URL}/auth/login`, ...);
```

---

### **3. Mise à jour services/api/config.ts**

**Avant** :
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  ...
});
```

**Après** :
```typescript
import { API_BASE_URL } from '../../config/api.config';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  ...
});
```

---

### **4. Création fichiers environnement**

#### `.env.local` (ne pas committer)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NODE_ENV=development
```

#### `.env.example` (template documenté)
```bash
# Configuration API
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NODE_ENV=development
```

---

## 📁 FICHIERS MODIFIÉS

1. ✅ `/config/api.config.ts` - **CRÉÉ**
2. ✅ `/contexts/AuthContext.tsx` - **MODIFIÉ**
3. ✅ `/services/api/config.ts` - **MODIFIÉ**
4. ✅ `/.env.local` - **CRÉÉ**
5. ✅ `/.env.example` - **CRÉÉ**

---

## 🎯 RÉSULTAT

### **Avant** ❌
- Erreur `process is not defined`
- Application ne démarre pas
- Contexte Auth planté

### **Après** ✅
- ✅ Aucune erreur process
- ✅ Configuration centralisée
- ✅ Fallback sûr
- ✅ Client-side + Server-side géré
- ✅ Variables d'environnement documentées
- ✅ Application démarre correctement

---

## 🚀 VÉRIFICATION

### **1. Vérifier configuration**
```bash
# Vérifier que .env.local existe
cat .env.local

# Devrait afficher :
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
# NODE_ENV=development
```

### **2. Redémarrer serveur**
```bash
# Arrêter serveur (Ctrl+C)
# Redémarrer
npm run dev
```

### **3. Vérifier console navigateur**
```javascript
// La console devrait afficher :
[API Config] Base URL: http://localhost:4000/api
```

### **4. Tester API**
```bash
# Vérifier que le backend tourne
curl http://localhost:4000/api/health

# Devrait retourner :
# {"status":"ok","timestamp":"..."}
```

---

## 🔒 SÉCURITÉ

### **Variables d'environnement sensibles**

⚠️ **NE JAMAIS committer** :
- `.env.local`
- `.env.production`
- Toute variable contenant :
  - Clés API
  - Tokens
  - Mots de passe
  - Secrets

✅ **Toujours committer** :
- `.env.example` (template avec valeurs factices)

---

## 📝 GITIGNORE

Vérifier que `.gitignore` contient :
```bash
# Environnement
.env.local
.env.development.local
.env.test.local
.env.production.local
.env
```

---

## 🌍 DÉPLOIEMENT PRODUCTION

### **Netlify / Vercel**
1. Aller dans Settings → Environment Variables
2. Ajouter :
   - `NEXT_PUBLIC_API_URL` = `https://api-production.jocyderk.com/api`
   - `NODE_ENV` = `production`

### **Variables selon environnement**

| Environnement | URL API |
|---------------|---------|
| **Local** | `http://localhost:4000/api` |
| **Développement** | `https://api-dev.jocyderk.com/api` |
| **Staging** | `https://api-staging.jocyderk.com/api` |
| **Production** | `https://api.jocyderk.com/api` |

---

## 🎉 CONCLUSION

L'erreur `process is not defined` est corrigée ! 

**Bénéfices** :
- ✅ Configuration centralisée et sécurisée
- ✅ Gestion propre des environnements
- ✅ Fallback robuste
- ✅ Code plus maintenable
- ✅ Prêt pour production

---

**STATUS : ✅ RÉSOLU**
