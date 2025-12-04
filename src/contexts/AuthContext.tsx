"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';
import { useRouter } from 'next/navigation';

// Types
interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  agence: string;
  telephone?: string;
  is_admin: boolean;
  active: boolean;
  
  // Profils Achats
  profile_purchases_create?: boolean;
  profile_purchases_validate_level_1?: boolean;
  profile_purchases_validate_level_2?: boolean;
  profile_purchases_validate_level_3?: boolean;
  profile_purchases_manage_po?: boolean;
  profile_purchases_manage_invoices?: boolean;
  profile_purchases_manage_payments?: boolean;
  
  // Profils Stock
  profile_stock_manage?: boolean;
  profile_stock_view?: boolean;
  
  // Autres profils
  profile_dossiers_manage?: boolean;
  profile_cotations_manage?: boolean;
  profile_finance_view?: boolean;
  
  last_login?: string;
  created_at?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  agence: string;
  langue: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  agence: string;
  langue: string;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changeAgence: (newAgence: string) => void;
  changeLangue: (newLangue: string) => void;
  isAuthenticated: boolean;
  hasProfile: (profile: string) => boolean;
  hasAnyProfile: (profiles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const AGENCE_KEY = 'user_agence';
const LANGUE_KEY = 'user_langue';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [agence, setAgence] = useState<string>('GHANA');
  const [langue, setLangue] = useState<string>('fr');
  const [loading, setLoading] = useState(true);

  // Charger données depuis localStorage au démarrage
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);
        const storedAgence = localStorage.getItem(AGENCE_KEY);
        const storedLangue = localStorage.getItem(LANGUE_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }else {
          router.push("/")
        }

        if (storedAgence) {
          setAgence(storedAgence);
        }

        if (storedLangue) {
          setLangue(storedLangue);
        }
      } catch (error) {
        console.error('Erreur chargement auth:', error);
        // Nettoyer si données corrompues
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Configurer axios avec token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  /**
   * Login
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: credentials.email,
        password: credentials.password
      });

      const { user: userData, token: authToken } = response.data;

      // Sauvegarder token + user
      setToken(authToken);
      setUser(userData);
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Sauvegarder agence + langue sélectionnées
      setAgence(credentials.agence);
      setLangue(credentials.langue);
      localStorage.setItem(AGENCE_KEY, credentials.agence);
      localStorage.setItem(LANGUE_KEY, credentials.langue);

      // Rediriger vers dashboard
      // router.push('/');
    } catch (error: any) {
      console.error('Erreur login:', error);
      throw new Error(
        error.response?.data?.error || 
        'Erreur lors de la connexion. Vérifiez vos identifiants.'
      );
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Nettoyer localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(AGENCE_KEY);
    localStorage.removeItem(LANGUE_KEY);

    // Rediriger vers login
    router.push('/', {scroll: true});
  };

  /**
   * Mettre à jour profil
   */
  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('Non authentifié');

    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, data);
      const updatedUser = response.data.data;

      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 
        'Erreur lors de la mise à jour du profil'
      );
    }
  };

  /**
   * Changer agence (sans déconnexion)
   */
  const changeAgence = (newAgence: string) => {
    setAgence(newAgence);
    localStorage.setItem(AGENCE_KEY, newAgence);
  };

  /**
   * Changer langue
   */
  const changeLangue = (newLangue: string) => {
    setLangue(newLangue);
    localStorage.setItem(LANGUE_KEY, newLangue);
  };

  /**
   * Vérifier si user a un profil
   */
  const hasProfile = (profile: string): boolean => {
    if (!user) return false;
    return !!(user as any)[profile];
  };

  /**
   * Vérifier si user a AU MOINS UN des profils
   */
  const hasAnyProfile = (profiles: string[]): boolean => {
    if (!user) return false;
    return profiles.some(profile => (user as any)[profile]);
  };

  const value: AuthContextType = {
    user,
    token,
    agence,
    langue,
    loading,
    login,
    logout,
    updateProfile,
    changeAgence,
    changeLangue,
    isAuthenticated: !!user && !!token,
    hasProfile,
    hasAnyProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook useAuth
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
}