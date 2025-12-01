import { Request, Response, NextFunction } from 'express';

/**
 * Vérifier si l'utilisateur a un profil spécifique
 */
export const requireProfile = (profileField: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    if (!req.user[profileField]) {
      return res.status(403).json({
        success: false,
        error: 'Permissions insuffisantes',
        required: profileField
      });
    }

    next();
  };
};

/**
 * Vérifier si l'utilisateur a AU MOINS UN des profils
 */
export const requireAnyProfile = (profileFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    const hasAnyProfile = profileFields.some(field => req.user[field]);

    if (!hasAnyProfile) {
      return res.status(403).json({
        success: false,
        error: 'Permissions insuffisantes',
        required_one_of: profileFields
      });
    }

    next();
  };
};

/**
 * Vérifier si l'utilisateur a TOUS les profils
 */
export const requireAllProfiles = (profileFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    const hasAllProfiles = profileFields.every(field => req.user[field]);

    if (!hasAllProfiles) {
      return res.status(403).json({
        success: false,
        error: 'Permissions insuffisantes',
        required_all: profileFields
      });
    }

    next();
  };
};

/**
 * Permissions spécifiques module Achats
 */
export const purchasesPermissions = {
  // Créer demande d'achat
  canCreateDA: requireProfile('profile_purchases_create_da'),

  // Valider niveau 1 (Purchasing Manager)
  canValidateLevel1: requireProfile('profile_purchases_validate_level_1'),

  // Valider niveau 2 (CFO)
  canValidateLevel2: requireProfile('profile_purchases_validate_level_2'),

  // Valider niveau 3 (General Manager)
  canValidateLevel3: requireProfile('profile_purchases_validate_level_3'),

  // Peut valider AU MOINS un niveau
  canValidateAny: requireAnyProfile([
    'profile_purchases_validate_level_1',
    'profile_purchases_validate_level_2',
    'profile_purchases_validate_level_3'
  ]),

  // Gérer bons de commande
  canManageBC: requireProfile('profile_purchases_manage_po'),

  // Gérer factures
  canManageInvoices: requireProfile('profile_purchases_manage_invoices'),

  // Gérer paiements
  canManagePayments: requireProfile('profile_purchases_manage_payments'),

  // Gérer stock
  canManageStock: requireProfile('profile_stock_manage')
};

/**
 * Vérifier agence
 */
export const requireAgency = (allowedAgencies: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    if (!allowedAgencies.includes(req.user.agence)) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé pour cette agence',
        user_agency: req.user.agence,
        allowed_agencies: allowedAgencies
      });
    }

    next();
  };
};

/**
 * Vérifier si admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentification requise'
    });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({
      success: false,
      error: 'Droits administrateur requis'
    });
  }

  next();
};

/**
 * Vérifier propriété de la ressource
 */
export const requireOwnership = (resourceUserIdField: string = 'created_by') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    // Si admin, bypass
    if (req.user.is_admin) {
      return next();
    }

    const resource = (req as any).resource; // Doit être ajouté par un middleware précédent

    if (!resource) {
      return res.status(500).json({
        success: false,
        error: 'Ressource non chargée'
      });
    }

    if (resource[resourceUserIdField] !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé - vous n\'êtes pas propriétaire de cette ressource'
      });
    }

    next();
  };
};
