import apiClient from './config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  agence: 'GHANA' | 'COTE_IVOIRE' | 'BURKINA';
  telephone?: string;
  is_admin: boolean;
  active: boolean;
  profile_purchases_create: boolean;
  profile_purchases_validate_level_1: boolean;
  profile_purchases_validate_level_2: boolean;
  profile_purchases_validate_level_3: boolean;
  profile_purchases_manage_po: boolean;
  profile_purchases_manage_invoices: boolean;
  profile_purchases_manage_payments: boolean;
  profile_stock_manage: boolean;
  profile_stock_view: boolean;
  profile_dossiers_manage: boolean;
  profile_cotations_manage: boolean;
  profile_finance_view: boolean;
  last_login?: string;
  created_at?: string;
}

export interface UpdateProfileRequest {
  nom?: string;
  prenom?: string;
  telephone?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/**
 * Service API Authentification
 */
class AuthApiService {
  /**
   * Connexion
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  }

  /**
   * Obtenir profil utilisateur connecté
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  }

  /**
   * Mettre à jour profil
   */
  async updateProfile(data: UpdateProfileRequest): Promise<{ message: string; data: User }> {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  }

  /**
   * Changer mot de passe
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  }
}

export const authApi = new AuthApiService();
