import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  Ship, Anchor, Fuel, ChevronRight, FolderOpen,
  Clock, CheckCircle2, Archive, XCircle, List
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TransportFilters } from '../TransportFilters';

interface ActivityType {
  id: string;
  name: string;
  activity: string;
  count: number;
}

const activityTypes: ActivityType[] = [
  // Port Call
  { id: 'bulk-cargo', name: 'Bulk Cargo', activity: 'port-call', count: 45 },
  { id: 'bunkering', name: 'Bunkering', activity: 'port-call', count: 67 },
  { id: 'container-vessel', name: 'Container Vessel', activity: 'port-call', count: 89 },
  { id: 'general-cargo', name: 'General Cargo', activity: 'port-call', count: 34 },
  
  // Offshore Oil & Gas
  { id: 'offshore-oil-gas', name: 'Offshore Oil & Gas', activity: 'offshore', count: 23 },
  { id: 'rig-supply', name: 'Rig Supply', activity: 'offshore', count: 12 },
  
  // Tanker
  { id: 'tanker', name: 'Tanker', activity: 'tanker', count: 56 },
  { id: 'chemical-tanker', name: 'Chemical Tanker', activity: 'tanker', count: 28 },
  { id: 'oil-tanker', name: 'Oil Tanker', activity: 'tanker', count: 34 },
];

const activities = [
  { id: 'port-call', label: 'Port Call', icon: Ship },
  { id: 'offshore', label: 'Offshore Oil & Gas', icon: Anchor },
  { id: 'tanker', label: 'Tanker', icon: Fuel },
];

export function ShippingView() {
  const [activeStatus, setActiveStatus] = useState('encours');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTransportMode, setSelectedTransportMode] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(
    new Set(['port-call', 'offshore', 'tanker'])
  );

  const toggleActivity = (activityId: string) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const mockDossiers = [
    { 
      id: 'SHIP-2025-001', 
      vesselName: 'MSC EMMA',
      imo: 'IMO9876543',
      type: 'Bulk Cargo',
      port: 'Port of Rotterdam',
      eta: '25/11/2025 14:00',
      etd: '27/11/2025 18:00',
      status: 'encours',
      berth: 'Berth 5',
      agent: 'Maritime Services Ltd'
    },
    { 
      id: 'SHIP-2025-002', 
      vesselName: 'MAERSK HOUSTON',
      imo: 'IMO9234567',
      type: 'Container Vessel',
      port: 'Port of Hamburg',
      eta: '26/11/2025 08:00',
      etd: '28/11/2025 22:00',
      status: 'encours',
      berth: 'Terminal 3',
      agent: 'Global Ship Agency'
    },
    { 
      id: 'SHIP-2025-003', 
      vesselName: 'Nordic SPIRIT',
      imo: 'IMO9345678',
      type: 'Tanker',
      port: 'Port of Antwerp',
      eta: '20/11/2025 10:00',
      etd: '22/11/2025 16:00',
      status: 'cloture',
      berth: 'Oil Terminal 1',
      agent: 'Maritime Services Ltd'
    },
  ];

  const statusCounts = {
    encours: 89,
    cloture: 456,
    archive: 234,
    annule: 12,
    tous: 791,
  };

  const groupedTypes = activityTypes.reduce((acc, type) => {
    if (!acc[type.activity]) {
      acc[type.activity] = [];
    }
    acc[type.activity].push(type);
    return acc;
  }, {} as { [key: string]: ActivityType[] });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg">Opérations - Shipping</h2>
              <p className="text-sm text-gray-500">Gestion des escales et opérations maritimes</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle escale
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
        {/* Left Sidebar - Activities */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm">Activités</h3>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              {/* All Dossiers Option */}
              <button
                onClick={() => setSelectedType(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedType === null
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span className="text-sm">Toutes les escales</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activityTypes.reduce((sum, type) => sum + type.count, 0)}
                </Badge>
              </button>

              {/* Grouped by Activity */}
              {activities.map((activity) => {
                const ActivityIcon = activity.icon;
                const isExpanded = expandedActivities.has(activity.id);
                const types = groupedTypes[activity.id] || [];
                const activityCount = types.reduce((sum, type) => sum + type.count, 0);

                return (
                  <div key={activity.id}>
                    <button
                      onClick={() => toggleActivity(activity.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ActivityIcon className="h-4 w-4" />
                        <span className="text-sm">{activity.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {activityCount}
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
                            onClick={() => setSelectedType(type.id)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              selectedType === type.id
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
                  placeholder="Rechercher par nom navire, IMO, port..."
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
                    <th className="px-4 py-3 text-left text-xs">Navire / IMO</th>
                    <th className="px-4 py-3 text-left text-xs">Type</th>
                    <th className="px-4 py-3 text-left text-xs">Port / Berth</th>
                    <th className="px-4 py-3 text-left text-xs">ETA</th>
                    <th className="px-4 py-3 text-left text-xs">ETD</th>
                    <th className="px-4 py-3 text-left text-xs">Agent</th>
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
                          <div>
                            <p className="text-sm font-medium">{dossier.vesselName}</p>
                            <p className="text-xs text-gray-500">{dossier.imo}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {dossier.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <p>{dossier.port}</p>
                            <p className="text-xs text-gray-500">{dossier.berth}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {dossier.eta}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {dossier.etd}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {dossier.agent}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={dossier.status === 'encours' ? 'default' : 'secondary'}>
                            {dossier.status === 'encours' ? 'En cours' : 'Cloturé'}
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
                  <Ship className="h-12 w-12 mb-2 opacity-50" />
                  <p>Aucune escale trouvée</p>
                </div>
              )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total escales</span>
                  <Ship className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl">791</p>
                <p className="text-xs text-gray-500 mt-1">+8% ce mois</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Navires au port</span>
                  <Anchor className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl">15</p>
                <p className="text-xs text-gray-500 mt-1">À quai actuellement</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Attendus cette semaine</span>
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl">24</p>
                <p className="text-xs text-gray-500 mt-1">Prochaines 7 jours</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Durée moyenne</span>
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl">2.8j</p>
                <p className="text-xs text-gray-500 mt-1">Temps au port</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
