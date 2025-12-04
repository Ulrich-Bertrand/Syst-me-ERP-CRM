const demandesService = require('../services/demandes.service');

class DemandesController {
  /**
   * GET /api/demandes
   * Obtenir toutes les demandes (avec filtres)
   */
  async getAll(req, res, next) {
    try {
      const result = await demandesService.getAll(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/demandes/:id
   * Obtenir une demande par ID
   */
  async getById(req, res, next) {
    try {
      const demande = await demandesService.getById(req.params.id);
      res.json(demande);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/demandes
   * Créer une nouvelle demande
   */
  async create(req, res, next) {
    try {
      const demande = await demandesService.create(req.user.id, req.body);
      
      res.status(201).json({
        message: 'Demande créée avec succès',
        data: demande
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/demandes/:id
   * Mettre à jour une demande
   */
  async update(req, res, next) {
    try {
      const demande = await demandesService.update(req.params.id, req.user.id, req.body);
      
      res.json({
        message: 'Demande mise à jour avec succès',
        data: demande
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/demandes/:id
   * Supprimer une demande (brouillon uniquement)
   */
  async delete(req, res, next) {
    try {
      const result = await demandesService.delete(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/demandes/:id/submit
   * Soumettre une demande pour validation
   */
  async submit(req, res, next) {
    try {
      const demande = await demandesService.submit(req.params.id, req.user.id);
      
      res.json({
        message: 'Demande soumise pour validation',
        data: demande
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/demandes/mes-demandes
   * Obtenir les demandes de l'utilisateur connecté
   */
  async getMesDemandes(req, res, next) {
    try {
      const result = await demandesService.getAll({
        ...req.query,
        demandeur_id: req.user.id
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DemandesController();
