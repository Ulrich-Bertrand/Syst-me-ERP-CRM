const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const { requireProfile } = require('../middlewares/permissions');

/**
 * Routes pour les paiements
 * TODO: Implémenter controllers et services
 */

router.get('/', authenticateJWT, requireProfile('profile_purchases_manage_payments'), (req, res) => {
  res.json({ data: [], total: 0, message: 'À implémenter' });
});

router.get('/:id', authenticateJWT, requireProfile('profile_purchases_manage_payments'), (req, res) => {
  res.json({ message: 'À implémenter' });
});

router.post('/', authenticateJWT, requireProfile('profile_purchases_manage_payments'), (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

module.exports = router;
