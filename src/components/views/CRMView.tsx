import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  Users, Briefcase, Calendar, Phone, CheckSquare, Clock,
  Building2, Mail, MapPin, TrendingUp, ChevronRight, Target,
  UserCircle, DollarSign, Eye, Activity
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

interface CRMViewProps {
  viewType: string;
}

export function CRMView({ viewType }: CRMViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedActivityType, setSelectedActivityType] = useState<string | null>(null);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [expandedActivityTypes, setExpandedActivityTypes] = useState<Set<string>>(
    new Set(['taches', 'appels', 'rendez-vous'])
  );

  const activityTypes = [
    { id: 'taches', label: 'Tâches', icon: CheckSquare, count: 45, color: 'text-blue-600' },
    { id: 'appels', label: 'Appels', icon: Phone, count: 78, color: 'text-green-600' },
    { id: 'rendez-vous', label: 'Rendez-vous', icon: Calendar, count: 32, color: 'text-purple-600' },
  ];

  const mockActivities = [
    {
      id: 'ACT-001',
      type: 'taches',
      title: 'Préparer proposition commerciale',
      client: 'Maxam Ghana',
      contact: 'Kwame Mensah',
      dueDate: '28/11/2025',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Marie Martin'
    },
    {
      id: 'ACT-002',
      type: 'appels',
      title: 'Suivi cotation MAEU-2025-045',
      client: 'Ecobank Ghana',
      contact: 'Ama Serwaa',
      dueDate: '26/11/2025 15:00',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'Pierre Dubois'
    },
    {
      id: 'ACT-003',
      type: 'rendez-vous',
      title: 'Réunion - Nouveau contrat maritime',
      client: 'FastShip Express',
      contact: 'Ahmed Ben Ali',
      dueDate: '29/11/2025 10:00',
      priority: 'high',
      status: 'scheduled',
      assignedTo: 'Marie Martin'
    },
  ];

  const mockCustomers = [
    {
      id: 'CLI-001',
      name: 'Maxam Ghana',
      industry: 'Mining & Explosives',
      contact: 'Kwame Mensah',
      email: 'k.mensah@maxamghana.com',
      phone: '+233 30 276 5432',
      address: 'Accra, Ghana',
      status: 'active',
      revenue: '€450,000',
      lastActivity: '15/11/2025'
    },
    {
      id: 'CLI-002',
      name: 'Ecobank Ghana',
      industry: 'Banking',
      contact: 'Ama Serwaa',
      email: 'a.serwaa@ecobank.com',
      phone: '+233 30 264 4321',
      address: 'Accra, Ghana',
      status: 'active',
      revenue: '€780,000',
      lastActivity: '20/11/2025'
    },
    {
      id: 'CLI-003',
      name: 'FastShip Express',
      industry: 'Shipping',
      contact: 'Ahmed Ben Ali',
      email: 'a.benali@fastship.com',
      phone: '+33 3 45 67 89 01',
      address: 'Marseille, France',
      status: 'prospect',
      revenue: '€120,000',
      lastActivity: '22/11/2025'
    },
  ];

  const mockOpportunities = [
    {
      id: 'OPP-001',
      name: 'New Business - Kinfax',
      client: 'Kinfax',
      stage: 'POST OPS',
      value: '€125,000',
      probability: 80,
      expectedClose: '15/12/2025',
      owner: 'Marie Martin'
    },
    {
      id: 'OPP-002',
      name: 'New Business - PREDUZECE ZA TRGOV...',
      client: 'PREDUZECE ZA TRGOV',
      stage: 'QUOTATION S...',
      value: '€85,000',
      probability: 60,
      expectedClose: '20/12/2025',
      owner: 'Pierre Dubois'
    },
  ];

  const mockContacts = [
    {
      id: 'CNT-001',
      name: 'Kwame Mensah',
      company: 'Maxam Ghana',
      position: 'Procurement Manager',
      email: 'k.mensah@maxamghana.com',
      phone: '+233 30 276 5432',
      lastContact: '15/11/2025'
    },
    {
      id: 'CNT-002',
      name: 'Ama Serwaa',
      company: 'Ecobank Ghana',
      position: 'Operations Manager',
      email: 'a.serwaa@ecobank.com',
      phone: '+233 30 264 4321',
      lastContact: '20/11/2025'
    },
  ];

  const toggleActivityType = (typeId: string) => {
    const newExpanded = new Set(expandedActivityTypes);
    if (newExpanded.has(typeId)) {
      newExpanded.delete(typeId);
    } else {
      newExpanded.add(typeId);
    }
    setExpandedActivityTypes(newExpanded);
  };

  const renderOverview = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4">Entonnoir de ventes</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">CLIENT REQUEST (175)</span>
                <span className="text-sm font-medium">175</span>
              </div>
              <div className="bg-blue-200 h-12 rounded" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">SEARCH & NEGOTIATE (7)</span>
                <span className="text-sm font-medium">7</span>
              </div>
              <div className="bg-blue-400 h-10 rounded" style={{ width: '60%' }} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">QUOTATION STAGE (17)</span>
                <span className="text-sm font-medium">17</span>
              </div>
              <div className="bg-blue-500 h-8 rounded" style={{ width: '40%' }} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">POST OPS (1)</span>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="bg-blue-600 h-6 rounded" style={{ width: '20%' }} />
            </div>
          </div>
        </div>

        {/* Upcoming Activities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>20 Activités à venir</h3>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {mockActivities.slice(0, 3).map((activity) => {
              const activityType = activityTypes.find(t => t.id === activity.type);
              const TypeIcon = activityType?.icon || Activity;
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <TypeIcon className={`h-5 w-5 ${activityType?.color} mt-1`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.dueDate}</p>
                  </div>
                  <Button variant="ghost" size="sm">Complète</Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Spotlight */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4">Point quotidien</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Aujourd'hui</p>
              <p className="text-2xl mt-1">0</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Hier</p>
              <p className="text-2xl mt-1">2</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Semaine dernière</p>
              <p className="text-2xl mt-1">5</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nouvelles cotations</span>
              <span>0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nouveaux prospects</span>
              <span>0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nouveaux clients</span>
              <span>1</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nouvelles activités</span>
              <span>0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nouvelles opportunités</span>
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Top Opportunities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Top Opportunités</h3>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>Par: Stage</option>
            </select>
          </div>
          <div className="space-y-3">
            {mockOpportunities.map((opp) => (
              <div key={opp.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{opp.name}</p>
                    <p className="text-xs text-gray-500">{opp.client}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{opp.stage}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                  <span>{opp.value}</span>
                  <span>{opp.probability}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar - Customer Views */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm">Vues clients</h3>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {[
              'Mes clients (Vendeur) (0)',
              'Mes clients (Account Manager) (0)',
              'En attente d\'activation (0)',
              'Clients potentiels (536)',
              'Clients actifs (2166)',
              'Clients inactifs (27)',
              'Tous les clients'
            ].map((view) => (
              <button
                key={view}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {view}
              </button>
            ))}
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
                placeholder="Rechercher noms / n° TVA / Ville / Pays"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3>Clients récents (1)</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs">Consulté</th>
                  <th className="px-4 py-3 text-left text-xs">Client</th>
                  <th className="px-4 py-3 text-left text-xs">Statut</th>
                  <th className="px-4 py-3 text-left text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCustomers.slice(0, 1).map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">Hier</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default">Actif</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar - Activity Types */}
      <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm">Types d'activités</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => setShowAddActivityModal(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            {/* All Activities */}
            <button
              onClick={() => setSelectedActivityType(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                selectedActivityType === null
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Toutes les activités</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {activityTypes.reduce((sum, type) => sum + type.count, 0)}
              </Badge>
            </button>

            {/* Activity Types (without sub-categories) */}
            {activityTypes.map((type) => {
              const TypeIcon = type.icon;

              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedActivityType(type.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedActivityType === type.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TypeIcon className={`h-4 w-4 ${type.color}`} />
                    <span className="text-sm">{type.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {type.count}
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
                placeholder="Rechercher activités, clients, contacts..."
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
                  <th className="px-4 py-3 text-left text-xs">Type</th>
                  <th className="px-4 py-3 text-left text-xs">Titre</th>
                  <th className="px-4 py-3 text-left text-xs">Client / Contact</th>
                  <th className="px-4 py-3 text-left text-xs">Date/Heure</th>
                  <th className="px-4 py-3 text-left text-xs">Assigné à</th>
                  <th className="px-4 py-3 text-left text-xs">Priorité</th>
                  <th className="px-4 py-3 text-left text-xs">Statut</th>
                  <th className="px-4 py-3 text-left text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockActivities
                  .filter(a => !selectedActivityType || a.type === selectedActivityType)
                  .map((activity) => {
                    const activityType = activityTypes.find(t => t.id === activity.type);
                    const TypeIcon = activityType?.icon || Calendar;
                    
                    return (
                      <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <TypeIcon className={`h-4 w-4 ${activityType?.color}`} />
                            <span className="text-sm">{activityType?.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{activity.title}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm">{activity.client}</p>
                            <p className="text-xs text-gray-500">{activity.contact}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{activity.dueDate}</td>
                        <td className="px-4 py-3 text-sm">{activity.assignedTo}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={activity.priority === 'high' ? 'destructive' : 'secondary'}
                          >
                            {activity.priority === 'high' ? 'Haute' : activity.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                            {activity.status === 'completed' ? 'Complétée' : 
                             activity.status === 'scheduled' ? 'Planifiée' : 'En attente'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher opportunités..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs">Nom</th>
              <th className="px-4 py-3 text-left text-xs">Client</th>
              <th className="px-4 py-3 text-left text-xs">Stage</th>
              <th className="px-4 py-3 text-left text-xs">Valeur</th>
              <th className="px-4 py-3 text-left text-xs">Probabilité</th>
              <th className="px-4 py-3 text-left text-xs">Clôture prévue</th>
              <th className="px-4 py-3 text-left text-xs">Propriétaire</th>
              <th className="px-4 py-3 text-left text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockOpportunities.map((opp) => (
              <tr key={opp.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 text-sm font-medium">{opp.name}</td>
                <td className="px-4 py-3 text-sm">{opp.client}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{opp.stage}</Badge>
                </td>
                <td className="px-4 py-3 text-sm font-medium">{opp.value}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${opp.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{opp.probability}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{opp.expectedClose}</td>
                <td className="px-4 py-3 text-sm">{opp.owner}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher contacts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs">Nom</th>
              <th className="px-4 py-3 text-left text-xs">Entreprise</th>
              <th className="px-4 py-3 text-left text-xs">Poste</th>
              <th className="px-4 py-3 text-left text-xs">Email</th>
              <th className="px-4 py-3 text-left text-xs">Téléphone</th>
              <th className="px-4 py-3 text-left text-xs">Dernier contact</th>
              <th className="px-4 py-3 text-left text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockContacts.map((contact) => (
              <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{contact.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{contact.company}</td>
                <td className="px-4 py-3 text-sm">{contact.position}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span>{contact.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{contact.phone}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{contact.lastContact}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      <div className="text-center">
        <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p>Dashboard commercial à venir</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg">Commercial - CRM</h2>
              <p className="text-sm text-gray-500">Gestion des relations clients</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-transparent px-6 h-auto p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
            >
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Activités
              <Badge variant="secondary" className="ml-2">155</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="opportunities"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
            >
              <Target className="h-4 w-4 mr-2" />
              Opportunités
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Contacts
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'customers' && renderCustomers()}
      {activeTab === 'activities' && renderActivities()}
      {activeTab === 'opportunities' && renderOpportunities()}
      {activeTab === 'contacts' && renderContacts()}
      {activeTab === 'dashboard' && renderDashboard()}

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg mb-4">Choisir le type d'activité</h3>
            <div className="space-y-2">
              {activityTypes.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setShowAddActivityModal(false);
                      // Handle creation logic here
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <TypeIcon className={`h-5 w-5 ${type.color}`} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddActivityModal(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
