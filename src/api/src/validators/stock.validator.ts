import { z } from 'zod';

// Schéma création article
export const createArticleSchema = z.object({
  code_article: z.string().min(1, 'Code article requis').max(50),
  designation: z.string().min(3, 'Désignation trop courte').max(500),
  description: z.string().optional(),
  categorie: z.string().optional(),
  unite: z.string().min(1, 'Unité requise'),
  gestion_stock: z.boolean().default(true),
  stock_minimum: z.number().min(0).default(0),
  stock_maximum: z.number().min(0).optional(),
  agence: z.string().min(1),
  compte_comptable: z.string().optional(),
  notes: z.string().optional()
});

// Schéma mise à jour article
export const updateArticleSchema = createArticleSchema.partial();

// Schéma mouvement stock
export const createMouvementSchema = z.object({
  type_mouvement: z.enum([
    'entree_achat',
    'entree_retour',
    'entree_ajustement',
    'sortie_vente',
    'sortie_consommation',
    'sortie_retour',
    'sortie_ajustement',
    'transfert_entree',
    'transfert_sortie'
  ]),
  article_id: z.string().uuid(),
  code_article: z.string().optional(),
  designation: z.string().optional(),
  quantite: z.number().refine(val => val !== 0, {
    message: 'Quantité ne peut pas être 0'
  }),
  unite: z.string().min(1),
  prix_unitaire: z.number().min(0).optional(),
  bon_commande_id: z.string().uuid().optional(),
  bon_commande_ref: z.string().optional(),
  reception_id: z.string().uuid().optional(),
  bon_livraison_ref: z.string().optional(),
  dossier_ref: z.string().optional(),
  agence: z.string().min(1),
  notes: z.string().optional()
});

// Schéma validation mouvement
export const validateMouvementSchema = z.object({
  valide_par: z.string().uuid(),
  valide_par_nom: z.string(),
  commentaire: z.string().optional()
});

// Schéma inventaire
export const createInventaireSchema = z.object({
  agence: z.string().min(1),
  type_inventaire: z.enum(['complet', 'partiel', 'tournant']),
  date_debut: z.string().datetime(),
  date_fin_prevue: z.string().datetime().optional(),
  responsable_id: z.string().uuid(),
  responsable_nom: z.string(),
  notes: z.string().optional()
});

// Schéma ligne inventaire
export const updateLigneInventaireSchema = z.object({
  quantite_comptee: z.number().min(0),
  observations: z.string().optional()
});

// Schéma filtres listes
export const listArticlesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  categorie: z.string().optional(),
  search: z.string().optional()
});

export const listMouvementsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  type_mouvement: z.string().optional(),
  article_id: z.string().uuid().optional(),
  date_debut: z.string().datetime().optional(),
  date_fin: z.string().datetime().optional()
});

export const listInventairesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  statut: z.enum(['en_cours', 'termine', 'valide']).optional()
});

// Exporter types
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type CreateMouvementInput = z.infer<typeof createMouvementSchema>;
export type ValidateMouvementInput = z.infer<typeof validateMouvementSchema>;
export type CreateInventaireInput = z.infer<typeof createInventaireSchema>;
export type UpdateLigneInventaireInput = z.infer<typeof updateLigneInventaireSchema>;
export type ListArticlesInput = z.infer<typeof listArticlesSchema>;
export type ListMouvementsInput = z.infer<typeof listMouvementsSchema>;
export type ListInventairesInput = z.infer<typeof listInventairesSchema>;
