const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');

/**
 * Routes pour les fournisseurs
 * TODO: Implémenter controllers et services
 */

router.get('/', authenticateJWT, (req, res) => {
  res.json({ data: [], total: 0, message: 'À implémenter' });
});

router.get('/:id', authenticateJWT, (req, res) => {
  res.json({ message: 'À implémenter' });
});

router.post('/', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

router.put('/:id', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

router.delete('/:id', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

module.exports = router;
