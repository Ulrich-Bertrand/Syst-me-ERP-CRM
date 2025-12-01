/**
 * SERVICE MOCK: Dashboard/KPIs
 * 
 * Utilisé en fallback quand le serveur backend n'est pas disponible
 */

// Mock delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardMockService = {
  /**
   * GET /api/dashboard/stats
   */
  async getStats(filters?: any) {
    await delay(300);

    console.log('[MOCK] GET /api/dashboard/stats', filters);

    // Statistiques mockées
    return {
      demandes_en_attente: 5,
      demandes_validees: 12,
      bons_commande_en_cours: 8,
      montant_total: 125780.50,
      alertes_stock: 3,
      fournisseurs_actifs: 24
    };
  }
};
