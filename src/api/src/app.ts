import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Routes
import demandesRoutes from './routes/demandes.routes';
import validationsRoutes from './routes/validations.routes';
import bonsCommandeRoutes from './routes/bons-commande.routes';
import facturesRoutes from './routes/factures.routes';
import paiementsRoutes from './routes/paiements.routes';
import stockRoutes from './routes/stock.routes';
import reportingRoutes from './routes/reporting.routes';

// Middlewares
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/not-found.middleware';

const app: Express = express();

// ========== MIDDLEWARES GLOBAUX ==========

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite par IP
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Trop de requêtes, veuillez réessayer plus tard'
    }
  }
});
app.use('/api/', limiter);

// ========== ROUTES ==========

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API Achats opérationnelle',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0'
  });
});

// API routes
app.use('/api/demandes', demandesRoutes);
app.use('/api/validations', validationsRoutes);
app.use('/api/bons-commande', bonsCommandeRoutes);
app.use('/api/factures', facturesRoutes);
app.use('/api/paiements', paiementsRoutes);
app.use('/api/articles', stockRoutes);
app.use('/api/mouvements', stockRoutes);
app.use('/api/inventaires', stockRoutes);
app.use('/api/reporting', reportingRoutes);

// Fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));
app.use('/exports', express.static('exports'));

// ========== ERROR HANDLING ==========

// 404 - Route not found
app.use(notFoundMiddleware);

// Error handler global
app.use(errorMiddleware);

// ========== EXPORT ==========

export default app;
