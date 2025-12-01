import { Router } from 'express';
import { ReportingController } from '../controllers/reporting.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ReportingController();

router.use(authMiddleware);

/**
 * @route   GET /api/reporting/dashboard
 * @desc    Dashboard achats complet
 * @access  Private
 * @query   periode_debut, periode_fin, agence
 */
router.get('/dashboard', controller.getDashboard);

/**
 * @route   GET /api/reporting/kpis
 * @desc    KPIs globaux en temps réel
 * @access  Private
 */
router.get('/kpis', controller.getKPIs);

/**
 * @route   GET /api/reporting/fournisseur/:id
 * @desc    Rapport performance fournisseur
 * @access  Private
 * @query   date_debut, date_fin
 */
router.get('/fournisseur/:id', controller.getRapportFournisseur);

/**
 * @route   GET /api/reporting/budget
 * @desc    Rapport budget vs consommé
 * @access  Private
 * @query   annee, agence
 */
router.get('/budget', controller.getRapportBudget);

/**
 * @route   GET /api/reporting/delais
 * @desc    Rapport délais (DA → Paiement)
 * @access  Private
 * @query   date_debut, date_fin, agence
 */
router.get('/delais', controller.getRapportDelais);

/**
 * @route   GET /api/reporting/evolution
 * @desc    Évolution des achats (graphique)
 * @access  Private
 * @query   periode, type (semaine/mois/trimestre)
 */
router.get('/evolution', controller.getEvolution);

/**
 * @route   GET /api/reporting/top-fournisseurs
 * @desc    Top fournisseurs par montant
 * @access  Private
 * @query   limite, date_debut, date_fin
 */
router.get('/top-fournisseurs', controller.getTopFournisseurs);

/**
 * @route   GET /api/reporting/categories
 * @desc    Répartition par catégories
 * @access  Private
 */
router.get('/categories', controller.getRepartitionCategories);

/**
 * @route   POST /api/reporting/export
 * @desc    Générer export (Excel/PDF/CSV)
 * @access  Private
 * @body    { format, type_rapport, periode, filtres, options }
 */
router.post('/export', controller.generateExport);

/**
 * @route   GET /api/reporting/exports
 * @desc    Liste des exports générés
 * @access  Private
 */
router.get('/exports', controller.getExports);

/**
 * @route   GET /api/reporting/exports/:id/download
 * @desc    Télécharger export
 * @access  Private
 */
router.get('/exports/:id/download', controller.downloadExport);

/**
 * @route   GET /api/reporting/comparaison
 * @desc    Comparaison vs période précédente
 * @access  Private
 * @query   date_debut, date_fin
 */
router.get('/comparaison', controller.getComparaison);

export default router;
