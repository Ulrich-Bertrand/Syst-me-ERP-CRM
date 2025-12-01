import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  Ship, ArrowDownToLine, ArrowUpFromLine, FolderOpen,
  Clock, CheckCircle2, Archive, XCircle, List
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TransportFilters } from '../TransportFilters';

export function ConsignationView() {
  const [activeStatus, setActiveStatus] = useState('encours');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTransportMode, setSelectedTransportMode] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);

  const consignationTypes = [
    { id: 'consignation-import', label: 'Consignation Import', count: 145, icon: ArrowDownToLine },
    { id: 'consignation-export', label: 'Consignation Export', count: 167, icon: ArrowUpFromLine },
  ];

  const mockDossiers = [
    { 
      id: 'CONS-2025-001', 
      shippingLine: 'MAERSK LINE',
      vesselName: 'MAERSK EMMA',
      voyage: 'V125E',
      port: 'Port of Le Havre',
      type: 'import',
      containers: '450 x 40HC',
      eta: '25/11/2025',
      status: 'encours',
    },
    { 
      id: 'CONS-2025-002', 
      shippingLine: 'MSC',
      vesselName: 'MSC GULSUN',
      voyage: 'FN901A',
      port: 'Port of Rotterdam',
      type: 'export',
      containers: '380 x 20DC',
      eta: '28/11/2025',
      status: 'encours',
    },
    { 
      id: 'CONS-2025-003', 
      shippingLine: 'CMA CGM',
      vesselName: 'CMA CGM ANTOINE DE SAINT EXUPERY',
      voyage: 'CEX02',
      port: 'Port of Hamburg',
      type: 'import',
      containers: '290 x 40HC',
      eta: '20/11/2025',
      status: 'cloture',
    },
  ];

  const statusCounts = {
    encours: 312,
    cloture: 1456,
    archive: 523,
    annule: 34,
    tous: 2325,
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg">Opérations - Consignation</h2>
              <p className="text-sm text-gray-500">Représentation des lignes maritimes</p>
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
        {/* Left Sidebar - Types */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm">Types de consignation</h3>
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
                  <span className="text-sm">Tous les dossiers</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {consignationTypes.reduce((sum, type) => sum + type.count, 0)}
                </Badge>
              </button>

              {/* Consignation Types */}
              {consignationTypes.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      selectedType === type.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4" />
                      <span className="text-sm">{type.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {type.count}
                    </Badge>
                  </button>
                );
              })}
            </div>

            {/* Shipping Lines Section */}
            <div className="mt-6">
              <h3 className="text-sm mb-2 px-3">Lignes maritimes</h3>
              <div className="space-y-1">
                {['MAERSK LINE', 'MSC', 'CMA CGM', 'HAPAG-LLOYD', 'COSCO'].map((line) => (
                  <button
                    key={line}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <span>{line}</span>
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
                  placeholder="Rechercher par ligne, navire, voyage..."
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
                    <th className="px-4 py-3 text-left text-xs">Ligne maritime</th>
                    <th className="px-4 py-3 text-left text-xs">Navire / Voyage</th>
                    <th className="px-4 py-3 text-left text-xs">Port</th>
                    <th className="px-4 py-3 text-left text-xs">Type</th>
                    <th className="px-4 py-3 text-left text-xs">Conteneurs</th>
                    <th className="px-4 py-3 text-left text-xs">ETA</th>
                    <th className="px-4 py-3 text-left text-xs">Statut</th>
                    <th className="px-4 py-3 text-left text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDossiers
                    .filter(d => activeStatus === 'tous' || d.status === activeStatus)
                    .filter(d => !selectedType || d.type === selectedType.split('-')[1])
                    .map((dossier) => (
                      <tr
                        key={dossier.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{dossier.id}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Ship className="h-4 w-4 text-blue-600" />
                            <p className="text-sm font-medium">{dossier.shippingLine}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm">{dossier.vesselName}</p>
                            <p className="text-xs text-gray-500">Voyage: {dossier.voyage}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {dossier.port}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {dossier.type === 'import' ? (
                              <span className="flex items-center gap-1">
                                <ArrowDownToLine className="h-3 w-3" />
                                Import
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <ArrowUpFromLine className="h-3 w-3" />
                                Export
                              </span>
                            )}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {dossier.containers}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {dossier.eta}
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
                <p className="text-2xl">2,325</p>
                <p className="text-xs text-gray-500 mt-1">+15% ce mois</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Import</span>
                  <ArrowDownToLine className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl">145</p>
                <p className="text-xs text-gray-500 mt-1">Dossiers actifs</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Export</span>
                  <ArrowUpFromLine className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl">167</p>
                <p className="text-xs text-gray-500 mt-1">Dossiers actifs</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Lignes gérées</span>
                  <Ship className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl">12</p>
                <p className="text-xs text-gray-500 mt-1">Partenaires actifs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
