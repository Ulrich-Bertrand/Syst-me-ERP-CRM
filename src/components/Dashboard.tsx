import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { FolderOpen, FileText, TrendingUp, DollarSign, Package, AlertCircle } from 'lucide-react';
import { dossiers, cotations, factures } from '../lib/mockData';
import { Button } from './ui/button';

interface DashboardProps {
  onNavigateToDossiers: () => void;
}

export function Dashboard({ onNavigateToDossiers }: DashboardProps) {
  const dossiersActifs = dossiers.filter(d => d.statut === 'en_cours' || d.statut === 'ouvert').length;
  const totalCotations = cotations.length;
  const totalFactures = factures.reduce((sum, f) => sum + f.montantHT, 0);
  const dossiersEnAttente = dossiers.filter(d => d.statut === 'brouillon').length;

  return (
    <div className="space-y-6">
      <div>
        <h2>Tableau de bord</h2>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Dossiers actifs</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{dossiersActifs}</div>
            <p className="text-xs text-muted-foreground">En cours de traitement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Cotations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalCotations}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Chiffre d'affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalFactures.toLocaleString('fr-FR')} €</div>
            <p className="text-xs text-muted-foreground">Facturé ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>En attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{dossiersEnAttente}</div>
            <p className="text-xs text-muted-foreground">Dossiers à valider</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Dossiers récents</CardTitle>
            <CardDescription>Derniers dossiers ouverts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dossiers.slice(0, 5).map((dossier) => (
                <div key={dossier.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{dossier.numero}</p>
                    <p className="text-sm text-muted-foreground">{dossier.titre}</p>
                    <p className="text-xs text-muted-foreground">{dossier.client}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                      dossier.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                      dossier.statut === 'termine' ? 'bg-green-100 text-green-800' :
                      dossier.statut === 'ouvert' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {dossier.statut}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{dossier.responsable}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button onClick={onNavigateToDossiers} variant="outline" className="w-full">
                Voir tous les dossiers
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes</CardTitle>
            <CardDescription>Points d'attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">2 dossiers en attente de validation douane</p>
                  <p className="text-xs text-muted-foreground">Depuis plus de 24h</p>
                </div>
              </div>
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">1 cotation expire bientôt</p>
                  <p className="text-xs text-muted-foreground">Dans 3 jours</p>
                </div>
              </div>
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">Documents manquants</p>
                  <p className="text-xs text-muted-foreground">Dossier MI-2025-00001</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
