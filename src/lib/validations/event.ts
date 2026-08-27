import { z } from 'zod';

const TYPES = [
  'DEMO_DAY',
  'ATELIER',
  'WEBINAIRE',
  'HACKATHON',
  'NETWORKING',
  'CONFERENCE',
] as const;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// CDC V2 §5.3.4 (champs) + §3.5.3 (règles métier RM-E01 à RM-E04)
// RM-E02 (isPast calculé dynamiquement) n'a pas de champ correspondant : non modélisé ici.
export const eventSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1, 'Le slug est requis.')
      .regex(slugRegex, 'Le slug ne doit contenir que des lettres minuscules, chiffres et tirets.'),
    title: z.string().trim().min(1, 'Le titre est requis.'),
    description: z.string().trim().min(1, 'La description est requise.'),
    type: z.enum(TYPES),
    startDate: z.string().trim().min(1, 'La date de début est requise.'),
    endDate: z
      .string()
      .trim()
      .transform((v) => (v === '' ? undefined : v))
      .optional(),
    location: z.string().trim().min(1, 'Le lieu est requis.'),
    isOnline: z.coerce.boolean().default(false),
    isFree: z.coerce.boolean().default(true),
    price: z
      .string()
      .trim()
      .transform((v) => (v === '' ? undefined : v))
      .optional(),
    registerUrl: z
      .string()
      .trim()
      .refine((v) => v === '' || v.startsWith('https://'), {
        message: "L'URL d'inscription doit utiliser HTTPS.", // RM-E04
      })
      .transform((v) => (v === '' ? undefined : v))
      .optional(),
    imageUrl: z
      .string()
      .trim()
      .transform((v) => (v === '' ? undefined : v))
      .optional(),
    isPublished: z.coerce.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La date de fin doit être après la date de début.', // RM-E01
        path: ['endDate'],
      });
    }
    if (!data.isFree && !data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le prix est requis pour un événement payant.', // RM-E03
        path: ['price'],
      });
    }
  });

export type EventInput = z.infer<typeof eventSchema>;
