import { Response, NextFunction } from 'express';
import { BonsCommandeService } from '../services/bons-commande.service';
import { DemandesService } from '../services/demandes.service';
import { SeriesService } from '../services/series.service';
import { StockService } from '../services/stock.service';
import { NotificationsService } from '../services/notifications.service';
import { PDFService } from '../services/pdf.service';
import { AuthRequest } from '../types/auth';

export class BonsCommandeController {
  private bonsCommandeService: BonsCommandeService;
  private demandesService: DemandesService;
  private seriesService: SeriesService;
  private stockService: StockService;
  private notificationsService: NotificationsService;
  private pdfService: PDFService;

  constructor() {
    this.bonsCommandeService = new BonsCommandeService();
    this.demandesService = new DemandesService();
    this.seriesService = new SeriesService();
    this.stockService = new StockService();
    this.notificationsService = new NotificationsService();
    this.pdfService = new PDFService();
  }

  /**
   * GET /api/bons-commande
   */
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        limit = 20,
        statut,
        agence,
        fournisseur,
        date_debut,
        date_fin,
        search,
        sort = 'date_emission',
        order = 'desc'
      } = req.query;

      const filters = {
        statut: statut as string,
        agence: agence as string || req.user?.agence,
        fournisseur: fournisseur as string,
        date_debut: date_debut as string,
        date_fin: date_fin as string,
        search: search as string
      };

      const result = await this.bonsCommandeService.findAll({
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
   * GET /api/bons-commande/stats
   */
  getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { agence, date_debut, date_fin } = req.query;

      const stats = await this.bonsCommandeService.getStatistics({
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
   * GET /api/bons-commande/:id
   */
  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const bonCommande = await this.bonsCommandeService.findById(id);

      if (!bonCommande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bon de commande introuvable'
          }
        });
      }

      res.json({
        success: true,
        data: bonCommande
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/bons-commande/generate/:daId
   */
  generateFromDA = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { daId } = req.params;
      const user = req.user!;

      // Récupérer DA
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

      // Vérifier statut
      if (demande.statut !== 'validee') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Seules les DA validées peuvent générer un BC'
          }
        });
      }

      // Vérifier si BC déjà généré
      const existingBC = await this.bonsCommandeService.findByDemandeId(daId);
      if (existingBC) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'ALREADY_EXISTS',
            message: `BC ${existingBC.numero_bc} déjà généré pour cette DA`
          }
        });
      }

      // Générer numéro BC
      const numeroBC = await this.seriesService.generateNumber(
        'BC',
        user.agence
      );

      // Créer BC
      const bcData = {
        numero_bc: numeroBC,
        demande_achat_id: demande.id,
        demande_achat_ref: demande.numero_da,
        
        fournisseur: demande.lignes[0].fournisseur,
        compte_fournisseur: demande.lignes[0].compte_fournisseur,
        
        lignes: demande.lignes.map((ligne, index) => ({
          ...ligne,
          id: `LBC-${Date.now()}-${index}`,
          numero_ligne: ligne.numero_ligne,
          quantite_commandee: ligne.quantite,
          quantite_recue: 0
        })),
        
        montant_ht: demande.montant_ht,
        montant_tva: demande.montant_tva,
        montant_ttc: demande.montant_total,
        devise: demande.devise,
        
        conditions_paiement: req.body.conditions_paiement || demande.conditions_paiement,
        delai_livraison_jours: req.body.delai_livraison_jours || 7,
        
        date_emission: new Date().toISOString(),
        statut: 'brouillon',
        agence: user.agence,
        
        emis_par: user.userId,
        emis_par_nom: user.name,
        
        notes: req.body.notes,
        created_by: user.userId
      };

      const bonCommande = await this.bonsCommandeService.create(bcData);

      // Mettre à jour DA
      await this.demandesService.update(daId, {
        bon_commande_id: bonCommande.id,
        bon_commande_ref: numeroBC
      });

      res.status(201).json({
        success: true,
        data: bonCommande,
        message: `Bon de commande ${numeroBC} généré avec succès`
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/bons-commande/:id
   */
  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      const bonCommande = await this.bonsCommandeService.findById(id);

      if (!bonCommande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bon de commande introuvable'
          }
        });
      }

      // Vérifier statut
      if (!['brouillon', 'envoye'].includes(bonCommande.statut)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Seuls les BC en brouillon ou envoyés peuvent être modifiés'
          }
        });
      }

      const updateData = {
        ...req.body,
        updated_at: new Date().toISOString(),
        updated_by: user.userId
      };

      const updated = await this.bonsCommandeService.update(id, updateData);

      res.json({
        success: true,
        data: updated,
        message: 'Bon de commande modifié avec succès'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/bons-commande/:id/send
   */
  send = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { email_destinataire, message } = req.body;
      const user = req.user!;

      const bonCommande = await this.bonsCommandeService.findById(id);

      if (!bonCommande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bon de commande introuvable'
          }
        });
      }

      if (bonCommande.statut !== 'brouillon') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Seuls les BC en brouillon peuvent être envoyés'
          }
        });
      }

      // Générer PDF
      const pdfUrl = await this.pdfService.generateBonCommandePDF(bonCommande);

      // Mettre à jour statut
      const updated = await this.bonsCommandeService.update(id, {
        statut: 'envoye',
        date_envoi: new Date().toISOString(),
        envoye_par: user.userId,
        envoye_par_nom: user.name,
        pdf_url: pdfUrl
      });

      // Envoyer email au fournisseur
      await this.notificationsService.sendBCToSupplier({
        bonCommande: updated,
        destinataire: email_destinataire || bonCommande.fournisseur.email,
        message,
        pdfUrl
      });

      res.json({
        success: true,
        data: updated,
        message: 'Bon de commande envoyé au fournisseur'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/bons-commande/:id/confirm
   */
  confirm = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { date_confirmation, confirme_par, notes } = req.body;
      const user = req.user!;

      const bonCommande = await this.bonsCommandeService.findById(id);

      if (!bonCommande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bon de commande introuvable'
          }
        });
      }

      if (bonCommande.statut !== 'envoye') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Seuls les BC envoyés peuvent être confirmés'
          }
        });
      }

      const updated = await this.bonsCommandeService.update(id, {
        statut: 'confirme',
        date_confirmation: date_confirmation || new Date().toISOString(),
        confirme_par: confirme_par || bonCommande.fournisseur.nom,
        notes_confirmation: notes
      });

      res.json({
        success: true,
        data: updated,
        message: 'Bon de commande confirmé'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/bons-commande/:id/receive
   */
  receive = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      // Vérifier profil stock
      if (!user.profiles.profile_stock_manage) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Profil insuffisant pour enregistrer une réception'
          }
        });
      }

      const bonCommande = await this.bonsCommandeService.findById(id);

      if (!bonCommande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bon de commande introuvable'
          }
        });
      }

      if (!['confirme', 'reception_partielle'].includes(bonCommande.statut)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Le BC doit être confirmé pour enregistrer une réception'
          }
        });
      }

      // Créer réception
      const reception = await this.bonsCommandeService.createReception({
        ...req.body,
        bon_commande_id: id,
        numero_bc: bonCommande.numero_bc,
        receptionne_par: user.userId,
        receptionne_par_nom: user.name,
        date_reception: new Date().toISOString()
      });

      // Créer mouvements stock automatiques
      for (const ligne of reception.lignes) {
        if (ligne.quantite_recue > 0) {
          await this.stockService.createMouvementFromReception({
            article_id: ligne.article_id,
            quantite: ligne.quantite_recue,
            prix_unitaire: ligne.prix_unitaire,
            bon_commande_id: id,
            bon_commande_ref: bonCommande.numero_bc,
            reception_id: reception.id,
            bon_livraison_ref: reception.bon_livraison_ref,
            user
          });
        }
      }

      // Mettre à jour statut BC
      const totalCommande = bonCommande.lignes.reduce((sum, l) => sum + l.quantite_commandee, 0);
      const totalRecu = bonCommande.receptions
        .flatMap(r => r.lignes)
        .reduce((sum, l) => sum + l.quantite_recue, 0) + 
        reception.lignes.reduce((sum, l) => sum + l.quantite_recue, 0);

      const nouveauStatut = totalRecu >= totalCommande 
        ? 'reception_complete' 
        : 'reception_partielle';

      await this.bonsCommandeService.update(id, {
        statut: nouveauStatut,
        receptions: [...bonCommande.receptions, reception]
      });

      res.status(201).json({
        success: true,
        data: reception,
        message: 'Réception enregistrée et stock mis à jour automatiquement'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/bons-commande/:id/cancel
   */
  cancel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { motif_annulation } = req.body;
      const user = req.user!;

      if (!motif_annulation) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Motif d\'annulation requis'
          }
        });
      }

      const bonCommande = await this.bonsCommandeService.findById(id);

      if (!bonCommande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bon de commande introuvable'
          }
        });
      }

      if (bonCommande.statut === 'annule') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ALREADY_CANCELLED',
            message: 'Ce BC est déjà annulé'
          }
        });
      }

      const updated = await this.bonsCommandeService.update(id, {
        statut: 'annule',
        date_annulation: new Date().toISOString(),
        annule_par: user.userId,
        motif_annulation
      });

      res.json({
        success: true,
        data: updated,
        message: 'Bon de commande annulé'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/bons-commande/:id/pdf
   */
  downloadPDF = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const bonCommande = await this.bonsCommandeService.findById(id);

      if (!bonCommande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bon de commande introuvable'
          }
        });
      }

      const pdfBuffer = await this.pdfService.generateBonCommandePDF(bonCommande);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="BC-${bonCommande.numero_bc}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/bons-commande/:id/receptions
   */
  getReceptions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const bonCommande = await this.bonsCommandeService.findById(id);

      if (!bonCommande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bon de commande introuvable'
          }
        });
      }

      res.json({
        success: true,
        data: bonCommande.receptions || []
      });
    } catch (error) {
      next(error);
    }
  };
}
