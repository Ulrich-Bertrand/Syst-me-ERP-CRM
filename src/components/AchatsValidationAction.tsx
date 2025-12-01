import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, MessageSquare, Send, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DemandeAchatComplete } from '../types/achats';
import { determinerNiveauxValidation, getProchainNiveauValidation } from '../types/notifications';

interface AchatsValidationActionProps {
  demande: DemandeAchatComplete;
  userProfile: {
    email: string;
    nom: string;
    profile_purchases_validation: boolean;
    profile_purchases_approval: boolean;
    profile_po_management: boolean;
  };
  onApprove: (niveau: number, commentaire: string) => void;
  onReject: (niveau: number, commentaire: string) => void;
  onClose?: () => void;
}

export function AchatsValidationAction({ 
  demande, 
  userProfile, 
  onApprove, 
  onReject,
  onClose 
}: AchatsValidationActionProps) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [commentaire, setCommentaire] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  // Déterminer les règles de validation applicables
  const regleApplicable = determinerNiveauxValidation(
    demande.demande.type_demande,
    demande.montant_total,
    demande.devise,
    demande.demande.impact_stock
  );

  // Déterminer le prochain niveau à valider
  const prochainNiveau = regleApplicable 
    ? getProchainNiveauValidation(demande.validations, regleApplicable)
    : null;

  // Vérifier si l'utilisateur peut valider ce niveau
  const peutValider = () => {
    if (!prochainNiveau) return false;
    
    const niveauConfig = regleApplicable?.niveaux_requis.find(n => n.niveau === prochainNiveau);
    if (!niveauConfig) return false;
    
    // Vérifier les profils requis
    if (niveauConfig.profil_requis === 'profile_purchases_validation' && !userProfile.profile_purchases_validation) {
      return false;
    }
    if (niveauConfig.profil_requis === 'profile_purchases_approval' && !userProfile.profile_purchases_approval) {
      return false;
    }
    
    return true;
  };

  const handleValidate = () => {
    // Validation du commentaire
    if (action === 'reject' && (!commentaire || commentaire.trim().length < 10)) {
      setError('Un commentaire détaillé (min 10 caractères) est obligatoire pour un refus');
      return;
    }
    
    if (!prochainNiveau) {
      setError('Aucun niveau de validation disponible');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (!prochainNiveau) return;
    
    if (action === 'approve') {
      onApprove(prochainNiveau, commentaire);
    } else if (action === 'reject') {
      onReject(prochainNiveau, commentaire);
    }
    
    setShowConfirm(false);
    setAction(null);
    setCommentaire('');
    if (onClose) onClose();
  };

  const canValidate = peutValider();
  
  if (!canValidate) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 text-gray-500">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="text-sm font-medium">Vous n'avez pas les droits pour valider cette demande</p>
            <p className="text-xs mt-1">
              {!prochainNiveau 
                ? 'Tous les niveaux de validation sont déjà complétés' 
                : 'Profil insuffisant pour le niveau requis'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            {action === 'approve' ? (
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
            <h3 className="text-lg font-semibold mb-2">
              {action === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le refus'}
            </h3>
            <p className="text-sm text-gray-600">
              {action === 'approve' 
                ? `Vous allez approuver la demande ${demande.piece.Num_Piece} (Niveau ${prochainNiveau})`
                : `Vous allez rejeter la demande ${demande.piece.Num_Piece}`
              }
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Montant</p>
                <p className="font-medium">{demande.montant_total.toFixed(2)} {demande.devise}</p>
              </div>
              <div>
                <p className="text-gray-500">Fournisseur</p>
                <p className="font-medium">{demande.fournisseur?.Nom_Fournisseur}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Motif</p>
                <p className="font-medium text-xs">{demande.demande.motif_achat}</p>
              </div>
            </div>
            
            {commentaire && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-gray-500 text-xs mb-1">Votre commentaire</p>
                <p className="text-sm italic">&quot;{commentaire}&quot;</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowConfirm(false)}
            >
              Annuler
            </Button>
            <Button 
              className={`flex-1 ${action === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}`}
              onClick={handleConfirm}
            >
              {action === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le refus'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info niveau */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">Validation Niveau {prochainNiveau}</span>
        </div>
        <p className="text-sm text-blue-700">
          {regleApplicable?.description}
        </p>
        {regleApplicable && (
          <div className="mt-2 text-xs text-blue-600">
            Délai maximum: {regleApplicable.niveaux_requis.find(n => n.niveau === prochainNiveau)?.delai_max_jours} jours
          </div>
        )}
      </div>

      {/* Sélection action si pas encore choisie */}
      {!action && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setAction('approve')}
            className="p-6 border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-500 transition-all"
          >
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-900">Approuver</p>
            <p className="text-xs text-green-600 mt-1">Valider la demande</p>
          </button>

          <button
            onClick={() => setAction('reject')}
            className="p-6 border-2 border-red-200 rounded-lg hover:bg-red-50 hover:border-red-500 transition-all"
          >
            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="font-medium text-red-900">Rejeter</p>
            <p className="text-xs text-red-600 mt-1">Refuser la demande</p>
          </button>
        </div>
      )}

      {/* Formulaire commentaire */}
      {action && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Commentaire {action === 'reject' && <span className="text-red-600">*</span>}
            </h4>
            <button
              onClick={() => {
                setAction(null);
                setCommentaire('');
                setError('');
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <textarea
            value={commentaire}
            onChange={(e) => {
              setCommentaire(e.target.value);
              setError('');
            }}
            placeholder={
              action === 'approve' 
                ? 'Commentaire optionnel (recommandations, conditions...)'
                : 'Expliquez les raisons du refus (obligatoire, min 10 caractères)...'
            }
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg resize-none ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {action === 'reject' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                ⚠️ Un refus nécessite un commentaire détaillé qui sera visible par le demandeur et notifié par email.
              </p>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setAction(null);
                setCommentaire('');
                setError('');
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleValidate}
              className={`flex-1 ${
                action === 'reject' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <Send className="h-4 w-4 mr-2" />
              {action === 'approve' ? 'Approuver' : 'Rejeter'}
            </Button>
          </div>
        </div>
      )}

      {/* Informations règle de validation */}
      {regleApplicable && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">Règle de validation applicable</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• {regleApplicable.nom}</p>
            <p>• Niveau actuel: {prochainNiveau}/{regleApplicable.niveaux_requis.length}</p>
            {regleApplicable.niveaux_requis.map((niveau) => (
              <p key={niveau.niveau} className={niveau.niveau === prochainNiveau ? 'font-medium text-blue-600' : ''}>
                • Niveau {niveau.niveau}: {niveau.profil_requis.replace('profile_', '').replace('_', ' ')}
                {niveau.niveau === prochainNiveau && ' ← En cours'}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
