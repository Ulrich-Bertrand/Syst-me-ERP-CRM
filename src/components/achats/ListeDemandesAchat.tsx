import { useState } from 'react';
import { 
  FileText, Eye, Edit, Trash2, Send, Download, Filter, Search, Plus, Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { usePaginatedApi, useMutation } from '../../hooks/useApi';
import { demandesApi } from '../../services/api';
import { CreerDemandeAchatForm } from './CreerDemandeAchatForm';
import { toast } from 'sonner';

const STATUT_COLORS: Record<string, string> = {
  brouillon: 'bg-gray-100 text-gray-700',
  en_validation_niveau_1: 'bg-yellow-100 text-yellow-700',
  en_validation_niveau_2: 'bg-orange-100 text-orange-700',
  en_validation_niveau_3: 'bg-purple-100 text-purple-700',
  validee: 'bg-green-100 text-green-700',
  rejetee: 'bg-red-100 text-red-700',
  annulee: 'bg-gray-100 text-gray-700'
};

const STATUT_LABELS: Record<string, string> = {
  brouillon: 'Brouillon',
  en_validation_niveau_1: 'Validation N1',
  en_validation_niveau_2: 'Validation N2',
  en_validation_niveau_3: 'Validation N3',
  validee: 'Validée',
  rejetee: 'Rejetée',
  annulee: 'Annulée'
};

export function ListeDemandesAchat() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    statut: '',
    search: '',
    agence: 'GHANA'
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Charger liste paginée
  const { 
    data: demandes, 
    pagination, 
    loading, 
    error,
    refetch,
    setPage
  } = usePaginatedApi(
    (params) => demandesApi.getAll({
      ...params,
      ...filters,
      statut: filters.statut || undefined,
      search: filters.search || undefined
    }),
    currentPage,
    20
  );

  // Mutations
  const { mutate: submitDA } = useMutation(demandesApi.submit);
  const { mutate: deleteDA } = useMutation(demandesApi.delete);
  const { mutate: duplicateDA } = useMutation(demandesApi.duplicate);

  // Actions
  const handleSubmit = async (id: string) => {
    if (!confirm('Soumettre cette demande à validation ?')) return;
    
    try {
      await submitDA(id);
      toast.success('Demande soumise à validation');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la soumission');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement cette demande ?')) return;
    
    try {
      await deleteDA(id);
      toast.success('Demande supprimée');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const result = await duplicateDA(id);
      toast.success(`Demande ${result.numero_da} créée (copie)`);
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la duplication');
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setPage(newPage);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Demandes d'achat</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gérer toutes les demandes d'achat
          </p>
        </div>

        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Filtres */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium mb-2">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Numéro, objet..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2">Statut</label>
            <select
              value={filters.statut}
              onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="brouillon">Brouillon</option>
              <option value="en_validation_niveau_1">En validation N1</option>
              <option value="en_validation_niveau_2">En validation N2</option>
              <option value="en_validation_niveau_3">En validation N3</option>
              <option value="validee">Validée</option>
              <option value="rejetee">Rejetée</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2">Agence</label>
            <select
              value={filters.agence}
              onChange={(e) => setFilters({ ...filters, agence: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Toutes</option>
              <option value="GHANA">JOCYDERK LOGISTICS LTD GHANA</option>
              <option value="COTE_IVOIRE">Jocyderk Côte d'Ivoire</option>
              <option value="BURKINA">Jocyderk Burkina</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Appliquer
            </Button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Liste */}
      {!loading && !error && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Numéro
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Objet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Demandeur
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {demandes && demandes.length > 0 ? (
                  demandes.map((da: any) => (
                    <tr key={da.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-sm">{da.numero_da}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {da.type_demande}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{da.objet}</p>
                          {da.dossier_ref && (
                            <p className="text-xs text-gray-500">Dossier: {da.dossier_ref}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm">{da.demandeur_nom}</p>
                          <p className="text-xs text-gray-500">{da.agence}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-medium">
                          {da.montant_total?.toFixed(2) || '0.00'} {da.devise}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={`text-xs ${STATUT_COLORS[da.statut] || 'bg-gray-100 text-gray-700'}`}>
                          {STATUT_LABELS[da.statut] || da.statut}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {new Date(da.date_creation).toLocaleDateString('fr-FR')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-700"
                            title="Voir détail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {da.statut === 'brouillon' && (
                            <>
                              <button
                                onClick={() => handleSubmit(da.id)}
                                className="text-green-600 hover:text-green-700"
                                title="Soumettre à validation"
                              >
                                <Send className="h-4 w-4" />
                              </button>

                              <button
                                className="text-gray-600 hover:text-gray-700"
                                title="Modifier"
                              >
                                <Edit className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(da.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Supprimer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {da.statut === 'validee' && (
                            <button
                              className="text-purple-600 hover:text-purple-700"
                              title="Télécharger PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Aucune demande d'achat trouvée</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCreateForm(true)}
                        className="mt-4"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer votre première demande
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {pagination.page} sur {pagination.totalPages} - Total: {pagination.total} demandes
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Précédent
                </Button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => 
                    p === 1 || 
                    p === pagination.totalPages || 
                    Math.abs(p - pagination.page) <= 2
                  )
                  .map((p, i, arr) => (
                    <div key={p} className="flex gap-2">
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="px-3 py-2">...</span>
                      )}
                      <Button
                        variant={p === pagination.page ? 'default' : 'outline'}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    </div>
                  ))}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal création */}
      {showCreateForm && (
        <CreerDemandeAchatForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
