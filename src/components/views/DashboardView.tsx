import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FolderOpen, FileText, TrendingUp, DollarSign, Package, AlertCircle, Ship, Plane, Truck } from 'lucide-react';
import { dossiers, cotations, factures } from '../../lib/mockData';

export function DashboardView() {
  const dossiersActifs = dossiers.filter(d => d.statut === 'en_cours' || d.statut === 'ouvert').length;
  const totalCotations = cotations.length;
  const totalFactures = factures.reduce((sum, f) => sum + f.montantHT, 0);
  const dossiersEnAttente = dossiers.filter(d => d.statut === 'brouillon').length;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <h2 className="text-lg">Dashboard</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Dossiers actifs</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{dossiersActifs}</div>
                <p className="text-xs text-muted-foreground">En cours de traitement</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Cotations</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalCotations}</div>
                <p className="text-xs text-muted-foreground">Ce mois-ci</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Chiffre d'affaires</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalFactures.toLocaleString('fr-FR')} €</div>
                <p className="text-xs text-muted-foreground">Facturé ce mois</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">En attente</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{dossiersEnAttente}</div>
                <p className="text-xs text-muted-foreground">Dossiers à valider</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm">Activité par mode de transport</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Ship className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">Maritime</span>
                    </div>
                    <span className="text-sm">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Plane className="h-5 w-5 text-sky-600" />
                      <span className="text-sm">Aérien</span>
                    </div>
                    <span className="text-sm">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-orange-600" />
                      <span className="text-sm">Routier</span>
                    </div>
                    <span className="text-sm">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm">Alertes & Notifications</CardTitle>
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
      </div>
    </div>
  );
}
