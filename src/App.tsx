import { useState } from "react";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ModernSidebar } from "./components/ModernSidebar";
import { UserHeader } from "./components/UserHeader";
import { ApiModeIndicator } from "./components/ApiModeIndicator";
import { Toaster } from "sonner@2.0.3";
import { LogistiqueTransitView } from "./components/views/LogistiqueTransitView";
import { ShippingView } from "./components/views/ShippingView";
import { ConsignationView } from "./components/views/ConsignationView";
import { TruckingView } from "./components/views/TruckingView";
import { AutresActivitesView } from "./components/views/AutresActivitesView";
import { CRMView } from "./components/views/CRMView";
import { QuotesProformaView } from "./components/views/QuotesProformaView";
import { DebiteursView } from "./components/views/DebiteursView";
import { CreanciersView } from "./components/views/CreanciersView";
import { AchatsView } from "./components/views/AchatsViewNew";
import { BonsCommandeView } from "./components/views/BonsCommandeView";
import { PlanComptableView } from "./components/views/PlanComptableView";
import { FacturationView } from "./components/views/FacturationView";
import { TresorerieView } from "./components/views/TresorerieView";
import { ComptabiliteView } from "./components/views/ComptabiliteView";
import { StockView } from "./components/views/StockView";
import { DashboardView } from "./components/views/DashboardView";

export type ModuleView =
  | "dashboard"
  | "commercial-crm"
  | "cotations-proforma"
  | "operations-dossiers"
  | "operations-logistique"
  | "operations-shipping"
  | "operations-consignation"
  | "operations-trucking"
  | "operations-autres"
  | "achats"
  | "achats-demandes"
  | "achats-commandes"
  | "bons-commande"
  | "facturation-ventes"
  | "stock"
  | "stock-inventaire"
  | "stock-mouvements"
  | "tresorerie-codes"
  | "tresorerie-caisse"
  | "tresorerie-banque"
  | "tresorerie-caisses"
  | "comptabilite-generale"
  | "comptabilite-analytique"
  | "plan-comptable"
  | "debiteurs"
  | "creanciers"
  | "controle-gestion"
  | "administration"
  | "reporting"
  | "maintenance";

export default function App() {
  const [currentView, setCurrentView] =
    useState<ModuleView>("achats");
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);
  const [currentAgency, setCurrentAgency] = useState("gh");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "commercial-crm":
        return <CRMView viewType={currentView} />;
      case "cotations-proforma":
        return <QuotesProformaView />;
      case "operations-dossiers":
      case "operations-logistique":
        return <LogistiqueTransitView />;
      case "operations-shipping":
        return <ShippingView />;
      case "operations-consignation":
        return <ConsignationView />;
      case "operations-trucking":
        return <TruckingView />;
      case "operations-autres":
        return <AutresActivitesView />;
      case "achats":
      case "achats-demandes":
        return <AchatsView viewType={currentView} />;
      case "bons-commande":
      case "achats-commandes":
        return <BonsCommandeView />;
      case "facturation-ventes":
        return <FacturationView viewType={currentView} />;
      case "stock":
      case "stock-inventaire":
      case "stock-mouvements":
        return <StockView viewType={currentView} />;
      case "tresorerie-caisses":
      case "tresorerie-codes":
      case "tresorerie-caisse":
      case "tresorerie-banque":
        return <TresorerieView viewType={currentView} />;
      case "comptabilite-analytique":
        return <ComptabiliteView viewType={currentView} />;
      case "plan-comptable":
        return <PlanComptableView />;
      case "debiteurs":
        return <DebiteursView />;
      case "creanciers":
        return <CreanciersView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="flex h-screen bg-gray-50">
          <ModernSidebar
            currentView={currentView}
            onViewChange={setCurrentView}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() =>
              setSidebarCollapsed(!sidebarCollapsed)
            }
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <UserHeader
              currentAgency={currentAgency}
              onAgencyChange={setCurrentAgency}
            />
            <main className="flex-1 overflow-hidden">
              {renderView()}
            </main>
          </div>
          
          {/* Indicateur de mode API/Mock */}
          <ApiModeIndicator />
          
          {/* Toaster pour les notifications */}
          <Toaster position="top-right" richColors />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}