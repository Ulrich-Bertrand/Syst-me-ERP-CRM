import { Pool } from 'pg';

export class ValidationsService {
  constructor(private db: Pool) {}

  /**
   * Récupérer DA en attente de validation
   */
  async getPending(params: {
    userId: string;
    userProfiles: any;
    niveau?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: any[]; pagination: any }> {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    // Déterminer niveaux que l'utilisateur peut valider
    const niveaux: number[] = [];
    if (params.userProfiles.profile_purchases_validate_level_1) niveaux.push(1);
    if (params.userProfiles.profile_purchases_validate_level_2) niveaux.push(2);
    if (params.userProfiles.profile_purchases_validate_level_3) niveaux.push(3);

    if (niveaux.length === 0) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      };
    }

    // Construire conditions
    const statutsConditions = niveaux.map((n, i) => `statut = $${i + 1}`).join(' OR ');
    const statuts = niveaux.map(n => `en_validation_niveau_${n}`);

    // Compter total
    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM demandes_achat WHERE ${statutsConditions}`,
      statuts
    );
    const total = parseInt(countResult.rows[0].count);

    // Récupérer données
    const dataResult = await this.db.query(
      `SELECT * FROM demandes_achat 
       WHERE ${statutsConditions}
       ORDER BY date_soumission ASC
       LIMIT $${statuts.length + 1} OFFSET $${statuts.length + 2}`,
      [...statuts, limit, offset]
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
   * Approuver une DA
   */
  async approve(params: {
    daId: string;
    userId: string;
    userName: string;
    userProfiles: any;
    commentaire?: string;
  }): Promise<any> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Récupérer DA
      const daResult = await client.query(
        'SELECT * FROM demandes_achat WHERE id = $1',
        [params.daId]
      );

      if (daResult.rows.length === 0) {
        throw new Error('Demande d\'achat non trouvée');
      }

      const demande = daResult.rows[0];

      // Vérifier statut
      if (!demande.statut.startsWith('en_validation_niveau_')) {
        throw new Error('Cette demande n\'est pas en attente de validation');
      }

      // Récupérer niveau actuel
      const niveauActuel = parseInt(demande.statut.replace('en_validation_niveau_', ''));

      // Vérifier permissions
      const canValidate = this.canUserValidateLevel(params.userProfiles, niveauActuel);
      if (!canValidate) {
        throw new Error('Vous n\'avez pas les permissions pour valider ce niveau');
      }

      // Récupérer workflow
      const workflow = demande.workflow_validation || { niveaux_requis: [], historique: [] };

      // Ajouter à l'historique
      workflow.historique.push({
        niveau: niveauActuel,
        decision: 'approuvee',
        valideur: params.userName,
        valideur_id: params.userId,
        date: new Date().toISOString(),
        commentaire: params.commentaire
      });

      // Déterminer prochain niveau
      const niveauxRestants = workflow.niveaux_requis.filter((n: number) => n > niveauActuel);
      
      let nouveauStatut: string;
      let dateValidationFinale = null;

      if (niveauxRestants.length === 0) {
        // Validation complète
        nouveauStatut = 'validee';
        dateValidationFinale = new Date();
        workflow.niveau_actuel = niveauActuel;
        workflow.statut_final = 'validee';
      } else {
        // Passer au niveau suivant
        const prochainNiveau = niveauxRestants[0];
        nouveauStatut = `en_validation_niveau_${prochainNiveau}`;
        workflow.niveau_actuel = niveauActuel;
      }

      // Mettre à jour DA
      await client.query(
        `UPDATE demandes_achat 
         SET statut = $1, workflow_validation = $2, date_validation_finale = $3, updated_at = NOW()
         WHERE id = $4`,
        [nouveauStatut, JSON.stringify(workflow), dateValidationFinale, params.daId]
      );

      await client.query('COMMIT');

      // Récupérer DA mise à jour
      const updatedResult = await client.query(
        'SELECT * FROM demandes_achat WHERE id = $1',
        [params.daId]
      );

      return updatedResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Rejeter une DA
   */
  async reject(params: {
    daId: string;
    userId: string;
    userName: string;
    userProfiles: any;
    motif: string;
    commentaire?: string;
  }): Promise<any> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Récupérer DA
      const daResult = await client.query(
        'SELECT * FROM demandes_achat WHERE id = $1',
        [params.daId]
      );

      if (daResult.rows.length === 0) {
        throw new Error('Demande d\'achat non trouvée');
      }

      const demande = daResult.rows[0];

      // Vérifier statut
      if (!demande.statut.startsWith('en_validation_niveau_')) {
        throw new Error('Cette demande n\'est pas en attente de validation');
      }

      // Récupérer niveau actuel
      const niveauActuel = parseInt(demande.statut.replace('en_validation_niveau_', ''));

      // Vérifier permissions
      const canValidate = this.canUserValidateLevel(params.userProfiles, niveauActuel);
      if (!canValidate) {
        throw new Error('Vous n\'avez pas les permissions pour rejeter ce niveau');
      }

      // Récupérer workflow
      const workflow = demande.workflow_validation || { niveaux_requis: [], historique: [] };

      // Ajouter à l'historique
      workflow.historique.push({
        niveau: niveauActuel,
        decision: 'rejetee',
        valideur: params.userName,
        valideur_id: params.userId,
        date: new Date().toISOString(),
        motif: params.motif,
        commentaire: params.commentaire
      });

      workflow.niveau_actuel = niveauActuel;
      workflow.statut_final = 'rejetee';

      // Mettre à jour DA
      await client.query(
        `UPDATE demandes_achat 
         SET statut = 'rejetee', workflow_validation = $1, updated_at = NOW()
         WHERE id = $2`,
        [JSON.stringify(workflow), params.daId]
      );

      await client.query('COMMIT');

      // Récupérer DA mise à jour
      const updatedResult = await client.query(
        'SELECT * FROM demandes_achat WHERE id = $1',
        [params.daId]
      );

      return updatedResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Demander clarifications
   */
  async requestClarification(params: {
    daId: string;
    userId: string;
    userName: string;
    questions: string;
  }): Promise<any> {
    const demande = await this.db.query(
      'SELECT * FROM demandes_achat WHERE id = $1',
      [params.daId]
    );

    if (demande.rows.length === 0) {
      throw new Error('Demande d\'achat non trouvée');
    }

    const workflow = demande.rows[0].workflow_validation || { historique: [] };

    // Ajouter clarification à l'historique
    workflow.historique.push({
      type: 'clarification',
      valideur: params.userName,
      valideur_id: params.userId,
      date: new Date().toISOString(),
      questions: params.questions
    });

    await this.db.query(
      'UPDATE demandes_achat SET workflow_validation = $1 WHERE id = $2',
      [JSON.stringify(workflow), params.daId]
    );

    return demande.rows[0];
  }

  /**
   * Historique validations d'une DA
   */
  async getHistory(daId: string): Promise<any[]> {
    const result = await this.db.query(
      'SELECT workflow_validation FROM demandes_achat WHERE id = $1',
      [daId]
    );

    if (result.rows.length === 0) {
      return [];
    }

    const workflow = result.rows[0].workflow_validation || { historique: [] };
    return workflow.historique || [];
  }

  /**
   * Statistiques validations
   */
  async getStats(params: {
    userId: string;
    userProfiles: any;
    date_debut?: string;
    date_fin?: string;
  }): Promise<any> {
    // Déterminer niveaux
    const niveaux: number[] = [];
    if (params.userProfiles.profile_purchases_validate_level_1) niveaux.push(1);
    if (params.userProfiles.profile_purchases_validate_level_2) niveaux.push(2);
    if (params.userProfiles.profile_purchases_validate_level_3) niveaux.push(3);

    if (niveaux.length === 0) {
      return {
        en_attente: 0,
        approuvees: 0,
        rejetees: 0,
        delai_moyen: 0
      };
    }

    // En attente
    const statutsConditions = niveaux.map((n, i) => `statut = $${i + 1}`).join(' OR ');
    const statuts = niveaux.map(n => `en_validation_niveau_${n}`);

    const enAttenteResult = await this.db.query(
      `SELECT COUNT(*) FROM demandes_achat WHERE ${statutsConditions}`,
      statuts
    );

    // Historique (simplifié - on compte dans workflow_validation)
    const statsResult = await this.db.query(
      `SELECT 
        COUNT(*) FILTER (WHERE statut = 'validee') as approuvees,
        COUNT(*) FILTER (WHERE statut = 'rejetee') as rejetees
       FROM demandes_achat
       WHERE workflow_validation::text LIKE '%${params.userId}%'`
    );

    return {
      en_attente: parseInt(enAttenteResult.rows[0].count),
      approuvees: parseInt(statsResult.rows[0].approuvees || '0'),
      rejetees: parseInt(statsResult.rows[0].rejetees || '0'),
      delai_moyen: 24 // TODO: Calculer réellement
    };
  }

  /**
   * Vérifier si utilisateur peut valider un niveau
   */
  private canUserValidateLevel(userProfiles: any, niveau: number): boolean {
    switch (niveau) {
      case 1:
        return userProfiles.profile_purchases_validate_level_1;
      case 2:
        return userProfiles.profile_purchases_validate_level_2;
      case 3:
        return userProfiles.profile_purchases_validate_level_3;
      default:
        return false;
    }
  }

  /**
   * Dashboard validateur
   */
  async getDashboard(params: {
    userId: string;
    userProfiles: any;
  }): Promise<any> {
    const stats = await this.getStats(params);
    const pending = await this.getPending({ ...params, page: 1, limit: 10 });

    return {
      stats,
      demandes_recentes: pending.data
    };
  }
}
