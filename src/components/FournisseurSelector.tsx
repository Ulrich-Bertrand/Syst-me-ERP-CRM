import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Building2, X } from 'lucide-react';
import { TN_Fournisseurs } from '../types/achats';

interface FournisseurSelectorProps {
  fournisseurs: TN_Fournisseurs[];
  selectedFournisseur?: string;
  onSelect: (fournisseur: TN_Fournisseurs) => void;
  error?: string;
}

export function FournisseurSelector({ 
  fournisseurs, 
  selectedFournisseur, 
  onSelect,
  error 
}: FournisseurSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Filtrer les fournisseurs selon la recherche
  const filteredFournisseurs = fournisseurs.filter(f => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      f.Nom_Fournisseur.toLowerCase().includes(query) ||
      f.Code_Fournisseur.toLowerCase().includes(query) ||
      f.Email?.toLowerCase().includes(query)
    );
  });

  // Trouver le fournisseur sélectionné
  const selected = fournisseurs.find(f => f.Code_Fournisseur === selectedFournisseur);

  const handleSelect = (fournisseur: TN_Fournisseurs) => {
    onSelect(fournisseur);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect({ Code_Fournisseur: '', Nom_Fournisseur: '', Compte_Comptable: '', Devise_Defaut: '', Actif: true });
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton de sélection */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left border rounded-lg flex items-center justify-between transition-colors ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        } ${isOpen ? 'ring-2 ring-blue-200 border-blue-500' : ''}`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selected ? (
            <>
              <Building2 className="h-4 w-4 text-gray-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selected.Nom_Fournisseur}</p>
                <p className="text-xs text-gray-500 truncate">
                  {selected.Code_Fournisseur} • {selected.Devise_Defaut}
                </p>
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-400">Sélectionner un fournisseur</span>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {selected && (
            <span
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              <X className="h-4 w-4 text-gray-400" />
            </span>
          )}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 flex flex-col">
          {/* Barre de recherche */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un fournisseur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {filteredFournisseurs.length} fournisseur{filteredFournisseurs.length > 1 ? 's' : ''} trouvé{filteredFournisseurs.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Liste des fournisseurs */}
          <div className="overflow-y-auto flex-1">
            {filteredFournisseurs.length > 0 ? (
              <div className="p-2">
                {filteredFournisseurs.map((fournisseur) => {
                  const isSelected = fournisseur.Code_Fournisseur === selectedFournisseur;
                  return (
                    <button
                      key={fournisseur.Code_Fournisseur}
                      type="button"
                      onClick={() => handleSelect(fournisseur)}
                      className={`w-full px-3 py-2.5 text-left rounded-lg transition-colors mb-1 ${
                        isSelected 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          isSelected ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Building2 className={`h-4 w-4 ${
                            isSelected ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-medium truncate ${
                              isSelected ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {fournisseur.Nom_Fournisseur}
                            </p>
                            {isSelected && (
                              <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">
                              {fournisseur.Code_Fournisseur}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs font-medium text-blue-600">
                              {fournisseur.Devise_Defaut}
                            </span>
                          </div>
                          {fournisseur.Email && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {fournisseur.Email}
                            </p>
                          )}
                          {fournisseur.Telephone && (
                            <p className="text-xs text-gray-500 truncate">
                              {fournisseur.Telephone}
                            </p>
                          )}
                          {fournisseur.Conditions_Paiement && (
                            <p className="text-xs text-gray-400 mt-1">
                              Paiement: {fournisseur.Conditions_Paiement}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Aucun fournisseur trouvé</p>
                <p className="text-xs text-gray-400 mt-1">
                  Essayez une autre recherche
                </p>
              </div>
            )}
          </div>

          {/* Footer avec total */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600">
              <span className="font-medium">{fournisseurs.length}</span> fournisseur{fournisseurs.length > 1 ? 's' : ''} actif{fournisseurs.length > 1 ? 's' : ''} au total
            </p>
          </div>
        </div>
      )}
    </div>
  );
}