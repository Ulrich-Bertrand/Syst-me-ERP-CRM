import { useState } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  FileText, Clock, CheckCircle2, XCircle, AlertTriangle, Ban,
  Building2, Calendar, DollarSign, Eye, ChevronRight,
  TrendingDown, Receipt, CreditCard, ArrowLeft, Printer, Mail,
  Phone, MapPin, User, TrendingUp, Package, Edit, Send, Wallet,
  Upload, File, ExternalLink, History, Activity, Briefcase, Globe,
  Star, Tag, ShoppingCart, ReceiptText
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

export function CreanciersView() {
  const [activeStatus, setActiveStatus] = useState('a-payer');
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [selectedSupplierType, setSelectedSupplierType] = useState<string | null>(null);
  const [expandedDocTypes, setExpandedDocTypes] = useState<Set<string>>(
    new Set(['facture-achat', 'note-credit', 'autres', 'types-fournisseurs'])
  );
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const documentTypes = [
    {
      id: 'facture-achat',
      label: 'Factures d\'achat',
      icon: FileText,
      color: 'text-blue-600',
      children: [
        { id: 'facture-standard', label: 'Facture standard', count: 234 },
        { id: 'facture-avoir', label: 'Facture avoir', count: 23 }
      ]
    },
    {
      id: 'note-credit',
      label: 'Notes de crédit',
      icon: Receipt,
      color: 'text-green-600',
      children: [
        { id: 'note-credit-std', label: 'Standard', count: 45 },
        { id: 'note-credit-retour', label: 'Retour marchandises', count: 12 }
      ]
    },
    {
      id: 'autres',
      label: 'Autres dépenses',
      icon: CreditCard,
      color: 'text-purple-600',
      children: [
        { id: 'frais-divers', label: 'Frais divers', count: 67 },
        { id: 'services', label: 'Services', count: 89 }
      ]
    }
  ];

  const supplierTypes = [
    {
      id: 'types-fournisseurs',
      label: 'Types de fournisseurs',
      icon: User,
      color: 'text-indigo-600',
      children: [
        { id: 'fournisseur-actif', label: 'Fournisseurs actifs', count: 87 },
        { id: 'fournisseur-inactif', label: 'Fournisseurs inactifs', count: 12 }
      ]
    }
  ];

  const supplierCategories = [
    { id: 'local', label: 'Fournisseur local', icon: MapPin, color: 'bg-blue-100 text-blue-700' },
    { id: 'partenaire', label: 'Partenaire stratégique', icon: Star, color: 'bg-purple-100 text-purple-700' },
    { id: 'international', label: 'International', icon: Globe, color: 'bg-green-100 text-green-700' },
    { id: 'premium', label: 'Premium', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
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
      id: 'FINV-2025-001',
      type: 'facture-standard',
      docType: 'Facture d\'achat',
      supplier: 'Maritime Services Ltd',
      supplierId: 'SUPP-001',
      reference: 'SUPP-INV-2025-045',
      date: '01/11/2025',
      dueDate: '01/12/2025',
      amount: 25000.00,
      currency: 'EUR',
      paid: 0.00,
      balance: 25000.00,
      status: 'a-payer',
      daysOverdue: 0,
      priority: 'high'
    },
    {
      id: 'FINV-2025-002',
      type: 'facture-standard',
      docType: 'Facture d\'achat',
      supplier: 'Fuel Supply Company',
      supplierId: 'SUPP-002',
      reference: 'FSC-2025-789',
      date: '05/11/2025',
      dueDate: '20/11/2025',
      amount: 45000.00,
      currency: 'USD',
      paid: 20000.00,
      balance: 25000.00,
      status: 'partiel',
      daysOverdue: 7,
      priority: 'high'
    },
  ];

  const mockSuppliers = [
    {
      id: 'SUPP-001',
      name: 'Maritime Services Ltd',
      category: 'partenaire',
      type: 'fournisseur-actif',
      contact: 'John Smith',
      email: 'j.smith@maritime.com',
      phone: '+44 20 1234 5678',
      address: '45 Port Street, London SW1A 1AA, United Kingdom',
      taxId: 'GB123456789',
      paymentTerms: '30 jours',
      currentBalance: 25000.00,
      totalPurchases: 450000.00,
      lastPaymentDate: '15/11/2025',
      lastPaymentAmount: 30000.00,
      currency: 'EUR',
      status: 'active',
      purchaseOrdersInProgress: 4,
      invoicesInProgress: 2,
      invoicesPending: 1,
      credits: 0,
      payments: 42,
      overdueAmount: 0.00,
      pendingApproval: 1,
      unpaidInvoices: 2,
      documents: [
        { id: 'DOC-001', name: 'Contrat_Maritime_2025.pdf', type: 'Contrat', size: '3.2 MB', date: '15/01/2025' },
        { id: 'DOC-002', name: 'Certificat_TVA.pdf', type: 'Fiscal', size: '234 KB', date: '10/01/2025' },
        { id: 'DOC-003', name: 'RIB_Maritime.pdf', type: 'Bancaire', size: '145 KB', date: '05/01/2025' },
        { id: 'DOC-004', name: 'Assurance_Responsabilite.pdf', type: 'Assurance', size: '1.8 MB', date: '01/01/2025' },
      ]
    },
    {
      id: 'SUPP-002',
      name: 'Fuel Supply Company',
      category: 'international',
      type: 'fournisseur-actif',
      contact: 'Sarah Johnson',
      email: 's.johnson@fuelsupply.com',
      phone: '+1 555 123 4567',
      address: '789 Industrial Ave, Houston TX 77001, USA',
      taxId: 'US987654321',
      paymentTerms: '45 jours',
      currentBalance: 25000.00,
      totalPurchases: 780000.00,
      lastPaymentDate: '18/11/2025',
      lastPaymentAmount: 20000.00,
      currency: 'USD',
      status: 'active',
      purchaseOrdersInProgress: 6,
      invoicesInProgress: 3,
      invoicesPending: 2,
      credits: 1,
      payments: 67,
      overdueAmount: 25000.00,
      pendingApproval: 0,
      unpaidInvoices: 3,
      documents: [
        { id: 'DOC-005', name: 'Contrat_FuelSupply_2025.pdf', type: 'Contrat', size: '2.9 MB', date: '12/01/2025' },
        { id: 'DOC-006', name: 'Catalogue_Prix_2025.pdf', type: 'Commercial', size: '5.4 MB', date: '08/01/2025' },
      ]
    },
  ];

  const statusCounts = {
    brouillon: 34,
    'en-attente': 56,
    validees: 123,
    'a-payer': 89,
    partiel: 45,
    'en-retard': 23,
    payees: 567,
    annulees: 12,
    tous: 949
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brouillon': return 'bg-gray-100 text-gray-700';
      case 'en-attente': return 'bg-yellow-100 text-yellow-700';
      case 'validees': return 'bg-blue-100 text-blue-700';
      case 'a-payer': return 'bg-orange-100 text-orange-700';
      case 'partiel': return 'bg-purple-100 text-purple-700';
      case 'en-retard': return 'bg-red-100 text-red-700';
      case 'payees': return 'bg-green-100 text-green-700';
      case 'annulees': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'brouillon': return 'Brouillon';
      case 'en-attente': return 'En attente d\'approbation';
      case 'validees': return 'Validées';
      case 'a-payer': return 'À payer';
      case 'partiel': return 'Payées partiellement';
      case 'en-retard': return 'En retard';
      case 'payees': return 'Payées';
      case 'annulees': return 'Annulées';
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

  const handleSupplierClick = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    setSelectedSupplier(supplier || null);
    setActiveTab('overview');
  };

  const getCategoryBadge = (categoryId: string) => {
    return supplierCategories.find(c => c.id === categoryId);
  };

  if (selectedSupplier) {
    const categoryInfo = getCategoryBadge(selectedSupplier.category);
    const CategoryIcon = categoryInfo?.icon || Tag;

    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Enhanced Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Tooltip text="Retour à la liste des fournisseurs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSupplier(null)}
                    className="mt-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Tooltip>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl">{selectedSupplier.name}</h2>
                    {categoryInfo && (
                      <Badge className={categoryInfo.color}>
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {categoryInfo.label}
                      </Badge>
                    )}
                    <Badge variant={selectedSupplier.status === 'active' ? 'default' : 'secondary'}>
                      {selectedSupplier.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedSupplier.contact}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedSupplier.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {selectedSupplier.phone}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Réf: {selectedSupplier.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip text="Modifier les informations du fournisseur">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </Tooltip>
                <Tooltip text="Envoyer un email au fournisseur">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </Tooltip>
                <Tooltip text="Effectuer un paiement à ce fournisseur">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Payer le fournisseur
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Tooltip text="Imprimer le relevé de compte fournisseur">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Relevé de compte
                </Button>
              </Tooltip>
              <Tooltip text="Imprimer l'état des dettes du fournisseur">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  État des dettes
                </Button>
              </Tooltip>
              <Tooltip text="Télécharger toutes les factures du fournisseur">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Factures
                </Button>
              </Tooltip>
              <Tooltip text="Créer un nouveau bon de commande">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Nouveau BC
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
                Documents ({selectedSupplier.documents.length})
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
                      <span className="text-sm font-medium text-gray-600">Solde dû</span>
                      <DollarSign className="h-5 w-5 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      {formatAmount(selectedSupplier.currentBalance, selectedSupplier.currency)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Montant à payer</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Total des achats</span>
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold">
                      {formatAmount(selectedSupplier.totalPurchases, selectedSupplier.currency)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Depuis le début</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Montants échus</span>
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatAmount(selectedSupplier.overdueAmount, selectedSupplier.currency)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">En retard de paiement</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Factures impayées</span>
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">{selectedSupplier.unpaidInvoices}</p>
                    <p className="text-xs text-gray-500 mt-1">À régler rapidement</p>
                  </div>
                </div>

                {/* Comprehensive Summary Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ReceiptText className="h-5 w-5 text-purple-600" />
                      Tableau récapitulatif
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Commandes d'achat en cours</span>
                          </div>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {selectedSupplier.purchaseOrdersInProgress}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-gray-700">Factures en attente</span>
                          </div>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {selectedSupplier.invoicesPending}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Factures en cours</span>
                          </div>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {selectedSupplier.invoicesInProgress}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-gray-700">Factures non payées</span>
                          </div>
                          <Badge variant="default" className="text-base px-3 py-1 bg-red-600">
                            {selectedSupplier.unpaidInvoices}
                          </Badge>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Notes de crédit</span>
                          </div>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {selectedSupplier.credits}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Paiements effectués</span>
                          </div>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {selectedSupplier.payments}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">Date du dernier paiement</span>
                          </div>
                          <span className="text-sm font-semibold">{selectedSupplier.lastPaymentDate}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Montant du dernier paiement</span>
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            {formatAmount(selectedSupplier.lastPaymentAmount, selectedSupplier.currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Row */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-12">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-gray-700">En attente d'approbation</span>
                        </div>
                        <Badge variant={selectedSupplier.pendingApproval > 0 ? 'default' : 'secondary'} className="text-base px-3 py-1">
                          {selectedSupplier.pendingApproval}
                        </Badge>
                      </div>
                    </div>

                    {/* Total Row */}
                    <div className="mt-6 pt-4 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between py-2 bg-purple-50 px-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-gray-900">Total des achats (historique)</span>
                        </div>
                        <span className="text-xl font-bold text-purple-600">
                          {formatAmount(selectedSupplier.totalPurchases, selectedSupplier.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-600" />
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
                          <p className="text-sm font-medium">Paiement effectué</p>
                          <p className="text-sm text-gray-600">30,000.00 € payé pour FINV-2025-045</p>
                          <p className="text-xs text-gray-400 mt-1">15/11/2025 à 11:45</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="mt-1 p-2 bg-blue-100 rounded-full">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Nouvelle facture reçue</p>
                          <p className="text-sm text-gray-600">SUPP-INV-2025-045 - 25,000.00 €</p>
                          <p className="text-xs text-gray-400 mt-1">01/11/2025 à 09:30</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="mt-1 p-2 bg-orange-100 rounded-full">
                          <ShoppingCart className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Bon de commande créé</p>
                          <p className="text-sm text-gray-600">BC-2025-034 validé</p>
                          <p className="text-xs text-gray-400 mt-1">25/10/2025 à 14:20</p>
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
                      .filter(doc => doc.supplierId === selectedSupplier.id)
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
                            <span className={doc.balance > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
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
                    <File className="h-5 w-5 text-purple-600" />
                    Documents du fournisseur
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
                    {selectedSupplier.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <File className="h-5 w-5 text-purple-600" />
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
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-purple-600" />
                      Informations société
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Raison sociale</label>
                      <p className="text-sm font-medium mt-1">{selectedSupplier.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Référence</label>
                      <p className="text-sm font-mono mt-1">{selectedSupplier.id}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">N° TVA</label>
                      <p className="text-sm font-mono mt-1">{selectedSupplier.taxId}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Adresse</label>
                      <p className="text-sm mt-1 flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        {selectedSupplier.address}
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
                        <p className="text-sm font-medium mt-1">{selectedSupplier.contact}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                        <p className="text-sm mt-1 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {selectedSupplier.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Téléphone</label>
                        <p className="text-sm mt-1 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {selectedSupplier.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Terms */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-orange-600" />
                        Conditions de paiement
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Délai de paiement</label>
                        <p className="text-sm font-medium mt-1">{selectedSupplier.paymentTerms}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Devise</label>
                        <p className="text-sm font-medium mt-1">{selectedSupplier.currency}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Payer le fournisseur</h3>
                <Tooltip text="Fermer">
                  <Button variant="ghost" size="sm" onClick={() => setShowPaymentModal(false)}>
                    <XCircle className="h-5 w-5" />
                  </Button>
                </Tooltip>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <label className="text-sm font-medium text-purple-900">Fournisseur</label>
                  <p className="text-sm text-purple-700 mt-1">{selectedSupplier.name}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <label className="text-sm font-medium text-red-900">Solde dû</label>
                  <p className="text-xl font-bold text-red-600 mt-1">
                    {formatAmount(selectedSupplier.currentBalance, selectedSupplier.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Montant à payer *</label>
                  <input
                    type="number"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mode de paiement *</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Sélectionner...</option>
                    <option>Virement bancaire</option>
                    <option>Chèque</option>
                    <option>Espèces</option>
                    <option>Carte de crédit</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date de paiement *</label>
                  <input
                    type="date"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Compte bancaire</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Sélectionner un compte...</option>
                    <option>Compte principal - EUR</option>
                    <option>Compte USD</option>
                    <option>Compte MAD</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Notes optionnelles sur ce paiement..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Tooltip text="Annuler et fermer la fenêtre">
                  <Button variant="outline" size="sm" onClick={() => setShowPaymentModal(false)}>
                    Annuler
                  </Button>
                </Tooltip>
                <Tooltip text="Enregistrer le paiement">
                  <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Valider le paiement
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
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
              <h2 className="text-lg">Créanciers / Fournisseurs</h2>
              <p className="text-sm text-gray-500">Gestion des dettes fournisseurs</p>
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
              <Tooltip text="Créer une nouvelle facture fournisseur">
                <Button variant="default" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle facture
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
              { id: 'a-payer', label: 'À payer', icon: AlertTriangle },
              { id: 'partiel', label: 'Partiellement payées', icon: TrendingDown },
              { id: 'en-retard', label: 'En retard', icon: XCircle },
              { id: 'payees', label: 'Payées', icon: CheckCircle2 },
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

              {/* Supplier Types Section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                {supplierTypes.map((type) => {
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
                              onClick={() => setSelectedSupplierType(child.id)}
                              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                selectedSupplierType === child.id
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
                  placeholder="Rechercher par référence, fournisseur, montant..."
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
                    <th className="px-4 py-3 text-left text-xs">Fournisseur</th>
                    <th className="px-4 py-3 text-left text-xs">Date</th>
                    <th className="px-4 py-3 text-left text-xs">Échéance</th>
                    <th className="px-4 py-3 text-right text-xs">Montant</th>
                    <th className="px-4 py-3 text-right text-xs">Payé</th>
                    <th className="px-4 py-3 text-right text-xs">Solde</th>
                    <th className="px-4 py-3 text-left text-xs">Priorité</th>
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
                          onClick={() => handleSupplierClick(doc.supplierId)}
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          <Building2 className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">{doc.supplier}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">{doc.date}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {doc.dueDate}
                          {doc.daysOverdue > 0 && (
                            <p className="text-xs text-red-600">+{doc.daysOverdue}j retard</p>
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
                        <span className={doc.balance > 0 ? 'text-red-600' : 'text-green-600'}>
                          {formatAmount(doc.balance, doc.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${getPriorityColor(doc.priority)}`}>
                          {getPriorityLabel(doc.priority)}
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
                    <td className="px-4 py-3 text-right font-bold text-red-600">
                      {formatAmount(totals.balance, selectedCurrency === 'all' ? 'EUR' : selectedCurrency)}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total dettes</span>
                  <DollarSign className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-2xl">{formatAmount(totals.amount, 'EUR')}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total payé</span>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl">{formatAmount(totals.paid, 'EUR')}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">À payer</span>
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl">{formatAmount(totals.balance, 'EUR')}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">En retard</span>
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-2xl">{statusCounts['en-retard']}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Fournisseurs</span>
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl">127</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
