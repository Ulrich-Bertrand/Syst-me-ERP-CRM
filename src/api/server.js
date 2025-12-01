require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const demandesRoutes = require('./src/routes/demandes.routes');
const validationsRoutes = require('./src/routes/validations.routes');
const bonsCommandeRoutes = require('./src/routes/bons-commande.routes');
const receptionsRoutes = require('./src/routes/receptions.routes');
const facturesRoutes = require('./src/routes/factures.routes');
const paiementsRoutes = require('./src/routes/paiements.routes');
const fournisseursRoutes = require('./src/routes/fournisseurs.routes');
const articlesRoutes = require('./src/routes/articles.routes');
const stockRoutes = require('./src/routes/stock.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const utilisateursRoutes = require('./src/routes/utilisateurs.routes');

// Import middlewares
const errorHandler = require('./src/middlewares/errorHandler');

// Initialize express
const app = express();
const PORT = process.env.PORT || 4000;

// Security middlewares
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/demandes', demandesRoutes);
app.use('/api/validations', validationsRoutes);
app.use('/api/bons-commande', bonsCommandeRoutes);
app.use('/api/receptions', receptionsRoutes);
app.use('/api/factures', facturesRoutes);
app.use('/api/paiements', paiementsRoutes);
app.use('/api/fournisseurs', fournisseursRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/utilisateurs', utilisateursRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.path 
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`🚀 JOCYDERK ERP API Server`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log(`🚀 Health: http://localhost:${PORT}/health`);
  console.log('🚀 ========================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
  });
});
