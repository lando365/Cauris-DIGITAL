import { z } from 'zod';

const CATEGORIES = ['ANNONCES', 'PORTRAITS', 'RESSOURCES', 'EVENEMENTS', 'OPINIONS'] as const;
const STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// CDC V2 §5.3.3 (champs) + §3.5.2 (règles métier RM-A01 à RM-A06)
// readingTime n'apparaît pas ici : calculé automatiquement côté serveur (RM-A06).
export const articleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Le slug est requis.')
    .regex(slugRegex, 'Le slug ne doit contenir que des lettres minuscules, chiffres et tirets.'),
  title: z.string().trim().min(1, 'Le titre est requis.'), // RM-A02
  excerpt: z.string().trim().min(1, "L'extrait est requis."),
  content: z
    .string()
    .trim()
    .min(1, 'Le contenu est requis.') // RM-A02
    .max(100_000, 'Le contenu ne peut pas dépasser 100 000 caractères.'), // CDC V2 §7.5
  category: z.enum(CATEGORIES),
  coverImageUrl: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  status: z.enum(STATUSES),
  publishedAt: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
});

export type ArticleInput = z.infer<typeof articleSchema>;
