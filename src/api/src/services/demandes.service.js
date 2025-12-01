const { query, transaction } = require('../config/database');

class DemandesService {
  /**
   * Créer une nouvelle demande d'achat
   */
  async create(userId, data) {
    return await transaction(async (client) => {
      // Générer référence unique
      const refResult = await client.query(
        `SELECT COALESCE(MAX(CAST(SUBSTRING(reference FROM 9) AS INTEGER)), 0) + 1 as next_num
         FROM demandes_achat 
         WHERE reference LIKE 'DA-' || TO_CHAR(NOW(), 'YYYY') || '-%'`
      );
      const nextNum = refResult.rows[0].next_num;
      const reference = `DA-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`;

      // Créer demande
      const demandeResult = await client.query(
        `INSERT INTO demandes_achat (
          reference, agence, demandeur_id, type, objet, justification,
          date_besoin, budget_id, centre_cout_id, statut
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'brouillon')
        RETURNING *`,
        [
          reference,
          data.agence,
          userId,
          data.type,
          data.objet,
          data.justification,
          data.date_besoin,
          data.budget_id || null,
          data.centre_cout_id || null
        ]
      );

      const demande = demandeResult.rows[0];

      // Créer lignes
      let montantTotal = 0;
      for (const ligne of data.lignes) {
        const montantLigne = (ligne.prix_unitaire_estime || 0) * ligne.quantite;
        montantTotal += montantLigne;

        await client.query(
          `INSERT INTO lignes_demande_achat (
            demande_achat_id, article_id, designation, quantite, unite,
            prix_unitaire_estime, montant_estime, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            demande.id,
            ligne.article_id || null,
            ligne.designation,
            ligne.quantite,
            ligne.unite,
            ligne.prix_unitaire_estime || 0,
            montantLigne,
            ligne.description || null
          ]
        );
      }

      // Mettre à jour montant total
      await client.query(
        'UPDATE demandes_achat SET montant_total_estime = $1 WHERE id = $2',
        [montantTotal, demande.id]
      );

      demande.montant_total_estime = montantTotal;
      return demande;
    });
  }

  /**
   * Obtenir toutes les demandes avec filtres
   */
  async getAll(filters = {}) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (filters.agence) {
      conditions.push(`da.agence = $${paramIndex}`);
      values.push(filters.agence);
      paramIndex++;
    }

    if (filters.statut) {
      conditions.push(`da.statut = $${paramIndex}`);
      values.push(filters.statut);
      paramIndex++;
    }

    if (filters.type) {
      conditions.push(`da.type = $${paramIndex}`);
      values.push(filters.type);
      paramIndex++;
    }

    if (filters.demandeur_id) {
      conditions.push(`da.demandeur_id = $${paramIndex}`);
      values.push(filters.demandeur_id);
      paramIndex++;
    }

    if (filters.date_debut) {
      conditions.push(`da.date_demande >= $${paramIndex}`);
      values.push(filters.date_debut);
      paramIndex++;
    }

    if (filters.date_fin) {
      conditions.push(`da.date_demande <= $${paramIndex}`);
      values.push(filters.date_fin);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const result = await query(
      `SELECT 
        da.*,
        u.nom as demandeur_nom,
        u.prenom as demandeur_prenom,
        (SELECT COUNT(*) FROM lignes_demande_achat WHERE demande_achat_id = da.id) as nombre_lignes
      FROM demandes_achat da
      LEFT JOIN utilisateurs u ON da.demandeur_id = u.id
      ${whereClause}
      ORDER BY da.date_demande DESC
      LIMIT ${filters.limit || 50}
      OFFSET ${((filters.page || 1) - 1) * (filters.limit || 50)}`,
      values
    );

    // Compter total
    const countResult = await query(
      `SELECT COUNT(*) as total FROM demandes_achat da ${whereClause}`,
      values
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: filters.page || 1,
      limit: filters.limit || 50
    };
  }

  /**
   * Obtenir une demande par ID avec ses lignes
   */
  async getById(id) {
    const demandeResult = await query(
      `SELECT 
        da.*,
        u.nom as demandeur_nom,
        u.prenom as demandeur_prenom,
        u.email as demandeur_email
      FROM demandes_achat da
      LEFT JOIN utilisateurs u ON da.demandeur_id = u.id
      WHERE da.id = $1`,
      [id]
    );

    if (demandeResult.rows.length === 0) {
      throw { statusCode: 404, message: 'Demande non trouvée' };
    }

    const demande = demandeResult.rows[0];

    // Récupérer lignes
    const lignesResult = await query(
      `SELECT * FROM lignes_demande_achat 
       WHERE demande_achat_id = $1 
       ORDER BY id`,
      [id]
    );

    demande.lignes = lignesResult.rows;

    // Récupérer historique validations
    const historiqueResult = await query(
      `SELECT 
        hv.*,
        u.nom as validateur_nom,
        u.prenom as validateur_prenom
      FROM historique_validations hv
      LEFT JOIN utilisateurs u ON hv.validateur_id = u.id
      WHERE hv.demande_achat_id = $1
      ORDER BY hv.date_validation DESC`,
      [id]
    );

    demande.historique_validations = historiqueResult.rows;

    return demande;
  }

  /**
   * Mettre à jour une demande
   */
  async update(id, userId, data) {
    return await transaction(async (client) => {
      // Vérifier que la demande existe et est en brouillon
      const checkResult = await client.query(
        'SELECT * FROM demandes_achat WHERE id = $1 AND demandeur_id = $2',
        [id, userId]
      );

      if (checkResult.rows.length === 0) {
        throw { statusCode: 404, message: 'Demande non trouvée ou non autorisée' };
      }

      const demande = checkResult.rows[0];

      if (demande.statut !== 'brouillon') {
        throw { statusCode: 400, message: 'Seules les demandes en brouillon peuvent être modifiées' };
      }

      // Mettre à jour demande
      const updates = [];
      const values = [];
      let paramIndex = 1;

      const allowedFields = ['type', 'objet', 'justification', 'date_besoin', 'budget_id', 'centre_cout_id'];

      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          updates.push(`${field} = $${paramIndex}`);
          values.push(data[field]);
          paramIndex++;
        }
      }

      if (updates.length > 0) {
        values.push(id);
        await client.query(
          `UPDATE demandes_achat 
           SET ${updates.join(', ')}, updated_at = NOW()
           WHERE id = $${paramIndex}`,
          values
        );
      }

      // Mettre à jour lignes si fournies
      if (data.lignes) {
        // Supprimer anciennes lignes
        await client.query(
          'DELETE FROM lignes_demande_achat WHERE demande_achat_id = $1',
          [id]
        );

        // Créer nouvelles lignes
        let montantTotal = 0;
        for (const ligne of data.lignes) {
          const montantLigne = (ligne.prix_unitaire_estime || 0) * ligne.quantite;
          montantTotal += montantLigne;

          await client.query(
            `INSERT INTO lignes_demande_achat (
              demande_achat_id, article_id, designation, quantite, unite,
              prix_unitaire_estime, montant_estime, description
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              id,
              ligne.article_id || null,
              ligne.designation,
              ligne.quantite,
              ligne.unite,
              ligne.prix_unitaire_estime || 0,
              montantLigne,
              ligne.description || null
            ]
          );
        }

        // Mettre à jour montant total
        await client.query(
          'UPDATE demandes_achat SET montant_total_estime = $1 WHERE id = $2',
          [montantTotal, id]
        );
      }

      return await this.getById(id);
    });
  }

  /**
   * Supprimer une demande (brouillon uniquement)
   */
  async delete(id, userId) {
    const result = await query(
      `DELETE FROM demandes_achat 
       WHERE id = $1 AND demandeur_id = $2 AND statut = 'brouillon'
       RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      throw { 
        statusCode: 400, 
        message: 'Demande non trouvée, non autorisée ou pas en brouillon' 
      };
    }

    return { message: 'Demande supprimée avec succès' };
  }

  /**
   * Soumettre une demande pour validation
   */
  async submit(id, userId) {
    const result = await query(
      `UPDATE demandes_achat 
       SET statut = 'en_validation_niveau_1', 
           date_soumission = NOW(),
           updated_at = NOW()
       WHERE id = $1 AND demandeur_id = $2 AND statut = 'brouillon'
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      throw { 
        statusCode: 400, 
        message: 'Demande non trouvée, non autorisée ou déjà soumise' 
      };
    }

    return result.rows[0];
  }
}

module.exports = new DemandesService();
