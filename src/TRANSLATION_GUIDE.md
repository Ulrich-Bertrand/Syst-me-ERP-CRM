# 🌐 Guide du système de traduction FR/EN

## Vue d'ensemble

L'application ERP Jocyderk Logistics est entièrement bilingue avec support complet du **Français** et de l'**Anglais**.

## Fonctionnalités

### Changement de langue
- **Bouton de langue** dans le header en haut à droite
- Affiche le drapeau et le code de la langue actuelle (🇫🇷 FR ou 🇬🇧 EN)
- Menu déroulant pour basculer entre FR et EN
- **Traduction instantanée** de toute l'interface

### Éléments traduits

#### ✅ Interface complète
- **Header utilisateur** : profil, notifications, déconnexion
- **Sidebar** : tous les modules et sous-modules
- **Module Demandes d'achat** : 
  - Titres et sous-titres
  - Statistiques (cartes en haut)
  - Filtres de la sidebar
  - Recherche simple et avancée
  - En-têtes de tableau
  - Badges de statut
  - Tooltips
  - Messages d'alerte
  - Messages vides

## Utilisation dans le code

### 1. Importer le hook
```tsx
import { useLanguage } from '../../contexts/LanguageContext';
```

### 2. Utiliser dans le composant
```tsx
export function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('purchases.title')}</h1>
      <p>{t('purchases.subtitle')}</p>
    </div>
  );
}
```

### 3. Fonctions disponibles
- `t(key: string)` - Traduit une clé
- `language` - Langue actuelle ('fr' | 'en')
- `setLanguage(lang)` - Change la langue

## Structure des clés de traduction

### Modules
```
module.dashboard
module.crm
module.operations
module.purchases
module.sales
module.accounting
module.stock
module.hr
module.reports
module.config
```

### Sous-modules
```
module.purchases.requests
module.purchases.creditors
module.purchases.orders
module.sales.quotes
module.sales.debtors
module.sales.invoicing
```

### Module Achats
```
purchases.title
purchases.subtitle
purchases.stats.total
purchases.stats.toApprove
purchases.filter.all
purchases.filter.pending
purchases.search.placeholder
purchases.table.reference
purchases.status.pending
purchases.priority.urgent
```

### Notifications
```
notifications.title
notifications.unread
notifications.markAllRead
notifications.invoice.validated
notifications.payment.late
```

### Header utilisateur
```
user.profile
user.settings
user.logout
agency.select
```

### Commun
```
common.search
common.filter
common.export
common.save
common.cancel
common.loading
common.inDevelopment
```

## Ajout de nouvelles traductions

### Éditer `/contexts/LanguageContext.tsx`

```tsx
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Français
    'mymodule.title': 'Mon titre',
    'mymodule.button': 'Mon bouton',
  },
  en: {
    // English
    'mymodule.title': 'My title',
    'mymodule.button': 'My button',
  }
};
```

## Conventions de nommage

### Format des clés
```
categorie.souscategorie.element
```

### Exemples
```
module.crm                    // Nom de module
purchases.title               // Titre de page
purchases.stats.total         // Statistique
purchases.filter.pending      // Filtre
purchases.table.reference     // Colonne de tableau
purchases.status.approved     // Badge de statut
purchases.tooltip.view        // Tooltip
purchases.empty.title         // Message vide
```

## Test de la traduction

1. Lancer l'application
2. Cliquer sur le bouton de langue (🇫🇷 FR) en haut à droite
3. Sélectionner "English"
4. Vérifier que toute l'interface est traduite
5. Naviguer entre les modules pour vérifier la cohérence

## État actuel

### ✅ Traduit
- Header utilisateur complet
- Notifications
- Sélecteur d'agence
- Menu principal (sidebar)
- Module Demandes d'achat (100%)
- Messages "En développement"

### 🚧 À traduire (prochaines étapes)
- Module Dashboard
- Module CRM
- Module Opérations
- Module Plan comptable
- Module Débiteurs/Créanciers
- Autres modules selon les besoins

## Performance

- **Changement instantané** : pas de rechargement de page
- **Context API React** : état global partagé
- **Traductions en mémoire** : pas d'appel réseau
- **Optimisé** : seulement les composants actifs sont re-rendus

## Langues supportées

| Langue | Code | Drapeau | Nom natif |
|--------|------|---------|-----------|
| Français | `fr` | 🇫🇷 | Français |
| Anglais | `en` | 🇬🇧 | English |

## Extension future

Pour ajouter une nouvelle langue :

1. Ajouter le code langue dans le type `Language`
2. Ajouter les traductions dans l'objet `translations`
3. Ajouter la langue dans le menu du `UserHeader`

```tsx
const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }, // Nouvelle langue
];
```

---

**Date de création** : 27 novembre 2024  
**Auteur** : Système ERP Jocyderk Logistics  
**Version** : 1.0
