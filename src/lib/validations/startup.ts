import { z } from 'zod';

const currentYear = new Date().getFullYear();

const SECTORS = ['AGRITECH', 'FINTECH', 'EDTECH', 'HEALTHTECH', 'SMART_CITIES'] as const;
const STATUSES = ['EN_INCUBATION', 'DIPLOMEE', 'ALUMNI'] as const;

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const httpsUrl = (message: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || v.startsWith('https://'), { message })
    .transform((v) => (v === '' ? undefined : v))
    .optional();

// CDC V2 §5.3.2 (champs) + §3.5.1 (règles métier RM-S01 à RM-S07)
export const startupSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Le slug est requis.')
    .regex(slugRegex, 'Le slug ne doit contenir que des lettres minuscules, chiffres et tirets.'),
  name: z
    .string()
    .trim()
    .min(2, 'Le nom doit contenir entre 2 et 100 caractères.') // RM-S07
    .max(100, 'Le nom doit contenir entre 2 et 100 caractères.'),
  tagline: z.string().trim().min(1, "La phrase d'accroche est requise."),
  description: z.string().trim().min(1, 'La description est requise.'),
  longDescription: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  sector: z.enum(SECTORS),
  countryName: z.string().trim().min(1, 'Le pays est requis.'),
  countryCode: z
    .string()
    .trim()
    .length(2, 'Le code pays doit faire 2 caractères (ISO 3166).')
    .toUpperCase(),
  city: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  status: z.enum(STATUSES),
  year: z.coerce.number().int().max(currentYear, "L'année ne peut pas être dans le futur."), // RM-S02
  foundedYear: z.coerce
    .number()
    .int()
    .max(currentYear, "L'année de fondation est invalide.") // RM-S03
    .optional()
    .nullable(),
  logoUrl: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  websiteUrl: httpsUrl('Le site web doit utiliser HTTPS.'), // RM-S04
  linkedinUrl: z
    .string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  technologies: z.array(z.string()).default([]),
  founders: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  isFeatured: z.coerce.boolean().default(false),
});

export type StartupInput = z.infer<typeof startupSchema>;

// Aide pour convertir les champs "liste" saisis en formulaire (une valeur par ligne)
export function parseListField(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== 'string') return [];
  return raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}
