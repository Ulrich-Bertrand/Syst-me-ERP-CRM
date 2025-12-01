# 🏢 JOCYDERK ERP/CRM

Système ERP/CRM complet et entièrement paramétrable pour le groupe JOCYDERK (Ghana 🇬🇭, Côte d'Ivoire 🇨🇮, Burkina Faso 🇧🇫)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61dafb.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)

---

## ✨ Fonctionnalités principales

### 🔐 **Authentification & Sécurité**
- ✅ Login avec JWT tokens (expire 24h)
- ✅ Sélection agence + langue à la connexion
- ✅ Permissions granulaires (12+ profils)
- ✅ Protection routes automatique
- ✅ Switcher agence/langue sans déconnexion

### 📊 **Modules ERP/CRM**
- ✅ **Achats** : Demandes, Validations (3 niveaux), Bons de commande, Factures, Paiements
- ✅ **Stock** : Articles, Mouvements, Inventaires, Alertes
- 🚧 **Ventes** : Cotations, Factures clients
- 🚧 **Finance** : Comptabilité, Trésorerie
- 🚧 **Dossiers** : Gestion dossiers opérationnels
- 🚧 **Tiers** : Clients, Fournisseurs

### 🎨 **Design moderne**
- Interface utilisateur professionnelle
- Responsive design
- Thème cohérent (gradients, ombres, transitions)
- Icônes Lucide React
- Drapeaux emoji pour agences

---

## 🚀 Démarrage rapide

### **Installation**

```bash
# Cloner le repository
git clone <repository-url>

# Installer dépendances
npm install

# Créer .env.local
cp .env.local.example .env.local

# Lancer en mode dev
npm run dev
```

### **Accès application**

```
URL: http://localhost:3000
Login: consultantic@jocyderklogistics.com
Password: password123
Agence: GHANA 🇬🇭
Langue: Français 🇫🇷
```

📖 **Guide complet** : Voir [DEMARRAGE_RAPIDE.md](/DEMARRAGE_RAPIDE.md)

---

## 📁 Structure projet

```
/
├── pages/              # Pages Next.js
│   ├── _app.tsx       # Wrapper application
│   ├── index.tsx      # Redirection
│   ├── login.tsx      # Page connexion ⭐
│   ├── dashboard.tsx  # Tableau de bord ⭐
│   ├── profile.tsx    # Profil utilisateur
│   └── achats/        # Module Achats
│
├── components/         # Composants React
│   ├── Header.tsx     # Header application
│   ├── Sidebar.tsx    # Menu latéral
│   ├── Layout.tsx     # Layout wrapper
│   ├── ProtectedRoute.tsx  # Protection routes
│   └── achats/        # Composants Achats
│
├── contexts/           # Contexts React
│   └── AuthContext.tsx # Authentification ⭐
│
├── services/           # Services API
│   └── api/           # Client API axios
│
├── api/                # Backend API (Express + PostgreSQL)
│   ├── src/
│   │   ├── config/    # Configuration DB
│   │   ├── middlewares/ # Auth, Permissions, Upload
│   │   ├── services/  # Logique métier
│   │   ├── controllers/ # Controllers
│   │   └── routes/    # Routes Express
│   └── database/      # Scripts SQL
│
└── docs/              # Documentation
```

---

## 🛠️ Technologies

### **Frontend**
- **Framework** : Next.js 14 (React 18)
- **Language** : TypeScript 5.3
- **Styling** : Tailwind CSS 4.0
- **Icons** : Lucide React
- **HTTP Client** : Axios
- **Notifications** : Sonner
- **Forms** : React Hook Form + Zod

### **Backend**
- **Runtime** : Node.js
- **Framework** : Express.js
- **Database** : PostgreSQL 15
- **ORM** : pg (node-postgres)
- **Auth** : JWT + bcryptjs
- **Validation** : Zod
- **Upload** : Multer

---

## 🔑 Profils & Permissions

### **Profils Achats**
- `profile_purchases_create_da` - Créer demandes d'achat
- `profile_purchases_validate_level_1` - Validation niveau 1 (Purchasing Manager)
- `profile_purchases_validate_level_2` - Validation niveau 2 (CFO)
- `profile_purchases_validate_level_3` - Validation niveau 3 (General Manager)
- `profile_purchases_manage_po` - Gérer bons de commande
- `profile_purchases_manage_invoices` - Gérer factures
- `profile_purchases_manage_payments` - Gérer paiements

### **Profils Stock**
- `profile_stock_manage` - Gérer stock
- `profile_stock_view` - Voir stock

### **Autres profils**
- `profile_dossiers_manage` - Gérer dossiers
- `profile_cotations_manage` - Gérer cotations
- `profile_finance_view` - Voir finances
- `is_admin` - Administrateur

---

## 🌍 Multi-agences

### **Agences disponibles**

| Code | Nom complet | Pays | Drapeau |
|------|-------------|------|---------|
| `GHANA` | JOCYDERK LOGISTICS LTD GHANA | Ghana | 🇬🇭 |
| `COTE_IVOIRE` | Jocyderk Côte d'Ivoire | Côte d'Ivoire | 🇨🇮 |
| `BURKINA` | Jocyderk Burkina Faso | Burkina Faso | 🇧🇫 |

**Fonctionnalités** :
- Sélection à la connexion
- Changement à la volée (header switcher)
- Données filtrées automatiquement par agence
- Pas de déconnexion requise

---

## 🌐 Multi-langues

### **Langues supportées**

| Code | Langue | Drapeau |
|------|--------|---------|
| `fr` | Français | 🇫🇷 |
| `en` | English | 🇬🇧 |

**Fonctionnalités** :
- Sélection à la connexion
- Changement à la volée (header switcher)
- Interface traduite (TODO: i18n complet)

---

## 📊 Statistiques projet

| Composant | Fichiers | Lignes de code |
|-----------|----------|----------------|
| Frontend React | 40+ | ~12,900 |
| Services API Frontend | 9 | ~1,500 |
| Backend API | 19 | ~4,100 |
| Base de données | 2 | ~1,700 |
| Infrastructure | 10 | ~1,740 |
| Authentification | 9 | ~2,150 |
| Documentation | 25+ | ~30,000 |
| **TOTAL** | **115+** | **~54,090** |

---

## 🎯 Roadmap

### ✅ **Phase 1-4 : Fondations** (TERMINÉ)
- [x] Structure projet
- [x] Base de données PostgreSQL (15 tables)
- [x] Backend API (76 endpoints)
- [x] Authentification JWT
- [x] Permissions granulaires
- [x] Multi-agences + Multi-langues
- [x] Dashboard principal

### 🚧 **Phase 5 : Module Achats complet**
- [x] Dashboard Achats
- [x] Demandes d'achat (création, liste)
- [x] Validations (workflow 3 niveaux)
- [ ] Bons de commande
- [ ] Réceptions marchandises
- [ ] Factures fournisseurs
- [ ] Contrôle 3 voies automatique ⭐
- [ ] Paiements

### 📅 **Phase 6 : Module Stock**
- [ ] Dashboard Stock
- [ ] Gestion articles
- [ ] Mouvements stock
- [ ] Alertes réapprovisionnement
- [ ] Inventaires
- [ ] Calcul PMP automatique ⭐

### 📅 **Phase 7 : Autres modules**
- [ ] Ventes (Cotations, Factures clients)
- [ ] Finance (Comptabilité, Trésorerie)
- [ ] Dossiers opérationnels
- [ ] Tiers (Clients, Fournisseurs)
- [ ] Paramètres système

### 📅 **Phase 8 : Avancé**
- [ ] Workflows automatisés complets
- [ ] Reporting & Analytics
- [ ] Export Excel/PDF
- [ ] Notifications temps réel
- [ ] Mobile app (React Native)

---

## 📖 Documentation

### **Guides principaux**
- 📘 [Démarrage rapide](/DEMARRAGE_RAPIDE.md)
- 📗 [Phase 4 - Authentification complète](/PHASE4_AUTH_COMPLETE.md)
- 📙 [Phase 3 - Backend complet](/PHASE3_BACKEND_COMPLET.md)

### **Documentation technique**
- 📝 Base de données : `/api/database/SCHEMA.md`
- 📝 API Backend : `/api/README.md`
- 📝 Frontend : `/docs/FRONTEND.md`

---

## 🧪 Tests

### **Comptes de test**

```javascript
// Administrateur complet
{
  email: 'consultantic@jocyderklogistics.com',
  password: 'password123',
  profils: 'Tous'
}

// Demandeur simple
{
  email: 'demandeur@jocyderklogistics.com',
  password: 'password123',
  profils: 'Créer DA uniquement'
}

// Validateur niveau 1
{
  email: 'validator1@jocyderklogistics.com',
  password: 'password123',
  profils: 'Validation niveau 1'
}
```

---

## 🤝 Contribution

Ce projet est développé pour le groupe JOCYDERK.

**Contact** : consultantic@jocyderklogistics.com

---

## 📄 License

© 2025 JOCYDERK Group. Tous droits réservés.

---

## 🎉 Remerciements

Développé avec ❤️ pour digitaliser et optimiser les opérations du groupe JOCYDERK.

**Système 100% configurable, sans règles codées en dur !** 🚀
