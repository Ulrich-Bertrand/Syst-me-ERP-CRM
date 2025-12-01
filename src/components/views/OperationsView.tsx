import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  Ship, Plane, Truck, Package, ChevronRight, FolderOpen,
  Clock, CheckCircle2, Archive, XCircle, List, Anchor
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TransportFilters } from '../TransportFilters';

interface OperationsViewProps {
  viewType: string;
}

interface DossierType {
  id: string;
  name: string;
  category: 'maritime' | 'aerien' | 'terrestre' | 'autres';
  count: number;
}

const dossierTypes: DossierType[] = [
  // Maritime
  { id: 'sea-freight', name: 'Sea Freight', category: 'maritime', count: 145 },
  { id: 'ship-spares-export', name: 'Ship Spares Maritime Export', category: 'maritime', count: 23 },
  { id: 'others-import', name: 'Others Maritime Import', category: 'maritime', count: 87 },
  { id: 'warehousing-sea', name: 'Warehousing Sea Regime', category: 'maritime', count: 34 },
  { id: 'consignation-maritime', name: 'Consignation Maritime', category: 'maritime', count: 56 },
  { id: 'husbandry-maritime', name: 'Husbandry Maritime', category: 'maritime', count: 12 },
  
  // Aérien
  { id: 'air-freight', name: 'Air Freight', category: 'aerien', count: 78 },
  { id: 'express-air', name: 'Express Air', category: 'aerien', count: 45 },
  { id: 'air-import', name: 'Air Import', category: 'aerien', count: 92 },
  { id: 'air-export', name: 'Air Export', category: 'aerien', count: 67 },
  
  // Terrestre
  { id: 'trucking', name: 'Trucking', category: 'terrestre', count: 234 },
  { id: 'road-transport', name: 'Road Transport', category: 'terrestre', count: 156 },
  { id: 'cross-border', name: 'Cross Border', category: 'terrestre', count: 43 },
  
  // Autres
  { id: 'warehousing', name: 'Warehousing', category: 'autres', count: 67 },
  { id: 'customs-clearance', name: 'Customs Clearance', category: 'autres', count: 123 },
  { id: 'project-cargo', name: 'Project Cargo', category: 'autres', count: 15 },
];

export function OperationsView({ viewType }: OperationsViewProps) {
  const [activeStatus, setActiveStatus] = useState('encours');
  const [selectedDossierType, setSelectedDossierType] = useState<string | null>(null);
  const [selectedTransportMode, setSelectedTransportMode] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['maritime', 'aerien', 'terrestre', 'autres'])
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getActivityLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'operations-logistique': 'Logistique & Transit',
      'operations-shipping': 'Shipping',
      'operations-consignation': 'Consignation',
      'operations-trucking': 'Trucking',
      'operations-husbandrie': 'Husbandrie',
    };
    return labels[type] || 'Opérations';
  };

  // Mock data
  const mockDossiers = [
    { 
      id: 'DOS-2025-001', 
      ref: 'MAR-IMP-001',
      client: 'TechCorp International',
      type: 'Sea Freight',
      origin: 'Shanghai, CN',
      destination: 'Le Havre, FR',
      status: 'encours',
      progress: 65,
      createdDate: '15/11/2025',
      estimatedDelivery: '20/12/2025',
      containers: '2x40HC'
    },
    { 
      id: 'DOS-2025-002', 
      ref: 'TRK-EXP-045',
      client: 'Global Logistics SA',
      type: 'Trucking',
      origin: 'Paris, FR',
      destination: 'Berlin, DE',
      status: 'encours',
      progress: 30,
      createdDate: '18/11/2025',
      estimatedDelivery: '25/11/2025',
      containers: '1x Truck'
    },
    { 
      id: 'DOS-2025-003', 
      ref: 'AIR-IMP-023',
      client: 'FastShip Express',
      type: 'Air Freight',
      origin: 'Dubai, AE',
      destination: 'Paris CDG, FR',
      status: 'cloture',
      progress: 100,
      createdDate: '10/11/2025',
      estimatedDelivery: '12/11/2025',
      containers: '5 Palettes'
    },
  ];

  const statusCounts = {
    encours: 234,
    cloture: 1856,
    archive: 523,
    annule: 47,
    tous: 2660,
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maritime':
        return Ship;
      case 'aerien':
        return Plane;
      case 'terrestre':
        return Truck;
      case 'autres':
        return Package;
      default:
        return FolderOpen;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'maritime':
        return 'Maritime';
      case 'aerien':
        return 'Aérien';
      case 'terrestre':
        return 'Terrestre';
      case 'autres':
        return 'Autres';
      default:
        return category;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'encours':
        return Clock;
      case 'cloture':
        return CheckCircle2;
      case 'archive':
        return Archive;
      case 'annule':
        return XCircle;
      default:
        return List;
    }
  };

  const filteredDossierTypes = dossierTypes.filter(type => {
    if (selectedTransportMode && type.category !== selectedTransportMode) return false;
    return true;
  });

  const groupedDossierTypes = filteredDossierTypes.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
    acc[type.category].push(type);
    return acc;
  }, {} as { [key: string]: DossierType[] });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg">Opérations - {getActivityLabel(viewType)}</h2>
              <p className="text-sm text-gray-500">Gestion des dossiers opérationnels</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau dossier
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status Tabs */}
        <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-transparent px-6 h-auto p-0">
            {[
              { id: 'encours', label: 'Dossiers En cours', icon: Clock },
              { id: 'cloture', label: 'Cloturés', icon: CheckCircle2 },
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
        {/* Left Sidebar - Dossier Types */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm">Types de dossiers</h3>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              {/* All Dossiers Option */}
              <button
                onClick={() => setSelectedDossierType(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedDossierType === null
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span className="text-sm">Tous les dossiers</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {dossierTypes.reduce((sum, type) => sum + type.count, 0)}
                </Badge>
              </button>

              {/* Grouped by Category */}
              {Object.entries(groupedDossierTypes).map(([category, types]) => {
                const CategoryIcon = getCategoryIcon(category);
                const isExpanded = expandedCategories.has(category);
                const categoryCount = types.reduce((sum, type) => sum + type.count, 0);

                return (
                  <div key={category}>
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4" />
                        <span className="text-sm">{getCategoryLabel(category)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {categoryCount}
                        </Badge>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {types.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setSelectedDossierType(type.id)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              selectedDossierType === type.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span className="truncate">{type.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {type.count}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
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
                  placeholder="Rechercher par référence, client, origine, destination..."
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
                    <th className="px-4 py-3 text-left text-xs">Client</th>
                    <th className="px-4 py-3 text-left text-xs">Type</th>
                    <th className="px-4 py-3 text-left text-xs">Origine → Destination</th>
                    <th className="px-4 py-3 text-left text-xs">Progression</th>
                    <th className="px-4 py-3 text-left text-xs">Date création</th>
                    <th className="px-4 py-3 text-left text-xs">Livraison estimée</th>
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
                          <div>
                            <p className="text-sm">{dossier.id}</p>
                            <p className="text-xs text-gray-500">{dossier.ref}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm">{dossier.client}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {dossier.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <p>{dossier.origin}</p>
                            <p className="text-gray-500">↓ {dossier.destination}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                              <div
                                className={`h-2 rounded-full ${
                                  dossier.progress === 100
                                    ? 'bg-green-600'
                                    : 'bg-blue-600'
                                }`}
                                style={{ width: `${dossier.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{dossier.progress}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {dossier.createdDate}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {dossier.estimatedDelivery}
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
                  <FolderOpen className="h-12 w-12 mb-2 opacity-50" />
                  <p>Aucun dossier trouvé</p>
                </div>
              )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total dossiers</span>
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl">2,660</p>
                <p className="text-xs text-gray-500 mt-1">+12% ce mois</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">En cours</span>
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl">234</p>
                <p className="text-xs text-gray-500 mt-1">Nécessitent attention</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Taux de complétion</span>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl">94.2%</p>
                <p className="text-xs text-gray-500 mt-1">Dans les temps</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Délai moyen</span>
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl">12.5j</p>
                <p className="text-xs text-gray-500 mt-1">-2j vs mois dernier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
