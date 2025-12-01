/**
 * SERVICE MOCK: Demandes d'Achat
 * 
 * Utilisé en fallback quand le serveur backend n'est pas disponible
 */

import {
  DemandeAchatComplete,
  DemandeAchatListe,
  CreateDemandeRequest,
  UpdateDemandeRequest,
  GetDemandesFilters,
  PaginatedResponse,
  ApiResponse
} from '../../types/achats-api.types';

// Données mock
let mockDemandes: DemandeAchatComplete[] = [
  {
    id: 1,
    reference: 'DA-2025-0001',
    agence: 'GHANA',
    type: 'NORMALE',
    statut: 'validee',
    objet: 'Fournitures de bureau - Trimestre Q1',
    justification: 'Renouvellement stock trimestriel',
    date_besoin: '2025-01-31',
    montant_total_estime: 2750.00,
    demandeur_id: 1,
    demandeur_nom: 'Consultant IC',
    date_creation: '2025-01-15T08:30:00Z',
    date_soumission: '2025-01-15T09:00:00Z',
    lignes: [
      {
        id: 1,
        demande_id: 1,
        designation: 'Ramettes papier A4 - 80g',
        quantite: 50,
        unite: 'Ramette',
        prix_unitaire_estime: 5.50,
        montant_total_estime: 275.00,
        categorie_article: 'Fournitures',
        commentaire: 'Papier haute qualité'
      },
      {
        id: 2,
        demande_id: 1,
        designation: 'Stylos bille bleu',
        quantite: 100,
        unite: 'Pièce',
        prix_unitaire_estime: 0.75,
        montant_total_estime: 75.00,
        categorie_article: 'Fournitures'
      }
    ],
    historique_validations: [
      {
        id: 1,
        demande_id: 1,
        niveau: 1,
        valideur_id: 2,
        valideur_nom: 'Manager Operations',
        decision: 'approuve',
        commentaire: 'Quantités justifiées',
        date_decision: '2025-01-15T10:30:00Z'
      },
      {
        id: 2,
        demande_id: 1,
        niveau: 2,
        valideur_id: 3,
        valideur_nom: 'Directeur Financier',
        decision: 'approuve',
        commentaire: 'Budget disponible',
        date_decision: '2025-01-15T14:00:00Z'
      },
      {
        id: 3,
        demande_id: 1,
        niveau: 3,
        valideur_id: 4,
        valideur_nom: 'Directeur Général',
        decision: 'approuve',
        date_decision: '2025-01-16T09:00:00Z'
      }
    ]
  },
  {
    id: 2,
    reference: 'DA-2025-0002',
    agence: 'GHANA',
    type: 'URGENTE',
    statut: 'en_validation_niveau_2',
    objet: 'Pièces détachées camion',
    justification: 'Réparation urgente camion GH-001',
    date_besoin: '2025-01-20',
    montant_total_estime: 4500.00,
    demandeur_id: 5,
    demandeur_nom: 'Chef Atelier',
    date_creation: '2025-01-18T14:00:00Z',
    date_soumission: '2025-01-18T14:15:00Z',
    lignes: [
      {
        id: 3,
        demande_id: 2,
        designation: 'Kit embrayage complet',
        quantite: 1,
        unite: 'Kit',
        prix_unitaire_estime: 3200.00,
        montant_total_estime: 3200.00,
        categorie_article: 'Pièces auto',
        commentaire: 'Référence OEM'
      },
      {
        id: 4,
        demande_id: 2,
        designation: 'Huile moteur 15W40 - 20L',
        quantite: 5,
        unite: 'Bidon',
        prix_unitaire_estime: 260.00,
        montant_total_estime: 1300.00,
        categorie_article: 'Lubrifiants'
      }
    ],
    historique_validations: [
      {
        id: 4,
        demande_id: 2,
        niveau: 1,
        valideur_id: 2,
        valideur_nom: 'Manager Operations',
        decision: 'approuve',
        commentaire: 'Urgence confirmée',
        date_decision: '2025-01-18T15:00:00Z'
      }
    ]
  },
  {
    id: 3,
    reference: 'DA-2025-0003',
    agence: 'COTE_IVOIRE',
    type: 'NORMALE',
    statut: 'brouillon',
    objet: 'Équipements informatiques',
    justification: 'Extension parc informatique',
    date_besoin: '2025-02-15',
    montant_total_estime: 8900.00,
    demandeur_id: 1,
    demandeur_nom: 'Consultant IC',
    date_creation: '2025-01-19T11:20:00Z',
    lignes: [
      {
        id: 5,
        demande_id: 3,
        designation: 'PC Portable Dell Latitude',
        quantite: 3,
        unite: 'Unité',
        prix_unitaire_estime: 1200.00,
        montant_total_estime: 3600.00,
        categorie_article: 'Informatique',
        commentaire: 'i7, 16GB RAM, 512GB SSD'
      },
      {
        id: 6,
        demande_id: 3,
        designation: 'Écran 27" Full HD',
        quantite: 3,
        unite: 'Unité',
        prix_unitaire_estime: 350.00,
        montant_total_estime: 1050.00,
        categorie_article: 'Informatique'
      },
      {
        id: 7,
        demande_id: 3,
        designation: 'Clavier + Souris sans fil',
        quantite: 3,
        unite: 'Pack',
        prix_unitaire_estime: 85.00,
        montant_total_estime: 255.00,
        categorie_article: 'Informatique'
      }
    ],
    historique_validations: []
  }
];

let nextId = 4;
let nextLigneId = 8;

// Delay simulé pour imiter un appel réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const demandesMockService = {
  /**
   * GET /api/demandes
   */
  async getAll(filters?: GetDemandesFilters): Promise<PaginatedResponse<DemandeAchatListe>> {
    await delay(300);

    console.log('[MOCK] GET /api/demandes', filters);

    let filtered = [...mockDemandes];

    // Filtrer par agence
    if (filters?.agence) {
      filtered = filtered.filter(d => d.agence === filters.agence);
    }

    // Filtrer par statut
    if (filters?.statut) {
      filtered = filtered.filter(d => d.statut === filters.statut);
    }

    // Filtrer par type
    if (filters?.type) {
      filtered = filtered.filter(d => d.type === filters.type);
    }

    // Filtrer par demandeur
    if (filters?.demandeur_id) {
      filtered = filtered.filter(d => d.demandeur_id === filters.demandeur_id);
    }

    // Filtrer par période
    if (filters?.date_debut) {
      filtered = filtered.filter(d => d.date_creation >= filters.date_debut!);
    }
    if (filters?.date_fin) {
      filtered = filtered.filter(d => d.date_creation <= filters.date_fin!);
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);

    // Mapper vers format liste
    const listeData: DemandeAchatListe[] = paginatedData.map(d => ({
      id: d.id,
      reference: d.reference,
      agence: d.agence,
      type: d.type,
      statut: d.statut,
      objet: d.objet,
      date_besoin: d.date_besoin,
      date_creation: d.date_creation,
      date_demande: d.date_creation, // Utiliser date_creation comme date_demande
      montant_total_estime: d.montant_total_estime,
      demandeur_id: d.demandeur_id,
      demandeur_nom: d.demandeur_nom,
      date_soumission: d.date_soumission,
      niveau_validation_actuel: d.historique_validations?.[d.historique_validations.length - 1]?.niveau,
      nb_lignes: d.lignes.length,
      nombre_lignes: d.lignes.length
    }));

    return {
      data: listeData,
      total: filtered.length,
      page,
      limit
    };
  },

  /**
   * GET /api/demandes/:id
   */
  async getById(id: number): Promise<DemandeAchatComplete> {
    await delay(200);

    console.log('[MOCK] GET /api/demandes/' + id);

    const demande = mockDemandes.find(d => d.id === id);

    if (!demande) {
      throw {
        response: {
          status: 404,
          data: { error: 'Demande non trouvée' }
        }
      };
    }

    return demande;
  },

  /**
   * POST /api/demandes
   */
  async create(data: CreateDemandeRequest): Promise<ApiResponse<DemandeAchatComplete>> {
    await delay(500);

    console.log('[MOCK] POST /api/demandes', data);

    const nouvelleDemande: DemandeAchatComplete = {
      id: nextId++,
      reference: `DA-2025-${String(nextId - 1).padStart(4, '0')}`,
      agence: data.agence,
      type: data.type,
      statut: 'brouillon',
      objet: data.objet,
      justification: data.justification,
      date_besoin: data.date_besoin,
      montant_total_estime: data.lignes.reduce((sum, l) => sum + (l.quantite * l.prix_unitaire_estime), 0),
      demandeur_id: 1,
      demandeur_nom: 'Consultant IC',
      date_creation: new Date().toISOString(),
      lignes: data.lignes.map((ligne, index) => ({
        id: nextLigneId++,
        demande_id: nextId - 1,
        designation: ligne.designation,
        quantite: ligne.quantite,
        unite: ligne.unite,
        prix_unitaire_estime: ligne.prix_unitaire_estime,
        montant_total_estime: ligne.quantite * ligne.prix_unitaire_estime,
        categorie_article: ligne.categorie_article,
        commentaire: ligne.commentaire
      })),
      historique_validations: []
    };

    mockDemandes.push(nouvelleDemande);

    return {
      message: 'Demande créée avec succès',
      data: nouvelleDemande
    };
  },

  /**
   * PUT /api/demandes/:id
   */
  async update(id: number, data: UpdateDemandeRequest): Promise<ApiResponse<DemandeAchatComplete>> {
    await delay(400);

    console.log('[MOCK] PUT /api/demandes/' + id, data);

    const index = mockDemandes.findIndex(d => d.id === id);

    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { error: 'Demande non trouvée' }
        }
      };
    }

    const demande = mockDemandes[index];

    if (demande.statut !== 'brouillon') {
      throw {
        response: {
          status: 400,
          data: { error: 'Seules les demandes en brouillon peuvent être modifiées' }
        }
      };
    }

    // Mettre à jour
    if (data.objet) demande.objet = data.objet;
    if (data.justification) demande.justification = data.justification;
    if (data.date_besoin) demande.date_besoin = data.date_besoin;
    if (data.type) demande.type = data.type;

    if (data.lignes) {
      demande.lignes = data.lignes.map(ligne => ({
        id: ligne.id || nextLigneId++,
        demande_id: id,
        designation: ligne.designation,
        quantite: ligne.quantite,
        unite: ligne.unite,
        prix_unitaire_estime: ligne.prix_unitaire_estime,
        montant_total_estime: ligne.quantite * ligne.prix_unitaire_estime,
        categorie_article: ligne.categorie_article,
        commentaire: ligne.commentaire
      }));

      demande.montant_total_estime = demande.lignes.reduce(
        (sum, l) => sum + l.montant_total_estime, 
        0
      );
    }

    mockDemandes[index] = demande;

    return {
      message: 'Demande mise à jour avec succès',
      data: demande
    };
  },

  /**
   * DELETE /api/demandes/:id
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    await delay(300);

    console.log('[MOCK] DELETE /api/demandes/' + id);

    const index = mockDemandes.findIndex(d => d.id === id);

    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { error: 'Demande non trouvée' }
        }
      };
    }

    const demande = mockDemandes[index];

    if (demande.statut !== 'brouillon') {
      throw {
        response: {
          status: 400,
          data: { error: 'Seules les demandes en brouillon peuvent être supprimées' }
        }
      };
    }

    mockDemandes.splice(index, 1);

    return {
      message: 'Demande supprimée avec succès'
    };
  },

  /**
   * POST /api/demandes/:id/submit
   */
  async submit(id: number): Promise<ApiResponse<DemandeAchatComplete>> {
    await delay(400);

    console.log('[MOCK] POST /api/demandes/' + id + '/submit');

    const index = mockDemandes.findIndex(d => d.id === id);

    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { error: 'Demande non trouvée' }
        }
      };
    }

    const demande = mockDemandes[index];

    if (demande.statut !== 'brouillon') {
      throw {
        response: {
          status: 400,
          data: { error: 'Cette demande a déjà été soumise' }
        }
      };
    }

    demande.statut = 'en_validation_niveau_1';
    demande.date_soumission = new Date().toISOString();

    mockDemandes[index] = demande;

    return {
      message: 'Demande soumise pour validation',
      data: demande
    };
  }
};