'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageCropperModal } from './ImageCropperModal';

export type UploadEntityType = 'startup' | 'partner' | 'article' | 'event';

interface FileUploadFieldProps {
  label: string;
  name: string; // champ du formulaire qui porte l'URL finale (logoUrl, coverImageUrl, imageUrl)
  entityType: UploadEntityType;
  defaultValue?: string | null;
  // Ratio largeur/hauteur imposé avant l'envoi (ex: 16/9) — CDC V2 §8.2.3
  // ("Upload de l'image de couverture avec recadrage"). Non défini = pas de recadrage.
  cropAspect?: number;
}

// CDC V2 §5.5 — mêmes règles que la validation serveur (src/app/api/admin/upload),
// dupliquées ici uniquement pour un retour immédiat côté client.
const RULES: Record<UploadEntityType, { maxMb: number; accept: string; formats: string }> = {
  startup: {
    maxMb: 2,
    accept: 'image/jpeg,image/png,image/webp,image/svg+xml',
    formats: 'JPG, PNG, WEBP, SVG',
  },
  partner: {
    maxMb: 2,
    accept: 'image/jpeg,image/png,image/webp,image/svg+xml',
    formats: 'JPG, PNG, WEBP, SVG',
  },
  article: { maxMb: 5, accept: 'image/jpeg,image/png,image/webp', formats: 'JPG, PNG, WEBP' },
  event: { maxMb: 5, accept: 'image/jpeg,image/png,image/webp', formats: 'JPG, PNG, WEBP' },
};

export function FileUploadField({
  label,
  name,
  entityType,
  defaultValue,
  cropAspect,
}: FileUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const rule = RULES[entityType];

  async function uploadFile(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? "Échec de l'envoi du fichier.");
        return;
      }
      setUrl(json.url);
    } catch {
      setError("Erreur réseau pendant l'envoi du fichier.");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError(null);

    if (file.size > rule.maxMb * 1024 * 1024) {
      setError(`Fichier trop volumineux (max ${rule.maxMb} Mo).`);
      return;
    }

    // Le SVG n'a pas de dimensions raster à recadrer — envoi direct.
    if (cropAspect && file.type !== 'image/svg+xml') {
      setPendingFile(file);
      return;
    }

    void uploadFile(file);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-cauris-gray-text">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="mb-2 flex items-center gap-3">
          <Image
            src={url}
            alt=""
            width={64}
            height={64}
            unoptimized
            className="h-16 w-16 rounded border border-gray-200 object-cover"
          />
          <button
            type="button"
            onClick={() => setUrl('')}
            className="text-xs text-red-600 hover:underline"
          >
            Retirer
          </button>
        </div>
      )}

      <input
        type="file"
        accept={rule.accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-cauris-gray-text file:mr-3 file:rounded-md file:border-0 file:bg-cauris-orange/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-cauris-orange hover:file:bg-cauris-orange/20"
      />
      <p className="mt-1 text-xs text-cauris-gray-secondary">
        {rule.formats}, max {rule.maxMb} Mo.
      </p>
      {uploading && <p className="mt-1 text-xs text-cauris-orange">Envoi en cours…</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}

      {pendingFile && cropAspect && (
        <ImageCropperModal
          file={pendingFile}
          aspect={cropAspect}
          onCancel={() => setPendingFile(null)}
          onConfirm={(cropped) => {
            setPendingFile(null);
            void uploadFile(cropped);
          }}
        />
      )}
    </div>
  );
}
