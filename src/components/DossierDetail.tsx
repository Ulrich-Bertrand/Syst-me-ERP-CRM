import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, FileText, Package, TrendingUp, DollarSign, MapPin, Calendar, Activity } from 'lucide-react';
import { dossiers, dossierTypes, cotations, achats, documents, operations, factures, evenements, coutsAnalytiques, trackingPoints } from '../lib/mockData';
import { Badge } from './ui/badge';

interface DossierDetailProps {
  dossierId: string;
  onBack: () => void;
}

export function DossierDetail({ dossierId, onBack }: DossierDetailProps) {
  const dossier = dossiers.find(d => d.id === dossierId);
  const type = dossier ? dossierTypes.find(t => t.id === dossier.typeId) : null;
  const [activeTab, setActiveTab] = useState('overview');

  if (!dossier || !type) {
    return <div>Dossier non trouvé</div>;
  }

  const dossierCotations = cotations.filter(c => c.dossierId === dossierId);
  const dossierAchats = achats.filter(a => a.dossierId === dossierId);
  const dossierDocuments = documents.filter(d => d.dossierId === dossierId);
  const dossierOperations = operations.filter(o => o.dossierId === dossierId);
  const dossierFactures = factures.filter(f => f.dossierId === dossierId);
  const dossierEvenements = evenements.filter(e => e.dossierId === dossierId);
  const dossierCouts = coutsAnalytiques.filter(c => c.dossierId === dossierId);
  const dossierTracking = trackingPoints.filter(t => t.dossierId === dossierId);

  const totalCouts = dossierCouts.reduce((sum, c) => sum + c.montant, 0);
  const totalVentes = dossierFactures.reduce((sum, f) => sum + f.montantHT, 0);
  const marge = totalVentes - totalCouts;
  const margePct = totalVentes > 0 ? ((marge / totalVentes) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2>{dossier.numero}</h2>
            <Badge variant="outline">{type.code}</Badge>
          </div>
          <p className="text-muted-foreground">{dossier.titre}</p>
        </div>
        <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${
          dossier.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
          dossier.statut === 'termine' ? 'bg-green-100 text-green-800' :
          dossier.statut === 'ouvert' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {dossier.statut.replace('_', ' ')}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{dossier.client}</div>
            <p className="text-xs text-muted-foreground mt-1">Responsable: {dossier.responsable}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Dates</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">Ouvert: {new Date(dossier.dateOuverture).toLocaleDateString('fr-FR')}</div>
            {dossier.dateCloture && (
              <p className="text-xs text-muted-foreground mt-1">Clôturé: {new Date(dossier.dateCloture).toLocaleDateString('fr-FR')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Coûts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div>{totalCouts.toLocaleString('fr-FR')} €</div>
            <p className="text-xs text-muted-foreground mt-1">{dossierCouts.length} ligne(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Marge</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={marge >= 0 ? 'text-green-600' : 'text-red-600'}>
              {marge.toLocaleString('fr-FR')} € ({margePct}%)
            </div>
            <p className="text-xs text-muted-foreground mt-1">CA: {totalVentes.toLocaleString('fr-FR')} €</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="operations">Opérations</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="analytique">Analytique</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Type de dossier</p>
                  <p>{type.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mode de transport</p>
                  <p className="capitalize">{type.transportMode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sens trafic</p>
                  <p className="capitalize">{type.trafficDirection}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Référence client</p>
                  <p>{dossier.reference || '-'}</p>
                </div>
                {dossier.metadata && Object.entries(dossier.metadata).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p>{String(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Événements récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dossierEvenements.slice(0, 5).map((evt) => (
                  <div key={evt.id} className="flex gap-3">
                    <Activity className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">{evt.titre}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(evt.date).toLocaleString('fr-FR')} - {evt.utilisateur}
                      </p>
                      {evt.description && (
                        <p className="text-xs text-muted-foreground mt-1">{evt.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan opérationnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {type.planOperationnel.map((step) => {
                  const operation = dossierOperations.find(o => o.stepId === step.id);
                  return (
                    <div key={step.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        operation?.statut === 'terminee' ? 'bg-green-100 text-green-800' :
                        operation?.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {step.ordre}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {step.obligatoire && <Badge variant="outline" className="mr-2 text-xs">Obligatoire</Badge>}
                          Durée estimée: {step.dureeEstimee}h
                        </p>
                        {operation && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Responsable: {operation.responsable}
                            {operation.commentaire && ` - ${operation.commentaire}`}
                          </p>
                        )}
                      </div>
                      <div className={`px-3 py-1 rounded text-xs ${
                        operation?.statut === 'terminee' ? 'bg-green-100 text-green-800' :
                        operation?.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {operation?.statut || 'planifiee'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cotations</CardTitle>
              <Button size="sm">Nouvelle cotation</Button>
            </CardHeader>
            <CardContent>
              {dossierCotations.length > 0 ? (
                <div className="space-y-4">
                  {dossierCotations.map((cot) => (
                    <div key={cot.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{cot.numero}</p>
                          <p className="text-sm text-muted-foreground">Date: {new Date(cot.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{cot.montantHT.toLocaleString('fr-FR')} € HT</p>
                          <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs mt-1 ${
                            cot.statut === 'acceptee' ? 'bg-green-100 text-green-800' :
                            cot.statut === 'envoyee' ? 'bg-blue-100 text-blue-800' :
                            cot.statut === 'refusee' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {cot.statut}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        {cot.lignes.map((ligne) => (
                          <div key={ligne.id} className="flex justify-between text-muted-foreground">
                            <span>{ligne.description}</span>
                            <span>{ligne.total.toLocaleString('fr-FR')} €</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune cotation</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Factures</CardTitle>
              <Button size="sm">Nouvelle facture</Button>
            </CardHeader>
            <CardContent>
              {dossierFactures.length > 0 ? (
                <div className="space-y-4">
                  {dossierFactures.map((fact) => (
                    <div key={fact.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{fact.numero}</p>
                          <p className="text-sm text-muted-foreground">
                            Date: {new Date(fact.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Échéance: {new Date(fact.dateEcheance).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{fact.montantTTC.toLocaleString('fr-FR')} € TTC</p>
                          <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs mt-1 ${
                            fact.statut === 'payee' ? 'bg-green-100 text-green-800' :
                            fact.statut === 'envoyee' ? 'bg-blue-100 text-blue-800' :
                            fact.statut === 'emise' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {fact.statut}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune facture</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Achats</CardTitle>
              <Button size="sm">Nouvel achat</Button>
            </CardHeader>
            <CardContent>
              {dossierAchats.length > 0 ? (
                <div className="space-y-4">
                  {dossierAchats.map((achat) => (
                    <div key={achat.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{achat.numero}</p>
                        <p className="text-sm text-muted-foreground">{achat.fournisseur}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(achat.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{achat.montantHT.toLocaleString('fr-FR')} € HT</p>
                        <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs mt-1 ${
                          achat.statut === 'payee' ? 'bg-green-100 text-green-800' :
                          achat.statut === 'recue' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {achat.statut}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun achat</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documents</CardTitle>
              <Button size="sm">Ajouter document</Button>
            </CardHeader>
            <CardContent>
              {dossierDocuments.length > 0 ? (
                <div className="space-y-3">
                  {dossierDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.numero}</p>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{doc.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun document</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytique" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Coûts totaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalCouts.toLocaleString('fr-FR')} €</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ventes totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalVentes.toLocaleString('fr-FR')} €</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Marge nette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl ${marge >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marge.toLocaleString('fr-FR')} € ({margePct}%)
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ventilation des coûts</CardTitle>
            </CardHeader>
            <CardContent>
              {dossierCouts.length > 0 ? (
                <div className="space-y-3">
                  {dossierCouts.map((cout) => (
                    <div key={cout.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{cout.categorie}</p>
                        <p className="text-sm text-muted-foreground">{cout.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(cout.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="font-medium">{cout.montant.toLocaleString('fr-FR')} €</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun coût enregistré</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suivi du dossier</CardTitle>
            </CardHeader>
            <CardContent>
              {dossierTracking.length > 0 ? (
                <div className="space-y-4">
                  {dossierTracking.map((point, index) => (
                    <div key={point.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        {index < dossierTracking.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{point.localisation}</p>
                            <p className="text-sm text-muted-foreground">{point.statut}</p>
                            {point.commentaire && (
                              <p className="text-sm text-muted-foreground mt-1">{point.commentaire}</p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(point.date).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun point de tracking</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
