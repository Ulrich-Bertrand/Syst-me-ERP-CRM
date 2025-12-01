import { Request, Response, NextFunction } from 'express';

export interface APIError extends Error {
  statusCode?: number;
  code?: string;
  details?: any[];
}

export const errorMiddleware = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  // Log error (en production, envoyer à un service de monitoring)
  console.error('[ERROR]', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    code,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message || 'Une erreur est survenue',
      details: err.details,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} introuvable`
    }
  });
};
