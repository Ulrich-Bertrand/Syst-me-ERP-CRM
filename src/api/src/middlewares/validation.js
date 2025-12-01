/**
 * Middleware de validation avec Zod
 */

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Valider body, query et params
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });

      // Remplacer req avec données validées
      req.body = validated.body || req.body;
      req.query = validated.query || req.query;
      req.params = validated.params || req.params;

      next();
    } catch (error) {
      // Zod envoie automatiquement l'erreur au errorHandler
      next(error);
    }
  };
};

/**
 * Validation body uniquement
 */
const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validation query uniquement
 */
const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validation params uniquement
 */
const validateParams = (schema) => {
  return async (req, res, next) => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams
};
