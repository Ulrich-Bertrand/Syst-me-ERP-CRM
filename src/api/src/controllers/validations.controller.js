const validationsService = require('../services/validations.service');

class ValidationsController {
  /**
   * GET /api/validations/demandes
   * Obtenir demandes à valider
   */
  async getDemandesAValider(req, res, next) {
    try {
      const result = await validationsService.getDemandesAValider(
        req.user.id,
        req.user,
        req.query
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/validations/:demandeId/valider
   * Valider une demande
   */
  async valider(req, res, next) {
    try {
      const { commentaire } = req.body;
      
      const demande = await validationsService.valider(
        req.params.demandeId,
        req.user.id,
        req.user,
        commentaire
      );
      
      res.json({
        message: 'Demande validée avec succès',
        data: demande
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/validations/:demandeId/rejeter
   * Rejeter une demande
   */
  async rejeter(req, res, next) {
    try {
      const { commentaire } = req.body;
      
      const demande = await validationsService.rejeter(
        req.params.demandeId,
        req.user.id,
        req.user,
        commentaire
      );
      
      res.json({
        message: 'Demande rejetée',
        data: demande
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/validations/:demandeId/historique
   * Obtenir historique validations
   */
  async getHistorique(req, res, next) {
    try {
      const historique = await validationsService.getHistorique(req.params.demandeId);
      res.json(historique);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/validations/stats
   * Obtenir statistiques validations
   */
  async getStats(req, res, next) {
    try {
      const stats = await validationsService.getStats(req.user.id, req.user);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ValidationsController();
