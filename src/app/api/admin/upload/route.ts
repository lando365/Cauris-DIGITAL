import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getAuthenticatedAdmin } from '@/lib/require-admin';

// CDC V2 §5.5 — Stratégie de gestion des fichiers (Upload).
type EntityKind = 'startup' | 'partner' | 'article' | 'event';

interface UploadRule {
  maxBytes: number;
  mimeToExt: Record<string, string>;
  coverSuffix: boolean; // {entity}-{id}-cover-{timestamp}.{ext} vs {entity}-{id}-{timestamp}.{ext}
}

const LOGO_MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

const COVER_MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const RULES: Record<EntityKind, UploadRule> = {
  // RM-S05 : logos startups/partenaires — 2 Mo, JPG/PNG/WEBP/SVG.
  startup: { maxBytes: 2 * 1024 * 1024, mimeToExt: LOGO_MIME_TO_EXT, coverSuffix: false },
  partner: { maxBytes: 2 * 1024 * 1024, mimeToExt: LOGO_MIME_TO_EXT, coverSuffix: false },
  // RM-A04 : images articles/événements — 5 Mo, JPG/PNG/WEBP.
  article: { maxBytes: 5 * 1024 * 1024, mimeToExt: COVER_MIME_TO_EXT, coverSuffix: true },
  event: { maxBytes: 5 * 1024 * 1024, mimeToExt: COVER_MIME_TO_EXT, coverSuffix: true },
};

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

// Vérifie que l'extension déclarée par le nom de fichier correspond au MIME
// type — défense en profondeur contre un fichier .exe renommé en .jpg.
function extensionMatchesMime(filename: string, expectedExt: string): boolean {
  const actualExt = filename.split('.').pop()?.toLowerCase();
  if (expectedExt === 'jpg') return actualExt === 'jpg' || actualExt === 'jpeg';
  return actualExt === expectedExt;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedAdmin();
  if (!user) {
    return errorResponse('FORBIDDEN', 'Réservé aux administrateurs et éditeurs.', 403);
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const entityType = formData.get('entityType');

  if (!(file instanceof File)) {
    return errorResponse('BAD_REQUEST', 'Fichier manquant.', 400);
  }
  if (typeof entityType !== 'string' || !(entityType in RULES)) {
    return errorResponse('BAD_REQUEST', "Type d'entité invalide.", 400);
  }

  const rule = RULES[entityType as EntityKind];

  if (file.size > rule.maxBytes) {
    return errorResponse(
      'FILE_TOO_LARGE',
      `Fichier trop volumineux (max ${Math.round(rule.maxBytes / 1024 / 1024)} Mo).`,
      400
    );
  }

  const ext = rule.mimeToExt[file.type];
  if (!ext || !extensionMatchesMime(file.name, ext)) {
    return errorResponse(
      'UNSUPPORTED_FORMAT',
      `Format non supporté. Formats acceptés : ${[...new Set(Object.values(rule.mimeToExt))].join(', ').toUpperCase()}.`,
      400
    );
  }

  // {entity}-{id}-{timestamp}.{ext} (§5.5) — id aléatoire, pas l'id BDD réel :
  // l'upload a lieu avant la création de l'entité (formulaire non soumis).
  const randomId = randomBytes(6).toString('hex');
  const timestamp = Date.now();
  const pathname = rule.coverSuffix
    ? `${entityType}-${randomId}-cover-${timestamp}.${ext}`
    : `${entityType}-${randomId}-${timestamp}.${ext}`;

  const blob = await put(pathname, file, {
    access: 'public',
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
