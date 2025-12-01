import { Router } from 'express';
import { PaiementsController } from '../controllers/paiements.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createPaiementSchema } from '../validators/paiements.validator';

const router = Router();
const controller = new PaiementsController();

router.use(authMiddleware);

/**
 * @route   GET /api/paiements
 * @desc    Liste des paiements
 * @access  Private
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/paiements/pending
 * @desc    Paiements en attente
 * @access  Private
 */
router.get('/pending', controller.getPending);

/**
 * @route   GET /api/paiements/stats
 * @desc    Statistiques paiements
 * @access  Private
 */
router.get('/stats', controller.getStats);

/**
 * @route   GET /api/paiements/:id
 * @desc    Détail paiement
 * @access  Private
 */
router.get('/:id', controller.getById);

/**
 * @route   POST /api/paiements
 * @desc    Créer un paiement
 * @access  Private (payment)
 * @body    PaiementCreate
 */
router.post(
  '/',
  validateRequest(createPaiementSchema),
  controller.create
);

/**
 * @route   POST /api/paiements/:id/upload-justificatif
 * @desc    Upload justificatif de paiement
 * @access  Private
 */
router.post(
  '/:id/upload-justificatif',
  uploadMiddleware.single('file'),
  controller.uploadJustificatif
);

/**
 * @route   POST /api/paiements/:id/validate
 * @desc    Valider paiement et justificatif
 * @access  Private (payment + validate)
 */
router.post('/:id/validate', controller.validate);

/**
 * @route   POST /api/paiements/:id/cancel
 * @desc    Annuler paiement
 * @access  Private
 */
router.post('/:id/cancel', controller.cancel);

export default router;
