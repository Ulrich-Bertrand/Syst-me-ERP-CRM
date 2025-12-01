const { z } = require('zod');

// Schéma ligne demande
const ligneDemandeSchema = z.object({
  article_id: z.number().int().positive().optional(),
  designation: z.string().min(1, 'Désignation requise'),
  quantite: z.number().positive('Quantité doit être positive'),
  unite: z.string().min(1, 'Unité requise'),
  prix_unitaire_estime: z.number().nonnegative('Prix ne peut être négatif').optional(),
  description: z.string().optional()
});

// Schéma création demande
const createDemandeSchema = z.object({
  body: z.object({
    agence: z.enum(['GHANA', 'COTE_IVOIRE', 'BURKINA'], {
      errorMap: () => ({ message: 'Agence invalide' })
    }),
    type: z.enum(['NORMALE', 'URGENTE', 'EXCEPTIONNELLE'], {
      errorMap: () => ({ message: 'Type invalide' })
    }),
    objet: z.string().min(3, 'Objet doit contenir au moins 3 caractères'),
    justification: z.string().min(10, 'Justification doit contenir au moins 10 caractères'),
    date_besoin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
    budget_id: z.number().int().positive().optional(),
    centre_cout_id: z.number().int().positive().optional(),
    lignes: z.array(ligneDemandeSchema).min(1, 'Au moins une ligne requise')
  })
});

// Schéma mise à jour demande
const updateDemandeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number)
  }),
  body: z.object({
    type: z.enum(['NORMALE', 'URGENTE', 'EXCEPTIONNELLE']).optional(),
    objet: z.string().min(3).optional(),
    justification: z.string().min(10).optional(),
    date_besoin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    budget_id: z.number().int().positive().nullable().optional(),
    centre_cout_id: z.number().int().positive().nullable().optional(),
    lignes: z.array(ligneDemandeSchema).optional()
  })
});

// Schéma validation demande
const validateDemandeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number)
  }),
  body: z.object({
    action: z.enum(['VALIDER', 'REJETER'], {
      errorMap: () => ({ message: 'Action doit être VALIDER ou REJETER' })
    }),
    commentaire: z.string().optional()
  })
});

// Schéma filtres liste
const getDemandesSchema = z.object({
  query: z.object({
    agence: z.enum(['GHANA', 'COTE_IVOIRE', 'BURKINA']).optional(),
    statut: z.enum([
      'brouillon',
      'en_validation_niveau_1',
      'en_validation_niveau_2',
      'en_validation_niveau_3',
      'validee',
      'rejetee',
      'annulee'
    ]).optional(),
    type: z.enum(['NORMALE', 'URGENTE', 'EXCEPTIONNELLE']).optional(),
    demandeur_id: z.string().regex(/^\d+$/).transform(Number).optional(),
    date_debut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    date_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional()
  })
});

// Schéma ID param
const demandeIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID invalide').transform(Number)
  })
});

module.exports = {
  createDemandeSchema,
  updateDemandeSchema,
  validateDemandeSchema,
  getDemandesSchema,
  demandeIdSchema
};
