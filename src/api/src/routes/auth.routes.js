const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { 
  loginSchema, 
  updateProfileSchema, 
  changePasswordSchema 
} = require('../validators/auth.validator');

/**
 * @route POST /api/auth/login
 * @desc Connexion utilisateur
 * @access Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route GET /api/auth/profile
 * @desc Obtenir profil utilisateur connecté
 * @access Private
 */
router.get('/profile', authenticateJWT, authController.getProfile);

/**
 * @route PUT /api/auth/profile
 * @desc Mettre à jour profil
 * @access Private
 */
router.put(
  '/profile',
  authenticateJWT,
  validate(updateProfileSchema),
  authController.updateProfile
);

/**
 * @route POST /api/auth/change-password
 * @desc Changer mot de passe
 * @access Private
 */
router.post(
  '/change-password',
  authenticateJWT,
  validate(changePasswordSchema),
  authController.changePassword
);

/**
 * @route POST /api/auth/refresh
 * @desc Rafraîchir token
 * @access Public
 */
router.post('/refresh', authController.refreshToken);

module.exports = router;
