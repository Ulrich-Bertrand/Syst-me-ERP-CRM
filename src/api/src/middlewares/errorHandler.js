/**
 * Middleware de gestion globale des erreurs
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Erreur de validation Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expiré'
    });
  }

  // Erreur base de données PostgreSQL
  if (err.code) {
    switch (err.code) {
      case '23505': // Violation de contrainte unique
        return res.status(409).json({
          error: 'Cette ressource existe déjà',
          details: err.detail
        });
      
      case '23503': // Violation de clé étrangère
        return res.status(400).json({
          error: 'Référence invalide',
          details: err.detail
        });
      
      case '23502': // Violation NOT NULL
        return res.status(400).json({
          error: 'Champ requis manquant',
          details: err.column
        });
      
      default:
        console.error('Database error:', err.code, err.detail);
    }
  }

  // Erreur personnalisée
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // Erreur par défaut
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erreur serveur interne'
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
