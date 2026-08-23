import { del } from '@vercel/blob';

const BLOB_HOSTNAME = /\.public\.blob\.vercel-storage\.com$/;

function isManagedBlob(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    return BLOB_HOSTNAME.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Supprime un fichier Vercel Blob (CDC V2 §5.5 : "suppression à chaque
 * remplacement ou suppression de l'entité") — no-op si l'URL n'est pas un
 * blob géré par ce store (image externe, placeholder local, etc.).
 * Best-effort : un échec de suppression ne doit jamais faire échouer
 * l'opération métier (update/delete de l'entité en base).
 */
export async function deleteBlobIfManaged(url: string | null | undefined): Promise<void> {
  if (!isManagedBlob(url)) return;
  try {
    await del(url);
  } catch (error) {
    console.error('[blob-cleanup] Échec de la suppression:', error);
  }
}

/**
 * Supprime l'ancien fichier uniquement s'il a été remplacé par une valeur
 * différente (nouvel upload ou champ vidé) — évite de supprimer un blob
 * encore utilisé quand l'utilisateur ne change pas l'image.
 */
export async function deleteReplacedBlob(
  oldUrl: string | null | undefined,
  newUrl: string | null | undefined
): Promise<void> {
  if (oldUrl === newUrl) return;
  await deleteBlobIfManaged(oldUrl);
}
