import { 
  X, Download, Upload, Clock, CheckCircle, XCircle, AlertCircle,
  User, Calendar, DollarSign, FileText, Package, Building2, Truck,
  ArrowRight, MessageSquare, Paperclip, Box, MapPin
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { DemandeAchatComplete, STATUT_LABELS, PRIORITE_LABELS } from '../types/achats';

interface AchatsDemandeDetailProps {
  demande: DemandeAchatComplete;
  onClose: () => void;
}

export function AchatsDemandeDetail({ demande, onClose }: AchatsDemandeDetailProps) {
  const { t, language } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${currency}`;
  };

  const statusConfig = STATUT_LABELS[demande.demande.statut_workflow];
  const priorityConfig = PRIORITE_LABELS[demande.demande.priorite];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">{demande.piece.Num_Piece}</h2>
              <p className="text-sm text-gray-500 mt-1">{demande.demande.motif_achat}</p>
            </div>
            <Badge className={`bg-${statusConfig.color}-100 text-${statusConfig.color}-700`}>
              {language === 'fr' ? statusConfig.fr : statusConfig.en}
            </Badge>
            <Badge className={`bg-${priorityConfig.color}-100 text-${priorityConfig.color}-700`}>
              {language === 'fr' ? priorityConfig.fr : priorityConfig.en}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-6 p-6">
            {/* Colonne gauche - Informations principales */}
            <div className="col-span-2 space-y-6">
              {/* Informations générales */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Informations générales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Type de demande</label>
                    <div className="flex items-center gap-2 mt-1">
                      {demande.demande.type_demande === 'agence' ? (
                        <>
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Achat Agence</span>
                        </>
                      ) : (
                        <>
                          <Truck className="h-4 w-4 text-teal-600" />
                          <span className="font-medium">Achat Dossier</span>
                        </>
                      )}
                    </div>
                  </div>

                  {demande.demande.type_demande === 'agence' ? (
                    <div>
                      <label className="text-xs text-gray-500">Service demandeur</label>
                      <p className="font-medium mt-1">{demande.demande.service_demandeur}</p>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs text-gray-500">Dossier</label>
                      <p className="font-medium mt-1 text-blue-600">{demande.demande.dossier_reference}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-gray-500">Créé par</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{demande.demande.created_by}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Date de création</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{formatDate(demande.demande.created_at)}</span>
                    </div>
                  </div>

                  {demande.demande.date_besoin && (
                    <div>
                      <label className="text-xs text-gray-500">Date de besoin</label>
                      <p className="font-medium mt-1 text-orange-600">{demande.demande.date_besoin}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-gray-500">Impact stock</label>
                    <div className="flex items-center gap-2 mt-1">
                      {demande.demande.impact_stock ? (
                        <>
                          <Box className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">Oui</span>
                        </>
                      ) : (
                        <span className="font-medium text-gray-500">Non</span>
                      )}
                    </div>
                  </div>
                </div>

                {demande.demande.observation && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="text-xs text-gray-500">Observation</label>
                    <p className="text-sm mt-1 text-gray-700">{demande.demande.observation}</p>
                  </div>
                )}
              </div>

              {/* Fournisseur et paiement */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-600" />
                  Fournisseur & Paiement
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Fournisseur</label>
                    <p className="font-medium mt-1">{demande.fournisseur?.Nom_Fournisseur || demande.piece.Fournisseur}</p>
                    {demande.fournisseur?.Telephone && (
                      <p className="text-sm text-gray-600 mt-0.5">{demande.fournisseur.Telephone}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Mode de règlement</label>
                    <p className="font-medium mt-1 capitalize">{demande.piece_achats.Mode_Reglement.replace('_', ' ')}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Devise</label>
                    <p className="font-medium mt-1">{demande.devise}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Montant total</label>
                    <p className="text-xl font-bold text-blue-900 mt-1">
                      {formatCurrency(demande.montant_total, demande.devise)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lignes de commande */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-600" />
                  Lignes de commande ({demande.nb_lignes})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">#</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Désignation</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Qté</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">P.U.</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Montant</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Rubrique</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {demande.lignes.map((ligne, index) => (
                        <tr key={ligne.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-3 py-2">
                            <p className="text-sm font-medium">{ligne.Designation}</p>
                            {ligne.Article_Code && (
                              <p className="text-xs text-gray-500 mt-0.5">Code: {ligne.Article_Code}</p>
                            )}
                          </td>
                          <td className="px-3 py-2 text-sm text-right">{ligne.Quantite}</td>
                          <td className="px-3 py-2 text-sm text-right">
                            {formatCurrency(ligne.Prix_Unitaire, demande.devise)}
                          </td>
                          <td className="px-3 py-2 text-sm font-medium text-right">
                            {formatCurrency(ligne.Montant_Ligne, demande.devise)}
                          </td>
                          <td className="px-3 py-2">
                            {ligne.Rubrique_Achat && (
                              <Badge className="bg-gray-100 text-gray-700 text-xs">
                                {ligne.Rubrique_Achat}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-blue-50 border-t-2 border-blue-200">
                      <tr>
                        <td colSpan={4} className="px-3 py-3 text-right font-medium">
                          Total
                        </td>
                        <td className="px-3 py-3 text-right text-lg font-bold text-blue-900">
                          {formatCurrency(demande.montant_total, demande.devise)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Pièces jointes */}
              {demande.fichiers.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-gray-600" />
                    Pièces jointes ({demande.fichiers.length})
                  </h3>
                  <div className="space-y-2">
                    {demande.fichiers.map((fichier) => (
                      <div key={fichier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{fichier.nom_fichier}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                {fichier.type_fichier}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {(fichier.taille / 1024).toFixed(0)} KB
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(fichier.uploaded_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Colonne droite - Timeline des validations */}
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  Timeline de validation
                </h3>
                <div className="space-y-4">
                  {/* Création */}
                  <div className="relative pl-6 pb-4 border-l-2 border-blue-200">
                    <div className="absolute left-0 top-0 -translate-x-1/2">
                      <div className="h-3 w-3 rounded-full bg-blue-600 border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Création de la demande</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(demande.demande.created_at)}</p>
                      <p className="text-xs text-gray-600 mt-1">Par {demande.demande.created_by}</p>
                    </div>
                  </div>

                  {/* Soumission */}
                  {demande.demande.soumis_at && (
                    <div className="relative pl-6 pb-4 border-l-2 border-blue-200">
                      <div className="absolute left-0 top-0 -translate-x-1/2">
                        <div className="h-3 w-3 rounded-full bg-blue-600 border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Soumise pour validation</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(demande.demande.soumis_at)}</p>
                        <p className="text-xs text-gray-600 mt-1">Par {demande.demande.soumis_by}</p>
                      </div>
                    </div>
                  )}

                  {/* Validations */}
                  {demande.validations.map((validation, index) => {
                    const isLast = index === demande.validations.length - 1;
                    const isPending = validation.statut === 'en_attente';
                    const isApproved = validation.statut === 'approuve';
                    const isRejected = validation.statut === 'rejete';

                    return (
                      <div 
                        key={validation.id} 
                        className={`relative pl-6 ${!isLast ? 'pb-4' : ''} border-l-2 ${
                          isPending ? 'border-gray-300' : 
                          isApproved ? 'border-green-200' : 
                          'border-red-200'
                        }`}
                      >
                        <div className="absolute left-0 top-0 -translate-x-1/2">
                          {isPending ? (
                            <div className="h-3 w-3 rounded-full bg-gray-300 border-2 border-white animate-pulse"></div>
                          ) : isApproved ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Validation Niveau {validation.niveau}
                            {isPending && <span className="text-orange-600 ml-2">(En attente)</span>}
                          </p>
                          {validation.valide_a && (
                            <p className="text-xs text-gray-500 mt-1">{formatDate(validation.valide_a)}</p>
                          )}
                          {validation.valide_par && (
                            <p className="text-xs text-gray-600 mt-1">Par {validation.valide_par}</p>
                          )}
                          {validation.commentaire && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 border border-gray-200">
                              <MessageSquare className="h-3 w-3 inline mr-1" />
                              {validation.commentaire}
                            </div>
                          )}
                          {isPending && !validation.notification_lue && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs mt-2">
                              Notification envoyée
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-medium mb-4">Actions</h3>
                <div className="space-y-2">
                  {demande.demande.statut_workflow === 'soumis' && (
                    <>
                      <Button className="w-full" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Valider (Niveau 1)
                      </Button>
                      <Button variant="outline" className="w-full text-red-600 hover:bg-red-50" size="sm">
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </>
                  )}
                  
                  {demande.demande.statut_workflow === 'approuve' && (
                    <Button className="w-full" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Générer BC
                    </Button>
                  )}

                  {demande.demande.statut_workflow === 'paye' && !demande.fichiers.some(f => f.type_fichier === 'Justificatif') && (
                    <Button className="w-full" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Justificatif
                    </Button>
                  )}

                  <Button variant="outline" className="w-full" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </div>
              </div>

              {/* Statistiques */}
              {demande.delai_traitement_jours && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Délai de traitement</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {demande.delai_traitement_jours} jours
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
