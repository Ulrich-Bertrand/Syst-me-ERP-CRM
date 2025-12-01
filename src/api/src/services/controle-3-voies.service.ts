import { Pool } from 'pg';

interface EcartControle {
  type: 'quantite' | 'prix_unitaire' | 'montant_total' | 'ligne_manquante' | 'ligne_excedentaire';
  ligne_numero?: number;
  description: string;
  valeur_attendue: any;
  valeur_facturee: any;
  ecart: any;
  ecart_pourcent?: number;
  gravite: 'faible' | 'moyenne' | 'elevee';
  action_requise: string;
}

interface ResultatControle {
  effectue_le: Date;
  effectue_par: string;
  conforme: boolean;
  taux_conformite: number;
  ecarts_detectes: EcartControle[];
  decision: 'approuver' | 'investigation' | 'rejet';
  recommandations: string[];
}

export class Controle3VoiesService {
  constructor(private db: Pool) {}

  /**
   * Exécuter contrôle 3 voies complet
   * Compare : Demande d'Achat ↔ Bon de Commande ↔ Facture
   */
  async executeControle(params: {
    factureId: string;
    userId: string;
    userName: string;
  }): Promise<ResultatControle> {
    // 1. Récupérer facture
    const factureResult = await this.db.query(
      `SELECT f.*, lf.* 
       FROM factures_fournisseurs f
       LEFT JOIN lignes_facture lf ON lf.facture_id = f.id
       WHERE f.id = $1`,
      [params.factureId]
    );

    if (factureResult.rows.length === 0) {
      throw new Error('Facture non trouvée');
    }

    const facture = this.groupFactureWithLignes(factureResult.rows);

    if (!facture.bon_commande_id) {
      throw new Error('Pas de bon de commande lié à cette facture');
    }

    // 2. Récupérer BC
    const bcResult = await this.db.query(
      `SELECT bc.*, lbc.*
       FROM bons_commande bc
       LEFT JOIN lignes_bon_commande lbc ON lbc.bon_commande_id = bc.id
       WHERE bc.id = $1`,
      [facture.bon_commande_id]
    );

    const bonCommande = this.groupBonCommandeWithLignes(bcResult.rows);

    if (!bonCommande.demande_achat_id) {
      throw new Error('Pas de demande d\'achat liée à ce BC');
    }

    // 3. Récupérer DA
    const daResult = await this.db.query(
      `SELECT da.*, lda.*
       FROM demandes_achat da
       LEFT JOIN lignes_demande_achat lda ON lda.demande_achat_id = da.id
       WHERE da.id = $1`,
      [bonCommande.demande_achat_id]
    );

    const demandeAchat = this.groupDemandeWithLignes(daResult.rows);

    // 4. Effectuer contrôles
    const ecarts: EcartControle[] = [];

    // 4.1 Contrôle montant total
    const ecartMontantTotal = this.controlerMontantTotal(demandeAchat, bonCommande, facture);
    if (ecartMontantTotal) ecarts.push(ecartMontantTotal);

    // 4.2 Contrôle ligne par ligne
    const ecartsLignes = this.controlerLignes(bonCommande, facture);
    ecarts.push(...ecartsLignes);

    // 4.3 Contrôle fournisseur
    const ecartFournisseur = this.controlerFournisseur(bonCommande, facture);
    if (ecartFournisseur) ecarts.push(ecartFournisseur);

    // 5. Calculer taux de conformité
    const tauxConformite = this.calculateurTauxConformite(ecarts, bonCommande);

    // 6. Déterminer décision
    const { decision, recommandations } = this.determinerDecision(ecarts, tauxConformite);

    // 7. Créer résultat
    const resultat: ResultatControle = {
      effectue_le: new Date(),
      effectue_par: params.userName,
      conforme: ecarts.length === 0,
      taux_conformite: tauxConformite,
      ecarts_detectes: ecarts,
      decision,
      recommandations
    };

    // 8. Enregistrer résultat dans facture
    await this.db.query(
      `UPDATE factures_fournisseurs 
       SET controle_3_voies = $1, 
           statut = CASE 
             WHEN $2 = true THEN 'validee_paiement'
             ELSE 'ecart_detecte'
           END
       WHERE id = $3`,
      [JSON.stringify(resultat), resultat.conforme, params.factureId]
    );

    return resultat;
  }

  /**
   * Contrôle montant total
   */
  private controlerMontantTotal(da: any, bc: any, facture: any): EcartControle | null {
    const montantBC = parseFloat(bc.montant_ttc);
    const montantFacture = parseFloat(facture.montant_ttc);
    const ecartAbsolu = Math.abs(montantFacture - montantBC);
    const ecartPourcent = (ecartAbsolu / montantBC) * 100;

    // Tolérance de 2%
    if (ecartPourcent > 2) {
      return {
        type: 'montant_total',
        description: 'Écart sur le montant total',
        valeur_attendue: montantBC,
        valeur_facturee: montantFacture,
        ecart: ecartAbsolu,
        ecart_pourcent: ecartPourcent,
        gravite: ecartPourcent > 10 ? 'elevee' : ecartPourcent > 5 ? 'moyenne' : 'faible',
        action_requise: ecartPourcent > 10 
          ? 'Rejet recommandé - Écart trop important'
          : 'Vérifier justification avec fournisseur'
      };
    }

    return null;
  }

  /**
   * Contrôle ligne par ligne
   */
  private controlerLignes(bc: any, facture: any): EcartControle[] {
    const ecarts: EcartControle[] = [];

    // Pour chaque ligne BC, chercher ligne correspondante dans facture
    bc.lignes.forEach((ligneBC: any) => {
      const ligneFacture = facture.lignes.find((lf: any) => 
        this.matchLignes(ligneBC, lf)
      );

      if (!ligneFacture) {
        ecarts.push({
          type: 'ligne_manquante',
          ligne_numero: ligneBC.numero_ligne,
          description: `Ligne ${ligneBC.numero_ligne} du BC non trouvée dans facture`,
          valeur_attendue: ligneBC.designation,
          valeur_facturee: null,
          ecart: 'ligne_manquante',
          gravite: 'elevee',
          action_requise: 'Vérifier avec fournisseur pourquoi ligne manquante'
        });
        return;
      }

      // Contrôle quantité
      const ecartQuantite = this.controlerQuantiteLigne(ligneBC, ligneFacture);
      if (ecartQuantite) {
        ecarts.push({
          ...ecartQuantite,
          ligne_numero: ligneBC.numero_ligne
        });
      }

      // Contrôle prix unitaire
      const ecartPrix = this.controlerPrixUnitaire(ligneBC, ligneFacture);
      if (ecartPrix) {
        ecarts.push({
          ...ecartPrix,
          ligne_numero: ligneBC.numero_ligne
        });
      }
    });

    // Vérifier lignes en excès dans facture
    facture.lignes.forEach((ligneFacture: any) => {
      const ligneBC = bc.lignes.find((lbc: any) => 
        this.matchLignes(lbc, ligneFacture)
      );

      if (!ligneBC) {
        ecarts.push({
          type: 'ligne_excedentaire',
          ligne_numero: ligneFacture.numero_ligne,
          description: `Ligne ${ligneFacture.numero_ligne} dans facture mais pas dans BC`,
          valeur_attendue: null,
          valeur_facturee: ligneFacture.designation,
          ecart: 'ligne_excedentaire',
          gravite: 'elevee',
          action_requise: 'Rejet ou vérification fournisseur - Ligne non commandée'
        });
      }
    });

    return ecarts;
  }

  /**
   * Contrôle quantité ligne
   */
  private controlerQuantiteLigne(ligneBC: any, ligneFacture: any): EcartControle | null {
    const quantiteBC = parseFloat(ligneBC.quantite_commandee);
    const quantiteFacture = parseFloat(ligneFacture.quantite);
    const ecartAbsolu = Math.abs(quantiteFacture - quantiteBC);
    const ecartPourcent = (ecartAbsolu / quantiteBC) * 100;

    // Tolérance de 1%
    if (ecartPourcent > 1) {
      return {
        type: 'quantite',
        description: `Écart de quantité: ${ligneBC.designation}`,
        valeur_attendue: quantiteBC,
        valeur_facturee: quantiteFacture,
        ecart: ecartAbsolu,
        ecart_pourcent: ecartPourcent,
        gravite: ecartPourcent > 5 ? 'elevee' : 'moyenne',
        action_requise: quantiteFacture > quantiteBC
          ? 'Vérifier si livraison excédentaire justifiée'
          : 'Vérifier pourquoi quantité inférieure facturée'
      };
    }

    return null;
  }

  /**
   * Contrôle prix unitaire
   */
  private controlerPrixUnitaire(ligneBC: any, ligneFacture: any): EcartControle | null {
    const prixBC = parseFloat(ligneBC.prix_unitaire);
    const prixFacture = parseFloat(ligneFacture.prix_unitaire);
    const ecartAbsolu = Math.abs(prixFacture - prixBC);
    const ecartPourcent = (ecartAbsolu / prixBC) * 100;

    // Tolérance de 2%
    if (ecartPourcent > 2) {
      return {
        type: 'prix_unitaire',
        description: `Écart de prix unitaire: ${ligneBC.designation}`,
        valeur_attendue: prixBC,
        valeur_facturee: prixFacture,
        ecart: ecartAbsolu,
        ecart_pourcent: ecartPourcent,
        gravite: ecartPourcent > 10 ? 'elevee' : ecartPourcent > 5 ? 'moyenne' : 'faible',
        action_requise: prixFacture > prixBC
          ? 'Rejet ou demande justification - Prix supérieur au BC'
          : 'Accepter avec vérification'
      };
    }

    return null;
  }

  /**
   * Contrôle fournisseur
   */
  private controlerFournisseur(bc: any, facture: any): EcartControle | null {
    if (bc.code_fournisseur !== facture.code_fournisseur) {
      return {
        type: 'montant_total',
        description: 'Fournisseur facture différent du BC',
        valeur_attendue: `${bc.code_fournisseur} - ${bc.nom_fournisseur}`,
        valeur_facturee: `${facture.code_fournisseur} - ${facture.nom_fournisseur}`,
        ecart: 'fournisseur_different',
        gravite: 'elevee',
        action_requise: 'REJET - Fournisseur non conforme au BC'
      };
    }

    return null;
  }

  /**
   * Matcher 2 lignes (BC vs Facture)
   */
  private matchLignes(ligne1: any, ligne2: any): boolean {
    // Match par numéro ligne ou désignation similaire
    if (ligne1.numero_ligne === ligne2.numero_ligne) return true;

    const designation1 = (ligne1.designation || '').toLowerCase().trim();
    const designation2 = (ligne2.designation || '').toLowerCase().trim();

    // Similarité > 80%
    return this.calculateSimilarity(designation1, designation2) > 0.8;
  }

  /**
   * Calculer similarité entre 2 chaînes (Levenshtein simplifié)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.includes(shorter)) return 0.8;

    // Simple: Compter caractères communs
    let common = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) common++;
    }

    return common / longer.length;
  }

  /**
   * Calculer taux de conformité global
   */
  private calculateurTauxConformite(ecarts: EcartControle[], bc: any): number {
    if (ecarts.length === 0) return 100;

    // Pondération selon gravité
    let totalPoints = 100;
    let pointsPerdus = 0;

    ecarts.forEach(ecart => {
      switch (ecart.gravite) {
        case 'faible':
          pointsPerdus += 2;
          break;
        case 'moyenne':
          pointsPerdus += 5;
          break;
        case 'elevee':
          pointsPerdus += 15;
          break;
      }
    });

    return Math.max(0, totalPoints - pointsPerdus);
  }

  /**
   * Déterminer décision et recommandations
   */
  private determinerDecision(ecarts: EcartControle[], tauxConformite: number): {
    decision: 'approuver' | 'investigation' | 'rejet';
    recommandations: string[];
  } {
    const recommandations: string[] = [];

    // Vérifier écarts graves
    const ecartsEleves = ecarts.filter(e => e.gravite === 'elevee');

    if (ecartsEleves.length > 0) {
      recommandations.push(`${ecartsEleves.length} écart(s) de gravité élevée détecté(s)`);
      
      if (ecartsEleves.some(e => e.type === 'ligne_excedentaire' || e.ecart === 'fournisseur_different')) {
        return {
          decision: 'rejet',
          recommandations: [
            ...recommandations,
            'REJET RECOMMANDÉ: Incohérences majeures détectées',
            'Contacter le fournisseur pour clarification',
            'Ne pas procéder au paiement avant résolution'
          ]
        };
      }
    }

    if (tauxConformite >= 95) {
      return {
        decision: 'approuver',
        recommandations: [
          ...recommandations,
          'Conformité acceptable - Approbation recommandée',
          'Écarts mineurs détectés - Suivi recommandé pour prochaines factures'
        ]
      };
    }

    if (tauxConformite >= 85) {
      return {
        decision: 'investigation',
        recommandations: [
          ...recommandations,
          'Investigation requise avant approbation',
          'Contacter le fournisseur pour clarifier les écarts',
          'Documenter les justifications avant paiement'
        ]
      };
    }

    return {
      decision: 'rejet',
      recommandations: [
        ...recommandations,
        'REJET RECOMMANDÉ: Taux de conformité trop faible',
        'Trop d\'écarts détectés',
        'Retourner la facture au fournisseur pour correction'
      ]
    };
  }

  /**
   * Grouper facture avec lignes
   */
  private groupFactureWithLignes(rows: any[]): any {
    if (rows.length === 0) return null;

    const facture = { ...rows[0] };
    facture.lignes = rows
      .filter(r => r.designation)
      .map(r => ({
        numero_ligne: r.numero_ligne,
        designation: r.designation,
        reference: r.reference,
        quantite: r.quantite,
        unite: r.unite,
        prix_unitaire: r.prix_unitaire,
        montant_ht: r.montant_ht,
        montant_ttc: r.montant_ttc
      }));

    return facture;
  }

  /**
   * Grouper BC avec lignes
   */
  private groupBonCommandeWithLignes(rows: any[]): any {
    if (rows.length === 0) return null;

    const bc = { ...rows[0] };
    bc.lignes = rows
      .filter(r => r.designation)
      .map(r => ({
        numero_ligne: r.numero_ligne,
        designation: r.designation,
        quantite_commandee: r.quantite_commandee,
        unite: r.unite,
        prix_unitaire: r.prix_unitaire,
        montant_ht: r.montant_ht,
        montant_ttc: r.montant_ttc
      }));

    return bc;
  }

  /**
   * Grouper DA avec lignes
   */
  private groupDemandeWithLignes(rows: any[]): any {
    if (rows.length === 0) return null;

    const da = { ...rows[0] };
    da.lignes = rows
      .filter(r => r.designation)
      .map(r => ({
        numero_ligne: r.numero_ligne,
        designation: r.designation,
        quantite: r.quantite,
        prix_unitaire_estime: r.prix_unitaire_estime
      }));

    return da;
  }
}
