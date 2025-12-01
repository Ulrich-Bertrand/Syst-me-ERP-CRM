import { useState } from 'react';
import { 
  X, Plus, Trash2, Building2, Truck, AlertCircle, Save, Send, Box
} from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  DemandeAchatForm, 
  LigneAchatForm,
  SERVICES_DEMANDEURS,
  RUBRIQUES_ACHAT,
  MODES_REGLEMENT,
  DEVISES,
  TN_Fournisseurs
} from '../types/achats';
import { mockFournisseurs } from '../data/mockAchatsData';
import { FournisseurSelector } from './FournisseurSelector';
import { PlanAchatSelector } from './PlanAchatSelector';
import { TYPES_DOSSIERS_DISPONIBLES, MODES_TRANSPORT_DISPONIBLES } from '../data/mockPlansAchats';

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
  const [typeDossierSelected, setTypeDossierSelected] = useState<string>('');
  const [modeTransportSelected, setModeTransportSelected] = useState<string>('');

  // ========== NOUVELLE FONCTIONNALITÉ 1: Sélection fournisseur avec devise automatique ==========
  const handleFournisseurSelect = (fournisseur: TN_Fournisseurs) => {
    setFormData({
      ...formData,
      fournisseur: fournisseur.Code_Fournisseur,
      // ✅ La devise se met à jour automatiquement selon le fournisseur
      devise: fournisseur.Devise_Defaut || formData.devise
    });
  };

  // ========== NOUVELLE FONCTIONNALITÉ 2: Import depuis plan d'achat ==========
  const handleImportPlanAchat = (lignesImportees: LigneAchatForm[]) => {
    setFormData({
      ...formData,
      lignes: [...formData.lignes, ...lignesImportees]
    });
  };

  // Ajouter une ligne manuellement
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

  const handleRemoveLigne = (id: string) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.filter(l => l.id !== id)
    });
  };

  const handleUpdateLigne = (id: string, field: keyof LigneAchatForm, value: any) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.map(ligne => {
        if (ligne.id === id) {
          const updated = { ...ligne, [field]: value };
          if (field === 'quantite' || field === 'prix_unitaire') {
            updated.montant_ligne = updated.quantite * updated.prix_unitaire;
          }
          return updated;
        }
        return ligne;
      })
    });
  };

  const calculateTotal = () => {
    return formData.lignes.reduce((sum, ligne) => sum + ligne.montant_ligne, 0);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fournisseur) newErrors.fournisseur = 'Fournisseur requis';
    if (formData.type_demande === 'dossier' && !formData.dossier_id) newErrors.dossier_id = 'Dossier requis';
    if (formData.type_demande === 'agence' && !formData.service_demandeur) newErrors.service_demandeur = 'Service requis';
    if (!formData.motif_achat || formData.motif_achat.trim().length < 10) newErrors.motif_achat = 'Motif requis (min 10 car.)';
    if (formData.lignes.length === 0) newErrors.lignes = 'Au moins une ligne requise';

    formData.lignes.forEach((ligne, i) => {
      if (!ligne.designation.trim()) newErrors[`ligne_${i}_designation`] = 'Requis';
      if (ligne.quantite <= 0) newErrors[`ligne_${i}_quantite`] = 'Invalid';
      if (ligne.prix_unitaire <= 0) newErrors[`ligne_${i}_prix`] = 'Invalide';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action: 'save' | 'submit') => {
    if (!validateForm()) return;
    onSubmit(formData);
    onClose();
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl">Nouvelle demande d'achat</h2>
            <p className="text-sm text-gray-500 mt-1">Remplissez les champs obligatoires (*)</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Type de demande <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type_demande: 'agence', dossier_id: undefined })}
                className={`p-4 border-2 rounded-lg ${formData.type_demande === 'agence' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
              >
                <Building2 className={`h-6 w-6 mx-auto mb-2 ${formData.type_demande === 'agence' ? 'text-blue-600' : 'text-gray-400'}`} />
                <p className="font-medium text-sm">Achat Agence</p>
                <p className="text-xs text-gray-500 mt-1">IT, Admin, HR...</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type_demande: 'dossier', service_demandeur: undefined })}
                className={`p-4 border-2 rounded-lg ${formData.type_demande === 'dossier' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
              >
                <Truck className={`h-6 w-6 mx-auto mb-2 ${formData.type_demande === 'dossier' ? 'text-blue-600' : 'text-gray-400'}`} />
                <p className="font-medium text-sm">Achat Dossier</p>
                <p className="text-xs text-gray-500 mt-1">Lié à un dossier client</p>
              </button>
            </div>
          </div>

          {/* Rattachement + Type/Mode (pour plans d'achat) */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {formData.type_demande === 'agence' ? (
              <div>
                <label className="block text-sm font-medium mb-2">Service <span className="text-red-600">*</span></label>
                <select
                  value={formData.service_demandeur || ''}
                  onChange={(e) => setFormData({ ...formData, service_demandeur: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.service_demandeur ? 'border-red-300' : 'border-gray-300'}`}
                >
                  <option value="">Sélectionner</option>
                  {SERVICES_DEMANDEURS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service_demandeur && <p className="text-xs text-red-600 mt-1">{errors.service_demandeur}</p>}
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Dossier <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    placeholder="DOS-2025-XXX"
                    value={formData.dossier_id || ''}
                    onChange={(e) => setFormData({ ...formData, dossier_id: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.dossier_id ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.dossier_id && <p className="text-xs text-red-600 mt-1">{errors.dossier_id}</p>}
                </div>
                
                {/* ✅ NOUVEAU: Type de dossier pour filtrer les plans d'achat */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type de dossier</label>
                  <select
                    value={typeDossierSelected}
                    onChange={(e) => setTypeDossierSelected(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sélectionner</option>
                    {TYPES_DOSSIERS_DISPONIBLES.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Pour plan d'achat</p>
                </div>
                
                {/* ✅ NOUVEAU: Mode transport pour filtrer les plans */}
                {(typeDossierSelected === 'TRANSIT' || typeDossierSelected === 'SHIPPING') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Mode de transport</label>
                    <select
                      value={modeTransportSelected}
                      onChange={(e) => setModeTransportSelected(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Sélectionner</option>
                      {MODES_TRANSPORT_DISPONIBLES.map(m => <option key={m.code} value={m.code}>{m.label}</option>)}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Pour plan d'achat</p>
                  </div>
                )}
              </>
            )}

            <div className={formData.type_demande === 'agence' ? 'col-span-2' : ''}>
              <label className="block text-sm font-medium mb-2">Priorité <span className="text-red-600">*</span></label>
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

          {/* Fournisseur avec RECHERCHE + Devise AUTO */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Fournisseur <span className="text-red-600">*</span>
              </label>
              {/* ✅ NOUVEAU: Composant de recherche */}
              <FournisseurSelector
                fournisseurs={mockFournisseurs}
                selectedFournisseur={formData.fournisseur}
                onSelect={handleFournisseurSelect}
                error={errors.fournisseur}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mode de règlement *</label>
              <select
                value={formData.mode_reglement}
                onChange={(e) => setFormData({ ...formData, mode_reglement: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {MODES_REGLEMENT.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Devise * {formData.fournisseur && <span className="text-xs text-blue-600">(Auto)</span>}
              </label>
              <select
                value={formData.devise}
                onChange={(e) => setFormData({ ...formData, devise: e.target.value })}
                className="w-full px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg"
              >
                {DEVISES.map(d => <option key={d.code} value={d.code}>{d.label}</option>)}
              </select>
              <p className="text-xs text-blue-600 mt-1">✓ Devise du fournisseur</p>
            </div>
          </div>

          {/* Motif + Date + Stock */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Motif *</label>
              <textarea
                value={formData.motif_achat}
                onChange={(e) => setFormData({ ...formData, motif_achat: e.target.value })}
                placeholder="Décrivez le motif..."
                rows={2}
                className={`w-full px-3 py-2 border rounded-lg ${errors.motif_achat ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.motif_achat && <p className="text-xs text-red-600 mt-1">{errors.motif_achat}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date de besoin</label>
              <input
                type="date"
                value={formData.date_besoin || ''}
                onChange={(e) => setFormData({ ...formData, date_besoin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer mt-6">
                <input
                  type="checkbox"
                  checked={formData.impact_stock}
                  onChange={(e) => setFormData({ ...formData, impact_stock: e.target.checked })}
                  className="rounded"
                />
                <Box className="h-4 w-4" />
                <span className="text-sm font-medium">Impact sur le stock</span>
              </label>
            </div>
          </div>

          {/* ========== LIGNES DE COMMANDE ========== */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Lignes de commande</h3>
                <p className="text-sm text-gray-500">Ajoutez manuellement ou importez depuis un plan</p>
              </div>
              <div className="flex gap-2">
                {/* ✅ NOUVEAU: Import depuis plan d'achat */}
                {formData.type_demande === 'dossier' && (
                  <PlanAchatSelector
                    typeDossier={typeDossierSelected}
                    modeTransport={modeTransportSelected}
                    onImport={handleImportPlanAchat}
                  />
                )}
                <Button onClick={handleAddLigne} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter manuellement
                </Button>
              </div>
            </div>

            {errors.lignes && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{errors.lignes}</span>
                </div>
              </div>
            )}

            {formData.lignes.length > 0 && (
              <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                {formData.lignes.map((ligne, i) => (
                  <div key={ligne.id} className="p-3 bg-gray-50 rounded border">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium">Ligne {i + 1}</span>
                      <button onClick={() => handleRemoveLigne(ligne.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={ligne.designation}
                          onChange={(e) => handleUpdateLigne(ligne.id, 'designation', e.target.value)}
                          placeholder="Désignation *"
                          className={`w-full px-2 py-1.5 text-sm border rounded ${errors[`ligne_${i}_designation`] ? 'border-red-300' : 'border-gray-300'}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={ligne.quantite}
                          onChange={(e) => handleUpdateLigne(ligne.id, 'quantite', parseFloat(e.target.value) || 0)}
                          min="1"
                          placeholder="Qté"
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={ligne.prix_unitaire}
                          onChange={(e) => handleUpdateLigne(ligne.id, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          placeholder="P.U."
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div className="col-span-3">
                        <div className="px-2 py-1.5 text-sm bg-blue-50 border border-blue-200 rounded font-medium">
                          {ligne.montant_ligne.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            {formData.lignes.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">
                      {total.toFixed(2)} {formData.devise}
                    </div>
                    <div className="text-xs text-blue-600">{formData.lignes.length} ligne(s)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSubmit('save')}>
              <Save className="h-4 w-4 mr-2" />
              Brouillon
            </Button>
            <Button onClick={() => handleSubmit('submit')}>
              <Send className="h-4 w-4 mr-2" />
              Soumettre
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
