import { Router } from 'express';
import { StockController } from '../controllers/stock.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createArticleSchema, createMouvementSchema, createInventaireSchema } from '../validators/stock.validator';

const router = Router();
const controller = new StockController();

router.use(authMiddleware);

// ========== ARTICLES ==========

/**
 * @route   GET /api/articles
 * @desc    Liste des articles
 * @access  Private
 */
router.get('/', controller.getAllArticles);

/**
 * @route   GET /api/articles/alerts
 * @desc    Alertes stock (min/max/négatif)
 * @access  Private
 */
router.get('/alerts', controller.getAlerts);

/**
 * @route   GET /api/articles/stats
 * @desc    Statistiques stock
 * @access  Private
 */
router.get('/stats', controller.getStockStats);

/**
 * @route   GET /api/articles/:id
 * @desc    Détail article
 * @access  Private
 */
router.get('/:id', controller.getArticleById);

/**
 * @route   POST /api/articles
 * @desc    Créer article
 * @access  Private (stock_manage)
 */
router.post(
  '/',
  validateRequest(createArticleSchema),
  controller.createArticle
);

/**
 * @route   PUT /api/articles/:id
 * @desc    Modifier article
 * @access  Private (stock_manage)
 */
router.put('/:id', controller.updateArticle);

/**
 * @route   GET /api/articles/:id/mouvements
 * @desc    Mouvements d'un article
 * @access  Private
 */
router.get('/:id/mouvements', controller.getArticleMouvements);

/**
 * @route   GET /api/articles/:id/valorisation
 * @desc    Valorisation PMP de l'article
 * @access  Private
 */
router.get('/:id/valorisation', controller.getValorisation);

// ========== MOUVEMENTS STOCK ==========

/**
 * @route   GET /api/mouvements
 * @desc    Liste des mouvements de stock
 * @access  Private
 */
router.get('/', controller.getAllMouvements);

/**
 * @route   POST /api/mouvements
 * @desc    Créer mouvement manuel
 * @access  Private (stock_manage)
 * @body    MouvementCreate
 */
router.post(
  '/',
  validateRequest(createMouvementSchema),
  controller.createMouvement
);

/**
 * @route   GET /api/mouvements/:id
 * @desc    Détail mouvement
 * @access  Private
 */
router.get('/:id', controller.getMouvementById);

/**
 * @route   POST /api/mouvements/:id/validate
 * @desc    Valider mouvement
 * @access  Private (stock_manage)
 */
router.post('/:id/validate', controller.validateMouvement);

// ========== INVENTAIRES ==========

/**
 * @route   GET /api/inventaires
 * @desc    Liste des inventaires
 * @access  Private
 */
router.get('/', controller.getAllInventaires);

/**
 * @route   POST /api/inventaires
 * @desc    Créer inventaire
 * @access  Private (stock_manage)
 * @body    InventaireCreate
 */
router.post(
  '/',
  validateRequest(createInventaireSchema),
  controller.createInventaire
);

/**
 * @route   GET /api/inventaires/:id
 * @desc    Détail inventaire
 * @access  Private
 */
router.get('/:id', controller.getInventaireById);

/**
 * @route   PUT /api/inventaires/:id/ligne/:ligneId
 * @desc    Mettre à jour ligne inventaire (comptage)
 * @access  Private
 */
router.put('/:id/ligne/:ligneId', controller.updateLigneInventaire);

/**
 * @route   POST /api/inventaires/:id/validate
 * @desc    Valider inventaire et générer ajustements
 * @access  Private (stock_manage)
 */
router.post('/:id/validate', controller.validateInventaire);

export default router;
