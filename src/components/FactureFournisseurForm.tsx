import { useState } from 'react';
import { 
  FileText, Upload, CheckCircle, AlertCircle, X, Save,
  Calculator, AlertTriangle, Eye
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BonCommande } from '../types/bonCommande';
import { FactureFournisseur, LigneFacture, Controle3Voies, EcartControle } from '../types/facturesPaiements';
import { calculerEcartPourcentage, determinerGraviteEcart } from '../types/facturesPaiements';

interface FactureFournisseurFormProps {
  bonCommande: BonCommande;
  onSave: (facture: FactureFournisseur) => void;
  onClose: () => void;
}

export function FactureFournisseurForm({ bonCommande, onSave, onClose }: FactureFournisseurFormProps) {
  const [formData, setFormData] = useState({
    numero_facture: '',
    date_facture: new Date().toISOString().split('T')[0],
    date_echeance: '',
    date_reception_facture: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [lignesFacture, setLignesFacture] = useState<LigneFacture[]>(
    bonCommande.lignes.map((ligneBc, index) => ({
      id: `LFACT-${Date.now()}-${index}`,
      numero_ligne: ligneBc.numero_ligne,
      designation: ligneBc.designation,
      quantite_facturee: ligneBc.quantite_commandee,
      unite: ligneBc.unite,
      prix_unitaire: ligneBc.prix_unitaire,
      montant_ht: ligneBc.montant_ligne,
      montant_ttc: ligneBc.montant_ligne,
      ligne_bc_id: ligneBc.id,
      ecart_quantite: 0,
      ecart_prix: 0,
      ecart_montant: 0,
      compte_comptable: ligneBc.code_comptable
    }))
  );

  const [fichierFacture, setFichierFacture] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showControle3Voies, setShowControle3Voies] = useState(false);
  const [controle3Voies, setControle3Voies] = useState<Controle3Voies | null>(null);

  // Calculer les totaux
  const montantTotalFacture = lignesFacture.reduce((sum, l) => sum + l.montant_ttc, 0);
  const montantTotalBC = bonCommande.montant_ttc;
  const ecartGlobal = montantTotalFacture - montantTotalBC;
  const ecartGlobalPourcent = calculerEcartPourcentage(montantTotalBC, montantTotalFacture);

  // Mettre à jour ligne
  const updateLigne = (index: number, field: keyof LigneFacture, value: any) => {
    const newLignes = [...lignesFacture];
    const ligne = { ...newLignes[index] };
    
    // Mise à jour du champ
    (ligne as any)[field] = value;
    
    // Recalculer montant si quantité ou prix changé
    if (field === 'quantite_facturee' || field === 'prix_unitaire') {
      ligne.montant_ht = ligne.quantite_facturee * ligne.prix_unitaire;
      ligne.montant_ttc = ligne.montant_ht; // TODO: Gérer TVA
    }
    
    // Calculer écarts vs BC
    const ligneBc = bonCommande.lignes.find(l => l.id === ligne.ligne_bc_id);
    if (ligneBc) {
      ligne.ecart_quantite = ligne.quantite_facturee - ligneBc.quantite_commandee;
      ligne.ecart_prix = ligne.prix_unitaire - ligneBc.prix_unitaire;
      ligne.ecart_montant = ligne.montant_ttc - ligneBc.montant_ligne;
    }
    
    newLignes[index] = ligne;
    setLignesFacture(newLignes);
  };

  // Effectuer contrôle 3 voies
  const effectuerControle3Voies = (): Controle3Voies => {
    const ecarts: EcartControle[] = [];
    
    // 1. Vérifier chaque ligne
    lignesFacture.forEach(ligneFacture => {
      const ligneBc = bonCommande.lignes.find(l => l.id === ligneFacture.ligne_bc_id);
      if (!ligneBc) return;
      
      // Écart quantité
      if (ligneFacture.ecart_quantite !== 0) {
        const ecartPourcent = calculerEcartPourcentage(ligneBc.quantite_commandee, ligneFacture.quantite_facturee);
        ecarts.push({
          type: 'quantite',
          description: `Écart de quantité sur ligne ${ligneFacture.numero_ligne}`,
          ligne_numero: ligneFacture.numero_ligne,
          valeur_attendue: ligneBc.quantite_commandee,
          valeur_facturee: ligneFacture.quantite_facturee,
          ecart: ligneFacture.ecart_quantite || 0,
          ecart_pourcent: ecartPourcent,
          gravite: determinerGraviteEcart(ecartPourcent),
          action_requise: Math.abs(ecartPourcent) > 5 ? 'Validation CFO requise' : 'À vérifier'
        });
      }
      
      // Écart prix
      if (ligneFacture.ecart_prix !== 0) {
        const ecartPourcent = calculerEcartPourcentage(ligneBc.prix_unitaire, ligneFacture.prix_unitaire);
        ecarts.push({
          type: 'prix',
          description: `Écart de prix unitaire sur ligne ${ligneFacture.numero_ligne}`,
          ligne_numero: ligneFacture.numero_ligne,
          valeur_attendue: ligneBc.prix_unitaire,
          valeur_facturee: ligneFacture.prix_unitaire,
          ecart: ligneFacture.ecart_prix || 0,
          ecart_pourcent: ecartPourcent,
          gravite: determinerGraviteEcart(ecartPourcent),
          action_requise: 'Justification fournisseur requise'
        });
      }
    });
    
    // 2. Écart montant global
    if (Math.abs(ecartGlobal) > 0.01) {
      ecarts.push({
        type: 'montant',
        description: 'Écart de montant total',
        valeur_attendue: montantTotalBC,
        valeur_facturee: montantTotalFacture,
        ecart: ecartGlobal,
        ecart_pourcent: ecartGlobalPourcent,
        gravite: determinerGraviteEcart(ecartGlobalPourcent),
        action_requise: Math.abs(ecartGlobalPourcent) > 5 ? 'Validation CFO obligatoire' : 'Validation manager'
      });
    }
    
    const conforme = ecarts.length === 0;
    const tauxConformite = conforme ? 100 : Math.max(0, 100 - Math.abs(ecartGlobalPourcent));
    
    return {
      effectue_le: new Date().toISOString(),
      effectue_par: 'Accountant', // TODO: Utilisateur connecté
      conforme,
      ecarts_detectes: ecarts,
      taux_conformite: tauxConformite,
      comparaison_da_bc: {
        conforme: true,
        ecarts: []
      },
      comparaison_bc_facture: {
        conforme,
        ecarts: ecarts.map(e => e.description)
      },
      comparaison_reception: {
        conforme: bonCommande.receptions.length > 0,
        ecarts: bonCommande.receptions.length === 0 ? ['Aucune réception enregistrée'] : []
      },
      decision: conforme ? 'approuver' : (Math.abs(ecartGlobalPourcent) > 5 ? 'investigation' : 'approuver')
    };
  };

  const handleControle = () => {
    const controle = effectuerControle3Voies();
    setControle3Voies(controle);
    setShowControle3Voies(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.numero_facture || formData.numero_facture.trim().length < 3) {
      newErrors.numero_facture = 'Numéro de facture requis (min 3 caractères)';
    }
    
    if (!formData.date_facture) {
      newErrors.date_facture = 'Date de facture requise';
    }
    
    if (!formData.date_echeance) {
      newErrors.date_echeance = 'Date d\'échéance requise';
    } else if (new Date(formData.date_echeance) < new Date(formData.date_facture)) {
      newErrors.date_echeance = 'Date d\'échéance doit être >= date facture';
    }
    
    if (!fichierFacture) {
      newErrors.fichier = 'Le fichier de la facture est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    // Effectuer contrôle si pas déjà fait
    const controle = controle3Voies || effectuerControle3Voies();
    
    const facture: FactureFournisseur = {
      id: `FACT-${Date.now()}`,
      numero_facture: formData.numero_facture,
      numero_interne: `FRN-2025-${(Math.floor(Math.random() * 1000)).toString().padStart(4, '0')}`,
      
      demande_achat_id: bonCommande.demande_achat_id,
      demande_achat_ref: bonCommande.demande_achat_ref,
      bon_commande_id: bonCommande.id,
      bon_commande_ref: bonCommande.numero_bc,
      
      fournisseur: {
        code_fournisseur: bonCommande.fournisseur.code_fournisseur,
        nom: bonCommande.fournisseur.nom,
        compte_comptable: bonCommande.compte_fournisseur
      },
      
      date_facture: formData.date_facture,
      date_echeance: formData.date_echeance,
      date_reception_facture: formData.date_reception_facture,
      date_saisie: new Date().toISOString(),
      
      lignes: lignesFacture,
      
      montant_ht: montantTotalFacture,
      tva_details: [],
      montant_total_tva: 0,
      montant_ttc: montantTotalFacture,
      devise: bonCommande.devise,
      
      montant_paye: 0,
      montant_restant: montantTotalFacture,
      paiements: [],
      
      controle_3_voies: controle,
      
      statut: controle.conforme ? 'controlee' : 'ecart_detecte',
      
      fichier_facture_url: fichierFacture ? `/factures/${fichierFacture.name}` : undefined,
      fichiers_annexes: [],
      
      en_litige: false,
      
      saisie_par: 'Accountant',
      saisie_le: new Date().toISOString(),
      notes: formData.notes
    };
    
    onSave(facture);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 rounded-lg p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Saisir une Facture Fournisseur</h2>
              <p className="text-sm text-gray-600 mt-1">
                Pour le BC {bonCommande.numero_bc} • {bonCommande.fournisseur.nom}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Alerte écart */}
          {Math.abs(ecartGlobal) > 0.01 && (
            <div className={`mb-6 p-4 rounded-lg border-2 ${
              Math.abs(ecartGlobalPourcent) > 5 
                ? 'bg-red-50 border-red-300' 
                : 'bg-yellow-50 border-yellow-300'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`h-5 w-5 ${
                  Math.abs(ecartGlobalPourcent) > 5 ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <span className={`font-medium ${
                  Math.abs(ecartGlobalPourcent) > 5 ? 'text-red-900' : 'text-yellow-900'
                }`}>
                  Écart détecté : {ecartGlobal > 0 ? '+' : ''}{ecartGlobal.toFixed(2)} {bonCommande.devise} 
                  ({ecartGlobalPourcent > 0 ? '+' : ''}{ecartGlobalPourcent.toFixed(2)}%)
                </span>
              </div>
              <p className={`text-sm ${
                Math.abs(ecartGlobalPourcent) > 5 ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {Math.abs(ecartGlobalPourcent) > 5 
                  ? '⚠️ Écart important ! Validation CFO requise.'
                  : 'Écart modéré. Vérifiez les lignes avant validation.'
                }
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            {/* Colonne 1-2 : Formulaire */}
            <div className="col-span-2 space-y-6">
              {/* Informations facture */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">Informations facture</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Numéro facture fournisseur <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.numero_facture}
                      onChange={(e) => setFormData({ ...formData, numero_facture: e.target.value })}
                      placeholder="Ex: INV-2025-001"
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.numero_facture ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.numero_facture && (
                      <p className="text-xs text-red-600 mt-1">{errors.numero_facture}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date facture <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date_facture}
                      onChange={(e) => setFormData({ ...formData, date_facture: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.date_facture ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date échéance <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date_echeance}
                      onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
                      min={formData.date_facture}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.date_echeance ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.date_echeance && (
                      <p className="text-xs text-red-600 mt-1">{errors.date_echeance}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date réception
                    </label>
                    <input
                      type="date"
                      value={formData.date_reception_facture}
                      onChange={(e) => setFormData({ ...formData, date_reception_facture: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Upload facture */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">Fichier facture <span className="text-red-600">*</span></h3>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  errors.fichier ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}>
                  <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFichierFacture(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm text-blue-600 hover:underline">
                      Cliquer pour uploader
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, JPG ou PNG • Max 10MB
                    </p>
                  </label>
                  {fichierFacture && (
                    <div className="mt-3 p-2 bg-green-50 rounded inline-flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-900">{fichierFacture.name}</span>
                    </div>
                  )}
                  {errors.fichier && (
                    <p className="text-xs text-red-600 mt-2">{errors.fichier}</p>
                  )}
                </div>
              </div>

              {/* Lignes facture */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium">Lignes facture ({lignesFacture.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">#</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Désignation</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Qté fact.</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">P.U.</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Total</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Écart</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lignesFacture.map((ligne, index) => {
                        const hasEcart = (ligne.ecart_montant && Math.abs(ligne.ecart_montant) > 0.01);
                        return (
                          <tr key={ligne.id} className={`border-b border-gray-100 ${hasEcart ? 'bg-yellow-50' : ''}`}>
                            <td className="px-3 py-2">{ligne.numero_ligne}</td>
                            <td className="px-3 py-2 font-medium">{ligne.designation}</td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={ligne.quantite_facturee}
                                onChange={(e) => updateLigne(index, 'quantite_facturee', parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                                step="0.01"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={ligne.prix_unitaire}
                                onChange={(e) => updateLigne(index, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                                step="0.01"
                              />
                            </td>
                            <td className="px-3 py-2 text-right font-medium">
                              {ligne.montant_ttc.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {hasEcart ? (
                                <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                  {ligne.ecart_montant && ligne.ecart_montant > 0 ? '+' : ''}
                                  {ligne.ecart_montant?.toFixed(2)}
                                </Badge>
                              ) : (
                                <span className="text-green-600 text-xs">✓</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-blue-50 border-t-2 border-blue-200">
                        <td colSpan={4} className="px-3 py-2 text-right font-medium">
                          TOTAL {bonCommande.devise}
                        </td>
                        <td className="px-3 py-2 text-right text-lg font-bold text-blue-900">
                          {montantTotalFacture.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {Math.abs(ecartGlobal) > 0.01 && (
                            <Badge className={`text-xs ${
                              Math.abs(ecartGlobalPourcent) > 5 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {ecartGlobal > 0 ? '+' : ''}{ecartGlobal.toFixed(2)}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Remarques éventuelles..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Colonne 3 : BC de référence */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-3">BC de référence</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Numéro</p>
                    <p className="font-medium">{bonCommande.numero_bc}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fournisseur</p>
                    <p className="font-medium">{bonCommande.fournisseur.nom}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Montant BC</p>
                    <p className="font-medium text-blue-900">
                      {montantTotalBC.toFixed(2)} {bonCommande.devise}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Lignes</p>
                    <p className="font-medium">{bonCommande.lignes.length}</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleControle}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Contrôle 3 voies
              </Button>

              {controle3Voies && (
                <div className={`border-2 rounded-lg p-4 ${
                  controle3Voies.conforme 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-orange-50 border-orange-300'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {controle3Voies.conforme ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    )}
                    <span className={`font-medium ${
                      controle3Voies.conforme ? 'text-green-900' : 'text-orange-900'
                    }`}>
                      {controle3Voies.conforme ? 'Conforme' : 'Écarts détectés'}
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p>Taux conformité: <span className="font-bold">{controle3Voies.taux_conformite.toFixed(1)}%</span></p>
                    <p>Écarts: <span className="font-bold">{controle3Voies.ecarts_detectes.length}</span></p>
                    {controle3Voies.ecarts_detectes.length > 0 && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => setShowControle3Voies(true)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Voir détails
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            La facture sera créée avec statut "{controle3Voies?.conforme ? 'Contrôlée' : 'Écart détecté'}"
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </div>
      </div>

      {/* Modal détails contrôle 3 voies */}
      {showControle3Voies && controle3Voies && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Détails du contrôle 3 voies</h3>
            
            {controle3Voies.ecarts_detectes.map((ecart, index) => (
              <div key={index} className={`mb-3 p-3 rounded-lg border ${
                ecart.gravite === 'haute' ? 'bg-red-50 border-red-200' :
                ecart.gravite === 'moyenne' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{ecart.description}</span>
                  <Badge className={`text-xs ${
                    ecart.gravite === 'haute' ? 'bg-red-100 text-red-700' :
                    ecart.gravite === 'moyenne' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {ecart.gravite.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>Attendu: {ecart.valeur_attendue}</p>
                  <p>Facturé: {ecart.valeur_facturee}</p>
                  <p>Écart: {ecart.ecart} ({ecart.ecart_pourcent.toFixed(2)}%)</p>
                  {ecart.action_requise && (
                    <p className="text-orange-700 font-medium mt-2">→ {ecart.action_requise}</p>
                  )}
                </div>
              </div>
            ))}
            
            <Button onClick={() => setShowControle3Voies(false)} className="w-full mt-4">
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
