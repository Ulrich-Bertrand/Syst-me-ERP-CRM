import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

// Étendre le type Request pour inclure user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware d'authentification JWT
 * Vérifie le token et charge les infos utilisateur
 */
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupérer token depuis header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Token d\'authentification manquant'
      });
    }

    // Format attendu: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Format token invalide. Utilisez: Bearer <token>'
      });
    }

    const token = parts[1];

    // Vérifier token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET non défini dans .env');
      return res.status(500).json({
        success: false,
        error: 'Erreur de configuration serveur'
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Charger utilisateur depuis DB
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND active = true',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé ou inactif'
      });
    }

    const user = userResult.rows[0];

    // Supprimer password du résultat
    delete user.password_hash;

    // Ajouter user à la requête
    req.user = user;

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expiré',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }

    console.error('Erreur authentification:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'authentification'
    });
  }
};

/**
 * Middleware optionnel : JWT optionnel
 * Continue même si pas de token
 */
export const optionalJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  try {
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      return next();
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND active = true',
      [decoded.userId]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      delete user.password_hash;
      req.user = user;
    }

    next();
  } catch (error) {
    // Erreur silencieuse, on continue sans user
    next();
  }
};
