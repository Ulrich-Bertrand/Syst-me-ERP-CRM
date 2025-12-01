# 🔄 SYSTÈME DE FALLBACK AUTOMATIQUE - MODE MOCK

## 📋 Vue d'ensemble

Le système ERP/CRM Jocyderk est équipé d'un **système de fallback automatique** qui bascule vers des données mockées lorsque le serveur backend n'est pas disponible.

Cela permet de :
- ✅ Tester l'interface complète sans serveur backend
- ✅ Développer le frontend de manière autonome
- ✅ Démontrer les fonctionnalités sans infrastructure
- ✅ Éviter les erreurs "Network Error"

## 🎯 Fonctionnement

### Détection automatique

Au démarrage de l'application, le système teste la connectivité au serveur backend :

```typescript
// /services/api/config.ts

async function testApiConnection(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 2000 });
    return response.status === 200;
  } catch {
    return false;
  }
}
```

**Si le serveur répond** :
```
[API Config] ✅ Serveur backend connecté
```
→ Utilise l'API réelle

**Si le serveur ne répond pas** :
```
[API Config] ⚠️ Serveur backend non disponible - Mode MOCK activé
[API Config] 💡 Pour utiliser l'API réelle, démarrez le serveur: cd api && npm run dev
```
→ Utilise les données mockées

### Fallback double niveau

Même si l'API est détectée au démarrage, chaque requête a un **fallback de sécurité** :

```typescript
async getAll(filters?: GetDemandesFilters): Promise<PaginatedResponse<DemandeAchatListe>> {
  // Mode MOCK : utiliser les données simulées
  if (isUsingMockMode()) {
    return demandesMockService.getAll(filters);
  }

  // Mode API : appel backend réel
  try {
    const response = await apiClient.get(`/demandes${queryParams}`);
    return response.data;
  } catch (error: any) {
    // Fallback vers mock en cas d'erreur réseau
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.warn('[demandesApi] Fallback vers mode MOCK suite à erreur réseau');
      return demandesMockService.getAll(filters);
    }
    throw error;
  }
}
```

## 📦 Services Mockés

### Module Achats

#### 1. Demandes d'achat (`/services/api/demandes.mock.ts`)

**Données disponibles** :
- 3 demandes pré-créées avec différents statuts
- Lignes de demande avec prix et quantités
- Historiques de validation

**Opérations supportées** :
- ✅ `getAll()` - Liste avec filtres (agence, statut, type, période)
- ✅ `getById(id)` - Détail d'une demande
- ✅ `create(data)` - Créer nouvelle demande (persiste en mémoire)
- ✅ `update(id, data)` - Modifier demande brouillon
- ✅ `delete(id)` - Supprimer demande brouillon
- ✅ `submit(id)` - Soumettre pour validation

#### 2. Validations (`/services/api/validations.mock.ts`)

**Données disponibles** :
- 2 demandes à valider (niveau 1 et niveau 2)
- Statistiques de validation en temps réel

**Opérations supportées** :
- ✅ `getDemandesAValider(niveau)` - Liste des demandes à valider
- ✅ `valider(id, action)` - Approuver une demande
- ✅ `rejeter(id, action)` - Rejeter une demande
- ✅ `getHistorique(id)` - Historique validations d'une demande
- ✅ `getStats()` - Statistiques globales

## 🎨 Caractéristiques

### Délais simulés

Les services mockés simulent des délais réseau réalistes :

```typescript
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Exemple : 300ms pour une liste
await delay(300);

// Exemple : 500ms pour une création
await delay(500);
```

### Données persistantes (en mémoire)

Les modifications sont **conservées pendant la session** :

```typescript
// Créer une demande
const nouvelleDemande = await demandesApi.create({...});
// ✅ Sera visible dans la liste

// Modifier une demande
await demandesApi.update(3, { objet: "Nouveau titre" });
// ✅ Modification conservée

// Soumettre une demande
await demandesApi.submit(3);
// ✅ Statut changé de "brouillon" à "en_validation_niveau_1"
```

⚠️ **Note** : Les données sont perdues au rechargement de la page (stockage en mémoire uniquement)

### Validations réalistes

Le mode mock respecte les **règles métier** :

```typescript
// ❌ Impossible de modifier une demande validée
if (demande.statut !== 'brouillon') {
  throw {
    response: {
      status: 400,
      data: { error: 'Seules les demandes en brouillon peuvent être modifiées' }
    }
  };
}

// ❌ Impossible de soumettre deux fois
if (demande.statut !== 'brouillon') {
  throw {
    response: {
      status: 400,
      data: { error: 'Cette demande a déjà été soumise' }
    }
  };
}
```

## 🔧 Configuration

### Forcer le mode Mock

Vous pouvez forcer le mode mock manuellement :

```typescript
import { setMockMode } from './services/api/config';

// Activer le mode mock
setMockMode(true);

// Désactiver le mode mock
setMockMode(false);
```

### Vérifier le mode actuel

```typescript
import { isUsingMockMode } from './services/api/config';

if (isUsingMockMode()) {
  console.log('🎭 Mode MOCK actif');
} else {
  console.log('🌐 Mode API réel actif');
}
```

## 🚀 Démarrage du serveur backend réel

Pour passer en mode API réel :

```bash
# Terminal 1 : Démarrer le backend
cd api
npm install
npm run dev
# Serveur démarre sur http://localhost:4000

# Terminal 2 : Frontend (déjà en cours)
# L'application détectera automatiquement le serveur
```

## 📊 Données Mock disponibles

### Demandes d'achat

| ID | Référence | Agence | Type | Statut | Montant |
|----|-----------|--------|------|--------|---------|
| 1 | DA-2025-0001 | GHANA | NORMALE | validee_niveau_3 | 2,750.00 |
| 2 | DA-2025-0002 | GHANA | URGENTE | en_validation_niveau_2 | 4,500.00 |
| 3 | DA-2025-0003 | COTE_IVOIRE | NORMALE | brouillon | 8,900.00 |

### Demandes à valider

| ID | Référence | Niveau | Montant | Urgence |
|----|-----------|--------|---------|---------|
| 10 | DA-2025-0010 | Niveau 1 | 3,200.00 | Normale |
| 11 | DA-2025-0011 | Niveau 2 | 5,600.00 | Urgente |

### Statistiques de validation

```json
{
  "en_attente_niveau_1": 5,
  "en_attente_niveau_2": 3,
  "en_attente_niveau_3": 1,
  "validees_aujourd_hui": 8,
  "rejetees_aujourd_hui": 2,
  "montant_en_attente": 45780.50,
  "montant_valide_mois": 128450.00
}
```

## 🎯 Cas d'usage

### 1. Développement Frontend

```typescript
// Développer sans attendre le backend
const { demandes, loading } = useDemandesAchats();

useEffect(() => {
  fetchDemandes({ agence: 'GHANA' });
  // ✅ Fonctionne en mode mock et API réel
}, []);
```

### 2. Démonstration

```typescript
// Créer des données de démo en direct
const handleDemo = async () => {
  // Créer plusieurs demandes
  await createDemande({ ... });
  await createDemande({ ... });
  
  // Les données sont immédiatement visibles
  await fetchDemandes();
};
```

### 3. Tests UI

```typescript
// Tester les différents états
await createDemande({ type: 'URGENTE' });  // Demande urgente
await createDemande({ type: 'NORMALE' });   // Demande normale
await submit(demandeId);                     // Changement de statut
```

## ⚠️ Limitations

### Mode Mock

- ❌ Pas de persistance (données perdues au reload)
- ❌ Pas d'authentification réelle
- ❌ Pas de validation backend (Zod)
- ❌ Pas de contrôle 3-voies
- ❌ Pas de calcul PMP automatique

### Mode API Réel

- ✅ Persistance en base PostgreSQL
- ✅ Authentification JWT
- ✅ Validation complète (Zod schemas)
- ✅ Workflows métier automatiques
- ✅ Calculs automatiques (PMP, stock)

## 🔍 Debugging

### Console Logs

Le système affiche des logs détaillés :

```
[API Config] Base URL: http://localhost:4000/api
[API Config] ⚠️ Serveur backend non disponible - Mode MOCK activé
[MOCK] GET /api/demandes { agence: 'GHANA' }
[useDemandesAchats] Réponse API: { total: 3, count: 2, page: 1 }
```

### Erreurs réseau

```
[useDemandesAchats] Erreur fetchDemandes: AxiosError: Network Error
[demandesApi] Fallback vers mode MOCK suite à erreur réseau
✅ Données mock chargées avec succès
```

## 📝 Prochaines étapes

Pour passer en production :

1. ✅ Démarrer le serveur backend
2. ✅ Configurer la base de données PostgreSQL
3. ✅ Ajuster `API_BASE_URL` en production
4. ✅ Désactiver le mode mock en production
5. ✅ Supprimer les fichiers `*.mock.ts` du build

## 🎉 Résumé

Le système de fallback automatique permet de :

- ✅ **Développer** sans dépendances backend
- ✅ **Démontrer** les fonctionnalités complètes
- ✅ **Tester** l'interface utilisateur
- ✅ **Basculer** automatiquement entre mock et API réel

**Mode actuel** : Vérifiez la console au démarrage !

```
🎭 Mode MOCK  → Données simulées
🌐 Mode API   → Backend PostgreSQL
```
