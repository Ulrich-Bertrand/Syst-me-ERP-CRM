/**
 * COMPOSANT: ApiModeIndicator
 * 
 * Affiche un badge indiquant si l'application est en mode MOCK ou API réel
 */

import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Server, Database } from 'lucide-react';
import { isUsingMockMode } from '../services/api/config';

export function ApiModeIndicator() {
  const [isMock, setIsMock] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Vérifier le mode au montage
    const checkMode = () => {
      setIsMock(isUsingMockMode());
    };

    checkMode();

    // Vérifier toutes les 5 secondes
    const interval = setInterval(checkMode, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden">
      <Badge 
        variant={isMock ? "secondary" : "default"}
        className="flex items-center gap-2 px-3 py-2 cursor-pointer shadow-lg"
        onClick={() => setIsVisible(false)}
      >
        {isMock ? (
          <>
            <Server className="w-4 h-4" />
            <span>Mode MOCK</span>
          </>
        ) : (
          <>
            <Database className="w-4 h-4" />
            <span>API Connectée</span>
          </>
        )}
      </Badge>
      
      {isMock && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg shadow-lg text-xs">
          <p className="text-amber-800 mb-1">
            ⚠️ Backend non disponible
          </p>
          <p className="text-amber-700">
            Les données sont simulées
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="mt-2 text-amber-600 hover:text-amber-800 underline text-xs"
          >
            Masquer
          </button>
        </div>
      )}
    </div>
  );
}
