import { Response, NextFunction } from 'express';
import { FacturesService } from '../services/factures.service';
import { BonsCommandeService } from '../services/bons-commande.service';
import { Controle3VoiesService } from '../services/controle-3-voies.service';
import { NotificationsService } from '../services/notifications.service';
import { AuthRequest } from '../types/auth';

export class FacturesController {
  private facturesService: FacturesService;
  private bonsCommandeService: BonsCommandeService;
  private controle3VoiesService: Controle3VoiesService;
  private notificationsService: NotificationsService;

  constructor() {
    this.facturesService = new FacturesService();
    this.bonsCommandeService = new BonsCommandeService();
    this.controle3VoiesService = new Controle3VoiesService();
    this.notificationsService = new NotificationsService();
  }

  /**
   * GET /api/factures
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
        sort = 'date_facture',
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

      const result = await this.facturesService.findAll({
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
   * GET /api/factures/stats
   */
  getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { agence, date_debut, date_fin } = req.query;

      const stats = await this.facturesService.getStatistics({
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
   * GET /api/factures/unpaid
   */
  getUnpaid = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { agence } = req.query;

      const factures = await this.facturesService.getUnpaidInvoices({
        agence: agence as string || req.user?.agence
      });

      res.json({
        success: true,
        data: factures
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/factures/overdue
   */
  getOverdue = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { agence } = req.query;

      const factures = await this.facturesService.getOverdueInvoices({
        agence: agence as string || req.user?.agence
      });

      res.json({
        success: true,
        data: factures
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/factures/:id
   */
  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const facture = await this.facturesService.findById(id);

      if (!facture) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Facture introuvable'
          }
        });
      }

      res.json({
        success: true,
        data: facture
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/factures
   */
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { bon_commande_id, numero_facture, date_facture, date_echeance, lignes } = req.body;

      // Récupérer BC
      const bonCommande = await this.bonsCommandeService.findById(bon_commande_id);

      if (!bonCommande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bon de commande introuvable'
          }
        });
      }

      // Vérifier si BC réceptionné
      if (!['reception_partielle', 'reception_complete'].includes(bonCommande.statut)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Le BC doit être réceptionné avant de créer une facture'
          }
        });
      }

      // Vérifier si facture existe déjà
      const existing = await this.facturesService.findByNumeroFacture(numero_facture);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'ALREADY_EXISTS',
            message: 'Une facture avec ce numéro existe déjà'
          }
        });
      }

      // Calculer totaux
      const montant_ht = lignes.reduce((sum: number, l: any) => sum + l.montant_ht, 0);
      const montant_tva = lignes.reduce((sum: number, l: any) => sum + (l.montant_tva || 0), 0);
      const montant_ttc = montant_ht + montant_tva;

      // Créer facture
      const factureData = {
        numero_facture,
        numero_interne: await this.facturesService.generateNumeroInterne(),
        
        demande_achat_id: bonCommande.demande_achat_id,
        demande_achat_ref: bonCommande.demande_achat_ref,
        bon_commande_id: bonCommande.id,
        bon_commande_ref: bonCommande.numero_bc,
        
        fournisseur: bonCommande.fournisseur,
        
        date_facture,
        date_echeance,
        date_reception_facture: new Date().toISOString(),
        date_saisie: new Date().toISOString(),
        
        lignes,
        
        montant_ht,
        montant_total_tva: montant_tva,
        montant_ttc,
        devise: bonCommande.devise,
        
        montant_paye: 0,
        montant_restant: montant_ttc,
        paiements: [],
        
        statut: 'saisie',
        en_litige: false,
        
        fichiers_annexes: [],
        
        saisie_par: user.name,
        saisie_le: new Date().toISOString()
      };

      const facture = await this.facturesService.create(factureData);

      res.status(201).json({
        success: true,
        data: facture,
        message: `Facture ${numero_facture} créée avec succès`
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/factures/:id/upload
   */
  uploadPDF = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'Aucun fichier fourni'
          }
        });
      }

      const facture = await this.facturesService.findById(id);

      if (!facture) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Facture introuvable'
          }
        });
      }

      // Sauvegarder fichier
      const fileUrl = `/uploads/factures/${file.filename}`;

      const updated = await this.facturesService.update(id, {
        fichier_facture_url: fileUrl
      });

      res.json({
        success: true,
        data: {
          facture: updated,
          file: {
            url: fileUrl,
            name: file.originalname,
            size: file.size
          }
        },
        message: 'Fichier uploadé avec succès'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/factures/:id/controle-3-voies
   */
  executeControle3Voies = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      const facture = await this.facturesService.findById(id);

      if (!facture) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Facture introuvable'
          }
        });
      }

      // Récupérer BC
      const bonCommande = await this.bonsCommandeService.findById(facture.bon_commande_id!);

      if (!bonCommande) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bon de commande introuvable'
          }
        });
      }

      // Effectuer contrôle 3 voies
      const controle = await this.controle3VoiesService.execute({
        facture,
        bonCommande,
        effectuePar: user.name
      });

      // Mettre à jour facture
      const nouveauStatut = controle.conforme ? 'controlee' : 'ecart_detecte';
      
      const updated = await this.facturesService.update(id, {
        controle_3_voies: controle,
        statut: nouveauStatut
      });

      // Envoyer notifications si écarts
      if (!controle.conforme && controle.ecarts_detectes.length > 0) {
        await this.notificationsService.sendEcartDetecteNotification({
          factureId: id,
          numero_facture: facture.numero_facture,
          ecarts: controle.ecarts_detectes,
          gravite: controle.ecarts_detectes.some(e => e.gravite === 'haute') ? 'haute' : 'moyenne'
        });
      }

      res.json({
        success: true,
        data: {
          facture: updated,
          controle
        },
        message: controle.conforme 
          ? 'Contrôle 3 voies: Conforme' 
          : `Contrôle 3 voies: ${controle.ecarts_detectes.length} écart(s) détecté(s)`
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/factures/:id/validate
   */
  validateForPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { commentaire } = req.body;
      const user = req.user!;

      // Vérifier profil
      if (!user.profiles.profile_invoices_validate) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Profil insuffisant pour valider des factures'
          }
        });
      }

      const facture = await this.facturesService.findById(id);

      if (!facture) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Facture introuvable'
          }
        });
      }

      if (!['controlee', 'ecart_detecte'].includes(facture.statut)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'La facture doit être contrôlée avant validation'
          }
        });
      }

      const updated = await this.facturesService.update(id, {
        statut: 'validee_paiement',
        validee_par: user.name,
        validee_le: new Date().toISOString(),
        notes: commentaire
      });

      // Notifier trésorerie
      await this.notificationsService.sendFactureValideeNotification({
        factureId: id,
        numero_facture: facture.numero_facture,
        fournisseur: facture.fournisseur.nom,
        montant: facture.montant_ttc,
        devise: facture.devise
      });

      res.json({
        success: true,
        data: updated,
        message: 'Facture validée pour paiement'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/factures/:id/reject
   */
  reject = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { motif } = req.body;
      const user = req.user!;

      if (!user.profiles.profile_invoices_validate) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Profil insuffisant pour rejeter des factures'
          }
        });
      }

      if (!motif) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Le motif de rejet est obligatoire'
          }
        });
      }

      const facture = await this.facturesService.findById(id);

      if (!facture) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Facture introuvable'
          }
        });
      }

      const updated = await this.facturesService.update(id, {
        statut: 'litige',
        en_litige: true,
        motif_litige: motif,
        date_litige: new Date().toISOString()
      });

      res.json({
        success: true,
        data: updated,
        message: 'Facture rejetée'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/factures/:id
   */
  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user!;

      const facture = await this.facturesService.findById(id);

      if (!facture) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Facture introuvable'
          }
        });
      }

      if (!['saisie', 'controlee'].includes(facture.statut)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Seules les factures en saisie ou contrôlées peuvent être modifiées'
          }
        });
      }

      const updateData = {
        ...req.body,
        updated_at: new Date().toISOString(),
        updated_by: user.userId
      };

      const updated = await this.facturesService.update(id, updateData);

      res.json({
        success: true,
        data: updated,
        message: 'Facture modifiée avec succès'
      });
    } catch (error) {
      next(error);
    }
  };
}
