import { Request, Response, NextFunction } from 'express';
import { DemandesService } from '../services/demandes.service';
// import { SeriesService } from '../services/series.service';
// import { NotificationsService } from '../services/notifications.service';
import { AuthRequest } from '../types/auth';

export class DemandesController {
  private demandesService: DemandesService;
  // private seriesService: SeriesService;
  // private notificationsService: NotificationsService;

  constructor() {
    this.demandesService = new DemandesService();
    // this.seriesService = new SeriesService();
    // this.notificationsService = new NotificationsService();
  }

  /**
   * GET /api/demandes
   * Liste des demandes d'achat avec filtres et pagination
   */
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        limit = 20,
        statut,
        agence,
        demandeur,
        date_debut,
        date_fin,
        search,
        sort = 'date_creation',
        order = 'desc'
      } = req.query;

      const filters = {
        statut: statut as string,
        agence: agence as string || req.user?.agence,
        demandeur: demandeur as string,
        date_debut: date_debut as string,
        date_fin: date_fin as string,
        search: search as string
      };

      const result = await this.demandesService.findAll({
        page: Number(page),
        limit: Number(limit),
        filters,
        sort: sort as string,
        order: order as 'asc' | 'desc'
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
   * GET /api/demandes/stats
   * Statistiques des demandes d'achat
   */
  getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { agence, date_debut, date_fin } = req.query;

      const stats = await this.demandesService.getStatistics({
        agence: agence as string || req.user?.agence,
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
   * GET /api/demandes/:id
   * Détail d'une demande d'achat
   */
  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const demande = await this.demandesService.findById(id);

      if (!demande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Demande d\'achat introuvable'
          }
        });
      }

      res.json({
        success: true,
        data: demande
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/demandes
   * Créer une demande d'achat
   */
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;

      // Vérifier profil
      if (!user.profiles.profile_purchases_create) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Profil insuffisant pour créer une DA'
          }
        });
      }

      // Générer numéro DA
      const numeroDa = await this.seriesService.generateNumber(
        'DA',
        user.agence
      );

      // Créer demande
      const demandeData = {
        ...req.body,
        numero_da: numeroDa,
        demandeur_id: user.userId,
        demandeur_nom: user.name,
        demandeur_email: user.email,
        agence: user.agence,
        statut: 'brouillon',
        date_creation: new Date().toISOString(),
        created_by: user.userId
      };

      const demande = await this.demandesService.create(demandeData);

      res.status(201).json({
        success: true,
        data: demande,
        message: `Demande d'achat ${numeroDa} créée avec succès`
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/demandes/:id
   * Modifier une demande d'achat
   */
  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      // Récupérer demande existante
      const demande = await this.demandesService.findById(id);

      if (!demande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Demande d\'achat introuvable'
          }
        });
      }

      // Vérifier permissions
      if (demande.demandeur_id !== user.userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Vous ne pouvez modifier que vos propres demandes'
          }
        });
      }

      // Vérifier statut
      if (demande.statut !== 'brouillon') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Seules les demandes en brouillon peuvent être modifiées'
          }
        });
      }

      // Mettre à jour
      const updateData = {
        ...req.body,
        updated_at: new Date().toISOString(),
        updated_by: user.userId
      };

      const updated = await this.demandesService.update(id, updateData);

      res.json({
        success: true,
        data: updated,
        message: 'Demande d\'achat modifiée avec succès'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/demandes/:id
   * Supprimer une demande d'achat
   */
  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      const demande = await this.demandesService.findById(id);

      if (!demande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Demande d\'achat introuvable'
          }
        });
      }

      // Vérifier permissions
      if (demande.demandeur_id !== user.userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Vous ne pouvez supprimer que vos propres demandes'
          }
        });
      }

      // Vérifier statut
      if (demande.statut !== 'brouillon') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Seules les demandes en brouillon peuvent être supprimées'
          }
        });
      }

      await this.demandesService.delete(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/demandes/:id/submit
   * Soumettre une demande d'achat à validation
   */
  submit = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      const demande = await this.demandesService.findById(id);

      if (!demande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Demande d\'achat introuvable'
          }
        });
      }

      // Vérifier permissions
      if (demande.demandeur_id !== user.userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Vous ne pouvez soumettre que vos propres demandes'
          }
        });
      }

      // Vérifier statut
      if (demande.statut !== 'brouillon') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Seules les demandes en brouillon peuvent être soumises'
          }
        });
      }

      // Déterminer workflow de validation
      const workflow = await this.demandesService.determineValidationWorkflow(demande);

      // Mettre à jour statut
      const updated = await this.demandesService.update(id, {
        statut: workflow.statut_initial,
        workflow_validation: workflow,
        date_soumission: new Date().toISOString(),
        submitted_by: user.userId
      });

      // Envoyer notifications
      // await this.notificationsService.sendValidationNotification({
      //   demandeId: id,
      //   demandeur: user.name,
      //   montant: demande.montant_total,
      //   validateurs: workflow.validateurs_niveau_1
      // });

      res.json({
        success: true,
        data: updated,
        message: 'Demande soumise à validation avec succès'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/demandes/:id/duplicate
   * Dupliquer une demande d'achat
   */
  duplicate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      const demande = await this.demandesService.findById(id);

      if (!demande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Demande d\'achat introuvable'
          }
        });
      }

      // Générer nouveau numéro
      const numeroDa = await this.seriesService.generateNumber(
        'DA',
        user.agence
      );

      // Créer copie
      const duplicateData = {
        ...demande,
        id: undefined,
        numero_da: numeroDa,
        statut: 'brouillon',
        demandeur_id: user.userId,
        demandeur_nom: user.name,
        date_creation: new Date().toISOString(),
        created_by: user.userId,
        workflow_validation: undefined
      };

      const duplicate = await this.demandesService.create(duplicateData);

      res.status(201).json({
        success: true,
        data: duplicate,
        message: `Demande dupliquée sous le numéro ${numeroDa}`
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/demandes/:id/history
   * Historique des modifications
   */
  getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const history = await this.demandesService.getHistory(id);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      next(error);
    }
  };
}
