/**
 * Middleware de vérification des permissions
 */

/**
 * Vérifie que l'utilisateur est admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({ 
      error: 'Accès refusé. Permissions administrateur requises.' 
    });
  }

  next();
};

/**
 * Vérifie qu'un utilisateur a un profil spécifique
 */
const requireProfile = (profileName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!req.user[profileName]) {
      return res.status(403).json({ 
        error: `Accès refusé. Profil "${profileName}" requis.` 
      });
    }

    next();
  };
};

/**
 * Vérifie qu'un utilisateur a AU MOINS UN des profils
 */
const requireAnyProfile = (profileNames) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const hasAnyProfile = profileNames.some(profile => req.user[profile]);

    if (!hasAnyProfile) {
      return res.status(403).json({ 
        error: `Accès refusé. Un des profils suivants requis: ${profileNames.join(', ')}` 
      });
    }

    next();
  };
};

/**
 * Vérifie qu'un utilisateur a TOUS les profils
 */
const requireAllProfiles = (profileNames) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const hasAllProfiles = profileNames.every(profile => req.user[profile]);

    if (!hasAllProfiles) {
      return res.status(403).json({ 
        error: `Accès refusé. Tous les profils suivants requis: ${profileNames.join(', ')}` 
      });
    }

    next();
  };
};

/**
 * Vérifie que l'utilisateur appartient à l'agence spécifiée
 */
const requireAgence = (agence) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (req.user.agence !== agence) {
      return res.status(403).json({ 
        error: `Accès refusé. Agence "${agence}" requise.` 
      });
    }

    next();
  };
};

/**
 * Vérifie que l'utilisateur peut accéder à une ressource d'une agence
 * (admin peut tout voir, autres seulement leur agence)
 */
const canAccessAgence = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  // Admin peut accéder à toutes les agences
  if (req.user.is_admin) {
    return next();
  }

  // Autres utilisateurs : vérifier l'agence
  const requestedAgence = req.query.agence || req.body.agence || req.params.agence;
  
  if (requestedAgence && requestedAgence !== req.user.agence) {
    return res.status(403).json({ 
      error: 'Accès refusé. Vous ne pouvez accéder qu\'aux données de votre agence.' 
    });
  }

  next();
};

module.exports = {
  requireAdmin,
  requireProfile,
  requireAnyProfile,
  requireAllProfiles,
  requireAgence,
  canAccessAgence
};
