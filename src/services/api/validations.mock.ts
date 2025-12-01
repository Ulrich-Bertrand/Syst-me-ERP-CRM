/**
 * SERVICE MOCK: Validations
 * 
 * Utilisé en fallback quand le serveur backend n'est pas disponible
 */

import {
  DemandeAchatComplete,
  ApiResponse,
  ValidationAction,
  HistoriqueValidation,
  ValidationStats
} from '../../types/achats-api.types';

// Mock delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Référence aux demandes (partagée avec demandes.mock.ts via import si besoin)
let mockValidationStats: ValidationStats = {
  en_attente_niveau_1: 5,
  en_attente_niveau_2: 3,
  en_attente_niveau_3: 1,
  validees_aujourd_hui: 8,
  rejetees_aujourd_hui: 2,
  montant_en_attente: 45780.50,
  montant_valide_mois: 128450.00
};

export const validationsMockService = {
  /**
   * GET /api/validations/demandes
   */
  async getDemandesAValider(niveau?: number): Promise<DemandeAchatComplete[]> {
    await delay(300);

    console.log('[MOCK] GET /api/validations/demandes', { niveau });

    // En mode mock, retourner des demandes fictives à valider
    const demandesAValider: DemandeAchatComplete[] = [
      {
        id: 10,
        reference: 'DA-2025-0010',
        agence: 'GHANA',
        type: 'NORMALE',
        statut: 'en_validation_niveau_1',
        objet: 'Matériel de sécurité',
        justification: 'Renouvellement équipements protection',
        date_besoin: '2025-02-10',
        montant_total_estime: 3200.00,
        demandeur_id: 6,
        demandeur_nom: 'Responsable HSE',
        date_creation: '2025-01-20T10:00:00Z',
        date_soumission: '2025-01-20T10:30:00Z',
        lignes: [
          {
            id: 20,
            demande_id: 10,
            designation: 'Casques de sécurité',
            quantite: 20,
            unite: 'Pièce',
            prix_unitaire_estime: 45.00,
            montant_total_estime: 900.00,
            categorie_article: 'Sécurité'
          },
          {
            id: 21,
            demande_id: 10,
            designation: 'Gilets haute visibilité',
            quantite: 30,
            unite: 'Pièce',
            prix_unitaire_estime: 25.00,
            montant_total_estime: 750.00,
            categorie_article: 'Sécurité'
          }
        ],
        historique_validations: []
      },
      {
        id: 11,
        reference: 'DA-2025-0011',
        agence: 'GHANA',
        type: 'URGENTE',
        statut: 'en_validation_niveau_2',
        objet: 'Réparation véhicule',
        justification: 'Panne moteur camion GH-005',
        date_besoin: '2025-01-25',
        montant_total_estime: 5600.00,
        demandeur_id: 5,
        demandeur_nom: 'Chef Atelier',
        date_creation: '2025-01-21T08:00:00Z',
        date_soumission: '2025-01-21T08:15:00Z',
        lignes: [
          {
            id: 22,
            demande_id: 11,
            designation: 'Moteur diesel reconditionné',
            quantite: 1,
            unite: 'Unité',
            prix_unitaire_estime: 4800.00,
            montant_total_estime: 4800.00,
            categorie_article: 'Pièces auto'
          },
          {
            id: 23,
            demande_id: 11,
            designation: 'Kit joints moteur',
            quantite: 1,
            unite: 'Kit',
            prix_unitaire_estime: 800.00,
            montant_total_estime: 800.00,
            categorie_article: 'Pièces auto'
          }
        ],
        historique_validations: [
          {
            id: 10,
            demande_id: 11,
            niveau: 1,
            valideur_id: 2,
            valideur_nom: 'Manager Operations',
            decision: 'approuve',
            commentaire: 'Réparation nécessaire',
            date_decision: '2025-01-21T09:00:00Z'
          }
        ]
      }
    ];

    // Filtrer par niveau si spécifié
    if (niveau) {
      return demandesAValider.filter(d => {
        const statutsParNiveau: Record<number, string[]> = {
          1: ['en_validation_niveau_1'],
          2: ['en_validation_niveau_2'],
          3: ['en_validation_niveau_3']
        };
        return statutsParNiveau[niveau]?.includes(d.statut);
      });
    }

    return demandesAValider;
  },

  /**
   * POST /api/validations/:id/valider
   */
  async valider(id: number, action: ValidationAction): Promise<ApiResponse<DemandeAchatComplete>> {
    await delay(400);

    console.log('[MOCK] POST /api/validations/' + id + '/valider', action);

    // Simuler la validation
    const demandeMock: DemandeAchatComplete = {
      id,
      reference: `DA-2025-${String(id).padStart(4, '0')}`,
      agence: 'GHANA',
      type: 'NORMALE',
      statut: action.niveau === 3 ? 'validee_niveau_3' : `en_validation_niveau_${action.niveau + 1}` as any,
      objet: 'Demande validée',
      justification: 'Test validation',
      date_besoin: '2025-02-15',
      montant_total_estime: 5000.00,
      demandeur_id: 1,
      demandeur_nom: 'Consultant IC',
      date_creation: new Date().toISOString(),
      date_soumission: new Date().toISOString(),
      lignes: [],
      historique_validations: [
        {
          id: Math.floor(Math.random() * 1000),
          demande_id: id,
          niveau: action.niveau,
          valideur_id: 2,
          valideur_nom: 'Valideur Mock',
          decision: 'approuve',
          commentaire: action.commentaire,
          date_decision: new Date().toISOString()
        }
      ]
    };

    // Mettre à jour les stats
    if (action.niveau === 1) {
      mockValidationStats.en_attente_niveau_1--;
      mockValidationStats.en_attente_niveau_2++;
    } else if (action.niveau === 2) {
      mockValidationStats.en_attente_niveau_2--;
      mockValidationStats.en_attente_niveau_3++;
    } else if (action.niveau === 3) {
      mockValidationStats.en_attente_niveau_3--;
      mockValidationStats.validees_aujourd_hui++;
      mockValidationStats.montant_valide_mois += demandeMock.montant_total_estime;
    }

    return {
      message: 'Demande validée avec succès',
      data: demandeMock
    };
  },

  /**
   * POST /api/validations/:id/rejeter
   */
  async rejeter(id: number, action: ValidationAction): Promise<ApiResponse<DemandeAchatComplete>> {
    await delay(400);

    console.log('[MOCK] POST /api/validations/' + id + '/rejeter', action);

    // Simuler le rejet
    const demandeMock: DemandeAchatComplete = {
      id,
      reference: `DA-2025-${String(id).padStart(4, '0')}`,
      agence: 'GHANA',
      type: 'NORMALE',
      statut: 'rejetee',
      objet: 'Demande rejetée',
      justification: 'Test rejet',
      date_besoin: '2025-02-15',
      montant_total_estime: 5000.00,
      demandeur_id: 1,
      demandeur_nom: 'Consultant IC',
      date_creation: new Date().toISOString(),
      date_soumission: new Date().toISOString(),
      lignes: [],
      historique_validations: [
        {
          id: Math.floor(Math.random() * 1000),
          demande_id: id,
          niveau: action.niveau,
          valideur_id: 2,
          valideur_nom: 'Valideur Mock',
          decision: 'rejete',
          commentaire: action.commentaire || 'Rejet en mode mock',
          date_decision: new Date().toISOString()
        }
      ]
    };

    // Mettre à jour les stats
    if (action.niveau === 1) mockValidationStats.en_attente_niveau_1--;
    else if (action.niveau === 2) mockValidationStats.en_attente_niveau_2--;
    else if (action.niveau === 3) mockValidationStats.en_attente_niveau_3--;
    
    mockValidationStats.rejetees_aujourd_hui++;

    return {
      message: 'Demande rejetée',
      data: demandeMock
    };
  },

  /**
   * GET /api/validations/:id/historique
   */
  async getHistorique(id: number): Promise<HistoriqueValidation[]> {
    await delay(200);

    console.log('[MOCK] GET /api/validations/' + id + '/historique');

    // Retourner historique mock
    return [
      {
        id: 1,
        demande_id: id,
        niveau: 1,
        valideur_id: 2,
        valideur_nom: 'Manager Operations',
        decision: 'approuve',
        commentaire: 'Demande justifiée',
        date_decision: '2025-01-20T10:00:00Z'
      },
      {
        id: 2,
        demande_id: id,
        niveau: 2,
        valideur_id: 3,
        valideur_nom: 'Directeur Financier',
        decision: 'approuve',
        commentaire: 'Budget disponible',
        date_decision: '2025-01-20T14:30:00Z'
      }
    ];
  },

  /**
   * GET /api/validations/stats
   */
  async getStats(): Promise<ValidationStats> {
    await delay(200);

    console.log('[MOCK] GET /api/validations/stats');

    return mockValidationStats;
  }
};
