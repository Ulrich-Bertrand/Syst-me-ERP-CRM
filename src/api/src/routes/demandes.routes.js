const express = require('express');
const router = express.Router();
const demandesController = require('../controllers/__demandes.controller');
const { authenticateJWT } = require('../middlewares/auth');
const { requireProfile } = require('../middlewares/permissions');
const { validate } = require('../middlewares/validation');
const {
  createDemandeSchema,
  updateDemandeSchema,
  getDemandesSchema,
  demandeIdSchema
} = require('../validators/demandes.validator');

/**
 * @route GET /api/demandes
 * @desc Obtenir toutes les demandes (avec filtres)
 * @access Private
 */
router.get(
  '/',
  authenticateJWT,
  validate(getDemandesSchema),
  demandesController.getAll
);

/**
 * @route GET /api/demandes/mes-demandes
 * @desc Obtenir mes demandes
 * @access Private
 */
router.get(
  '/mes-demandes',
  authenticateJWT,
  demandesController.getMesDemandes
);

/**
 * @route GET /api/demandes/:id
 * @desc Obtenir une demande par ID
 * @access Private
 */
router.get(
  '/:id',
  authenticateJWT,
  validate(demandeIdSchema),
  demandesController.getById
);

/**
 * @route POST /api/demandes
 * @desc Créer une nouvelle demande
 * @access Private - Profil "profile_purchases_create" requis
 */
router.post(
  '/',
  authenticateJWT,
  requireProfile('profile_purchases_create'),
  validate(createDemandeSchema),
  demandesController.create
);

/**
 * @route PUT /api/demandes/:id
 * @desc Mettre à jour une demande
 * @access Private
 */
router.put(
  '/:id',
  authenticateJWT,
  requireProfile('profile_purchases_create'),
  validate(updateDemandeSchema),
  demandesController.update
);

/**
 * @route DELETE /api/demandes/:id
 * @desc Supprimer une demande (brouillon uniquement)
 * @access Private
 */
router.delete(
  '/:id',
  authenticateJWT,
  requireProfile('profile_purchases_create'),
  validate(demandeIdSchema),
  demandesController.delete
);

/**
 * @route POST /api/demandes/:id/submit
 * @desc Soumettre une demande pour validation
 * @access Private
 */
router.post(
  '/:id/submit',
  authenticateJWT,
  requireProfile('profile_purchases_create'),
  validate(demandeIdSchema),
  demandesController.submit
);

module.exports = router;
