const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const { query } = require('../config/database');

/**
 * @route GET /api/dashboard/stats
 * @desc Obtenir statistiques dashboard
 * @access Private
 */
router.get('/stats', authenticateJWT, async (req, res, next) => {
  try {
    const { agence } = req.query;
    const userId = req.user.id;
    
    // Filtrer par agence si fournie (admin peut tout voir)
    const agenceFilter = agence && !req.user.is_admin 
      ? `AND da.agence = '${agence}'`
      : '';

    // Demandes en attente (pour le user)
    const enAttenteResult = await query(
      `SELECT COUNT(*) as count FROM demandes_achat da
       WHERE da.demandeur_id = $1 
         AND da.statut IN ('brouillon', 'en_validation_niveau_1', 'en_validation_niveau_2', 'en_validation_niveau_3')
         ${agenceFilter}`,
      [userId]
    );

    // Demandes validées ce mois
    const valideesResult = await query(
      `SELECT COUNT(*) as count FROM demandes_achat da
       WHERE da.demandeur_id = $1 
         AND da.statut = 'validee'
         AND DATE_TRUNC('month', da.date_demande) = DATE_TRUNC('month', CURRENT_DATE)
         ${agenceFilter}`,
      [userId]
    );

    // Bons de commande en cours
    const bonsCommandeResult = await query(
      `SELECT COUNT(*) as count FROM bons_commande bc
       WHERE bc.statut IN ('brouillon', 'envoye', 'confirme')
         ${agenceFilter.replace('da.', 'bc.')}`
    );

    // Montant total demandes validées ce mois
    const montantResult = await query(
      `SELECT COALESCE(SUM(da.montant_total_estime), 0) as total 
       FROM demandes_achat da
       WHERE da.statut = 'validee'
         AND DATE_TRUNC('month', da.date_demande) = DATE_TRUNC('month', CURRENT_DATE)
         ${agenceFilter}`
    );

    // Alertes stock (articles sous seuil)
    const alertesResult = await query(
      `SELECT COUNT(*) as count FROM articles a
       WHERE a.quantite_stock <= a.seuil_reappro
         ${agenceFilter.replace('da.', 'a.')}`
    );

    // Fournisseurs actifs
    const fournisseursResult = await query(
      `SELECT COUNT(*) as count FROM fournisseurs f
       WHERE f.actif = true
         ${agenceFilter.replace('da.', 'f.')}`
    );

    res.json({
      demandes_en_attente: parseInt(enAttenteResult.rows[0].count),
      demandes_validees: parseInt(valideesResult.rows[0].count),
      bons_commande_en_cours: parseInt(bonsCommandeResult.rows[0].count),
      montant_total: parseFloat(montantResult.rows[0].total),
      alertes_stock: parseInt(alertesResult.rows[0].count),
      fournisseurs_actifs: parseInt(fournisseursResult.rows[0].count)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/dashboard/demandes-recentes
 * @desc Obtenir demandes récentes
 * @access Private
 */
router.get('/demandes-recentes', authenticateJWT, async (req, res, next) => {
  try {
    const { agence, limit = 10 } = req.query;
    const userId = req.user.id;
    
    const agenceFilter = agence && !req.user.is_admin 
      ? `AND da.agence = '${agence}'`
      : '';

    const result = await query(
      `SELECT 
        da.id,
        da.reference,
        da.objet,
        da.statut,
        da.montant_total_estime,
        da.date_demande,
        u.nom as demandeur_nom,
        u.prenom as demandeur_prenom
      FROM demandes_achat da
      LEFT JOIN utilisateurs u ON da.demandeur_id = u.id
      WHERE da.demandeur_id = $1 ${agenceFilter}
      ORDER BY da.date_demande DESC
      LIMIT $2`,
      [userId, parseInt(limit)]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/dashboard/activites-recentes
 * @desc Obtenir activités récentes
 * @access Private
 */
router.get('/activites-recentes', authenticateJWT, async (req, res, next) => {
  try {
    // TODO: Implémenter table activités/logs
    res.json([]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
