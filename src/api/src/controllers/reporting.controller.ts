import { Response, NextFunction } from 'express';

import { ReportingService } from '../services/reporting.service';
import { AuthRequest } from '../types/auth';

const SUPPORTED_FORMATS = ['excel', 'pdf', 'csv'];

export class ReportingController {
  private reportingService: ReportingService;

  constructor() {
    this.reportingService = new ReportingService();
  }

  /**
   * GET /api/reporting/dashboard
   */
  getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const { periode_debut, periode_fin, agence } = req.query;
      const data = await this.reportingService.getDashboard({
        periode_debut: periode_debut as string,
        periode_fin: periode_fin as string,
        agence: (agence as string) || req.user?.agence
      });

      console.log(data, ".......api..............");
      

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reporting/kpis
   */
  getKPIs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const { periode_debut, periode_fin, agence } = req.query;
      const data = await this.reportingService.getKPIs({
        periode_debut: periode_debut as string,
        periode_fin: periode_fin as string,
        agence: (agence as string) || req.user?.agence
      });

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reporting/fournisseur/:id
   */
  getRapportFournisseur = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const { id } = req.params;
      const data = await this.reportingService.getRapportFournisseur(id);

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reporting/budget
   */
  getRapportBudget = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const data = await this.reportingService.getRapportBudget();

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reporting/delais
   */
  getRapportDelais = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const data = await this.reportingService.getRapportDelais();

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reporting/evolution
   */
  getEvolution = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const data = await this.reportingService.getEvolution();

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reporting/top-fournisseurs
   */
  getTopFournisseurs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const { limite } = req.query;
      const limitNumber = limite ? Number(limite) : 5;

      const data = await this.reportingService.getTopFournisseurs(
        Number.isNaN(limitNumber) ? 5 : limitNumber
      );

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reporting/categories
   */
  getRepartitionCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const data = await this.reportingService.getRepartitionCategories();

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/reporting/export
   */
  generateExport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const { format, type_rapport, periode, filtres, options } = req.body;

      if (!format || !SUPPORTED_FORMATS.includes(format)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FORMAT',
            message: `Format invalide. Formats acceptés: ${SUPPORTED_FORMATS.join(', ')}`
          }
        });
      }

      if (!type_rapport) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_TYPE',
            message: 'Le type de rapport est requis'
          }
        });
      }

      if (!periode || !periode.debut || !periode.fin) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PERIODE',
            message: 'La période doit contenir une date de début et de fin'
          }
        });
      }

      const safeOptions = {
        inclure_details: options?.inclure_details ?? true,
        inclure_graphiques: options?.inclure_graphiques ?? true,
        inclure_logos: options?.inclure_logos ?? true,
        orientation: options?.orientation
      };

      const exportRecord = await this.reportingService.generateExport(
        {
          format,
          type_rapport,
          periode,
          filtres,
          options: safeOptions
        },
        req.user
      );

      res.status(201).json({
        success: true,
        data: exportRecord,
        message: 'Export généré avec succès'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reporting/exports
   */
  getExports = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const data = await this.reportingService.getExports();

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reporting/exports/:id/download
   */
  downloadExport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const { id } = req.params;
      const fileInfo = await this.reportingService.getExportFile(id);

      if (!fileInfo) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'EXPORT_NOT_FOUND',
            message: 'Export introuvable ou expiré'
          }
        });
      }

      res.download(fileInfo.filePath, fileInfo.fileName, (err) => {
        if (err) {
          next(err);
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/reporting/comparaison
   */
  getComparaison = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!this.ensureReportingAccess(req, res)) {
        return;
      }

      const data = await this.reportingService.getComparaison();

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  private ensureReportingAccess(req: AuthRequest, res: Response): boolean {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentification requise'
        }
      });
      return false;
    }

    const hasAccess = this.hasReportingPermission(req.user);

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Vous n\'avez pas accès au module Reporting'
        }
      });
      return false;
    }

    return true;
  }

  private hasReportingPermission(user: AuthRequest['user']): boolean {
    if (!user) {
      return false;
    }

    if (user.profiles && typeof user.profiles.profile_reporting_view !== 'undefined') {
      return Boolean(user.profiles.profile_reporting_view);
    }

    return Boolean((user as any).profile_reporting_view);
  }
}
