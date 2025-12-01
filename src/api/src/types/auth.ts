import { Request } from 'express';

export interface UserProfiles {
  profile_purchases_create: boolean;
  profile_purchases_validate_level_1: boolean;
  profile_purchases_validate_level_2: boolean;
  profile_purchases_validate_level_3: boolean;
  profile_purchases_payment: boolean;
  profile_stock_manage: boolean;
  profile_invoices_validate: boolean;
  profile_reporting_view: boolean;
}

export interface UserPayload {
  userId: string;
  email: string;
  name: string;
  agence: 'GHANA' | 'COTE_IVOIRE' | 'BURKINA';
  profiles: UserProfiles;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
