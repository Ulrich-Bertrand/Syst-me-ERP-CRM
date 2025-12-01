import { useState } from 'react';
import { 
  CheckCircle, XCircle, MessageCircle, Eye, Clock, Loader2, AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useApi, useMutation } from '../../hooks/useApi';
import { validationsApi } from '../../services/api';
import { toast } from 'sonner';

export function ValidationPanel() {
  const [selectedDA, setSelectedDA] = useState<any | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const [motifRejet, setMotifRejet] = useState('');

  // Charger DA en attente
  const { data, loading, error, refetch } = useApi(
    () => validationsApi.getPending()
  );

  // Charger stats
  const { data: statsData } = useApi(
    () => validationsApi.getStats()
  );

  // Mutations
  const { mutate: approve, loading: approving } = useMutation(validationsApi.approve);
  const { mutate: reject, loading: rejecting } = useMutation(validationsApi.reject);
  const { mutate: requestClarification } = useMutation(validationsApi.requestClarification);

  const demandesEnAttente = data?.data || [];
  const stats = statsData?.data;

  // Approuver
  const handleApprove = async () => {
    if (!selectedDA) return;

    try {
      await approve(selectedDA.id, { commentaire: commentaire || undefined });
      toast.success(`Demande ${selectedDA.numero_da} approuvée`);
      setShowApproveModal(false);
      setSelectedDA(null);
      setCommentaire('');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'approbation');
    }
  };

  // Rejeter
  const handleReject = async () => {
    if (!selectedDA || !motifRejet.trim()) {
      toast.error('Le motif de rejet est obligatoire');
      return;
    }

    try {
      await reject(selectedDA.id, { 
        motif: motifRejet,
        commentaire: commentaire || undefined
      });
      toast.success(`Demande ${selectedDA.numero_da} rejetée`);
      setShowRejectModal(false);
      setSelectedDA(null);
      setMotifRejet('');
      setCommentaire('');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du rejet');
    }
  };

  // Demander clarifications
  const handleRequestClarification = async (daId: string) => {
    const questions = prompt('Questions à poser au demandeur:');
    if (!questions) return;

    try {
      await requestClarification(daId, { questions });
      toast.success('Demande de clarifications envoyée');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'envoi');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Validations en attente</h1>
        <p className="text-sm text-gray-600 mt-1">
          Demandes d'achat nécessitant votre approbation
        </p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">En attente</span>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{stats.en_attente || 0}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Approuvées</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.approuvees || 0}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Rejetées</span>
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.rejetees || 0}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Délai moyen</span>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.delai_moyen || 0}h</p>
          </div>
        </div>
      )}

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
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {demandesEnAttente.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Demande
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Demandeur
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Date soumission
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600">
                    Niveau
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {demandesEnAttente.map((da: any) => (
                  <tr key={da.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">{da.numero_da}</p>
                        <p className="text-xs text-gray-600">{da.objet}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {da.type_demande}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm">{da.demandeur_nom}</p>
                        <p className="text-xs text-gray-500">{da.demandeur_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-medium">
                        {da.montant_total?.toFixed(2)} {da.devise}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm">
                          {new Date(da.date_soumission).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Il y a {Math.floor((Date.now() - new Date(da.date_soumission).getTime()) / (1000 * 60 * 60))}h
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className="bg-yellow-100 text-yellow-700">
                        Niveau {da.workflow_validation?.niveau_actuel || 1}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedDA(da)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Voir détail"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDA(da);
                            setShowApproveModal(true);
                          }}
                          className="text-green-600 hover:text-green-700"
                          title="Approuver"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedDA(da);
                            setShowRejectModal(true);
                          }}
                          className="text-red-600 hover:text-red-700"
                          title="Rejeter"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleRequestClarification(da.id)}
                          className="text-orange-600 hover:text-orange-700"
                          title="Demander clarifications"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Aucune demande en attente de validation</p>
              <p className="text-sm mt-1">Toutes les demandes ont été traitées</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Approbation */}
      {showApproveModal && selectedDA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Approuver la demande</h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedDA.numero_da} - {selectedDA.montant_total} {selectedDA.devise}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Ajouter un commentaire..."
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">
                      Confirmation d'approbation
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      La demande passera au niveau de validation suivant ou sera validée définitivement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedDA(null);
                  setCommentaire('');
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleApprove}
                disabled={approving}
              >
                {approving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approbation...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejet */}
      {showRejectModal && selectedDA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Rejeter la demande</h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedDA.numero_da} - {selectedDA.montant_total} {selectedDA.devise}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Motif du rejet <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={motifRejet}
                  onChange={(e) => setMotifRejet(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Expliquer le motif du rejet..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Commentaire additionnel
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  placeholder="Commentaire optionnel..."
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      Attention : Rejet définitif
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      La demande sera rejetée et le demandeur sera notifié.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedDA(null);
                  setMotifRejet('');
                  setCommentaire('');
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleReject}
                disabled={rejecting || !motifRejet.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {rejecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rejet...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
