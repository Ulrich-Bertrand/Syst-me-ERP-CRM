const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const { requireProfile } = require('../middlewares/permissions');

/**
 * Routes pour les bons de commande
 * TODO: Implémenter controllers et services
 */

// GET /api/bons-commande - Liste
router.get('/', authenticateJWT, requireProfile('profile_purchases_manage_po'), (req, res) => {
  res.json({ data: [], total: 0, message: 'À implémenter' });
});

// GET /api/bons-commande/:id - Détail
router.get('/:id', authenticateJWT, requireProfile('profile_purchases_manage_po'), (req, res) => {
  res.json({ message: 'À implémenter' });
});

// POST /api/bons-commande - Créer depuis DA
router.post('/', authenticateJWT, requireProfile('profile_purchases_manage_po'), (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

// PUT /api/bons-commande/:id - Mettre à jour
router.put('/:id', authenticateJWT, requireProfile('profile_purchases_manage_po'), (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

// DELETE /api/bons-commande/:id - Supprimer
router.delete('/:id', authenticateJWT, requireProfile('profile_purchases_manage_po'), (req, res) => {
  res.status(501).json({ error: 'À implémenter' });
});

module.exports = router;
