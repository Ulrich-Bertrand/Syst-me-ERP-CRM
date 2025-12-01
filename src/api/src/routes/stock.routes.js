const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const { requireAnyProfile } = require('../middlewares/permissions');

/**
 * Routes pour le stock
 * TODO: Implémenter controllers et services
 */

const requireStockProfile = requireAnyProfile(['profile_stock_manage', 'profile_stock_view']);

// Mouvements de stock
router.get('/mouvements', authenticateJWT, requireStockProfile, (req, res) => {
  res.json({ data: [], total: 0, message: 'À implémenter' });
});

router.post('/mouvements', authenticateJWT, requireAnyProfile(['profile_stock_manage']), (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

// Alertes stock
router.get('/alertes', authenticateJWT, requireStockProfile, (req, res) => {
  res.json({ data: [], total: 0, message: 'À implémenter' });
});

// Inventaires
router.get('/inventaires', authenticateJWT, requireStockProfile, (req, res) => {
  res.json({ data: [], total: 0, message: 'À implémenter' });
});

router.post('/inventaires', authenticateJWT, requireAnyProfile(['profile_stock_manage']), (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

// Calcul PMP
router.post('/calculer-pmp', authenticateJWT, requireAnyProfile(['profile_stock_manage']), (req, res) => {
  res.status(501).json({ error: 'Calcul PMP à implémenter' });
});

module.exports = router;
