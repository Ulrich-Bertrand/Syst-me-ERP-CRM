import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  ChevronRight, ChevronDown, Edit, Eye, Trash2, FileText,
  BarChart3, PieChart, ListTree, BookOpen
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}

interface Account {
  id: string;
  number: string;
  name: string;
  balance: number;
  type: 'bilan' | 'resultat';
  category: string;
  subcategory: string;
  accountType: 'titre' | 'debut-total' | 'validation' | 'fin-total';
  totalisation?: string;
  level: number;
  parentId?: string;
  children?: Account[];
}

export function PlanComptableView() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
    new Set(['100000', '100002', '100003', '160003'])
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['bilan', 'actifs', 'fonds-propres'])
  );

  const categories = [
    {
      id: 'bilan',
      label: 'Bilan',
      icon: BarChart3,
      color: 'text-blue-600',
      children: [
        { 
          id: 'actifs', 
          label: 'Actifs', 
          count: 89,
          children: [
            { id: 'immobilisations', label: 'Immobilisations', count: 34 },
            { id: 'stocks', label: 'Stocks', count: 12 },
            { id: 'creances', label: 'Créances', count: 23 },
            { id: 'tresorerie', label: 'Trésorerie', count: 20 },
          ]
        },
        { 
          id: 'fonds-propres', 
          label: 'Fonds propres', 
          count: 12,
          children: [
            { id: 'capitaux-propres', label: 'Capitaux propres', count: 8 },
            { id: 'autres-fonds-propres', label: 'Autres fonds propres', count: 4 },
          ]
        },
        { 
          id: 'passif', 
          label: 'Passif', 
          count: 45,
          children: [
            { id: 'emprunts-dettes', label: 'Emprunts et dettes', count: 25 },
            { id: 'dettes-fournisseurs', label: 'Dettes fournisseurs', count: 20 },
          ]
        },
      ]
    },
    {
      id: 'resultat',
      label: 'Résultat',
      icon: PieChart,
      color: 'text-green-600',
      children: [
        { 
          id: 'produits', 
          label: 'Produits', 
          count: 67,
          children: [
            { id: 'produits-exploitation', label: 'Produits d\'exploitation', count: 45 },
            { id: 'produits-financiers', label: 'Produits financiers', count: 12 },
            { id: 'produits-exceptionnels', label: 'Produits exceptionnels', count: 10 },
          ]
        },
        { 
          id: 'charges', 
          label: 'Charges', 
          count: 123,
          children: [
            { id: 'charges-exploitation', label: 'Charges d\'exploitation', count: 89 },
            { id: 'charges-financieres', label: 'Charges financières', count: 23 },
            { id: 'charges-exceptionnelles', label: 'Charges exceptionnelles', count: 11 },
          ]
        },
      ]
    }
  ];

  const mockAccounts: Account[] = [
    // BILAN
    {
      id: '100000',
      number: '100000',
      name: 'BILAN',
      balance: 0,
      type: 'bilan',
      category: 'Bilan',
      subcategory: '',
      accountType: 'titre',
      level: 0,
      children: []
    },
    // ACTIFS
    {
      id: '100002',
      number: '100002',
      name: 'ACTIFS',
      balance: 0,
      type: 'bilan',
      category: 'Actifs',
      subcategory: 'Immobilisations',
      accountType: 'debut-total',
      level: 1,
      parentId: '100000',
      children: []
    },
    // Capitaux propres
    {
      id: '100003',
      number: '100003',
      name: 'Capitaux propres',
      balance: 0,
      type: 'bilan',
      category: 'Fonds propres',
      subcategory: 'Capitaux propres',
      accountType: 'debut-total',
      level: 2,
      parentId: '100002',
      children: []
    },
    {
      id: '101000',
      number: '101000',
      name: 'Capital social',
      balance: 500000.00,
      type: 'bilan',
      category: 'Fonds propres',
      subcategory: 'Capitaux propres',
      accountType: 'validation',
      level: 3,
      parentId: '100003'
    },
    {
      id: '106000',
      number: '106000',
      name: 'Réserves',
      balance: 125000.00,
      type: 'bilan',
      category: 'Fonds propres',
      subcategory: 'Capitaux propres',
      accountType: 'validation',
      level: 3,
      parentId: '100003'
    },
    {
      id: '120000',
      number: '120000',
      name: 'Résultat de l\'exercice',
      balance: 85000.00,
      type: 'bilan',
      category: 'Fonds propres',
      subcategory: 'Capitaux propres',
      accountType: 'validation',
      level: 3,
      parentId: '100003'
    },
    {
      id: '145000',
      number: '145000',
      name: 'Compte dérogatoire',
      balance: 0,
      type: 'bilan',
      category: 'Fonds propres',
      subcategory: 'Capitaux propres',
      accountType: 'validation',
      level: 3,
      parentId: '100003'
    },
    {
      id: '149990',
      number: '149990',
      name: 'Total capitaux propres',
      balance: 710000.00,
      type: 'bilan',
      category: 'Fonds propres',
      subcategory: 'Capitaux propres',
      accountType: 'fin-total',
      totalisation: '100003..149990',
      level: 2,
      parentId: '100003'
    },
    // Immobilisations
    {
      id: '155000',
      number: '155000',
      name: 'Impôts échelonnés',
      balance: 25000.00,
      type: 'bilan',
      category: 'Actifs',
      subcategory: 'Immobilisations',
      accountType: 'validation',
      level: 2,
      parentId: '100002'
    },
    // PASSIF
    {
      id: '160003',
      number: '160003',
      name: 'Passif',
      balance: 0,
      type: 'bilan',
      category: 'Actifs',
      subcategory: 'Immobilisations',
      accountType: 'debut-total',
      level: 1,
      parentId: '100000',
      children: []
    },
    {
      id: '164100',
      number: '164100',
      name: 'Emprunts auprès étab. crédit',
      balance: 250000.00,
      type: 'bilan',
      category: 'Actifs',
      subcategory: 'Immobilisations',
      accountType: 'validation',
      level: 2,
      parentId: '160003'
    },
    {
      id: '164400',
      number: '164400',
      name: 'Emprunts à long terme hypot.',
      balance: 180000.00,
      type: 'bilan',
      category: 'Actifs',
      subcategory: 'Immobilisations',
      accountType: 'validation',
      level: 2,
      parentId: '160003'
    },
    {
      id: '164800',
      number: '164800',
      name: 'Emprunt à court terme',
      balance: 45000.00,
      type: 'bilan',
      category: 'Actifs',
      subcategory: 'Immobilisations',
      accountType: 'validation',
      level: 2,
      parentId: '160003'
    },
    {
      id: '169980',
      number: '169980',
      name: 'Autres charges à payer et revenu dif...',
      balance: 12500.00,
      type: 'bilan',
      category: 'Actifs',
      subcategory: 'Immobilisations',
      accountType: 'validation',
      level: 2,
      parentId: '160003'
    },
    {
      id: '169990',
      number: '169990',
      name: 'Total dettes',
      balance: 487500.00,
      type: 'bilan',
      category: 'Emprunts et dettes',
      subcategory: 'Emprunts et dettes',
      accountType: 'fin-total',
      totalisation: '160003..169990',
      level: 1,
      parentId: '160003'
    },
  ];

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'titre': return 'Titre';
      case 'debut-total': return 'Début total';
      case 'validation': return 'Validation';
      case 'fin-total': return 'Fin total';
      default: return type;
    }
  };

  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case 'titre': 
        return 'bg-purple-100 text-purple-700';
      case 'debut-total': 
        return 'bg-blue-100 text-blue-700';
      case 'validation': 
        return 'bg-green-100 text-green-700';
      case 'fin-total': 
        return 'bg-orange-100 text-orange-700';
      default: 
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return '—';
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const toggleAccount = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getRowStyle = (account: Account) => {
    const baseStyle = "border-b border-gray-100 hover:bg-gray-50 transition-colors";
    
    if (account.accountType === 'titre') {
      return `${baseStyle} bg-purple-50 font-bold`;
    }
    if (account.accountType === 'debut-total') {
      return `${baseStyle} bg-blue-50 font-semibold`;
    }
    if (account.accountType === 'fin-total') {
      return `${baseStyle} bg-orange-50 font-semibold`;
    }
    return baseStyle;
  };

  const filteredAccounts = mockAccounts.filter(acc => {
    if (!selectedCategory) return true;
    return acc.category === selectedCategory || acc.subcategory === selectedCategory;
  });

  const renderAccountRow = (account: Account) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedAccounts.has(account.id);
    const indentLevel = account.level * 20;

    return (
      <tr key={account.id} className={getRowStyle(account)}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${indentLevel}px` }}>
            {hasChildren && (
              <button
                onClick={() => toggleAccount(account.id)}
                className="hover:bg-gray-200 rounded p-1 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6" />}
            <span className={`text-sm ${account.accountType === 'titre' || account.accountType === 'debut-total' || account.accountType === 'fin-total' ? 'font-semibold' : ''}`}>
              {account.number}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`text-sm ${account.accountType === 'titre' || account.accountType === 'debut-total' || account.accountType === 'fin-total' ? 'font-semibold' : ''}`}>
            {account.name}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <span className="text-sm">{formatAmount(account.balance)}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm capitalize">{account.type}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm">{account.category}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm">{account.subcategory}</span>
        </td>
        <td className="px-4 py-3">
          <Badge className={getAccountTypeBadge(account.accountType)}>
            {getAccountTypeLabel(account.accountType)}
          </Badge>
        </td>
        <td className="px-4 py-3">
          <span className="text-xs text-gray-500">{account.totalisation || ''}</span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <Tooltip text="Voir les détails du compte">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip text="Modifier le compte">
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip text="Plus d'options">
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg">Plan comptable</h2>
              <p className="text-sm text-gray-500">Gestion du plan comptable et des comptes</p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip text="Créer un nouveau compte">
                <Button variant="default" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau compte
                </Button>
              </Tooltip>
              <Tooltip text="Importer un plan comptable">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Importer
                </Button>
              </Tooltip>
              <Tooltip text="Exporter le plan comptable">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </Tooltip>
              <Tooltip text="Paramètres">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Categories */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Classification</h3>
            </div>

            <div className="space-y-1">
              {/* All Accounts */}
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ListTree className="h-4 w-4" />
                  <span className="text-sm">Tous les comptes</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {mockAccounts.length}
                </Badge>
              </button>

              {/* Categories */}
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                const isExpanded = expandedCategories.has(category.id);

                return (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={`h-4 w-4 ${category.color}`} />
                        <span className="text-sm font-medium">{category.label}</span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {category.children?.map((child) => {
                          const hasSubChildren = child.children && child.children.length > 0;
                          const isChildExpanded = expandedCategories.has(child.id);

                          return (
                            <div key={child.id}>
                              <button
                                onClick={() => {
                                  if (hasSubChildren) {
                                    toggleCategory(child.id);
                                  } else {
                                    setSelectedCategory(child.label);
                                  }
                                }}
                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                  selectedCategory === child.label
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {hasSubChildren && (
                                    <ChevronRight
                                      className={`h-3 w-3 transition-transform ${
                                        isChildExpanded ? 'rotate-90' : ''
                                      }`}
                                    />
                                  )}
                                  <span className="truncate">{child.label}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {child.count}
                                </Badge>
                              </button>

                              {hasSubChildren && isChildExpanded && (
                                <div className="ml-6 mt-1 space-y-1">
                                  {child.children?.map((subChild) => (
                                    <button
                                      key={subChild.id}
                                      onClick={() => setSelectedCategory(subChild.label)}
                                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                        selectedCategory === subChild.label
                                          ? 'bg-blue-50 text-blue-600'
                                          : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                    >
                                      <span className="truncate">{subChild.label}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {subChild.count}
                                      </Badge>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, nom de compte..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <Tooltip text="Filtrer les comptes">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">N°</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Nom</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Solde</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Compte de résultat/Bil...</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Catégorie du compte</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Sous-catégorie du compte</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Type compte</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Totalisation</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => renderAccountRow(account))}
                </tbody>
              </table>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total comptes</span>
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{mockAccounts.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Comptes Bilan</span>
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">
                  {mockAccounts.filter(a => a.type === 'bilan').length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Comptes Résultat</span>
                  <PieChart className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold">
                  {mockAccounts.filter(a => a.type === 'resultat').length}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Comptes actifs</span>
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">
                  {mockAccounts.filter(a => a.accountType === 'validation').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
