import { Pool } from 'pg';

interface DemandeAchatCreate {
  type_demande: string;
  objet: string;
  justification?: string;
  urgence?: string;
  dossier_id?: string;
  dossier_ref?: string;
  demandeur_id: string;
  demandeur_nom: string;
  demandeur_email?: string;
  agence: string;
  lignes: any[];
}

export class DemandesService {
  constructor(private db: Pool) {}

  /**
   * Générer numéro DA
   */
  async genererNumeroDemande(agence: string): Promise<string> {
    const annee = new Date().getFullYear();
    const prefixeAgence = agence === 'GHANA' ? 'GH' : agence === 'COTE_IVOIRE' ? 'CI' : 'BF';

    // Chercher ou créer série
    const result = await this.db.query(
      `INSERT INTO series_numerotation (type_serie, agence, annee, compteur)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (type_serie, agence, annee) 
       DO UPDATE SET compteur = series_numerotation.compteur + 1
       RETURNING compteur`,
      ['DA', agence, annee]
    );

    const compteur = result.rows[0].compteur;
    return `DA-${prefixeAgence}-${annee}-${String(compteur).padStart(3, '0')}`;
  }

  /**
   * Créer demande d'achat
   */
  async create(data: DemandeAchatCreate, userId: string): Promise<any> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Générer numéro
      const numeroDa = await this.genererNumeroDemande(data.agence);

      // Calculer montants
      let montantHT = 0;
      let montantTVA = 0;
      let montantTotal = 0;

      data.lignes.forEach((ligne: any) => {
        const ligneHT = (ligne.quantite || 0) * (ligne.prix_unitaire_estime || 0);
        const ligneTVA = ligneHT * ((ligne.taux_tva || 0) / 100);
        const ligneTTC = ligneHT + ligneTVA;

        montantHT += ligneHT;
        montantTVA += ligneTVA;
        montantTotal += ligneTTC;
      });

      // Déterminer workflow validation selon montant
      const workflowValidation = this.determinerWorkflowValidation(montantTotal);

      // Insérer DA
      const daResult = await client.query(
        `INSERT INTO demandes_achat (
          numero_da, type_demande, objet, justification, urgence,
          dossier_id, dossier_ref,
          demandeur_id, demandeur_nom, demandeur_email, agence,
          montant_ht, montant_tva, montant_total, devise,
          statut, workflow_validation, created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        ) RETURNING *`,
        [
          numeroDa, data.type_demande, data.objet, data.justification, data.urgence || 'normale',
          data.dossier_id, data.dossier_ref,
          data.demandeur_id, data.demandeur_nom, data.demandeur_email, data.agence,
          montantHT, montantTVA, montantTotal, 'GHS',
          'brouillon', JSON.stringify(workflowValidation), userId
        ]
      );

      const demande = daResult.rows[0];

      // Insérer lignes
      for (const ligne of data.lignes) {
        const ligneHT = (ligne.quantite || 0) * (ligne.prix_unitaire_estime || 0);
        const ligneTVA = ligneHT * ((ligne.taux_tva || 0) / 100);
        const ligneTTC = ligneHT + ligneTVA;

        await client.query(
          `INSERT INTO lignes_demande_achat (
            demande_achat_id, numero_ligne, designation, description, reference_article, categorie,
            quantite, unite, prix_unitaire_estime,
            montant_ht, taux_tva, montant_tva, montant_ttc,
            fournisseur_id, code_fournisseur, nom_fournisseur, compte_fournisseur,
            date_besoin, notes
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
          )`,
          [
            demande.id, ligne.numero_ligne, ligne.designation, ligne.description,
            ligne.reference_article, ligne.categorie,
            ligne.quantite, ligne.unite, ligne.prix_unitaire_estime,
            ligneHT, ligne.taux_tva || 0, ligneTVA, ligneTTC,
            ligne.fournisseur_id, ligne.code_fournisseur, ligne.nom_fournisseur, ligne.compte_fournisseur,
            ligne.date_besoin, ligne.notes
          ]
        );
      }

      await client.query('COMMIT');

      // Récupérer demande complète
      return await this.getById(demande.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Déterminer workflow validation selon montant
   */
  private determinerWorkflowValidation(montant: number): any {
    const niveauxRequis: number[] = [];

    // Niveau 1 : Purchasing Manager (toujours requis si montant > 0)
    if (montant > 0) {
      niveauxRequis.push(1);
    }

    // Niveau 2 : CFO (si montant > 5000)
    if (montant > 5000) {
      niveauxRequis.push(2);
    }

    // Niveau 3 : General Manager (si montant > 10000)
    if (montant > 10000) {
      niveauxRequis.push(3);
    }

    return {
      niveau_actuel: 0,
      niveaux_requis: niveauxRequis,
      historique: []
    };
  }

  /**
   * Récupérer DA par ID
   */
  async getById(id: string): Promise<any> {
    const daResult = await this.db.query(
      'SELECT * FROM demandes_achat WHERE id = $1',
      [id]
    );

    if (daResult.rows.length === 0) {
      throw new Error('Demande d\'achat non trouvée');
    }

    const demande = daResult.rows[0];

    // Récupérer lignes
    const lignesResult = await this.db.query(
      'SELECT * FROM lignes_demande_achat WHERE demande_achat_id = $1 ORDER BY numero_ligne',
      [id]
    );

    return {
      ...demande,
      lignes: lignesResult.rows
    };
  }

  /**
   * Liste paginée
   */
  async getAll(params: {
    page?: number;
    limit?: number;
    statut?: string;
    agence?: string;
    demandeur?: string;
    date_debut?: string;
    date_fin?: string;
    search?: string;
  }): Promise<{ data: any[]; pagination: any }> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    if (params.statut) {
      whereConditions.push(`statut = $${paramIndex++}`);
      queryParams.push(params.statut);
    }

    if (params.agence) {
      whereConditions.push(`agence = $${paramIndex++}`);
      queryParams.push(params.agence);
    }

    if (params.demandeur) {
      whereConditions.push(`demandeur_id = $${paramIndex++}`);
      queryParams.push(params.demandeur);
    }

    if (params.date_debut) {
      whereConditions.push(`date_creation >= $${paramIndex++}`);
      queryParams.push(params.date_debut);
    }

    if (params.date_fin) {
      whereConditions.push(`date_creation <= $${paramIndex++}`);
      queryParams.push(params.date_fin);
    }

    if (params.search) {
      whereConditions.push(`(numero_da ILIKE $${paramIndex} OR objet ILIKE $${paramIndex})`);
      queryParams.push(`%${params.search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Compter total
    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM demandes_achat ${whereClause}`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Récupérer données
    const dataResult = await this.db.query(
      `SELECT * FROM demandes_achat ${whereClause}
       ORDER BY date_creation DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Soumettre à validation
   */
  async submit(id: string): Promise<any> {
    const demande = await this.getById(id);

    if (demande.statut !== 'brouillon') {
      throw new Error('Seules les demandes brouillon peuvent être soumises');
    }

    const workflow = demande.workflow_validation || {};
    
    if (!workflow.niveaux_requis || workflow.niveaux_requis.length === 0) {
      // Pas de validation requise → valider directement
      await this.db.query(
        `UPDATE demandes_achat 
         SET statut = 'validee', date_validation_finale = NOW()
         WHERE id = $1`,
        [id]
      );
    } else {
      // Passer au niveau 1
      await this.db.query(
        `UPDATE demandes_achat 
         SET statut = 'en_validation_niveau_1', date_soumission = NOW()
         WHERE id = $1`,
        [id]
      );
    }

    return await this.getById(id);
  }

  /**
   * Dupliquer
   */
  async duplicate(id: string, userId: string): Promise<any> {
    const original = await this.getById(id);

    const duplicateData: DemandeAchatCreate = {
      type_demande: original.type_demande,
      objet: `[COPIE] ${original.objet}`,
      justification: original.justification,
      urgence: original.urgence,
      dossier_id: original.dossier_id,
      dossier_ref: original.dossier_ref,
      demandeur_id: original.demandeur_id,
      demandeur_nom: original.demandeur_nom,
      demandeur_email: original.demandeur_email,
      agence: original.agence,
      lignes: original.lignes.map((l: any) => ({
        numero_ligne: l.numero_ligne,
        designation: l.designation,
        description: l.description,
        reference_article: l.reference_article,
        categorie: l.categorie,
        quantite: l.quantite,
        unite: l.unite,
        prix_unitaire_estime: l.prix_unitaire_estime,
        fournisseur_id: l.fournisseur_id,
        code_fournisseur: l.code_fournisseur,
        nom_fournisseur: l.nom_fournisseur,
        notes: l.notes
      }))
    };

    return await this.create(duplicateData, userId);
  }

  /**
   * Supprimer
   */
  async delete(id: string): Promise<void> {
    const demande = await this.getById(id);

    if (demande.statut !== 'brouillon') {
      throw new Error('Seules les demandes brouillon peuvent être supprimées');
    }

    await this.db.query('DELETE FROM demandes_achat WHERE id = $1', [id]);
  }

  /**
   * Statistiques
   */
  async getStats(params: {
    agence?: string;
    date_debut?: string;
    date_fin?: string;
  }): Promise<any> {
    let whereConditions: string[] = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    if (params.agence) {
      whereConditions.push(`agence = $${paramIndex++}`);
      queryParams.push(params.agence);
    }

    if (params.date_debut) {
      whereConditions.push(`date_creation >= $${paramIndex++}`);
      queryParams.push(params.date_debut);
    }

    if (params.date_fin) {
      whereConditions.push(`date_creation <= $${paramIndex++}`);
      queryParams.push(params.date_fin);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const result = await this.db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE statut = 'brouillon') as brouillon,
        COUNT(*) FILTER (WHERE statut LIKE 'en_validation%') as en_validation,
        COUNT(*) FILTER (WHERE statut = 'validee') as validees,
        COUNT(*) FILTER (WHERE statut = 'rejetee') as rejetees,
        COALESCE(SUM(montant_total), 0) as montant_total,
        COALESCE(SUM(montant_total) FILTER (WHERE statut = 'validee'), 0) as montant_valide
       FROM demandes_achat ${whereClause}`,
      queryParams
    );

    return result.rows[0];
  }
}
