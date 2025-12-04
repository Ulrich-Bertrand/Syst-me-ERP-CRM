"use client"
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Users,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronRight,
  Building2,
  TruckIcon,
  BarChart3,
  Folder,
  Calculator,
  Warehouse,
  UserCog,
  Bell,
  UserX
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href?: string;
  children?: MenuItem[];
  badge?: string;
  requiredProfile?: string;
  requiredAnyProfile?: string[];
}

export function Sidebar() {
  const router = useRouter();
  const { hasProfile, hasAnyProfile } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['achats']);
  const pathname = usePathname()
  const basepath = `/dashboard`


  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      href: '/dashboard'
    },
    {
      id: 'dossiers',
      label: 'Dossiers',
      icon: Folder,
      children: [
        { id: 'dossiers-liste', label: 'Liste des dossiers', icon: Folder, href: '/dossiers' },
        { id: 'dossiers-nouveau', label: 'Nouveau dossier', icon: Folder, href: '/dossiers/nouveau' }
      ]
    },
    {
      id: 'achats',
      label: 'Achats',
      icon: ShoppingCart,
      href: `${basepath}/achats`,
      children: [
        {
          id: 'achats-dashboard',
          label: 'Dashboard Achats',
          icon: BarChart3,
          href: `${basepath}/achats`,
        },
        {
          id: 'achats-demandes',
          label: 'Demandes d\'achat',
          icon: FileText,
          href: `${basepath}/achats/demandes`,
          badge: '12',
          requiredProfile: 'profile_purchases_create'
        },
        // { 
        //   id: 'achats-validations', 
        //   label: 'Validations', 
        //   icon: ChevronRight, 
        //   href: '/achats/validations',
        //   badge: '5',
        //   requiredAnyProfile: [
        //     'profile_purchases_validate_level_1',
        //     'profile_purchases_validate_level_2',
        //     'profile_purchases_validate_level_3'
        //   ]
        // },
        {
          id: 'achats-bons-commande',
          label: 'Bons de commande',
          icon: FileText,
          href: `${basepath}/achats/bons-commande`,
          requiredProfile: 'profile_purchases_manage_po'
        },
        {
          id: 'achats/creanciers',
          label: 'Créanciers / Fournisseurs',
          icon: UserX,
          href: `${basepath}/achats/creanciers`,
          requiredProfile: 'profile_purchases_create'
        },
        {
          id: 'achats-receptions',
          label: 'Réceptions',
          icon: Package,
          href: '/achats/receptions',
          requiredProfile: 'profile_purchases_manage_po'
        },
        {
          id: 'achats-factures',
          label: 'Factures fournisseurs',
          icon: FileText,
          href: '/achats/factures',
          requiredProfile: 'profile_purchases_manage_invoices'
        },
        {
          id: 'achats-paiements',
          label: 'Paiements',
          icon: DollarSign,
          href: '/achats/paiements',
          requiredProfile: 'profile_purchases_manage_payments'
        }
      ]
    },
    {
      id: 'stock',
      label: 'Stock',
      href: `${basepath}/stock`,
      icon: Warehouse,
      children: [
        {
          id: 'stock-dashboard',
          label: 'Dashboard Stock',
          icon: BarChart3,
          href: `${basepath}/stock`,
        },
        {
          id: 'stock-articles',
          label: 'Articles',
          icon: Package,
          href: `${basepath}/stock/articles`
        },
        {
          id: 'stock-mouvements',
          label: 'Mouvements',
          icon: TruckIcon,
          href: `${basepath}/stock/mouvements`
        },
        {
          id: 'stock-inventaires',
          label: 'Inventaires',
          icon: Calculator,
          href: `${basepath}/stock/inventaire`
        },
        {
          id: 'stock-alertes',
          label: 'Alertes',
          icon: Bell,
          href: `${basepath}/stock/alertes`,
          badge: '7'
        }
      ]
    },
    {
      id: 'ventes',
      label: 'Ventes',
      icon: DollarSign,
      children: [
        { id: 'ventes-cotations', label: 'Cotations', icon: FileText, href: '/ventes/cotations' },
        { id: 'ventes-factures', label: 'Factures clients', icon: FileText, href: '/ventes/factures' }
      ]
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: Calculator,
      children: [
        { id: 'finance-comptabilite', label: 'Comptabilité', icon: Calculator, href: '/finance/comptabilite' },
        { id: 'finance-tresorerie', label: 'Trésorerie', icon: DollarSign, href: '/finance/tresorerie' }
      ]
    },
    {
      id: 'tiers',
      label: 'Tiers',
      icon: Users,
      children: [
        { id: 'tiers-clients', label: 'Clients', icon: Users, href: '/tiers/clients' },
        { id: 'tiers-fournisseurs', label: 'Fournisseurs', icon: Building2, href: '/tiers/fournisseurs' }
      ]
    },
    {
      id: 'parametres',
      label: 'Paramètres',
      icon: Settings,
      children: [
        { id: 'parametres-general', label: 'Général', icon: Settings, href: '/parametres/general' },
        { id: 'parametres-users', label: 'Utilisateurs', icon: UserCog, href: '/parametres/users' }
      ]
    }
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const canViewMenuItem = (item: MenuItem): boolean => {
    if (item.requiredProfile && !hasProfile(item.requiredProfile)) {
      return false;
    }
    if (item.requiredAnyProfile && !hasAnyProfile(item.requiredAnyProfile)) {
      return false;
    }
    return true;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    // Vérifier permissions
    if (!canViewMenuItem(item)) {
      return null;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const active = isActive(item.href);

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            type='button'
            onClick={() => toggleMenu(item.id)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition ${active
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
            style={{ paddingLeft: `${1 + level}rem` }}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        type='button'
        onClick={() => item.href && router.push(item.href)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition ${active
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
          }`}
        style={{ paddingLeft: `${1.5 + level}rem` }}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">JOCYDERK</h1>
            <p className="text-xs text-gray-500">ERP/CRM</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2025 JOCYDERK Group
        </div>
      </div>
    </aside>
  );
}
