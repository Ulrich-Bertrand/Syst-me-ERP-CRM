const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const { requireProfile } = require('../middlewares/permissions');

/**
 * Routes pour les factures fournisseurs
 * TODO: Implémenter controllers et services + Contrôle 3 voies
 */

router.get('/', authenticateJWT, requireProfile('profile_purchases_manage_invoices'), (req, res) => {
  res.json({ data: [], total: 0, message: 'À implémenter' });
});

router.get('/:id', authenticateJWT, requireProfile('profile_purchases_manage_invoices'), (req, res) => {
  res.json({ message: 'À implémenter' });
});

router.post('/', authenticateJWT, requireProfile('profile_purchases_manage_invoices'), (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

// Contrôle 3 voies
router.post('/:id/controle-3-voies', authenticateJWT, requireProfile('profile_purchases_manage_invoices'), (req, res) => {
  res.status(501).json({ error: 'Contrôle 3 voies à implémenter' });
});

module.exports = router;
