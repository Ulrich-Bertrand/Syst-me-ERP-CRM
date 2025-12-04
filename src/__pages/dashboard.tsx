import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { dashboardApi, DashboardStats, DemandeRecente } from '../services/api';
import { toast } from 'sonner@2.0.3';
import { 
  ShoppingCart, 
  FileText, 
  DollarSign, 
  Package, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user, agence } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [demandesRecentes, setDemandesRecentes] = useState<DemandeRecente[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger données au montage et quand l'agence change
  useEffect(() => {
    loadDashboardData();
  }, [agence]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger stats et demandes en parallèle
      const [statsData, demandesData] = await Promise.all([
        dashboardApi.getStats({ agence: agence as any }),
        dashboardApi.getDemandesRecentes({ agence: agence as any, limit: 3 })
      ]);

      setStats(statsData);
      setDemandesRecentes(demandesData);
    } catch (error: any) {
      console.error('Erreur chargement dashboard:', error);
      toast.error(error.response?.data?.error || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Configuration des stats cards
  const statsCards = stats ? [
    {
      titre: 'Demandes en attente',
      valeur: stats.demandes_en_attente.toString(),
      variation: 'Vos demandes en cours',
      icon: Clock,
      couleur: 'text-orange-600',
      bgCouleur: 'bg-orange-100'
    },
    {
      titre: 'Demandes validées',
      valeur: stats.demandes_validees.toString(),
      variation: 'Ce mois',
      icon: CheckCircle,
      couleur: 'text-green-600',
      bgCouleur: 'bg-green-100'
    },
    {
      titre: 'Bons de commande',
      valeur: stats.bons_commande_en_cours.toString(),
      variation: 'En cours',
      icon: FileText,
      couleur: 'text-blue-600',
      bgCouleur: 'bg-blue-100'
    },
    {
      titre: 'Montant total',
      valeur: `GHS ${stats.montant_total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`,
      variation: 'Demandes validées ce mois',
      icon: DollarSign,
      couleur: 'text-purple-600',
      bgCouleur: 'bg-purple-100'
    },
    {
      titre: 'Alertes stock',
      valeur: stats.alertes_stock.toString(),
      variation: 'Articles à réapprovisionner',
      icon: AlertTriangle,
      couleur: 'text-red-600',
      bgCouleur: 'bg-red-100'
    },
    {
      titre: 'Fournisseurs actifs',
      valeur: stats.fournisseurs_actifs.toString(),
      variation: 'Partenaires',
      icon: Users,
      couleur: 'text-indigo-600',
      bgCouleur: 'bg-indigo-100'
    }
  ] : [];

  const getStatutBadge = (statut: string) => {
    const config: any = {
      brouillon: { label: 'Brouillon', classe: 'bg-gray-100 text-gray-800' },
      en_validation_niveau_1: { label: 'Validation N1', classe: 'bg-orange-100 text-orange-800' },
      en_validation_niveau_2: { label: 'Validation N2', classe: 'bg-blue-100 text-blue-800' },
      en_validation_niveau_3: { label: 'Validation N3', classe: 'bg-purple-100 text-purple-800' },
      validee: { label: 'Validée', classe: 'bg-green-100 text-green-800' },
      rejetee: { label: 'Rejetée', classe: 'bg-red-100 text-red-800' }
    };

    const { label, classe } = config[statut] || config.brouillon;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${classe}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement du dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">
            Tableau de bord {agence === 'GHANA' ? '🇬🇭' : agence === 'COTE_IVOIRE' ? '🇨🇮' : '🇧🇫'}
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenue {user?.prenom} {user?.nom} - {agence}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.titre}</p>
                  <p className="text-2xl font-semibold text-gray-900 mb-2">
                    {stat.valeur}
                  </p>
                  <p className="text-xs text-gray-500">{stat.variation}</p>
                </div>
                <div className={`${stat.bgCouleur} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.couleur}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demandes récentes */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Demandes d'achat récentes</h2>
          </div>

          {demandesRecentes.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Référence
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Objet
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Demandeur
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Statut
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Montant
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {demandesRecentes.map((demande) => (
                      <tr key={demande.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <span className="font-medium text-blue-600">
                            {demande.reference}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {demande.objet}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {demande.demandeur_prenom} {demande.demandeur_nom}
                        </td>
                        <td className="px-6 py-4">
                          {getStatutBadge(demande.statut)}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          GHS {demande.montant_total_estime.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(demande.date_demande).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Voir toutes les demandes →
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune demande récente</p>
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-left">
            <ShoppingCart className="h-8 w-8 mb-3" />
            <h3 className="font-semibold mb-1">Nouvelle demande d'achat</h3>
            <p className="text-sm text-blue-100">
              Créer une demande d'achat
            </p>
          </button>

          <button className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-left">
            <CheckCircle className="h-8 w-8 mb-3" />
            <h3 className="font-semibold mb-1">Valider demandes</h3>
            <p className="text-sm text-green-100">
              {stats && stats.demandes_en_attente > 0 
                ? `${stats.demandes_en_attente} en attente` 
                : 'Aucune demande en attente'}
            </p>
          </button>

          <button className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-left">
            <Package className="h-8 w-8 mb-3" />
            <h3 className="font-semibold mb-1">Gérer stock</h3>
            <p className="text-sm text-purple-100">
              {stats && stats.alertes_stock > 0 
                ? `${stats.alertes_stock} alertes` 
                : 'Voir mouvements et alertes'}
            </p>
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
