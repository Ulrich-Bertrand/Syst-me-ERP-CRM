import { z } from 'zod';

// Schéma ligne demande achat
export const ligneDemandeSchema = z.object({
  numero_ligne: z.number().int().positive(),
  designation: z.string().min(3, 'Désignation trop courte').max(500),
  description: z.string().optional(),
  reference_article: z.string().optional(),
  categorie: z.string().optional(),
  quantite: z.number().positive('Quantité doit être positive'),
  unite: z.string().min(1, 'Unité requise'),
  prix_unitaire_estime: z.number().min(0).optional(),
  taux_tva: z.number().min(0).max(100).default(0),
  fournisseur_id: z.string().uuid().optional(),
  code_fournisseur: z.string().optional(),
  nom_fournisseur: z.string().optional(),
  compte_fournisseur: z.string().optional(),
  date_besoin: z.string().datetime().optional(),
  notes: z.string().optional()
});

// Schéma création demande d'achat
export const createDemandeSchema = z.object({
  type_demande: z.enum(['operationnel', 'interne', 'investissement', 'contrat_cadre']),
  objet: z.string().min(10, 'Objet trop court (min 10 caractères)').max(500),
  justification: z.string().optional(),
  urgence: z.enum(['normale', 'urgent', 'tres_urgent']).default('normale'),
  dossier_id: z.string().uuid().optional(),
  dossier_ref: z.string().optional(),
  demandeur_id: z.string().uuid().optional(),
  demandeur_nom: z.string().optional(),
  demandeur_email: z.string().email().optional(),
  agence: z.string().min(1, 'Agence requise'),
  lignes: z.array(ligneDemandeSchema).min(1, 'Au moins une ligne requise')
});

// Schéma mise à jour demande
export const updateDemandeSchema = createDemandeSchema.partial();

// Schéma filtres liste
export const listDemandesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  statut: z.enum([
    'brouillon',
    'en_validation_niveau_1',
    'en_validation_niveau_2',
    'en_validation_niveau_3',
    'validee',
    'rejetee',
    'annulee'
  ]).optional(),
  agence: z.string().optional(),
  demandeur: z.string().uuid().optional(),
  date_debut: z.string().datetime().optional(),
  date_fin: z.string().datetime().optional(),
  search: z.string().optional()
});

// Schéma statistiques
export const statsDemandesSchema = z.object({
  agence: z.string().optional(),
  date_debut: z.string().datetime().optional(),
  date_fin: z.string().datetime().optional()
});

// Exporter types TypeScript
export type CreateDemandeInput = z.infer<typeof createDemandeSchema>;
export type UpdateDemandeInput = z.infer<typeof updateDemandeSchema>;
export type ListDemandesInput = z.infer<typeof listDemandesSchema>;
export type StatsDemandesInput = z.infer<typeof statsDemandesSchema>;
export type LigneDemandeInput = z.infer<typeof ligneDemandeSchema>;
