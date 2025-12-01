import { Pool } from 'pg';

/**
 * Service de calcul du Prix Moyen Pondéré (PMP)
 * Gère la valorisation automatique du stock
 */
export class PMPService {
  constructor(private db: Pool) {}

  /**
   * Calculer nouveau PMP après entrée stock
   * Formule: PMP = (Valeur stock avant + Valeur entrée) / (Quantité avant + Quantité entrée)
   */
  async calculateNewPMP(params: {
    articleId: string;
    quantiteEntree: number;
    prixUnitaire: number;
  }): Promise<{
    pmpAvant: number;
    pmpApres: number;
    stockAvant: number;
    stockApres: number;
    valeurStockAvant: number;
    valeurStockApres: number;
  }> {
    // Récupérer article
    const articleResult = await this.db.query(
      'SELECT * FROM articles WHERE id = $1',
      [params.articleId]
    );

    if (articleResult.rows.length === 0) {
      throw new Error('Article non trouvé');
    }

    const article = articleResult.rows[0];

    const stockAvant = parseFloat(article.stock_actuel) || 0;
    const pmpAvant = parseFloat(article.pmp_actuel) || 0;
    const valeurStockAvant = parseFloat(article.valeur_stock) || 0;

    // Valeur de l'entrée
    const valeurEntree = params.quantiteEntree * params.prixUnitaire;

    // Nouveau stock
    const stockApres = stockAvant + params.quantiteEntree;

    // Nouveau PMP
    let pmpApres: number;
    let valeurStockApres: number;

    if (stockAvant === 0) {
      // Premier mouvement: PMP = prix d'achat
      pmpApres = params.prixUnitaire;
      valeurStockApres = valeurEntree;
    } else {
      // PMP = (Valeur stock avant + Valeur entrée) / Stock après
      valeurStockApres = valeurStockAvant + valeurEntree;
      pmpApres = valeurStockApres / stockApres;
    }

    return {
      pmpAvant,
      pmpApres,
      stockAvant,
      stockApres,
      valeurStockAvant,
      valeurStockApres
    };
  }

  /**
   * Mettre à jour PMP et stock de l'article
   */
  async updateArticlePMP(params: {
    articleId: string;
    pmpNouveau: number;
    stockNouveau: number;
    valeurStockNouv: number;
  }): Promise<void> {
    await this.db.query(
      `UPDATE articles 
       SET pmp_actuel = $1,
           stock_actuel = $2,
           stock_disponible = $2,
           valeur_stock = $3,
           updated_at = NOW()
       WHERE id = $4`,
      [
        params.pmpNouveau,
        params.stockNouveau,
        params.valeurStockNouv,
        params.articleId
      ]
    );
  }

  /**
   * Traiter entrée stock avec calcul PMP automatique
   */
  async traiterEntreeStock(params: {
    articleId: string;
    codeArticle: string;
    designation: string;
    quantite: number;
    unite: string;
    prixUnitaire: number;
    bonCommandeId?: string;
    bonCommandeRef?: string;
    receptionId?: string;
    bonLivraisonRef?: string;
    agence: string;
    effectueParId: string;
    effectueParNom: string;
    notes?: string;
  }): Promise<any> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // 1. Calculer nouveau PMP
      const pmpCalcul = await this.calculateNewPMP({
        articleId: params.articleId,
        quantiteEntree: params.quantite,
        prixUnitaire: params.prixUnitaire
      });

      // 2. Générer numéro mouvement
      const numeroMouvement = await this.genererNumeroMouvement(params.agence, client);

      // 3. Créer mouvement stock
      const mouvementResult = await client.query(
        `INSERT INTO mouvements_stock (
          numero_mouvement, type_mouvement,
          article_id, code_article, designation,
          quantite, unite,
          prix_unitaire, montant_total,
          pmp_avant, pmp_apres,
          stock_avant, stock_apres,
          bon_commande_id, bon_commande_ref,
          reception_id, bon_livraison_ref,
          agence, effectue_par, effectue_par_nom,
          statut, date_mouvement, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
        ) RETURNING *`,
        [
          numeroMouvement, 'entree_achat',
          params.articleId, params.codeArticle, params.designation,
          params.quantite, params.unite,
          params.prixUnitaire, params.quantite * params.prixUnitaire,
          pmpCalcul.pmpAvant, pmpCalcul.pmpApres,
          pmpCalcul.stockAvant, pmpCalcul.stockApres,
          params.bonCommandeId, params.bonCommandeRef,
          params.receptionId, params.bonLivraisonRef,
          params.agence, params.effectueParId, params.effectueParNom,
          'valide', new Date(), params.notes || 'Entrée stock automatique depuis réception'
        ]
      );

      // 4. Mettre à jour article
      await client.query(
        `UPDATE articles 
         SET pmp_actuel = $1,
             stock_actuel = $2,
             stock_disponible = $2,
             valeur_stock = $3,
             updated_at = NOW()
         WHERE id = $4`,
        [
          pmpCalcul.pmpApres,
          pmpCalcul.stockApres,
          pmpCalcul.valeurStockApres,
          params.articleId
        ]
      );

      await client.query('COMMIT');

      return mouvementResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Traiter sortie stock (méthode PMP)
   */
  async traiterSortieStock(params: {
    articleId: string;
    codeArticle: string;
    designation: string;
    quantite: number;
    unite: string;
    dossierRef?: string;
    agence: string;
    effectueParId: string;
    effectueParNom: string;
    notes?: string;
  }): Promise<any> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // 1. Récupérer article et PMP actuel
      const articleResult = await client.query(
        'SELECT * FROM articles WHERE id = $1',
        [params.articleId]
      );

      if (articleResult.rows.length === 0) {
        throw new Error('Article non trouvé');
      }

      const article = articleResult.rows[0];
      const stockAvant = parseFloat(article.stock_actuel) || 0;
      const pmpActuel = parseFloat(article.pmp_actuel) || 0;
      const valeurStockAvant = parseFloat(article.valeur_stock) || 0;

      // Vérifier stock disponible
      if (stockAvant < params.quantite) {
        throw new Error(`Stock insuffisant: ${stockAvant} ${article.unite} disponible(s)`);
      }

      // 2. Calculer nouvelle valorisation
      const stockApres = stockAvant - params.quantite;
      const valeurSortie = params.quantite * pmpActuel;
      const valeurStockApres = valeurStockAvant - valeurSortie;

      // PMP reste inchangé pour sorties
      const pmpApres = pmpActuel;

      // 3. Générer numéro mouvement
      const numeroMouvement = await this.genererNumeroMouvement(params.agence, client);

      // 4. Créer mouvement stock (quantité négative)
      const mouvementResult = await client.query(
        `INSERT INTO mouvements_stock (
          numero_mouvement, type_mouvement,
          article_id, code_article, designation,
          quantite, unite,
          prix_unitaire, montant_total,
          pmp_avant, pmp_apres,
          stock_avant, stock_apres,
          dossier_ref, agence,
          effectue_par, effectue_par_nom,
          statut, date_mouvement, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        ) RETURNING *`,
        [
          numeroMouvement, 'sortie_consommation',
          params.articleId, params.codeArticle, params.designation,
          -params.quantite, params.unite,
          pmpActuel, -valeurSortie,
          pmpActuel, pmpApres,
          stockAvant, stockApres,
          params.dossierRef, params.agence,
          params.effectueParId, params.effectueParNom,
          'valide', new Date(), params.notes || 'Sortie stock pour consommation'
        ]
      );

      // 5. Mettre à jour article
      await client.query(
        `UPDATE articles 
         SET stock_actuel = $1,
             stock_disponible = $1,
             valeur_stock = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [stockApres, valeurStockApres, params.articleId]
      );

      await client.query('COMMIT');

      return mouvementResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Générer numéro mouvement
   */
  private async genererNumeroMouvement(agence: string, client: any): Promise<string> {
    const annee = new Date().getFullYear();
    const prefixeAgence = agence === 'GHANA' ? 'GH' : agence === 'COTE_IVOIRE' ? 'CI' : 'BF';

    const result = await client.query(
      `INSERT INTO series_numerotation (type_serie, agence, annee, compteur)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (type_serie, agence, annee) 
       DO UPDATE SET compteur = series_numerotation.compteur + 1
       RETURNING compteur`,
      ['MOUVEMENT', agence, annee]
    );

    const compteur = result.rows[0].compteur;
    return `MVT-${prefixeAgence}-${annee}-${String(compteur).padStart(4, '0')}`;
  }

  /**
   * Recalculer PMP de tous les articles
   * (À utiliser après migration ou correction de données)
   */
  async recalculerTousPMP(): Promise<{ recalcules: number; erreurs: number }> {
    const articlesResult = await this.db.query(
      'SELECT id FROM articles WHERE gestion_stock = true'
    );

    let recalcules = 0;
    let erreurs = 0;

    for (const article of articlesResult.rows) {
      try {
        await this.recalculerPMPArticle(article.id);
        recalcules++;
      } catch (error) {
        console.error(`Erreur recalcul PMP article ${article.id}:`, error);
        erreurs++;
      }
    }

    return { recalcules, erreurs };
  }

  /**
   * Recalculer PMP d'un article depuis historique mouvements
   */
  private async recalculerPMPArticle(articleId: string): Promise<void> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Récupérer tous les mouvements dans l'ordre chronologique
      const mouvementsResult = await client.query(
        `SELECT * FROM mouvements_stock 
         WHERE article_id = $1 AND statut = 'valide'
         ORDER BY date_mouvement ASC`,
        [articleId]
      );

      let stock = 0;
      let pmp = 0;
      let valeurStock = 0;

      // Recalculer mouvement par mouvement
      for (const mouvement of mouvementsResult.rows) {
        const quantite = parseFloat(mouvement.quantite);
        const prixUnitaire = parseFloat(mouvement.prix_unitaire) || 0;

        if (quantite > 0) {
          // Entrée
          const valeurEntree = quantite * prixUnitaire;
          valeurStock = valeurStock + valeurEntree;
          stock = stock + quantite;
          pmp = stock > 0 ? valeurStock / stock : 0;
        } else {
          // Sortie
          stock = stock + quantite; // quantité négative
          valeurStock = stock * pmp;
        }
      }

      // Mettre à jour article
      await client.query(
        `UPDATE articles 
         SET pmp_actuel = $1,
             stock_actuel = $2,
             stock_disponible = $2,
             valeur_stock = $3
         WHERE id = $4`,
        [pmp, stock, valeurStock, articleId]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
