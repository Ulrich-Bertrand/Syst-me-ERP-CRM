import { Router } from 'express';
import { DemandesController } from '../controllers/demandes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createDemandeSchema, updateDemandeSchema } from '../validators/demandes.validator';

const router = Router();
const controller = new DemandesController();

// Toutes les routes nécessitent authentification
router.use(authMiddleware);

/**
 * @route   GET /api/demandes
 * @desc    Liste des demandes d'achat
 * @access  Private
 * @query   page, limit, statut, agence, demandeur, date_debut, date_fin, search
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/demandes/stats
 * @desc    Statistiques des demandes d'achat
 * @access  Private
 */
router.get('/stats', controller.getStats);

/**
 * @route   GET /api/demandes/:id
 * @desc    Détail d'une demande d'achat
 * @access  Private
 */
router.get('/:id', controller.getById);

/**
 * @route   POST /api/demandes
 * @desc    Créer une demande d'achat
 * @access  Private (profile_purchases_create)
 * @body    DemandeAchatCreate
 */
router.post(
  '/',
  validateRequest(createDemandeSchema),
  controller.create
);

/**
 * @route   PUT /api/demandes/:id
 * @desc    Modifier une demande d'achat
 * @access  Private (créateur uniquement, statut brouillon)
 */
router.put(
  '/:id',
  validateRequest(updateDemandeSchema),
  controller.update
);

/**
 * @route   DELETE /api/demandes/:id
 * @desc    Supprimer une demande d'achat
 * @access  Private (créateur uniquement, statut brouillon)
 */
router.delete('/:id', controller.delete);

/**
 * @route   POST /api/demandes/:id/submit
 * @desc    Soumettre une demande d'achat à validation
 * @access  Private (créateur uniquement)
 */
router.post('/:id/submit', controller.submit);

/**
 * @route   POST /api/demandes/:id/duplicate
 * @desc    Dupliquer une demande d'achat
 * @access  Private
 */
router.post('/:id/duplicate', controller.duplicate);

/**
 * @route   GET /api/demandes/:id/history
 * @desc    Historique des modifications
 * @access  Private
 */
router.get('/:id/history', controller.getHistory);

export default router;
