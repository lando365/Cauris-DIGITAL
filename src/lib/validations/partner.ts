import { z } from 'zod';

const CATEGORIES = ['INSTITUTIONNEL', 'FINANCIER', 'ACADEMIQUE', 'CORPORATIF'] as const;

// CDC V2 §5.3.5 — aucune règle métier dédiée (RM-P##) n'est définie dans le CDC.
export const partnerSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis.'),
  logoUrl: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  websiteUrl: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  category: z.enum(CATEGORIES),
  displayOrder: z.coerce.number().int().default(0),
  isFeatured: z.coerce.boolean().default(false),
});

export type PartnerInput = z.infer<typeof partnerSchema>;
