import { Response, NextFunction } from 'express';
import { ValidationsService } from '../services/validations.service';
import { DemandesService } from '../services/demandes.service';
import { NotificationsService } from '../services/notifications.service';
import { AuthRequest } from '../types/auth';

export class ValidationsController {
  private validationsService: ValidationsService;
  private demandesService: DemandesService;
  private notificationsService: NotificationsService;

  constructor() {
    this.validationsService = new ValidationsService();
    this.demandesService = new DemandesService();
    this.notificationsService = new NotificationsService();
  }

  /**
   * GET /api/validations/pending
   * Liste des DA en attente de validation
   */
  getPending = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { niveau, page = 1, limit = 20 } = req.query;

      // Déterminer niveaux de validation pour cet utilisateur
      const niveaux = [];
      if (user.profiles.profile_purchases_validate_level_1) niveaux.push(1);
      if (user.profiles.profile_purchases_validate_level_2) niveaux.push(2);
      if (user.profiles.profile_purchases_validate_level_3) niveaux.push(3);

      if (niveaux.length === 0) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Vous n\'avez pas les droits de validation'
          }
        });
      }

      const result = await this.validationsService.getPendingValidations({
        userId: user.userId,
        niveaux: niveau ? [Number(niveau)] : niveaux,
        agence: user.agence,
        page: Number(page),
        limit: Number(limit)
      });

      res.json({
        success: true,
        data: result.data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total,
          totalPages: Math.ceil(result.total / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/validations/stats
   * Statistiques de validation
   */
  getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { date_debut, date_fin } = req.query;

      const stats = await this.validationsService.getValidatorStats({
        userId: user.userId,
        agence: user.agence,
        date_debut: date_debut as string,
        date_fin: date_fin as string
      });

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/validations/history/:daId
   * Historique des validations
   */
  getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { daId } = req.params;

      const demande = await this.demandesService.findById(daId);

      if (!demande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Demande d\'achat introuvable'
          }
        });
      }

      const history = demande.workflow_validation?.historique || [];

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/validations/:daId/approve
   * Approuver une demande
   */
  approve = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { daId } = req.params;
      const { commentaire } = req.body;
      const user = req.user!;

      // Récupérer demande
      const demande = await this.demandesService.findById(daId);

      if (!demande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Demande d\'achat introuvable'
          }
        });
      }

      // Vérifier si l'utilisateur peut valider
      const canValidate = await this.validationsService.canValidate(
        demande,
        user
      );

      if (!canValidate.allowed) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: canValidate.reason || 'Vous ne pouvez pas valider cette demande'
          }
        });
      }

      // Approuver
      const result = await this.validationsService.approve({
        demande,
        validateur: {
          userId: user.userId,
          nom: user.name,
          email: user.email
        },
        niveau: canValidate.niveau!,
        commentaire
      });

      // Envoyer notifications
      if (result.workflow_complet) {
        // Notifier demandeur : DA validée
        await this.notificationsService.sendValidationCompleteNotification({
          demandeId: daId,
          demandeur: demande.demandeur_email,
          numero_da: demande.numero_da
        });
      } else if (result.prochains_validateurs) {
        // Notifier prochains validateurs
        await this.notificationsService.sendValidationNotification({
          demandeId: daId,
          demandeur: demande.demandeur_nom,
          montant: demande.montant_total,
          validateurs: result.prochains_validateurs
        });
      }

      res.json({
        success: true,
        data: result.demande,
        message: result.workflow_complet 
          ? 'Demande validée avec succès'
          : `Demande approuvée au niveau ${canValidate.niveau}`
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/validations/:daId/reject
   * Rejeter une demande
   */
  reject = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { daId } = req.params;
      const { motif, commentaire } = req.body;
      const user = req.user!;

      if (!motif) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Le motif de rejet est obligatoire'
          }
        });
      }

      const demande = await this.demandesService.findById(daId);

      if (!demande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Demande d\'achat introuvable'
          }
        });
      }

      const canValidate = await this.validationsService.canValidate(
        demande,
        user
      );

      if (!canValidate.allowed) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: canValidate.reason || 'Vous ne pouvez pas valider cette demande'
          }
        });
      }

      // Rejeter
      const result = await this.validationsService.reject({
        demande,
        validateur: {
          userId: user.userId,
          nom: user.name,
          email: user.email
        },
        niveau: canValidate.niveau!,
        motif,
        commentaire
      });

      // Notifier demandeur
      await this.notificationsService.sendRejectionNotification({
        demandeId: daId,
        demandeur: demande.demandeur_email,
        numero_da: demande.numero_da,
        motif,
        validateur: user.name
      });

      res.json({
        success: true,
        data: result,
        message: 'Demande rejetée'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/validations/:daId/request-clarification
   * Demander des clarifications
   */
  requestClarification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { daId } = req.params;
      const { questions } = req.body;
      const user = req.user!;

      if (!questions) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Les questions sont obligatoires'
          }
        });
      }

      const demande = await this.demandesService.findById(daId);

      if (!demande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Demande d\'achat introuvable'
          }
        });
      }

      // Ajouter clarification au workflow
      const result = await this.validationsService.requestClarification({
        demande,
        validateur: user.name,
        questions
      });

      // Notifier demandeur
      await this.notificationsService.sendClarificationRequest({
        demandeId: daId,
        demandeur: demande.demandeur_email,
        numero_da: demande.numero_da,
        questions,
        validateur: user.name
      });

      res.json({
        success: true,
        data: result,
        message: 'Demande de clarification envoyée'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/validations/dashboard
   * Dashboard validateur
   */
  getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;

      const dashboard = await this.validationsService.getValidatorDashboard({
        userId: user.userId,
        agence: user.agence,
        profiles: user.profiles
      });

      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      next(error);
    }
  };
}
