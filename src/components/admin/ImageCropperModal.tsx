'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperModalProps {
  file: File;
  aspect: number;
  onCancel: () => void;
  onConfirm: (croppedFile: File) => void;
}

function centeredCropForAspect(width: number, height: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
    width,
    height
  );
}

// Découpe la zone sélectionnée dans un <canvas> puis la ré-encode au format
// d'origine du fichier (JPG/PNG/WEBP restent supportés par la route d'upload).
async function cropToFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
  mimeType: string
): Promise<File> {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(crop.width * scaleX);
  canvas.height = Math.round(crop.height * scaleY);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Contexte canvas indisponible.');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mimeType, 0.92)
  );
  if (!blob) throw new Error("Échec de génération de l'image recadrée.");

  return new File([blob], fileName, { type: mimeType });
}

/**
 * Modale de recadrage d'image (CDC V2 §8.2.3 — "Upload de l'image de
 * couverture avec recadrage"). Le fichier recadré remplace le fichier
 * original avant l'envoi à /api/admin/upload : la validation serveur
 * (taille, format) s'applique donc au résultat final, pas à l'original.
 */
export function ImageCropperModal({ file, aspect, onCancel, onConfirm }: ImageCropperModalProps) {
  const [imgSrc] = useState(() => URL.createObjectURL(file));
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centeredCropForAspect(width, height, aspect));
    },
    [aspect]
  );

  async function handleConfirm() {
    if (!imgRef.current || !completedCrop || completedCrop.width === 0) return;
    setBusy(true);
    try {
      const cropped = await cropToFile(imgRef.current, completedCrop, file.name, file.type);
      URL.revokeObjectURL(imgSrc);
      onConfirm(cropped);
    } finally {
      setBusy(false);
    }
  }

  function handleCancel() {
    URL.revokeObjectURL(imgSrc);
    onCancel();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-5 shadow-xl">
        <h2 className="mb-3 font-montserrat text-sm font-bold text-cauris-black">
          Recadrer l&apos;image
        </h2>

        <div className="max-h-[60vh] overflow-auto rounded-md bg-gray-50">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            className="mx-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- source d'un blob local, next/image ne s'applique pas ici */}
            <img ref={imgRef} src={imgSrc} alt="" onLoad={onImageLoad} className="max-h-[60vh]" />
          </ReactCrop>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={busy}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-cauris-gray-text hover:bg-gray-50 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy || !completedCrop?.width}
            className="rounded-md bg-cauris-orange px-4 py-2 text-sm font-semibold text-white hover:bg-cauris-orange-dark disabled:opacity-50"
          >
            {busy ? 'Traitement…' : 'Valider le recadrage'}
          </button>
        </div>
      </div>
    </div>
  );
}
