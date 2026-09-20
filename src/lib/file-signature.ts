/**
 * Détection du format réel d'un fichier à partir de ses premiers octets
 * ("magic bytes"), indépendamment du type MIME et de l'extension déclarés
 * par le client — qui, eux, sont librement falsifiables.
 */

export type DetectedFileType =
  'image/jpeg' | 'image/png' | 'image/webp' | 'image/svg+xml' | 'application/pdf';

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false;
  return signature.every((value, i) => bytes[offset + i] === value);
}

// SVG : format texte, pouvant embarquer du script. On exige une balise <svg>
// et on refuse les contenus actifs (script, gestionnaires d'événements,
// URL javascript:, foreignObject) qui s'exécuteraient une fois le fichier
// servi depuis le domaine de stockage.
const SVG_ACTIVE_CONTENT = /<script|\son[a-z]+\s*=|javascript:|<foreignObject/i;

function isSafeSvg(bytes: Uint8Array): boolean {
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  return /<svg[\s>]/i.test(text) && !SVG_ACTIVE_CONTENT.test(text);
}

/** Retourne le format réel reconnu, ou null si le contenu ne correspond à aucun format accepté. */
export function detectFileType(bytes: Uint8Array): DetectedFileType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';
  // WebP : conteneur RIFF ("RIFF" .... "WEBP")
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return 'image/webp';
  }
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) return 'application/pdf'; // "%PDF-"
  if (isSafeSvg(bytes)) return 'image/svg+xml';
  return null;
}
