const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

/**
 * Middleware d'authentification JWT
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Extraire token du header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token manquant. Veuillez vous connecter.' 
      });
    }

    const token = authHeader.substring(7); // Retirer "Bearer "

    // Vérifier et décoder token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Charger utilisateur depuis DB
    const result = await query(
      `SELECT 
        id, email, nom, prenom, agence, telephone,
        is_admin, active,
        profile_purchases_create_da,
        profile_purchases_validate_level_1,
        profile_purchases_validate_level_2,
        profile_purchases_validate_level_3,
        profile_purchases_manage_po,
        profile_purchases_manage_invoices,
        profile_purchases_manage_payments,
        profile_stock_manage,
        profile_stock_view,
        profile_dossiers_manage,
        profile_cotations_manage,
        profile_finance_view
      FROM utilisateurs 
      WHERE id = $1 AND active = true`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Utilisateur non trouvé ou inactif' 
      });
    }

    // Ajouter user à la requête
    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré. Veuillez vous reconnecter.' });
    }
    next(error);
  }
};

/**
 * Middleware optionnel (ne bloque pas si pas de token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const result = await query(
        'SELECT * FROM utilisateurs WHERE id = $1 AND active = true',
        [decoded.userId]
      );
      
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }
    
    next();
  } catch (error) {
    // Ignorer erreurs, continuer sans user
    next();
  }
};

module.exports = {
  authenticateJWT,
  optionalAuth
};
