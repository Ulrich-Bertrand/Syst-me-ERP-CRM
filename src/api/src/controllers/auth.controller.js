const authService = require('../services/auth.service');

class AuthController {
  /**
   * POST /api/auth/login
   * Connexion utilisateur
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const result = await authService.login(email, password);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/profile
   * Obtenir profil utilisateur connecté
   */
  async getProfile(req, res, next) {
    try {
      const profile = await authService.getProfile(req.user.id);
      
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   * Mettre à jour profil
   */
  async updateProfile(req, res, next) {
    try {
      const updatedProfile = await authService.updateProfile(req.user.id, req.body);
      
      res.json({
        message: 'Profil mis à jour avec succès',
        data: updatedProfile
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/change-password
   * Changer mot de passe
   */
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      
      const result = await authService.changePassword(req.user.id, oldPassword, newPassword);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Rafraîchir token (TODO)
   */
  async refreshToken(req, res, next) {
    try {
      // TODO: Implémenter refresh token
      res.status(501).json({ error: 'Non implémenté' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
