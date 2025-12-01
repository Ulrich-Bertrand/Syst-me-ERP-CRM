#🎯 INTÉGRATION AchatsViewNew.tsx - DOCUMENTATION COMPLÈTE

## 📋 VUE D'ENSEMBLE

**Fichier**: `/components/views/AchatsViewNew.tsx`  
**Rôle**: Page principale du module Achats - Liste demandes + Dashboard KPIs  
**Lignes de code**: ~620 lignes

---

## 🔄 CHANGEMENTS REQUIS

### **1. IMPORTS**

#### ❌ AVANT (Mockdata)
```typescript
import { mockDemandesAchats, calculateAchatsKPIs } from '../../data/mockAchatsData';
import { DemandeAchatComplete, DemandeAchatForm, STATUT_LABELS } from '../../types/achats';
```

#### ✅ APRÈS (API)
```typescript
import { useAuth } from '../../contexts/AuthContext';
import { useDemandesAchats } from '../../hooks/useDemandesAchats';
import { dashboardApi } from '../../services/api';
import { 
  DemandeAchatComplete, 
  CreateDemandeRequest,
  STATUT_LABELS,
  TYPE_LABELS 
} from '../../types/achats-api.types';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
```

**RAISON**: 
- On utilise le hook `useDemandesAchats` au lieu de mockdata
- On utilise `useAuth` pour récupérer l'agence active
- On importe les nouveaux types exacts de `achats-api.types.ts`
- On ajoute `useEffect` pour charger données au montage
- On ajoute `Loader2` pour loading state

---

### **2. STATE & HOOKS**

#### ❌ AVANT
```typescript
export function AchatsView({ viewType }: { viewType: string }) {
  const { t, language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // ...
  
  // Données statiques
  const kpis = calculateAchatsKPIs();
  const filteredDemandes = mockDemandesAchats.filter(...);
}
```

#### ✅ APRÈS
```typescript
export function AchatsView({ viewType }: { viewType: string }) {
  // ========== HOOKS ==========
  const { t, language } = useLanguage();
  const { agence } = useAuth(); // 🆕 Récupérer agence active
  
  // 🆕 Hook demandes d'achat (API)
  const {
    loading,
    demandes,
    pagination,
    fetchDemandes,
    createDemande,
    deleteDemande,
    submitDemande,
    fetchDemandeById
  } = useDemandesAchats();
  
  // ========== STATE LOCAL ==========
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState<DemandeAchatComplete | null>(null);
  const [kpis, setKpis] = useState<any>(null); // 🆕 KPIs from API
  const [loadingKpis, setLoadingKpis] = useState(false);
  
  // ========== EFFETS ==========
  
  // 🆕 Charger demandes au montage
  useEffect(() => {
    loadData();
  }, []);
  
  // 🆕 Recharger quand agence change
  useEffect(() => {
    if (agence) {
      loadData();
    }
  }, [agence]);
  
  // 🆕 Recharger quand filtres changent
  useEffect(() => {
    if (selectedFilter) {
      applyFilters();
    }
  }, [selectedFilter]);
}
```

**RAISON**:
- `useAuth()` → Obtenir agence active pour filtrer
- `useDemandesAchats()` → Toutes les opérations API
- `useEffect` → Charger données automatiquement
- State séparé pour KPIs car chargés via autre endpoint

---

### **3. FONCTION CHARGEMENT DONNÉES**

#### ✅ NOUVELLE FONCTION
```typescript
/**
 * 📊 CHARGER TOUTES LES DONNÉES
 * 
 * APPELS API:
 *   1. GET /api/demandes?agence={agence}&page=1&limit=20
 *   2. GET /api/dashboard/stats?agence={agence}
 * 
 * GESTION ERREURS:
 *   - 401 → Redirect login (automatique via interceptor)
 *   - 403 → Toast "Permissions insuffisantes"
 *   - 500 → Toast "Erreur serveur"
 */
const loadData = async () => {
  try {
    // Charger demandes + KPIs en parallèle
    const [demandesResult, kpisData] = await Promise.all([
      fetchDemandes({
        agence: agence as any,
        page: 1,
        limit: 20
      }),
      dashboardApi.getStats({ agence: agence as any })
    ]);
    
    console.log('[AchatsView] Données chargées:', {
      demandes: demandesResult.total,
      kpis: kpisData
    });
    
    setKpis(kpisData);
  } catch (error) {
    console.error('[AchatsView] Erreur chargement:', error);
    // Erreurs gérées par les hooks/services
  }
};
```

**ENDPOINTS UTILISÉS**:

1. **GET /api/demandes**
   ```
   URL: http://localhost:4000/api/demandes?agence=GHANA&page=1&limit=20
   Headers: Authorization: Bearer {token}
   Response: {
     data: [...],
     total: 45,
     page: 1,
     limit: 20
   }
   ```

2. **GET /api/dashboard/stats**
   ```
   URL: http://localhost:4000/api/dashboard/stats?agence=GHANA
   Headers: Authorization: Bearer {token}
   Response: {
     demandes_en_attente: 12,
     demandes_validees: 8,
     bons_commande_en_cours: 5,
     montant_total: 45600.00,
     alertes_stock: 3,
     fournisseurs_actifs: 15
   }
   ```

---

### **4. FILTRAGE LISTE**

#### ❌ AVANT (Filtrage local)
```typescript
const filteredDemandes = mockDemandesAchats.filter(demande => {
  if (selectedFilter === 'pending-approval') {
    if (demande.demande.statut_workflow !== 'soumis') return false;
  }
  // ...
  return true;
});
```

#### ✅ APRÈS (Filtrage API)
```typescript
/**
 * 🔍 APPLIQUER FILTRES
 * 
 * MAPPING FILTRES → API:
 *   - 'pending-approval' → statut=en_validation_niveau_1
 *   - 'approved' → statut=validee
 *   - 'rejected' → statut=rejetee
 *   - 'urgent' → type=URGENTE
 * 
 * ENDPOINT: GET /api/demandes?agence={agence}&statut={statut}
 */
const applyFilters = async () => {
  const filters: any = {
    agence: agence as any,
    page: 1,
    limit: 20
  };
  
  // Mapper filtre UI → filtre API
  switch (selectedFilter) {
    case 'pending-approval':
      filters.statut = 'en_validation_niveau_1';
      break;
    case 'approved':
      filters.statut = 'validee';
      break;
    case 'rejected':
      filters.statut = 'rejetee';
      break;
    case 'urgent':
      filters.type = 'URGENTE';
      break;
  }
  
  await fetchDemandes(filters);
};
```

**EXEMPLE APPEL**:
```
GET /api/demandes?agence=GHANA&statut=validee&page=1&limit=20
```

---

### **5. RECHERCHE**

#### ❌ AVANT (Recherche locale)
```typescript
if (searchQuery) {
  const query = searchQuery.toLowerCase();
  const matchesSearch = 
    demande.piece.Num_Piece.toLowerCase().includes(query) ||
    demande.demande.motif_achat.toLowerCase().includes(query);
  if (!matchesSearch) return false;
}
```

#### ✅ APRÈS (Recherche API)
```typescript
/**
 * 🔎 RECHERCHE
 * 
 * ENDPOINT: GET /api/demandes?search={query}
 * 
 * Backend recherche dans:
 *   - reference
 *   - objet
 *   - justification
 */
const handleSearch = async (query: string) => {
  setSearchQuery(query);
  
  if (query.length >= 3) {
    await fetchDemandes({
      agence: agence as any,
      search: query, // 🆕 Param recherche
      page: 1,
      limit: 20
    });
  } else if (query.length === 0) {
    // Reset
    await loadData();
  }
};
```

**EXEMPLE**:
```
GET /api/demandes?search=fournitures
→ Recherche dans reference, objet, justification
```

---

### **6. PAGINATION**

#### ❌ AVANT (Pas de pagination)
```typescript
// Affiche toutes les demandes
```

#### ✅ APRÈS (Pagination API)
```typescript
/**
 * 📄 PAGINATION
 * 
 * ENDPOINT: GET /api/demandes?page={page}&limit={limit}
 */
const handlePageChange = async (newPage: number) => {
  await fetchDemandes({
    agence: agence as any,
    ...currentFilters, // Garde filtres actifs
    page: newPage,
    limit: 20
  });
};

// Dans le JSX
<div className="flex justify-between items-center mt-4">
  <p className="text-sm text-gray-600">
    Affichage {((pagination.page - 1) * pagination.limit) + 1}-
    {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total}
  </p>
  
  <div className="flex gap-2">
    <Button
      variant="outline"
      size="sm"
      disabled={pagination.page === 1}
      onClick={() => handlePageChange(pagination.page - 1)}
    >
      Précédent
    </Button>
    <Button
      variant="outline"
      size="sm"
      disabled={pagination.page * pagination.limit >= pagination.total}
      onClick={() => handlePageChange(pagination.page + 1)}
    >
      Suivant
    </Button>
  </div>
</div>
```

---

### **7. CRÉATION DEMANDE**

#### ❌ AVANT (Fonction locale vide)
```typescript
const handleNewDemande = (demande: DemandeAchatForm) => {
  console.log('Nouvelle demande:', demande);
  setShowNewForm(false);
};
```

#### ✅ APRÈS (Appel API)
```typescript
/**
 * ➕ CRÉER DEMANDE
 * 
 * ENDPOINT: POST /api/demandes
 * BODY:
 * {
 *   agence: "GHANA",
 *   type: "NORMALE",
 *   objet: "...",
 *   justification: "...",
 *   date_besoin: "2025-12-31",
 *   lignes: [...]
 * }
 * 
 * RÉPONSE:
 * {
 *   message: "Demande créée avec succès",
 *   data: { id: 123, reference: "DA-2025-001", ... }
 * }
 */
const handleNewDemande = async (formData: any) => {
  try {
    // Formatter données selon CreateDemandeRequest
    const requestData: CreateDemandeRequest = {
      agence: agence as any,
      type: formData.type,
      objet: formData.objet,
      justification: formData.justification,
      date_besoin: formData.date_besoin,
      lignes: formData.lignes
    };
    
    console.log('[AchatsView] Création demande:', requestData);
    
    // Appel API
    const newDemande = await createDemande(requestData);
    
    console.log('[AchatsView] Demande créée:', newDemande.reference);
    
    // Fermer modal
    setShowNewForm(false);
    
    // Recharger liste
    await loadData();
    
    // Toast success déjà affiché par le hook
  } catch (error) {
    console.error('[AchatsView] Erreur création:', error);
    // Toast error déjà affiché par le hook
  }
};
```

**FLUX COMPLET**:
```
1. User clic "Nouvelle demande"
   → setShowNewForm(true)
   
2. User remplit formulaire
   
3. User clic "Créer"
   → handleNewDemande(formData)
   → createDemande(requestData)
   → POST /api/demandes
   
4. API retourne demande créée
   → Toast "Demande créée avec succès !"
   → Ferme modal
   → Recharge liste
```

---

### **8. SUPPRESSION DEMANDE**

#### ❌ AVANT (Console.log)
```typescript
const handleDeleteDemande = (id: string) => {
  console.log('Suppression:', id);
};
```

#### ✅ APRÈS (Appel API)
```typescript
/**
 * 🗑️ SUPPRIMER DEMANDE
 * 
 * ENDPOINT: DELETE /api/demandes/:id
 * 
 * CONDITIONS:
 *   - Demande doit être en statut "brouillon"
 *   - User doit être le demandeur
 * 
 * RÉPONSE:
 * {
 *   message: "Demande supprimée avec succès"
 * }
 */
const handleDeleteDemande = async (id: number) => {
  // Confirmation
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
    return;
  }
  
  try {
    console.log('[AchatsView] Suppression demande:', id);
    
    // Appel API
    await deleteDemande(id);
    
    console.log('[AchatsView] Demande supprimée');
    
    // Toast success déjà affiché par le hook
    // Liste déjà mise à jour par le hook
    
  } catch (error) {
    console.error('[AchatsView] Erreur suppression:', error);
    // Toast error déjà affiché par le hook
  }
};
```

**GESTION ERREURS**:
- 400 → "Seules les demandes en brouillon peuvent être supprimées"
- 403 → "Vous n'êtes pas autorisé à supprimer cette demande"
- 404 → "Demande non trouvée"

---

### **9. SOUMISSION DEMANDE**

#### ✅ NOUVELLE FONCTION
```typescript
/**
 * 📤 SOUMETTRE DEMANDE
 * 
 * ENDPOINT: POST /api/demandes/:id/submit
 * 
 * EFFET:
 *   statut: "brouillon" → "en_validation_niveau_1"
 * 
 * RÉPONSE:
 * {
 *   message: "Demande soumise pour validation",
 *   data: { ..., statut: "en_validation_niveau_1" }
 * }
 */
const handleSubmitDemande = async (id: number) => {
  try {
    console.log('[AchatsView] Soumission demande:', id);
    
    // Appel API
    await submitDemande(id);
    
    console.log('[AchatsView] Demande soumise');
    
    // Recharger liste pour refléter nouveau statut
    await loadData();
    
  } catch (error) {
    console.error('[AchatsView] Erreur soumission:', error);
  }
};
```

---

### **10. AFFICHAGE DÉTAIL**

#### ❌ AVANT (Sélection directe)
```typescript
const handleViewDemande = (demande: DemandeAchatComplete) => {
  setSelectedDemande(demande);
};
```

#### ✅ APRÈS (Chargement API)
```typescript
/**
 * 👁️ AFFICHER DÉTAIL
 * 
 * ENDPOINT: GET /api/demandes/:id
 * 
 * RÉPONSE:
 * {
 *   id: 123,
 *   reference: "DA-2025-001",
 *   ...
 *   lignes: [...],
 *   historique_validations: [...]
 * }
 */
const handleViewDemande = async (id: number) => {
  try {
    console.log('[AchatsView] Chargement détail demande:', id);
    
    // Appel API
    const demande = await fetchDemandeById(id);
    
    console.log('[AchatsView] Détail chargé:', demande.reference);
    
    // Ouvrir modal
    setSelectedDemande(demande);
    
  } catch (error) {
    console.error('[AchatsView] Erreur chargement détail:', error);
  }
};
```

---

### **11. LOADING STATES**

#### ✅ AFFICHAGE LOADING
```typescript
// Pendant chargement initial
if (loading && !demandes.length) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Chargement des demandes...</p>
      </div>
    </div>
  );
}

// Pendant refresh
{loading && demandes.length > 0 && (
  <div className="absolute top-4 right-4">
    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
  </div>
)}

// Dans tableau
{demandes.length === 0 && !loading && (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-500">Aucune demande trouvée</p>
  </div>
)}
```

---

## 📊 RÉSUMÉ ENDPOINTS UTILISÉS

| Action | Endpoint | Méthode | Params | Response |
|--------|----------|---------|--------|----------|
| **Liste** | `/api/demandes` | GET | `?agence=GHANA&page=1&limit=20` | `{data:[...], total, page, limit}` |
| **Filtrer** | `/api/demandes` | GET | `?statut=validee` | `{data:[...], ...}` |
| **Rechercher** | `/api/demandes` | GET | `?search=fournitures` | `{data:[...], ...}` |
| **Détail** | `/api/demandes/:id` | GET | - | `{id, reference, lignes, ...}` |
| **Créer** | `/api/demandes` | POST | Body: `CreateDemandeRequest` | `{message, data}` |
| **Modifier** | `/api/demandes/:id` | PUT | Body: `UpdateDemandeRequest` | `{message, data}` |
| **Supprimer** | `/api/demandes/:id` | DELETE | - | `{message}` |
| **Soumettre** | `/api/demandes/:id/submit` | POST | - | `{message, data}` |
| **KPIs** | `/api/dashboard/stats` | GET | `?agence=GHANA` | `{demandes_en_attente, ...}` |

---

## ✅ CHECKLIST INTÉGRATION

- [ ] Imports modifiés (hooks, types API)
- [ ] Hook `useDemandesAchats` ajouté
- [ ] Hook `useAuth` ajouté
- [ ] `useEffect` chargement initial
- [ ] `useEffect` changement agence
- [ ] Fonction `loadData()`
- [ ] Fonction `applyFilters()`
- [ ] Fonction `handleSearch()`
- [ ] Fonction `handlePageChange()`
- [ ] Fonction `handleNewDemande()` avec API
- [ ] Fonction `handleDeleteDemande()` avec API
- [ ] Fonction `handleSubmitDemande()` avec API
- [ ] Fonction `handleViewDemande()` avec API
- [ ] Loading states partout
- [ ] Affichage pagination
- [ ] Gestion erreurs
- [ ] Console.log debug

---

**PROCHAINE ÉTAPE**: Générer le code complet intégré
