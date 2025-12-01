import { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Building2, Truck, AlertCircle, Save, Send, Box, Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { useApi, useMutation } from '../../hooks/useApi';
import { demandesApi, fournisseursApi } from '../../services/api';
import { toast } from 'sonner';

interface LigneForm {
  numero_ligne: number;
  designation: string;
  description?: string;
  reference_article?: string;
  categorie?: string;
  quantite: number;
  unite: string;
  prix_unitaire_estime?: number;
  fournisseur_id?: string;
  code_fournisseur?: string;
  nom_fournisseur?: string;
  date_besoin?: string;
  notes?: string;
}

interface FormData {
  type_demande: 'operationnel' | 'interne' | 'investissement' | 'contrat_cadre';
  objet: string;
  justification?: string;
  urgence: 'normale' | 'urgent' | 'tres_urgent';
  dossier_id?: string;
  dossier_ref?: string;
  lignes: LigneForm[];
}

interface CreerDemandeAchatFormProps {
  onClose: () => void;
  onSuccess?: (demande: any) => void;
}

export function CreerDemandeAchatForm({ onClose, onSuccess }: CreerDemandeAchatFormProps) {
  const [formData, setFormData] = useState<FormData>({
    type_demande: 'operationnel',
    objet: '',
    urgence: 'normale',
    lignes: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger fournisseurs
  const { data: fournisseursData, loading: loadingFournisseurs } = useApi(
    () => fournisseursApi.getAll({ actif: true })
  );

  // Mutation pour créer DA
  const { mutate: createDA, loading: creating } = useMutation(demandesApi.create);

  const fournisseurs = fournisseursData?.data || [];

  // Ajouter une ligne
  const handleAddLigne = () => {
    const newLigne: LigneForm = {
      numero_ligne: formData.lignes.length + 1,
      designation: '',
      quantite: 1,
      unite: 'unite',
      prix_unitaire_estime: 0
    };
    setFormData({
      ...formData,
      lignes: [...formData.lignes, newLigne]
    });
  };

  // Supprimer une ligne
  const handleRemoveLigne = (index: number) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.filter((_, i) => i !== index).map((l, i) => ({
        ...l,
        numero_ligne: i + 1
      }))
    });
  };

  // Modifier une ligne
  const handleUpdateLigne = (index: number, field: keyof LigneForm, value: any) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.map((ligne, i) => 
        i === index ? { ...ligne, [field]: value } : ligne
      )
    });
  };

  // Sélectionner fournisseur pour une ligne
  const handleSelectFournisseur = (index: number, fournisseurId: string) => {
    const fournisseur = fournisseurs.find(f => f.id === fournisseurId);
    if (fournisseur) {
      handleUpdateLigne(index, 'fournisseur_id', fournisseur.id);
      handleUpdateLigne(index, 'code_fournisseur', fournisseur.code_fournisseur);
      handleUpdateLigne(index, 'nom_fournisseur', fournisseur.nom);
    }
  };

  // Calculer montant total
  const calculateTotal = () => {
    return formData.lignes.reduce((sum, ligne) => {
      const montant = (ligne.quantite || 0) * (ligne.prix_unitaire_estime || 0);
      return sum + montant;
    }, 0);
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.objet || formData.objet.trim().length < 10) {
      newErrors.objet = 'Objet requis (minimum 10 caractères)';
    }

    if (formData.type_demande === 'operationnel' && !formData.dossier_ref) {
      newErrors.dossier_ref = 'Référence dossier requise pour achat opérationnel';
    }

    if (formData.lignes.length === 0) {
      newErrors.lignes = 'Au moins une ligne requise';
    }

    formData.lignes.forEach((ligne, i) => {
      if (!ligne.designation.trim()) {
        newErrors[`ligne_${i}_designation`] = 'Désignation requise';
      }
      if (ligne.quantite <= 0) {
        newErrors[`ligne_${i}_quantite`] = 'Quantité invalide';
      }
      if (!ligne.unite) {
        newErrors[`ligne_${i}_unite`] = 'Unité requise';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre (brouillon)
  const handleSaveDraft = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    try {
      const result = await createDA(formData);
      toast.success(`Demande ${result.numero_da} créée en brouillon`);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création');
    }
  };

  // Soumettre et envoyer à validation
  const handleSubmitForValidation = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    try {
      // Créer la DA
      const result = await createDA(formData);
      
      // Soumettre à validation
      await demandesApi.submit(result.id);
      
      toast.success(`Demande ${result.numero_da} créée et soumise à validation`);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la soumission');
    }
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Nouvelle demande d'achat</h2>
            <p className="text-sm text-gray-500 mt-1">Remplissez les champs obligatoires (*)</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Type de demande */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Type de demande <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-4 gap-4">
              {[
                { value: 'operationnel', label: 'Opérationnel', icon: Truck },
                { value: 'interne', label: 'Interne', icon: Building2 },
                { value: 'investissement', label: 'Investissement', icon: Box },
                { value: 'contrat_cadre', label: 'Contrat cadre', icon: AlertCircle }
              ].map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type_demande: type.value as any })}
                    className={`p-4 border-2 rounded-lg ${
                      formData.type_demande === type.value 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${
                      formData.type_demande === type.value ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <p className="font-medium text-sm">{type.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Objet <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.objet}
                onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.objet ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Achat fournitures bureau - Trimestre 1"
              />
              {errors.objet && <p className="text-xs text-red-600 mt-1">{errors.objet}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Justification</label>
              <textarea
                value={formData.justification || ''}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Justification de la demande..."
              />
            </div>

            {formData.type_demande === 'operationnel' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Référence dossier <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dossier_ref || ''}
                  onChange={(e) => setFormData({ ...formData, dossier_ref: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.dossier_ref ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="DOS-2025-GH-XXX"
                />
                {errors.dossier_ref && <p className="text-xs text-red-600 mt-1">{errors.dossier_ref}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Urgence</label>
              <select
                value={formData.urgence}
                onChange={(e) => setFormData({ ...formData, urgence: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="normale">Normale</option>
                <option value="urgent">Urgent</option>
                <option value="tres_urgent">Très urgent</option>
              </select>
            </div>
          </div>

          {/* Lignes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">
                Lignes de la demande <span className="text-red-600">*</span>
              </label>
              <Button onClick={handleAddLigne} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter ligne
              </Button>
            </div>

            {errors.lignes && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.lignes}</p>
              </div>
            )}

            <div className="space-y-4">
              {formData.lignes.map((ligne, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Ligne {ligne.numero_ligne}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLigne(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">
                        Désignation *
                      </label>
                      <input
                        type="text"
                        value={ligne.designation}
                        onChange={(e) => handleUpdateLigne(index, 'designation', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          errors[`ligne_${index}_designation`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ex: Papier A4 80g - Ramette 500 feuilles"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Description</label>
                      <input
                        type="text"
                        value={ligne.description || ''}
                        onChange={(e) => handleUpdateLigne(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Description détaillée (optionnel)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Catégorie</label>
                      <select
                        value={ligne.categorie || ''}
                        onChange={(e) => handleUpdateLigne(index, 'categorie', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Fournitures">Fournitures</option>
                        <option value="Équipements">Équipements</option>
                        <option value="Consommables">Consommables</option>
                        <option value="Services">Services</option>
                        <option value="Emballages">Emballages</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Fournisseur suggéré
                      </label>
                      <select
                        value={ligne.fournisseur_id || ''}
                        onChange={(e) => handleSelectFournisseur(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        disabled={loadingFournisseurs}
                      >
                        <option value="">Sélectionner...</option>
                        {fournisseurs.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.code_fournisseur} - {f.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Quantité *</label>
                      <input
                        type="number"
                        value={ligne.quantite}
                        onChange={(e) => handleUpdateLigne(index, 'quantite', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          errors[`ligne_${index}_quantite`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Unité *</label>
                      <select
                        value={ligne.unite}
                        onChange={(e) => handleUpdateLigne(index, 'unite', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="unite">Unité</option>
                        <option value="boite">Boîte</option>
                        <option value="litre">Litre</option>
                        <option value="kg">Kilogramme</option>
                        <option value="metre">Mètre</option>
                        <option value="forfait">Forfait</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Prix unitaire estimé
                      </label>
                      <input
                        type="number"
                        value={ligne.prix_unitaire_estime || ''}
                        onChange={(e) => handleUpdateLigne(index, 'prix_unitaire_estime', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Date besoin</label>
                      <input
                        type="date"
                        value={ligne.date_besoin || ''}
                        onChange={(e) => handleUpdateLigne(index, 'date_besoin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-600">Montant ligne:</span>
                        <span className="font-medium">
                          {((ligne.quantite || 0) * (ligne.prix_unitaire_estime || 0)).toFixed(2)} GHS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          {formData.lignes.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Montant total estimé:</span>
                <span className="text-xl font-bold text-blue-600">
                  {total.toFixed(2)} GHS
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={creating}
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer brouillon
                </>
              )}
            </Button>

            <Button 
              onClick={handleSubmitForValidation}
              disabled={creating}
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Soumission...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Soumettre à validation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
