import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  Package, FolderOpen, Clock, CheckCircle2, Archive, XCircle, List,
  ShoppingCart
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TransportFilters } from '../TransportFilters';

export function AutresActivitesView() {
  const [activeStatus, setActiveStatus] = useState('encours');
  const [selectedTransportMode, setSelectedTransportMode] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);

  const mockDossiers = [
    { 
      id: 'PROC-2025-001', 
      supplier: 'Marine Supplies Ltd',
      items: 'Ship Spare Parts',
      quantity: '150 items',
      vessel: 'MSC EMMA',
      orderDate: '15/11/2025',
      deliveryDate: '25/11/2025',
      status: 'encours',
      value: '€45,000'
    },
    { 
      id: 'PROC-2025-002', 
      supplier: 'Oil & Gas Equipment',
      items: 'Safety Equipment',
      quantity: '80 items',
      vessel: 'MAERSK HOUSTON',
      orderDate: '18/11/2025',
      deliveryDate: '28/11/2025',
      status: 'encours',
      value: '€28,500'
    },
    { 
      id: 'PROC-2025-003', 
      supplier: 'Technical Services SA',
      items: 'Navigation Equipment',
      quantity: '25 items',
      vessel: 'CMA CGM ANTOINE',
      orderDate: '10/11/2025',
      deliveryDate: '20/11/2025',
      status: 'cloture',
      value: '€67,800'
    },
  ];

  const statusCounts = {
    encours: 89,
    cloture: 456,
    archive: 123,
    annule: 12,
    tous: 680,
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg">Opérations - Autres Activités</h2>
              <p className="text-sm text-gray-500">Gestion des achats et approvisionnements maritimes</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle commande
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
              { id: 'encours', label: 'En cours', icon: Clock },
              { id: 'cloture', label: 'Livrés', icon: CheckCircle2 },
              { id: 'archive', label: 'Archivés', icon: Archive },
              { id: 'annule', label: 'Annulés', icon: XCircle },
              { id: 'tous', label: 'Tous', icon: List },
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

        {/* Filters */}
        <div className="px-6 py-3 border-b border-gray-200">
          <TransportFilters
            selectedMode={selectedTransportMode}
            selectedDirection={selectedDirection}
            onModeChange={setSelectedTransportMode}
            onDirectionChange={setSelectedDirection}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm">Activités</h3>
            </div>

            <div className="space-y-1">
              <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 text-blue-600"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm">Procurement</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {statusCounts.tous}
                </Badge>
              </button>
            </div>

            {/* Categories */}
            <div className="mt-6">
              <h3 className="text-sm mb-2 px-3">Catégories</h3>
              <div className="space-y-1">
                {[
                  'Ship Spare Parts',
                  'Safety Equipment',
                  'Navigation Equipment',
                  'Deck Supplies',
                  'Engine Parts',
                  'Provisions',
                ].map((category) => (
                  <button
                    key={category}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search & Actions */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par fournisseur, navire, items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
          </div>

          {/* Dossiers Table */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs">Référence</th>
                    <th className="px-4 py-3 text-left text-xs">Fournisseur</th>
                    <th className="px-4 py-3 text-left text-xs">Items / Quantité</th>
                    <th className="px-4 py-3 text-left text-xs">Navire</th>
                    <th className="px-4 py-3 text-left text-xs">Valeur</th>
                    <th className="px-4 py-3 text-left text-xs">Date commande</th>
                    <th className="px-4 py-3 text-left text-xs">Livraison prévue</th>
                    <th className="px-4 py-3 text-left text-xs">Statut</th>
                    <th className="px-4 py-3 text-left text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDossiers
                    .filter(d => activeStatus === 'tous' || d.status === activeStatus)
                    .map((dossier) => (
                      <tr
                        key={dossier.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{dossier.id}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{dossier.supplier}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm">{dossier.items}</p>
                            <p className="text-xs text-gray-500">{dossier.quantity}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {dossier.vessel}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{dossier.value}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {dossier.orderDate}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {dossier.deliveryDate}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={dossier.status === 'encours' ? 'default' : 'secondary'}>
                            {dossier.status === 'encours' ? 'En cours' : 'Livré'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {mockDossiers.filter(d => activeStatus === 'tous' || d.status === activeStatus).length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Package className="h-12 w-12 mb-2 opacity-50" />
                  <p>Aucune commande trouvée</p>
                </div>
              )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total commandes</span>
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl">680</p>
                <p className="text-xs text-gray-500 mt-1">Ce trimestre</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">En cours</span>
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl">89</p>
                <p className="text-xs text-gray-500 mt-1">À traiter</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Valeur totale</span>
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl">€1.2M</p>
                <p className="text-xs text-gray-500 mt-1">Ce trimestre</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Délai moyen</span>
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl">7.5j</p>
                <p className="text-xs text-gray-500 mt-1">Livraison</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
