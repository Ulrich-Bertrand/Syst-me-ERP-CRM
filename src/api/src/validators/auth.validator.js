const { z } = require('zod');

// Schéma login
const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis')
  })
});

// Schéma mise à jour profil
const updateProfileSchema = z.object({
  body: z.object({
    nom: z.string().min(1).optional(),
    prenom: z.string().min(1).optional(),
    telephone: z.string().optional(),
    email: z.string().email().optional()
  })
});

// Schéma changement mot de passe
const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Ancien mot de passe requis'),
    newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
  })
});

module.exports = {
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
};
