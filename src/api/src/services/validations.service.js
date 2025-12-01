const { query, transaction } = require('../config/database');

class ValidationsService {
  /**
   * Obtenir demandes à valider pour un utilisateur
   */
  async getDemandesAValider(userId, user, filters = {}) {
    // Déterminer quel niveau l'utilisateur peut valider
    let niveaux = [];
    if (user.profile_purchases_validate_level_1) niveaux.push('en_validation_niveau_1');
    if (user.profile_purchases_validate_level_2) niveaux.push('en_validation_niveau_2');
    if (user.profile_purchases_validate_level_3) niveaux.push('en_validation_niveau_3');

    if (niveaux.length === 0) {
      throw { statusCode: 403, message: 'Vous n\'avez pas de profil validateur' };
    }

    const conditions = [`da.statut IN (${niveaux.map((_, i) => `$${i + 1}`).join(', ')})`];
    const values = [...niveaux];
    let paramIndex = niveaux.length + 1;

    // Filtres supplémentaires
    if (filters.agence) {
      conditions.push(`da.agence = $${paramIndex}`);
      values.push(filters.agence);
      paramIndex++;
    }

    if (filters.type) {
      conditions.push(`da.type = $${paramIndex}`);
      values.push(filters.type);
      paramIndex++;
    }

    const result = await query(
      `SELECT 
        da.*,
        u.nom as demandeur_nom,
        u.prenom as demandeur_prenom,
        (SELECT COUNT(*) FROM lignes_demande_achat WHERE demande_achat_id = da.id) as nombre_lignes
      FROM demandes_achat da
      LEFT JOIN utilisateurs u ON da.demandeur_id = u.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY 
        CASE da.type
          WHEN 'URGENTE' THEN 1
          WHEN 'EXCEPTIONNELLE' THEN 2
          ELSE 3
        END,
        da.date_soumission ASC
      LIMIT ${filters.limit || 50}
      OFFSET ${((filters.page || 1) - 1) * (filters.limit || 50)}`,
      values
    );

    // Compter total
    const countResult = await query(
      `SELECT COUNT(*) as total FROM demandes_achat da WHERE ${conditions.join(' AND ')}`,
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
   * Valider une demande
   */
  async valider(demandeId, validateurId, user, commentaire = null) {
    return await transaction(async (client) => {
      // Récupérer demande
      const demandeResult = await client.query(
        'SELECT * FROM demandes_achat WHERE id = $1',
        [demandeId]
      );

      if (demandeResult.rows.length === 0) {
        throw { statusCode: 404, message: 'Demande non trouvée' };
      }

      const demande = demandeResult.rows[0];

      // Déterminer niveau de validation
      let niveauActuel = 0;
      let niveauSuivant = null;
      let nouveauStatut = null;

      switch (demande.statut) {
        case 'en_validation_niveau_1':
          if (!user.profile_purchases_validate_level_1) {
            throw { statusCode: 403, message: 'Vous n\'avez pas le profil pour valider niveau 1' };
          }
          niveauActuel = 1;
          niveauSuivant = 2;
          nouveauStatut = 'en_validation_niveau_2';
          break;

        case 'en_validation_niveau_2':
          if (!user.profile_purchases_validate_level_2) {
            throw { statusCode: 403, message: 'Vous n\'avez pas le profil pour valider niveau 2' };
          }
          niveauActuel = 2;
          niveauSuivant = 3;
          nouveauStatut = 'en_validation_niveau_3';
          break;

        case 'en_validation_niveau_3':
          if (!user.profile_purchases_validate_level_3) {
            throw { statusCode: 403, message: 'Vous n\'avez pas le profil pour valider niveau 3' };
          }
          niveauActuel = 3;
          nouveauStatut = 'validee';
          break;

        default:
          throw { 
            statusCode: 400, 
            message: `Demande en statut "${demande.statut}" ne peut pas être validée` 
          };
      }

      // Enregistrer validation dans historique
      await client.query(
        `INSERT INTO historique_validations (
          demande_achat_id, validateur_id, niveau, action, commentaire
        ) VALUES ($1, $2, $3, 'VALIDER', $4)`,
        [demandeId, validateurId, niveauActuel, commentaire]
      );

      // Mettre à jour statut demande
      const updateResult = await client.query(
        `UPDATE demandes_achat 
         SET statut = $1,
             validateur_niveau_${niveauActuel}_id = $2,
             date_validation_niveau_${niveauActuel} = NOW(),
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [nouveauStatut, validateurId, demandeId]
      );

      return updateResult.rows[0];
    });
  }

  /**
   * Rejeter une demande
   */
  async rejeter(demandeId, validateurId, user, commentaire) {
    return await transaction(async (client) => {
      // Récupérer demande
      const demandeResult = await client.query(
        'SELECT * FROM demandes_achat WHERE id = $1',
        [demandeId]
      );

      if (demandeResult.rows.length === 0) {
        throw { statusCode: 404, message: 'Demande non trouvée' };
      }

      const demande = demandeResult.rows[0];

      // Déterminer niveau
      let niveauActuel = 0;

      switch (demande.statut) {
        case 'en_validation_niveau_1':
          if (!user.profile_purchases_validate_level_1) {
            throw { statusCode: 403, message: 'Vous n\'avez pas le profil pour rejeter niveau 1' };
          }
          niveauActuel = 1;
          break;

        case 'en_validation_niveau_2':
          if (!user.profile_purchases_validate_level_2) {
            throw { statusCode: 403, message: 'Vous n\'avez pas le profil pour rejeter niveau 2' };
          }
          niveauActuel = 2;
          break;

        case 'en_validation_niveau_3':
          if (!user.profile_purchases_validate_level_3) {
            throw { statusCode: 403, message: 'Vous n\'avez pas le profil pour rejeter niveau 3' };
          }
          niveauActuel = 3;
          break;

        default:
          throw { 
            statusCode: 400, 
            message: `Demande en statut "${demande.statut}" ne peut pas être rejetée` 
          };
      }

      if (!commentaire) {
        throw { statusCode: 400, message: 'Un commentaire est requis pour rejeter une demande' };
      }

      // Enregistrer rejet dans historique
      await client.query(
        `INSERT INTO historique_validations (
          demande_achat_id, validateur_id, niveau, action, commentaire
        ) VALUES ($1, $2, $3, 'REJETER', $4)`,
        [demandeId, validateurId, niveauActuel, commentaire]
      );

      // Mettre à jour statut demande
      const updateResult = await client.query(
        `UPDATE demandes_achat 
         SET statut = 'rejetee',
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [demandeId]
      );

      return updateResult.rows[0];
    });
  }

  /**
   * Obtenir historique validations d'une demande
   */
  async getHistorique(demandeId) {
    const result = await query(
      `SELECT 
        hv.*,
        u.nom as validateur_nom,
        u.prenom as validateur_prenom,
        u.email as validateur_email
      FROM historique_validations hv
      LEFT JOIN utilisateurs u ON hv.validateur_id = u.id
      WHERE hv.demande_achat_id = $1
      ORDER BY hv.date_validation ASC`,
      [demandeId]
    );

    return result.rows;
  }

  /**
   * Obtenir statistiques validations pour un utilisateur
   */
  async getStats(userId, user) {
    // Déterminer niveaux
    let niveaux = [];
    if (user.profile_purchases_validate_level_1) niveaux.push('en_validation_niveau_1');
    if (user.profile_purchases_validate_level_2) niveaux.push('en_validation_niveau_2');
    if (user.profile_purchases_validate_level_3) niveaux.push('en_validation_niveau_3');

    if (niveaux.length === 0) {
      return {
        en_attente: 0,
        validees_ce_mois: 0,
        rejetees_ce_mois: 0
      };
    }

    // En attente
    const attenteResult = await query(
      `SELECT COUNT(*) as count FROM demandes_achat 
       WHERE statut IN (${niveaux.map((_, i) => `$${i + 1}`).join(', ')})`,
      niveaux
    );

    // Validées ce mois
    const valideesResult = await query(
      `SELECT COUNT(*) as count FROM historique_validations
       WHERE validateur_id = $1 
         AND action = 'VALIDER'
         AND DATE_TRUNC('month', date_validation) = DATE_TRUNC('month', CURRENT_DATE)`,
      [userId]
    );

    // Rejetées ce mois
    const rejeteesResult = await query(
      `SELECT COUNT(*) as count FROM historique_validations
       WHERE validateur_id = $1 
         AND action = 'REJETER'
         AND DATE_TRUNC('month', date_validation) = DATE_TRUNC('month', CURRENT_DATE)`,
      [userId]
    );

    return {
      en_attente: parseInt(attenteResult.rows[0].count),
      validees_ce_mois: parseInt(valideesResult.rows[0].count),
      rejetees_ce_mois: parseInt(rejeteesResult.rows[0].count)
    };
  }
}

module.exports = new ValidationsService();
