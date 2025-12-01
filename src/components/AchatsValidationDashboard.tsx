import { useState } from 'react';
import { 
  Clock, CheckCircle, AlertCircle, Calendar, DollarSign, 
  User, FileText, Eye, Filter, TrendingUp, Bell
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDemandesAchats } from '../data/mockAchatsData';
import { getNotificationsValidationEnAttente, getStatistiquesNotifications } from '../data/mockNotifications';
import { STATUT_LABELS, PRIORITE_LABELS, DemandeAchatComplete } from '../types/achats';
import { AchatsDemandeDetail } from './AchatsDemandeDetail';

interface AchatsValidationDashboardProps {
  userEmail: string;
  userName: string;
}

export function AchatsValidationDashboard({ userEmail, userName }: AchatsValidationDashboardProps) {
  const { language } = useLanguage();
  const [selectedDemande, setSelectedDemande] = useState<DemandeAchatComplete | null>(null);
  const [filterPriorite, setFilterPriorite] = useState<string | null>(null);

  // Récupérer les stats de notifications
  const stats = getStatistiquesNotifications(userEmail);
  
  // Filtrer les demandes en attente de validation
  const demandesEnAttente = mockDemandesAchats.filter(demande => {
    // Statuts nécessitant validation
    const statutsValidation = ['soumis', 'valide_niveau_1', 'valide_niveau_2'];
    if (!statutsValidation.includes(demande.demande.statut_workflow)) {
      return false;
    }
    
    // Filtrer par priorité si sélectionné
    if (filterPriorite && demande.demande.priorite !== filterPriorite) {
      return false;
    }
    
    return true;
  });

  // Calculer les statistiques
  const statsValidation = {
    total_en_attente: demandesEnAttente.length,
    urgentes: demandesEnAttente.filter(d => d.demande.priorite === 'urgente').length,
    montant_total: demandesEnAttente.reduce((sum, d) => sum + d.montant_total, 0),
    en_retard: demandesEnAttente.filter(d => {
      const dateCreation = new Date(d.demande.created_at);
      const joursEcoules = Math.floor((Date.now() - dateCreation.getTime()) / (1000 * 60 * 60 * 24));
      return joursEcoules > 3; // Considéré en retard après 3 jours
    }).length
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    return `Il y a ${diffDays} jours`;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency}`;
  };

  const getNiveauValidation = (demande: DemandeAchatComplete) => {
    const niveauxApprouves = demande.validations.filter(v => v.statut === 'approuve').length;
    return niveauxApprouves + 1;
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Dashboard Validation</h2>
            <p className="text-sm text-gray-500 mt-1">
              Bienvenue {userName}, vous avez {stats.validation_requise} demande{stats.validation_requise > 1 ? 's' : ''} en attente
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications ({stats.non_lues})
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {/* Total en attente */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-orange-700 font-medium">En attente validation</span>
              <div className="bg-orange-100 rounded-lg p-2">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-900 mb-1">
              {statsValidation.total_en_attente}
            </div>
            <div className="text-xs text-orange-600">
              Action requise
            </div>
          </div>

          {/* Urgentes */}
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-red-700 font-medium">Urgentes</span>
              <div className="bg-red-100 rounded-lg p-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-900 mb-1">
              {statsValidation.urgentes}
            </div>
            <div className="text-xs text-red-600">
              Priorité haute
            </div>
          </div>

          {/* Montant total */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-blue-700 font-medium">Montant total</span>
              <div className="bg-blue-100 rounded-lg p-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {statsValidation.montant_total.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-blue-600">
              GHS (équivalent)
            </div>
          </div>

          {/* En retard */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-yellow-700 font-medium">En retard</span>
              <div className="bg-yellow-100 rounded-lg p-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-900 mb-1">
              {statsValidation.en_retard}
            </div>
            <div className="text-xs text-yellow-600">
              > 3 jours
            </div>
          </div>
        </div>
      </div>

      {/* Filtres rapides */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtrer par priorité:</span>
          <button
            onClick={() => setFilterPriorite(null)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filterPriorite === null 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes ({demandesEnAttente.length})
          </button>
          <button
            onClick={() => setFilterPriorite('urgente')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filterPriorite === 'urgente' 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Urgentes ({statsValidation.urgentes})
          </button>
          <button
            onClick={() => setFilterPriorite('normale')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              filterPriorite === 'normale' 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Normales
          </button>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="flex-1 overflow-y-auto p-6">
        {demandesEnAttente.length > 0 ? (
          <div className="space-y-4">
            {demandesEnAttente.map(demande => {
              const statusConfig = STATUT_LABELS[demande.demande.statut_workflow];
              const priorityConfig = PRIORITE_LABELS[demande.demande.priorite];
              const niveau = getNiveauValidation(demande);
              const dateCreation = new Date(demande.demande.created_at);
              const joursEcoules = Math.floor((Date.now() - dateCreation.getTime()) / (1000 * 60 * 60 * 24));
              const enRetard = joursEcoules > 3;

              return (
                <div
                  key={demande.demande.id}
                  className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
                    demande.demande.priorite === 'urgente' 
                      ? 'border-red-200 hover:border-red-400' 
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{demande.piece.Num_Piece}</h3>
                          <Badge className={`bg-${statusConfig.color}-100 text-${statusConfig.color}-700 text-xs`}>
                            Niveau {niveau}
                          </Badge>
                          <Badge className={`bg-${priorityConfig.color}-100 text-${priorityConfig.color}-700 text-xs`}>
                            {language === 'fr' ? priorityConfig.fr : priorityConfig.en}
                          </Badge>
                          {enRetard && (
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                              ⚠️ En retard
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{demande.demande.motif_achat}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-900">
                          {formatCurrency(demande.montant_total, demande.devise)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {demande.nb_lignes} ligne{demande.nb_lignes > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Demandeur</p>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <p className="text-sm font-medium">{demande.demande.created_by}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fournisseur</p>
                        <p className="text-sm font-medium mt-1">{demande.fournisseur?.Nom_Fournisseur}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Créée</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="text-sm font-medium">{formatDate(demande.demande.created_at)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="text-sm font-medium mt-1 capitalize">
                          {demande.demande.type_demande}
                        </p>
                      </div>
                    </div>

                    {/* Timeline validation simplifiée */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">Progression validation</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3].map(n => (
                          <div
                            key={n}
                            className={`flex-1 h-2 rounded-full ${
                              n < niveau ? 'bg-green-500' :
                              n === niveau ? 'bg-orange-500' :
                              'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Niveau {niveau}/3 • {demande.validations.filter(v => v.statut === 'approuve').length} validation{demande.validations.filter(v => v.statut === 'approuve').length > 1 ? 's' : ''} complétée{demande.validations.filter(v => v.statut === 'approuve').length > 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        onClick={() => setSelectedDemande(demande)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir et valider
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Validation rapide
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune demande en attente
            </h3>
            <p className="text-sm text-gray-500">
              Toutes les demandes d'achat ont été traitées. Excellent travail ! 🎉
            </p>
          </div>
        )}
      </div>

      {/* Modal détail */}
      {selectedDemande && (
        <AchatsDemandeDetail
          demande={selectedDemande}
          onClose={() => setSelectedDemande(null)}
        />
      )}
    </div>
  );
}
