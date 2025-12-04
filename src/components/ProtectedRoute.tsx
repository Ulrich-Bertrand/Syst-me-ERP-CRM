import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredProfile?: string;
  requiredAnyProfile?: string[];
  requiredAllProfiles?: string[];
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requiredProfile,
  requiredAnyProfile,
  requiredAllProfiles,
  requireAdmin
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading, user, hasProfile, hasAnyProfile } = useAuth();

  useEffect(() => {
    // Ne rien faire pendant le chargement initial
    if (loading) return;

    // Rediriger vers login si pas authentifié
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Vérifier profil unique requis
    if (requiredProfile && !hasProfile(requiredProfile)) {
      router.push('/unauthorized');
      return;
    }

    // Vérifier AU MOINS UN profil requis
    if (requiredAnyProfile && !hasAnyProfile(requiredAnyProfile)) {
      router.push('/unauthorized');
      return;
    }

    // Vérifier TOUS les profils requis
    if (requiredAllProfiles) {
      const hasAll = requiredAllProfiles.every(profile => hasProfile(profile));
      if (!hasAll) {
        router.push('/unauthorized');
        return;
      }
    }

    // Vérifier admin
    if (requireAdmin && !user?.is_admin) {
      router.push('/unauthorized');
      return;
    }
  }, [
    loading, 
    isAuthenticated, 
    user, 
    requiredProfile, 
    requiredAnyProfile, 
    requiredAllProfiles,
    requireAdmin,
    router,
    hasProfile,
    hasAnyProfile
  ]);

  // Afficher loader pendant vérification
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
