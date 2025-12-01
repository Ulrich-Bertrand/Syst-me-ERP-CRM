import { 
  LayoutDashboard, FileText, TrendingUp, Briefcase, Users, Calculator,
  Warehouse, DollarSign, Wallet, BookOpen, UserCheck, UserX, BarChart3,
  Settings, LineChart, Wrench, FolderOpen, Ship, Package, ShoppingCart,
  Receipt, CreditCard, Building2, PieChart, FileSpreadsheet, ClipboardList,
  ChevronLeft, ChevronRight, FileCheck, Target, HandshakeIcon, Contact,
  Anchor, Plane, Truck, Container, List
} from 'lucide-react';
import { ModuleView } from '../App';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ModernSidebarProps {
  currentView: ModuleView;
  onViewChange: (view: ModuleView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  id: ModuleView;
  labelKey: string;
  icon: any;
  children?: MenuItem[];
}

const getMenuStructure = (): MenuItem[] => [
  {
    id: 'dashboard',
    labelKey: 'module.dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'commercial-crm',
    labelKey: 'module.crm',
    icon: TrendingUp,
    children: [
      { id: 'commercial-crm', labelKey: 'module.crm', icon: Users },
      { id: 'cotations-proforma', labelKey: 'module.sales.quotes', icon: FileText },
    ]
  },
  {
    id: 'operations-dossiers',
    labelKey: 'module.operations',
    icon: Ship,
    children: [
      { id: 'operations-logistique', labelKey: 'module.logistics', icon: Container },
      { id: 'operations-shipping', labelKey: 'module.shipping', icon: Ship },
      { id: 'operations-consignation', labelKey: 'module.consignment', icon: Anchor },
      { id: 'operations-trucking', labelKey: 'module.trucking', icon: Truck },
      { id: 'operations-autres', labelKey: 'module.other', icon: Package },
    ]
  },
  {
    id: 'achats',
    labelKey: 'module.purchases',
    icon: ShoppingCart,
    children: [
      { id: 'achats', labelKey: 'module.purchases.requests', icon: FileCheck },
      { id: 'bons-commande', labelKey: 'module.purchases.orders', icon: ClipboardList },
      { id: 'creanciers', labelKey: 'module.purchases.creditors', icon: UserX },
    ]
  },
  {
    id: 'facturation-ventes',
    labelKey: 'module.sales',
    icon: DollarSign,
    children: [
      { id: 'facturation-ventes', labelKey: 'module.sales.invoicing', icon: Receipt },
      { id: 'debiteurs', labelKey: 'module.sales.debtors', icon: UserCheck },
    ]
  },
  {
    id: 'stock',
    labelKey: 'module.stock',
    icon: Warehouse,
    children: [
      { id: 'stock-inventaire', labelKey: 'module.stock.inventory', icon: Package },
      { id: 'stock-mouvements', labelKey: 'module.stock.movements', icon: TrendingUp },
    ]
  },
  {
    id: 'tresorerie-caisses',
    labelKey: 'module.accounting.treasury',
    icon: Wallet,
    children: [
      { id: 'tresorerie-codes', labelKey: 'module.accounting.treasury', icon: List },
      { id: 'tresorerie-caisse', labelKey: 'module.accounting.treasury', icon: Wallet },
      { id: 'tresorerie-banque', labelKey: 'module.accounting.treasury', icon: Building2 },
    ]
  },
  {
    id: 'comptabilite-generale',
    labelKey: 'module.accounting',
    icon: BookOpen,
    children: [
      { id: 'comptabilite-generale', labelKey: 'module.accounting.general', icon: Calculator },
      { id: 'comptabilite-analytique', labelKey: 'module.accounting', icon: PieChart },
      { id: 'plan-comptable', labelKey: 'module.accounting.plan', icon: BookOpen },
      { id: 'debiteurs', labelKey: 'module.sales.debtors', icon: UserCheck },
      { id: 'creanciers', labelKey: 'module.purchases.creditors', icon: UserX },
    ]
  },
  {
    id: 'controle-gestion',
    labelKey: 'module.reports',
    icon: BarChart3,
  },
  {
    id: 'administration',
    labelKey: 'module.config',
    icon: Settings,
  },
];

export function ModernSidebar({ currentView, onViewChange, collapsed, onToggleCollapse }: ModernSidebarProps) {
  const { t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<Set<ModuleView>>(new Set());
  const menuStructure = getMenuStructure();

  const toggleExpand = (id: ModuleView) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const Icon = item.icon;
    const isExpanded = expandedItems.has(item.id);
    const isActive = currentView === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            }
            onViewChange(item.id);
          }}
          className={`
            w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all
            ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}
            ${level > 0 ? 'ml-4 text-sm' : ''}
          `}
          style={{ paddingLeft: collapsed ? '1rem' : `${level * 0.75 + 1}rem` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`} />
            {!collapsed && (
              <span className="truncate">{t(item.labelKey)}</span>
            )}
          </div>
          {!collapsed && hasChildren && (
            <ChevronRight 
              className={`h-4 w-4 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
        </button>
        {!collapsed && hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">ERP Jocyderk</h1>
              <p className="text-xs text-gray-500">Logistics</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuStructure.map(item => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="h-5 w-5 flex-shrink-0 text-gray-600" />
          {!collapsed && <span>{t('module.config')}</span>}
        </button>
      </div>
    </div>
  );
}
