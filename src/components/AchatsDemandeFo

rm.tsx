import { useState } from 'react';
import { 
  X, Plus, Trash2, Building2, User, Calendar, DollarSign,
  FileText, Package, Truck, AlertCircle, Save, Send, Box
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  DemandeAchatForm, 
  LigneAchatForm,
  SERVICES_DEMANDEURS,
  RUBRIQUES_ACHAT,
  MODES_REGLEMENT,
  DEVISES
} from '../types/achats';
import { mockFournisseurs } from '../data/mockAchatsData';

interface AchatsDemandeFormProps {
  onClose: () => void;
  onSubmit: (demande: DemandeAchatForm) => void;
  initialData?: DemandeAchatForm;
}

export function AchatsDemandeForm({ onClose, onSubmit, initialData }: AchatsDemandeFormProps) {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<DemandeAchatForm>(initialData || {
    type_demande: 'agence',
    fournisseur: '',
    mode_reglement: 'banque',
    devise: 'GHS',
    priorite: 'normale',
    motif_achat: '',
    impact_stock: false,
    lignes: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Ajouter une ligne
  const handleAddLigne = () => {
    const newLigne: LigneAchatForm = {
      id: `ligne-${Date.now()}`,
      designation: '',
      quantite: 1,
      prix_unitaire: 0,
      montant_ligne: 0
    };
    setFormData({
      ...formData,
      lignes: [...formData.lignes, newLigne]
    });
  };

  // Supprimer une ligne
  const handleRemoveLigne = (id: string) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.filter(l => l.id !== id)
    });
  };

  // Mettre à jour une ligne
  const handleUpdateLigne = (id: string, field: keyof LigneAchatForm, value: any) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.map(ligne => {
        if (ligne.id === id) {
          const updated = { ...ligne, [field]: value };
          // Recalculer le montant si quantité ou prix change
          if (field === 'quantite' || field === 'prix_unitaire') {
            updated.montant_ligne = updated.quantite * updated.prix_unitaire;
          }
          return updated;
        }
        return ligne;
      })
    });
  };

  // Calculer le montant total
  const calculateTotal = () => {
    return formData.lignes.reduce((sum, ligne) => sum + ligne.montant_ligne, 0);
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fournisseur) {
      newErrors.fournisseur = 'Fournisseur requis';
    }

    if (formData.type_demande === 'dossier' && !formData.dossier_id) {
      newErrors.dossier_id = 'Dossier requis pour achat opérationnel';
    }

    if (formData.type_demande === 'agence' && !formData.service_demandeur) {
      newErrors.service_demandeur = 'Service demandeur requis';
    }

    if (!formData.motif_achat || formData.motif_achat.trim().length < 10) {
      newErrors.motif_achat = 'Motif d\'achat requis (minimum 10 caractères)';
    }

    if (formData.lignes.length === 0) {
      newErrors.lignes = 'Au moins une ligne de commande requise';
    }

    formData.lignes.forEach((ligne, index) => {
      if (!ligne.designation || ligne.designation.trim() === '') {
        newErrors[`ligne_${index}_designation`] = 'Désignation requise';
      }
      if (ligne.quantite <= 0) {
        newErrors[`ligne_${index}_quantite`] = 'Quantité invalide';
      }
      if (ligne.prix_unitaire <= 0) {
        newErrors[`ligne_${index}_prix`] = 'Prix invalide';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre formulaire
  const handleSubmit = (action: 'save' | 'submit') => {
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold">Nouvelle demande d'achat</h2>
            <p className="text-sm text-gray-500 mt-1">Remplissez tous les champs obligatoires</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Type de demande */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de demande <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type_demande: 'agence', dossier_id: undefined })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.type_demande === 'agence'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className={`h-6 w-6 mx-auto mb-2 ${
                  formData.type_demande === 'agence' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <p className="font-medium text-sm">Achat Agence</p>
                <p className="text-xs text-gray-500 mt-1">Fournitures, équipements, services internes</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type_demande: 'dossier', service_demandeur: undefined })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.type_demande === 'dossier'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Truck className={`h-6 w-6 mx-auto mb-2 ${
                  formData.type_demande === 'dossier' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <p className="font-medium text-sm">Achat Dossier</p>
                <p className="text-xs text-gray-500 mt-1">Lié à un dossier opérationnel client</p>
              </button>
            </div>
          </div>

          {/* Rattachement */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {formData.type_demande === 'agence' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service demandeur <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.service_demandeur || ''}
                  onChange={(e) => setFormData({ ...formData, service_demandeur: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.service_demandeur ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner un service</option>
                  {SERVICES_DEMANDEURS.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
                {errors.service_demandeur && (
                  <p className="text-xs text-red-600 mt-1">{errors.service_demandeur}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dossier <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="DOS-2025-XXX"
                  value={formData.dossier_id || ''}
                  onChange={(e) => setFormData({ ...formData, dossier_id: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.dossier_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.dossier_id && (
                  <p className="text-xs text-red-600 mt-1">{errors.dossier_id}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.priorite}
                onChange={(e) => setFormData({ ...formData, priorite: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="basse">Basse</option>
                <option value="normale">Normale</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          {/* Fournisseur et paiement */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fournisseur <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.fournisseur}
                onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.fournisseur ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner</option>
                {mockFournisseurs.map(f => (
                  <option key={f.Code_Fournisseur} value={f.Code_Fournisseur}>
                    {f.Nom_Fournisseur}
                  </option>
                ))}
              </select>
              {errors.fournisseur && (
                <p className="text-xs text-red-600 mt-1">{errors.fournisseur}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de règlement <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.mode_reglement}
                onChange={(e) => setFormData({ ...formData, mode_reglement: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {MODES_REGLEMENT.map(mode => (
                  <option key={mode.value} value={mode.value}>{mode.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devise <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.devise}
                onChange={(e) => setFormData({ ...formData, devise: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {DEVISES.map(devise => (
                  <option key={devise.code} value={devise.code}>
                    {devise.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Motif et date */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif de l'achat <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.motif_achat}
                onChange={(e) => setFormData({ ...formData, motif_achat: e.target.value })}
                placeholder="Décrivez le motif de cet achat..."
                rows={2}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.motif_achat ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.motif_achat && (
                <p className="text-xs text-red-600 mt-1">{errors.motif_achat}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de besoin
              </label>
              <input
                type="date"
                value={formData.date_besoin || ''}
                onChange={(e) => setFormData({ ...formData, date_besoin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.impact_stock}
                  onChange={(e) => setFormData({ ...formData, impact_stock: e.target.checked })}
                  className="rounded"
                />
                <Box className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Impact sur le stock</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Cocher si cet achat génère une entrée en stock
              </p>
            </div>
          </div>

          {/* Observation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observation
            </label>
            <textarea
              value={formData.observation || ''}
              onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
              placeholder="Remarques ou informations complémentaires..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Lignes de commande */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Lignes de commande</h3>
                <p className="text-sm text-gray-500">Détaillez les articles ou services à acheter</p>
              </div>
              <Button onClick={handleAddLigne} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une ligne
              </Button>
            </div>

            {errors.lignes && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{errors.lignes}</span>
                </div>
              </div>
            )}

            {formData.lignes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Aucune ligne ajoutée</p>
                <p className="text-xs text-gray-500 mt-1">Cliquez sur "Ajouter une ligne" pour commencer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.lignes.map((ligne, index) => (
                  <div key={ligne.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Ligne {index + 1}</span>
                      <button
                        onClick={() => handleRemoveLigne(ligne.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-5">
                        <label className="block text-xs text-gray-600 mb-1">Désignation *</label>
                        <input
                          type="text"
                          value={ligne.designation}
                          onChange={(e) => handleUpdateLigne(ligne.id, 'designation', e.target.value)}
                          placeholder="Description de l'article..."
                          className={`w-full px-3 py-2 text-sm border rounded ${
                            errors[`ligne_${index}_designation`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Quantité *</label>
                        <input
                          type="number"
                          value={ligne.quantite}
                          onChange={(e) => handleUpdateLigne(ligne.id, 'quantite', parseFloat(e.target.value) || 0)}
                          min="1"
                          step="1"
                          className={`w-full px-3 py-2 text-sm border rounded ${
                            errors[`ligne_${index}_quantite`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Prix unitaire *</label>
                        <input
                          type="number"
                          value={ligne.prix_unitaire}
                          onChange={(e) => handleUpdateLigne(ligne.id, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className={`w-full px-3 py-2 text-sm border rounded ${
                            errors[`ligne_${index}_prix`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="block text-xs text-gray-600 mb-1">Montant</label>
                        <div className="px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded font-medium text-blue-900">
                          {ligne.montant_ligne.toFixed(2)} {formData.devise}
                        </div>
                      </div>

                      <div className="col-span-6">
                        <label className="block text-xs text-gray-600 mb-1">Rubrique d'achat</label>
                        <select
                          value={ligne.rubrique_achat || ''}
                          onChange={(e) => handleUpdateLigne(ligne.id, 'rubrique_achat', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                        >
                          <option value="">Sélectionner</option>
                          {RUBRIQUES_ACHAT.map(rubrique => (
                            <option key={rubrique} value={rubrique}>{rubrique}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-6">
                        <label className="block text-xs text-gray-600 mb-1">Code article (si stock)</label>
                        <input
                          type="text"
                          value={ligne.article_code || ''}
                          onChange={(e) => handleUpdateLigne(ligne.id, 'article_code', e.target.value)}
                          placeholder="ART-XXX"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            {formData.lignes.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Montant total de la demande</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">
                      {total.toFixed(2)} {formData.devise}
                    </div>
                    <div className="text-xs text-blue-600">
                      {formData.lignes.length} ligne{formData.lignes.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSubmit('save')}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer brouillon
            </Button>
            <Button onClick={() => handleSubmit('submit')}>
              <Send className="h-4 w-4 mr-2" />
              Soumettre pour validation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
