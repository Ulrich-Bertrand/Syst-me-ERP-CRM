# 🔗 INTÉGRATION FRONTEND-BACKEND

Guide complet de l'intégration API avec le frontend React/Next.js

---

## 📋 ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND                          │
│              (Next.js + React)                      │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Pages (Next.js)                            │  │
│  │  - /pages/login.tsx                         │  │
│  │  - /pages/dashboard.tsx                     │  │
│  │  - /pages/achats/*                          │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                              │
│  ┌──────────────────────────────────────────────┐  │
│  │  Contexts                                    │  │
│  │  - AuthContext (gestion auth)               │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                              │
│  ┌──────────────────────────────────────────────┐  │
│  │  Services API (/services/api/)              │  │
│  │  - config.ts (axios + intercepteurs)        │  │
│  │  - auth.api.ts                              │  │
│  │  - demandes.api.ts                          │  │
│  │  - validations.api.ts                       │  │
│  │  - dashboard.api.ts                         │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                              │
└─────────────────────┼───────────────────────────────┘
                      │ HTTP/REST
                      │ (axios)
                      ↓
┌─────────────────────────────────────────────────────┐
│                   BACKEND                           │
│              (Express + PostgreSQL)                 │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Routes                                      │  │
│  │  - auth.routes.js                           │  │
│  │  - demandes.routes.js                       │  │
│  │  - validations.routes.js                    │  │
│  │  - dashboard.routes.js                      │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                              │
│  ┌──────────────────────────────────────────────┐  │
│  │  Middlewares                                 │  │
│  │  - auth.js (JWT verification)               │  │
│  │  - permissions.js (profils)                 │  │
│  │  - validation.js (Zod)                      │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                              │
│  ┌──────────────────────────────────────────────┐  │
│  │  Controllers                                 │  │
│  │  - auth.controller.js                       │  │
│  │  - demandes.controller.js                   │  │
│  │  - validations.controller.js                │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                              │
│  ┌──────────────────────────────────────────────┐  │
│  │  Services (Logique métier)                  │  │
│  │  - auth.service.js                          │  │
│  │  - demandes.service.js                      │  │
│  │  - validations.service.js                   │  │
│  └──────────────────────────────────────────────┘  │
│                      ↓                              │
│  ┌──────────────────────────────────────────────┐  │
│  │  Database (PostgreSQL)                      │  │
│  │  - 15 tables                                │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 AUTHENTIFICATION

### **Flow complet**

```
1. User saisit email/password
   ↓
2. Frontend : authApi.login(email, password)
   ↓
3. Backend : POST /api/auth/login
   - Vérifie email + password (bcrypt)
   - Génère JWT token
   - Retourne { user, token }
   ↓
4. Frontend : AuthContext
   - Sauvegarde token dans localStorage
   - Configure axios header Authorization
   - Redirige vers dashboard
   ↓
5. Toutes les requêtes suivantes incluent token
   Authorization: Bearer <token>
   ↓
6. Backend : Middleware authenticateJWT
   - Vérifie token
   - Décode userId
   - Charge user depuis DB
   - Ajoute req.user
```

### **Code frontend (AuthContext)**

```typescript
// /contexts/AuthContext.tsx
const login = async (credentials: LoginCredentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email: credentials.email,
    password: credentials.password
  });

  const { user, token } = response.data;

  // Sauvegarder
  setToken(token);
  setUser(user);
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
  
  // Configurer axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  router.push('/');
};
```

### **Code backend (auth.service.js)**

```javascript
// /api/src/services/auth.service.js
async login(email, password) {
  // Récupérer user
  const user = await query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
  
  // Vérifier password
  const isValid = await bcrypt.compare(password, user.password);
  
  // Générer token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return { user, token };
}
```

---

## 📡 SERVICES API FRONTEND

### **Configuration centralisée**

```typescript
// /services/api/config.ts
const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 30000
});

// Intercepteur : ajouter token automatiquement
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : gérer erreurs 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré → Déconnecter
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### **Service Demandes**

```typescript
// /services/api/demandes.api.ts
class DemandesApiService {
  async getAll(filters?: GetDemandesFilters) {
    const queryParams = buildQueryParams(filters);
    const response = await apiClient.get(`/demandes${queryParams}`);
    return response.data;
  }

  async create(data: CreateDemandeRequest) {
    const response = await apiClient.post('/demandes', data);
    return response.data;
  }

  async submit(id: number) {
    const response = await apiClient.post(`/demandes/${id}/submit`);
    return response.data;
  }
}

export const demandesApi = new DemandesApiService();
```

---

## 🎨 UTILISATION DANS COMPOSANTS

### **Exemple : Dashboard**

```typescript
// /pages/dashboard.tsx
export default function DashboardPage() {
  const { agence } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [agence]); // Recharger quand agence change

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Appel API réel
      const statsData = await dashboardApi.getStats({ agence });
      setStats(statsData);
    } catch (error) {
      toast.error('Erreur chargement données');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <StatsCards stats={stats} />
      )}
    </div>
  );
}
```

### **Exemple : Créer demande**

```typescript
// /pages/achats/demandes/creer.tsx
const handleSubmit = async (data) => {
  try {
    setSubmitting(true);
    
    // Appel API
    const result = await demandesApi.create({
      agence,
      type: data.type,
      objet: data.objet,
      justification: data.justification,
      date_besoin: data.date_besoin,
      lignes: data.lignes
    });
    
    toast.success(result.message);
    router.push('/achats/demandes');
  } catch (error) {
    toast.error(handleApiError(error));
  } finally {
    setSubmitting(false);
  }
};
```

---

## 🛡️ GESTION PERMISSIONS

### **Frontend : ProtectedRoute**

```typescript
// /components/ProtectedRoute.tsx
export function ProtectedRoute({ 
  children, 
  requiredProfile 
}: ProtectedRouteProps) {
  const { isAuthenticated, hasProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requiredProfile && !hasProfile(requiredProfile)) {
        router.push('/unauthorized');
      }
    }
  }, [loading, isAuthenticated, requiredProfile]);

  if (loading) return <Loader />;
  if (!isAuthenticated) return null;
  if (requiredProfile && !hasProfile(requiredProfile)) return null;

  return <>{children}</>;
}
```

**Utilisation** :

```typescript
<ProtectedRoute requiredProfile="profile_purchases_create">
  <CreateDemandePage />
</ProtectedRoute>
```

### **Backend : Middleware permissions**

```javascript
// /api/src/middlewares/permissions.js
const requireProfile = (profileName) => {
  return (req, res, next) => {
    if (!req.user[profileName]) {
      return res.status(403).json({ 
        error: `Profil "${profileName}" requis` 
      });
    }
    next();
  };
};
```

**Utilisation dans routes** :

```javascript
router.post(
  '/demandes',
  authenticateJWT,
  requireProfile('profile_purchases_create'),
  demandesController.create
);
```

---

## 🔄 WORKFLOW COMPLET : CRÉER DEMANDE

### **1. Frontend : Formulaire**

```typescript
const [formData, setFormData] = useState({
  type: 'NORMALE',
  objet: '',
  justification: '',
  date_besoin: '',
  lignes: []
});

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Validation locale
    if (!formData.objet || formData.lignes.length === 0) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    // Appel API
    const result = await demandesApi.create({
      agence: agence,
      ...formData
    });
    
    toast.success('Demande créée avec succès !');
    router.push(`/achats/demandes/${result.data.id}`);
  } catch (error) {
    toast.error(handleApiError(error));
  }
};
```

### **2. Service API**

```typescript
// /services/api/demandes.api.ts
async create(data: CreateDemandeRequest) {
  const response = await apiClient.post('/demandes', data);
  return response.data;
}
```

### **3. Backend : Route**

```javascript
// /api/src/routes/demandes.routes.js
router.post(
  '/',
  authenticateJWT,                              // ✅ Vérifie token
  requireProfile('profile_purchases_create'), // ✅ Vérifie profil
  validate(createDemandeSchema),                 // ✅ Valide données
  demandesController.create                      // ✅ Exécute logique
);
```

### **4. Backend : Controller**

```javascript
// /api/src/controllers/demandes.controller.js
async create(req, res, next) {
  try {
    const demande = await demandesService.create(req.user.id, req.body);
    
    res.status(201).json({
      message: 'Demande créée avec succès',
      data: demande
    });
  } catch (error) {
    next(error);
  }
}
```

### **5. Backend : Service**

```javascript
// /api/src/services/demandes.service.js
async create(userId, data) {
  return await transaction(async (client) => {
    // Générer référence
    const reference = generateReference();
    
    // Créer demande
    const demande = await client.query(
      `INSERT INTO demandes_achat (...) VALUES (...)`,
      [reference, data.agence, userId, ...]
    );
    
    // Créer lignes
    for (const ligne of data.lignes) {
      await client.query(
        `INSERT INTO lignes_demande_achat (...) VALUES (...)`,
        [demande.id, ligne.designation, ...]
      );
    }
    
    return demande;
  });
}
```

---

## 🔄 SYNCHRONISATION AGENCE

### **Problème**

User change d'agence dans le frontend → Données doivent se mettre à jour

### **Solution : useEffect + dependencies**

```typescript
const { agence } = useAuth();
const [data, setData] = useState([]);

useEffect(() => {
  loadData();
}, [agence]); // ← Recharger quand agence change

const loadData = async () => {
  const result = await demandesApi.getAll({ agence });
  setData(result.data);
};
```

### **Backend : Filtrage automatique**

```javascript
// Si agence fournie en query
const agenceFilter = req.query.agence 
  ? `AND da.agence = '${req.query.agence}'`
  : '';

const result = await query(
  `SELECT * FROM demandes_achat da WHERE 1=1 ${agenceFilter}`
);
```

---

## 📊 PAGINATION

### **Frontend**

```typescript
const [page, setPage] = useState(1);
const [limit] = useState(20);
const [data, setData] = useState({ data: [], total: 0 });

useEffect(() => {
  loadData();
}, [page, agence]);

const loadData = async () => {
  const result = await demandesApi.getAll({
    agence,
    page,
    limit
  });
  setData(result);
};

// Pagination UI
<div>
  <button 
    disabled={page === 1}
    onClick={() => setPage(p => p - 1)}
  >
    Précédent
  </button>
  
  <span>Page {page} / {Math.ceil(data.total / limit)}</span>
  
  <button 
    disabled={page * limit >= data.total}
    onClick={() => setPage(p => p + 1)}
  >
    Suivant
  </button>
</div>
```

### **Backend**

```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const offset = (page - 1) * limit;

const result = await query(
  `SELECT * FROM demandes_achat 
   ORDER BY date_demande DESC 
   LIMIT $1 OFFSET $2`,
  [limit, offset]
);

const countResult = await query(
  `SELECT COUNT(*) as total FROM demandes_achat`
);

return {
  data: result.rows,
  total: parseInt(countResult.rows[0].total),
  page,
  limit
};
```

---

## ⚠️ GESTION ERREURS

### **Helper frontend**

```typescript
// /services/api/config.ts
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Une erreur est survenue';
};
```

**Utilisation** :

```typescript
try {
  await demandesApi.create(data);
} catch (error) {
  toast.error(handleApiError(error));
}
```

### **Backend : errorHandler middleware**

```javascript
// /api/src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Zod validation error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.errors
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token invalide'
    });
  }

  // Custom error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Default
  res.status(500).json({
    error: 'Erreur serveur interne'
  });
};
```

---

## 🎯 CHECKLIST INTÉGRATION

### **✅ Configuration**

- [x] `.env.local` frontend configuré (NEXT_PUBLIC_API_URL)
- [x] `.env` backend configuré (DB, JWT)
- [x] Base de données créée et initialisée
- [x] Données test insérées

### **✅ Services API**

- [x] `/services/api/config.ts` - Configuration axios
- [x] `/services/api/auth.api.ts` - Service auth
- [x] `/services/api/demandes.api.ts` - Service demandes
- [x] `/services/api/validations.api.ts` - Service validations
- [x] `/services/api/dashboard.api.ts` - Service dashboard

### **✅ Intégration pages**

- [x] `/pages/login.tsx` - Utilise authApi.login()
- [x] `/pages/dashboard.tsx` - Utilise dashboardApi
- [ ] `/pages/achats/demandes/*` - À intégrer
- [ ] `/pages/achats/validations/*` - À intégrer

### **✅ Backend**

- [x] API démarrée sur port 4000
- [x] Health check répond OK
- [x] Login fonctionne
- [x] Endpoints demandes fonctionnent
- [x] Endpoints validations fonctionnent

---

## 🎉 PROCHAINES ÉTAPES

1. ✅ Créer pages demandes d'achat complètes
2. ✅ Créer pages validations complètes
3. ⏳ Créer pages bons de commande
4. ⏳ Créer pages factures + Contrôle 3 voies
5. ⏳ Créer pages stock
6. ⏳ Implémenter modules restants

---

**L'intégration frontend-backend est OPÉRATIONNELLE ! 🚀**
