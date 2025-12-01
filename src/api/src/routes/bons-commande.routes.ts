import { Router } from 'express';
import { BonsCommandeController } from '../controllers/bons-commande.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createReceptionSchema } from '../validators/bons-commande.validator';

const router = Router();
const controller = new BonsCommandeController();

// Toutes les routes nécessitent authentification
router.use(authMiddleware);

/**
 * @route   GET /api/bons-commande
 * @desc    Liste des bons de commande
 * @access  Private
 * @query   page, limit, statut, agence, fournisseur, date_debut, date_fin
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/bons-commande/stats
 * @desc    Statistiques BC
 * @access  Private
 */
router.get('/stats', controller.getStats);

/**
 * @route   GET /api/bons-commande/:id
 * @desc    Détail d'un bon de commande
 * @access  Private
 */
router.get('/:id', controller.getById);

/**
 * @route   POST /api/bons-commande/generate/:daId
 * @desc    Générer BC depuis DA validée
 * @access  Private (purchasing)
 * @body    { conditions_paiement, delai_livraison_jours, notes }
 */
router.post('/generate/:daId', controller.generateFromDA);

/**
 * @route   PUT /api/bons-commande/:id
 * @desc    Modifier BC (avant envoi)
 * @access  Private (purchasing)
 */
router.put('/:id', controller.update);

/**
 * @route   POST /api/bons-commande/:id/send
 * @desc    Envoyer BC au fournisseur
 * @access  Private (purchasing)
 * @body    { email_destinataire?, message? }
 */
router.post('/:id/send', controller.send);

/**
 * @route   POST /api/bons-commande/:id/confirm
 * @desc    Confirmer BC (par fournisseur ou manuellement)
 * @access  Private
 * @body    { date_confirmation, confirme_par?, notes? }
 */
router.post('/:id/confirm', controller.confirm);

/**
 * @route   POST /api/bons-commande/:id/receive
 * @desc    Enregistrer une réception
 * @access  Private (stock)
 * @body    ReceptionCreate
 */
router.post(
  '/:id/receive',
  validateRequest(createReceptionSchema),
  controller.receive
);

/**
 * @route   POST /api/bons-commande/:id/cancel
 * @desc    Annuler BC
 * @access  Private (purchasing + management)
 * @body    { motif_annulation: string }
 */
router.post('/:id/cancel', controller.cancel);

/**
 * @route   GET /api/bons-commande/:id/pdf
 * @desc    Générer et télécharger PDF du BC
 * @access  Private
 */
router.get('/:id/pdf', controller.downloadPDF);

/**
 * @route   GET /api/bons-commande/:id/receptions
 * @desc    Liste des réceptions d'un BC
 * @access  Private
 */
router.get('/:id/receptions', controller.getReceptions);

export default router;
