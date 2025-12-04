"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogIn, Mail, Lock, Building2, Globe, Loader2, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const AGENCES = [
  { value: 'GHANA', label: 'JOCYDERK LOGISTICS LTD GHANA', flag: '🇬🇭' },
  { value: 'COTE_IVOIRE', label: 'Jocyderk Côte d\'Ivoire', flag: '🇨🇮' },
  { value: 'BURKINA', label: 'Jocyderk Burkina Faso', flag: '🇧🇫' }
];

const LANGUES = [
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'en', label: 'English', flag: '🇬🇧' }
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agence: 'GHANA',
    langue: 'fr'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  // Gestion changement champs
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError(''); // Effacer erreur
  };

  // Soumission formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Email et mot de passe requis');
      return;
    }

    setLoading(true);

    try {
      await login(formData);
      // Redirection gérée par AuthContext
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  // Loading initial
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Card principale */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Building2 className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">JOCYDERK ERP/CRM</h1>
            <p className="text-center text-blue-100 mt-2">
              Système de gestion intégré
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Erreur de connexion</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                {/* <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="votre.email@exemple.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                {/* <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full pl-16 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Agence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agence
              </label>
              <div className="relative">
                {/* <Building2 className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                <select
                  value={formData.agence}
                  onChange={(e) => handleChange('agence', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white"
                  disabled={loading}
                >
                  {AGENCES.map(agence => (
                    <option key={agence.value} value={agence.value}>
                      {agence.flag} {agence.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Langue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue
              </label>
              <div className="relative">
                {/* <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                <select
                  value={formData.langue}
                  onChange={(e) => handleChange('langue', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white"
                  disabled={loading}
                >
                  {LANGUES.map(langue => (
                    <option key={langue.value} value={langue.value}>
                      {langue.flag} {langue.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bouton connexion */}
            <Button
              type="submit"
              className="w-full py-3 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Se connecter
                </>
              )}
            </Button>

            {/* Lien mot de passe oublié */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                onClick={() => alert('Fonctionnalité bientôt disponible')}
              >
                Mot de passe oublié ?
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              © 2025 JOCYDERK Group. Tous droits réservés.
            </p>
          </div>
        </div>

        {/* Aide */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Besoin d'aide ? Contactez l'administrateur système
          </p>
        </div>

        {/* Info dev */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs font-medium text-yellow-900 mb-2">
              Mode développement - Compte test :
            </p>
            <p className="text-xs text-yellow-700">
              Email: <span className="font-mono">consultantic@jocyderklogistics.com</span>
            </p>
            <p className="text-xs text-yellow-700">
              Password: <span className="font-mono">password123</span>
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}
