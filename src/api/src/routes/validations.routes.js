const express = require('express');
const router = express.Router();
const validationsController = require('../controllers/validations.controller');
const { authenticateJWT } = require('../middlewares/auth');
const { requireAnyProfile } = require('../middlewares/permissions');

/**
 * Middleware : Au moins un profil validateur requis
 */
const requireValidatorProfile = requireAnyProfile([
  'profile_purchases_validate_level_1',
  'profile_purchases_validate_level_2',
  'profile_purchases_validate_level_3'
]);

/**
 * @route GET /api/validations/demandes
 * @desc Obtenir demandes à valider
 * @access Private - Profil validateur requis
 */
router.get(
  '/demandes',
  authenticateJWT,
  requireValidatorProfile,
  validationsController.getDemandesAValider
);

/**
 * @route GET /api/validations/stats
 * @desc Obtenir statistiques validations
 * @access Private - Profil validateur requis
 */
router.get(
  '/stats',
  authenticateJWT,
  requireValidatorProfile,
  validationsController.getStats
);

/**
 * @route POST /api/validations/:demandeId/valider
 * @desc Valider une demande
 * @access Private - Profil validateur requis
 */
router.post(
  '/:demandeId/valider',
  authenticateJWT,
  requireValidatorProfile,
  validationsController.valider
);

/**
 * @route POST /api/validations/:demandeId/rejeter
 * @desc Rejeter une demande
 * @access Private - Profil validateur requis
 */
router.post(
  '/:demandeId/rejeter',
  authenticateJWT,
  requireValidatorProfile,
  validationsController.rejeter
);

/**
 * @route GET /api/validations/:demandeId/historique
 * @desc Obtenir historique validations d'une demande
 * @access Private
 */
router.get(
  '/:demandeId/historique',
  authenticateJWT,
  validationsController.getHistorique
);

module.exports = router;
