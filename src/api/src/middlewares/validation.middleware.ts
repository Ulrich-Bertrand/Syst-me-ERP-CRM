import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware de validation Zod
 * Valide req.body, req.query ou req.params selon le schéma fourni
 */
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[source];
      
      // Valider avec Zod
      const validated = schema.parse(dataToValidate);
      
      // Remplacer données par version validée et transformée
      (req as any)[source] = validated;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formater erreurs Zod
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          success: false,
          error: 'Validation échouée',
          errors
        });
      }

      // Autre erreur
      return res.status(500).json({
        success: false,
        error: 'Erreur de validation'
      });
    }
  };
};

/**
 * Valider body
 */
export const validateBody = (schema: ZodSchema) => validate(schema, 'body');

/**
 * Valider query params
 */
export const validateQuery = (schema: ZodSchema) => validate(schema, 'query');

/**
 * Valider route params
 */
export const validateParams = (schema: ZodSchema) => validate(schema, 'params');
