"use client"
import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  FileText, Clock, CheckCircle2, XCircle, AlertTriangle, Ban,
  Building2, Package, Eye, TrendingUp, Calendar, DollarSign,
  Truck, ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export function BonsCommandeView() {
  const [activeStatus, setActiveStatus] = useState('valides');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['materiel', 'services', 'marchandises'])
  );
  const [selectedCurrency, setSelectedCurrency] = useState('all');

  const categories = [
    {
      id: 'materiel',
      label: 'Matériel & Équipements',
      icon: Package,
      color: 'text-blue-600',
      count: 156
    },
    {
      id: 'services',
      label: 'Services',
      icon: TrendingUp,
      color: 'text-green-600',
      count: 89
    },
    {
      id: 'marchandises',
      label: 'Marchandises',
      icon: Truck,
      color: 'text-purple-600',
      count: 234
    },
  ];

  const currencies = [
    { code: 'all', label: 'Toutes devises', symbol: '💱' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'USD', label: 'Dollar US', symbol: '$' },
    { code: 'MAD', label: 'Dirham', symbol: 'DH' },
    { code: 'GBP', label: 'Livre Sterling', symbol: '£' }
  ];

  const mockCommandes = [
    {
      id: 'BC-2025-001',
      reference: 'BC-2025-001',
      supplier: 'Maritime Equipment Ltd',
      category: 'materiel',
      description: 'Container handling equipment',
      demandRef: 'DA-2025-045',
      orderDate: '15/11/2025',
      deliveryDate: '15/12/2025',
      amount: 45000.00,
      currency: 'EUR',
      received: 0.00,
      status: 'valides',
      priority: 'high',
      items: 5
    },
    {
      id: 'BC-2025-002',
      reference: 'BC-2025-002',
      supplier: 'Logistics Services SA',
      category: 'services',
      description: 'Annual maintenance contract',
      demandRef: 'DA-2025-046',
      orderDate: '18/11/2025',
      deliveryDate: '01/12/2025',
      amount: 12000.00,
      currency: 'EUR',
      received: 0.00,
      status: 'en-attente',
      priority: 'normal',
      items: 1
    },
    {
      id: 'BC-2025-003',
      reference: 'BC-2025-003',
      supplier: 'Fuel Supply Company',
      category: 'marchandises',
      description: 'Diesel fuel - 10,000L',
      demandRef: 'DA-2025-047',
      orderDate: '10/11/2025',
      deliveryDate: '20/11/2025',
      amount: 8500.00,
      currency: 'EUR',
      received: 8500.00,
      status: 'livres',
      priority: 'urgent',
      items: 1
    },
    {
      id: 'BC-2025-004',
      reference: 'BC-2025-004',
      supplier: 'Office Supplies Co',
      category: 'materiel',
      description: 'Office equipment and supplies',
      demandRef: 'DA-2025-048',
      orderDate: '20/11/2025',
      deliveryDate: '05/12/2025',
      amount: 3200.00,
      currency: 'EUR',
      received: 1600.00,
      status: 'partiellement-livres',
      priority: 'normal',
      items: 12
    },
    {
      id: 'BC-2025-005',
      reference: 'BC-2025-005',
      supplier: 'Port Equipment Services',
      category: 'materiel',
      description: 'Safety equipment for port operations',
      demandRef: 'DA-2025-049',
      orderDate: '05/11/2025',
      deliveryDate: '25/11/2025',
      amount: 15000.00,
      currency: 'USD',
      received: 0.00,
      status: 'en-retard',
      priority: 'urgent',
      items: 8
    },
    {
      id: 'BC-2025-006',
      reference: 'BC-2025-006',
      supplier: 'Tech Solutions Inc',
      category: 'services',
      description: 'IT infrastructure upgrade',
      demandRef: 'DA-2025-050',
      orderDate: '12/11/2025',
      deliveryDate: '30/11/2025',
      amount: 25000.00,
      currency: 'USD',
      received: 0.00,
      status: 'brouillon',
      priority: 'high',
      items: 3
    },
  ];

  const statusCounts = {
    brouillon: 23,
    'en-attente': 45,
    valides: 89,
    confirmes: 67,
    'partiellement-livres': 34,
    livres: 156,
    'en-retard': 12,
    annules: 8,
    tous: 434
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brouillon': return 'bg-gray-100 text-gray-700';
      case 'en-attente': return 'bg-yellow-100 text-yellow-700';
      case 'valides': return 'bg-blue-100 text-blue-700';
      case 'confirmes': return 'bg-green-100 text-green-700';
      case 'partiellement-livres': return 'bg-purple-100 text-purple-700';
      case 'livres': return 'bg-green-100 text-green-700';
      case 'en-retard': return 'bg-red-100 text-red-700';
      case 'annules': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'brouillon': return 'Brouillon';
      case 'en-attente': return 'En attente';
      case 'valides': return 'Validés';
      case 'confirmes': return 'Confirmés';
      case 'partiellement-livres': return 'Partiellement livrés';
      case 'livres': return 'Livrés';
      case 'en-retard': return 'En retard';
      case 'annules': return 'Annulés';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevée';
      case 'normal': return 'Normale';
      default: return priority;
    }
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

  const getCurrencySymbol = (code: string) => {
    const curr = currencies.find(c => c.code === code);
    return curr?.symbol || code;
  };

  const formatAmount = (amount: number, currency: string) => {
    const formatted = amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    const symbol = getCurrencySymbol(currency);
    return `${formatted} ${symbol}`;
  };

  const filteredCommandes = mockCommandes.filter(cmd => {
    const statusMatch = activeStatus === 'tous' || cmd.status === activeStatus;
    const categoryMatch = !selectedCategory || cmd.category === selectedCategory;
    const currencyMatch = selectedCurrency === 'all' || cmd.currency === selectedCurrency;
    return statusMatch && categoryMatch && currencyMatch;
  });

  // Calculate totals
  const totals = filteredCommandes.reduce((acc, cmd) => {
    acc.amount += cmd.amount;
    acc.received += cmd.received;
    return acc;
  }, { amount: 0, received: 0 });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg">Bons de commande</h2>
              <p className="text-sm text-gray-500">Gestion des commandes fournisseurs</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.label}
                  </option>
                ))}
              </select>
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau bon de commande
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-transparent px-6 h-auto p-0">
            {[
              { id: 'brouillon', label: 'Brouillon', icon: FileText },
              { id: 'en-attente', label: 'En attente', icon: Clock },
              { id: 'valides', label: 'Validés', icon: CheckCircle2 },
              { id: 'confirmes', label: 'Confirmés', icon: CheckCircle2 },
              { id: 'partiellement-livres', label: 'Partiellement livrés', icon: Package },
              { id: 'livres', label: 'Livrés', icon: CheckCircle2 },
              { id: 'en-retard', label: 'En retard', icon: AlertTriangle },
              { id: 'annules', label: 'Annulés', icon: Ban },
              { id: 'tous', label: 'Tous', icon: FileText },
            ].map((status) => {
              const Icon = status.icon;
              return (
                <TabsTrigger
                  key={status.id}
                  value={status.id}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {status.label}
                  <Badge variant="secondary" className="ml-2">
                    {statusCounts[status.id as keyof typeof statusCounts]}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Categories */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm">Catégories</h3>
            </div>

            <div className="space-y-1">
              {/* All Categories */}
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Toutes les catégories</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {filteredCommandes.length}
                </Badge>
              </button>

              {/* Categories */}
              {categories.map((category) => {
                const CategoryIcon = category.icon;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon className={`h-4 w-4 ${category.color}`} />
                      <span className="text-sm">{category.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
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
                  placeholder="Rechercher par référence, fournisseur, description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs">Référence BC</th>
                    <th className="px-4 py-3 text-left text-xs">Fournisseur</th>
                    <th className="px-4 py-3 text-left text-xs">Description</th>
                    <th className="px-4 py-3 text-left text-xs">DA Origine</th>
                    <th className="px-4 py-3 text-left text-xs">Date commande</th>
                    <th className="px-4 py-3 text-left text-xs">Date livraison</th>
                    <th className="px-4 py-3 text-right text-xs">Montant</th>
                    <th className="px-4 py-3 text-center text-xs">Articles</th>
                    <th className="px-4 py-3 text-left text-xs">Priorité</th>
                    <th className="px-4 py-3 text-left text-xs">Statut</th>
                    <th className="px-4 py-3 text-left text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommandes.map((cmd) => (
                    <tr
                      key={cmd.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{cmd.reference}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">{cmd.supplier}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{cmd.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {cmd.demandRef}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{cmd.orderDate}</td>
                      <td className="px-4 py-3 text-sm">{cmd.deliveryDate}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        {formatAmount(cmd.amount, cmd.currency)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="secondary" className="text-xs">
                          {cmd.items}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${getPriorityColor(cmd.priority)}`}>
                          {getPriorityLabel(cmd.priority)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusColor(cmd.status)}>
                          {getStatusLabel(cmd.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-right font-medium">Totaux</td>
                    <td className="px-4 py-3 text-right font-bold">
                      {formatAmount(totals.amount, selectedCurrency === 'all' ? 'EUR' : selectedCurrency)}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total commandé</span>
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl">{formatAmount(totals.amount, 'EUR')}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Validés</span>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl">{statusCounts.valides}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">En retard</span>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-2xl">{statusCounts['en-retard']}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Livrés</span>
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl">{statusCounts.livres}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
