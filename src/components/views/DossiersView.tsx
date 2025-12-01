import { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, Settings as SettingsIcon, ChevronDown, ChevronRight, Ship, Plane, Truck, Train, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { dossiers, dossierTypes } from '../../lib/mockData';
import { Dossier } from '../../types';
import { DossierDetailPanel } from '../DossierDetailPanel';

interface DossiersViewProps {
  viewType: string;
}

export function DossiersView({ viewType }: DossiersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggleRow = (dossierId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(dossierId)) {
      newExpanded.delete(dossierId);
    } else {
      newExpanded.add(dossierId);
    }
    setExpandedRows(newExpanded);
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'maritime':
        return <Ship className="h-4 w-4 text-blue-600" />;
      case 'aerien':
        return <Plane className="h-4 w-4 text-sky-600" />;
      case 'routier':
        return <Truck className="h-4 w-4 text-orange-600" />;
      case 'ferroviaire':
        return <Train className="h-4 w-4 text-gray-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (statut: string) => {
    const colors: Record<string, string> = {
      brouillon: 'bg-gray-100 text-gray-700',
      ouvert: 'bg-yellow-100 text-yellow-700',
      en_cours: 'bg-blue-100 text-blue-700',
      termine: 'bg-green-100 text-green-700',
      facture: 'bg-purple-100 text-purple-700',
      cloture: 'bg-gray-200 text-gray-700'
    };
    return colors[statut] || 'bg-gray-100 text-gray-700';
  };

  if (selectedDossier) {
    return <DossierDetailPanel dossier={selectedDossier} onClose={() => setSelectedDossier(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg">Operations</h2>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          <button className="py-3 px-1 border-b-2 border-blue-500 text-blue-600 text-sm">
            Dossiers
          </button>
          <button className="py-3 px-1 text-gray-600 hover:text-gray-900 text-sm">
            Manifestes partagés
          </button>
          <button className="py-3 px-1 text-gray-600 hover:text-gray-900 text-sm">
            Conteneurs F/U
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search partners / ports / ref #"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
            All
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Type de dossier</label>
                <select className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm">
                  <option>Tous</option>
                  <option>Maritime Import</option>
                  <option>Aérien Export</option>
                  <option>Routier National</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Statut</label>
                <select className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm">
                  <option>Tous</option>
                  <option>Ouvert</option>
                  <option>En cours</option>
                  <option>Terminé</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Date début</label>
                <input type="date" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Date fin</label>
                <input type="date" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Queries */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm">Dossiers Queries</h3>
                <Plus className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500 py-1">Operational Open</div>
                <div className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-blue-600">Dossiers (1000+)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-blue-600">Masters (1000+)</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 py-1">Accounting Open</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-blue-600">Open Receivables - Shipments (1000+)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-blue-600">Open Payables - Masters (1000+)</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">e-AWB</span>
                <Plus className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
              <div className="space-y-1">
                <div className="py-1.5 px-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                  Expected Departure Shipments (0)
                </div>
                <div className="py-1.5 px-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                  Airlines Updates - Last 7 Days (0)
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 py-1">Others</div>
              <div className="space-y-1">
                <div className="py-1.5 px-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                  All Shipments
                </div>
                <div className="py-1.5 px-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                  All Masters
                </div>
                <div className="py-1.5 px-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                  Credit Limit Blocked Shipments (0)
                </div>
                <div className="py-1.5 px-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                  Cancelled Shipments
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">FSR</span>
                <div className="flex items-center gap-2">
                  <SettingsIcon className="h-3 w-3 text-gray-400" />
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">Send FSR</span>
                </div>
              </div>
              <div className="py-1.5 px-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                FSR Request - Last 7 Days (0)
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white">
            {/* Table Header */}
            <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs text-gray-600">
                <div className="col-span-1 flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <SettingsIcon className="h-4 w-4" />
                </div>
                <div className="col-span-1">Create Date</div>
                <div className="col-span-1">#</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2">Agent</div>
                <div className="col-span-2">Routing</div>
                <div className="col-span-1">Master</div>
                <div className="col-span-1">HWB</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Main Carriage</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {dossiers.map((dossier) => {
                const type = dossierTypes.find(t => t.id === dossier.typeId);
                const isExpanded = expandedRows.has(dossier.id);

                return (
                  <div key={dossier.id}>
                    <div 
                      className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-gray-50 cursor-pointer items-center"
                      onClick={() => toggleRow(dossier.id)}
                    >
                      <div className="col-span-1 flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); toggleRow(dossier.id); }}>
                          {isExpanded ? 
                            <ChevronDown className="h-4 w-4 text-gray-400" /> : 
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          }
                        </button>
                        {type && getTransportIcon(type.transportMode)}
                      </div>
                      <div className="col-span-1 text-sm">{new Date(dossier.dateOuverture).toLocaleDateString('fr-FR')}</div>
                      <div className="col-span-1 text-sm text-blue-600 hover:underline" onClick={(e) => { e.stopPropagation(); setSelectedDossier(dossier); }}>
                        {dossier.numero}
                      </div>
                      <div className="col-span-1 text-sm">{type?.code}</div>
                      <div className="col-span-2 text-sm">{dossier.responsable}</div>
                      <div className="col-span-2 text-sm text-gray-600">
                        {dossier.metadata?.origine} › {dossier.metadata?.destination}
                      </div>
                      <div className="col-span-1 text-sm">{dossier.reference || '-'}</div>
                      <div className="col-span-1 text-sm">-</div>
                      <div className="col-span-1">
                        <Badge className={`text-xs ${getStatusColor(dossier.statut)}`}>
                          {dossier.statut === 'en_cours' ? 'Order' : dossier.statut}
                        </Badge>
                      </div>
                      <div className="col-span-1 text-sm">{new Date(dossier.dateOuverture).toLocaleDateString('fr-FR')}</div>
                    </div>

                    {/* Expanded Row Details */}
                    {isExpanded && (
                      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                        <div className="grid grid-cols-4 gap-6">
                          <div>
                            <h4 className="text-xs text-gray-500 mb-2">Pick Up</h4>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                <span className="text-sm">{dossier.metadata?.origine || 'No Pick up'}</span>
                              </div>
                              {dossier.metadata?.origine && (
                                <p className="text-xs text-gray-500 ml-4">No date entered</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs text-gray-500 mb-2">Main Carriage</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                <span className="text-sm">{dossier.metadata?.origine}</span>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <span className="text-gray-400">→</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                <span className="text-sm">{dossier.metadata?.destination}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs text-gray-500 mb-2">Warehouse</h4>
                            <p className="text-sm text-gray-600">No Warehouse</p>
                          </div>

                          <div>
                            <h4 className="text-xs text-gray-500 mb-2">Delivery</h4>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                <span className="text-sm">{dossier.metadata?.destination}</span>
                              </div>
                              <p className="text-xs text-gray-500 ml-4">No date entered</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-blue-600"
                            onClick={(e) => { e.stopPropagation(); setSelectedDossier(dossier); }}
                          >
                            Full Details
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
