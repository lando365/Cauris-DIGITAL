import { z } from 'zod';

/** Formulaire d'inscription à un événement (distinct du formulaire de contact générique). */
export const eventRegistrationSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom est requis.').max(80),
  lastName: z.string().trim().min(1, 'Le nom est requis.').max(80),
  email: z.string().trim().email('Adresse email invalide.'),
  phone: z
    .string()
    .trim()
    .max(30)
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  guestsCount: z.coerce.number().int().min(1).max(10).default(1),
  message: z
    .string()
    .trim()
    .max(2000)
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
