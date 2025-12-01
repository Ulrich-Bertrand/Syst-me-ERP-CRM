import { Router } from 'express';
import { ValidationsController } from '../controllers/validations.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ValidationsController();

// Toutes les routes nécessitent authentification
router.use(authMiddleware);

/**
 * @route   GET /api/validations/pending
 * @desc    Liste des DA en attente de validation pour l'utilisateur
 * @access  Private (validateurs)
 * @query   niveau, agence, page, limit
 */
router.get('/pending', controller.getPending);

/**
 * @route   GET /api/validations/stats
 * @desc    Statistiques de validation pour l'utilisateur
 * @access  Private (validateurs)
 */
router.get('/stats', controller.getStats);

/**
 * @route   GET /api/validations/history/:daId
 * @desc    Historique des validations d'une DA
 * @access  Private
 */
router.get('/history/:daId', controller.getHistory);

/**
 * @route   POST /api/validations/:daId/approve
 * @desc    Approuver une demande d'achat
 * @access  Private (validateurs selon niveau)
 * @body    { commentaire?: string }
 */
router.post('/:daId/approve', controller.approve);

/**
 * @route   POST /api/validations/:daId/reject
 * @desc    Rejeter une demande d'achat
 * @access  Private (validateurs selon niveau)
 * @body    { motif: string, commentaire?: string }
 */
router.post('/:daId/reject', controller.reject);

/**
 * @route   POST /api/validations/:daId/request-clarification
 * @desc    Demander des clarifications
 * @access  Private (validateurs)
 * @body    { questions: string }
 */
router.post('/:daId/request-clarification', controller.requestClarification);

/**
 * @route   GET /api/validations/dashboard
 * @desc    Dashboard validateur
 * @access  Private (validateurs)
 */
router.get('/dashboard', controller.getDashboard);

export default router;
