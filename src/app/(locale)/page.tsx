"use client"
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}
