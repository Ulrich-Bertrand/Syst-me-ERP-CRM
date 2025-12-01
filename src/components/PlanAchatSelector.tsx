import { useState } from 'react';
import { FileText, Import, X, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PlanAchat, LignePlanAchat, LigneAchatForm } from '../types/achats';
import { mockPlansAchats, TYPES_DOSSIERS_DISPONIBLES, MODES_TRANSPORT_DISPONIBLES } from '../data/mockPlansAchats';

interface PlanAchatSelectorProps {
  onImport: (lignes: LigneAchatForm[]) => void;
  typeDossier?: string;
  modeTransport?: string;
}

export function PlanAchatSelector({ onImport, typeDossier, modeTransport }: PlanAchatSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanAchat | null>(null);
  const [selectedLignes, setSelectedLignes] = useState<Set<string>>(new Set());
  const [quantites, setQuantites] = useState<Record<string, number>>({});

  // Filtrer les plans selon le type de dossier et mode de transport
  const availablePlans = mockPlansAchats.filter(plan => {
    if (!plan.actif) return false;
    if (typeDossier && plan.type_dossier !== typeDossier) return false;
    if (modeTransport && plan.mode_transport && plan.mode_transport !== modeTransport) return false;
    return true;
  });

  const handleSelectPlan = (plan: PlanAchat) => {
    setSelectedPlan(plan);
    // Sélectionner toutes les lignes obligatoires par défaut
    const obligatoires = new Set(
      plan.lignes.filter(l => l.obligatoire).map(l => l.id)
    );
    setSelectedLignes(obligatoires);
    
    // Initialiser les quantités à 1
    const initialQuantites: Record<string, number> = {};
    plan.lignes.forEach(ligne => {
      initialQuantites[ligne.id] = 1;
    });
    setQuantites(initialQuantites);
  };

  const toggleLigne = (ligneId: string, obligatoire: boolean) => {
    if (obligatoire) return; // Ne pas permettre de décocher les lignes obligatoires
    
    const newSelected = new Set(selectedLignes);
    if (newSelected.has(ligneId)) {
      newSelected.delete(ligneId);
    } else {
      newSelected.add(ligneId);
    }
    setSelectedLignes(newSelected);
  };

  const updateQuantite = (ligneId: string, quantite: number) => {
    setQuantites({
      ...quantites,
      [ligneId]: Math.max(1, quantite)
    });
  };

  const handleImport = () => {
    if (!selectedPlan) return;

    const lignesAImporter: LigneAchatForm[] = [];

    selectedPlan.lignes
      .filter(ligne => selectedLignes.has(ligne.id))
      .forEach(ligne => {
        const quantite = quantites[ligne.id] || 1;
        let prixUnitaire = 0;
        
        // Calculer le prix unitaire selon le type de calcul
        switch (ligne.type_calcul) {
          case 'fixe':
            prixUnitaire = ligne.montant_fixe || 0;
            break;
          case 'quantite_x_taux':
            prixUnitaire = ligne.taux_unitaire || 0;
            break;
          case 'pourcentage':
            // Pour les pourcentages, on met 0 car ça sera calculé après
            prixUnitaire = 0;
            break;
          default:
            prixUnitaire = 0;
        }

        lignesAImporter.push({
          id: `ligne-${Date.now()}-${Math.random()}`,
          designation: `${ligne.designation} (${ligne.code_ligne})`,
          quantite: ligne.type_calcul === 'fixe' ? 1 : quantite,
          prix_unitaire: prixUnitaire,
          montant_ligne: prixUnitaire * (ligne.type_calcul === 'fixe' ? 1 : quantite),
          rubrique_achat: ligne.rubrique_achat,
          compte_comptable: ligne.compte_comptable
        });
      });

    onImport(lignesAImporter);
    setIsOpen(false);
    setSelectedPlan(null);
    setSelectedLignes(new Set());
    setQuantites({});
  };

  const calculatePreviewTotal = () => {
    if (!selectedPlan) return 0;
    
    return selectedPlan.lignes
      .filter(ligne => selectedLignes.has(ligne.id))
      .reduce((total, ligne) => {
        const quantite = quantites[ligne.id] || 1;
        let montant = 0;
        
        if (ligne.type_calcul === 'fixe') {
          montant = ligne.montant_fixe || 0;
        } else if (ligne.type_calcul === 'quantite_x_taux') {
          montant = (ligne.taux_unitaire || 0) * quantite;
        }
        
        return total + montant;
      }, 0);
  };

  if (availablePlans.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 text-gray-500">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="text-sm font-medium">Aucun plan d'achat disponible</p>
            <p className="text-xs mt-1">
              {typeDossier 
                ? `Aucun plan configuré pour le type "${typeDossier}"` 
                : 'Sélectionnez un type de dossier pour voir les plans disponibles'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <Import className="h-4 w-4 mr-2" />
        Importer depuis un plan d'achat ({availablePlans.length} disponible{availablePlans.length > 1 ? 's' : ''})
      </Button>

      {/* Modal de sélection */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold">Importer depuis un plan d'achat</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Sélectionnez un plan et choisissez les lignes à importer
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!selectedPlan ? (
                // Liste des plans disponibles
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    {availablePlans.length} plan{availablePlans.length > 1 ? 's' : ''} d'achat disponible{availablePlans.length > 1 ? 's' : ''}
                  </p>
                  {availablePlans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{plan.designation}</p>
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              {plan.code_plan}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Type: {TYPES_DOSSIERS_DISPONIBLES.find(t => t.code === plan.type_dossier)?.label || plan.type_dossier}
                            {plan.mode_transport && (
                              <> • Mode: {MODES_TRANSPORT_DISPONIBLES.find(m => m.code === plan.mode_transport)?.label || plan.mode_transport}</>
                            )}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {plan.lignes.length} ligne{plan.lignes.length > 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {plan.lignes.filter(l => l.obligatoire).length} obligatoire{plan.lignes.filter(l => l.obligatoire).length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                // Détail du plan sélectionné
                <div>
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">{selectedPlan.designation}</p>
                        <p className="text-sm text-blue-700 mt-1">
                          {selectedPlan.lignes.length} ligne{selectedPlan.lignes.length > 1 ? 's' : ''} disponible{selectedPlan.lignes.length > 1 ? 's' : ''} • 
                          {' '}{selectedLignes.size} sélectionnée{selectedLignes.size > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPlan(null);
                          setSelectedLignes(new Set());
                        }}
                      >
                        Changer de plan
                      </Button>
                    </div>
                  </div>

                  {/* Liste des lignes */}
                  <div className="space-y-2">
                    {selectedPlan.lignes.map(ligne => {
                      const isSelected = selectedLignes.has(ligne.id);
                      const quantite = quantites[ligne.id] || 1;

                      return (
                        <div
                          key={ligne.id}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white'
                          } ${ligne.obligatoire ? 'opacity-100' : 'opacity-90'}`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleLigne(ligne.id, ligne.obligatoire)}
                              disabled={ligne.obligatoire}
                              className="mt-1 rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{ligne.designation}</p>
                                    <Badge className="bg-gray-100 text-gray-700 text-xs">
                                      {ligne.code_ligne}
                                    </Badge>
                                    {ligne.obligatoire && (
                                      <Badge className="bg-orange-100 text-orange-700 text-xs">
                                        Obligatoire
                                      </Badge>
                                    )}
                                  </div>
                                  {ligne.rubrique_achat && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Rubrique: {ligne.rubrique_achat}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Type de calcul</label>
                                  <p className="text-sm font-medium capitalize">
                                    {ligne.type_calcul.replace('_', ' ')}
                                  </p>
                                </div>

                                {ligne.type_calcul === 'quantite_x_taux' && isSelected && (
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Quantité</label>
                                    <input
                                      type="number"
                                      min="1"
                                      step="1"
                                      value={quantite}
                                      onChange={(e) => updateQuantite(ligne.id, parseInt(e.target.value) || 1)}
                                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                )}

                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">
                                    {ligne.type_calcul === 'fixe' ? 'Montant fixe' : 
                                     ligne.type_calcul === 'quantite_x_taux' ? 'Taux unitaire' :
                                     ligne.type_calcul === 'pourcentage' ? 'Pourcentage' : 'Montant'}
                                  </label>
                                  <p className="text-sm font-medium">
                                    {ligne.type_calcul === 'fixe' && ligne.montant_fixe?.toFixed(2)}
                                    {ligne.type_calcul === 'quantite_x_taux' && ligne.taux_unitaire?.toFixed(2)}
                                    {ligne.type_calcul === 'pourcentage' && `${ligne.pourcentage}%`}
                                  </p>
                                </div>

                                {ligne.type_calcul === 'quantite_x_taux' && isSelected && (
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Montant calculé</label>
                                    <p className="text-sm font-bold text-blue-900">
                                      {((ligne.taux_unitaire || 0) * quantite).toFixed(2)}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {ligne.fournisseur_suggere && (
                                <div className="mt-2 text-xs text-gray-500">
                                  💡 Fournisseur suggéré: {ligne.fournisseur_suggere}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Preview total */}
                  {selectedLignes.size > 0 && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-700">
                            {selectedLignes.size} ligne{selectedLignes.size > 1 ? 's' : ''} sera{selectedLignes.size > 1 ? 'ont' : ''} importée{selectedLignes.size > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            (Montants fixes + quantité × taux uniquement)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-600">Estimation</p>
                          <p className="text-xl font-bold text-green-900">
                            {calculatePreviewTotal().toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {selectedPlan && (
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPlan(null);
                    setSelectedLignes(new Set());
                  }}
                >
                  Retour
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={selectedLignes.size === 0}
                >
                  <Import className="h-4 w-4 mr-2" />
                  Importer {selectedLignes.size} ligne{selectedLignes.size > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
