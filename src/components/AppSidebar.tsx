import { Home, FolderOpen, Settings, Package, FileText, TrendingUp } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { View } from '../App';

interface AppSidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Tableau de bord', view: 'dashboard' as View },
    { icon: FolderOpen, label: 'Dossiers', view: 'dossiers' as View },
    { icon: Settings, label: 'Configuration', view: 'configuration' as View },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.view)}
                    isActive={currentView === item.view}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
