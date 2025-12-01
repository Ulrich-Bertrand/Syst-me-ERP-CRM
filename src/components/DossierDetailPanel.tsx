import { X, FileText, Package, DollarSign, Calendar, User, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dossier } from '../types';
import { dossierTypes, cotations, achats, documents, operations, factures, coutsAnalytiques, trackingPoints } from '../lib/mockData';

interface DossierDetailPanelProps {
  dossier: Dossier;
  onClose: () => void;
}

export function DossierDetailPanel({ dossier, onClose }: DossierDetailPanelProps) {
  const type = dossierTypes.find(t => t.id === dossier.typeId);
  const dossierCotations = cotations.filter(c => c.dossierId === dossier.id);
  const dossierAchats = achats.filter(a => a.dossierId === dossier.id);
  const dossierDocuments = documents.filter(d => d.dossierId === dossier.id);
  const dossierOperations = operations.filter(o => o.dossierId === dossier.id);
  const dossierFactures = factures.filter(f => f.dossierId === dossier.id);
  const dossierCouts = coutsAnalytiques.filter(c => c.dossierId === dossier.id);
  const dossierTracking = trackingPoints.filter(t => t.dossierId === dossier.id);

  const totalCouts = dossierCouts.reduce((sum, c) => sum + c.montant, 0);
  const totalVentes = dossierFactures.reduce((sum, f) => sum + f.montantHT, 0);
  const marge = totalVentes - totalCouts;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl">{dossier.numero}</h2>
              <Badge variant="outline">{type?.code}</Badge>
            </div>
            <p className="text-sm text-gray-600">{dossier.titre}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={
            dossier.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
            dossier.statut === 'termine' ? 'bg-green-100 text-green-700' :
            'bg-yellow-100 text-yellow-700'
          }>
            {dossier.statut.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-600">Client</span>
          </div>
          <p className="text-sm">{dossier.client}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-600">Responsable</span>
          </div>
          <p className="text-sm">{dossier.responsable}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-600">Date ouverture</span>
          </div>
          <p className="text-sm">{new Date(dossier.dateOuverture).toLocaleDateString('fr-FR')}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-600">Route</span>
          </div>
          <p className="text-sm text-xs">{dossier.metadata?.origine} → {dossier.metadata?.destination}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-600">Coûts</span>
          </div>
          <p className="text-sm">{totalCouts.toLocaleString('fr-FR')} €</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-600">Marge</span>
          </div>
          <p className={`text-sm ${marge >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {marge.toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <TabsList className="px-6 border-b border-gray-200 justify-start rounded-none bg-white">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="operations">Opérations</TabsTrigger>
            <TabsTrigger value="commercial">Commercial</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="financier">Financier</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="overview" className="p-6 m-0">
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm mb-4">Informations générales</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Type de dossier</p>
                      <p className="text-sm">{type?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Mode de transport</p>
                      <p className="text-sm capitalize">{type?.transportMode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Sens trafic</p>
                      <p className="text-sm capitalize">{type?.trafficDirection}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Référence client</p>
                      <p className="text-sm">{dossier.reference || '-'}</p>
                    </div>
                    {dossier.metadata && Object.entries(dossier.metadata).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs text-gray-600 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-sm">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm mb-4">Activité récente</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <div className="flex-1">
                        <p className="text-sm">Dossier ouvert</p>
                        <p className="text-xs text-gray-600">{new Date(dossier.dateOuverture).toLocaleString('fr-FR')} - {dossier.responsable}</p>
                      </div>
                    </div>
                    {dossierDocuments.length > 0 && (
                      <div className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                        <div className="flex-1">
                          <p className="text-sm">Documents ajoutés</p>
                          <p className="text-xs text-gray-600">{dossierDocuments.length} document(s)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="operations" className="p-6 m-0">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm mb-4">Plan opérationnel</h3>
                <div className="space-y-3">
                  {type?.planOperationnel.map((step) => {
                    const operation = dossierOperations.find(o => o.stepId === step.id);
                    return (
                      <div key={step.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                          operation?.statut === 'terminee' ? 'bg-green-100 text-green-700' :
                          operation?.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {step.ordre}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{step.label}</p>
                          <p className="text-xs text-gray-600">
                            {step.obligatoire && <Badge variant="outline" className="mr-2 text-xs">Obligatoire</Badge>}
                            Durée: {step.dureeEstimee}h
                          </p>
                        </div>
                        <Badge className={`text-xs ${
                          operation?.statut === 'terminee' ? 'bg-green-100 text-green-700' :
                          operation?.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {operation?.statut || 'planifiee'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="commercial" className="p-6 m-0">
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm">Cotations</h3>
                    <Button size="sm">Nouvelle cotation</Button>
                  </div>
                  {dossierCotations.length > 0 ? (
                    <div className="space-y-3">
                      {dossierCotations.map((cot) => (
                        <div key={cot.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm">{cot.numero}</p>
                              <p className="text-xs text-gray-600">{new Date(cot.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">{cot.montantHT.toLocaleString('fr-FR')} € HT</p>
                              <Badge className={`text-xs mt-1 ${
                                cot.statut === 'acceptee' ? 'bg-green-100 text-green-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {cot.statut}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Aucune cotation</p>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm">Factures</h3>
                    <Button size="sm">Nouvelle facture</Button>
                  </div>
                  {dossierFactures.length > 0 ? (
                    <div className="space-y-3">
                      {dossierFactures.map((fact) => (
                        <div key={fact.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm">{fact.numero}</p>
                              <p className="text-xs text-gray-600">Échéance: {new Date(fact.dateEcheance).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">{fact.montantTTC.toLocaleString('fr-FR')} € TTC</p>
                              <Badge className="text-xs mt-1 bg-green-100 text-green-700">{fact.statut}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Aucune facture</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="p-6 m-0">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm">Documents</h3>
                  <Button size="sm">Ajouter document</Button>
                </div>
                {dossierDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {dossierDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm">{doc.numero}</p>
                            <p className="text-xs text-gray-600">{doc.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Aucun document</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="financier" className="p-6 m-0">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-xs text-gray-600 mb-2">Coûts totaux</h4>
                  <p className="text-xl">{totalCouts.toLocaleString('fr-FR')} €</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-xs text-gray-600 mb-2">Ventes totales</h4>
                  <p className="text-xl">{totalVentes.toLocaleString('fr-FR')} €</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-xs text-gray-600 mb-2">Marge nette</h4>
                  <p className={`text-xl ${marge >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {marge.toLocaleString('fr-FR')} €
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm mb-4">Ventilation des coûts</h3>
                {dossierCouts.length > 0 ? (
                  <div className="space-y-3">
                    {dossierCouts.map((cout) => (
                      <div key={cout.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm">{cout.categorie}</p>
                          <p className="text-xs text-gray-600">{cout.description}</p>
                        </div>
                        <p className="text-sm">{cout.montant.toLocaleString('fr-FR')} €</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Aucun coût enregistré</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tracking" className="p-6 m-0">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm mb-4">Suivi du dossier</h3>
                {dossierTracking.length > 0 ? (
                  <div className="space-y-4">
                    {dossierTracking.map((point, index) => (
                      <div key={point.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          {index < dossierTracking.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm">{point.localisation}</p>
                              <p className="text-xs text-gray-600">{point.statut}</p>
                              {point.commentaire && (
                                <p className="text-xs text-gray-500 mt-1">{point.commentaire}</p>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">
                              {new Date(point.date).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Aucun point de tracking</p>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
