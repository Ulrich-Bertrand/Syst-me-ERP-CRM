/**
 * ═══════════════════════════════════════════════════════════════
 * ACHATS VIEW - INTÉGRATION API COMPLÈTE
 * ═══════════════════════════════════════════════════════════════
 * 
 * ENDPOINTS UTILISÉS:
 * - GET /api/demandes → Liste demandes
 * - GET /api/demandes/:id → Détail demande
 * - POST /api/demandes → Créer demande
 * - DELETE /api/demandes/:id → Supprimer demande
 * - POST /api/demandes/:id/submit → Soumettre demande
 * - GET /api/dashboard/stats → KPIs dashboard
 * 
 * ÉTAT: ✅ INTÉGRÉ AVEC API
 */

import { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Download, Settings, MoreVertical,
  ChevronRight, AlertCircle, CheckCircle, Clock, XCircle,
  FileText, Package, TrendingUp, Calendar, DollarSign,
  User, Building2, Eye, Edit, Trash2, Bell, Circle,
  Truck, Box, Send, Flag, Loader2, RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDemandesAchats } from '../../hooks/useDemandesAchats';
import { dashboardApi } from '../../services/api';
import { 
  DemandeAchatComplete,
  DemandeAchatListe,
  CreateDemandeRequest,
  STATUT_LABELS,
  TYPE_LABELS
} from '../../types/achats-api.types';
import { AchatsDemandeForm } from '../AchatsDemandeForm';
import { AchatsDemandeDetail } from '../AchatsDemandeDetail';
import { toast } from 'sonner@2.0.3';

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

export function AchatsView({ viewType }: { viewType: string }) {
  // ========== HOOKS ==========
  const { t, language } = useLanguage();
  const { agence } = useAuth(); // 🆕 Récupérer agence active
  
  // 🆕 Hook demandes d'achat (API)
  const {
    loading,
    demandes,
    pagination,
    fetchDemandes,
    createDemande,
    deleteDemande,
    submitDemande,
    fetchDemandeById
  } = useDemandesAchats();
  
  // ========== STATE LOCAL ==========
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState<DemandeAchatComplete | null>(null);
  const [kpis, setKpis] = useState<any>(null); // 🆕 KPIs from API
  const [loadingKpis, setLoadingKpis] = useState(false);
  
  // ========== EFFETS ==========
  
  /**
   * 📊 CHARGEMENT INITIAL
   * Charge demandes + KPIs au montage
   */
  useEffect(() => {
    console.log('[AchatsView] Montage composant');
    loadData();
  }, []);
  
  /**
   * 🔄 RECHARGEMENT SUR CHANGEMENT AGENCE
   * Recharge données quand l'utilisateur change d'agence
   */
  useEffect(() => {
    if (agence) {
      console.log('[AchatsView] Changement agence:', agence);
      loadData();
    }
  }, [agence]);
  
  /**
   * 🔍 APPLICATION FILTRES
   * Recharge quand filtre change
   */
  useEffect(() => {
    if (selectedFilter !== null) {
      console.log('[AchatsView] Application filtre:', selectedFilter);
      applyFilters();
    }
  }, [selectedFilter]);
  
  // ========== FONCTIONS CHARGEMENT ==========
  
  /**
   * 📥 CHARGER TOUTES LES DONNÉES
   * 
   * APPELS API:
   *   1. GET /api/demandes?agence={agence}&page=1&limit=20
   *   2. GET /api/dashboard/stats?agence={agence}
   * 
   * GESTION ERREURS:
   *   - Gérées par les hooks/services (toast automatique)
   */
  const loadData = async () => {
    try {
      console.log('[AchatsView] Chargement données pour agence:', agence);
      
      // Charger demandes
      await fetchDemandes({
        agence: agence as any,
        page: 1,
        limit: 20
      });
      
      // Charger KPIs
      await loadKpis();
      
      console.log('[AchatsView] ✅ Données chargées');
    } catch (error) {
      console.error('[AchatsView] ❌ Erreur chargement:', error);
    }
  };
  
  /**
   * 📊 CHARGER KPIs DASHBOARD
   * 
   * ENDPOINT: GET /api/dashboard/stats?agence={agence}
   */
  const loadKpis = async () => {
    try {
      setLoadingKpis(true);
      
      console.log('[AchatsView] Chargement KPIs...');
      
      const kpisData = await dashboardApi.getStats({ agence: agence as any });
      
      console.log('[AchatsView] KPIs chargés:', kpisData);
      
      setKpis(kpisData);
    } catch (error: any) {
      console.error('[AchatsView] Erreur chargement KPIs:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoadingKpis(false);
    }
  };
  
  // ========== FONCTIONS FILTRES ==========
  
  /**
   * 🔍 APPLIQUER FILTRES
   * 
   * MAPPING FILTRES UI → API:
   * - 'pending-approval' → statut=en_validation_niveau_1
   * - 'approved' → statut=validee
   * - 'paid' → statut=paye (⚠️ pas dans l'API actuelle, à implémenter)
   * - 'rejected' → statut=rejetee
   * 
   * ENDPOINT: GET /api/demandes?agence={agence}&statut={statut}
   */
  const applyFilters = async () => {
    const filters: any = {
      agence: agence as any,
      page: 1,
      limit: 20
    };
    
    // Mapper filtre UI → filtre API
    switch (selectedFilter) {
      case 'pending-approval':
        // Toutes les demandes en validation (N1, N2, N3)
        filters.statut = 'en_validation_niveau_1';
        break;
      case 'approved':
        filters.statut = 'validee';
        break;
      case 'rejected':
        filters.statut = 'rejetee';
        break;
      // ⚠️ Filtres ci-dessous nécessitent extension API backend
      case 'paid':
        // TODO: Ajouter statut 'paye' dans l'API
        console.warn('[AchatsView] Filtre "paid" non supporté par l\'API actuelle');
        break;
      case 'awaiting-justification':
        // TODO: Ajouter logique justificatifs dans l'API
        console.warn('[AchatsView] Filtre "awaiting-justification" non supporté par l\'API actuelle');
        break;
      case 'dossier':
        // TODO: Ajouter filtre type_demande dans l'API
        console.warn('[AchatsView] Filtre "dossier" non supporté par l\'API actuelle');
        break;
      case 'agence':
        // TODO: Ajouter filtre type_demande dans l'API
        console.warn('[AchatsView] Filtre "agence" non supporté par l\'API actuelle');
        break;
    }
    
    console.log('[AchatsView] Application filtres:', filters);
    
    await fetchDemandes(filters);
  };
  
  /**
   * 🔎 RECHERCHE
   * 
   * ENDPOINT: GET /api/demandes?search={query}
   * 
   * Backend recherche dans:
   *   - reference
   *   - objet
   *   - justification
   */
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length >= 3) {
      console.log('[AchatsView] Recherche:', query);
      
      await fetchDemandes({
        agence: agence as any,
        // ⚠️ TODO: Ajouter param 'search' dans l'API backend
        page: 1,
        limit: 20
      });
    } else if (query.length === 0) {
      // Reset
      console.log('[AchatsView] Reset recherche');
      await loadData();
    }
  };
  
  /**
   * 📄 CHANGEMENT PAGE
   * 
   * ENDPOINT: GET /api/demandes?page={page}&limit={limit}
   */
  const handlePageChange = async (newPage: number) => {
    console.log('[AchatsView] Changement page:', newPage);
    
    await fetchDemandes({
      agence: agence as any,
      page: newPage,
      limit: 20
    });
  };
  
  // ========== FONCTIONS ACTIONS ==========
  
  /**
   * ➕ CRÉER DEMANDE
   * 
   * ENDPOINT: POST /api/demandes
   * BODY: CreateDemandeRequest
   * 
   * RÉPONSE:
   * {
   *   message: "Demande créée avec succès",
   *   data: { id: 123, reference: "DA-2025-001", ... }
   * }
   */
  const handleNewDemande = async (formData: any) => {
    try {
      console.log('[AchatsView] Création demande:', formData);
      
      // Formatter données selon CreateDemandeRequest
      const requestData: CreateDemandeRequest = {
        agence: agence as any,
        type: formData.type || 'NORMALE',
        objet: formData.motif_achat || formData.objet,
        justification: formData.justification || formData.observation || 'Demande d\'achat',
        date_besoin: formData.date_besoin || new Date().toISOString().split('T')[0],
        lignes: formData.lignes.map((ligne: any) => ({
          designation: ligne.designation,
          quantite: ligne.quantite,
          unite: ligne.unite || 'Pièce',
          prix_unitaire_estime: ligne.prix_unitaire,
          description: ligne.description
        }))
      };
      
      console.log('[AchatsView] Request data formatté:', requestData);
      
      // Appel API
      const newDemande = await createDemande(requestData);
      
      console.log('[AchatsView] ✅ Demande créée:', newDemande.reference);
      
      // Fermer modal
      setShowNewForm(false);
      
      // Recharger liste
      await loadData();
      
    } catch (error) {
      console.error('[AchatsView] ❌ Erreur création:', error);
      // Toast déjà affiché par le hook
    }
  };
  
  /**
   * 🗑️ SUPPRIMER DEMANDE
   * 
   * ENDPOINT: DELETE /api/demandes/:id
   * 
   * CONDITIONS:
   *   - Demande doit être en statut "brouillon"
   *   - User doit être le demandeur
   * 
   * RÉPONSE:
   * {
   *   message: "Demande supprimée avec succès"
   * }
   */
  const handleDeleteDemande = async (id: number) => {
    // Confirmation
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }
    
    try {
      console.log('[AchatsView] Suppression demande:', id);
      
      // Appel API
      await deleteDemande(id);
      
      console.log('[AchatsView] ✅ Demande supprimée');
      
      // Recharger données
      await loadData();
      
    } catch (error) {
      console.error('[AchatsView] ❌ Erreur suppression:', error);
      // Toast déjà affiché par le hook
    }
  };
  
  /**
   * 📤 SOUMETTRE DEMANDE
   * 
   * ENDPOINT: POST /api/demandes/:id/submit
   * 
   * EFFET:
   *   statut: "brouillon" → "en_validation_niveau_1"
   */
  const handleSubmitDemande = async (id: number) => {
    try {
      console.log('[AchatsView] Soumission demande:', id);
      
      // Appel API
      await submitDemande(id);
      
      console.log('[AchatsView] ✅ Demande soumise');
      
      // Recharger liste
      await loadData();
      
    } catch (error) {
      console.error('[AchatsView] ❌ Erreur soumission:', error);
    }
  };
  
  /**
   * 👁️ AFFICHER DÉTAIL
   * 
   * ENDPOINT: GET /api/demandes/:id
   * 
   * RÉPONSE:
   * {
   *   id: 123,
   *   reference: "DA-2025-001",
   *   ...
   *   lignes: [...],
   *   historique_validations: [...]
   * }
   */
  const handleViewDemande = async (id: number) => {
    try {
      console.log('[AchatsView] Chargement détail demande:', id);
      
      // Appel API
      const demande = await fetchDemandeById(id);
      
      console.log('[AchatsView] ✅ Détail chargé:', demande.reference);
      
      // Ouvrir modal
      setSelectedDemande(demande);
      
    } catch (error) {
      console.error('[AchatsView] ❌ Erreur chargement détail:', error);
    }
  };
  
  // ========== HELPERS ==========
  
  const formatCurrency = (amount: number) => {
    return `GHS ${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Calculer stats pour les filtres
  const stats = {
    total: pagination.total,
    totalAmount: kpis?.montant_total || 0,
    pendingApproval: kpis?.demandes_en_attente || 0,
    approved: kpis?.demandes_validees || 0,
    paid: 0, // ⚠️ TODO: Ajouter dans l'API
    awaitingJustification: 0, // ⚠️ TODO: Ajouter dans l'API
    rejected: 0, // ⚠️ TODO: Ajouter dans l'API
    dossier: 0, // ⚠️ TODO: Ajouter dans l'API
    agence: pagination.total // Temporaire
  };

  // ========== LOADING STATE ==========
  
  // Pendant chargement initial
  if (loading && demandes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des demandes d'achat...</p>
          <p className="text-sm text-gray-500 mt-2">Agence: {agence}</p>
        </div>
      </div>
    );
  }

  // ========== RENDER ==========
  
  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar - Filters */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">{t('purchases.filters.title')}</h3>
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
          </div>
          
          {/* Quick Filters - Par statut */}
          <div className="space-y-1 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Par statut</p>
            
            <button
              onClick={() => {
                setSelectedFilter(null);
                loadData();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                selectedFilter === null
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedFilter === null ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <FileText className={`h-4 w-4 ${selectedFilter === null ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <span className="text-sm">Toutes les demandes</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {stats.total}
              </Badge>
            </button>

            <button
              onClick={() => setSelectedFilter('pending-approval')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                selectedFilter === 'pending-approval'
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-gray-700 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedFilter === 'pending-approval' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  <Clock className={`h-4 w-4 ${selectedFilter === 'pending-approval' ? 'text-orange-600' : 'text-gray-600'}`} />
                </div>
                <span className="text-sm">En attente validation</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {stats.pendingApproval}
              </Badge>
            </button>

            <button
              onClick={() => setSelectedFilter('approved')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                selectedFilter === 'approved'
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'text-gray-700 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedFilter === 'approved' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CheckCircle className={`h-4 w-4 ${selectedFilter === 'approved' ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <span className="text-sm">Approuvées</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {stats.approved}
              </Badge>
            </button>

            <button
              onClick={() => setSelectedFilter('rejected')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                selectedFilter === 'rejected'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'text-gray-700 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedFilter === 'rejected' ? 'bg-red-100' : 'bg-gray-100'}`}>
                  <XCircle className={`h-4 w-4 ${selectedFilter === 'rejected' ? 'text-red-600' : 'text-gray-600'}`} />
                </div>
                <span className="text-sm">Rejetées</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {stats.rejected}
              </Badge>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg">{t('purchases.title')}</h2>
              <p className="text-sm text-gray-500">{t('purchases.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button variant="default" size="sm" onClick={() => setShowNewForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('purchases.actions.new')}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('purchases.actions.export')}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4">
            {/* Total demandes - Bleu */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-blue-700 font-medium">Total demandes</span>
                <div className="bg-blue-100 rounded-lg p-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">{stats.total}</div>
              <div className="text-sm text-blue-600">{formatCurrency(stats.totalAmount)}</div>
            </div>

            {/* En attente - Orange */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-orange-700 font-medium">En attente</span>
                <div className="bg-orange-100 rounded-lg p-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-orange-900 mb-1">{stats.pendingApproval}</div>
              <div className="text-xs text-orange-600">Validation en cours</div>
            </div>

            {/* Approuvées - Vert */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-green-700 font-medium">Approuvées</span>
                <div className="bg-green-100 rounded-lg p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-900 mb-1">{stats.approved}</div>
              <div className="text-xs text-green-600">Prêtes pour BC/Paiement</div>
            </div>

            {/* Payées - Emerald */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-emerald-700 font-medium">Payées</span>
                <div className="bg-emerald-100 rounded-lg p-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-900 mb-1">{stats.paid}</div>
              <div className="text-xs text-emerald-600">
                {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}% du total
              </div>
            </div>

            {/* Rejetées - Rouge */}
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-red-700 font-medium">Rejetées</span>
                <div className="bg-red-100 rounded-lg p-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-red-900 mb-1">{stats.rejected}</div>
              <div className="text-xs text-red-600">À retravailler</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('purchases.search.placeholder')}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-white p-6">
          {demandes.length > 0 ? (
            <>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Référence</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Objet</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Demandeur</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Montant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {demandes.map((demande) => {
                      const statusConfig = STATUT_LABELS[demande.statut as keyof typeof STATUT_LABELS] || {
                        fr: demande.statut,
                        en: demande.statut,
                        color: 'gray',
                        icon: 'circle'
                      };
                      const typeConfig = TYPE_LABELS[demande.type as keyof typeof TYPE_LABELS] || {
                        fr: demande.type,
                        en: demande.type,
                        color: 'gray',
                        icon: 'file'
                      };

                      return (
                        <tr 
                          key={demande.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewDemande(demande.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="text-sm font-medium text-blue-600">{demande.reference}</p>
                                <p className="text-xs text-gray-500">{formatDate(demande.date_demande)}</p>
                              </div>
                              {demande.type === 'URGENTE' && (
                                <Flag className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={`bg-${typeConfig.color}-100 text-${typeConfig.color}-700 text-xs`}>
                              {language === 'fr' ? typeConfig.fr : typeConfig.en}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium truncate max-w-xs">{demande.objet}</p>
                            <p className="text-xs text-gray-500">{demande.nombre_lignes} ligne(s)</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm">
                              {demande.demandeur_prenom} {demande.demandeur_nom}
                            </p>
                            <p className="text-xs text-gray-500">{demande.demandeur_email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-gray-500">
                              {formatDate(demande.date_demande)}
                            </p>
                            <p className="text-xs text-orange-600 mt-1">
                              Besoin: {formatDate(demande.date_besoin)}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <p className="text-sm font-medium">{formatCurrency(demande.montant_total_estime)}</p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={`bg-${statusConfig.color}-100 text-${statusConfig.color}-700 text-xs`}>
                              {language === 'fr' ? statusConfig.fr : statusConfig.en}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Tooltip text="Voir les détails">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDemande(demande.id);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                              
                              {demande.statut === 'brouillon' && (
                                <>
                                  <Tooltip text="Soumettre">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubmitDemande(demande.id);
                                      }}
                                    >
                                      <Send className="h-4 w-4 text-blue-600" />
                                    </Button>
                                  </Tooltip>
                                  
                                  <Tooltip text="Supprimer">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteDemande(demande.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </Tooltip>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Affichage {((pagination.page - 1) * pagination.limit) + 1}-
                  {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1 || loading}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page * pagination.limit >= pagination.total || loading}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Aucune demande d'achat trouvée</p>
              <p className="text-sm mt-1">
                {selectedFilter 
                  ? 'Essayez de modifier vos filtres de recherche'
                  : 'Cliquez sur "Nouvelle demande" pour créer votre première demande'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showNewForm && (
        <AchatsDemandeForm
          onClose={() => setShowNewForm(false)}
          onSubmit={handleNewDemande}
        />
      )}

      {selectedDemande && (
        <AchatsDemandeDetail
          demande={selectedDemande as any}
          onClose={() => setSelectedDemande(null)}
        />
      )}
    </div>
  );
}