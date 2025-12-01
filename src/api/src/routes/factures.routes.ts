import { Router } from 'express';
import { FacturesController } from '../controllers/factures.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createFactureSchema } from '../validators/factures.validator';

const router = Router();
const controller = new FacturesController();

// Toutes les routes nécessitent authentification
router.use(authMiddleware);

/**
 * @route   GET /api/factures
 * @desc    Liste des factures fournisseurs
 * @access  Private
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/factures/stats
 * @desc    Statistiques factures
 * @access  Private
 */
router.get('/stats', controller.getStats);

/**
 * @route   GET /api/factures/unpaid
 * @desc    Factures impayées
 * @access  Private
 */
router.get('/unpaid', controller.getUnpaid);

/**
 * @route   GET /api/factures/overdue
 * @desc    Factures en retard
 * @access  Private
 */
router.get('/overdue', controller.getOverdue);

/**
 * @route   GET /api/factures/:id
 * @desc    Détail facture
 * @access  Private
 */
router.get('/:id', controller.getById);

/**
 * @route   POST /api/factures
 * @desc    Créer facture fournisseur
 * @access  Private (accounting)
 * @body    FactureCreate
 */
router.post(
  '/',
  validateRequest(createFactureSchema),
  controller.create
);

/**
 * @route   POST /api/factures/:id/upload
 * @desc    Upload PDF facture
 * @access  Private
 */
router.post(
  '/:id/upload',
  uploadMiddleware.single('file'),
  controller.uploadPDF
);

/**
 * @route   POST /api/factures/:id/controle-3-voies
 * @desc    Effectuer contrôle 3 voies automatique
 * @access  Private
 */
router.post('/:id/controle-3-voies', controller.executeControle3Voies);

/**
 * @route   POST /api/factures/:id/validate
 * @desc    Valider facture pour paiement
 * @access  Private (invoices_validate)
 */
router.post('/:id/validate', controller.validateForPayment);

/**
 * @route   POST /api/factures/:id/reject
 * @desc    Rejeter facture
 * @access  Private (invoices_validate)
 */
router.post('/:id/reject', controller.reject);

/**
 * @route   PUT /api/factures/:id
 * @desc    Modifier facture (avant validation)
 * @access  Private
 */
router.put('/:id', controller.update);

export default router;
