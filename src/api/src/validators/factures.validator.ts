import { z } from 'zod';

// Schéma ligne facture
export const ligneFactureSchema = z.object({
  numero_ligne: z.number().int().positive(),
  designation: z.string().min(1).max(500),
  reference: z.string().optional(),
  quantite: z.number().positive(),
  unite: z.string().min(1),
  prix_unitaire: z.number().positive(),
  taux_tva: z.number().min(0).max(100).default(0),
  compte_comptable: z.string().optional(),
  notes: z.string().optional()
});

// Schéma création facture
export const createFactureSchema = z.object({
  bon_commande_id: z.string().uuid().optional(),
  bon_commande_ref: z.string().optional(),
  numero_facture: z.string().min(1, 'Numéro facture requis'),
  date_facture: z.string().datetime(),
  date_echeance: z.string().datetime(),
  fournisseur_id: z.string().uuid().optional(),
  code_fournisseur: z.string().optional(),
  nom_fournisseur: z.string().optional(),
  agence: z.string().min(1),
  devise: z.string().default('GHS'),
  conditions_paiement: z.object({
    mode: z.enum(['comptant', 'credit', 'virement', 'cheque']),
    delai_jours: z.number().int().min(0).optional(),
    acompte_pourcent: z.number().min(0).max(100).optional()
  }).optional(),
  lignes: z.array(ligneFactureSchema).min(1, 'Au moins une ligne requise'),
  notes: z.string().optional()
});

// Schéma mise à jour facture
export const updateFactureSchema = createFactureSchema.partial();

// Schéma filtres liste
export const listFacturesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  statut: z.enum([
    'saisie',
    'ecart_detecte',
    'validee_paiement',
    'partiellement_payee',
    'payee',
    'rejetee'
  ]).optional(),
  agence: z.string().optional(),
  fournisseur: z.string().uuid().optional(),
  date_debut: z.string().datetime().optional(),
  date_fin: z.string().datetime().optional()
});

// Schéma validation facture
export const validateFactureSchema = z.object({
  commentaire: z.string().optional()
});

// Schéma rejet facture
export const rejectFactureSchema = z.object({
  motif: z.string().min(10, 'Motif de rejet requis (min 10 caractères)')
});

// Exporter types
export type CreateFactureInput = z.infer<typeof createFactureSchema>;
export type UpdateFactureInput = z.infer<typeof updateFactureSchema>;
export type ListFacturesInput = z.infer<typeof listFacturesSchema>;
export type ValidateFactureInput = z.infer<typeof validateFactureSchema>;
export type RejectFactureInput = z.infer<typeof rejectFactureSchema>;
export type LigneFactureInput = z.infer<typeof ligneFactureSchema>;
