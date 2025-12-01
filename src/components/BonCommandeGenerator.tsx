import { useState } from 'react';
import { 
  FileText, Send, Download, Eye, Calendar, MapPin, 
  CreditCard, Truck, X, CheckCircle, AlertCircle, Printer
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DemandeAchatComplete } from '../types/achats';
import { BonCommande, LigneBC, genererNumeroBC } from '../types/bonCommande';
import { mockSeriesBC, getSerieByAgence, getTemplateDefaut } from '../data/mockBonsCommande';
import { DELAIS_LIVRAISON_STANDARDS } from '../types/bonCommande';

interface BonCommandeGeneratorProps {
  demande: DemandeAchatComplete;
  onGenerate: (bc: BonCommande) => void;
  onClose: () => void;
}

export function BonCommandeGenerator({ demande, onGenerate, onClose }: BonCommandeGeneratorProps) {
  const serie = getSerieByAgence('GHANA'); // TODO: Déterminer selon agence de la DA
  const template = getTemplateDefaut();

  const [formData, setFormData] = useState({
    date_livraison_prevue: '',
    lieu_livraison: 'Dépôt Jocyderk Logistics, Tema Port Area',
    delai_livraison: '5_jours',
    delai_livraison_custom: '',
    conditions_paiement: demande.fournisseur?.Conditions_Paiement || '30 jours fin de mois',
    mode_paiement: demande.demande.mode_reglement,
    validite_jours: 30,
    inclure_conditions_generales: true,
    envoyer_automatiquement: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  // Générer le numéro BC
  const numeroBC = serie ? genererNumeroBC(serie) : 'BC-TEMP-001';

  // Convertir les lignes DA en lignes BC
  const lignesBC: LigneBC[] = demande.lignes.map((ligne, index) => ({
    id: `LBC-${Date.now()}-${index}`,
    numero_ligne: index + 1,
    designation: ligne.designation,
    reference_article: ligne.designation.slice(0, 20).toUpperCase().replace(/\s/g, '-'),
    quantite_commandee: ligne.quantite,
    quantite_recue: 0,
    unite: 'unite', // TODO: Détecter selon désignation
    prix_unitaire: ligne.prix_unitaire,
    montant_ligne: ligne.montant_ligne,
    code_comptable: ligne.compte_comptable
  }));

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date_livraison_prevue) {
      newErrors.date_livraison_prevue = 'Date de livraison requise';
    } else {
      const dateMin = new Date();
      dateMin.setDate(dateMin.getDate() + 1);
      if (new Date(formData.date_livraison_prevue) < dateMin) {
        newErrors.date_livraison_prevue = 'Date doit être au moins demain';
      }
    }

    if (!formData.lieu_livraison || formData.lieu_livraison.trim().length < 10) {
      newErrors.lieu_livraison = 'Adresse de livraison détaillée requise (min 10 car.)';
    }

    if (formData.delai_livraison === 'sur_mesure' && !formData.delai_livraison_custom) {
      newErrors.delai_livraison_custom = 'Précisez le délai personnalisé';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validateForm()) return;

    const delaiTexte = formData.delai_livraison === 'sur_mesure' 
      ? formData.delai_livraison_custom 
      : DELAIS_LIVRAISON_STANDARDS.find(d => d.value === formData.delai_livraison)?.label || '5 jours ouvrés';

    const bonCommande: BonCommande = {
      id: `BC-${Date.now()}`,
      numero_bc: numeroBC,
      demande_achat_id: demande.demande.id,
      demande_achat_ref: demande.piece.Num_Piece,
      
      date_emission: new Date().toISOString(),
      date_livraison_prevue: formData.date_livraison_prevue,
      validite_jours: formData.validite_jours,
      
      agence_emettrice: {
        code_agence: 'GH-001',
        nom: 'JOCYDERK LOGISTICS LTD GHANA',
        adresse: 'P.O. Box 1234, Tema, Greater Accra Region, Ghana',
        telephone: '+233 24 123 4567',
        email: 'procurement@jocyderklogistics.com'
      },
      
      fournisseur: {
        code_fournisseur: demande.fournisseur?.Code_Fournisseur || '',
        nom: demande.fournisseur?.Nom_Fournisseur || '',
        adresse: demande.fournisseur?.Adresse || 'Adresse non renseignée',
        telephone: demande.fournisseur?.Telephone,
        email: demande.fournisseur?.Email,
        contact_principal: demande.fournisseur?.Contact_Principal
      },
      
      lignes: lignesBC,
      
      montant_ht: demande.montant_total,
      tva: {
        applicable: false,
        taux_pourcent: 0,
        montant_tva: 0
      },
      montant_ttc: demande.montant_total,
      devise: demande.devise,
      
      conditions_paiement: formData.conditions_paiement,
      mode_paiement: formData.mode_paiement === 'cash' ? 'Espèces' : 
                      formData.mode_paiement === 'banque' ? 'Virement bancaire' : 
                      'Mobile Money',
      lieu_livraison: formData.lieu_livraison,
      delai_livraison: delaiTexte,
      conditions_generales: formData.inclure_conditions_generales ? template.conditions_generales_texte : undefined,
      
      statut: 'genere',
      
      receptions: [],
      
      compte_fournisseur: demande.fournisseur?.Compte_Comptable || '',
      
      created_by: 'Consultant IC', // TODO: Utilisateur connecté
      created_at: new Date().toISOString(),
      
      fichiers_joints: []
    };

    onGenerate(bonCommande);
    onClose();
  };

  const getDelaiLabel = () => {
    if (formData.delai_livraison === 'sur_mesure') {
      return formData.delai_livraison_custom || 'À préciser';
    }
    return DELAIS_LIVRAISON_STANDARDS.find(d => d.value === formData.delai_livraison)?.label || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Générer un Bon de Commande</h2>
              <p className="text-sm text-gray-600 mt-1">
                Pour la demande d'achat {demande.piece.Num_Piece}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Info DA */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-blue-700 mb-1">Fournisseur</p>
                <p className="font-medium text-blue-900">{demande.fournisseur?.Nom_Fournisseur}</p>
              </div>
              <div>
                <p className="text-xs text-blue-700 mb-1">Montant total</p>
                <p className="font-medium text-blue-900">
                  {demande.montant_total.toFixed(2)} {demande.devise}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 mb-1">Nombre de lignes</p>
                <p className="font-medium text-blue-900">{demande.nb_lignes} ligne(s)</p>
              </div>
            </div>
          </div>

          {/* Numéro BC */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Numéro du Bon de Commande
            </label>
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-mono text-lg font-bold text-green-900">{numeroBC}</p>
                <p className="text-xs text-green-700 mt-1">
                  Généré automatiquement selon série {serie?.code_serie}
                </p>
              </div>
            </div>
          </div>

          {/* Dates et validité */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Date d'émission
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Date de livraison prévue <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={formData.date_livraison_prevue}
                onChange={(e) => setFormData({ ...formData, date_livraison_prevue: e.target.value })}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.date_livraison_prevue ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.date_livraison_prevue && (
                <p className="text-xs text-red-600 mt-1">{errors.date_livraison_prevue}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Validité (jours)
              </label>
              <input
                type="number"
                value={formData.validite_jours}
                onChange={(e) => setFormData({ ...formData, validite_jours: parseInt(e.target.value) || 30 })}
                min="7"
                max="90"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Livraison */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Lieu de livraison <span className="text-red-600">*</span>
            </label>
            <textarea
              value={formData.lieu_livraison}
              onChange={(e) => setFormData({ ...formData, lieu_livraison: e.target.value })}
              rows={2}
              placeholder="Adresse complète de livraison..."
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.lieu_livraison ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.lieu_livraison && (
              <p className="text-xs text-red-600 mt-1">{errors.lieu_livraison}</p>
            )}
          </div>

          {/* Délai de livraison */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Délai de livraison
              </label>
              <select
                value={formData.delai_livraison}
                onChange={(e) => setFormData({ ...formData, delai_livraison: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {DELAIS_LIVRAISON_STANDARDS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {formData.delai_livraison === 'sur_mesure' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Délai personnalisé <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.delai_livraison_custom}
                  onChange={(e) => setFormData({ ...formData, delai_livraison_custom: e.target.value })}
                  placeholder="Ex: 15 jours calendaires"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.delai_livraison_custom ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.delai_livraison_custom && (
                  <p className="text-xs text-red-600 mt-1">{errors.delai_livraison_custom}</p>
                )}
              </div>
            )}
          </div>

          {/* Paiement */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Conditions de paiement
              </label>
              <input
                type="text"
                value={formData.conditions_paiement}
                onChange={(e) => setFormData({ ...formData, conditions_paiement: e.target.value })}
                placeholder="Ex: 30 jours fin de mois"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Mode de paiement
              </label>
              <select
                value={formData.mode_paiement}
                onChange={(e) => setFormData({ ...formData, mode_paiement: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="banque">Virement bancaire</option>
                <option value="cash">Espèces</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm mb-3">Options du document</h3>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inclure_conditions_generales}
                onChange={(e) => setFormData({ ...formData, inclure_conditions_generales: e.target.checked })}
                className="rounded"
              />
              <div>
                <p className="text-sm font-medium">Inclure les conditions générales</p>
                <p className="text-xs text-gray-500">Conditions générales de vente et de livraison</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.envoyer_automatiquement}
                onChange={(e) => setFormData({ ...formData, envoyer_automatiquement: e.target.checked })}
                className="rounded"
              />
              <div>
                <p className="text-sm font-medium">Envoyer automatiquement au fournisseur</p>
                <p className="text-xs text-gray-500">
                  Email sera envoyé à : {demande.fournisseur?.Email || 'Email non renseigné'}
                </p>
              </div>
            </label>
          </div>

          {/* Aperçu lignes */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium">Lignes du bon de commande ({lignesBC.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Désignation</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Quantité</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">P.U.</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lignesBC.map((ligne) => (
                    <tr key={ligne.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm">{ligne.numero_ligne}</td>
                      <td className="px-4 py-3 text-sm">{ligne.designation}</td>
                      <td className="px-4 py-3 text-sm text-right">{ligne.quantite_commandee}</td>
                      <td className="px-4 py-3 text-sm text-right">{ligne.prix_unitaire.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        {ligne.montant_ligne.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50">
                    <td colSpan={4} className="px-4 py-3 text-sm font-medium text-right">
                      TOTAL {demande.devise}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-blue-900">
                      {demande.montant_total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4" />
            <span>Le BC sera créé avec le statut "Généré"</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={() => setShowPreview(true)} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
            <Button onClick={handleGenerate}>
              <FileText className="h-4 w-4 mr-2" />
              Générer le BC
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
