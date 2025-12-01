const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/permissions');

/**
 * Routes pour les utilisateurs (admin uniquement)
 * TODO: Implémenter controllers et services
 */

router.get('/', authenticateJWT, requireAdmin, (req, res) => {
  res.json({ data: [], total: 0, message: 'À implémenter' });
});

router.get('/:id', authenticateJWT, requireAdmin, (req, res) => {
  res.json({ message: 'À implémenter' });
});

router.post('/', authenticateJWT, requireAdmin, (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

router.put('/:id', authenticateJWT, requireAdmin, (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

router.delete('/:id', authenticateJWT, requireAdmin, (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

module.exports = router;
