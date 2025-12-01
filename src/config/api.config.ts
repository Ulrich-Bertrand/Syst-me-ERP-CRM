/**
 * CONFIGURATION API
 * 
 * Configuration centralisée pour l'URL de l'API backend
 */

// Obtenir l'URL de l'API depuis les variables d'environnement
// Fallback sur localhost:4000 en développement
export const API_BASE_URL = 
  typeof window === 'undefined' 
    ? process.env.API_URL || 'http://localhost:4000/api'  // Server-side
    : (window as any).ENV?.API_URL || 'http://localhost:4000/api';  // Client-side

console.log('[API Config] Base URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  
  // Demandes d'achat
  DEMANDES: '/demandes',
  DEMANDES_BY_ID: (id: number) => `/demandes/${id}`,
  DEMANDES_SUBMIT: (id: number) => `/demandes/${id}/submit`,
  
  // Validations
  VALIDATIONS_DEMANDES: '/validations/demandes',
  VALIDATIONS_VALIDER: (id: number) => `/validations/${id}/valider`,
  VALIDATIONS_REJETER: (id: number) => `/validations/${id}/rejeter`,
  VALIDATIONS_HISTORIQUE: (id: number) => `/validations/${id}/historique`,
  VALIDATIONS_STATS: '/validations/stats',
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  
  // Bons de commande
  BONS_COMMANDE: '/bons-commande',
  BONS_COMMANDE_BY_ID: (id: number) => `/bons-commande/${id}`,
  BONS_COMMANDE_GENERER: (demandeId: number) => `/bons-commande/generer/${demandeId}`,
  
  // Factures
  FACTURES: '/factures',
  FACTURES_BY_ID: (id: number) => `/factures/${id}`,
  
  // Paiements
  PAIEMENTS: '/paiements',
  PAIEMENTS_BY_ID: (id: number) => `/paiements/${id}`,
  
  // Fournisseurs
  FOURNISSEURS: '/fournisseurs',
  FOURNISSEURS_BY_ID: (id: number) => `/fournisseurs/${id}`,
  
  // Stock
  STOCK_ARTICLES: '/stock/articles',
  STOCK_MOUVEMENTS: '/stock/mouvements',
  
  // Reporting
  REPORTING_ACHATS: '/reporting/achats',
  REPORTING_FOURNISSEURS: '/reporting/fournisseurs'
} as const;

export default {
  API_BASE_URL,
  API_ENDPOINTS
};
