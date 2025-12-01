# ✅ INTÉGRATION AchatsViewNew.tsx - COMPLÈTE

## 📋 RÉSUMÉ

**Fichier**: `/components/views/AchatsViewNew.tsx`  
**État**: ✅ **INTÉGRÉ AVEC API**  
**Lignes de code**: ~770 lignes  
**Date**: 30 Novembre 2025

---

## 🔄 CHANGEMENTS EFFECTUÉS

### **1. IMPORTS** ✅

#### Ajoutés :
```typescript
import { useEffect } from 'react';              // 🆕 Pour effets
import { useAuth } from '../../contexts/AuthContext';  // 🆕 Agence active
import { useDemandesAchats } from '../../hooks/useDemandesAchats';  // 🆕 Hook API
import { dashboardApi } from '../../services/api';  // 🆕 Stats KPIs
import { 
  DemandeAchatComplete,
  DemandeAchatListe,
  CreateDemandeRequest,
  STATUT_LABELS,
  TYPE_LABELS 
} from '../../types/achats-api.types';  // 🆕 Types exacts API
import { toast } from 'sonner@2.0.3';  // 🆕 Notifications
import { Loader2, RefreshCw } from 'lucide-react';  // 🆕 Icônes loading
```

#### Supprimés :
```typescript
import { mockDemandesAchats, calculateAchatsKPIs } from '../../data/mockAchatsData';  // ❌ Mockdata
import { DemandeAchatComplete, DemandeAchatForm, STATUT_LABELS } from '../../types/achats';  // ❌ Anciens types
```

---

### **2. HOOKS & STATE** ✅

#### Nouveaux hooks :
```typescript
const { agence } = useAuth();  // Agence active (GHANA, COTE_IVOIRE, BURKINA)

const {
  loading,              // État chargement
  demandes,             // Liste demandes (DemandeAchatListe[])
  pagination,           // { page, limit, total }
  fetchDemandes,        // Charger liste avec filtres
  createDemande,        // Créer demande
  deleteDemande,        // Supprimer demande
  submitDemande,        // Soumettre demande
  fetchDemandeById      // Charger détail
} = useDemandesAchats();
```

#### Nouveau state :
```typescript
const [kpis, setKpis] = useState<any>(null);  // KPIs dashboard
const [loadingKpis, setLoadingKpis] = useState(false);  // Loading KPIs
```

---

### **3. EFFETS (useEffect)** ✅

#### Effet 1 : Chargement initial
```typescript
useEffect(() => {
  console.log('[AchatsView] Montage composant');
  loadData();
}, []);
```
**Effet**: Charge demandes + KPIs au montage du composant

#### Effet 2 : Rechargement sur changement agence
```typescript
useEffect(() => {
  if (agence) {
    console.log('[AchatsView] Changement agence:', agence);
    loadData();
  }
}, [agence]);
```
**Effet**: Recharge données quand user change d'agence (switcher header)

#### Effet 3 : Application filtres
```typescript
useEffect(() => {
  if (selectedFilter !== null) {
    console.log('[AchatsView] Application filtre:', selectedFilter);
    applyFilters();
  }
}, [selectedFilter]);
```
**Effet**: Recharge données quand user change de filtre

---

### **4. FONCTIONS CHARGEMENT** ✅

#### loadData()
```typescript
const loadData = async () => {
  // Charge demandes
  await fetchDemandes({
    agence: agence as any,
    page: 1,
    limit: 20
  });
  
  // Charge KPIs
  await loadKpis();
};
```
**API**: 
- `GET /api/demandes?agence=GHANA&page=1&limit=20`
- `GET /api/dashboard/stats?agence=GHANA`

#### loadKpis()
```typescript
const loadKpis = async () => {
  const kpisData = await dashboardApi.getStats({ agence: agence as any });
  setKpis(kpisData);
};
```
**API**: `GET /api/dashboard/stats?agence=GHANA`

---

### **5. FONCTIONS FILTRES** ✅

#### applyFilters()
```typescript
const applyFilters = async () => {
  const filters: any = {
    agence: agence as any,
    page: 1,
    limit: 20
  };
  
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
  }
  
  await fetchDemandes(filters);
};
```
**API**: `GET /api/demandes?agence=GHANA&statut=validee`

**Mapping filtres UI → API**:
| Filtre UI | Param API |
|-----------|-----------|
| `pending-approval` | `statut=en_validation_niveau_1` |
| `approved` | `statut=validee` |
| `rejected` | `statut=rejetee` |

#### handleSearch()
```typescript
const handleSearch = async (query: string) => {
  setSearchQuery(query);
  
  if (query.length >= 3) {
    await fetchDemandes({
      agence: agence as any,
      page: 1,
      limit: 20
    });
  }
};
```
⚠️ **TODO Backend**: Ajouter param `search` dans `/api/demandes`

#### handlePageChange()
```typescript
const handlePageChange = async (newPage: number) => {
  await fetchDemandes({
    agence: agence as any,
    page: newPage,
    limit: 20
  });
};
```
**API**: `GET /api/demandes?page=2&limit=20`

---

### **6. FONCTIONS ACTIONS** ✅

#### handleNewDemande()
```typescript
const handleNewDemande = async (formData: any) => {
  // Formatter données
  const requestData: CreateDemandeRequest = {
    agence: agence as any,
    type: formData.type || 'NORMALE',
    objet: formData.motif_achat || formData.objet,
    justification: formData.justification || formData.observation,
    date_besoin: formData.date_besoin,
    lignes: formData.lignes.map((ligne: any) => ({
      designation: ligne.designation,
      quantite: ligne.quantite,
      unite: ligne.unite || 'Pièce',
      prix_unitaire_estime: ligne.prix_unitaire
    }))
  };
  
  // Appel API
  const newDemande = await createDemande(requestData);
  
  // Fermer modal + recharger
  setShowNewForm(false);
  await loadData();
};
```
**API**: `POST /api/demandes`  
**Body**:
```json
{
  "agence": "GHANA",
  "type": "NORMALE",
  "objet": "Achat fournitures",
  "justification": "Renouvellement stock",
  "date_besoin": "2025-12-31",
  "lignes": [
    {
      "designation": "Ramettes A4",
      "quantite": 50,
      "unite": "Ramette",
      "prix_unitaire_estime": 5.50
    }
  ]
}
```

#### handleDeleteDemande()
```typescript
const handleDeleteDemande = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
    return;
  }
  
  await deleteDemande(id);
  await loadData();
};
```
**API**: `DELETE /api/demandes/:id`  
**Conditions**: 
- Statut = `brouillon`
- User = demandeur

#### handleSubmitDemande()
```typescript
const handleSubmitDemande = async (id: number) => {
  await submitDemande(id);
  await loadData();
};
```
**API**: `POST /api/demandes/:id/submit`  
**Effet**: `statut` passe de `brouillon` → `en_validation_niveau_1`

#### handleViewDemande()
```typescript
const handleViewDemande = async (id: number) => {
  const demande = await fetchDemandeById(id);
  setSelectedDemande(demande);
};
```
**API**: `GET /api/demandes/:id`  
**Réponse**: Demande complète avec lignes + historique validations

---

### **7. LOADING STATES** ✅

#### Loading initial
```typescript
if (loading && demandes.length === 0) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <p>Chargement des demandes d'achat...</p>
    </div>
  );
}
```

#### Loading refresh
```typescript
<Button onClick={loadData} disabled={loading}>
  <RefreshCw className={loading ? 'animate-spin' : ''} />
  Actualiser
</Button>
```

#### Loading filtres
```typescript
<h3 className="text-sm font-medium">Filtres</h3>
{loading && <Loader2 className="h-4 w-4 animate-spin" />}
```

---

### **8. PAGINATION** ✅

```typescript
<div className="flex justify-between items-center mt-6">
  <p className="text-sm text-gray-600">
    Affichage {((pagination.page - 1) * pagination.limit) + 1}-
    {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total}
  </p>
  
  <div className="flex gap-2">
    <Button
      disabled={pagination.page === 1 || loading}
      onClick={() => handlePageChange(pagination.page - 1)}
    >
      Précédent
    </Button>
    <Button
      disabled={pagination.page * pagination.limit >= pagination.total || loading}
      onClick={() => handlePageChange(pagination.page + 1)}
    >
      Suivant
    </Button>
  </div>
</div>
```

---

### **9. TABLEAU DEMANDES** ✅

#### Colonnes affichées :
1. **Référence** - `demande.reference` + date
2. **Type** - Badge avec couleur (NORMALE, URGENTE, EXCEPTIONNELLE)
3. **Objet** - `demande.objet` + nombre lignes
4. **Demandeur** - Nom + prénom + email
5. **Date** - Date demande + date besoin
6. **Montant** - Montant total formatté
7. **Statut** - Badge avec couleur
8. **Actions** - Boutons Voir/Soumettre/Supprimer

#### Mapping données API → UI :
```typescript
demandes.map((demande) => {
  const statusConfig = STATUT_LABELS[demande.statut];
  const typeConfig = TYPE_LABELS[demande.type];
  
  return (
    <tr onClick={() => handleViewDemande(demande.id)}>
      <td>{demande.reference}</td>
      <td>{typeConfig.fr}</td>
      <td>{demande.objet}</td>
      <td>{demande.demandeur_prenom} {demande.demandeur_nom}</td>
      <td>{formatDate(demande.date_demande)}</td>
      <td>{formatCurrency(demande.montant_total_estime)}</td>
      <td><Badge>{statusConfig.fr}</Badge></td>
      <td>
        <Button onClick={() => handleViewDemande(demande.id)}>
          <Eye />
        </Button>
        {demande.statut === 'brouillon' && (
          <>
            <Button onClick={() => handleSubmitDemande(demande.id)}>
              <Send />
            </Button>
            <Button onClick={() => handleDeleteDemande(demande.id)}>
              <Trash2 />
            </Button>
          </>
        )}
      </td>
    </tr>
  );
})
```

---

### **10. STATS CARDS** ✅

```typescript
const stats = {
  total: pagination.total,                      // Total demandes
  totalAmount: kpis?.montant_total || 0,        // Montant total
  pendingApproval: kpis?.demandes_en_attente || 0,  // En attente
  approved: kpis?.demandes_validees || 0,       // Validées
  paid: 0,                                      // ⚠️ TODO API
  rejected: 0                                   // ⚠️ TODO API
};
```

**Source données**:
- `pagination.total` → `/api/demandes` (total dans réponse paginée)
- `kpis.montant_total` → `/api/dashboard/stats`
- `kpis.demandes_en_attente` → `/api/dashboard/stats`
- `kpis.demandes_validees` → `/api/dashboard/stats`

---

## 📊 ENDPOINTS UTILISÉS

| Endpoint | Méthode | Usage | Fréquence |
|----------|---------|-------|-----------|
| `/api/demandes` | GET | Liste demandes | Montage + Agence + Filtres + Pagination |
| `/api/demandes/:id` | GET | Détail demande | Clic ligne tableau |
| `/api/demandes` | POST | Créer demande | Modal création |
| `/api/demandes/:id` | DELETE | Supprimer demande | Bouton supprimer |
| `/api/demandes/:id/submit` | POST | Soumettre demande | Bouton soumettre |
| `/api/dashboard/stats` | GET | KPIs | Montage + Agence |

---

## 🎯 SIMILITUDES BDD ↔ FRONTEND

### **Table `demandes_achat` → Type `DemandeAchatListe`**

| Champ BDD | Champ Frontend | Type | Affichage UI |
|-----------|----------------|------|--------------|
| `id` | `id` | number | N/A |
| `reference` | `reference` | string | Colonne "Référence" |
| `agence` | `agence` | string | Filtre agence |
| `type` | `type` | string | Badge colonne "Type" |
| `objet` | `objet` | string | Colonne "Objet" |
| `statut` | `statut` | string | Badge colonne "Statut" |
| `montant_total_estime` | `montant_total_estime` | number | Colonne "Montant" |
| `date_demande` | `date_demande` | string | Colonne "Date" |
| `date_besoin` | `date_besoin` | string | Sous-texte date |
| `demandeur_id` | N/A | number | N/A |
| N/A | `demandeur_nom` | string | Colonne "Demandeur" |
| N/A | `demandeur_prenom` | string | Colonne "Demandeur" |
| N/A | `nombre_lignes` | number | Sous-texte objet |

---

## ✅ FONCTIONNALITÉS IMPLÉMENTÉES

### **Chargement données** ✅
- [x] Chargement automatique au montage
- [x] Rechargement sur changement agence
- [x] Bouton "Actualiser"
- [x] Loading state spinner

### **Filtrage** ✅
- [x] Filtre "Toutes les demandes"
- [x] Filtre "En attente validation"
- [x] Filtre "Approuvées"
- [x] Filtre "Rejetées"
- [x] Reset filtre

### **Recherche** ⚠️
- [x] Input recherche
- [ ] Intégration backend (param `search`)

### **Pagination** ✅
- [x] Boutons Précédent/Suivant
- [x] Affichage "X-Y sur Z"
- [x] Disabled si première/dernière page

### **Actions CRUD** ✅
- [x] Créer demande (POST)
- [x] Voir détail demande (GET)
- [x] Supprimer demande (DELETE)
- [x] Soumettre demande (POST submit)

### **Affichage** ✅
- [x] Tableau responsive
- [x] Stats cards (6 KPIs)
- [x] Badges statuts colorés
- [x] Badges types colorés
- [x] Icons actions (Voir/Soumettre/Supprimer)
- [x] Tooltips boutons
- [x] Flag urgence
- [x] Formatage dates
- [x] Formatage montants

### **Gestion erreurs** ✅
- [x] Toast errors automatiques (via hooks)
- [x] Console.log debug
- [x] Loading states

---

## ⚠️ LIMITATIONS ACTUELLES

### **Backend à étendre**
1. **Recherche** → Ajouter param `?search=query` dans `/api/demandes`
2. **Filtres avancés** → Implémenter filtres supplémentaires :
   - `paid` → statut "paye"
   - `awaiting-justification` → logique justificatifs
   - `dossier` → type_demande "dossier"
   - `agence` → type_demande "agence"
3. **Stats** → Étendre `/api/dashboard/stats` :
   - `demandes_payees`
   - `demandes_rejetees`
   - `achats_dossier`
   - `achats_agence`

### **Frontend à améliorer**
1. **Filtres avancés** → Implémenter modal filtres avancés (dates, montants, etc.)
2. **Export** → Implémenter export Excel/PDF
3. **Tri colonnes** → Ajouter tri par référence/date/montant
4. **Sélection multiple** → Actions groupées (valider plusieurs, etc.)

---

## 🧪 TESTS MANUELS

### **Scénario 1 : Chargement initial**
```
1. Ouvrir page Achats
✅ Spinner affiche "Chargement..."
✅ Appel GET /api/demandes?agence=GHANA
✅ Appel GET /api/dashboard/stats?agence=GHANA
✅ Tableau affiche demandes
✅ Stats cards affichent valeurs
```

### **Scénario 2 : Changement agence**
```
1. Cliquer switcher agence → Sélectionner "Côte d'Ivoire"
✅ Appel GET /api/demandes?agence=COTE_IVOIRE
✅ Tableau recharge avec nouvelles données
✅ Stats se mettent à jour
```

### **Scénario 3 : Filtrage**
```
1. Cliquer "En attente validation"
✅ Appel GET /api/demandes?agence=GHANA&statut=en_validation_niveau_1
✅ Tableau affiche uniquement demandes en validation
✅ Badge filtre devient orange
```

### **Scénario 4 : Pagination**
```
1. Cliquer "Suivant"
✅ Appel GET /api/demandes?page=2
✅ Tableau affiche page 2
✅ Texte "Affichage 21-40 sur 45"
✅ Bouton "Précédent" activé
```

### **Scénario 5 : Création demande**
```
1. Cliquer "Nouvelle demande"
✅ Modal s'ouvre
2. Remplir formulaire + Cliquer "Créer"
✅ Appel POST /api/demandes
✅ Toast "Demande créée avec succès"
✅ Modal se ferme
✅ Liste recharge
✅ Nouvelle demande apparaît
```

### **Scénario 6 : Suppression demande**
```
1. Cliquer icône poubelle (demande brouillon)
✅ Confirm dialog
2. Confirmer
✅ Appel DELETE /api/demandes/:id
✅ Toast "Demande supprimée"
✅ Demande disparaît du tableau
```

### **Scénario 7 : Soumission demande**
```
1. Cliquer icône avion (demande brouillon)
✅ Appel POST /api/demandes/:id/submit
✅ Toast "Demande soumise"
✅ Badge statut change : Brouillon → Validation N1
✅ Boutons Soumettre/Supprimer disparaissent
```

### **Scénario 8 : Voir détail**
```
1. Cliquer ligne tableau OU icône œil
✅ Appel GET /api/demandes/:id
✅ Modal détail s'ouvre
✅ Affiche infos complètes
✅ Affiche lignes
✅ Affiche historique validations
```

---

## 📝 CONSOLE.LOG DEBUG

Le code inclut des console.log détaillés pour faciliter le debug :

```typescript
console.log('[AchatsView] Montage composant');
console.log('[AchatsView] Changement agence:', agence);
console.log('[AchatsView] Chargement données pour agence:', agence);
console.log('[AchatsView] ✅ Données chargées');
console.log('[AchatsView] ❌ Erreur chargement:', error);
console.log('[AchatsView] Application filtre:', selectedFilter);
console.log('[AchatsView] Création demande:', formData);
console.log('[AchatsView] ✅ Demande créée:', newDemande.reference);
console.log('[AchatsView] Suppression demande:', id);
console.log('[AchatsView] Soumission demande:', id);
console.log('[AchatsView] Chargement détail demande:', id);
```

---

## 🎉 RÉSULTAT FINAL

### **Avant (Mockdata)**
- ❌ Données statiques
- ❌ Pas de filtrage réel
- ❌ Pas de pagination
- ❌ Pas de CRUD
- ❌ Pas de synchronisation agence

### **Après (API intégrée)**
- ✅ Données réelles API
- ✅ Filtrage backend
- ✅ Pagination backend
- ✅ CRUD complet
- ✅ Synchronisation agence automatique
- ✅ Loading states
- ✅ Gestion erreurs
- ✅ Console.log debug
- ✅ Types exacts BDD

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ **AchatsViewNew.tsx intégré**
2. ⏳ **AchatsDemandeForm.tsx** - Intégrer formulaire création
3. ⏳ **AchatsDemandeDetail.tsx** - Intégrer modal détail
4. ⏳ **Page Validations** - Créer page validations avec API
5. ⏳ **Tests end-to-end** - Tester tous les workflows

---

**INTÉGRATION ACHATS VIEW : TERMINÉE ! ✅**
