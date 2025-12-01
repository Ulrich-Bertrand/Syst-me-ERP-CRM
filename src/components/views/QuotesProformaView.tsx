import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  FileText, Clock, CheckCircle2, XCircle, Send, Eye,
  DollarSign, Calendar, Building2, User, X, Check, TrendingUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export function QuotesProformaView() {
  const [activeStatus, setActiveStatus] = useState('brouillon');
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  const mockQuotes = [
    {
      id: 'QT-2025-001',
      reference: 'COT-MAR-2025-001',
      client: 'TechCorp International',
      contact: 'Jean Dupont',
      service: 'Sea Freight Import',
      origin: 'Shanghai, CN',
      destination: 'Le Havre, FR',
      amount: '€12,450.00',
      validUntil: '15/12/2025',
      createdDate: '15/11/2025',
      createdBy: 'Marie Martin',
      status: 'brouillon',
      items: [
        { description: 'Fret maritime 2x40HC', quantity: 2, unitPrice: '€2,500.00', total: '€5,000.00' },
        { description: 'Frais de dédouanement', quantity: 1, unitPrice: '€850.00', total: '€850.00' },
        { description: 'Transport terrestre', quantity: 1, unitPrice: '€1,200.00', total: '€1,200.00' },
        { description: 'Manutention portuaire', quantity: 2, unitPrice: '€450.00', total: '€900.00' },
      ],
      notes: 'Prix valable 30 jours. Hors assurance transport.'
    },
    {
      id: 'QT-2025-002',
      reference: 'COT-AIR-2025-002',
      client: 'Global Logistics SA',
      contact: 'Sophie Laurent',
      service: 'Air Freight Export',
      origin: 'Paris CDG, FR',
      destination: 'New York JFK, US',
      amount: '€8,750.00',
      validUntil: '20/12/2025',
      createdDate: '18/11/2025',
      createdBy: 'Pierre Dubois',
      status: 'envoye',
      items: [
        { description: 'Fret aérien 500kg', quantity: 1, unitPrice: '€4,500.00', total: '€4,500.00' },
        { description: 'Frais handling aéroport', quantity: 1, unitPrice: '€650.00', total: '€650.00' },
        { description: 'Documentation export', quantity: 1, unitPrice: '€350.00', total: '€350.00' },
      ],
      notes: 'Transit time: 2-3 jours. Prix sujets à variation fuel.'
    },
    {
      id: 'QT-2025-003',
      reference: 'COT-TRK-2025-003',
      client: 'FastShip Express',
      contact: 'Ahmed Ben Ali',
      service: 'Trucking',
      origin: 'Rotterdam, NL',
      destination: 'Brussels, BE',
      amount: '€1,850.00',
      validUntil: '10/12/2025',
      createdDate: '20/11/2025',
      createdBy: 'Marie Martin',
      status: 'approuve',
      items: [
        { description: 'Transport camion 40HC', quantity: 1, unitPrice: '€1,200.00', total: '€1,200.00' },
        { description: 'Frais passage frontière', quantity: 1, unitPrice: '€250.00', total: '€250.00' },
        { description: 'Tracking GPS', quantity: 1, unitPrice: '€50.00', total: '€50.00' },
      ],
      notes: 'Livraison sous 24h.'
    },
    {
      id: 'QT-2025-004',
      reference: 'COT-MAR-2025-004',
      client: 'Mediterranean Shipping',
      contact: 'Carlos Rodriguez',
      service: 'Port Call',
      origin: 'Port of Valencia',
      destination: 'Port of Valencia',
      amount: '€15,600.00',
      validUntil: '30/11/2025',
      createdDate: '22/11/2025',
      createdBy: 'Ahmed Ben Ali',
      status: 'rejete',
      items: [
        { description: 'Services portuaires', quantity: 1, unitPrice: '€8,500.00', total: '€8,500.00' },
        { description: 'Pilotage', quantity: 1, unitPrice: '€2,100.00', total: '€2,100.00' },
        { description: 'Remorquage', quantity: 2, unitPrice: '€1,800.00', total: '€3,600.00' },
      ],
      notes: 'Prix sujet à conditions météorologiques.'
    },
  ];

  const statusCounts = {
    brouillon: 45,
    envoye: 78,
    approuve: 156,
    rejete: 23,
    expire: 12,
    tous: 314,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brouillon': return 'bg-gray-100 text-gray-700';
      case 'envoye': return 'bg-blue-100 text-blue-700';
      case 'approuve': return 'bg-green-100 text-green-700';
      case 'rejete': return 'bg-red-100 text-red-700';
      case 'expire': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'brouillon': return 'Brouillon';
      case 'envoye': return 'Envoyé';
      case 'approuve': return 'Approuvé';
      case 'rejete': return 'Rejeté';
      case 'expire': return 'Expiré';
      default: return status;
    }
  };

  const renderQuoteDetail = () => {
    if (!selectedQuote) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl">{selectedQuote.reference}</h2>
                  <Badge className={getStatusColor(selectedQuote.status)}>
                    {getStatusLabel(selectedQuote.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">Créé le {selectedQuote.createdDate} par {selectedQuote.createdBy}</p>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Client Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Client</h3>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <p className="font-medium">{selectedQuote.client}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Contact</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p>{selectedQuote.contact}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Service</h3>
                  <p>{selectedQuote.service}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Trajet</h3>
                  <p className="text-sm">{selectedQuote.origin}</p>
                  <p className="text-sm text-gray-500">↓</p>
                  <p className="text-sm">{selectedQuote.destination}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Valide jusqu'au</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <p>{selectedQuote.validUntil}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="mb-3">Détails de la cotation</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs">Description</th>
                      <th className="px-4 py-3 text-right text-xs">Quantité</th>
                      <th className="px-4 py-3 text-right text-xs">Prix unitaire</th>
                      <th className="px-4 py-3 text-right text-xs">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuote.items.map((item: any, index: number) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-sm">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right">{item.unitPrice}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-medium">Total HT</td>
                      <td className="px-4 py-3 text-right font-bold text-lg">{selectedQuote.amount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes */}
            {selectedQuote.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm mb-2">Notes</h3>
                <p className="text-sm text-gray-700">{selectedQuote.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                {selectedQuote.status === 'brouillon' && (
                  <Button variant="outline" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer au client
                  </Button>
                )}
              </div>

              {selectedQuote.status === 'envoye' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                  <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approuver
                  </Button>
                </div>
              )}

              {selectedQuote.status === 'approuve' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Cotation approuvée</span>
                </div>
              )}

              {selectedQuote.status === 'rejete' && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Cotation rejetée</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg">Cotations / Proforma</h2>
              <p className="text-sm text-gray-500">Gestion des cotations et devis</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle cotation
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
              { id: 'envoye', label: 'Envoyés', icon: Send },
              { id: 'approuve', label: 'Approuvés', icon: CheckCircle2 },
              { id: 'rejete', label: 'Rejetés', icon: XCircle },
              { id: 'expire', label: 'Expirés', icon: Clock },
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
      <div className="flex-1 overflow-auto p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par référence, client, service..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs">Référence</th>
                <th className="px-4 py-3 text-left text-xs">Client</th>
                <th className="px-4 py-3 text-left text-xs">Service</th>
                <th className="px-4 py-3 text-left text-xs">Trajet</th>
                <th className="px-4 py-3 text-left text-xs">Montant</th>
                <th className="px-4 py-3 text-left text-xs">Date création</th>
                <th className="px-4 py-3 text-left text-xs">Valide jusqu'au</th>
                <th className="px-4 py-3 text-left text-xs">Statut</th>
                <th className="px-4 py-3 text-left text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockQuotes
                .filter(q => activeStatus === 'tous' || q.status === activeStatus)
                .map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedQuote(quote)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{quote.id}</p>
                        <p className="text-xs text-gray-500">{quote.reference}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm">{quote.client}</p>
                        <p className="text-xs text-gray-500">{quote.contact}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {quote.service}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p className="text-xs text-gray-500">{quote.origin}</p>
                        <p className="text-xs">→ {quote.destination}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{quote.amount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {quote.createdDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {quote.validUntil}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(quote.status)}>
                        {getStatusLabel(quote.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Brouillon</span>
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <p className="text-2xl">{statusCounts.brouillon}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Envoyés</span>
              <Send className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl">{statusCounts.envoye}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Approuvés</span>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl">{statusCounts.approuve}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Rejetés</span>
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl">{statusCounts.rejete}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Taux conversion</span>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl">49.7%</p>
          </div>
        </div>
      </div>

      {/* Quote Detail Modal */}
      {renderQuoteDetail()}
    </div>
  );
}