/**
 * Export centralisé de tous les services API
 */

export * from './config';
export * from './auth.api';
export * from './demandes.api';
export * from './validations.api';
export * from './dashboard.api';

// Re-exports pour faciliter l'import
export { authApi } from './auth.api';
export { demandesApi } from './demandes.api';
export { validationsApi } from './validations.api';
export { dashboardApi } from './dashboard.api';
