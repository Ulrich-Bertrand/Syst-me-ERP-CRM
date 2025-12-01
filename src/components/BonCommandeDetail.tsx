import { useState } from 'react';
import { 
  X, Download, Send, Mail, CheckCircle, Clock, Package, 
  Printer, FileText, Calendar, MapPin, CreditCard, Building2,
  Truck, AlertCircle, Eye
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BonCommande, STATUT_BC_LABELS, calculerTauxReception } from '../types/bonCommande';

interface BonCommandeDetailProps {
  bc: BonCommande;
  onClose: () => void;
  onEnvoyer?: (bc: BonCommande) => void;
  onTelecharger?: (bc: BonCommande) => void;
}

export function BonCommandeDetail({ bc, onClose, onEnvoyer, onTelecharger }: BonCommandeDetailProps) {
  const [showEnvoiModal, setShowEnvoiModal] = useState(false);
  const [emailDestination, setEmailDestination] = useState(bc.fournisseur.email || '');

  const statutConfig = STATUT_BC_LABELS[bc.statut];
  const tauxReception = calculerTauxReception(bc);
  
  const dateEmission = new Date(bc.date_emission);
  const dateLimite = bc.date_livraison_prevue ? new Date(bc.date_livraison_prevue) : null;

  const handleEnvoyer = () => {
    if (onEnvoyer) {
      onEnvoyer(bc);
    }
    setShowEnvoiModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-white">
                <h2 className="text-xl font-semibold">{bc.numero_bc}</h2>
                <p className="text-sm text-blue-100 mt-1">
                  Bon de Commande • {bc.fournisseur.nom}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`bg-${statutConfig.color}-100 text-${statutConfig.color}-700 text-sm`}>
                {statutConfig.icon} {statutConfig.fr}
              </Badge>
              <button onClick={onClose} className="text-white hover:text-blue-100">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
            {bc.statut === 'genere' && (
              <Button size="sm" onClick={() => setShowEnvoiModal(true)}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer au fournisseur
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onTelecharger?.(bc)}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
            <Button size="sm" variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            {bc.fichier_pdf_url && (
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Prévisualiser
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Colonne 1-2 : Informations principales */}
              <div className="col-span-2 space-y-6">
                {/* Parties */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Émetteur */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Émetteur</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{bc.agence_emettrice.nom}</p>
                      <p className="text-gray-600">{bc.agence_emettrice.adresse}</p>
                      <p className="text-gray-600">{bc.agence_emettrice.telephone}</p>
                      <p className="text-blue-600">{bc.agence_emettrice.email}</p>
                    </div>
                  </div>

                  {/* Fournisseur */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium">Fournisseur</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{bc.fournisseur.nom}</p>
                      <p className="text-gray-600">{bc.fournisseur.adresse}</p>
                      {bc.fournisseur.telephone && (
                        <p className="text-gray-600">{bc.fournisseur.telephone}</p>
                      )}
                      {bc.fournisseur.email && (
                        <p className="text-blue-600">{bc.fournisseur.email}</p>
                      )}
                      {bc.fournisseur.contact_principal && (
                        <p className="text-gray-500 text-xs mt-2">
                          Contact : {bc.fournisseur.contact_principal}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations générales */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Informations générales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Date d'émission</p>
                        <p className="text-sm font-medium">{dateEmission.toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>

                    {dateLimite && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Livraison prévue</p>
                          <p className="text-sm font-medium">{dateLimite.toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Lieu de livraison</p>
                        <p className="text-sm font-medium">{bc.lieu_livraison}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Délai de livraison</p>
                        <p className="text-sm font-medium">{bc.delai_livraison}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Conditions de paiement</p>
                        <p className="text-sm font-medium">{bc.conditions_paiement}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Mode de paiement</p>
                        <p className="text-sm font-medium">{bc.mode_paiement}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lignes de commande */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium">Lignes de commande</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">#</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Désignation</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Qté cmd.</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Qté reçue</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">P.U.</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bc.lignes.map((ligne) => (
                          <tr key={ligne.id} className="border-b border-gray-100">
                            <td className="px-4 py-3 text-sm">{ligne.numero_ligne}</td>
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium">{ligne.designation}</p>
                              {ligne.reference_article && (
                                <p className="text-xs text-gray-500">Réf: {ligne.reference_article}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              {ligne.quantite_commandee} {ligne.unite}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              {ligne.quantite_recue > 0 ? (
                                <span className={
                                  ligne.quantite_recue === ligne.quantite_commandee 
                                    ? 'text-green-600 font-medium' 
                                    : 'text-orange-600 font-medium'
                                }>
                                  {ligne.quantite_recue}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              {ligne.prix_unitaire.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium">
                              {ligne.montant_ligne.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-blue-50 border-t-2 border-blue-200">
                          <td colSpan={5} className="px-4 py-3 text-sm font-medium text-right">
                            TOTAL {bc.devise}
                          </td>
                          <td className="px-4 py-3 text-lg font-bold text-right text-blue-900">
                            {bc.montant_ttc.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Réceptions */}
                {bc.receptions.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Historique des réceptions ({bc.receptions.length})
                    </h3>
                    <div className="space-y-3">
                      {bc.receptions.map((reception) => (
                        <div key={reception.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className={`h-5 w-5 ${
                                reception.conforme ? 'text-green-600' : 'text-orange-600'
                              }`} />
                              <span className="text-sm font-medium">
                                {new Date(reception.date_reception).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              Par {reception.receptionne_par}
                            </span>
                          </div>
                          {reception.bon_livraison_ref && (
                            <p className="text-xs text-gray-600 mb-2">
                              BL: {reception.bon_livraison_ref}
                            </p>
                          )}
                          {reception.commentaire_general && (
                            <p className="text-xs text-gray-700 italic">
                              &quot;{reception.commentaire_general}&quot;
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Colonne 3 : Statut et actions */}
              <div className="space-y-6">
                {/* Statut détaillé */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Statut du BC</h3>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg bg-${statutConfig.color}-50 border border-${statutConfig.color}-200`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{statutConfig.icon}</span>
                        <span className={`font-medium text-${statutConfig.color}-900`}>
                          {statutConfig.fr}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Créé le {dateEmission.toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    {bc.envoye_le && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Envoyé</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Le {new Date(bc.envoye_le).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-gray-600">
                          À : {bc.envoye_a}
                        </p>
                      </div>
                    )}

                    {bc.confirme_le && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Confirmé</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Le {new Date(bc.confirme_le).toLocaleDateString('fr-FR')}
                        </p>
                        {bc.confirme_par && (
                          <p className="text-xs text-gray-600">
                            Par : {bc.confirme_par}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progression réception */}
                {(bc.statut === 'reception_partielle' || bc.statut === 'reception_complete') && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-4">Progression de réception</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Taux de réception</span>
                          <span className="font-bold text-blue-900">{tauxReception.toFixed(0)}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              tauxReception === 100 ? 'bg-green-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${tauxReception}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-gray-600">
                        <p className="mb-1">
                          Total commandé: {bc.lignes.reduce((s, l) => s + l.quantite_commandee, 0)}
                        </p>
                        <p>
                          Total reçu: {bc.lignes.reduce((s, l) => s + l.quantite_recue, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lien DA */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Demande d'achat</h3>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {bc.demande_achat_ref}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Voir la DA
                  </Button>
                </div>

                {/* Comptabilité */}
                {bc.piece_comptable_id && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Comptabilité</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        Pièce : <span className="font-medium">{bc.piece_comptable_id}</span>
                      </p>
                      <p className="text-gray-600">
                        Compte : <span className="font-medium">{bc.compte_fournisseur}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal envoi email */}
      {showEnvoiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Envoyer le BC au fournisseur</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email destinataire</label>
              <input
                type="email"
                value={emailDestination}
                onChange={(e) => setEmailDestination(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Le BC {bc.numero_bc} sera envoyé par email au fournisseur avec le PDF en pièce jointe.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowEnvoiModal(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleEnvoyer} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
