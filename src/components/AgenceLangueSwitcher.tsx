"use client"


import { useState } from 'react';
import { Building2, Globe, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AGENCES = [
  { value: 'GHANA', label: 'Ghana', fullLabel: 'JOCYDERK LOGISTICS LTD GHANA', flag: '🇬🇭', color: 'text-green-600' },
  { value: 'COTE_IVOIRE', label: 'Côte d\'Ivoire', fullLabel: 'Jocyderk Côte d\'Ivoire', flag: '🇨🇮', color: 'text-orange-600' },
  { value: 'BURKINA', label: 'Burkina Faso', fullLabel: 'Jocyderk Burkina Faso', flag: '🇧🇫', color: 'text-red-600' }
];

const LANGUES = [
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'en', label: 'English', flag: '🇬🇧' }
];

export function AgenceLangueSwitcher() {
  const { agence, langue, changeAgence, changeLangue } = useAuth();
  const [showAgenceMenu, setShowAgenceMenu] = useState(false);
  const [showLangueMenu, setShowLangueMenu] = useState(false);

  const agenceActuelle = AGENCES.find(a => a.value === agence);
  const langueActuelle = LANGUES.find(l => l.value === langue);

  return (
    <div className="flex items-center gap-3">
      {/* Sélecteur Agence */}
      <div className="relative">
        <button
          onClick={() => {
            setShowAgenceMenu(!showAgenceMenu);
            setShowLangueMenu(false);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition"
        >
          <Building2 className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">
            {agenceActuelle?.flag} {agenceActuelle?.label}
          </span>
        </button>

        {showAgenceMenu && (
          <>
            {/* Overlay pour fermer */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowAgenceMenu(false)}
            />

            {/* Menu dropdown */}
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Changer d'agence
                </p>
              </div>

              {AGENCES.map((ag) => (
                <button
                  key={ag.value}
                  onClick={() => {
                    changeAgence(ag.value);
                    setShowAgenceMenu(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition ${
                    agence === ag.value ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ag.flag}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {ag.label}
                      </p>
                      <p className="text-xs text-gray-500">{ag.fullLabel}</p>
                    </div>
                  </div>
                  {agence === ag.value && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </button>
              ))}

              <div className="px-4 py-2 border-t border-gray-100 mt-2">
                <p className="text-xs text-gray-500">
                  Les données affichées seront filtrées selon l'agence sélectionnée
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sélecteur Langue */}
      <div className="relative">
        <button
          onClick={() => {
            setShowLangueMenu(!showLangueMenu);
            setShowAgenceMenu(false);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition"
        >
          <Globe className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">
            {langueActuelle?.flag}
          </span>
        </button>

        {showLangueMenu && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowLangueMenu(false)}
            />

            {/* Menu dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Langue
                </p>
              </div>

              {LANGUES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    changeLangue(lang.value);
                    setShowLangueMenu(false);
                  }}
                  className={`w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition ${
                    langue === lang.value ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {lang.label}
                    </span>
                  </div>
                  {langue === lang.value && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
