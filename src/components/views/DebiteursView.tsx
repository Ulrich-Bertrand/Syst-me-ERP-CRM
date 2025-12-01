import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  FileText, Clock, CheckCircle2, XCircle, AlertTriangle, Ban,
  Building2, Calendar, DollarSign, Eye, ChevronRight, Euro,
  Banknote, Wallet, ReceiptText, ArrowLeft, Printer, Mail,
  Phone, MapPin, User, TrendingUp, Package, CreditCard, X,
  Edit, Send, Upload, File, ExternalLink, History, Activity,
  Briefcase, Globe, Users, Star, Tag
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

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

export function DebiteursView() {
  const [activeStatus, setActiveStatus] = useState('ouvertes');
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [selectedClientType, setSelectedClientType] = useState<string | null>(null);
  const [expandedDocTypes, setExpandedDocTypes] = useState<Set<string>>(
    new Set(['facture', 'banque', 'cash', 'autres', 'types-clients'])
  );
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const documentTypes = [
    {
      id: 'facture',
      label: 'Facture',
      icon: FileText,
      color: 'text-blue-600',
      children: [
        { id: 'avoir', label: 'Avoir', count: 12 },
        { id: 'doit', label: 'Doit', count: 156 }
      ]
    },
    {
      id: 'banque',
      label: 'Banque',
      icon: Building2,
      color: 'text-green-600',
      children: [
        { id: 'entree', label: 'Entrée', count: 245 },
        { id: 'sortie', label: 'Sortie', count: 89 }
      ]
    },
    {
      id: 'cash',
      label: 'Paiement Cash',
      icon: Wallet,
      color: 'text-purple-600',
      children: [
        { id: 'cash-entree', label: 'Entrée', count: 67 },
        { id: 'cash-sortie', label: 'Sortie', count: 23 }
      ]
    },
    {
      id: 'autres',
      label: 'Autres',
      icon: ReceiptText,
      color: 'text-gray-600',
      children: []
    }
  ];

  const clientTypes = [
    {
      id: 'types-clients',
      label: 'Types de clients',
      icon: User,
      color: 'text-indigo-600',
      children: [
        { id: 'client-actif', label: 'Clients actifs', count: 156 },
        { id: 'client-inactif', label: 'Clients inactifs', count: 23 }
      ]
    }
  ];

  const clientCategories = [
    { id: 'local', label: 'Client local', icon: MapPin, color: 'bg-blue-100 text-blue-700' },
    { id: 'partenaire', label: 'Partenaire', icon: Star, color: 'bg-purple-100 text-purple-700' },
    { id: 'international', label: 'International', icon: Globe, color: 'bg-green-100 text-green-700' },
    { id: 'vip', label: 'Client VIP', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'grossiste', label: 'Grossiste', icon: Briefcase, color: 'bg-orange-100 text-orange-700' },
  ];

  const currencies = [
    { code: 'all', label: 'Toutes devises', symbol: '💱' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'USD', label: 'Dollar US', symbol: '$' },
    { code: 'MAD', label: 'Dirham', symbol: 'DH' },
    { code: 'GBP', label: 'Livre Sterling', symbol: '£' }
  ];

  const mockDocuments = [
    {
      id: 'INV-2025-001',
      type: 'doit',
      docType: 'Facture',
      client: 'Maxam Ghana',
      clientId: 'CLI-001',
      reference: 'FACT-2025-001',
      date: '15/11/2025',
      dueDate: '15/12/2025',
      amount: 12450.00,
      currency: 'EUR',
      paid: 5000.00,
      balance: 7450.00,
      status: 'ouvertes',
      daysOverdue: 0
    },
    {
      id: 'INV-2025-002',
      type: 'doit',
      docType: 'Facture',
      client: 'Ecobank Ghana',
      clientId: 'CLI-002',
      reference: 'FACT-2025-002',
      date: '10/11/2025',
      dueDate: '10/12/2025',
      amount: 8750.00,
      currency: 'EUR',
      paid: 8750.00,
      balance: 0.00,
      status: 'fermees',
      daysOverdue: 0
    },
  ];

  const mockClients = [
    {
      id: 'CLI-001',
      name: 'Maxam Ghana',
      category: 'international',
      type: 'client-actif',
      contact: 'Kwame Mensah',
      email: 'k.mensah@maxamghana.com',
      phone: '+233 30 276 5432',
      address: 'Liberation Road, Airport Residential Area, Accra, Ghana',
      taxId: 'GH1234567890',
      paymentTerms: '30 jours',
      creditLimit: 50000.00,
      currentBalance: 7450.00,
      totalSales: 125000.00,
      lastPaymentDate: '20/11/2025',
      lastPaymentAmount: 5000.00,
      currency: 'EUR',
      status: 'active',
      quotationsInProgress: 3,
      invoicesInProgress: 2,
      invoicesPending: 1,
      credits: 1,
      payments: 15,
      overdueAmount: 0.00,
      pendingApproval: 1,
      documents: [
        { id: 'DOC-001', name: 'Contrat_Maxam_2025.pdf', type: 'Contrat', size: '2.4 MB', date: '15/01/2025' },
        { id: 'DOC-002', name: 'Certificat_TVA.pdf', type: 'Fiscal', size: '156 KB', date: '10/01/2025' },
        { id: 'DOC-003', name: 'Bank_Details_Maxam.pdf', type: 'Bancaire', size: '89 KB', date: '05/01/2025' },
        { id: 'DOC-004', name: 'Registration_Certificate.pdf', type: 'Juridique', size: '1.2 MB', date: '01/01/2025' },
      ]
    },
    {
      id: 'CLI-002',
      name: 'Ecobank Ghana',
      category: 'partenaire',
      type: 'client-actif',
      contact: 'Ama Serwaa',
      email: 'a.serwaa@ecobank.com',
      phone: '+233 30 264 4321',
      address: '19 Seventh Avenue, Ridge West, Accra, Ghana',
      taxId: 'GH9876543210',
      paymentTerms: '45 jours',
      creditLimit: 100000.00,
      currentBalance: 0.00,
      totalSales: 350000.00,
      lastPaymentDate: '22/11/2025',
      lastPaymentAmount: 8750.00,
      currency: 'EUR',
      status: 'active',
      quotationsInProgress: 5,
      invoicesInProgress: 0,
      invoicesPending: 0,
      credits: 0,
      payments: 28,
      overdueAmount: 0.00,
      pendingApproval: 0,
      documents: [
        { id: 'DOC-005', name: 'Contrat_Ecobank_2025.pdf', type: 'Contrat', size: '3.1 MB', date: '12/01/2025' },
        { id: 'DOC-006', name: 'Assurance_RC.pdf', type: 'Assurance', size: '456 KB', date: '08/01/2025' },
      ]
    },
  ];

  const statusCounts = {
    brouillon: 23,
    'en-attente': 45,
    validees: 178,
    ouvertes: 89,
    litiges: 12,
    fermees: 456,
    annulees: 8,
    tous: 811
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brouillon': return 'bg-gray-100 text-gray-700';
      case 'en-attente': return 'bg-yellow-100 text-yellow-700';
      case 'validees': return 'bg-blue-100 text-blue-700';
      case 'ouvertes': return 'bg-orange-100 text-orange-700';
      case 'litiges': return 'bg-red-100 text-red-700';
      case 'fermees': return 'bg-green-100 text-green-700';
      case 'annulees': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'brouillon': return 'Brouillon';
      case 'en-attente': return 'En attente d\'approbation';
      case 'validees': return 'Validées';
      case 'ouvertes': return 'Ouvertes';
      case 'litiges': return 'Litiges';
      case 'fermees': return 'Fermées';
      case 'annulees': return 'Annulées';
      default: return status;
    }
  };

  const toggleDocType = (typeId: string) => {
    const newExpanded = new Set(expandedDocTypes);
    if (newExpanded.has(typeId)) {
      newExpanded.delete(typeId);
    } else {
      newExpanded.add(typeId);
    }
    setExpandedDocTypes(newExpanded);
  };

  const getCurrencySymbol = (code: string) => {
    const curr = currencies.find(c => c.code === code);
    return curr?.symbol || code;
  };

  const formatAmount = (amount: number, currency: string) => {
    const formatted = Math.abs(amount).toLocaleString('fr-FR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    const symbol = getCurrencySymbol(currency);
    return amount < 0 ? `-${formatted} ${symbol}` : `${formatted} ${symbol}`;
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const statusMatch = activeStatus === 'tous' || doc.status === activeStatus;
    const typeMatch = !selectedDocType || doc.type === selectedDocType;
    const currencyMatch = selectedCurrency === 'all' || doc.currency === selectedCurrency;
    return statusMatch && typeMatch && currencyMatch;
  });

  const totals = filteredDocuments.reduce((acc, doc) => {
    acc.amount += doc.amount;
    acc.paid += doc.paid;
    acc.balance += doc.balance;
    return acc;
  }, { amount: 0, paid: 0, balance: 0 });

  const handleClientClick = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    setSelectedClient(client || null);
    setActiveTab('overview');
  };

  const getCategoryBadge = (categoryId: string) => {
    return clientCategories.find(c => c.id === categoryId);
  };

  if (selectedClient) {
    const categoryInfo = getCategoryBadge(selectedClient.category);
    const CategoryIcon = categoryInfo?.icon || Tag;

    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Enhanced Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Tooltip text="Retour à la liste des clients">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedClient(null)}
                    className="mt-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Tooltip>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl">{selectedClient.name}</h2>
                    {categoryInfo && (
                      <Badge className={categoryInfo.color}>
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {categoryInfo.label}
                      </Badge>
                    )}
                    <Badge variant={selectedClient.status === 'active' ? 'default' : 'secondary'}>
                      {selectedClient.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedClient.contact}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedClient.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {selectedClient.phone}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Réf: {selectedClient.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip text="Modifier les informations du client">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </Tooltip>
                <Tooltip text="Envoyer un email au client">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </Tooltip>
                <Tooltip text="Créer une nouvelle facture pour ce client">
                  <Button variant="default" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle facture
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Tooltip text="Imprimer le relevé de compte client">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Relevé de compte
                </Button>
              </Tooltip>
              <Tooltip text="Imprimer l'état des créances du client">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  État des créances
                </Button>
              </Tooltip>
              <Tooltip text="Télécharger toutes les factures du client">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Factures
                </Button>
              </Tooltip>
              <Tooltip text="Envoyer un rappel de paiement au client">
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Rappel paiement
                </Button>
              </Tooltip>
              <Tooltip text="Voir l'historique des interactions">
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  Historique
                </Button>
              </Tooltip>
              <div className="ml-auto">
                <Tooltip text="Plus d'options">
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent px-6 h-auto p-0">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              >
                <Activity className="h-4 w-4 mr-2" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              >
                <FileText className="h-4 w-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              >
                <File className="h-4 w-4 mr-2" />
                Documents ({selectedClient.documents.length})
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Informations
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <Tabs value={activeTab}>
            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0 p-6">
              <div className="space-y-6">
                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Solde actuel</span>
                      <DollarSign className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatAmount(selectedClient.currentBalance, selectedClient.currency)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Créances ouvertes</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Total des ventes</span>
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold">
                      {formatAmount(selectedClient.totalSales, selectedClient.currency)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Depuis le début</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Montants échus</span>
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      {formatAmount(selectedClient.overdueAmount, selectedClient.currency)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">En retard de paiement</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Limite de crédit</span>
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold">
                      {formatAmount(selectedClient.creditLimit, selectedClient.currency)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Disponible: {formatAmount(selectedClient.creditLimit - selectedClient.currentBalance, selectedClient.currency)}
                    </p>
                  </div>
                </div>

                {/* Comprehensive Summary Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ReceiptText className="h-5 w-5 text-blue-600" />
                      Tableau récapitulatif
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Cotations en cours</span>
                          </div>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {selectedClient.quotationsInProgress}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-gray-700">Factures de vente en attente</span>
                          </div>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {selectedClient.invoicesPending}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Factures en cours</span>
                          </div>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {selectedClient.invoicesInProgress}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-gray-700">Avoirs</span>
                          </div>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {selectedClient.credits}
                          </Badge>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Paiements reçus</span>
                          </div>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {selectedClient.payments}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">Date du dernier paiement</span>
                          </div>
                          <span className="text-sm font-semibold">{selectedClient.lastPaymentDate}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Montant du dernier paiement</span>
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            {formatAmount(selectedClient.lastPaymentAmount, selectedClient.currency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-gray-700">En attente d'approbation</span>
                          </div>
                          <Badge variant={selectedClient.pendingApproval > 0 ? 'default' : 'secondary'} className="text-base px-3 py-1">
                            {selectedClient.pendingApproval}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Total Row */}
                    <div className="mt-6 pt-4 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between py-2 bg-blue-50 px-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-gray-900">Total des ventes (historique)</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">
                          {formatAmount(selectedClient.totalSales, selectedClient.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Activité récente
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="mt-1 p-2 bg-green-100 rounded-full">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Paiement reçu - Maxam Ghana</p>
                          <p className="text-sm text-gray-600">5,000.00 € reçu pour FACT-2025-001</p>
                          <p className="text-xs text-gray-400 mt-1">20/11/2025 à 14:30</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="mt-1 p-2 bg-blue-100 rounded-full">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Nouvelle facture créée</p>
                          <p className="text-sm text-gray-600">FACT-2025-001 - Maxam Ghana - 12,450.00 €</p>
                          <p className="text-xs text-gray-400 mt-1">15/11/2025 à 10:15</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="mt-1 p-2 bg-purple-100 rounded-full">
                          <Mail className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Email envoyé</p>
                          <p className="text-sm text-gray-600">Facture FACT-2025-001 envoyée à Maxam Ghana</p>
                          <p className="text-xs text-gray-400 mt-1">15/11/2025 à 10:20</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="m-0 p-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold">Toutes les transactions</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Référence</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Montant</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Solde</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDocuments
                      .filter(doc => doc.clientId === selectedClient.id)
                      .map((doc) => (
                        <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">{doc.docType}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">{doc.reference}</td>
                          <td className="px-4 py-3 text-sm">{doc.date}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium">
                            {formatAmount(doc.amount, doc.currency)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <span className={doc.balance > 0 ? 'text-orange-600 font-medium' : 'text-green-600'}>
                              {formatAmount(doc.balance, doc.currency)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={getStatusColor(doc.status)}>
                              {getStatusLabel(doc.status)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Tooltip text="Voir le détail de la transaction">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                              <Tooltip text="Imprimer le document">
                                <Button variant="ghost" size="sm">
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                              <Tooltip text="Télécharger en PDF">
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="m-0 p-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-600" />
                    Documents du client
                  </h3>
                  <Tooltip text="Ajouter un nouveau document">
                    <Button variant="default" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Ajouter un document
                    </Button>
                  </Tooltip>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-3">
                    {selectedClient.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <File className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.type} • {doc.size} • {doc.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tooltip text="Voir le document">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip text="Télécharger le document">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip text="Ouvrir dans un nouvel onglet">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip text="Plus d'options">
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="m-0 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Info */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      Informations société
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Raison sociale</label>
                      <p className="text-sm font-medium mt-1">{selectedClient.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Référence</label>
                      <p className="text-sm font-mono mt-1">{selectedClient.id}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">N° TVA</label>
                      <p className="text-sm font-mono mt-1">{selectedClient.taxId}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Adresse</label>
                      <p className="text-sm mt-1 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        {selectedClient.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact & Payment Info */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
                      <h3 className="font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-green-600" />
                        Contact principal
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Nom</label>
                        <p className="text-sm font-medium mt-1">{selectedClient.contact}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                        <p className="text-sm mt-1 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {selectedClient.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Téléphone</label>
                        <p className="text-sm mt-1 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {selectedClient.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Terms */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        Conditions de paiement
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Délai de paiement</label>
                        <p className="text-sm font-medium mt-1">{selectedClient.paymentTerms}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Limite de crédit</label>
                        <p className="text-sm font-medium mt-1">
                          {formatAmount(selectedClient.creditLimit, selectedClient.currency)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Devise</label>
                        <p className="text-sm font-medium mt-1">{selectedClient.currency}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg">Débiteurs / Clients</h2>
              <p className="text-sm text-gray-500">Gestion des créances clients</p>
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
              <Tooltip text="Créer un nouveau document">
                <Button variant="default" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau document
                </Button>
              </Tooltip>
              <Tooltip text="Exporter les données">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
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

        {/* Status Tabs */}
        <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-transparent px-6 h-auto p-0">
            {[
              { id: 'brouillon', label: 'Brouillon', icon: FileText },
              { id: 'en-attente', label: 'En attente', icon: Clock },
              { id: 'validees', label: 'Validées', icon: CheckCircle2 },
              { id: 'ouvertes', label: 'Ouvertes', icon: AlertTriangle },
              { id: 'litiges', label: 'Litiges', icon: XCircle },
              { id: 'fermees', label: 'Fermées', icon: CheckCircle2 },
              { id: 'annulees', label: 'Annulées', icon: Ban },
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
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm">Types de documents</h3>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedDocType(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedDocType === null
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Tous les documents</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {filteredDocuments.length}
                </Badge>
              </button>

              {documentTypes.map((type) => {
                const TypeIcon = type.icon;
                const isExpanded = expandedDocTypes.has(type.id);

                return (
                  <div key={type.id}>
                    <button
                      onClick={() => type.children.length > 0 ? toggleDocType(type.id) : setSelectedDocType(type.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <TypeIcon className={`h-4 w-4 ${type.color}`} />
                        <span className="text-sm">{type.label}</span>
                      </div>
                      {type.children.length > 0 && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      )}
                    </button>

                    {isExpanded && type.children.length > 0 && (
                      <div className="ml-6 mt-1 space-y-1">
                        {type.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => setSelectedDocType(child.id)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              selectedDocType === child.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span className="truncate">{child.label}</span>
                            <Badge variant="secondary" className="text-xs">
                              {child.count}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Client Types Section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                {clientTypes.map((type) => {
                  const TypeIcon = type.icon;
                  const isExpanded = expandedDocTypes.has(type.id);

                  return (
                    <div key={type.id}>
                      <button
                        onClick={() => toggleDocType(type.id)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <TypeIcon className={`h-4 w-4 ${type.color}`} />
                          <span className="text-sm">{type.label}</span>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="ml-6 mt-1 space-y-1">
                          {type.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => setSelectedClientType(child.id)}
                              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                selectedClientType === child.id
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <span className="truncate">{child.label}</span>
                              <Badge variant="secondary" className="text-xs">
                                {child.count}
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
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par référence, client, montant..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <Tooltip text="Filtrer les résultats">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs">Référence</th>
                    <th className="px-4 py-3 text-left text-xs">Type</th>
                    <th className="px-4 py-3 text-left text-xs">Client</th>
                    <th className="px-4 py-3 text-left text-xs">Date</th>
                    <th className="px-4 py-3 text-left text-xs">Échéance</th>
                    <th className="px-4 py-3 text-right text-xs">Montant</th>
                    <th className="px-4 py-3 text-right text-xs">Payé</th>
                    <th className="px-4 py-3 text-right text-xs">Solde</th>
                    <th className="px-4 py-3 text-left text-xs">Statut</th>
                    <th className="px-4 py-3 text-left text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{doc.id}</p>
                          <p className="text-xs text-gray-500">{doc.reference}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {doc.docType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleClientClick(doc.clientId)}
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{doc.client}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">{doc.date}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {doc.dueDate}
                          {doc.daysOverdue > 0 && (
                            <p className="text-xs text-red-600">+{doc.daysOverdue}j</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        {formatAmount(doc.amount, doc.currency)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">
                        {formatAmount(doc.paid, doc.currency)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        <span className={doc.balance > 0 ? 'text-orange-600' : 'text-green-600'}>
                          {formatAmount(doc.balance, doc.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusLabel(doc.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Tooltip text="Voir les détails">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
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
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-right font-medium">Totaux</td>
                    <td className="px-4 py-3 text-right font-bold">
                      {formatAmount(totals.amount, selectedCurrency === 'all' ? 'EUR' : selectedCurrency)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">
                      {formatAmount(totals.paid, selectedCurrency === 'all' ? 'EUR' : selectedCurrency)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-orange-600">
                      {formatAmount(totals.balance, selectedCurrency === 'all' ? 'EUR' : selectedCurrency)}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total créances</span>
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl">{formatAmount(totals.amount, 'EUR')}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total encaissé</span>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl">{formatAmount(totals.paid, 'EUR')}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Solde restant</span>
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl">{formatAmount(totals.balance, 'EUR')}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">En litige</span>
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-2xl">{statusCounts.litiges}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
