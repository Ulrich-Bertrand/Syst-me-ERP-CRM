'use client';


import { useState } from 'react';
import { 
  TrendingUp, TrendingDown, FileText, CheckCircle, 
  Clock, AlertTriangle, DollarSign, Package, BarChart3,
  Calendar, Download, Filter, Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApi } from '../hooks/useApi';
import { formaterMontant, formaterPourcentage, formaterDuree } from '../types/reporting';
import { reportingApi } from '@/services/api/reporting.api';

export function DashboardAchats() {
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState('mois');
  
  // Calculer dates selon période
  const getDatesFromPeriode = (periode: string) => {
    const fin = new Date();
    const debut = new Date();
    
    switch(periode) {
      case 'semaine':
        debut.setDate(debut.getDate() - 7);
        break;
      case 'mois':
        debut.setMonth(debut.getMonth() - 1);
        break;
      case 'trimestre':
        debut.setMonth(debut.getMonth() - 3);
        break;
      case 'annee':
        debut.setFullYear(debut.getFullYear() - 1);
        break;
    }
    
    return {
      periode_debut: debut.toISOString().split('T')[0],
      periode_fin: fin.toISOString().split('T')[0]
    };
  };
  
  // Charger dashboard depuis API
  const { data: dashboardData, loading, error, refetch } = useApi(
    () => reportingApi.getDashboard(getDatesFromPeriode(periodeSelectionnee))
  );

  console.log(dashboardData, "......essay");
  
  
  // Recharger quand période change
  const handlePeriodeChange = (nouvellePeriode: string) => {
    setPeriodeSelectionnee(nouvellePeriode);
    refetch();
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Erreur de chargement</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const dashboard = dashboardData?.data;
  if (!dashboard) return null;
  
  const kpis = dashboard.kpis_globaux;

  // Cartes KPI
  const kpiCards = [
    {
      title: 'Demandes d\'achat',
      value: kpis.nombre_da_total,
      subtitle: `${kpis.nombre_da_validees} validées`,
      icon: FileText,
      color: 'blue',
      trend: {
        value: dashboard.comparaisons.vs_periode_precedente.variations.nombre_da.variation_pourcent,
        positive: true
      }
    },
    {
      title: 'Bons de commande',
      value: kpis.nombre_bc_total,
      subtitle: `${kpis.nombre_bc_livres} livrés`,
      icon: CheckCircle,
      color: 'green',
      trend: null
    },
    {
      title: 'Montant achats',
      value: formaterMontant(kpis.montant_total_bc, kpis.devise_reference, 0),
      subtitle: `Taux paiement: ${formaterPourcentage(kpis.taux_paiement)}`,
      icon: DollarSign,
      color: 'purple',
      trend: {
        value: dashboard.comparaisons.vs_periode_precedente.variations.montant_achats.variation_pourcent,
        positive: true
      }
    },
    {
      title: 'Délai moyen cycle',
      value: `${kpis.delai_moyen_cycle_complet}j`,
      subtitle: 'Objectif: 15 jours',
      icon: Clock,
      color: 'orange',
      trend: {
        value: dashboard.comparaisons.vs_periode_precedente.variations.delai_moyen.variation_pourcent,
        positive: false
      }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard Achats</h1>
          <p className="text-sm text-gray-600 mt-1">
            Période: {new Date(dashboard.periode.debut).toLocaleDateString('fr-FR')} - {new Date(dashboard.periode.fin).toLocaleDateString('fr-FR')}
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={periodeSelectionnee}
            onChange={(e) => handlePeriodeChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="semaine">Cette semaine</option>
            <option value="mois">Ce mois</option>
            <option value="trimestre">Ce trimestre</option>
            <option value="annee">Cette année</option>
          </select>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg bg-${kpi.color}-100`}>
                  <Icon className={`h-6 w-6 text-${kpi.color}-600`} />
                </div>
                {kpi.trend && (
                  <div className={`flex items-center gap-1 text-xs ${
                    (kpi.trend.positive && kpi.trend.value > 0) || (!kpi.trend.positive && kpi.trend.value < 0)
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {((kpi.trend.positive && kpi.trend.value > 0) || (!kpi.trend.positive && kpi.trend.value < 0)) ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(kpi.trend.value).toFixed(1)}%
                  </div>
                )}
              </div>
              <h3 className="text-sm text-gray-600 mb-1">{kpi.title}</h3>
              <p className="text-2xl font-bold mb-1">{kpi.value}</p>
              <p className="text-xs text-gray-500">{kpi.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-2 gap-6">
        {/* Évolution des achats */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Évolution des achats</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {dashboard.graphiques.evolution_achats.periodes.slice(-4).map((periode, index) => {
              const daCount = dashboard.graphiques.evolution_achats.series.demandes_achat.slice(-4)[index];
              const bcCount = dashboard.graphiques.evolution_achats.series.bons_commande.slice(-4)[index];
              const montant = dashboard.graphiques.evolution_achats.series.montants.slice(-4)[index];
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-600">{periode}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(daCount / 3) * 100}%`, minWidth: daCount > 0 ? '8px' : '0' }} />
                      <span className="text-xs text-gray-500">{daCount} DA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: `${(bcCount / 3) * 100}%`, minWidth: bcCount > 0 ? '8px' : '0' }} />
                      <span className="text-xs text-gray-500">{bcCount} BC</span>
                    </div>
                  </div>
                  <div className="w-28 text-right text-sm font-medium">
                    {montant > 0 ? `${montant.toFixed(0)} GHS` : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Répartition par catégories */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Répartition par catégories</h2>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {dashboard.graphiques.repartition_categories.categories.map((cat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{cat.nom}</span>
                  <span className="text-sm font-medium">{cat.pourcentage.toFixed(1)}%</span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${cat.pourcentage}%`,
                      backgroundColor: cat.couleur
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{cat.nombre_achats} achat(s)</span>
                  <span className="text-xs text-gray-700">{cat.montant.toFixed(0)} GHS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top fournisseurs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold mb-4">Top fournisseurs</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Fournisseur</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Commandes</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Montant total</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Montant moyen</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600">Performance</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.graphiques.top_fournisseurs.fournisseurs.map((fournisseur, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{fournisseur.nom}</p>
                      <p className="text-xs text-gray-500">{fournisseur.code}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{fournisseur.nombre_commandes}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {fournisseur.montant_total.toFixed(2)} GHS
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {fournisseur.montant_moyen.toFixed(2)} GHS
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={`text-xs ${
                      fournisseur.note_performance >= 8.5 ? 'bg-green-100 text-green-700' :
                      fournisseur.note_performance >= 7.0 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {fournisseur.note_performance.toFixed(1)}/10
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Délais moyens */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold mb-4">Délais moyens par étape</h2>
        
        <div className="space-y-4">
          {dashboard.graphiques.delais_moyens.etapes.map((etape, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{etape.nom}</span>
                    {etape.conforme ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Min: {etape.delai_min}j • Max: {etape.delai_max}j
                    {etape.objectif && ` • Objectif: ${etape.objectif}j`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{etape.delai_moyen}j</p>
                  <p className="text-xs text-gray-500">moyen</p>
                </div>
              </div>
              
              {etape.objectif && (
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      etape.conforme ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{
                      width: `${Math.min((etape.delai_moyen / etape.objectif) * 100, 100)}%`
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Budget vs Consommé */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold mb-4">Budget par catégorie</h2>
        
        <div className="space-y-4">
          {dashboard.comparaisons.vs_budget.par_categorie.map((cat, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{cat.categorie}</span>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {cat.consomme.toFixed(0)} / {cat.budget.toFixed(0)} GHS
                  </p>
                  <p className={`text-xs ${
                    cat.taux_consommation > 80 ? 'text-orange-600' :
                    cat.taux_consommation > 50 ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {cat.taux_consommation.toFixed(1)}% consommé
                  </p>
                </div>
              </div>
              
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    cat.depassement ? 'bg-red-500' :
                    cat.taux_consommation > 80 ? 'bg-orange-500' :
                    cat.taux_consommation > 50 ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(cat.taux_consommation, 100)}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Budget total</p>
              <p className="text-2xl font-bold">
                {dashboard.comparaisons.vs_budget.budget_total.toFixed(0)} GHS
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Consommé</p>
              <p className="text-2xl font-bold text-blue-600">
                {dashboard.comparaisons.vs_budget.consomme.toFixed(0)} GHS
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Restant</p>
              <p className="text-2xl font-bold text-green-600">
                {dashboard.comparaisons.vs_budget.restant.toFixed(0)} GHS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes et actions */}
      <div className="grid grid-cols-2 gap-6">
        {/* Factures impayées */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Factures impayées</h2>
            <Badge className="bg-orange-100 text-orange-700">
              {dashboard.tableaux.factures_impayees.length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {dashboard.tableaux.factures_impayees.map((facture, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{facture.numero_facture}</span>
                  <span className="text-sm font-bold text-orange-700">
                    {facture.montant_restant.toFixed(2)} {facture.devise}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{facture.fournisseur}</span>
                  <span>Échéance: {new Date(facture.date_echeance).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes stock */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Alertes stock</h2>
            <Badge className="bg-red-100 text-red-700">
              {dashboard.tableaux.alertes_stock.length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {dashboard.tableaux.alertes_stock.map((alerte, index) => (
              <div key={index} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">{alerte.article_nom}</span>
                </div>
                <div className="text-xs text-gray-700">
                  Stock: {alerte.stock_actuel} / {alerte.stock_minimum} {alerte.unite}
                </div>
                <div className="text-xs text-red-700 mt-1">
                  → {alerte.action_recommandee}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}