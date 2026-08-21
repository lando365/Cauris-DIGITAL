import { z } from 'zod';

// CDC V2 RM-U01 : 12+ caractères, au moins 1 majuscule, 1 chiffre, 1 caractère spécial.
export const passwordSchema = z
  .string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères.')
  .refine((v) => /[A-Z]/.test(v), 'Le mot de passe doit contenir au moins une majuscule.')
  .refine((v) => /[0-9]/.test(v), 'Le mot de passe doit contenir au moins un chiffre.')
  .refine(
    (v) => /[^A-Za-z0-9]/.test(v),
    'Le mot de passe doit contenir au moins un caractère spécial.'
  );

export const createUserSchema = z.object({
  email: z.string().trim().email('Email invalide.'), // RM-U02 (unicité vérifiée en base)
  name: z.string().trim().min(1, 'Le nom est requis.'),
  role: z.enum(['ADMIN', 'EDITOR']),
  password: passwordSchema,
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis.'),
  role: z.enum(['ADMIN', 'EDITOR']),
  isActive: z.coerce.boolean(),
});
