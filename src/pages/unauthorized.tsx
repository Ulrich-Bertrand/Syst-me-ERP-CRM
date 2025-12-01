import { useRouter } from 'next/router';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Icon */}
          <div className="bg-gradient-to-r from-red-600 to-orange-700 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <ShieldAlert className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">Accès refusé</h1>
            <p className="text-center text-red-100 mt-2">
              Vous n'avez pas les permissions nécessaires
            </p>
          </div>

          {/* Contenu */}
          <div className="p-8 space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                Cette page nécessite des permissions spécifiques que votre compte ne possède pas.
              </p>
            </div>

            {user && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Connecté en tant que :
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-xs text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Agence : {user.agence}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la page précédente
              </Button>

              <Button
                onClick={() => router.push('/')}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Besoin de ces permissions ?
              </p>
              <p className="text-xs text-gray-500">
                Contactez votre administrateur système pour demander les accès nécessaires.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-700 hover:underline w-full text-center"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
