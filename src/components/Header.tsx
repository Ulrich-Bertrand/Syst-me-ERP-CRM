import { useState } from 'react';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { AgenceLangueSwitcher } from './AgenceLangueSwitcher';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Recherche globale */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dossiers, clients, documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-4 ml-6">
        {/* Switcher Agence + Langue */}
        <AgenceLangueSwitcher />

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Menu utilisateur */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs text-gray-500">{user?.agence}</p>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />

              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push('/profile');
                  }}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition text-left"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Mon profil</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // TODO: Ouvrir paramètres
                  }}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition text-left"
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Paramètres</span>
                </button>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-red-50 transition text-left text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Déconnexion</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}